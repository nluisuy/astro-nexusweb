// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://www.nexusinnovations.com",
    // Astro 5.x: output: "static" (default) with prerender: false on API routes
    // Node adapter is required for server-rendered routes
    adapter: node({
        mode: "standalone",
    }),
    integrations: [
        react(),
        sitemap({
            changefreq: "weekly",
            priority: 0.7,
            lastmod: new Date(),
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
});
