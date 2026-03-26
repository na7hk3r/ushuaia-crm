import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { exportCSV } from '../utils/exportCSV'

const emptyClient = {
  name: '', contact: '', email: '', phone: '', address: '', category: 'minorista', notes: '', orders: []
}

export default function Clients({ clients, setClients, settings, products }) {
  const clientCategories = settings?.clientCategories || ['distribuidor', 'minorista', 'gastronomia', 'supermercado', 'mayorista']
  const [view, setView] = useState('list') // list | form | detail
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ ...emptyClient })
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderForm, setOrderForm] = useState({ product: '', quantity: '', total: '', deliveryDate: '', priceType: 'retail' })

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCat || c.category === filterCat
    return matchSearch && matchCat
  })

  function openNew() {
    setForm({ ...emptyClient })
    setSelected(null)
    setView('form')
  }

  function openEdit(client) {
    setForm({ ...client })
    setSelected(client)
    setView('form')
  }

  function openDetail(client) {
    setSelected(client)
    setView('detail')
  }

  function handleSave(e) {
    e.preventDefault()
    if (selected) {
      setClients(prev => prev.map(c => c.id === selected.id ? { ...form, id: selected.id } : c))
    } else {
      const newId = Math.max(0, ...clients.map(c => c.id)) + 1
      setClients(prev => [...prev, { ...form, id: newId, createdAt: new Date().toISOString().slice(0, 10), orders: [] }])
    }
    setView('list')
  }

  function handleDelete(id) {
    if (confirm('¿Eliminar este cliente?')) {
      setClients(prev => prev.filter(c => c.id !== id))
      setView('list')
    }
  }

  function getProductPrice(prod, priceType) {
    if (!prod) return 0
    if (priceType === 'wholesale') return prod.wholesalePrice || prod.retailPrice || prod.price || 0
    return prod.retailPrice || prod.price || 0
  }

  function handleProductChange(productName) {
    const prod = (products || []).find(p => p.name === productName)
    const qty = Number(orderForm.quantity) || 1
    const unitPrice = getProductPrice(prod, orderForm.priceType)
    setOrderForm(prev => ({
      ...prev,
      product: productName,
      total: prod ? String(unitPrice * qty) : prev.total,
    }))
  }

  function handleQuantityChange(val) {
    const qty = Number(val) || 0
    const prod = (products || []).find(p => p.name === orderForm.product)
    const unitPrice = getProductPrice(prod, orderForm.priceType)
    setOrderForm(prev => ({
      ...prev,
      quantity: val,
      total: prod ? String(unitPrice * qty) : prev.total,
    }))
  }

  function handlePriceTypeChange(priceType) {
    const prod = (products || []).find(p => p.name === orderForm.product)
    const qty = Number(orderForm.quantity) || 1
    const unitPrice = getProductPrice(prod, priceType)
    setOrderForm(prev => ({
      ...prev,
      priceType,
      total: prod ? String(unitPrice * qty) : prev.total,
    }))
  }

  function handleAddOrder(e) {
    e.preventDefault()
    const total = Number(orderForm.total)
    if (!orderForm.product || !orderForm.quantity || isNaN(total) || total <= 0) return
    const date = new Date().toISOString().slice(0, 10)
    const newOrder = {
      date,
      product: orderForm.product,
      quantity: Number(orderForm.quantity),
      total,
      deliveryDate: orderForm.deliveryDate || '',
      delivered: false,
    }
    setClients(prev => prev.map(c =>
      c.id === selected.id
        ? { ...c, orders: [...c.orders, newOrder] }
        : c
    ))
    setSelected(prev => ({ ...prev, orders: [...prev.orders, newOrder] }))
    setOrderForm({ product: '', quantity: '', total: '', deliveryDate: '', priceType: 'retail' })
    setShowOrderForm(false)
  }

  function toggleDelivered(orderIndex) {
    setClients(prev => prev.map(c => {
      if (c.id !== selected.id) return c
      const orders = c.orders.map((o, i) => i === orderIndex ? { ...o, delivered: !o.delivered } : o)
      return { ...c, orders }
    }))
    setSelected(prev => ({
      ...prev,
      orders: prev.orders.map((o, i) => i === orderIndex ? { ...o, delivered: !o.delivered } : o),
    }))
  }

  function openMap(address) {
    if (!address) return
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
  }

  if (view === 'form') {
    return (
      <div className="page">
        <div className="page-header">
          <h2>{selected ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <button className="btn-ghost" onClick={() => setView('list')}>← Volver</button>
        </div>
        <form className="form-card" onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label>Empresa / Nombre</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Contacto</label>
              <input required value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group full">
              <label>Dirección</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {clientCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Notas</label>
              <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" className="btn-ghost" onClick={() => setView('list')}>Cancelar</button>
          </div>
        </form>
      </div>
    )
  }

  if (view === 'detail' && selected) {
    const totalRevenue = selected.orders.reduce((s, o) => s + o.total, 0)
    const chartData = selected.orders.map(o => ({
      fecha: o.date.slice(5),
      monto: o.total,
    }))

    return (
      <div className="page">
        <div className="page-header">
          <h2>{selected.name}</h2>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => openEdit(selected)}>Editar</button>
            <button className="btn-danger" onClick={() => handleDelete(selected.id)}>Eliminar</button>
            <button className="btn-ghost" onClick={() => setView('list')}>← Volver</button>
          </div>
        </div>
        <div className="detail-grid">
          <div className="detail-card">
            <h3>Información</h3>
            <div className="detail-row"><span>Contacto:</span><strong>{selected.contact}</strong></div>
            <div className="detail-row"><span>Email:</span><strong>{selected.email}</strong></div>
            <div className="detail-row"><span>Teléfono:</span><strong>{selected.phone}</strong></div>
            <div className="detail-row"><span>Dirección:</span><strong>{selected.address}</strong></div>
            {selected.address && <button className="btn-sm" onClick={() => openMap(selected.address)} style={{ marginTop: 4, marginBottom: 8 }}>📍 Ver en mapa</button>}
            <div className="detail-row"><span>Categoría:</span><span className="badge">{selected.category}</span></div>
            <div className="detail-row"><span>Cliente desde:</span><strong>{selected.createdAt}</strong></div>
            {selected.notes && <div className="detail-notes"><span>Notas:</span><p>{selected.notes}</p></div>}
          </div>
          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Pedidos ({selected.orders.length})</h3>
              <button className="btn-sm" onClick={() => setShowOrderForm(!showOrderForm)}>
                {showOrderForm ? '✕ Cancelar' : '+ Agregar pedido'}
              </button>
            </div>
            <div className="detail-row"><span>Facturación total:</span><strong className="revenue">${totalRevenue.toLocaleString()}</strong></div>

            {showOrderForm && (
              <form className="order-inline-form" onSubmit={handleAddOrder}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Producto</label>
                    <select value={orderForm.product} onChange={e => handleProductChange(e.target.value)} required>
                      <option value="">Seleccionar...</option>
                      {(products || []).map(p => {
                        const uInfo = (p.unitsPerBox || 1) > 1 ? ` (${p.unitsPerBox} alfajores)` : ''
                        return <option key={p.id} value={p.name}>{p.name}{uInfo}</option>
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tipo de precio</label>
                    <select value={orderForm.priceType} onChange={e => handlePriceTypeChange(e.target.value)}>
                      <option value="retail">Minorista</option>
                      <option value="wholesale">Mayorista</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cantidad (cajas/unidades)</label>
                    <input type="number" min="1" value={orderForm.quantity} onChange={e => handleQuantityChange(e.target.value)} required placeholder="Ej: 10" />
                  </div>
                  <div className="form-group">
                    <label>Total ($)</label>
                    <input type="number" min="0" step="0.01" value={orderForm.total} onChange={e => setOrderForm(prev => ({ ...prev, total: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Fecha de entrega</label>
                    <input type="date" value={orderForm.deliveryDate} onChange={e => setOrderForm(prev => ({ ...prev, deliveryDate: e.target.value }))} />
                  </div>
                </div>
                {(() => {
                  const prod = (products || []).find(p => p.name === orderForm.product)
                  if (!prod) return null
                  const units = prod.unitsPerBox || 1
                  const retail = prod.retailPrice || prod.price || 0
                  const wholesale = prod.wholesalePrice || 0
                  const cost = prod.productionCost || 0
                  const selectedPrice = orderForm.priceType === 'wholesale' ? wholesale : retail
                  const qty = Number(orderForm.quantity) || 0
                  const totalAlf = units * qty
                  const profit = cost > 0 && qty > 0 ? (selectedPrice - cost) * qty : null
                  return (
                    <div className="order-price-summary">
                      <span>📦 {totalAlf} alfajor{totalAlf !== 1 ? 'es' : ''} total{units > 1 ? ` (${qty} × ${units})` : ''}</span>
                      <span>💲 Precio unitario: ${selectedPrice.toLocaleString()}{wholesale > 0 && orderForm.priceType === 'retail' ? ` · Mayor: $${wholesale.toLocaleString()}` : ''}</span>
                      {profit !== null && <span className="profit-hint">📊 Ganancia estimada: <strong>${profit.toLocaleString()}</strong> ({Math.round(((selectedPrice - cost) / selectedPrice) * 100)}% margen)</span>}
                    </div>
                  )
                })()}
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Confirmar pedido</button>
                </div>
              </form>
            )}

            {chartData.length > 1 && (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v / 1000}k`} />
                  <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Monto']} />
                  <Line type="monotone" dataKey="monto" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
            <div className="orders-list">
              {[...selected.orders].reverse().map((o, i) => {
                const realIndex = selected.orders.length - 1 - i
                return (
                  <div className={`order-row${o.delivered === false ? ' order-pending' : ''}`} key={i}>
                    <span>{o.date}</span>
                    <span className="order-product">{o.product || '-'}</span>
                    <span>{o.quantity ? `${o.quantity} uds` : '-'}</span>
                    <strong>${o.total.toLocaleString()}</strong>
                    {o.deliveryDate && (
                      <span className={`badge ${o.delivered ? 'badge-green' : 'badge-amber'}`} style={{ cursor: 'pointer' }}
                        onClick={() => toggleDelivered(realIndex)}
                        title={o.delivered ? 'Marcar como pendiente' : 'Marcar como entregado'}>
                        {o.delivered ? '✅' : '📦'} {o.deliveryDate.slice(5)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Clientes</h2>
        <div className="header-actions">
          <div className="csv-tooltip-wrap">
            <button className="btn-export" onClick={() => exportCSV(clients, [
              { key: 'name', label: 'Empresa' },
              { key: 'contact', label: 'Contacto' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Teléfono' },
              { key: 'category', label: 'Categoría' },
              { key: 'address', label: 'Dirección' },
              { label: 'Pedidos', transform: c => c.orders.length },
              { label: 'Facturación', transform: c => c.orders.reduce((s, o) => s + o.total, 0) },
            ], 'clientes.csv')}>📄 Exportar CSV</button>
            <div className="csv-tooltip">
              Genera un archivo <strong>.csv</strong> que podés abrir en <strong>Excel</strong> o cualquier planilla de cálculo. También sirve como respaldo de esta sección.
            </div>
          </div>
          <button className="btn-primary" onClick={openNew}>+ Nuevo Cliente</button>
        </div>
      </div>
      <div className="filters">
        <input
          className="search-input"
          placeholder="Buscar por nombre, contacto o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {clientCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Contacto</th>
              <th>Categoría</th>
              <th>Pedidos</th>
              <th>Pendientes</th>
              <th>Facturación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="td-main" onClick={() => openDetail(c)}>{c.name}</td>
                <td>{c.contact}</td>
                <td><span className="badge">{c.category}</span></td>
                <td>{c.orders.length}</td>
                <td>
                  {(() => { const p = c.orders.filter(o => o.deliveryDate && !o.delivered).length; return p > 0 ? <span className="badge badge-amber">{p}</span> : '—' })()}
                </td>
                <td>${c.orders.reduce((s, o) => s + o.total, 0).toLocaleString()}</td>
                <td className="td-actions">
                  <button className="btn-sm" onClick={() => openDetail(c)}>Ver</button>
                  <button className="btn-sm" onClick={() => openEdit(c)}>Editar</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="empty">No se encontraron clientes</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
