import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { site } from "@/data/site";

export default function FindUs() {
  return (
    <section
      id="find-us"
      aria-labelledby="findus-heading"
      className="bg-marble-texture-grey px-6 py-20 md:py-28"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Eyebrow fr="Où nous trouver" en="Find Us" className="mb-4" />
        <h2
          id="findus-heading"
          className="font-display text-3xl leading-tight font-medium tracking-tight text-charcoal md:text-4xl"
        >
          Find us in Miami
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-ink/75">
          Our new restaurant is now open in Miami, and the Gourmet Cart still comes
          to private events across the city. Message us for directions, opening
          hours, or to book the cart.
        </p>
        {/* TODO(client): when the restaurant address and opening hours are
            confirmed, list them here. */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href={site.whatsappHref} target="_blank" rel="noopener noreferrer">
            Ask on WhatsApp
          </Button>
          <Button href={site.socials.instagram} variant="outline" target="_blank" rel="noopener noreferrer">
            Follow us on Instagram
          </Button>
        </div>
      </div>
    </section>
  );
}
