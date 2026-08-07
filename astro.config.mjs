// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE_URL, BASE } from "./src/site.config.ts";

export default defineConfig({
  site: SITE_URL,
  base: BASE,
  trailingSlash: "never",
  integrations: [sitemap()],
  build: {
    format: "file",
    inlineStylesheets: "always",
  },
});
