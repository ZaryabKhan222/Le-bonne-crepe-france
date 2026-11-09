/**
 * One-time asset pipeline: reads originals from /resource, writes optimized
 * WebP files into /public/assets and a manifest (dimensions + blur placeholders)
 * into /src/data/image-manifest.json.
 *
 * Run with: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, "resource");
const OUT = path.join(ROOT, "public", "assets");

/** name -> { file, dir, width, category, alt } */
const PHOTOS = [
  // Savory plates (restaurant, first so the gallery opens on the current menu)
  { id: "savory-salmon-gravlax-bagel", file: "new photos/salmon-gravlax-bagel.jpeg", category: "savory", alt: "Salmon gravlax bagel with cucumber, cream cheese and arugula on a dark stone plate" },
  { id: "savory-nicoise-salad", file: "new photos/nicoise-salad.jpeg", category: "savory", alt: "Niçoise salad with tuna, soft-boiled egg, olives, green beans and cherry tomatoes in a white bowl" },
  { id: "savory-ham-cheese-croissant", file: "new photos/ham-cheese-croissant.jpeg", category: "savory", alt: "Toasted ham and Swiss cheese croissant, with a lavender latte and a strawberry matcha behind it" },
  { id: "savory-ham-cheese-croissant-close", file: "new photos/ham-cheese-croissant-close.jpeg", category: "savory", alt: "Close-up of a toasted croissant filled with ham and melted Swiss cheese" },
  { id: "savory-herbal-butter", file: "new photos/herbal-butter.jpeg", category: "savory", alt: "Handcrafted herbal butter with chives and parsley on a white plate with a bright green herb oil" },
  // Crêpes
  { id: "crepe-duo-marble", file: "food images/0a4d7027-f65d-4ad6-b2ca-54150d952b4a.jpeg", category: "crepes", alt: "Two fresh crêpes on a marble table, one topped with grated Swiss cheese and one with strawberry jelly and whipped cream" },
  { id: "crepe-duo-portrait", file: "food images/375454ac-f240-4db9-b6dd-c3f603d62298.jpeg", category: "crepes", alt: "Ham and cheese crêpe beside a strawberry jelly crêpe with whipped cream, served in gingham trays" },
  { id: "crepe-cheese-roll", file: "food images/4bc5a941-0804-4129-b63b-210e8de421cd.jpeg", category: "crepes", alt: "Golden rolled crêpe with melted cheese and fresh parsley on a white plate" },
  { id: "crepe-duo-angle", file: "food images/4df18c97-0ee6-4e3e-8ffe-bdc560786b3c.jpeg", category: "crepes", alt: "Savory cheese crêpe and sweet strawberry crêpe side by side on marble" },
  { id: "crepe-ham-cheese-cut", file: "food images/6b9fa384-2941-446a-b427-280f7cf53aa9.jpeg", category: "crepes", alt: "Ham and Swiss cheese crêpe cut open to show the melted filling, garnished with parsley" },
  { id: "crepe-duo-table", file: "food images/6bbe3832-7ce3-4777-a0a4-b1ab0a8d0d29.jpeg", category: "crepes", alt: "Toasted cheese crêpe and strawberry crêpe in checkered paper trays on a marble table" },
  { id: "crepe-duo-soft", file: "food images/710197e5-73ba-4f02-957e-00d976ce6121.jpeg", category: "crepes", alt: "Pair of fresh crêpes, one savory with grated cheese and one sweet with strawberry glaze" },
  { id: "crepe-golden-roll", file: "food images/cf84aa21-48fb-43cd-82f2-97fd875ba948.jpeg", category: "crepes", alt: "Perfectly rolled golden crêpe with a sprig of parsley on a white plate" },
  // Waffles
  { id: "waffle-belgian-red-berries", file: "new photos/belgian-red-berries-waffle.jpeg", category: "waffles", alt: "Belgian waffle topped with strawberries, raspberries, blackberries, blueberries and whipped cream" },
  { id: "waffle-avocado-toast-savory", file: "new photos/avocado-toast-savory-waffle.jpeg", category: "waffles", alt: "Avocado toast savory waffle on a bed of arugula with balsamic glaze" },
  { id: "waffle-salmon-top", file: "food images/1e5b13e8-1733-40bb-95c7-0e096bb1b6cf.jpeg", category: "waffles", alt: "Belgian waffle topped with smoked salmon roses, avocado cream, and lime zest on a white plate" },
  { id: "waffle-salmon-close", file: "food images/22cf79f6-381f-465e-8ae5-b7696bd5d81a.jpeg", category: "waffles", alt: "Close-up of a savory waffle with smoked salmon, guacamole, and fresh parsley" },
  { id: "waffle-strawberry-cream", file: "food images/4027fcaf-d052-48bc-9a3a-fc7bad9ff735.jpeg", category: "waffles", alt: "Waffle layered with sliced strawberries, vanilla pastry cream, and blueberry coulis" },
  { id: "waffle-strawberry-top", file: "food images/934a9ba2-767b-467e-abd3-2a3b868240b4.jpeg", category: "waffles", alt: "Artfully plated strawberry waffle with berry coulis dots, seen from above" },
  { id: "waffle-strawberry-angle", file: "food images/ca191dc3-0197-4f58-ba37-220d31edd4ce.jpeg", category: "waffles", alt: "Strawberry waffle with piped vanilla cream and dark berry coulis on a white plate" },
  { id: "waffle-salmon-avocado", file: "food images/fe9d0208-4860-47ec-8ded-b2ae78ae819d.jpeg", category: "waffles", alt: "Savory waffle crowned with smoked salmon, avocado mousse, and pickled onion" },
  // Drinks
  { id: "matcha-berry-latte", file: "food images/37da8a2b-a6ee-4c2e-942e-13c07db82d0d.jpeg", category: "drinks", alt: "Iced matcha latte with berry swirls and whipped cream topped with flower petals, in a La Bonne Crêpe compostable cup" },
  { id: "matcha-drink-cart", file: "RALV2863.jpg", category: "drinks", alt: "Strawberry matcha creation with whipped cream and a biscuit, on the Gourmet Cart counter under its neon sign" },
  { id: "drink-caramel-latte-can", file: "new photos/caramel-latte-can.jpeg", category: "drinks", alt: "Iced caramel latte with a thick caramel swirl and milk foam, served in a sealed clear can on a silver tray" },
  { id: "drink-mr-green-detox", file: "new photos/mr-green-detox-juice.jpeg", category: "drinks", alt: "Mr Green detox extract juice with fresh mint in a La Bonne Crêpe glass" },
  { id: "drink-lavender-latte-can", file: "new photos/lavender-latte-can.jpeg", category: "drinks", alt: "Lavender latte to go in a sealed clear can, with purple lavender layers swirling into the coffee" },
  { id: "drink-strawberry-matcha-can", file: "new photos/strawberry-matcha-can.jpeg", category: "drinks", alt: "Strawberry matcha to go in a sealed clear can, green matcha over a strawberry layer" },
  { id: "drink-iced-lavender-biscoff", file: "new photos/iced-lavender-biscoff-latte.jpeg", category: "drinks", alt: "Iced coffee drink with purple swirls, whipped cream and a Biscoff crumble rim, served with a Biscoff biscuit" },
  { id: "drink-purple-matcha", file: "new photos/purple-matcha-latte.jpeg", category: "drinks", alt: "Iced purple latte over matcha, topped with whipped cream and biscuit crumbs" },
  { id: "drink-pistachio-latte", file: "new photos/pistachio-latte.jpeg", category: "drinks", alt: "Extra pistachio latte topped with whipped cream and crushed pistachios in a La Bonne Crêpe glass" },
  { id: "drink-macchiato", file: "new photos/macchiato.jpeg", category: "drinks", alt: "Layered macchiato in a glass cup with a chocolate drizzle on the foam, served with a Biscoff biscuit" },
  { id: "drink-cappuccino", file: "new photos/cappuccino.jpeg", category: "drinks", alt: "Cappuccino with cocoa-dusted foam in a glass cup, served with a Biscoff biscuit" },
  // Desserts
  { id: "dessert-chocolate-mousse", file: "new photos/chocolate-mousse.jpeg", category: "desserts", alt: "Handcrafted chocolate mousse in a fluted glass with chocolate drizzle and fresh mint" },
  { id: "dessert-caramel-flan", file: "new photos/caramel-flan.jpeg", category: "desserts", alt: "Caramel flan in a pool of golden caramel sauce, topped with whipped cream" },
  { id: "dessert-apple-crumble", file: "new photos/apple-crumble.jpeg", category: "desserts", alt: "Golden apple crumble baked in a white ramekin, garnished with fresh mint" },
  { id: "dessert-milky-way-pudding-rice", file: "new photos/milky-way-pudding-rice.jpeg", category: "desserts", alt: "Milky way pudding rice: red berry jelly, vanilla rice pudding and blue spirulina whipped cream with fresh strawberries" },
  { id: "dessert-creme-brulee", file: "new photos/creme-brulee.jpeg", category: "desserts", alt: "Crème brûlée with a caramelized sugar crust, topped with a strawberry, blackberry and mint" },
  // Behind the scenes
  { id: "cart-counter", file: "food images/8f0973e3-c89d-43de-a972-75ac092836fd.jpeg", category: "behind", alt: "The Gourmet Cart counter with house-made syrups, organic protein, and glowing neon signs among Miami palms" },
  { id: "romain-sauce", file: "RALV2246.jpg", category: "behind", alt: "Romain Courcier preparing a drink beside a fresh crêpe on the griddle at a Miami farmers market" },
  { id: "romain-pour", file: "RALV2252.jpg", category: "behind", alt: "Romain pouring caramel sauce while a thin crêpe cooks on the cast iron griddle" },
  { id: "romain-flip", file: "RALV2873.jpg", category: "behind", alt: "Romain Courcier turning a golden crêpe by hand on the griddle of his market cart" },
];

