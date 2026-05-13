import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.js',
        onstart() {},
        vite: {
          build: {
            rollupOptions: { external: ['electron', 'electron-updater'] },
            outDir: 'dist-electron',
          },
        },
      },
      {
        entry: 'electron/preload.js',
        onstart() {},
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
    ]),
  ],
})
