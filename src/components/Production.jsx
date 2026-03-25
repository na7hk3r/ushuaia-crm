import { useState } from 'react'
import { exportCSV } from '../utils/exportCSV'

const statusLabels = { 'planificado': '📋 Planificado', 'en-progreso': '🔧 En progreso', 'completado': '✅ Completado', 'cancelado': '❌ Cancelado' }
const statusColors = { 'planificado': 'badge-blue', 'en-progreso': 'badge-amber', 'completado': 'badge-green', 'cancelado': 'badge-red' }

export default function Production({ production, setProduction, products, settings }) {
  const productionStatuses = settings?.productionStatuses || ['planificado', 'en-progreso', 'completado', 'cancelado']
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ product: '', quantity: '', date: '', status: 'planificado' })
  const [editId, setEditId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = production.filter(p => !filterStatus || p.status === filterStatus)

  const stats = {
    planificado: production.filter(p => p.status === 'planificado').length,
    'en-progreso': production.filter(p => p.status === 'en-progreso').length,
    completado: production.filter(p => p.status === 'completado').length,
    totalUnits: production.filter(p => p.status !== 'cancelado').reduce((s, p) => s + p.quantity, 0),
  }

  function openNew() {
    setForm({ product: products[0]?.name || '', quantity: '', date: new Date().toISOString().slice(0, 10), status: 'planificado' })
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(item) {
    setForm({ product: item.product, quantity: item.quantity, date: item.date, status: item.status })
    setEditId(item.id)
    setShowForm(true)
  }

  function handleSave(e) {
    e.preventDefault()
    const entry = { ...form, quantity: Number(form.quantity) }
    if (editId) {
      setProduction(prev => prev.map(p => p.id === editId ? { ...entry, id: editId } : p))
    } else {
      const newId = Math.max(0, ...production.map(p => p.id)) + 1
      setProduction(prev => [...prev, { ...entry, id: newId }])
    }
    setShowForm(false)
  }

  function handleDelete(id) {
    if (confirm('¿Eliminar esta orden de producción?')) {
      setProduction(prev => prev.filter(p => p.id !== id))
    }
  }

  function updateStatus(id, status) {
    setProduction(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Producción</h2>
        <div className="header-actions">
          <div className="csv-tooltip-wrap">
            <button className="btn-export" onClick={() => exportCSV(production, [
              { key: 'product', label: 'Producto' },
              { key: 'quantity', label: 'Cantidad' },
              { key: 'date', label: 'Fecha' },
              { key: 'status', label: 'Estado' },
            ], 'produccion.csv')}>📄 Exportar CSV</button>
            <div className="csv-tooltip">
              Genera un archivo <strong>.csv</strong> que podés abrir en <strong>Excel</strong> o cualquier planilla de cálculo. También sirve como respaldo de esta sección.
            </div>
          </div>
          <button className="btn-primary" onClick={openNew}>+ Nueva Orden</button>
        </div>
      </div>

      <div className="kpi-grid four">
        <div className="kpi-card mini">
          <span className="kpi-icon">📋</span>
          <div className="kpi-data"><span className="kpi-value">{stats.planificado}</span><span className="kpi-label">Planificadas</span></div>
        </div>
        <div className="kpi-card mini">
          <span className="kpi-icon">🔧</span>
          <div className="kpi-data"><span className="kpi-value">{stats['en-progreso']}</span><span className="kpi-label">En progreso</span></div>
        </div>
        <div className="kpi-card mini">
          <span className="kpi-icon">✅</span>
          <div className="kpi-data"><span className="kpi-value">{stats.completado}</span><span className="kpi-label">Completadas</span></div>
        </div>
        <div className="kpi-card mini">
          <span className="kpi-icon">📦</span>
          <div className="kpi-data"><span className="kpi-value">{stats.totalUnits}</span><span className="kpi-label">Unidades totales</span></div>
        </div>
      </div>

      {showForm && (
        <form className="form-card inline-form" onSubmit={handleSave}>
          <h3>{editId ? 'Editar Orden' : 'Nueva Orden de Producción'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Producto</label>
              <select value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} required>
                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
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
                <td className="td-main">{p.product}</td>
                <td>{p.quantity}</td>
                <td>{p.date}</td>
                <td><span className={`badge ${statusColors[p.status]}`}>{statusLabels[p.status]}</span></td>
                <td className="td-actions">
                  {p.status === 'planificado' && <button className="btn-sm" onClick={() => updateStatus(p.id, 'en-progreso')}>Iniciar</button>}
                  {p.status === 'en-progreso' && <button className="btn-sm btn-sm-green" onClick={() => updateStatus(p.id, 'completado')}>Completar</button>}
                  <button className="btn-sm" onClick={() => openEdit(p)}>Editar</button>
                  <button className="btn-sm btn-sm-red" onClick={() => handleDelete(p.id)}>✕</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="empty">Sin órdenes de producción</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
