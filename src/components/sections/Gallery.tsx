"use client";

import { useState } from "react";
import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldRule from "@/components/ui/GoldRule";
import Reveal from "@/components/ui/Reveal";
import Lightbox from "@/components/ui/Lightbox";
import { galleryPhotos } from "@/data/images";

const filters = [
  { id: "all", label: "All" },
  { id: "savory", label: "Savory" },
  { id: "crepes", label: "Crêpes" },
  { id: "waffles", label: "Waffles" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
  { id: "behind", label: "Behind the Scenes" },
] as const;

export default function Gallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = galleryPhotos.filter((p) => filter === "all" || p.category === filter);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-marble-texture scroll-mt-20 px-6 py-24 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-xl">
          <Eyebrow fr="En images" en="Gallery" className="mb-4" />
          <h2
            id="gallery-heading"
            className="font-display text-4xl leading-tight font-medium tracking-tight text-charcoal md:text-5xl"
          >
            Plates worth the market queue
          </h2>
          <GoldRule className="mt-6 max-w-24" />
        </div>

        <div role="group" aria-label="Filter gallery" className="mb-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                filter === f.id
                  ? "border-gold-deep bg-gold-deep text-cream"
                  : "border-ink/15 text-ink/70 hover:border-gold-deep/50 hover:text-gold-deep"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ul className="columns-2 gap-4 lg:columns-3">
          {visible.map((p, i) => (
            <Reveal as="li" key={p.id} delay={Math.min(i * 0.05, 0.3)} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`View larger: ${p.alt}`}
                className="group block w-full overflow-hidden rounded-lg"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(max-width: 768px) 46vw, 30vw"
                  placeholder="blur"
                  blurDataURL={p.blurDataURL}
                  loading="lazy"
                  className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <Lightbox
        photos={visible}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
