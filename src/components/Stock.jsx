import { useState } from 'react'
import { exportCSV } from '../utils/exportCSV'

export default function Stock({ products, setProducts, settings }) {
  const productCategories = settings?.productCategories || ['chocolate', 'maicena', 'premium', 'caja']
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'chocolate', stock: '', minStock: '' })
  const [editId, setEditId] = useState(null)
  const [filterCat, setFilterCat] = useState('')

  const filtered = products.filter(p => !filterCat || p.category === filterCat)
  const lowStock = products.filter(p => p.stock <= p.minStock)

  function openNew() {
    setForm({ name: '', description: '', price: '', category: 'chocolate', stock: '', minStock: '' })
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(item) {
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, stock: item.stock, minStock: item.minStock })
    setEditId(item.id)
    setShowForm(true)
  }

  function handleSave(e) {
    e.preventDefault()
    const entry = { ...form, price: Number(form.price), stock: Number(form.stock), minStock: Number(form.minStock) }
    if (editId) {
      setProducts(prev => prev.map(p => p.id === editId ? { ...entry, id: editId } : p))
    } else {
      const newId = Math.max(0, ...products.map(p => p.id)) + 1
      setProducts(prev => [...prev, { ...entry, id: newId }])
    }
    setShowForm(false)
  }

  function handleDelete(id) {
    if (confirm('¿Eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  function adjustStock(id, delta) {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    ))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Stock de Productos</h2>
        <div className="header-actions">
          <div className="csv-tooltip-wrap">
            <button className="btn-export" onClick={() => exportCSV(products, [
              { key: 'name', label: 'Producto' },
              { key: 'description', label: 'Descripción' },
              { key: 'category', label: 'Categoría' },
              { key: 'price', label: 'Precio' },
              { key: 'stock', label: 'Stock' },
              { key: 'minStock', label: 'Stock Mínimo' },
            ], 'stock-productos.csv')}>📄 Exportar CSV</button>
            <div className="csv-tooltip">
              Genera un archivo <strong>.csv</strong> que podés abrir en <strong>Excel</strong> o cualquier planilla de cálculo. También sirve como respaldo de esta sección.
            </div>
          </div>
          <button className="btn-primary" onClick={openNew}>+ Nuevo Producto</button>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="alerts-section">
          <h3>⚠️ Productos con stock bajo</h3>
          <div className="alert-list">
            {lowStock.map(p => (
              <div className="alert-item alert-product" key={p.id}>
                <strong>{p.name}</strong>
                <span>Actual: <b>{p.stock}</b> / Mínimo: <b>{p.minStock}</b></span>
                <button className="btn-sm" onClick={() => adjustStock(p.id, 50)}>+50 unidades</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form className="form-card inline-form" onSubmit={handleSave}>
          <h3>{editId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Descripción</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Precio ($)</label>
              <input type="number" min="0" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Stock actual</label>
              <input type="number" min="0" required value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Stock mínimo</label>
              <input type="number" min="0" required value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="filters">
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Mín.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className={p.stock <= p.minStock ? 'row-alert' : ''}>
                <td className="td-main">{p.name}<br /><small>{p.description}</small></td>
                <td><span className="badge">{p.category}</span></td>
                <td>${p.price.toLocaleString()}</td>
                <td>
                  <div className="stock-controls">
                    <button className="btn-mini" onClick={() => adjustStock(p.id, -10)}>-10</button>
                    <span className="stock-value">{p.stock}</span>
                    <button className="btn-mini" onClick={() => adjustStock(p.id, 10)}>+10</button>
                  </div>
                </td>
                <td>{p.minStock}</td>
                <td>{p.stock <= p.minStock ? <span className="badge badge-red">⚠ Bajo</span> : <span className="badge badge-green">OK</span>}</td>
                <td className="td-actions">
                  <button className="btn-sm" onClick={() => openEdit(p)}>Editar</button>
                  <button className="btn-sm btn-sm-red" onClick={() => handleDelete(p.id)}>✕</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="empty">Sin productos</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
