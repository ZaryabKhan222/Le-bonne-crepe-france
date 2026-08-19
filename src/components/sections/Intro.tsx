"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Eyebrow from "@/components/ui/Eyebrow";

const statement =
  "Recovery is not a trend here. It is a discipline learned in the French special forces, refined in the ring, and served from a cast iron griddle.";

export default function Intro() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".intro-word",
        { opacity: 0.12, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.045,
          ease: "power2.out",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 72%",
            end: "top 30%",
            scrub: 0.6,
          },
        }
      );
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      id="intro"
      aria-label="Brand statement"
      className="bg-marble-texture px-6 py-28 md:py-40"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow fr="La maison" en="The Recovery Lounge" className="mb-8" />
        <p className="font-display text-[clamp(1.6rem,4.2vw,2.75rem)] leading-snug font-light text-charcoal">
          {statement.split(" ").map((word, i) => (
            <span key={i} className="intro-word inline-block whitespace-pre">
              {word}{" "}
            </span>
          ))}
        </p>
        <p className="mt-8 text-sm font-medium tracking-[0.22em] text-gold-deep uppercase">
          Healthy French Specialities and Natural Drinks
        </p>
      </div>
    </section>
  );
}
