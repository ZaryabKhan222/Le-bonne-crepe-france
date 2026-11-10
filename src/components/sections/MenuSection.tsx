"use client";

import { useState } from "react";
import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldRule from "@/components/ui/GoldRule";
import Reveal from "@/components/ui/Reveal";
import Lightbox from "@/components/ui/Lightbox";
import { visibleFoodMenu, visibleDrinkMenu, milkNote, type MenuCategory, type MenuItem } from "@/data/menu";
import { menuBoardPhotos, foodMenuImage, drinkMenuImage } from "@/data/images";

/** "$12" renders with a small gold dollar sign; any other string ("MP") as is. */
function Price({ price }: { price: MenuItem["price"] }) {
  const money = /^\$\s?(.+)$/.exec(price.trim());
  if (!money) {
    return <span className="text-sm font-medium tracking-wide text-gold-deep/80 italic">{price}</span>;
  }
  return (
    <span className="font-display text-lg font-medium whitespace-nowrap text-charcoal">
      <span className="mr-0.5 text-xs text-gold-deep align-top">$</span>
      {money[1]}
    </span>
  );
}

function Category({ category, index }: { category: MenuCategory; index: number }) {
  return (
    <Reveal delay={Math.min((index % 3) * 0.08, 0.24)} className="mb-2 break-inside-avoid pb-8">
      <h4 className="font-display text-2xl font-medium tracking-tight text-charcoal md:text-[1.7rem]">
        {category.title}
      </h4>
      {category.subtitle && (
        <p className="mt-1 text-[0.72rem] font-medium tracking-[0.2em] text-gold-deep uppercase">
          {category.subtitle}
        </p>
      )}
      <ul className="mt-5">
        {category.items.map((item) => (
          <li
            key={item.name}
            className="group -mx-3 rounded-md px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream/80"
          >
            <div className="flex items-baseline">
              <span className="relative font-medium text-charcoal">
                {item.name}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full"
                />
              </span>
              <span className="leader" aria-hidden="true" />
              <Price price={item.price} />
            </div>
            {item.description && (
              <p className="mt-1 max-w-[44ch] text-sm leading-relaxed text-ink/60">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
      {/* Gold divider that closes each category, like a rule on the printed board */}
      <div
        aria-hidden="true"
        className="mt-6 h-px w-full bg-gradient-to-r from-gold-deep/70 via-gold/40 to-transparent"
      />
    </Reveal>
  );
}

/** One half of the menu: a sub-heading, then its categories in flowing columns. */
function MenuPart({
  id,
  fr,
  en,
  heading,
  tagline,
  categories,
  onViewBoard,
  boardLabel,
}: {
  id: string;
  fr: string;
  en: string;
  heading: string;
  tagline: string;
  categories: MenuCategory[];
  onViewBoard: () => void;
  boardLabel: string;
}) {
  return (
    <div aria-labelledby={`${id}-heading`}>
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <Eyebrow fr={fr} en={en} className="mb-3" />
          <h3
            id={`${id}-heading`}
            className="font-display text-3xl font-medium tracking-tight text-charcoal md:text-4xl"
          >
            {heading}
          </h3>
          <p className="mt-2 text-sm text-ink/60 italic">{tagline}</p>
        </div>
        <button
          type="button"
          onClick={onViewBoard}
          className="inline-flex items-center gap-2 rounded-full border border-gold-deep/50 px-6 py-2.5 text-xs font-semibold tracking-[0.12em] text-gold-deep uppercase transition-colors duration-300 hover:border-gold-deep hover:bg-gold-deep/5"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M4 10.5l2.8-3 2.2 2.2 1.6-1.6 1.4 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10.5" cy="5.5" r="1" fill="currentColor" />
          </svg>
          {boardLabel}
        </button>
      </Reveal>

      <div className="columns-1 gap-10 md:columns-2 lg:columns-3 lg:gap-12">
        {categories.map((category, i) => (
          <Category key={category.id} category={category} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function MenuSection() {
  // Index into menuBoardPhotos: 0 food, 1 drinks. null closes the lightbox.
  const [board, setBoard] = useState<number | null>(null);

  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="bg-marble-texture-grey section-anchor px-6 py-24 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header: the landing point for the Menu QR code */}
        <div className="mb-14 max-w-2xl md:mb-20">
          <Eyebrow fr="La carte" en="The Menu" className="mb-4" />
          <h2
            id="menu-heading"
            className="font-display text-4xl leading-tight font-medium tracking-tight text-charcoal md:text-5xl"
          >
            Everything we serve, <span className="text-gold-deep italic">food and drinks</span>
          </h2>
          <GoldRule className="mt-6 max-w-24" />
          <p className="mt-6 leading-relaxed text-ink/70">
            Scroll through the full menu: French plates, salads and desserts first, then the
            coffee bar, juices and mocktails. Prices may change with the season.
          </p>
        </div>

        {/* The printed food menu, first thing after the heading: the table QR
            codes open /#menu, so a guest lands right on it after scanning. */}
        <figure className="mb-16 md:mb-24">
          <button
            type="button"
            onClick={() => setBoard(0)}
            aria-label="Enlarge the food menu"
            className="group block w-full overflow-hidden rounded-lg border border-gold/15 shadow-[0_1px_2px_rgba(26,26,26,0.04)]"
          >
            <Image
              src={foodMenuImage.src}
              alt={menuBoardPhotos[0].alt}
              width={foodMenuImage.width}
              height={foodMenuImage.height}
              sizes="(max-width: 1152px) 100vw, 1152px"
              quality={90}
              placeholder="blur"
              blurDataURL={foodMenuImage.blurDataURL}
              className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            />
          </button>
          <figcaption className="mt-3 text-center text-xs text-ink/50">
            Tap the menu to view it full size.
          </figcaption>
        </figure>

        <MenuPart
          id="menu-food"
          fr="À table"
          en="Food"
          heading="Food"
          tagline="French flavors, fresh ingredients, better days"
          categories={visibleFoodMenu}
          onViewBoard={() => setBoard(0)}
          boardLabel="View food menu"
        />

        {/* Divider between the two halves */}
        <div className="my-14 flex items-center gap-5 md:my-20" aria-hidden="true">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold-deep uppercase">
            Drinks
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        <MenuPart
          id="menu-drinks"
          fr="Les boissons"
          en="Drinks"
          heading="Drinks"
          tagline="Great drinks, better days"
          categories={visibleDrinkMenu}
          onViewBoard={() => setBoard(1)}
          boardLabel="View drink menu"
        />

        <Reveal className="mt-8 flex flex-col items-center gap-4 text-center">
          <GoldRule className="max-w-32" />
          <p className="max-w-md text-sm leading-relaxed text-ink/65">
            <span className="font-display mr-2 text-base text-gold-deep italic">Milk</span>
            {milkNote}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a
              href={foodMenuImage.original}
              download="la-bonne-crepe-food-menu.jpg"
              className="text-xs font-medium tracking-[0.18em] text-gold-deep uppercase transition-colors hover:text-charcoal"
            >
              Download food menu
            </a>
            <a
              href={drinkMenuImage.original}
              download="la-bonne-crepe-drink-menu.jpg"
              className="text-xs font-medium tracking-[0.18em] text-gold-deep uppercase transition-colors hover:text-charcoal"
            >
              Download drink menu
            </a>
          </div>
        </Reveal>
      </div>

      <Lightbox
        photos={menuBoardPhotos}
        index={board}
        onClose={() => setBoard(null)}
        onNavigate={setBoard}
      />
    </section>
  );
}
