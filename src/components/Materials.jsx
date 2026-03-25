import { useState } from 'react'
import { exportCSV } from '../utils/exportCSV'

export default function Materials({ materials, setMaterials, settings }) {
  const materialUnits = settings?.materialUnits || ['kg', 'litros', 'unidades', 'rollos', 'paquetes']
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', unit: 'kg', stock: '', minStock: '', supplier: '' })
  const [editId, setEditId] = useState(null)

  const lowStock = materials.filter(m => m.stock <= m.minStock)

  function openNew() {
    setForm({ name: '', unit: 'kg', stock: '', minStock: '', supplier: '' })
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(item) {
    setForm({ name: item.name, unit: item.unit, stock: item.stock, minStock: item.minStock, supplier: item.supplier })
    setEditId(item.id)
    setShowForm(true)
  }

  function handleSave(e) {
    e.preventDefault()
    const entry = { ...form, stock: Number(form.stock), minStock: Number(form.minStock) }
    if (editId) {
      setMaterials(prev => prev.map(m => m.id === editId ? { ...entry, id: editId } : m))
    } else {
      const newId = Math.max(0, ...materials.map(m => m.id)) + 1
      setMaterials(prev => [...prev, { ...entry, id: newId }])
    }
    setShowForm(false)
  }

  function handleDelete(id) {
    if (confirm('¿Eliminar esta materia prima?')) {
      setMaterials(prev => prev.filter(m => m.id !== id))
    }
  }

  function adjustStock(id, delta) {
    setMaterials(prev => prev.map(m =>
      m.id === id ? { ...m, stock: Math.max(0, m.stock + delta) } : m
    ))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Materia Prima</h2>
        <div className="header-actions">
          <div className="csv-tooltip-wrap">
            <button className="btn-export" onClick={() => exportCSV(materials, [
              { key: 'name', label: 'Insumo' },
              { key: 'unit', label: 'Unidad' },
              { key: 'stock', label: 'Stock' },
              { key: 'minStock', label: 'Stock Mínimo' },
              { key: 'supplier', label: 'Proveedor' },
            ], 'materia-prima.csv')}>📄 Exportar CSV</button>
            <div className="csv-tooltip">
              Genera un archivo <strong>.csv</strong> que podés abrir en <strong>Excel</strong> o cualquier planilla de cálculo. También sirve como respaldo de esta sección.
            </div>
          </div>
          <button className="btn-primary" onClick={openNew}>+ Nuevo Insumo</button>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="alerts-section">
          <h3>⚠️ Insumos que necesitan reposición</h3>
          <div className="alert-list">
            {lowStock.map(m => (
              <div className="alert-item alert-material" key={m.id}>
                <strong>{m.name}</strong>
                <span>Actual: <b>{m.stock} {m.unit}</b> / Mínimo: <b>{m.minStock} {m.unit}</b></span>
                <span className="alert-supplier">Proveedor: {m.supplier}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form className="form-card inline-form" onSubmit={handleSave}>
          <h3>{editId ? 'Editar Insumo' : 'Nuevo Insumo'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Unidad</label>
              <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                {materialUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Stock actual</label>
              <input type="number" min="0" required value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Stock mínimo</label>
              <input type="number" min="0" required value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} />
            </div>
            <div className="form-group full">
              <label>Proveedor</label>
              <input value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Unidad</th>
              <th>Stock</th>
              <th>Mín.</th>
              <th>Proveedor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materials.map(m => (
              <tr key={m.id} className={m.stock <= m.minStock ? 'row-alert' : ''}>
                <td className="td-main">{m.name}</td>
                <td>{m.unit}</td>
                <td>
                  <div className="stock-controls">
                    <button className="btn-mini" onClick={() => adjustStock(m.id, -5)}>-5</button>
                    <span className="stock-value">{m.stock}</span>
                    <button className="btn-mini" onClick={() => adjustStock(m.id, 5)}>+5</button>
                  </div>
                </td>
                <td>{m.minStock}</td>
                <td>{m.supplier}</td>
                <td>{m.stock <= m.minStock ? <span className="badge badge-red">⚠ Reponer</span> : <span className="badge badge-green">OK</span>}</td>
                <td className="td-actions">
                  <button className="btn-sm" onClick={() => openEdit(m)}>Editar</button>
                  <button className="btn-sm btn-sm-red" onClick={() => handleDelete(m.id)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
