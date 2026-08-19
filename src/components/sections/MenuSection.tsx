"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import GoldRule from "@/components/ui/GoldRule";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { menu, type MenuItem } from "@/data/menu";

function Price({ price }: { price: MenuItem["price"] }) {
  if (price === null) {
    return <span className="text-sm font-medium tracking-wide text-gold-deep/80 italic">ask</span>;
  }
  return (
    <span className="font-display text-lg font-medium text-charcoal">
      <span className="mr-0.5 text-xs text-gold-deep align-top">$</span>
      {price}
    </span>
  );
}

export default function MenuSection() {
  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="bg-marble-texture-grey scroll-mt-20 px-6 py-24 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Eyebrow fr="La carte" en="The Menu" className="mb-4" />
            <h2
              id="menu-heading"
              className="font-display text-4xl leading-tight font-medium tracking-tight text-charcoal md:text-5xl"
            >
              From the griddle and the juice press
            </h2>
            <GoldRule className="mt-6 max-w-24" />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Button href="/MENU-FIN.pdf" variant="outline" target="_blank" rel="noopener noreferrer">
              Download Menu (PDF)
            </Button>
            <p className="text-xs text-ink/50">
              The printed menu is the source of truth. Prices may change with the season.
            </p>
          </div>
        </div>

        <div className="columns-1 gap-8 md:columns-2">
          {menu.map((category, ci) => (
            <Reveal
              key={category.id}
              delay={Math.min(ci * 0.04, 0.2)}
              className="mb-8 break-inside-avoid"
            >
              <div className="rounded-lg border border-gold/15 bg-cream p-7 shadow-[0_1px_2px_rgba(26,26,26,0.04)] md:p-9">
                <h3 className="font-display text-2xl font-medium tracking-tight text-charcoal">
                  {category.title}
                </h3>
                <div
                  aria-hidden="true"
                  className="mt-3 mb-1 h-px w-14 bg-gradient-to-r from-gold-deep to-gold-light"
                />
                {category.note && (
                  <p className="mt-2 text-[0.8rem] leading-relaxed text-ink/55 italic">
                    {category.note}
                  </p>
                )}
                <ul className="mt-5">
                  {category.items.map((item) => (
                    <li
                      key={item.name}
                      className="group -mx-3 rounded-md px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-marble/70"
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
                        <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-ink/60">
                          {item.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
