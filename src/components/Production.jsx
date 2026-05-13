import { useState } from 'react'
import { exportCSV } from '../utils/exportCSV'
import { findProductByRef, getActiveProducts, getProductDisplayName } from '../utils/products.js'

const statusLabels = { 'planificado': 'Planificado', 'en-progreso': 'En progreso', 'completado': 'Completado', 'cancelado': 'Cancelado' }
const statusColors = { 'planificado': 'badge-blue', 'en-progreso': 'badge-amber', 'completado': 'badge-green', 'cancelado': 'badge-red' }

function getStatusLabel(status) {
  return statusLabels[status] || status
}

function getStatusColor(status) {
  return statusColors[status] || ''
}

export default function Production({ production, setProduction, products, settings }) {
  const productionStatuses = settings?.productionStatuses || ['planificado', 'en-progreso', 'completado', 'cancelado']
  const activeProducts = getActiveProducts(products)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ productId: '', product: '', quantity: '', date: '', status: 'planificado' })
  const [editId, setEditId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = production.filter(p => !filterStatus || p.status === filterStatus)

  const stats = {
    planificado: production.filter(p => p.status === 'planificado').length,
    'en-progreso': production.filter(p => p.status === 'en-progreso').length,
    completado: production.filter(p => p.status === 'completado').length,
    totalUnits: production.filter(p => p.status !== 'cancelado').reduce((s, p) => s + p.quantity, 0),
  }

  function getProductOptions() {
    const current = editId ? findProductByRef(products, form) : null
    if (!current || activeProducts.some(p => p.id === current.id)) return activeProducts
    return [...activeProducts, current]
  }

  function openNew() {
    const firstProduct = activeProducts[0]
    setForm({
      productId: firstProduct?.id || '',
      product: firstProduct?.name || '',
      quantity: '',
      date: new Date().toISOString().slice(0, 10),
      status: productionStatuses[0] || 'planificado',
    })
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(item) {
    const product = findProductByRef(products, item)
    setForm({
      productId: product?.id || item.productId || '',
      product: item.product || product?.name || '',
      quantity: item.quantity,
      date: item.date,
      status: item.status,
    })
    setEditId(item.id)
    setShowForm(true)
  }

  function handleProductChange(productId) {
    const product = findProductByRef(products, { productId })
    setForm(prev => ({
      ...prev,
      productId: product?.id || '',
      product: product?.name || '',
    }))
  }

  function handleSave(e) {
    e.preventDefault()
    const product = findProductByRef(products, form)
    const entry = {
      ...form,
      productId: product?.id || (form.productId ? Number(form.productId) : null),
      product: product?.name || form.product,
      quantity: Number(form.quantity),
    }

    if (editId) {
      setProduction(prev => prev.map(p => p.id === editId ? { ...entry, id: editId } : p))
    } else {
      const newId = Math.max(0, ...production.map(p => p.id)) + 1
      setProduction(prev => [...prev, { ...entry, id: newId }])
    }
    setShowForm(false)
  }

  function handleDelete(id) {
    if (confirm('Eliminar esta orden de produccion?')) {
      setProduction(prev => prev.filter(p => p.id !== id))
    }
  }

  function updateStatus(id, status) {
    setProduction(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Produccion</h2>
        <div className="header-actions">
          <div className="csv-tooltip-wrap">
            <button className="btn-export" onClick={() => exportCSV(production, [
              { label: 'Producto', transform: p => getProductDisplayName(products, p) },
              { key: 'quantity', label: 'Cantidad' },
              { key: 'date', label: 'Fecha' },
              { key: 'status', label: 'Estado' },
            ], 'produccion.csv')}>Exportar CSV</button>
            <div className="csv-tooltip">
              Genera un archivo <strong>.csv</strong> que podes abrir en <strong>Excel</strong> o cualquier planilla de calculo. Tambien sirve como respaldo de esta seccion.
            </div>
          </div>
          <button className="btn-primary" onClick={openNew}>+ Nueva Orden</button>
        </div>
      </div>

      <div className="kpi-grid four">
        <div className="kpi-card mini">
          <span className="kpi-icon">#</span>
          <div className="kpi-data"><span className="kpi-value">{stats.planificado}</span><span className="kpi-label">Planificadas</span></div>
        </div>
        <div className="kpi-card mini">
          <span className="kpi-icon">*</span>
          <div className="kpi-data"><span className="kpi-value">{stats['en-progreso']}</span><span className="kpi-label">En progreso</span></div>
        </div>
        <div className="kpi-card mini">
          <span className="kpi-icon">OK</span>
          <div className="kpi-data"><span className="kpi-value">{stats.completado}</span><span className="kpi-label">Completadas</span></div>
        </div>
        <div className="kpi-card mini">
          <span className="kpi-icon">U</span>
          <div className="kpi-data"><span className="kpi-value">{stats.totalUnits}</span><span className="kpi-label">Unidades totales</span></div>
        </div>
      </div>

      {showForm && (
        <form className="form-card inline-form" onSubmit={handleSave}>
          <h3>{editId ? 'Editar Orden' : 'Nueva Orden de Produccion'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Producto</label>
              <select value={form.productId} onChange={e => handleProductChange(e.target.value)} required>
                <option value="">Seleccionar...</option>
                {getProductOptions().map(p => <option key={p.id} value={p.id}>{p.name}{p.archived ? ' (archivado)' : ''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Cantidad</label>
              <input type="number" min="1" required value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {productionStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="filters">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {productionStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td className="td-main">{getProductDisplayName(products, p)}</td>
                <td>{p.quantity}</td>
                <td>{p.date}</td>
                <td><span className={`badge ${getStatusColor(p.status)}`}>{getStatusLabel(p.status)}</span></td>
                <td className="td-actions">
                  {p.status === 'planificado' && <button className="btn-sm" onClick={() => updateStatus(p.id, 'en-progreso')}>Iniciar</button>}
                  {p.status === 'en-progreso' && <button className="btn-sm btn-sm-green" onClick={() => updateStatus(p.id, 'completado')}>Completar</button>}
                  <button className="btn-sm" onClick={() => openEdit(p)}>Editar</button>
                  <button className="btn-sm btn-sm-red" onClick={() => handleDelete(p.id)}>x</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="empty">Sin ordenes de produccion</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
