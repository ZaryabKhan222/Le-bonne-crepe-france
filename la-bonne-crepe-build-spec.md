# La Bonne Crêpe de France — Website Build Specification

## Role and Objective

You are building a modern, premium, animated marketing website for **La Bonne Crêpe de France LLC**, a French crêpe and healthy-cuisine business in Miami that positions itself as the **"first real recovery lounge in Miami."** This is a portfolio and lead generation website. Build it end to end, production ready, mobile first, and deployable to Vercel.

Work autonomously. Make sensible decisions where this spec is silent, but do not remove or downgrade any listed feature. When you finish a section, verify it renders correctly on both mobile and desktop before moving on.

---

## Brand Story (use this exact context for copy)

The owner is **Romain Courcier** (co-owner with **Karen Courcier**). His story is the emotional core of the site and must be featured prominently:

- Veteran of the **French special forces**
- Professional **fighter and combat sports trainer**
- Trained at one of the **biggest culinary universities in France**, with **10+ years** in the restaurant industry
- Founded **La Bonne Crêpe de France LLC**, operating for **2+ years**
- Operates across the **Miami area at farmers' markets** and offers **private event catering**
- The **Recovery Lounge** concept unites his two passions: French cuisine and combat sports recovery
- Brand tagline: **"Healthy French Specialities and Natural Drinks"**
- Menu categories: **Crêpes · Waffles · Salads · Coffee** (plus matcha, cold-pressed juices, natural drinks)

Tone of copy: premium but warm, authentic, confident. Lean into the French heritage and the unique "recovery lounge" angle. Do not write generic filler. Avoid clichés like "come and enjoy."

**Important copy rule: Do not use em dashes anywhere in the website copy. Use commas, colons, or periods instead.**

---

## Design Direction

### Aesthetic
Premium French bistro meets modern Miami wellness. Think elegant, editorial, and clean, with a luxury feel driven by whitespace, refined typography, and high-quality food photography. The reference standard is Awwwards-level restaurant sites (Beefbar, Canlis, Dishoom): smooth scrolling, cinematic photography, restrained but memorable motion.

### Color Palette (brand colors: marble and gold)
```
--gold-primary:   #C9A34E   /* primary gold, from the logo */
--gold-light:     #E4CD8E   /* highlights, hovers */
--gold-deep:      #A07C2C   /* pressed states, accents */
--marble-white:   #F7F5F0   /* warm off-white base */
--marble-grey:    #E9E6DF   /* section alternation */
--charcoal:       #1A1A1A   /* primary text, dark sections */
--ink:            #2C2C2C   /* body text */
--cream:          #FBFAF7   /* card backgrounds */
```
Use a subtle real marble texture (very low opacity) as an occasional section background, never so busy it hurts readability. Gold is an accent, not a flood: use it for headings' underlines, buttons, dividers, icons, and hover states.

### Typography
- **Headings:** an elegant high-contrast serif (e.g. Playfair Display, Cormorant Garamond, or Fraunces) for that French editorial feel
- **Body:** a clean, highly legible sans-serif (e.g. Inter, Satoshi, or Manrope)
- Use generous line-height and letter-spacing on headings. Large, confident type in the hero.
- Load fonts via `next/font` for performance.

### Layout
- Single-page long-scroll with anchored nav, plus a route for the full menu if it grows.
- Sticky, transparent-to-solid header on scroll with the logo and nav links (Story, Menu, Gallery, Catering, Contact).
- Mobile: off-canvas hamburger menu, a sticky "Order / Contact" or WhatsApp button.

---

## Tech Stack

- **Next.js 14+ (App Router) + TypeScript**
- **Tailwind CSS** for styling (define the palette above as CSS variables and Tailwind theme tokens)
- **Framer Motion (Motion)** for UI/component animations, page transitions, modals, drawers
- **GSAP + ScrollTrigger** (with `@gsap/react` `useGSAP`) for scroll-driven hero and section reveals
- **Lenis** for smooth scrolling, globally in the root layout, driven from `gsap.ticker`
- **React Three Fiber (@react-three/fiber) + Drei** for the 3D hero moment
- **Resend** for the contact form email delivery (via a Next.js API route / server action)
- **react-hook-form + zod** for form handling and validation
- Deploy target: **Vercel**

### Animation architecture (follow this layering)
1. Lenis first, globally, synced to GSAP ticker.
2. Framer Motion for all React component motion (nav, cards, drawer, hover).
3. GSAP ScrollTrigger for staged section entrances and pinned reveals.
4. R3F/Three.js only where it earns its payload (the hero). Keep the payload small.

