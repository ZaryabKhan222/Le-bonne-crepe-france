"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldRule from "@/components/ui/GoldRule";
import Reveal from "@/components/ui/Reveal";
import { photo } from "@/data/images";

const portrait = photo("romain-flip");
const detail = photo("romain-sauce");

export default function Story() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Slow parallax on the portrait as the section scrolls through.
      gsap.fromTo(
        ".story-portrait img",
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: ".story-portrait",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      id="story"
      aria-labelledby="story-heading"
      className="scroll-mt-20 bg-cream px-6 py-24 md:py-36"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20">
        {/* Portrait column */}
        <div className="relative">
          <div className="story-portrait relative aspect-[3/4] overflow-hidden rounded-t-[10rem] rounded-b-lg">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              sizes="(max-width: 768px) 92vw, 44vw"
              placeholder="blur"
              blurDataURL={portrait.blurDataURL}
              className="scale-[1.08] object-cover object-[50%_18%]"
            />
          </div>
          {/* Small overlapping detail shot, like a photo laid on a table */}
          <Reveal
            as="figure"
            className="absolute -right-3 -bottom-10 hidden w-40 rotate-3 overflow-hidden rounded-md shadow-[0_18px_40px_rgba(26,26,26,0.25)] ring-4 ring-cream lg:block"
          >
            <Image
              src={detail.src}
              alt={detail.alt}
              width={320}
              height={480}
              placeholder="blur"
              blurDataURL={detail.blurDataURL}
              className="object-cover"
            />
          </Reveal>
        </div>

        {/* Story column */}
        <div>
          <Eyebrow fr="Notre histoire" en="Meet Romain & Karen" className="mb-4" />
          <h2
            id="story-heading"
            className="font-display text-4xl leading-tight font-medium tracking-tight text-charcoal md:text-5xl"
          >
            Forged in service, <span className="text-gold-deep italic">finished in butter</span>
          </h2>
          <GoldRule className="mt-6 mb-8 max-w-24" />

          <div className="space-y-5 leading-relaxed text-ink/85">
            <p>
              Romain Courcier has lived three lives. A veteran of the French special
              forces. A professional fighter and combat sports trainer. And a chef,
              trained at one of the biggest culinary universities in France, with more
              than ten years in the restaurant industry.
            </p>
            <p>
              Each life taught the same lesson: what you put back into the body decides
              what you can ask of it. That is the idea behind La Bonne Crêpe de France,
              founded with Karen Courcier. It started at Miami&apos;s farmers markets and
              private events, and now has a home of its own: a newly opened restaurant
              in Miami.
            </p>
            <p>
              The Recovery Lounge is where his two worlds meet: French technique and
              fighter&apos;s discipline. Breakfasts that set up the day, waffles and
              toasted croissants, fresh salads and French cheese boards, handcrafted
              desserts, cold press juices built for training days, and coffee worth
              slowing down for.
            </p>
          </div>

          <blockquote className="mt-10 border-l-2 border-gold pl-6">
            <p className="font-display text-xl leading-relaxed font-light text-charcoal italic md:text-2xl">
              &ldquo;In the forces you learn recovery is not rest. It is fuel, chosen
              with intention. I cook the way I trained: nothing wasted, everything
              earned.&rdquo;
            </p>
            <footer className="mt-4 text-sm font-semibold tracking-[0.18em] text-gold-deep uppercase">
              Romain Courcier, Founder
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
