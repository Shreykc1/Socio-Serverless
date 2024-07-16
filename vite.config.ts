import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import Checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'Socio',
        short_name: 'Socio',
        description: 'Socio - Your own social media app.',
        theme_color: '#010101',
        icons: [
          {
            src: 'main_logo.svg',
            sizes: '192x192',
            type: 'image/svg'
          },
          {
            src: 'main_logo.svg',
            sizes: '512x512',
            type: 'image/svg'
          },
          {
            src: 'main_logo.svg',
            sizes: '512x512',
            type: 'image/svg',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        swDest: './src/sw.ts'
      }
    }),
    Checker({ typescript: true })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
