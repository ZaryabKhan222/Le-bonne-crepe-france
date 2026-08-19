"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { getImageProps } from "next/image";
import Button from "@/components/ui/Button";
import { heroDesktop, heroMobile } from "@/data/images";
import { site } from "@/data/site";

// The Three.js bundle never blocks first paint: it starts loading only after
// the window load event, once the browser is idle, and is skipped entirely
// for reduced motion or low-power devices.
const GoldParticles = dynamic(() => import("@/components/three/GoldParticles"), {
  ssr: false,
});

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

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

function useMediaQuery(query: string, serverDefault = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverDefault
  );
}

/** True only once the page has fully loaded and the browser has gone idle. */
function useAfterLoadIdle(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idleHandle: number | undefined;
    let cancelled = false;
    const schedule = () => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
      idleHandle = idle(() => !cancelled && setReady(true));
    };
    if (document.readyState === "complete") {
      schedule();
      return () => {
        cancelled = true;
        if (idleHandle) (window.cancelIdleCallback ?? clearTimeout)(idleHandle);
      };
    }
    window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleHandle) (window.cancelIdleCallback ?? clearTimeout)(idleHandle);
    };
  }, []);
  return ready;
}

/**
 * Art-directed hero photograph: the browser picks the right file from the
 * <picture> element before any JavaScript runs, so mobile never downloads the
 * desktop crop and the image starts loading with the HTML.
 */
function HeroPicture() {
  const common = { alt: "", sizes: "100vw", priority: true } as const;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: heroDesktop.src,
    width: heroDesktop.width,
    height: heroDesktop.height,
  });
  const { props: mobileProps } = getImageProps({
    ...common,
    src: heroMobile.src,
    width: heroMobile.width,
    height: heroMobile.height,
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <img
        {...mobileProps}
        alt="A golden crêpe being turned by hand on the cast iron griddle at a Miami farmers market"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          backgroundImage: `url(${heroMobile.blurDataURL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </picture>
  );
}

export default function Hero() {
  const reduced = useMediaQuery(REDUCED_QUERY);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const pageReady = useAfterLoadIdle();
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

  const enable3D = pageReady && !reduced && !isLowPower();

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Welcome"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-charcoal"
    >
      {/* Cinematic photograph: the crêpe on the griddle at golden hour */}
      <div className="absolute inset-0">
        <HeroPicture />
        {/* Legibility gradients, not a flat scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-transparent to-transparent" />
      </div>

      {/* Gold bokeh: 3D once the page is loaded and idle, CSS shimmer before
          and on devices that should not run it */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${enable3D ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        {enable3D && <GoldParticles active={inView} isMobile={isMobile} />}
      </div>
      {!enable3D && <div className="hero-shimmer absolute inset-0" aria-hidden="true" />}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-36 pb-24 sm:px-10 md:pb-28">
        <p className="eyebrow hero-rise hero-rise-1 mb-5">
          <span className="fr" lang="fr">
            Fait main à Miami
          </span>
          <span aria-hidden="true"> · </span>
          Healthy French Specialities and Natural Drinks
        </p>

        <h1 className="font-display hero-rise hero-rise-2 max-w-4xl text-[clamp(2.75rem,9vw,6rem)] leading-[1.02] font-medium tracking-tight text-cream">
          La Bonne Crêpe
          <span className="block text-[clamp(1.9rem,6vw,4rem)] font-light text-gold-light italic">
            de France
          </span>
        </h1>

        <p className="hero-rise hero-rise-3 mt-6 max-w-xl text-lg leading-relaxed text-cream/85 md:text-xl">
          The first real recovery lounge in Miami. French technique, honest
          ingredients, and drinks built to bring you back.
        </p>

        <div className="hero-rise hero-rise-4 mt-10 flex flex-wrap items-center gap-4">
          <Button href="#menu">View Menu</Button>
          <Button href="#catering" variant="ghost-light">
            Book Catering
          </Button>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#intro"
        aria-label="Scroll to explore"
        className="scroll-cue absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-cream/60 transition-colors hover:text-gold-light md:flex"
      >
        <span className="text-[0.625rem] tracking-[0.3em] uppercase">Scroll</span>
        <span
          aria-hidden="true"
          className="scroll-cue-line block h-9 w-px bg-gradient-to-b from-gold-light to-transparent"
        />
      </a>

      <p className="sr-only">{site.tagline}</p>
    </section>
  );
}
