import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tempo } from "tempo-devtools/dist/vite";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tempo(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,mp3,json}"],
        maximumFileSizeToCacheInBytes: 10000000, // 10MB
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        offlineGoogleAnalytics: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "dicebear-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?v=1`;
              },
            },
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "unsplash-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
            },
          },
          {
            urlPattern: /^https:\/\/api\./,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
            },
          },
        ],
      },
      includeAssets: [
        "yacin-gym-logo.png",
        "vite.svg",
        "success-sound.mp3",
        "offline.html",
      ],
      manifest: {
        name: "Yacin Gym - نادي ياسين الرياضي",
        short_name: "YacinGym",
        description:
          "تطبيق إدارة نادي ياسين الرياضي - إدارة الأعضاء والمدفوعات والحضور",
        theme_color: "#1E293B",
        background_color: "#0F172A",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        lang: "ar",
        dir: "rtl",
        categories: ["fitness", "sports", "business"],
        icons: [
          {
            src: "yacin-gym-logo.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "yacin-gym-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router", "react-router-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-toast",
            "@radix-ui/react-avatar",
            "@radix-ui/react-button",
          ],
          motion: ["framer-motion"],
          utils: ["localforage", "date-fns", "clsx", "tailwind-merge"],
          icons: ["lucide-react"],
        },
      },
    },
    sourcemap: false,
    minify: "terser",
    target: "es2020",
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "localforage",
      "lucide-react",
    ],
  },
});
