import updater from 'electron-updater'
import { ipcMain } from 'electron'

const { autoUpdater } = updater

export function initAutoUpdater(mainWindow) {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-available', {
      version: info.version,
      releaseNotes: info.releaseNotes,
    })
  })

  autoUpdater.on('update-not-available', (info) => {
    mainWindow.webContents.send('update-not-available', {
      version: info.version,
    })
  })

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('update-progress', {
      percent: Math.round(progress.percent),
    })
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded')
  })

  autoUpdater.on('error', (err) => {
    console.error('Auto-updater error:', err.message)
    mainWindow.webContents.send('update-error', {
      message: err.message,
    })
  })

  ipcMain.handle('start-update-download', () => {
    autoUpdater.downloadUpdate()
  })

  ipcMain.handle('check-for-updates', () => {
    autoUpdater.checkForUpdates()
  })

  autoUpdater.checkForUpdates()

  // Re-check every 30 minutes
  setInterval(() => autoUpdater.checkForUpdates(), 30 * 60 * 1000)
}
