import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF where supported, WebP otherwise; sources are already WebP.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  // Keep Turbopack rooted here even though a stray lockfile exists in the
  // parent user directory.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
