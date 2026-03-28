import { ipcMain, dialog } from 'electron'
import { writeFile, readFile } from 'node:fs/promises'

export function registerFileHandlers(mainWindow) {
  // ─── Export CSV ─────────────────────────────────────────────
  ipcMain.handle('export-csv', async (_event, { defaultName, csvContent }) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Exportar CSV',
      defaultPath: defaultName || 'export.csv',
      filters: [{ name: 'CSV', extensions: ['csv'] }],
    })
    if (canceled || !filePath) return { success: false }
    await writeFile(filePath, '\uFEFF' + csvContent, 'utf-8')
    return { success: true, filePath }
  })

  // ─── Respaldo ───────────────────────────────────────────────
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

  // ─── Restore ────────────────────────────────────────────────
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
}
