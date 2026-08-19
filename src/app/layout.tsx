import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import SmoothScroll from "@/lib/SmoothScroll";
import { restaurantJsonLd } from "@/lib/seo";
import { site } from "@/data/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Healthy French Specialities in Miami`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "crêpes Miami",
    "French crêpes",
    "farmers market Miami",
    "catering Miami",
    "healthy French food",
    "recovery lounge",
    "waffles",
    "matcha",
    "cold press juice",
  ],
  openGraph: {
    title: `${site.name} | The first real recovery lounge in Miami`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Strawberry waffle by La Bonne Crêpe de France" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | The first real recovery lounge in Miami`,
    description: site.tagline,
    images: ["/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
