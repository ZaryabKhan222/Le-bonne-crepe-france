import Image from "next/image";
import { nav, site } from "@/data/site";
import { logoNeon, foodMenuImage, drinkMenuImage } from "@/data/images";

export default function Footer() {
  return (
    <footer className="bg-charcoal-texture px-6 pt-20 pb-28 md:pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[auto_1fr_auto] md:gap-16">
          {/* Neon logo presented like a mounted sign */}
          <div className="flex flex-col items-start gap-5">
            <div className="rounded-2xl bg-cream/95 p-3 shadow-[0_0_40px_rgba(201,163,78,0.2)]">
              <Image
                src={logoNeon.src}
                alt="La Bonne Crêpe neon sign logo"
                width={132}
                height={132}
                className="h-33 w-33 rounded-xl object-cover"
              />
            </div>
            <p className="max-w-52 text-sm leading-relaxed text-cream/60">{site.tagline}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 md:pt-2">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="w-fit text-cream/75 transition-colors duration-300 hover:text-gold-light"
              >
                {item.label}
              </a>
            ))}
            <a
              href={foodMenuImage.original}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-cream/75 transition-colors duration-300 hover:text-gold-light"
            >
              Food Menu (image)
            </a>
            <a
              href={drinkMenuImage.original}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-cream/75 transition-colors duration-300 hover:text-gold-light"
            >
              Drink Menu (image)
            </a>
          </nav>

          <div className="flex flex-col gap-4 md:items-end md:pt-2">
            <a
              href={site.phoneHref}
              className="font-display text-2xl font-light text-gold-light transition-colors hover:text-gold"
            >
              {site.phone}
            </a>
            <div className="flex gap-3">
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-colors duration-300 hover:border-gold hover:text-gold-light"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-colors duration-300 hover:border-gold hover:text-gold-light"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.5-1.5h1.4V4.9c-.3 0-1.1-.1-2-.1a3.4 3.4 0 0 0-3.7 3.8V11H8.3v3h2.4v7Z" />
                </svg>
              </a>
              <a
                href={site.socials.googleReview}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Leave a Google review"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-colors duration-300 hover:border-gold hover:text-gold-light"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.5l2.9 5.9 6.6 1-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-1L12 2.5z" />
                </svg>
              </a>
            </div>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cream/60 transition-colors hover:text-gold-light"
            >
              WhatsApp us anytime
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-2 border-t border-cream/10 pt-8 text-center text-xs text-cream/45">
          <p>Made in Miami, with a French heart.</p>
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
