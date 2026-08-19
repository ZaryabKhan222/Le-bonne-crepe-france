import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { site } from "@/data/site";

export const runtime = "nodejs";

/**
 * Minimal in-memory rate limiting: 5 submissions per IP per hour.
 * Serverless instances reset this map on cold start, which is fine for a
 * marketing site; it stops casual abuse without any infrastructure.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const submissions = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    submissions.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages from this connection. Please try again in an hour." },
      { status: 429 }
    );
  }

  let parsed;
  try {
    parsed = contactSchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Honeypot tripped: pretend success so bots learn nothing.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form is not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL.");
    return NextResponse.json(
      { error: "The contact form is not available right now. Please reach us on WhatsApp." },
      { status: 500 }
    );
  }

  // TODO(client): once the sending domain is verified in Resend, set
  // RESEND_FROM_EMAIL to e.g. "La Bonne Crêpe <contact@yourdomain.com>".
  const from = process.env.RESEND_FROM_EMAIL ?? "La Bonne Crêpe Website <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `[Website] ${data.subject}: ${data.name}`,
    html: `
      <h2 style="font-family:Georgia,serif;color:#1A1A1A;">New inquiry from ${escapeHtml(site.name)}</h2>
      <table style="font-family:sans-serif;font-size:14px;color:#2C2C2C;border-collapse:collapse;">
        <tr><td style="padding:6px 16px 6px 0;color:#A07C2C;">Name</td><td>${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#A07C2C;">Email</td><td>${escapeHtml(data.email)}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#A07C2C;">Phone</td><td>${escapeHtml(data.phone || "Not provided")}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#A07C2C;">Subject</td><td>${escapeHtml(data.subject)}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:14px;color:#2C2C2C;white-space:pre-wrap;border-left:3px solid #C9A34E;padding-left:12px;margin-top:16px;">${escapeHtml(data.message)}</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Your message could not be sent. Please try again or use WhatsApp." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
