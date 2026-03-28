import updater from 'electron-updater'
import { ipcMain } from 'electron'

const { autoUpdater } = updater

export function initAutoUpdater(mainWindow, { autoCheck = true } = {}) {
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

  ipcMain.handle('check-for-updates', async () => {
    mainWindow.webContents.send('update-checking')
    try {
      await autoUpdater.checkForUpdates()
    } catch (err) {
      mainWindow.webContents.send('update-error', {
        message: autoCheck
          ? err.message
          : 'Las actualizaciones solo están disponibles en la versión instalada',
      })
    }
  })

  if (autoCheck) {
    mainWindow.webContents.once('did-finish-load', () => {
      setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 3000)
    })
    setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 30 * 60 * 1000)
  }
}
