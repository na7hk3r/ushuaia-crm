import { useState, useRef } from 'react'
import { backupData, restoreData } from '../utils/exportCSV'
import UsageGuide from './UsageGuide'

export default function Settings({ settings, setSettings, allData, onRestore, products }) {
  const [newClientCat, setNewClientCat] = useState('')
  const [newProductCat, setNewProductCat] = useState('')
  const [newProdStatus, setNewProdStatus] = useState('')
  const [newUnit, setNewUnit] = useState('')
  const [message, setMessage] = useState(null)
  const [showGuide, setShowGuide] = useState(false)
  const logoInputRef = useRef(null)

  function updateField(field, value) {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  function addToList(field, value, setter) {
    if (!value.trim()) return
    const lower = value.trim().toLowerCase()
    if (settings[field].includes(lower)) return
    setSettings(prev => ({ ...prev, [field]: [...prev[field], lower] }))
    setter('')
  }

  function removeFromList(field, item) {
    setSettings(prev => ({ ...prev, [field]: prev[field].filter(i => i !== item) }))
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor seleccioná un archivo de imagen (PNG, JPG, etc.)' })
      return
    }
    if (file.size > 512 * 1024) {
      setMessage({ type: 'error', text: 'La imagen no debe superar los 512 KB' })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      updateField('companyLogo', reader.result)
      setMessage({ type: 'success', text: 'Logo actualizado correctamente' })
    }
    reader.readAsDataURL(file)
  }

  function removeLogo() {
    updateField('companyLogo', '')
    if (logoInputRef.current) logoInputRef.current.value = ''
    setMessage({ type: 'success', text: 'Logo eliminado. Se mostrará el emoji por defecto.' })
  }

  async function handleBackup() {
    setMessage(null)
    const result = await backupData(allData)
    if (result.success) {
      setMessage({ type: 'success', text: 'Respaldo guardado correctamente' })
    }
  }

  async function handleRestore() {
    setMessage(null)
    const result = await restoreData()
    if (result.success && result.data) {
      const d = result.data
      if (d.clients && d.products && d.materials && d.production) {
        onRestore(d)
        setMessage({ type: 'success', text: 'Datos restaurados correctamente' })
      } else {
        setMessage({ type: 'error', text: 'El archivo no tiene la estructura esperada' })
      }
    } else if (result.error) {
      setMessage({ type: 'error', text: result.error })
    }
  }

  const currency = settings.currency || '$'
  const productList = products || []

  return (
    <div className="page">
      <div className="page-header">
        <h2>⚙️ Configuración</h2>
      </div>

      {message && (
        <div className="alerts-section" style={{
          borderColor: message.type === 'error' ? 'var(--red)' : 'var(--green)',
          borderLeftColor: message.type === 'error' ? 'var(--red)' : 'var(--green)',
          marginBottom: '24px'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: message.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
            {message.type === 'error' ? '❌' : '✅'} {message.text}
          </p>
        </div>
      )}

      <div className="settings-grid">
        {/* ── Datos de la Empresa ── */}
        <div className="settings-section">
          <h3>🏔️ Datos de la Empresa</h3>
          <div className="form-grid">
            <div className="form-group full">
              <label>Nombre de la empresa</label>
              <input
                value={settings.companyName}
                onChange={e => updateField('companyName', e.target.value)}
                placeholder="Ushuaia Alfajores"
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                value={settings.companyPhone}
                onChange={e => updateField('companyPhone', e.target.value)}
                placeholder="+54 2901..."
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={settings.companyEmail}
                onChange={e => updateField('companyEmail', e.target.value)}
                placeholder="info@ushuaia.com"
              />
            </div>
            <div className="form-group full">
              <label>Dirección</label>
              <input
                value={settings.companyAddress}
                onChange={e => updateField('companyAddress', e.target.value)}
                placeholder="Dirección de la empresa"
              />
            </div>
          </div>
        </div>

        {/* ── Logo de la Empresa ── */}
        <div className="settings-section">
          <h3>🖼️ Logo de la Empresa</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
            Subí el logo de tu empresa. Se mostrará en la barra lateral en lugar del emoji. Formatos aceptados: PNG, JPG. Máximo 512 KB.
          </p>
          <div className="logo-upload-area">
            <div className="logo-preview">
              {settings.companyLogo ? (
                <img src={settings.companyLogo} alt="Logo" className="logo-img" />
              ) : (
                <span className="logo-placeholder">🏔️</span>
              )}
            </div>
            <div className="logo-actions">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
              <button className="btn-primary" onClick={() => logoInputRef.current?.click()}>
                📁 Subir logo
              </button>
              {settings.companyLogo && (
                <button className="btn-ghost" onClick={removeLogo}>
                  🗑️ Quitar logo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Precios y Moneda ── */}
        <div className="settings-section">
          <h3>💲 Precios y Moneda</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Símbolo de moneda</label>
              <input
                value={settings.currency || '$'}
                onChange={e => updateField('currency', e.target.value)}
                placeholder="$"
                maxLength={5}
              />
            </div>
            <div className="form-group">
              <label>Precio por defecto</label>
              <select value={settings.defaultPriceType || 'retail'} onChange={e => updateField('defaultPriceType', e.target.value)}>
                <option value="retail">Minorista</option>
                <option value="wholesale">Mayorista</option>
              </select>
            </div>
            <div className="form-group">
              <label>IVA / Impuesto (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.taxRate ?? 22}
                onChange={e => updateField('taxRate', Number(e.target.value))}
              />
            </div>
          </div>
          {productList.length > 0 && (
            <div className="settings-price-overview">
              <strong>Resumen de precios actuales</strong>
              <div className="price-overview-list">
                {productList.map(p => {
                  const retail = p.retailPrice || p.price || 0
                  const wholesale = p.wholesalePrice || 0
                  const cost = p.productionCost || 0
                  const margin = cost > 0 && retail > 0 ? Math.round(((retail - cost) / retail) * 100) : null
                  return (
                    <div className="price-overview-row" key={p.id}>
                      <span className="price-overview-name">{p.name}</span>
                      <span className="price-overview-prices">
                        {currency}{retail.toLocaleString()}
                        {wholesale > 0 && <small> / May: {currency}{wholesale.toLocaleString()}</small>}
                        {margin !== null && <small className={`price-margin ${margin >= 40 ? 'margin-good' : margin >= 20 ? 'margin-ok' : 'margin-low'}`}> {margin}%</small>}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Entregas ── */}
        <div className="settings-section">
          <h3>🚚 Entregas</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Días de entrega por defecto</label>
              <input
                type="number"
                min="0"
                max="60"
                value={settings.defaultDeliveryDays ?? 3}
                onChange={e => updateField('defaultDeliveryDays', Number(e.target.value))}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Días desde el pedido para sugerir fecha de entrega</small>
            </div>
            <div className="form-group">
              <label>Alertas de stock</label>
              <select value={settings.stockAlertEnabled !== false ? 'true' : 'false'} onChange={e => updateField('stockAlertEnabled', e.target.value === 'true')}>
                <option value="true">Activadas</option>
                <option value="false">Desactivadas</option>
              </select>
              <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Mostrar alertas cuando el stock esté por debajo del mínimo</small>
            </div>
          </div>
        </div>

        {/* ── Guía de Uso ── */}
        <div className="settings-section">
          <h3>📖 Guía de Uso</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
            Consultá la guía completa del programa con instrucciones detalladas de cada sección.
          </p>
          <button className="btn-primary" onClick={() => setShowGuide(true)}>
            📖 Abrir Guía de Uso
          </button>
        </div>

        {/* ── Notas de Versión ── */}
        <div className="settings-section">
          <h3>📋 Notas de Versión</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
            Consultá el historial de cambios y las novedades de cada actualización.
          </p>
          <button className="btn-primary" onClick={() => window.electronAPI?.openExternal('https://na7hk3r.github.io/ushuaia-crm/#releases')}>
            🌐 Ver Notas de Versión
          </button>
        </div>

        {/* ── Respaldo y Restauración ── */}
        <div className="settings-section">
          <h3>💾 Respaldo y Restauración</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
            Exportá todos tus datos (clientes, productos, materias primas, producción y configuración) en un archivo.
            También podés restaurar un respaldo previo.
          </p>
          <div className="backup-actions">
            <button className="btn-primary" onClick={handleBackup}>
              📥 Guardar Respaldo
            </button>
            <button className="btn-ghost" onClick={handleRestore}>
              📤 Restaurar Respaldo
            </button>
          </div>
        </div>

        {/* ── Categorías de Clientes ── */}
        <div className="settings-section">
          <h3>👥 Categorías de Clientes</h3>
          <div className="tag-list">
            {settings.clientCategories.map(cat => (
              <span className="tag-item" key={cat}>
                {cat}
                <button className="tag-remove" onClick={() => removeFromList('clientCategories', cat)} title="Eliminar">×</button>
              </span>
            ))}
          </div>
          <div className="tag-add-row">
            <input
              placeholder="Nueva categoría..."
              value={newClientCat}
              onChange={e => setNewClientCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList('clientCategories', newClientCat, setNewClientCat))}
            />
            <button className="btn-sm" onClick={() => addToList('clientCategories', newClientCat, setNewClientCat)}>Agregar</button>
          </div>
        </div>

        {/* ── Categorías de Productos ── */}
        <div className="settings-section">
          <h3>📦 Categorías de Productos</h3>
          <div className="tag-list">
            {settings.productCategories.map(cat => (
              <span className="tag-item" key={cat}>
                {cat}
                <button className="tag-remove" onClick={() => removeFromList('productCategories', cat)} title="Eliminar">×</button>
              </span>
            ))}
          </div>
          <div className="tag-add-row">
            <input
              placeholder="Nueva categoría..."
              value={newProductCat}
              onChange={e => setNewProductCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList('productCategories', newProductCat, setNewProductCat))}
            />
            <button className="btn-sm" onClick={() => addToList('productCategories', newProductCat, setNewProductCat)}>Agregar</button>
          </div>
        </div>

        {/* ── Estados de Producción ── */}
        <div className="settings-section">
          <h3>🏭 Estados de Producción</h3>
          <div className="tag-list">
            {settings.productionStatuses.map(s => (
              <span className="tag-item" key={s}>
                {s}
                <button className="tag-remove" onClick={() => removeFromList('productionStatuses', s)} title="Eliminar">×</button>
              </span>
            ))}
          </div>
          <div className="tag-add-row">
            <input
              placeholder="Nuevo estado..."
              value={newProdStatus}
              onChange={e => setNewProdStatus(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList('productionStatuses', newProdStatus, setNewProdStatus))}
            />
            <button className="btn-sm" onClick={() => addToList('productionStatuses', newProdStatus, setNewProdStatus)}>Agregar</button>
          </div>
        </div>

        {/* ── Unidades de Medida ── */}
        <div className="settings-section">
          <h3>📏 Unidades de Medida</h3>
          <div className="tag-list">
            {settings.materialUnits.map(u => (
              <span className="tag-item" key={u}>
                {u}
                <button className="tag-remove" onClick={() => removeFromList('materialUnits', u)} title="Eliminar">×</button>
              </span>
            ))}
          </div>
          <div className="tag-add-row">
            <input
              placeholder="Nueva unidad..."
              value={newUnit}
              onChange={e => setNewUnit(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList('materialUnits', newUnit, setNewUnit))}
            />
            <button className="btn-sm" onClick={() => addToList('materialUnits', newUnit, setNewUnit)}>Agregar</button>
          </div>
        </div>
      </div>
      {showGuide && <UsageGuide onClose={() => setShowGuide(false)} />}
    </div>
  )
}