---

## 3D Hero (Three.js / R3F)

Build a memorable but performant 3D hero moment. Pick the option you can execute cleanly:

**Preferred concept:** A slow-rotating, softly-lit 3D scene evoking a French crêpe/patisserie moment. Options, in order of preference:
1. A subtle floating arrangement of the brand elements (a plated crêpe, a coffee cup with drifting steam particles, gold flecks/dust floating in light) with gentle parallax that responds to cursor and scroll.
2. If a 3D food model is too heavy, use a **gold particle field / bokeh light shader** drifting over a full-bleed hero food image, with the headline animating in over it. This is lighter and still looks premium.

Requirements:
- Must degrade gracefully: detect low-power/mobile devices and reduced-motion preference, and fall back to a static high-quality hero image with a CSS-only shimmer. Respect `prefers-reduced-motion`.
- Cap the device pixel ratio (dpr) and pause the render loop when the hero is off-screen.
- Lazy-load the Three.js bundle so it never blocks first paint.
- Hero headline suggestion: **"La Bonne Crêpe de France"** with subhead **"The first real recovery lounge in Miami"** and two CTAs: **"View Menu"** and **"Book Catering."**

---

## Page Sections (in order)

### 1. Hero
3D/animated hero as above. Logo, headline, subhead, two CTAs, subtle scroll-cue indicator.

### 2. Intro / Brand Statement
A short, bold editorial statement introducing the "recovery lounge" concept and the tagline "Healthy French Specialities and Natural Drinks." Text reveals on scroll (GSAP line-by-line or word stagger). Marble texture background.

### 3. Our Story (Meet Romain & Karen)
The emotional centerpiece. Two-column on desktop (portrait/action photo of Romain cooking on one side, story text on the other), stacked on mobile. Cover: special forces background, professional fighter, French culinary training, the origin of the recovery lounge idea. Use an elegant pull-quote. Animate the image with a subtle parallax and a gold accent line that draws in on scroll.

### 4. Menu
Display the menu grouped by category: **Crêpes, Waffles, Salads, Coffee & Matcha, Cold Press Juice, Water & Soda, Classics**. Each item: name, short description (if available), price.
- **Build the menu from a single structured data file** (`/src/data/menu.ts` or a JSON), so the client can update prices/items later by editing one file with no redesign. This is a hard requirement: he said the menu will change.
- Elegant card or list layout with gold dividers. Hover reveals a subtle lift and gold underline.
- Include a note that the menu PDF is the source of truth; wire in a "Download Menu (PDF)" button that links to the provided PDF in `/public`.
- I will attach the final menu PDF and the extracted items. Populate the data file from that. If the extracted data is incomplete, scaffold the structure with clearly-marked placeholders so it is trivial to fill in.

### 5. Gallery
A masonry or refined grid gallery of the food, drinks, cart, and action shots (all provided as attachments). 
- Lazy-load images, use `next/image` with blur placeholders.
- Subtle staggered reveal on scroll (Framer Motion), gentle zoom on hover.
- Lightbox on click (keyboard accessible, closes on Esc/backdrop).
- Categorize loosely: Crêpes, Waffles, Drinks, Behind the Scenes.

### 6. Catering / Private Events
A dedicated, prominent section since catering is his high-value service. Describe the on-site fresh crêpe experience and the "Gourmet Cart" setup for private events (use the cart photos). Strong CTA: **"Inquire About Catering"** that scrolls to / opens the contact form with the subject preset to "Catering Inquiry."

### 7. Find Us / Farmers Markets
Short section noting he operates across Miami farmers' markets and does private catering. If specific market locations/schedule are provided, list them; otherwise, a clean "Catch us around Miami" statement with the contact CTA. (Optional: an embedded map if an address is provided.)

### 8. Press / Social Proof
Feature the **VoyageMIA** feature ("Exploring Life & Business with Romain Courcier of La Bonne Crêpe De France") as a press badge/quote with a link. Add the **Google review** call to action ("Loved your visit? Leave us a Google review ⭐"). Social proof above the fold of this section builds trust.

