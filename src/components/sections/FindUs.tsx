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
          Catch us around Miami
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-ink/75">
          The cart moves with the markets. You will find La Bonne Crêpe at farmers
          markets across the Miami area every week, and at private events in between.
          Message us for this week&apos;s schedule.
        </p>
        {/* TODO(client): when a fixed market schedule is confirmed, list the
            locations and days here. */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href={site.whatsappHref} target="_blank" rel="noopener noreferrer">
            Ask on WhatsApp
          </Button>
          <Button href={site.socials.instagram} variant="outline" target="_blank" rel="noopener noreferrer">
            Follow the schedule on Instagram
          </Button>
        </div>
      </div>
    </section>
  );
}
