import manifest from "./image-manifest.json";
import cafeManifest from "./cafe-manifest.json";
import heroVideoManifest from "./hero-video-manifest.json";

export type PhotoCategory =
  | "cafe"
  | "plates"
  | "crepes"
  | "waffles"
  | "drinks"
  | "behind"
  | "signature"
  | "loyalty";

export type Photo = {
  src: string;
  width: number;
  height: number;
  category: PhotoCategory;
  alt: string;
  blurDataURL: string;
};

export type SimpleImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

const photos = {
  ...(manifest.photos as Record<string, Photo>),
  ...(cafeManifest.photos as Record<string, Photo>),
};
const logos = manifest.logos as Record<string, SimpleImage>;
const hero = manifest.hero as Record<string, Required<SimpleImage>>;
const heroVideo = heroVideoManifest as Record<string, Required<SimpleImage>>;

export function photo(id: string): Photo {
  const p = photos[id];
  if (!p) throw new Error(`Unknown photo id: ${id}`);
  return p;
}

/**
 * Ids kept out of the gallery: shown elsewhere on the page, or near-duplicate
 * angles of the same plate. The remaining 24 photos plus the double-size
 * featured tile fill the 2 and 4 column grids with no orphan cell.
 */
const NOT_IN_GALLERY = new Set([
  "romain-flip",
  "romain-sauce",
  "signature-strawberry-biscoff-latte",
  "signature-gravlax-bagel",
  "loyalty-card",
  "crepe-duo-soft",
  "crepe-duo-angle",
]);

/** Gallery order: the café and the new plates first, then the market photos. */
const GALLERY_LEAD = [
  "drinks-lineup",
  "interior-2",
  "interior-4",
  "croque-monsieur",
  "interior-1",
  "salade-nicoise",
  "interior-3",
  "owner-at-counter",
];

export const galleryPhotos: (Photo & { id: string })[] = [
  ...GALLERY_LEAD,
  ...Object.keys(photos).filter((id) => !GALLERY_LEAD.includes(id)),
]
  .filter((id) => !NOT_IN_GALLERY.has(id))
  .map((id) => ({ id, ...photos[id] }));

export const signaturePhotos: (Photo & { id: string })[] = [
  "signature-strawberry-biscoff-latte",
  "signature-gravlax-bagel",
].map((id) => ({ id, ...photos[id] }));

/** The designed menu boards: WebP for the lightbox, original JPEG for download. */
type MenuBoard = Required<SimpleImage> & { original: string };

export const foodMenuImage = cafeManifest.foodMenu as MenuBoard;
export const drinkMenuImage = cafeManifest.drinkMenu as MenuBoard;

function menuBoardPhoto(id: string, board: MenuBoard, alt: string): Photo & { id: string } {
  return {
    id,
    src: board.src,
    width: board.width,
    height: board.height,
    blurDataURL: board.blurDataURL,
    category: "drinks",
    alt,
  };
}

/** Lightbox order matches the section: food first, then drinks. */
export const menuBoardPhotos: (Photo & { id: string })[] = [
  menuBoardPhoto(
    "food-menu",
    foodMenuImage,
    "La Bonne Crêpe food menu: waffles toast, toasted croissants, sandwiches and bagels, pastry by Chef George Berger, gourmet desserts, combo breakfast, fresh salads and cold soups"
  ),
  menuBoardPhoto(
    "drink-menu",
    drinkMenuImage,
    "La Bonne Crêpe drink menu: hot coffee and matcha, iced gourmet coffee, cold press juice, milk shakes, protein shakes, mocktails, water and soda"
  ),
];

export const logoGold = logos["logo-gold"];
export const logoNeon = logos["logo-neon"];
export const logoClassic = logos["logo-classic"];

/** Market action shots, still used by the story section. */
export const heroDesktop = hero["hero-desktop"];
export const heroMobile = hero["hero-mobile"];

/** Café walkthrough video: posters double as the static fallbacks. */
export const heroPoster = heroVideo["hero-poster"];
export const heroPosterMobile = heroVideo["hero-poster-mobile"];
export const heroVideoSources = [{ src: "/assets/hero/hero-loop.mp4", type: "video/mp4" }] as const;
export const heroVideoSourcesMobile = [
  { src: "/assets/hero/hero-loop-portrait.mp4", type: "video/mp4" },
] as const;
