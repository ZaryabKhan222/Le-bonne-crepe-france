"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Photo } from "@/data/images";

export default function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: (Photo & { id: string })[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const current = open ? photos[index] : null;

  const step = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onNavigate((index + dir + photos.length) % photos.length);
    },
    [index, photos.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      // Keep tab focus inside the dialog's three controls.
      if (e.key === "Tab") {
        const focusables = document.querySelectorAll<HTMLElement>(
          "[data-lightbox-control]",
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, step]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/94 p-4 backdrop-blur-sm md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.figure
            key={current.id}
            className="relative max-h-full"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="(max-width: 768px) 92vw, 72vw"
              quality={90}
              className="max-h-[82vh] w-auto rounded-md object-contain shadow-2xl"
              placeholder="blur"
              blurDataURL={current.blurDataURL}
            />
            <figcaption className="mt-3 text-center text-sm text-cream/70">
              {current.alt}
            </figcaption>
          </motion.figure>

          <button
            ref={closeButton}
            data-lightbox-control
            type="button"
            onClick={onClose}
            aria-label="Close gallery view"
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-gold-light hover:text-gold-light"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {photos.length > 1 && (
            <button
              data-lightbox-control
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-gold-light hover:text-gold-light md:left-6"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 2L4 8l6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {photos.length > 1 && (
            <button
              data-lightbox-control
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-gold-light hover:text-gold-light md:right-6"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 2l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
