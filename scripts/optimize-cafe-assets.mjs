/**
 * Asset pipeline for the café launch photos (September 2026 batch).
 *
 * Reads originals from /resource/cafe-images and /resource/menu (both designed
 * menu boards), writes
 * optimized WebP files into /public/assets/cafe and /public/assets/menu, and a
 * manifest (dimensions, blur placeholders, alt text) into
 * /src/data/cafe-manifest.json. next/image serves AVIF or WebP from these on
 * the fly (see images.formats in next.config.ts).
 *
 * The two labeled "Signature Creations" images are kept at full resolution and
 * high quality so the ingredient labels stay crisp.
 *
 * Run with: node scripts/optimize-cafe-assets.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, "resource", "cafe-images");
const OUT = path.join(ROOT, "public", "assets", "cafe");

/**
 * category drives the gallery filters:
 *   cafe      the room, the storefront
 *   plates    savory dishes
 *   drinks    gourmet coffee creations
 *   behind    the team at work
 *   signature labeled deconstructed images (their own section, not the gallery)
 *   loyalty   loyalty card artwork (memberships section)
 */
const PHOTOS = [
  // Signature Creations, full resolution, quality 90
  {
    id: "signature-strawberry-biscoff-latte",
    file: "strawberry-biscoff-latte.jpeg",
    category: "signature",
    quality: 90,
    maxWidth: 4000,
    alt: "Strawberry Biscoff Latte, deconstructed layer by layer: strawberry purée, milk, espresso, ice, Biscoff cream cold foam, Biscoff crumble, a Biscoff cookie, whipped cream and freeze-dried strawberries",
  },
  {
    id: "signature-gravlax-bagel",
    file: "gravlax-bagel.jpeg",
    category: "signature",
    quality: 90,
    maxWidth: 4000,
    alt: "Gravlax bagel, deconstructed layer by layer: toasted multigrain bagel, herbed cream cheese, salmon gravlax, red onion and cucumber, in the café dining room",
  },
  // Menu feature images
  {
    id: "croque-monsieur",
    file: "croque-monsieur.jpeg",
    category: "plates",
    alt: "Croque monsieur with bubbling golden cheese and a side salad on a café terrace table",
  },
  {
    id: "salade-nicoise",
    file: "salade-nicoise.jpeg",
    category: "plates",
    alt: "Salade niçoise with tuna, soft eggs, olives, green beans and anchovies on a café terrace table",
  },
  {
    id: "drinks-lineup",
    file: "drinks-lineup.jpeg",
    category: "drinks",
    alt: "Four gourmet iced creations topped with whipped cream: blue spirulina and strawberry, caramel Biscoff, ube, and a rose petal latte, in La Bonne Crêpe cups",
  },
  // The café
  {
    id: "interior-1",
    file: "interior-1.jpeg",
    category: "cafe",
    alt: "The wooden counter set with plates and table lamps, looking out to the palm trees through the front windows",
  },
  {
    id: "interior-2",
    file: "interior-2.jpeg",
    category: "cafe",
    alt: "The bar counter with three place settings under a canopy of white blossoms, coffee machines and marble walls behind",
  },
  {
    id: "interior-3",
    file: "interior-3.jpeg",
    category: "cafe",
    alt: "A black table with green leather chairs, a linen runner, a fern and a brass lamp beside the window",
  },
  {
    id: "interior-4",
    file: "interior-4.jpeg",
    category: "cafe",
    alt: "The storefront window with the La Bonne Crêpe logo, palm trees reflected, and two wooden tables set outside",
  },
  // The team
  {
    id: "owner-at-counter",
    file: "owner-at-counter.jpeg",
    category: "behind",
    alt: "Romain turning a crêpe on the griddle at a Miami market, and finishing a strawberry matcha creation with a Biscoff cookie",
  },
  // Loyalty card
  {
    id: "loyalty-card",
    file: "loyalty-card.jpeg",
    category: "loyalty",
    alt: "Ask for your loyalty card: a team member holds up the stamp card, with each visit stamped and the tenth visit rewarded with any product on the menu",
  },
];

async function blurDataURL(input) {
  const buf = await sharp(input).resize(16, null, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function processPhotos() {
  const manifest = {};
  for (const p of PHOTOS) {
    const input = path.join(SRC, p.file);
    const outFile = path.join(OUT, `${p.id}.webp`);
    const img = sharp(input).rotate();
    const meta = await img.metadata();
    const targetWidth = Math.min(p.maxWidth ?? 1600, meta.width ?? 1600);
    const info = await img
      .resize(targetWidth, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: p.quality ?? 80 })
      .toFile(outFile);
    manifest[p.id] = {
      src: `/assets/cafe/${p.id}.webp`,
      width: info.width,
      height: info.height,
      category: p.category,
      alt: p.alt,
      blurDataURL: await blurDataURL(input),
    };
    console.log(`photo ${p.id}: ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}kb`);
  }
  return manifest;
}

/** The designed menu boards, as delivered by the client. */
const MENU_IMAGES = [
  { id: "foodMenu", file: "food-menu.jpeg", slug: "food-menu" },
  { id: "drinkMenu", file: "WhatsApp Image 2026-09-15 at 6.43.32 AM.jpeg", slug: "drink-menu" },
];

/**
 * Each original JPEG is copied (renamed, no spaces) for downloads, and a
 * high-quality WebP is produced for the lightbox. No resizing and near-lossless
 * quality so the small print stays crisp.
 */
async function processMenuImages() {
  const outDir = path.join(ROOT, "public", "assets", "menu");
  await mkdir(outDir, { recursive: true });
  const out = {};
  for (const m of MENU_IMAGES) {
    const input = path.join(ROOT, "resource", "menu", m.file);
    await copyFile(input, path.join(outDir, `${m.slug}.jpg`));
    const outFile = path.join(outDir, `${m.slug}.webp`);
    const info = await sharp(input)
      .rotate()
      .sharpen({ sigma: 0.6 })
      .webp({ quality: 94, effort: 6 })
      .toFile(outFile);
    console.log(
      `menu image ${m.slug}: ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}kb (+ ${m.slug}.jpg copy)`
    );
    out[m.id] = {
      src: `/assets/menu/${m.slug}.webp`,
      original: `/assets/menu/${m.slug}.jpg`,
      width: info.width,
      height: info.height,
      blurDataURL: await blurDataURL(outFile),
    };
  }
  return out;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const photos = await processPhotos();
  const menuImages = await processMenuImages();
  await writeFile(
    path.join(ROOT, "src", "data", "cafe-manifest.json"),
    JSON.stringify({ photos, ...menuImages }, null, 2)
  );
  console.log("cafe manifest written");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
