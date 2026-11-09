import manifest from "./image-manifest.json";

export type Photo = {
  src: string;
  width: number;
  height: number;
  category: "savory" | "crepes" | "waffles" | "desserts" | "drinks" | "behind";
  alt: string;
  blurDataURL: string;
};

export type SimpleImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

const photos = manifest.photos as Record<string, Photo>;
const logos = manifest.logos as Record<string, SimpleImage>;
const hero = manifest.hero as Record<string, Required<SimpleImage>>;
const menuImages = manifest.menu as Record<string, Required<SimpleImage>>;

export function photo(id: string): Photo {
  const p = photos[id];
  if (!p) throw new Error(`Unknown photo id: ${id}`);
  return p;
}

export const galleryPhotos: (Photo & { id: string })[] = Object.entries(photos)
  // The gallery shows food, drinks and behind-the-scenes; portraits of the
  // story section stay out so they feel special where they are used.
  .filter(([id]) => !["romain-flip", "romain-sauce"].includes(id))
  .map(([id, p]) => ({ id, ...p }));

export const logoGold = logos["logo-gold"];
export const logoNeon = logos["logo-neon"];
export const logoClassic = logos["logo-classic"];
export const heroDesktop = hero["hero-desktop"];
export const heroMobile = hero["hero-mobile"];

/** The printed food menu, shown in the menu section. */
export const foodMenuImage = menuImages["food-menu"];
