"use client";

import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { photo } from "@/data/images";

const cart = photo("cart-counter");
const drink = photo("matcha-drink-cart");
const action = photo("romain-pour");

/** Lets any CTA preset the contact form's subject before scrolling to it. */
export function presetContactSubject(subject: string) {
  window.dispatchEvent(new CustomEvent("lbc:preset-subject", { detail: subject }));
}

const features = [
  {
    title: "The Gourmet Cart",
    text: "A handcrafted wood cart with neon signature, house syrups, and a full espresso and matcha bar. It arrives styled and ready to photograph.",
  },
  {
    title: "Crêpes made in front of your guests",
    text: "Batter mixed the same morning, spread and turned on cast iron. The show is part of the service.",
  },
  {
    title: "Menus built around your event",
    text: "Sweet, savory, or both, with natural drinks and protein blends for wellness events, brand launches, weddings and private parties.",
  },
];

export default function Catering() {
  return (
    <section
      id="catering"
      aria-labelledby="catering-heading"
      className="bg-charcoal-texture scroll-mt-20 px-6 py-24 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <Eyebrow fr="Événements privés" en="Catering" className="mb-4" />
            <h2
              id="catering-heading"
              className="font-display text-4xl leading-tight font-medium tracking-tight text-cream md:text-5xl"
            >
              The Gourmet Cart, <span className="text-gold-light italic">at your event</span>
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-cream/75">
              La Bonne Crêpe&apos;s high value service: a full French crêperie that
              travels. Miami hosts book the cart for weddings, corporate events, and
              private parties across the area.
            </p>

            <ul className="mt-10 space-y-7">
              {features.map((f, i) => (
                <Reveal as="li" key={f.title} delay={i * 0.08} className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 block h-px w-8 shrink-0 bg-gradient-to-r from-gold to-gold-light"
                  />
                  <div>
                    <h3 className="font-display text-xl font-medium text-gold-light">{f.title}</h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-cream/70">{f.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <div className="mt-12">
              <a
                href="#contact"
                onClick={() => presetContactSubject("Catering Inquiry")}
                className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-semibold tracking-wide text-charcoal uppercase shadow-[0_1px_18px_rgba(201,163,78,0.4)] transition-colors duration-300 hover:bg-gold-light"
              >
                Inquire About Catering
              </a>
            </div>
          </div>

          {/* Photo collage */}
          <div className="grid grid-cols-2 gap-4">
            <Reveal className="col-span-2">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                <Image
                  src={cart.src}
                  alt={cart.alt}
                  fill
                  sizes="(max-width: 768px) 92vw, 44vw"
                  placeholder="blur"
                  blurDataURL={cart.blurDataURL}
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src={drink.src}
                  alt={drink.alt}
                  fill
                  sizes="(max-width: 768px) 46vw, 21vw"
                  placeholder="blur"
                  blurDataURL={drink.blurDataURL}
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src={action.src}
                  alt={action.alt}
                  fill
                  sizes="(max-width: 768px) 46vw, 21vw"
                  placeholder="blur"
                  blurDataURL={action.blurDataURL}
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
