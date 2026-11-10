import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import QrCards from "./QrCards";
import { site } from "@/data/site";
import { logoGold } from "@/data/images";

export const metadata: Metadata = {
  title: "Printable QR Codes",
  description: "Printable QR codes for the La Bonne Crêpe website and menu.",
  robots: { index: false, follow: false },
};

/** Base URL is read from the environment only; nothing is hard-coded here. */
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/+$/, "");

export default function QrPage() {
  return (
    <div className="bg-marble-texture min-h-screen text-ink">
      <header className="border-b border-gold/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3" aria-label={`${site.name}, back to the website`}>
            <Image src={logoGold.src} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-contain" />
            <span className="font-display text-lg leading-none font-medium tracking-tight text-charcoal">
              La Bonne Crêpe
              <span className="block text-[0.6rem] tracking-[0.24em] text-gold-deep uppercase">de France</span>
            </span>
          </Link>
          <Link
            href="/"
            className="print:hidden text-sm font-medium tracking-wide text-gold-deep transition-colors hover:text-charcoal"
          >
            Back to the website
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow mb-4">
            <span className="fr" lang="fr">
              Codes QR
            </span>
            <span aria-hidden="true"> · </span>
            Print Kit
          </p>
          <h1 className="font-display text-4xl leading-tight font-medium tracking-tight text-charcoal md:text-5xl">
            Two codes, <span className="text-gold-deep italic">ready to print</span>
          </h1>
          <p className="mt-5 leading-relaxed text-ink/70">
            One for the shop window and flyers that opens the website, one for tables and
            counters that opens the menu. Download the PNG for print shops and social
            posts, or the SVG for designers and vinyl cutters.
          </p>
        </div>

        <QrCards baseUrl={BASE_URL} />

        <p className="print:hidden mx-auto mt-12 max-w-2xl rounded-lg border border-gold/25 bg-cream/70 px-5 py-4 text-center text-sm leading-relaxed text-ink/65">
          <span className="font-semibold text-gold-deep">Before printing:</span> both codes encode
          the domain configured in <code className="rounded bg-marble-grey px-1.5 py-0.5 text-[0.8em] text-charcoal">NEXT_PUBLIC_SITE_URL</code> at
          build time. They only work once the site is live on its final, stable domain and
          this page has been rebuilt with that value.
        </p>
      </main>
    </div>
  );
}
