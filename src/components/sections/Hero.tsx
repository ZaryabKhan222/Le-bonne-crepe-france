"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { getImageProps } from "next/image";
import Button from "@/components/ui/Button";
import { heroPoster, heroPosterMobile, heroVideoSources, heroVideoSourcesMobile } from "@/data/images";
import { grandOpening, site } from "@/data/site";

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

/** Respect the Data Saver setting: no background video on metered connections. */
function savesData(): boolean {
  type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };
  return (navigator as NavigatorWithConnection).connection?.saveData === true;
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
 * Poster still-frame from the café walkthrough. It is the first thing painted
 * (before any JavaScript), the fallback for phones and reduced motion, and the
 * frame the video fades in over on desktop. The browser picks the portrait or
 * landscape file from the <picture> element, so a phone never downloads the
 * desktop crop.
 */
function HeroPoster() {
  const common = { alt: "", sizes: "100vw", priority: true } as const;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: heroPoster.src,
    width: heroPoster.width,
    height: heroPoster.height,
  });
  const { props: mobileProps } = getImageProps({
    ...common,
    src: heroPosterMobile.src,
    width: heroPosterMobile.width,
    height: heroPosterMobile.height,
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <img
        {...mobileProps}
        alt="Inside La Bonne Crêpe: the wooden bar counter set for service under warm lamp light"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[50%_45%]"
        style={{
          backgroundImage: `url(${heroPosterMobile.blurDataURL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </picture>
  );
}

/**
 * Looping walkthrough video. Mounted after the page has loaded and gone idle,
 * so it never competes with the first paint. Phones get a portrait encode,
 * larger screens the landscape band. Plays only while the hero is on screen
 * and fades in over the poster once it can play.
 */
function HeroVideo({ active, isMobile }: { active: boolean; isMobile: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const sources = isMobile ? heroVideoSourcesMobile : heroVideoSources;
  const poster = isMobile ? heroPosterMobile : heroPoster;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      const p = v.play();
      if (p) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  return (
    <video
      ref={ref}
      className={`hero-video absolute inset-0 h-full w-full object-cover object-[50%_45%] ${playing ? "is-playing" : ""}`}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      poster={poster.src}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}

export default function Hero({ showOpening = true }: { showOpening?: boolean }) {
  const reduced = useMediaQuery(REDUCED_QUERY);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const pageReady = useAfterLoadIdle();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  // Pause the video and the render loop whenever the hero leaves the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const enableVideo = pageReady && !reduced && !savesData();
  const enable3D = pageReady && !reduced && !isLowPower();

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Welcome"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-charcoal"
    >
      {/* Layer 1: poster still, then the looping video on top of it */}
      <div className="absolute inset-0">
        <HeroPoster />
        {enableVideo && <HeroVideo key={isMobile ? "portrait" : "landscape"} active={inView} isMobile={isMobile} />}
      </div>

      {/* Layer 2: dark overlay, gradients rather than a flat scrim */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-transparent to-transparent" />
      </div>

      {/* Layer 3: gold bokeh, 3D once the page is loaded and idle, CSS shimmer
          before and on devices that should not run it */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${enable3D ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        {enable3D && <GoldParticles active={inView} isMobile={isMobile} />}
      </div>
      {!enable3D && <div className="hero-shimmer absolute inset-0" aria-hidden="true" />}

      {/* Layer 4: text and calls to action */}
      <div
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 md:pb-28"
        style={{ paddingTop: "calc(8rem + var(--announce-h, 0px))" }}
      >
        {showOpening && (
          <a
            href="#grand-opening"
            className="opening-pill hero-rise hero-rise-1 mb-6 inline-flex max-w-full items-center gap-3 rounded-full px-4 py-2 text-[0.68rem] font-semibold tracking-[0.16em] text-gold-light uppercase transition-colors hover:text-cream sm:text-xs"
          >
            <span className="dot h-2 w-2 shrink-0 rounded-full bg-gold-light" aria-hidden="true" />
            <span>{grandOpening.headline}</span>
          </a>
        )}

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