async function ensureDirs() {
  for (const d of ["food", "logos", "hero", "og", "menu"]) {
    await mkdir(path.join(OUT, d), { recursive: true });
  }
}

async function blurDataURL(input) {
  const buf = await sharp(input).resize(16, null, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function processPhotos() {
  const manifest = {};
  for (const p of PHOTOS) {
    const input = path.join(SRC, p.file);
    const outFile = path.join(OUT, "food", `${p.id}.webp`);
    const img = sharp(input).rotate(); // respect EXIF
    const meta = await img.metadata();
    const targetWidth = Math.min(1600, meta.width ?? 1600);
    const info = await img
      .resize(targetWidth, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(outFile);
    manifest[p.id] = {
      src: `/assets/food/${p.id}.webp`,
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

/** Remove near-white background: alpha from max channel darkness, color un-tinted. */
async function whiteToAlpha(input, output, maxWidth) {
  const base = sharp(input).rotate().resize(maxWidth, null, { fit: "inside", withoutEnlargement: true });
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;
  const out = Buffer.alloc(px * 4);
  for (let i = 0; i < px; i++) {
    const r = data[i * info.channels];
    const g = data[i * info.channels + 1];
    const b = data[i * info.channels + 2];
    // Alpha: how far the darkest channel is from pure white.
    const a = Math.min(255, Math.round((255 - Math.min(r, g, b)) * 1.08));
    out[i * 4] = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
    out[i * 4 + 3] = a;
  }
  const result = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(output);
  console.log(`logo ${path.basename(output)}: ${result.width}x${result.height} ${(result.size / 1024).toFixed(0)}kb`);
  return result;
}

async function processLogos() {
  const manifest = {};
  const logos = [
    { id: "logo-gold", file: "logo1.jpeg", width: 800 },
    { id: "logo-neon", file: "logo.jpeg", width: 800 },
    { id: "logo-classic", file: "logo2.jpeg", width: 800 },
  ];
  for (const l of logos) {
    const outFile = path.join(OUT, "logos", `${l.id}.webp`);
    const info = await whiteToAlpha(path.join(SRC, l.file), outFile, l.width);
    manifest[l.id] = { src: `/assets/logos/${l.id}.webp`, width: info.width, height: info.height };
  }
  // Favicon / app icons from the gold badge (kept on cream so it reads at small sizes)
  await sharp(path.join(SRC, "logo1.jpeg"))
    .resize(512, 512, { fit: "cover" })
    .png()
    .toFile(path.join(ROOT, "src", "app", "icon.png"));
  await sharp(path.join(SRC, "logo1.jpeg"))
    .resize(180, 180, { fit: "cover" })
    .png()
    .toFile(path.join(ROOT, "src", "app", "apple-icon.png"));
  return manifest;
}

async function processHero() {
  const manifest = {};
  // Desktop hero: landscape action shot, cinematic 16:9 crop, slightly darkened for text overlay
  const heroDesktop = path.join(OUT, "hero", "hero-desktop.webp");
  let info = await sharp(path.join(SRC, "RALV2873.jpg"))
    .rotate()
    .resize(2400, 1350, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.82, saturation: 1.02 })
    .webp({ quality: 74 })
    .toFile(heroDesktop);
  manifest["hero-desktop"] = {
    src: "/assets/hero/hero-desktop.webp", width: info.width, height: info.height,
    blurDataURL: await blurDataURL(heroDesktop),
  };
  // Mobile hero: portrait crop of the same moment
  const heroMobile = path.join(OUT, "hero", "hero-mobile.webp");
  info = await sharp(path.join(SRC, "RALV2246.jpg"))
    .rotate()
    .resize(1080, 1620, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.8, saturation: 1.02 })
    .webp({ quality: 74 })
    .toFile(heroMobile);
  manifest["hero-mobile"] = {
    src: "/assets/hero/hero-mobile.webp", width: info.width, height: info.height,
    blurDataURL: await blurDataURL(heroMobile),
  };
  // Open Graph share image
  await sharp(path.join(SRC, "food images/934a9ba2-767b-467e-abd3-2a3b868240b4.jpeg"))
    .rotate()
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .webp({ quality: 80 })
    .toFile(path.join(ROOT, "public", "og-image.webp"));
  console.log("hero + og done");
  return manifest;
}

/** Printed food menu, shown in the menu section (the table QR codes open /#menu). */
async function processMenu() {
  const input = path.join(SRC, "food-menu.jpeg");
  const outFile = path.join(OUT, "menu", "food-menu.webp");
  // Full resolution and high quality: the menu text has to stay legible.
  const info = await sharp(input).rotate().webp({ quality: 90 }).toFile(outFile);
  console.log(`menu food-menu: ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}kb`);
  return {
    "food-menu": {
      src: "/assets/menu/food-menu.webp", width: info.width, height: info.height,
      blurDataURL: await blurDataURL(input),
    },
  };
}

async function main() {
  await ensureDirs();
  const photos = await processPhotos();
  const logos = await processLogos();
  const hero = await processHero();
  const menu = await processMenu();
  await copyFile(path.join(SRC, "MENU FIN  (1).pdf"), path.join(ROOT, "public", "MENU-FIN.pdf"));
  const manifest = { photos, logos, hero, menu };
  await mkdir(path.join(ROOT, "src", "data"), { recursive: true });
  await writeFile(
    path.join(ROOT, "src", "data", "image-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log("manifest written; menu PDF copied");
}

main().catch((e) => { console.error(e); process.exit(1); });
