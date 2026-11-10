# La Bonne Crêpe de France, Website

Marketing site for **La Bonne Crêpe de France LLC**, Miami's first real recovery lounge: healthy French specialities and natural drinks, served at farmers markets and private events.

Built with Next.js (App Router, TypeScript), Tailwind CSS, Framer Motion, GSAP ScrollTrigger, Lenis smooth scrolling, React Three Fiber (3D gold particle hero), and Resend for the contact form.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

`npm run build` creates the production build; `npm start` serves it.

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes, for the contact form | API key from [resend.com](https://resend.com) |
| `CONTACT_TO_EMAIL` | Yes, for the contact form | Inbox that receives inquiries |
| `NEXT_PUBLIC_SITE_URL` | Yes, for the QR codes | Public base URL with no trailing slash. The `/qr` page bakes it into the printable QR codes, so set the final domain (locally and in Vercel) before printing. |
| `RESEND_FROM_EMAIL` | Optional | Verified sender, e.g. `"La Bonne Crêpe <contact@yourdomain.com>"`. Until the domain is verified in Resend, leave unset to use Resend's onboarding sender. |

Without these, the site runs fine but the form returns a friendly error pointing visitors to WhatsApp.

## Updating the menu (no code knowledge needed)

Everything on the menu comes from **one file**: [`src/data/menu.ts`](src/data/menu.ts), which holds two lists: `foodMenu` and `drinkMenu`. Both are rendered in the single scrollable Menu section, food first.

- Change a price: edit the `price` string, e.g. `"$12"`. Anything that is not a dollar amount (`"MP"`, `"Seasonal"`) is shown as written.
- Add an item: copy an existing `{ name, description, price }` line inside the right category.
- Add a category: copy a whole `{ id, title, subtitle, items }` block. Categories flow through the columns in the order listed.
- `milkNote` is the line shown under the menu.

The designed menu boards live in `resource/menu/` (`food-menu.jpeg` and the drink menu JPEG). After replacing either, run `node scripts/optimize-cafe-assets.mjs`, which copies them to `public/assets/menu/food-menu.jpg` and `drink-menu.jpg` and makes the crisp WebP versions used by the "View food menu" and "View drink menu" lightboxes.

## Printable QR codes

Open `/qr` (not linked from the navigation) for two branded QR codes: one that opens the homepage and one that opens the menu section. Each card offers a 1200 px PNG and an SVG download. The codes encode `NEXT_PUBLIC_SITE_URL` at build time, so they only work once that variable holds the final live domain and the site has been redeployed.

## Grand opening, memberships and other launch settings

All in [`src/data/site.ts`](src/data/site.ts):

- `grandOpening`: headline, date, copy for the gold announcement bar, the hero callout and the Grand Opening section. The bar and hero callout hide themselves after `showUntil`; delete the `<GrandOpening />` line in `src/app/page.tsx` when the section is no longer wanted.
- `MEMBERSHIP_URL`: replace the `PLACEHOLDER` link with the Square membership link. Until then the Memberships button opens a WhatsApp chat instead of a dead link.

## Photos and video

- `node scripts/optimize-images.mjs` processes the original market photos and logos (`resource/`).
- `node scripts/optimize-cafe-assets.mjs` processes the café photos in `resource/cafe-images/` and the drink menu image, writing WebP files to `public/assets/cafe` and the manifest `src/data/cafe-manifest.json` (alt text lives in the script). The two labeled Signature Creations images are kept at full resolution.
- `node scripts/encode-hero-video.mjs` turns `resource/video/IMG_1429.MP4` into the muted hero loops (`public/assets/hero/hero-loop.mp4` for desktop, `hero-loop-portrait.mp4` for phones) plus the poster frames shown before playback and for reduced motion or Data Saver. It needs ffmpeg: run `npm i --no-save ffmpeg-static` once (kept out of `package.json` so deploys never download a binary), or set `FFMPEG_PATH`.

Note: the printed PDF has no crêpes list, so the Crêpes category currently contains signature items with `price: null` as clearly marked placeholders. Fill in the real list and prices in `src/data/menu.ts` when ready.

## Swapping the primary logo

In [`src/data/site.ts`](src/data/site.ts), change:

```ts
export const PRIMARY_LOGO: "gold" | "neon" = "gold";
```

to `"neon"` to lead with the neon-sign logo in the header. The footer always shows the neon sign; the gold badge is the default header mark for the elegant theme.

## Other things the owner may want to change

All in [`src/data/site.ts`](src/data/site.ts): phone number, WhatsApp link, Instagram/Facebook URLs, the Google review link (a direct `g.page` review link is marked with a TODO), the production domain (`site.url`, used for SEO tags and the sitemap), and the VoyageMIA press link.

Photos live in `public/assets/`. They were generated from the originals by `scripts/optimize-images.mjs`; to add new photos, drop originals in `resource/`, register them in that script, and run `node scripts/optimize-images.mjs`.

## Deploying to Vercel

1. Push this repository to GitHub.
2. In [vercel.com](https://vercel.com), "Add New Project", import the repo. Vercel detects Next.js automatically; no build settings needed.
3. Add the environment variables from `.env.example` under Project Settings, then deploy.
4. Point the custom domain at Vercel and update `site.url` in `src/data/site.ts`.
5. For branded email later: verify the domain in Resend and set `RESEND_FROM_EMAIL`.

## Performance and accessibility notes

- All images are pre-optimized WebP with blur placeholders and lazy loading; the multi-MB originals never ship.
- The Three.js hero lazy-loads after first paint, caps device pixel ratio at 1.5, pauses off-screen, and is skipped entirely on low-power devices and for `prefers-reduced-motion` (a CSS shimmer takes its place).
- Smooth scrolling (Lenis) and scroll animations are disabled for `prefers-reduced-motion`.
- The gallery lightbox and mobile menu are keyboard accessible (Esc to close, arrows to navigate).
- Contact form includes a honeypot and per-IP rate limiting on the API route.
