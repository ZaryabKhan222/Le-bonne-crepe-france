"use client";

import { useState } from "react";
import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldRule from "@/components/ui/GoldRule";
import Reveal from "@/components/ui/Reveal";
import Lightbox from "@/components/ui/Lightbox";
import { galleryPhotos, type PhotoCategory } from "@/data/images";

const filters: { id: "all" | PhotoCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cafe", label: "The Café" },
  { id: "plates", label: "Plates" },
  { id: "crepes", label: "Crêpes" },
  { id: "waffles", label: "Waffles" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
  { id: "behind", label: "Behind the Scenes" },
];

/** The drinks lineup anchors the grid at double size. */
const FEATURED = "drinks-lineup";

export default function Gallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = galleryPhotos.filter((p) => filter === "all" || p.category === filter);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-marble-texture section-anchor px-6 py-24 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-xl">
          <Eyebrow fr="En images" en="Gallery" className="mb-4" />
          <h2
            id="gallery-heading"
            className="font-display text-4xl leading-tight font-medium tracking-tight text-charcoal md:text-5xl"
          >
            The café, the counter, the plates
          </h2>
          <GoldRule className="mt-6 max-w-24" />
        </div>

        <div role="group" aria-label="Filter gallery" className="mb-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilter(f.id);
                setLightboxIndex(null);
              }}
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

        <ul className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {visible.map((p, i) => {
            const featured = p.id === FEATURED;
            return (
              <Reveal
                as="li"
                key={p.id}
                delay={Math.min((i % 8) * 0.06, 0.4)}
                className={featured ? "col-span-2 row-span-2" : ""}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`View larger: ${p.alt}`}
                  className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-marble-grey"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes={
                      featured
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 50vw, 25vw"
                    }
                    placeholder="blur"
                    blurDataURL={p.blurDataURL}
                    loading="lazy"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-charcoal/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </button>
              </Reveal>
            );
          })}
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
