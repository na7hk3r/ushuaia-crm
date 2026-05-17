import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'

function electronDevEnv() {
  const env = { ...process.env }
  delete env.ELECTRON_RUN_AS_NODE
  return env
}

function startElectron({ startup }) {
  startup(undefined, { env: electronDevEnv() })
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.js',
        onstart: startElectron,
        vite: {
          build: {
            rollupOptions: { external: ['electron', 'electron-updater'] },
            outDir: 'dist-electron',
          },
        },
      },
      {
        entry: 'electron/preload.js',
        onstart: startElectron,
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
    ]),
  ],
})
