import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { writeFile, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

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

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ─── IPC: Export CSV ─────────────────────────────────────────────
ipcMain.handle('export-csv', async (_event, { defaultName, csvContent }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Exportar CSV',
    defaultPath: defaultName || 'export.csv',
    filters: [{ name: 'CSV', extensions: ['csv'] }],
  })
  if (canceled || !filePath) return { success: false }
  await writeFile(filePath, '\uFEFF' + csvContent, 'utf-8') // BOM for Excel
  return { success: true, filePath }
})

// ─── IPC: Respaldo ─────────────────────────────────────────────────────
ipcMain.handle('backup-data', async (_event, jsonData) => {
  const timestamp = new Date().toISOString().slice(0, 10)
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Guardar Respaldo',
    defaultPath: `ushuaia-respaldo-${timestamp}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  })
  if (canceled || !filePath) return { success: false }
  await writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8')
  return { success: true, filePath }
})

// ─── IPC: Restore ────────────────────────────────────────────────
ipcMain.handle('restore-data', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Restaurar Respaldo',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile'],
  })
  if (canceled || filePaths.length === 0) return { success: false }
  const raw = await readFile(filePaths[0], 'utf-8')
  const data = JSON.parse(raw)
  return { success: true, data }
})

// ─── IPC: App info ───────────────────────────────────────────────
ipcMain.handle('get-app-version', () => app.getVersion())
