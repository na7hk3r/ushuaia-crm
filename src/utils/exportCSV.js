/**
 * Genera contenido CSV a partir de un array de objetos.
 * @param {Array<Object>} data - Los datos a exportar
 * @param {Array<{key: string, label: string}>} columns - Definición de columnas
 * @returns {string} Contenido CSV
 */
export function generateCSV(data, columns) {
  const header = columns.map(c => `"${c.label}"`).join(',')
  const rows = data.map(row =>
    columns.map(c => {
      const val = typeof c.transform === 'function' ? c.transform(row) : row[c.key]
      const str = String(val ?? '').replace(/"/g, '""')
      return `"${str}"`
    }).join(',')
  )
  return [header, ...rows].join('\r\n')
}

/**
 * Exporta CSV usando la API de Electron (diálogo nativo) o fallback web.
 */
export async function exportCSV(data, columns, defaultName = 'export.csv') {
  const csvContent = generateCSV(data, columns)

  if (window.electronAPI?.isElectron) {
    return window.electronAPI.exportCSV(defaultName, csvContent)
  }

  // Fallback para navegador
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = defaultName
  a.click()
  URL.revokeObjectURL(url)
  return { success: true }
}

/**
 * Respaldo: exportar todos los datos como JSON.
 */
export async function backupData(allData) {
  if (window.electronAPI?.isElectron) {
    return window.electronAPI.backupData(allData)
  }

  const json = JSON.stringify(allData, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ushuaia-respaldo-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  return { success: true }
}

/**
 * Restaurar datos desde un archivo JSON.
 */
export async function restoreData() {
  if (window.electronAPI?.isElectron) {
    return window.electronAPI.restoreData()
  }

  // Fallback para navegador
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return resolve({ success: false })
      const text = await file.text()
      try {
        const data = JSON.parse(text)
        resolve({ success: true, data })
      } catch {
        resolve({ success: false, error: 'Archivo JSON inválido' })
      }
    }
    input.click()
  })
}
