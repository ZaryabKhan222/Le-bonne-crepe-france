"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldRule from "@/components/ui/GoldRule";
import { contactSchema, contactSubjects, type ContactInput } from "@/lib/contact-schema";
import { site } from "@/data/site";

type Status = { state: "idle" } | { state: "success" } | { state: "error"; message: string };

const inputClass =
  "w-full rounded-md border border-ink/15 bg-cream px-4 py-3 text-ink placeholder:text-ink/35 transition-colors focus:border-gold-deep focus:outline-none focus:ring-2 focus:ring-gold/30";

export default function Contact() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: "General", company: "" },
  });

  // CTAs elsewhere on the page (e.g. "Inquire About Catering") preset the subject.
  useEffect(() => {
    const onPreset = (e: Event) => {
      const subject = (e as CustomEvent<string>).detail;
      if ((contactSubjects as readonly string[]).includes(subject)) {
        setValue("subject", subject as ContactInput["subject"]);
      }
    };
    window.addEventListener("lbc:preset-subject", onPreset);
    return () => window.removeEventListener("lbc:preset-subject", onPreset);
  }, [setValue]);

  const onSubmit = async (data: ContactInput) => {
    setStatus({ state: "idle" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setStatus({ state: "success" });
      reset();
    } catch (err) {
      setStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-marble-texture scroll-mt-20 px-6 py-24 pb-32 md:py-36 md:pb-36"
    >
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1fr_1.3fr] md:gap-20">
        {/* Direct options */}
        <div>
          <Eyebrow fr="Écrivez-nous" en="Contact" className="mb-4" />
          <h2
            id="contact-heading"
            className="font-display text-4xl leading-tight font-medium tracking-tight text-charcoal md:text-5xl"
          >
            Plan an event, ask a question, say bonjour
          </h2>
          <GoldRule className="mt-6 mb-8 max-w-24" />
          <p className="max-w-md leading-relaxed text-ink/75">
            For catering dates, tell us the date, guest count and location, and we
            will reply with a menu and a quote.
          </p>

          <ul className="mt-10 space-y-4">
            <li>
              <a
                href={site.phoneHref}
                className="group flex items-center gap-4 text-charcoal transition-colors hover:text-gold-deep"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold-deep transition-colors group-hover:bg-gold group-hover:text-charcoal">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="font-medium">{site.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 text-charcoal transition-colors hover:text-gold-deep"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold-deep transition-colors group-hover:bg-gold group-hover:text-charcoal">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.4.1-.6l.4-.5c.1-.2.1-.3.2-.5s0-.4 0-.5-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4.1 15.5 15.5 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.8 2.8 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
                  </svg>
                </span>
                <span className="font-medium">WhatsApp</span>
              </a>
            </li>
            <li>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 text-charcoal transition-colors hover:text-gold-deep"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold-deep transition-colors group-hover:bg-gold group-hover:text-charcoal">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
                  </svg>
                </span>
                <span className="font-medium">Instagram</span>
              </a>
            </li>
            <li>
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 text-charcoal transition-colors hover:text-gold-deep"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold-deep transition-colors group-hover:bg-gold group-hover:text-charcoal">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.5-1.5h1.4V4.9c-.3 0-1.1-.1-2-.1a3.4 3.4 0 0 0-3.7 3.8V11H8.3v3h2.4v7Z" />
                  </svg>
                </span>
                <span className="font-medium">Facebook</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-charcoal">
                Name
              </label>
              <input
                id="name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={inputClass}
                placeholder="Your name"
                {...register("name")}
              />
              {errors.name && (
                <p id="name-error" role="alert" className="mt-1.5 text-sm text-red-700">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClass}
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1.5 text-sm text-red-700">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-charcoal">
                Phone <span className="font-normal text-ink/45">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={inputClass}
                placeholder="305 555 0100"
                {...register("phone")}
              />
              {errors.phone && (
                <p id="phone-error" role="alert" className="mt-1.5 text-sm text-red-700">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-charcoal">
                Subject
              </label>
              <select id="subject" className={inputClass} {...register("subject")}>
                {contactSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-charcoal">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`${inputClass} resize-y`}
              placeholder="Date, guest count, location, or anything else we should know"
              {...register("message")}
            />
            {errors.message && (
              <p id="message-error" role="alert" className="mt-1.5 text-sm text-red-700">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Honeypot: hidden from humans, tempting for bots */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-charcoal uppercase shadow-[0_1px_14px_rgba(201,163,78,0.35)] transition-colors duration-300 hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "Sending…" : "Send Message"}
          </button>

          <div aria-live="polite">
            <AnimatePresence>
              {status.state === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-md border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-medium text-gold-deep"
                >
                  Merci! Your message is on its way. We usually reply within a day.
                </motion.p>
              )}
              {status.state === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
                >
                  {status.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </section>
  );
}
