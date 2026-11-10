"use client";

import { useState } from "react";
import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldRule from "@/components/ui/GoldRule";
import Reveal from "@/components/ui/Reveal";
import Lightbox from "@/components/ui/Lightbox";
import { signaturePhotos } from "@/data/images";

const titles: Record<string, string> = {
  "signature-strawberry-biscoff-latte": "Strawberry Biscoff Latte",
  "signature-gravlax-bagel": "Gravlax Bagel",
};

/**
 * Two deconstructed, pre-labeled images. No text is overlaid: the ingredient
 * labels are part of the artwork, served at full resolution and enlargeable so
 * they stay readable on a phone.
 */
export default function SignatureCreations() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section
      id="signature"
      aria-labelledby="signature-heading"
      className="bg-marble-texture section-anchor px-4 py-24 sm:px-6 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <Eyebrow fr="Nos créations" en="Signature Creations" className="mb-4" />
          <h2
            id="signature-heading"
            className="font-display text-4xl leading-tight font-medium tracking-tight text-charcoal md:text-5xl"
          >
            Built <span className="text-gold-deep italic">layer by layer</span>
          </h2>
          <GoldRule className="mx-auto mt-6 max-w-24" />
          <p className="mt-6 leading-relaxed text-ink/70">
            Two house signatures, taken apart so you can see every ingredient.
            Tap an image to enlarge it and read the labels.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
          {signaturePhotos.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.12}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Enlarge: ${titles[p.id] ?? p.alt}`}
                className="group relative block w-full overflow-hidden rounded-lg bg-marble-grey shadow-[0_18px_50px_rgba(26,26,26,0.12)] ring-1 ring-gold/20"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                  placeholder="blur"
                  blurDataURL={p.blurDataURL}
                  loading="lazy"
                  className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                />
                <span className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2 rounded-full bg-charcoal/70 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.18em] text-cream uppercase backdrop-blur-sm transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 6V2h4M14 10v4h-4M14 2l-4.5 4.5M2 14l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Enlarge
                </span>
              </button>
              <p className="mt-3 text-center text-sm font-medium tracking-[0.18em] text-gold-deep uppercase">
                {titles[p.id]}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>

      <Lightbox
        photos={signaturePhotos}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </section>
  );
}
