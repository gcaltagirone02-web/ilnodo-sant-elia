// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // SSG — Static Site Generation for max performance (Lighthouse 95+)
  output: "static",
  site: "https://ilnodo.it",

  integrations: [
    sitemap(),
    sanity({
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || "your-project-id",
      dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
      useCdn: true,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // Image optimization — WebP/AVIF auto-generation
  image: {
    domains: ["cdn.sanity.io"],
    remotePatterns: [{ protocol: "https" }],
  },
});
