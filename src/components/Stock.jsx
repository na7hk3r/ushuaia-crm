import { useState } from 'react'
import { exportCSV } from '../utils/exportCSV'

export default function Stock({ products, setProducts, settings }) {
  const productCategories = settings?.productCategories || ['chocolate', 'maicena', 'premium', 'caja']
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', unitsPerBox: '', retailPrice: '', wholesalePrice: '', productionCost: '', category: 'chocolate', stock: '', minStock: '' })
  const [editId, setEditId] = useState(null)
  const [filterCat, setFilterCat] = useState('')

  const filtered = products.filter(p => !filterCat || p.category === filterCat)
  const lowStock = products.filter(p => p.stock <= p.minStock)

  function openNew() {
    setForm({ name: '', description: '', unitsPerBox: '', retailPrice: '', wholesalePrice: '', productionCost: '', category: 'chocolate', stock: '', minStock: '' })
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(item) {
    setForm({
      name: item.name, description: item.description,
      unitsPerBox: item.unitsPerBox ?? '',
      retailPrice: item.retailPrice ?? item.price ?? '',
      wholesalePrice: item.wholesalePrice ?? '',
      productionCost: item.productionCost ?? '',
      category: item.category, stock: item.stock, minStock: item.minStock,
    })
    setEditId(item.id)
    setShowForm(true)
  }

  function handleSave(e) {
    e.preventDefault()
    const retailP = Number(form.retailPrice) || 0
    const entry = {
      ...form,
      unitsPerBox: Number(form.unitsPerBox) || 1,
      retailPrice: retailP,
      wholesalePrice: Number(form.wholesalePrice) || 0,
      productionCost: Number(form.productionCost) || 0,
      price: retailP,
      stock: Number(form.stock),
      minStock: Number(form.minStock),
    }
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
              { label: 'Uds/Caja', transform: p => p.unitsPerBox || 1 },
              { label: 'P. Minorista', transform: p => p.retailPrice || p.price },
              { label: 'P. Mayorista', transform: p => p.wholesalePrice || '-' },
              { label: 'Costo Prod.', transform: p => p.productionCost || '-' },
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
              <label>Alfajores por caja/unidad</label>
              <input type="number" min="1" required value={form.unitsPerBox} onChange={e => setForm({ ...form, unitsPerBox: e.target.value })} placeholder="1 = individual" />
            </div>
            <div className="form-group">
              <label>Precio Minorista ($)</label>
              <input type="number" min="0" required value={form.retailPrice} onChange={e => setForm({ ...form, retailPrice: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Precio Mayorista ($)</label>
              <input type="number" min="0" value={form.wholesalePrice} onChange={e => setForm({ ...form, wholesalePrice: e.target.value })} placeholder="Opcional" />
            </div>
            <div className="form-group">
              <label>Costo de Producción ($)</label>
              <input type="number" min="0" value={form.productionCost} onChange={e => setForm({ ...form, productionCost: e.target.value })} placeholder="Opcional" />
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
        <table className="data-table compact">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Minorista</th>
              <th>Mayorista</th>
              <th>Costo</th>
              <th>Margen</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const retail = p.retailPrice || p.price || 0
              const wholesale = p.wholesalePrice || 0
              const cost = p.productionCost || 0
              const margin = cost > 0 ? Math.round(((retail - cost) / retail) * 100) : null
              return (
              <tr key={p.id} className={p.stock <= p.minStock ? 'row-alert' : ''}>
                <td className="td-main">{p.name}<br /><small>{p.description}{(p.unitsPerBox || 1) > 1 ? ` · ${p.unitsPerBox} uds` : ''}</small></td>
                <td><span className="badge">{p.category}</span></td>
                <td className="td-number">${retail.toLocaleString()}</td>
                <td className="td-number">{wholesale > 0 ? `$${wholesale.toLocaleString()}` : '—'}</td>
                <td className="td-number">{cost > 0 ? `$${cost.toLocaleString()}` : '—'}</td>
                <td>{margin !== null ? <span className={`badge ${margin >= 40 ? 'badge-green' : margin >= 20 ? 'badge-amber' : 'badge-red'}`}>{margin}%</span> : '—'}</td>
                <td>
                  <div className="stock-controls">
                    <button className="btn-mini" onClick={() => adjustStock(p.id, -10)}>-</button>
                    <span className={`stock-value ${p.stock <= p.minStock ? 'stock-low' : ''}`}>{p.stock}</span>
                    <button className="btn-mini" onClick={() => adjustStock(p.id, 10)}>+</button>
                  </div>
                  <small className="stock-min-hint">mín. {p.minStock}</small>
                </td>
                <td>{p.stock <= p.minStock ? <span className="badge badge-red">⚠ Bajo</span> : <span className="badge badge-green">OK</span>}</td>
                <td className="td-actions">
                  <button className="btn-sm" onClick={() => openEdit(p)}>Editar</button>
                  <button className="btn-sm btn-sm-red" onClick={() => handleDelete(p.id)}>✕</button>
                </td>
              </tr>
              )
            })}
            {filtered.length === 0 && <tr><td colSpan={9} className="empty">Sin productos</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
