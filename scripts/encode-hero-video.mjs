/**
 * Encodes the hero walkthrough video for the web.
 *
 * Source: resource/video/IMG_1429.MP4 (portrait 1440x2560, 30 fps, ~29 s, 56 MB)
 * Output: public/assets/hero/
 *   hero-loop.mp4    H.264, landscape 4:3 center crop, 24 fps, muted, ~2.5 Mbps
 *   hero-loop-portrait.mp4  H.264, full portrait frame scaled to 720x1280 for phones
 *   hero-poster.webp landscape poster frame (also the reduced-motion fallback)
 *   hero-poster-mobile.webp portrait still for phones (poster and reduced-motion fallback)
 *
 * Run with: node scripts/encode-hero-video.mjs
 *
 * Needs an ffmpeg binary. It is resolved, in order, from the FFMPEG_PATH
 * environment variable, the optional ffmpeg-static package
 * (`npm i --no-save ffmpeg-static` once, kept out of package.json so deploys
 * never download a binary), or `ffmpeg` on the PATH.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const ffmpeg = (() => {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  try {
    return require("ffmpeg-static");
  } catch {
    return "ffmpeg";
  }
})();

const ROOT = process.cwd();
const SRC = path.join(ROOT, "resource", "video", "IMG_1429.MP4");
const OUT = path.join(ROOT, "public", "assets", "hero");

// Portrait source is 1440x2560. A 4:3 band from the middle keeps the tables,
// lamps and signage in frame while downloading a fraction of the pixels. The
// band is taller than 16:9 on purpose: laptops (16:10, 3:2) and tablets then
// show it without upscaling, which is what made the hero feel zoomed in.
const CROP_W = 1440;
const CROP_H = 1080;
const CROP_Y = Math.round((2560 - CROP_H) / 2);
const DURATION = 28.66;
const FADE = 0.5;
// Frame used for the poster (30 fps source): the bar counter under warm light
// at about 13.5 s. Selected by frame number because -ss seeking lands off by
// half a second on this file.
const POSTER_FRAME = 405;
const posterSelect = `select='eq(n\,${POSTER_FRAME})'`;

const fades = [
  "fps=24",
  `fade=t=in:st=0:d=${FADE}`,
  `fade=t=out:st=${(DURATION - FADE).toFixed(2)}:d=${FADE}`,
  "format=yuv420p",
];
// Phones get the whole portrait frame, scaled down: the hero is 100svh tall on
// a 390 px wide screen, so 720x1280 is plenty under the dark overlay.
const portraitFilter = ["scale=720:1280", ...fades].join(",");

const landscapeFilter = [
  `crop=${CROP_W}:${CROP_H}:0:${CROP_Y}`,
  "fps=24",
  `fade=t=in:st=0:d=${FADE}`,
  `fade=t=out:st=${(DURATION - FADE).toFixed(2)}:d=${FADE}`,
  "format=yuv420p",
].join(",");

function run(args, label) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const p = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
    p.on("exit", (code) => {
      if (code === 0) {
        console.log(`${label}: done in ${((Date.now() - started) / 1000).toFixed(0)}s`);
        resolve();
      } else reject(new Error(`${label} failed with exit code ${code}`));
    });
  });
}

async function size(file) {
  const s = await stat(file);
  return `${(s.size / 1024 / 1024).toFixed(2)} MB`;
}

async function blurDataURL(input) {
  const buf = await sharp(input).resize(16, null, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // 1. Poster frames first (fast) so the page has a fallback even if encoding is interrupted.
  const posterRaw = path.join(OUT, "poster-raw.png");
  await run(["-i", SRC, "-vf", `${posterSelect},crop=${CROP_W}:${CROP_H}:0:${CROP_Y}`, "-vsync", "vfr", "-frames:v", "1", posterRaw], "poster frame");
  const poster = path.join(OUT, "hero-poster.webp");
  const posterInfo = await sharp(posterRaw)
    .modulate({ brightness: 0.9 })
    .webp({ quality: 72 })
    .toFile(poster);

  const posterMobileRaw = path.join(OUT, "poster-mobile-raw.png");
  await run(["-i", SRC, "-vf", posterSelect, "-vsync", "vfr", "-frames:v", "1", posterMobileRaw], "mobile poster frame");
  const posterMobile = path.join(OUT, "hero-poster-mobile.webp");
  const mobileInfo = await sharp(posterMobileRaw)
    .resize(1080, 1920, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.88 })
    .webp({ quality: 72 })
    .toFile(posterMobile);

  const manifest = {
    "hero-poster": {
      src: "/assets/hero/hero-poster.webp",
      width: posterInfo.width,
      height: posterInfo.height,
      blurDataURL: await blurDataURL(poster),
    },
    "hero-poster-mobile": {
      src: "/assets/hero/hero-poster-mobile.webp",
      width: mobileInfo.width,
      height: mobileInfo.height,
      blurDataURL: await blurDataURL(posterMobile),
    },
  };
  await writeFile(path.join(ROOT, "src", "data", "hero-video-manifest.json"), JSON.stringify(manifest, null, 2));
  await Promise.all([
    import("node:fs/promises").then((fs) => fs.rm(posterRaw, { force: true })),
    import("node:fs/promises").then((fs) => fs.rm(posterMobileRaw, { force: true })),
  ]);
  console.log("posters written");

  // 2. H.264 for every browser. CRF 30 at 1440x1080 lands around 2.5 Mbps.
  const mp4 = path.join(OUT, "hero-loop.mp4");
  await run(
    [
      "-i", SRC, "-an",
      "-vf", landscapeFilter,
      "-c:v", "libx264", "-preset", "slow", "-crf", "30",
      "-profile:v", "high", "-level", "4.0",
      "-movflags", "+faststart",
      mp4,
    ],
    "hero-loop.mp4"
  );
  console.log("mp4 size:", await size(mp4));

  // 3. Portrait loop for phones.
  const portrait = path.join(OUT, "hero-loop-portrait.mp4");
  await run(
    [
      "-i", SRC, "-an",
      "-vf", portraitFilter,
      "-c:v", "libx264", "-preset", "slow", "-crf", "30",
      "-profile:v", "high", "-level", "4.0",
      "-movflags", "+faststart",
      portrait,
    ],
    "hero-loop-portrait.mp4"
  );
  console.log("portrait mp4 size:", await size(portrait));

  // A VP9 WebM was tried too and came out larger than the H.264 file for this
  // footage, so the site ships the MP4 alone.
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
