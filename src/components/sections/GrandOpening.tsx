"use client";

import { useSyncExternalStore } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldRule from "@/components/ui/GoldRule";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { grandOpening, site } from "@/data/site";

const OPENING = new Date(grandOpening.startDate).getTime();

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

const TICK = 30_000;
const subscribeTick = (onChange: () => void) => {
  const id = window.setInterval(onChange, TICK);
  return () => window.clearInterval(id);
};
const nowSnapshot = () => Math.floor(Date.now() / TICK) * TICK;

/** Live countdown; the server renders a placeholder so hydration matches. */
function Countdown() {
  const now = useSyncExternalStore(subscribeTick, nowSnapshot, () => null);

  if (now === null) return <div className="h-20" aria-hidden="true" />;

  const diff = OPENING - now;
  if (diff <= 0) {
    return (
      <p className="font-display text-2xl font-light text-gold-light italic md:text-3xl">
        The doors are open. Come say bonjour.
      </p>
    );
  }

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const parts = [
    { value: days, label: days === 1 ? "day" : "days" },
    { value: hours, label: hours === 1 ? "hour" : "hours" },
    { value: minutes, label: minutes === 1 ? "minute" : "minutes" },
  ];

  return (
    <div
      role="timer"
      aria-label={`${days} days, ${hours} hours and ${minutes} minutes until the grand opening`}
      className="flex items-start justify-center gap-6 sm:gap-10"
    >
      {parts.map((p) => (
        <div key={p.label} className="text-center">
          <span className="font-display block text-4xl font-light tabular-nums text-cream md:text-6xl">
            {pad(p.value)}
          </span>
          <span className="mt-1 block text-[0.65rem] tracking-[0.28em] text-gold-light/80 uppercase">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const calendarHref = (() => {
  const start = new Date(grandOpening.startDate);
  const end = new Date(start.getTime() + 5 * 3_600_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${site.name} Grand Opening`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `${grandOpening.intro} ${grandOpening.tagline} ${site.url}`,
    location: `${site.name}, ${site.areaServed}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
})();

export default function GrandOpening() {
  return (
    <section
      id="grand-opening"
      aria-labelledby="opening-heading"
      className="bg-charcoal-texture section-anchor relative overflow-hidden px-6 py-24 md:py-32"
    >
      {/* Gold glow behind the date */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,163,78,0.16),transparent)]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow fr="Ouverture officielle" en="Grand Opening" className="mb-6" />
          <h2
            id="opening-heading"
            className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] font-medium tracking-tight text-cream"
          >
            Saturday, September 19th
            <span className="mt-2 block text-[clamp(1.4rem,3.6vw,2.5rem)] font-light text-gold-light italic">
              from 5 PM
            </span>
          </h2>
          <GoldRule className="mx-auto mt-8 max-w-32" />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Countdown />
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-cream/85 md:text-xl">
            {grandOpening.intro}
          </p>
          <p className="font-display mt-6 text-2xl font-light text-gold-light italic md:text-3xl">
            {grandOpening.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href={calendarHref} target="_blank" rel="noopener noreferrer">
            Add to Calendar
          </Button>
          <Button href="#menu" variant="ghost-light">
            See the Menu
          </Button>
          <Button href={site.socials.instagram} variant="ghost-light" target="_blank" rel="noopener noreferrer">
            Follow on Instagram
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
