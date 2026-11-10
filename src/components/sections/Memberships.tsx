"use client";

import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldRule from "@/components/ui/GoldRule";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { photo } from "@/data/images";
import { MEMBERSHIP_URL, membershipsLive, site } from "@/data/site";

const card = photo("loyalty-card");

const askHref = `${site.whatsappHref}?text=${encodeURIComponent(
  "Bonjour! I would like to know more about La Bonne Crêpe memberships."
)}`;

const perks = [
  { title: "Recover", text: "Cold press juices, protein blends and recovery drinks made for training days." },
  { title: "Refuel", text: "Crêpes, waffles, salads and gourmet coffee, fresh every morning." },
  { title: "Reward", text: "Every visit earns a stamp. Your tenth visit is on us: any product on the menu." },
];

export default function Memberships() {
  return (
    <section
      id="memberships"
      aria-labelledby="memberships-heading"
      className="bg-marble-texture-grey section-anchor px-6 py-24 md:py-36"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[5fr_6fr] md:gap-16">
        <Reveal>
          <div className="relative mx-auto max-w-md overflow-hidden rounded-lg shadow-[0_24px_60px_rgba(26,26,26,0.18)] ring-4 ring-cream md:max-w-none">
            <Image
              src={card.src}
              alt={card.alt}
              width={card.width}
              height={card.height}
              sizes="(max-width: 768px) 92vw, 42vw"
              placeholder="blur"
              blurDataURL={card.blurDataURL}
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
        </Reveal>

        <div>
          <Eyebrow fr="Fidélité" en="Memberships" className="mb-4" />
          <h2
            id="memberships-heading"
            className="font-display text-4xl leading-tight font-medium tracking-tight text-charcoal md:text-5xl"
          >
            Recover. Refuel. <span className="text-gold-deep italic">Reward.</span>
          </h2>
          <GoldRule className="mt-6 mb-8 max-w-24" />

          <p className="max-w-lg leading-relaxed text-ink/80">
            Ask for your loyalty card at the counter. Each visit gets a stamp, and
            after nine visits the tenth is our treat: the product of your choice on
            the menu. Memberships are handled through Square, so you can join in a
            minute and keep your card on your phone.
          </p>

          <ul className="mt-8 space-y-5">
            {perks.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="mt-2 block h-px w-8 shrink-0 bg-gradient-to-r from-gold-deep to-gold-light"
                />
                <div>
                  <h3 className="font-display text-xl font-medium text-charcoal">{p.title}</h3>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-ink/65">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {membershipsLive ? (
              <Button href={MEMBERSHIP_URL} target="_blank" rel="noopener noreferrer">
                Join Memberships
              </Button>
            ) : (
              // TODO(client): the Square link is not set yet (see MEMBERSHIP_URL in
              // src/data/site.ts). Until then the button opens a WhatsApp chat.
              <Button href={askHref} target="_blank" rel="noopener noreferrer">
                Ask About Memberships
              </Button>
            )}
            <span className="text-sm text-ink/55">Sign-up takes a minute.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
