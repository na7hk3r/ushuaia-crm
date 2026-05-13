import updater from 'electron-updater'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { ipcMain } = require('electron')

export function initAutoUpdater(mainWindow, { autoCheck = true } = {}) {
  const { autoUpdater } = updater

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

  ipcMain.handle('start-update-download', async () => {
    try {
      await autoUpdater.downloadUpdate()
      return { success: true }
    } catch (err) {
      mainWindow.webContents.send('update-error', {
        message: err.message || 'No se pudo descargar la actualizacion',
      })
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('check-for-updates', async () => {
    mainWindow.webContents.send('update-checking')

    if (!autoCheck) {
      mainWindow.webContents.send('update-error', {
        message: 'Las actualizaciones solo estan disponibles en la version instalada',
      })
      return { success: false }
    }

    try {
      await autoUpdater.checkForUpdates()
      return { success: true }
    } catch (err) {
      mainWindow.webContents.send('update-error', {
        message: err.message || 'No se pudo buscar actualizaciones',
      })
      return { success: false, error: err.message }
    }
  })

  if (autoCheck) {
    mainWindow.webContents.once('did-finish-load', () => {
      setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 3000)
    })
    setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 30 * 60 * 1000)
  }
}
