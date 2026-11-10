/**
 * Site-wide configuration: identity, navigation, contact and social links.
 * Edit this file to change any of them, no design work needed.
 */

/**
 * Which logo leads the header: "gold" (elegant badge, default) or "neon".
 * The neon version is used in the footer regardless.
 */
export const PRIMARY_LOGO: "gold" | "neon" = "gold";

/**
 * Grand opening of the café. The announcement bar, the hero callout and the
 * dedicated section all read from here. After `showUntil` the bar and the hero
 * callout hide themselves automatically; the section stays until removed.
 */
export const grandOpening = {
  headline: "Grand Opening, Saturday September 19th, from 5 PM",
  /** ISO date with the Miami offset, used for structured data. */
  startDate: "2026-09-19T17:00:00-04:00",
  /** Bar and hero callout disappear after this moment (end of opening night). */
  showUntil: "2026-09-20T04:00:00-04:00",
  intro:
    "Come celebrate and discover a true taste of France: waffles and sweet creations, gourmet coffee, signature and recovery drinks, and fresh healthy food.",
  tagline: "More than a smoothie bar, it's an experience.",
} as const;

/**
 * TODO(client): replace with the Square membership / loyalty link when it is
 * ready. While the URL still contains "PLACEHOLDER", the Memberships button
 * sends visitors to WhatsApp instead of a dead link.
 */
/** True until the end of opening night; drives the bar and the hero callout. */
export function isOpeningLive(): boolean {
  return Date.now() < new Date(grandOpening.showUntil).getTime();
}

export const MEMBERSHIP_URL = "https://square.link/u/PLACEHOLDER";
export const membershipsLive = !MEMBERSHIP_URL.includes("PLACEHOLDER");

export const site = {
  name: "La Bonne Crêpe de France",
  legalName: "La Bonne Crêpe de France LLC",
  tagline: "Healthy French Specialities and Natural Drinks",
  description:
    "Healthy French Specialities and Natural Drinks. The first real recovery lounge in Miami: breakfast combos, waffles, toasted croissants, fresh salads, French cheese boards, handcrafted desserts, gourmet coffee and cold press juices, at our Miami restaurant and private events.",
  // TODO(client): confirm the public phone number before launch (from the menu header).
  phone: "305 219 1917",
  phoneHref: "tel:+13052191917",
  whatsappHref: "https://wa.me/13052191917",
  email: "", // shown nowhere until provided
  areaServed: "Miami, FL",
  // TODO(client): change to the custom domain when one is purchased.
  url: "https://la-bonne-crepe-france.vercel.app",
  socials: {
    instagram: "https://www.instagram.com/la_bonne_crepe_de_france/",
    facebook: "https://www.facebook.com/p/La-bonne-cr%C3%AApe-de-France-LLC-61573089262420/",
    // TODO(client): replace with the direct Google review link (g.page/r/... ) when available.
    googleReview: "https://www.google.com/search?q=La+Bonne+Cr%C3%AApe+de+France+LLC+Miami+reviews",
  },
  press: {
    voyageMia: {
      title: "Exploring Life & Business with Romain Courcier of La Bonne Crêpe De France",
      url: "https://voyagemia.com/interview/exploring-life-business-with-romain-courcier-of-la-bonne-crepe-de-france",
      outlet: "VoyageMIA",
    },
  },
} as const;

export const nav = [
  { label: "Story", href: "#story" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Memberships", href: "#memberships" },
  { label: "Catering", href: "#catering" },
  { label: "Contact", href: "#contact" },
] as const;
