import Eyebrow from "@/components/ui/Eyebrow";
import GoldRule from "@/components/ui/GoldRule";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { site } from "@/data/site";

/**
 * The opening callout, now that the café is open. It used to count down to
 * the grand opening (Sep 19); the wording stays relative on purpose, with no
 * date, so it does not age. The id stays "grand-opening" for old links.
 */
export default function GrandOpening() {
  return (
    <section
      id="grand-opening"
      aria-labelledby="opening-heading"
      className="bg-charcoal-texture section-anchor relative overflow-hidden px-6 py-24 md:py-32"
    >
      {/* Gold glow behind the heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,163,78,0.16),transparent)]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow fr="Maintenant ouvert" en="Now Open" className="mb-6" />
          <h2
            id="opening-heading"
            className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] font-medium tracking-tight text-cream"
          >
            Our doors are open
            <span className="mt-2 block text-[clamp(1.4rem,3.6vw,2.5rem)] font-light text-gold-light italic">
              Come say bonjour
            </span>
          </h2>
          <GoldRule className="mx-auto mt-8 max-w-32" />
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-cream/85 md:text-xl">
            Discover a true taste of France in our new Miami café: waffles and sweet creations,
            gourmet coffee, signature and recovery drinks, and fresh healthy food.
          </p>
          <p className="font-display mt-6 text-2xl font-light text-gold-light italic md:text-3xl">
            More than a smoothie bar, it&apos;s an experience.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="#menu">See the Menu</Button>
          <Button href={site.socials.instagram} variant="ghost-light" target="_blank" rel="noopener noreferrer">
            Follow on Instagram
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
