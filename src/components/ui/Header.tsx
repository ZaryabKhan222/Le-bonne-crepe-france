"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, site, PRIMARY_LOGO } from "@/data/site";
import { logoGold, logoNeon } from "@/data/images";

const headerLogo = PRIMARY_LOGO === "gold" ? logoGold : logoNeon;

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on Escape and lock body scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          solid
            ? "bg-marble/92 shadow-[0_1px_0_rgba(160,124,44,0.18),0_8px_30px_rgba(26,26,26,0.06)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="#top"
            aria-label={`${site.name}, back to top`}
            className="flex items-center gap-3"
          >
            <Image
              src={headerLogo.src}
              alt=""
              width={48}
              height={48}
              priority
              className={`h-12 w-12 rounded-full object-contain transition-all duration-500 ${
                solid ? "" : "drop-shadow-[0_2px_10px_rgba(26,26,26,0.5)]"
              } ${PRIMARY_LOGO === "neon" ? "bg-cream/95 p-0.5" : ""}`}
            />
            <span
              className={`font-display text-lg leading-none font-medium tracking-tight transition-colors duration-500 ${
                solid ? "text-charcoal" : "text-cream"
              }`}
            >
              La Bonne Crêpe
              <span
                className={`block text-[0.65rem] tracking-[0.24em] uppercase ${
                  solid ? "text-gold-deep" : "text-gold-light"
                }`}
              >
                de France
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`group relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                  solid ? "text-ink hover:text-gold-deep" : "text-cream/90 hover:text-gold-light"
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-charcoal transition-colors duration-300 hover:bg-gold-light"
            >
              Book Catering
            </a>
          </nav>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={`relative z-50 flex h-11 w-11 items-center justify-center rounded-full transition-colors md:hidden ${
              open ? "text-cream" : solid ? "text-charcoal" : "text-cream"
            }`}
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={`absolute left-0 block h-0.5 w-6 rounded bg-current transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 block h-0.5 rounded bg-current transition-all duration-300 ${
                  open ? "top-1/2 w-6 -translate-y-1/2 -rotate-45" : "w-4"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Off-canvas mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              className="bg-charcoal-texture fixed top-0 right-0 bottom-0 z-40 flex w-[82vw] max-w-sm flex-col justify-between px-8 pt-28 pb-10 md:hidden"
              initial={reduced ? { x: 0 } : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="flex flex-col gap-2">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduced ? undefined : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.45 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="font-display block border-b border-cream/10 py-4 text-3xl font-light text-cream transition-colors hover:text-gold-light"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-col gap-4">
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gold py-3.5 text-center text-sm font-semibold tracking-wide text-charcoal uppercase"
                >
                  WhatsApp Us
                </a>
                <a
                  href={site.phoneHref}
                  className="text-center text-sm tracking-wide text-cream/70"
                >
                  {site.phone}
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Mobile sticky contact bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-gold/25 bg-charcoal/92 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <a
          href={site.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full bg-gold py-3 text-center text-sm font-semibold text-charcoal"
        >
          WhatsApp
        </a>
        <a
          href="#contact"
          className="flex-1 rounded-full border border-cream/25 py-3 text-center text-sm font-semibold text-cream"
        >
          Contact
        </a>
      </div>
    </>
  );
}
