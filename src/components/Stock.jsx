import { useState } from 'react'
import { exportCSV } from '../utils/exportCSV'
import {
  calculateProductMargin,
  isDuplicateProductName,
  isProductReferenced,
  normalizeProductName,
} from '../utils/products.js'

function buildEmptyForm(category) {
  return {
    name: '',
    description: '',
    unitsPerBox: '',
    retailPrice: '',
    wholesalePrice: '',
    productionCost: '',
    category,
    stock: '',
    minStock: '',
  }
}

export default function Stock({ products, setProducts, clients = [], production = [], settings }) {
  const productCategories = settings?.productCategories?.length ? settings.productCategories : ['chocolate', 'maicena', 'premium', 'caja']
  const defaultCategory = productCategories[0] || 'general'
  const currency = settings?.currency || '$'
  const alertsEnabled = settings?.stockAlertEnabled !== false

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(() => buildEmptyForm(defaultCategory))
  const [editId, setEditId] = useState(null)
  const [filterCat, setFilterCat] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [error, setError] = useState('')

  const filtered = products.filter(p =>
    (!filterCat || p.category === filterCat) &&
    (showArchived || !p.archived)
  )

  const lowStock = alertsEnabled
    ? products.filter(p => !p.archived && p.stock <= p.minStock)
    : []

  function openNew() {
    setForm(buildEmptyForm(defaultCategory))
    setEditId(null)
    setError('')
    setShowForm(true)
  }

  function openEdit(item) {
    setForm({
      name: item.name,
      description: item.description,
      unitsPerBox: item.unitsPerBox ?? '',
      retailPrice: item.retailPrice ?? item.price ?? '',
      wholesalePrice: item.wholesalePrice ?? '',
      productionCost: item.productionCost ?? '',
      category: item.category || defaultCategory,
      stock: item.stock,
      minStock: item.minStock,
    })
    setEditId(item.id)
    setError('')
    setShowForm(true)
  }

  function validateEntry() {
    if (!normalizeProductName(form.name)) return 'El nombre del producto es obligatorio.'
    if (isDuplicateProductName(products, form.name, editId)) return 'Ya existe un producto con ese nombre.'
    if (Number(form.unitsPerBox) < 1) return 'Las unidades por caja deben ser 1 o mas.'
    if (Number(form.retailPrice) < 0 || Number(form.wholesalePrice) < 0 || Number(form.productionCost) < 0) return 'Los precios no pueden ser negativos.'
    if (Number(form.stock) < 0 || Number(form.minStock) < 0) return 'El stock no puede ser negativo.'
    return ''
  }

  function handleSave(e) {
    e.preventDefault()
    const validationError = validateEntry()
    if (validationError) {
      setError(validationError)
      return
    }

    const retailPrice = Number(form.retailPrice) || 0
    const entry = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category || defaultCategory,
      unitsPerBox: Number(form.unitsPerBox) || 1,
      retailPrice,
      wholesalePrice: Number(form.wholesalePrice) || 0,
      productionCost: Number(form.productionCost) || 0,
      price: retailPrice,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
    }

    if (editId) {
      setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...entry, id: editId } : p))
    } else {
      const newId = Math.max(0, ...products.map(p => p.id)) + 1
      setProducts(prev => [...prev, { ...entry, id: newId, archived: false }])
    }

    setShowForm(false)
    setError('')
  }

  function handleDelete(product) {
    if (isProductReferenced(product, clients, production)) {
      if (confirm('Este producto tiene pedidos o produccion asociados. Se archivara para conservar el historial.')) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, archived: true } : p))
      }
      return
    }

    if (confirm('Eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== product.id))
    }
  }

  function restoreProduct(id) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, archived: false } : p))
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
              { key: 'description', label: 'Descripcion' },
              { key: 'category', label: 'Categoria' },
              { label: 'Uds/Caja', transform: p => p.unitsPerBox || 1 },
              { label: 'P. Minorista', transform: p => p.retailPrice || p.price },
              { label: 'P. Mayorista', transform: p => p.wholesalePrice || '-' },
              { label: 'Costo Prod.', transform: p => p.productionCost || '-' },
              { key: 'stock', label: 'Stock' },
              { key: 'minStock', label: 'Stock Minimo' },
              { label: 'Estado', transform: p => p.archived ? 'Archivado' : 'Activo' },
            ], 'stock-productos.csv')}>Exportar CSV</button>
            <div className="csv-tooltip">
              Genera un archivo <strong>.csv</strong> que podes abrir en <strong>Excel</strong> o cualquier planilla de calculo. Tambien sirve como respaldo de esta seccion.
            </div>
          </div>
          <button className="btn-primary" onClick={openNew}>+ Nuevo Producto</button>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="alerts-section">
          <h3>Productos con stock bajo</h3>
          <div className="alert-list">
            {lowStock.map(p => (
              <div className="alert-item alert-product" key={p.id}>
                <strong>{p.name}</strong>
                <span>Actual: <b>{p.stock}</b> / Minimo: <b>{p.minStock}</b></span>
                <button className="btn-sm" onClick={() => adjustStock(p.id, 50)}>+50 unidades</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form className="form-card inline-form" onSubmit={handleSave}>
          <h3>{editId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          {error && <p className="form-error">{error}</p>}
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Descripcion</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Alfajores por caja/unidad</label>
              <input type="number" min="1" required value={form.unitsPerBox} onChange={e => setForm({ ...form, unitsPerBox: e.target.value })} placeholder="1 = individual" />
            </div>
            <div className="form-group">
              <label>Precio Minorista ({currency})</label>
              <input type="number" min="0" required value={form.retailPrice} onChange={e => setForm({ ...form, retailPrice: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Precio Mayorista ({currency})</label>
              <input type="number" min="0" value={form.wholesalePrice} onChange={e => setForm({ ...form, wholesalePrice: e.target.value })} placeholder="Opcional" />
            </div>
            <div className="form-group">
              <label>Costo de Produccion ({currency})</label>
              <input type="number" min="0" value={form.productionCost} onChange={e => setForm({ ...form, productionCost: e.target.value })} placeholder="Opcional" />
            </div>
            <div className="form-group">
              <label>Stock actual</label>
              <input type="number" min="0" required value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Stock minimo</label>
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
          <option value="">Todas las categorias</option>
          {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="inline-check">
          <input type="checkbox" checked={showArchived} onChange={e => setShowArchived(e.target.checked)} />
          Ver archivados
        </label>
      </div>

      <div className="table-wrap">
        <table className="data-table compact">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoria</th>
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
              const margin = calculateProductMargin(p, 'retail')
              return (
              <tr key={p.id} className={p.archived ? 'row-muted' : p.stock <= p.minStock ? 'row-alert' : ''}>
                <td className="td-main">{p.name}<br /><small>{p.description}{(p.unitsPerBox || 1) > 1 ? ` · ${p.unitsPerBox} uds` : ''}</small></td>
                <td><span className="badge">{p.category}</span></td>
                <td className="td-number">{currency}{retail.toLocaleString()}</td>
                <td className="td-number">{wholesale > 0 ? `${currency}${wholesale.toLocaleString()}` : '-'}</td>
                <td className="td-number">{cost > 0 ? `${currency}${cost.toLocaleString()}` : '-'}</td>
                <td>{margin !== null ? <span className={`badge ${margin >= 40 ? 'badge-green' : margin >= 20 ? 'badge-amber' : 'badge-red'}`}>{margin}%</span> : '-'}</td>
                <td>
                  <div className="stock-controls">
                    <button className="btn-mini" onClick={() => adjustStock(p.id, -10)}>-</button>
                    <span className={`stock-value ${!p.archived && p.stock <= p.minStock ? 'stock-low' : ''}`}>{p.stock}</span>
                    <button className="btn-mini" onClick={() => adjustStock(p.id, 10)}>+</button>
                  </div>
                  <small className="stock-min-hint">min. {p.minStock}</small>
                </td>
                <td>
                  {p.archived
                    ? <span className="badge">Archivado</span>
                    : p.stock <= p.minStock
                      ? <span className="badge badge-red">Bajo</span>
                      : <span className="badge badge-green">OK</span>}
                </td>
                <td className="td-actions">
                  <button className="btn-sm" onClick={() => openEdit(p)}>Editar</button>
                  {p.archived
                    ? <button className="btn-sm btn-sm-green" onClick={() => restoreProduct(p.id)}>Restaurar</button>
                    : <button className="btn-sm btn-sm-red" onClick={() => handleDelete(p)}>x</button>}
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
