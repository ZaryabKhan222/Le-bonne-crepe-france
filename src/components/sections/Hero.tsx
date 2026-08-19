"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import { heroDesktop, heroMobile } from "@/data/images";
import { site } from "@/data/site";

// The Three.js bundle never blocks first paint: it lazy-loads after hydration
// and is skipped entirely for reduced motion or low-power devices.
const GoldParticles = dynamic(() => import("@/components/three/GoldParticles"), {
  ssr: false,
});

const MOBILE_QUERY = "(max-width: 767px)";

let lowPowerCache: boolean | null = null;
function isLowPower(): boolean {
  if (lowPowerCache === null) {
    type NavigatorWithMemory = Navigator & { deviceMemory?: number };
    lowPowerCache =
      ((navigator as NavigatorWithMemory).deviceMemory ?? 8) <= 2 ||
      (navigator.hardwareConcurrency ?? 8) <= 2;
  }
  return lowPowerCache;
}

function useHeroCapabilities() {
  const reduced = useReducedMotion();

  const subscribeToViewport = useCallback((onChange: () => void) => {
    const mq = window.matchMedia(MOBILE_QUERY);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const isMobile = useSyncExternalStore(
    subscribeToViewport,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  );

  // Server renders the CSS shimmer fallback; capable clients upgrade to 3D
  // right after hydration.
  const capable = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => !isLowPower(),
    () => false
  );

  return { reduced: !!reduced, isMobile, enable3D: capable && !reduced };
}

export default function Hero() {
  const { reduced, isMobile, enable3D } = useHeroCapabilities();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  // Pause the render loop whenever the hero leaves the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Welcome"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-charcoal"
    >
      {/* Cinematic photograph: the crêpe on the griddle at golden hour */}
      <div className="absolute inset-0">
        <Image
          src={isMobile ? heroMobile.src : heroDesktop.src}
          alt="A golden crêpe being turned by hand on the cast iron griddle at a Miami farmers market"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={isMobile ? heroMobile.blurDataURL : heroDesktop.blurDataURL}
          className="object-cover"
        />
        {/* Legibility gradients, not a flat scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-transparent to-transparent" />
      </div>

      {/* Gold bokeh: 3D when the device can afford it, CSS shimmer otherwise */}
      {enable3D ? (
        <div className="absolute inset-0" aria-hidden="true">
          <GoldParticles active={inView} isMobile={isMobile} />
        </div>
      ) : (
        <div className="hero-shimmer absolute inset-0" aria-hidden="true" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-36 pb-24 sm:px-10 md:pb-28">
        <motion.p {...fadeUp(0.1)} className="eyebrow mb-5">
          <span className="fr" lang="fr">
            Fait main à Miami
          </span>
          <span aria-hidden="true"> · </span>
          Healthy French Specialities and Natural Drinks
        </motion.p>

        <motion.h1
          {...fadeUp(0.25)}
          className="font-display max-w-4xl text-[clamp(2.75rem,9vw,6rem)] leading-[1.02] font-medium tracking-tight text-cream"
        >
          La Bonne Crêpe
          <span className="block text-[clamp(1.9rem,6vw,4rem)] font-light text-gold-light italic">
            de France
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.4)}
          className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85 md:text-xl"
        >
          The first real recovery lounge in Miami. French technique, honest
          ingredients, and drinks built to bring you back.
        </motion.p>

        <motion.div {...fadeUp(0.55)} className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="#menu">View Menu</Button>
          <Button href="#catering" variant="ghost-light">
            Book Catering
          </Button>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#intro"
        aria-label="Scroll to explore"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-cream/60 transition-colors hover:text-gold-light md:flex"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className="text-[0.625rem] tracking-[0.3em] uppercase">Scroll</span>
        <motion.span
          aria-hidden="true"
          className="block h-9 w-px bg-gradient-to-b from-gold-light to-transparent"
          animate={reduced ? undefined : { scaleY: [1, 0.55, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.a>

      <p className="sr-only">{site.tagline}</p>
    </section>
  );
}
