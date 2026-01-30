// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: vercel(),
    outDir: "dist",
    site: "https://astro-nexusweb.vercel.app/",

    // Optimizaciones para imágenes locales
    image: {
        service: {
            entrypoint: "astro/assets/services/sharp", // Para mejor performance con imágenes
        },
    },

    build: {
        assets: "assets",
        inlineStylesheets: "auto", // CSS crítico inline
        format: "file", // Genera archivo HTML estático
    },

    // Compresión HTML
    compressHTML: true,

    vite: {
        plugins: [tailwindcss()],
        // Optimizaciones adicionales para el build
        build: {
            cssCodeSplit: false, // Un solo archivo CSS
            rollupOptions: {
                output: {
                    assetFileNames: "assets/[name].[hash][extname]",
                },
            },
        },

        // Pre-optimiza React para mejor performance
        optimizeDeps: {
            include: ["react", "react-dom"],
        },
    },

    integrations: [
        react(),
        sitemap(),
        partytown({
            config: {
                forward: ["dataLayer.push"],
            },
        }),
    ],

    // Prefetch para recursos
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "viewport",
    },
});
