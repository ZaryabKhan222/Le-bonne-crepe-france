import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Keep Turbopack rooted here even though a stray lockfile exists in the
  // parent user directory.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
