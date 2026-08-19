import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";

export default function Press() {
  return (
    <section
      id="press"
      aria-labelledby="press-heading"
      className="bg-marble-texture px-6 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <article className="rounded-lg border border-gold/20 bg-cream p-8 shadow-[0_1px_2px_rgba(26,26,26,0.04)] md:p-10">
            <Eyebrow fr="La presse" en="Press" className="mb-5" />
            <h2 id="press-heading" className="sr-only">
              Press and reviews
            </h2>
            <p className="font-display text-2xl leading-snug font-light text-charcoal italic md:text-[1.7rem]">
              &ldquo;{site.press.voyageMia.title}&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="font-display text-lg font-semibold tracking-tight text-charcoal">
                Voyage<span className="text-gold-deep">MIA</span>
              </span>
              <a
                href={site.press.voyageMia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-sm font-semibold tracking-wide text-gold-deep uppercase"
              >
                Read the feature
                <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.12}>
          <aside className="rounded-lg bg-charcoal p-8 text-center md:p-10">
            <p className="text-3xl" aria-hidden="true">
              ⭐⭐⭐⭐⭐
            </p>
            <p className="font-display mt-4 text-xl font-light text-cream">
              Loved your visit?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-cream/65">
              A Google review helps a small French cart go a long way in Miami.
            </p>
            <a
              href={site.socials.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full border border-gold/60 px-6 py-2.5 text-sm font-semibold text-gold-light transition-colors duration-300 hover:bg-gold hover:text-charcoal"
            >
              Leave a Google review
            </a>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
