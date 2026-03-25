import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    electron([
      {
        entry: 'electron/main.js',
        vite: {
          build: {
            rollupOptions: { external: ['electron'] },
            outDir: 'dist-electron',
          },
        },
      },
      {
        entry: 'electron/preload.js',
        onstart(args) { args.reload() },
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
    ]),
    renderer(),
  ],
})
