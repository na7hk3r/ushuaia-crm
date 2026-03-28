import { app, BrowserWindow, shell } from 'electron'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerFileHandlers } from './ipc/fileHandlers.js'
import { registerAppHandlers } from './ipc/appHandlers.js'
import { initAutoUpdater } from './updater.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Ushuaia CRM — Alfajores',
    autoHideMenuBar: true,
    backgroundColor: '#0F172A',
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  registerFileHandlers(mainWindow)
  registerAppHandlers()

  if (!process.env.VITE_DEV_SERVER_URL) {
    initAutoUpdater(mainWindow)
  } else {
    initAutoUpdater(mainWindow, { autoCheck: false })
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
