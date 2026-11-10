"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { grandOpening } from "@/data/site";

const DISMISS_KEY = "lbc-opening-bar-dismissed";

const noopSubscribe = () => () => {};

/** Hidden on load when dismissed earlier this session or once opening night is over. */
function hiddenOnLoad(): boolean {
  let dismissed = false;
  try {
    dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    /* storage blocked: keep the bar */
  }
  return dismissed || Date.now() > new Date(grandOpening.showUntil).getTime();
}

/**
 * Slim gold bar pinned above the header for the grand opening. Dismissable for
 * the session, and it hides itself once the opening night is over. Its real
 * height is published as --announce-h so the header and anchors can offset.
 */
export default function AnnouncementBar() {
  // Server render always shows the bar; the client snapshot hides it when needed.
  const hidden = useSyncExternalStore(noopSubscribe, hiddenOnLoad, () => false);
  const [dismissedNow, setDismissedNow] = useState(false);
  const visible = !hidden && !dismissedNow;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.setProperty("--announce-h", "0px");
      return;
    }
    const el = ref.current;
    if (!el) return;
    const publish = () => root.style.setProperty("--announce-h", `${el.offsetHeight}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, [visible]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissedNow(true);
  };

  if (!visible) return null;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Grand opening announcement"
      className="announce-bar fixed inset-x-0 top-0 z-[45] text-charcoal"
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-center px-12 py-2.5 text-center sm:py-2">
        <a
          href="#grand-opening"
          className="text-[0.68rem] leading-snug font-bold tracking-[0.12em] uppercase transition-opacity hover:opacity-80 sm:text-xs sm:tracking-[0.2em]"
        >
          <span aria-hidden="true" className="mr-2 opacity-70">
            ✦
          </span>
          {grandOpening.headline}
          <span aria-hidden="true" className="ml-2 opacity-70">
            ✦
          </span>
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-charcoal/70 transition-colors hover:bg-charcoal/10 hover:text-charcoal sm:right-4"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
