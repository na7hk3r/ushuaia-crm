import { ipcMain, app, shell } from 'electron'
import updater from 'electron-updater'

const { autoUpdater } = updater

const ALLOWED_ORIGINS = [
  'https://na7hk3r.github.io',
  'https://github.com',
]

export function registerAppHandlers() {
  ipcMain.handle('get-app-version', () => app.getVersion())

  ipcMain.handle('restart-for-update', () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.handle('open-external', (_event, url) => {
    try {
      const parsed = new URL(url)
      if (parsed.protocol !== 'https:') return
      if (!ALLOWED_ORIGINS.some(o => url.startsWith(o))) return
      shell.openExternal(url)
    } catch { /* invalid URL — ignore */ }
  })
}
