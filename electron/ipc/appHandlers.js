import { ipcMain, app } from 'electron'
import updater from 'electron-updater'

const { autoUpdater } = updater

export function registerAppHandlers() {
  ipcMain.handle('get-app-version', () => app.getVersion())

  ipcMain.handle('restart-for-update', () => {
    autoUpdater.quitAndInstall()
  })
}
