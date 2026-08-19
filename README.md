# La Bonne Crêpe de France — Website

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
| `RESEND_FROM_EMAIL` | Optional | Verified sender, e.g. `"La Bonne Crêpe <contact@yourdomain.com>"`. Until the domain is verified in Resend, leave unset to use Resend's onboarding sender. |

Without these, the site runs fine but the form returns a friendly error pointing visitors to WhatsApp.

## Updating the menu (no code knowledge needed)

Everything on the menu comes from **one file**: [`src/data/menu.ts`](src/data/menu.ts).

- Change a price: edit the `price` number.
- Add an item: copy an existing `{ name, price, description }` line inside the right category.
- An item without a settled price: set `price: null` and the site shows "ask".
- Remove an item or category: delete its block.

Also replace **`public/MENU-FIN.pdf`** with the new printed menu so the "Download Menu (PDF)" button stays current.

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
