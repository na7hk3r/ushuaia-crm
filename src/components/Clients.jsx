import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { exportCSV } from '../utils/exportCSV'

const emptyClient = {
  name: '', contact: '', email: '', phone: '', address: '', category: 'minorista', notes: '', orders: []
}

export default function Clients({ clients, setClients, settings }) {
  const clientCategories = settings?.clientCategories || ['distribuidor', 'minorista', 'gastronomia', 'supermercado', 'mayorista']
  const [view, setView] = useState('list') // list | form | detail
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ ...emptyClient })
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')

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

  function handleAddOrder() {
    const totalStr = prompt('Monto total del pedido:')
    if (!totalStr) return
    const total = Number(totalStr)
    if (isNaN(total) || total <= 0) return
    const date = new Date().toISOString().slice(0, 10)
    setClients(prev => prev.map(c =>
      c.id === selected.id
        ? { ...c, orders: [...c.orders, { date, total }] }
        : c
    ))
    setSelected(prev => ({ ...prev, orders: [...prev.orders, { date, total }] }))
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
            <div className="detail-row"><span>Categoría:</span><span className="badge">{selected.category}</span></div>
            <div className="detail-row"><span>Cliente desde:</span><strong>{selected.createdAt}</strong></div>
            {selected.notes && <div className="detail-notes"><span>Notas:</span><p>{selected.notes}</p></div>}
          </div>
          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Pedidos ({selected.orders.length})</h3>
              <button className="btn-sm" onClick={handleAddOrder}>+ Agregar pedido</button>
            </div>
            <div className="detail-row"><span>Facturación total:</span><strong className="revenue">${totalRevenue.toLocaleString()}</strong></div>
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
              {[...selected.orders].reverse().map((o, i) => (
                <div className="order-row" key={i}>
                  <span>{o.date}</span>
                  <strong>${o.total.toLocaleString()}</strong>
                </div>
              ))}
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
                <td>${c.orders.reduce((s, o) => s + o.total, 0).toLocaleString()}</td>
                <td className="td-actions">
                  <button className="btn-sm" onClick={() => openDetail(c)}>Ver</button>
                  <button className="btn-sm" onClick={() => openEdit(c)}>Editar</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="empty">No se encontraron clientes</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
