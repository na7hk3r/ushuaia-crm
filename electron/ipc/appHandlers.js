import { createRequire } from 'node:module'
import updater from 'electron-updater'

const require = createRequire(import.meta.url)
const { ipcMain, app, shell } = require('electron')

const ALLOWED_ORIGINS = [
  'https://na7hk3r.github.io',
  'https://github.com',
  'https://smcurbelo.vercel.app',
]

export function registerAppHandlers() {
  ipcMain.handle('get-app-version', () => app.getVersion())

  ipcMain.handle('restart-for-update', () => {
    updater.autoUpdater.quitAndInstall()
  })

  ipcMain.handle('open-external', async (_event, url) => {
    try {
      const parsed = new URL(url)
      if (parsed.protocol !== 'https:') return
      if (!ALLOWED_ORIGINS.some(o => url.startsWith(o))) return
      await shell.openExternal(url)
    } catch { /* invalid URL — ignore */ }
  })
}