### 9. Contact Us (with working email via Resend)
This is the one piece of real backend. Requirements:
- A clean contact form: **Name, Email, Phone (optional), Subject (dropdown: General, Catering Inquiry, Feedback), Message.**
- Validate with react-hook-form + zod.
- Submit to a **Next.js API route or server action** that sends the email via **Resend**. Never expose the Resend API key on the client. Read it from `RESEND_API_KEY` in env.
- Send the inquiry to the client's email (placeholder `CONTACT_TO_EMAIL` env var; I will provide the real address).
- Use a verified sending domain if provided; otherwise use Resend's default onboarding sender and leave a clear TODO comment for domain verification.
- Success and error UI states (Framer Motion toast or inline confirmation). Basic anti-spam (honeypot field + minimal rate limiting).
- Also surface direct contact options: phone (**305 219 1917**, from the menu header, confirm before publishing), and buttons for **Instagram, Facebook, and WhatsApp** (links to be attached).

### 10. Footer
Logo, tagline, nav links, social icons (Instagram, Facebook, Google review), phone, copyright, "Made in Miami with French heart" style line (no em dashes). Include the LLC name.

---

## Assets (attached with this prompt)

I am attaching the following. Place them in `/public/assets/` organized by type:
- **Two logo versions**: the gold badge logo and the neon-sign style logo. Build a small toggle/config constant `PRIMARY_LOGO` so we can switch which one is primary in the header. Default to the gold badge for the elegant theme; the neon version suits dark sections/footer. Test both.
- **Food & drink photos**: crêpes (sweet and savory), waffles, matcha/juice drinks, plated dessert shots.
- **Cart / venue photos**: the "Gourmet Cart" setup, market shots.
- **Action photo**: Romain cooking/preparing crêpes (use in Our Story hero).
- **Menu PDF**: `MENU FIN (1).pdf` (2 pages). Put in `/public` and link from the menu section. Extract items into the menu data file.
- **VoyageMIA press link** and **Linktree/social links** (Instagram, Facebook, Google review) will be attached as text.

Optimize all images: convert to WebP/AVIF where sensible, generate blur placeholders, and never ship multi-MB originals to the browser (several provided photos are 6-8MB, compress them in-build or pre-process).

---

## Performance, SEO, Accessibility (hard requirements)

- **Mobile-first.** Fully responsive from 320px up. Test the 3D and animations on mobile; they must not jank or drain battery. (Mobile users are the majority for restaurant sites.)
- Lighthouse targets: Performance 90+ on desktop, 85+ on mobile; Accessibility 95+.
- Respect `prefers-reduced-motion` everywhere: disable heavy motion and the 3D loop, keep content fully usable.
- Semantic HTML, alt text on all images, keyboard-navigable nav/lightbox/form, visible focus states, sufficient color contrast (gold-on-white must pass; use gold-deep for text).
- SEO: proper `<title>`, meta description (use the tagline), Open Graph tags with a branded share image, favicon from the logo, `sitemap.xml` and `robots.txt`. Add **LocalBusiness / Restaurant JSON-LD** structured data (name, cuisine French, area served Miami, social profiles, price range).
- Lazy-load below-the-fold sections and the Three.js bundle. Preload the hero image/font.

---

## Project Structure (suggested)

```
/src
  /app
    layout.tsx            (Lenis + fonts + metadata + JSON-LD)
    page.tsx              (assembles sections)
    /api/contact/route.ts (Resend handler)
  /components
    /sections  (Hero, Story, Menu, Gallery, Catering, FindUs, Press, Contact, Footer)
    /ui        (Button, Nav, Drawer, Lightbox, MenuCard, Toast)
    /three     (HeroScene, ParticleField, fallbacks)
  /data
    menu.ts               (single source of truth for menu)
    site.ts               (nav, socials, contact, tagline)
  /lib
    lenis.ts, gsap.ts, resend.ts, seo.ts
  /styles
    globals.css           (CSS variables, marble texture)
/public
  /assets  (logos, photos organized)
  MENU-FIN.pdf, og-image, favicon
.env.example              (RESEND_API_KEY, CONTACT_TO_EMAIL, sending domain)
README.md                 (setup, env, how to update the menu, how to deploy)
```

---

## Deliverables

1. A complete, running Next.js app implementing everything above.
2. All animations working and gracefully degrading; no console errors.
3. Menu driven by a single editable data file, plus the PDF linked.
4. Working Resend contact form (with `.env.example` and setup notes).
5. A clear **README** covering: install, env setup, how the client can update the menu/prices, how to swap the primary logo, and how to deploy to Vercel.
6. All images optimized and organized.

Build it to a standard you would be proud to submit to Awwwards, while keeping it fast, accessible, and easy for a non-technical owner to maintain. Prioritize a flawless first impression on mobile.
