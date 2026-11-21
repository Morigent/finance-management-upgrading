import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Finance data is never served from a cache (PRD 9.1): pages are dynamic and
  // every request re-reads the API, so the cache-components model is off.
  cacheComponents: false,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
