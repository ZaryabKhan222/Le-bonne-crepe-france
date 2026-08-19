"use client";

import { useEffect, useRef } from "react";

/** Thin gold line that draws itself in when scrolled into view. */
export default function GoldRule({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-inview");
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <span ref={ref} aria-hidden="true" className={`gold-rule ${className}`} />;
}
