import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { monthlySales } from '../data/initialData'

const PIE_COLORS = ['#0EA5E9', '#38BDF8', '#06B6D4', '#0284C7', '#7DD3FC']
const CHART_BLUE = '#0EA5E9'
const CHART_CYAN = '#06B6D4'
const CHART_GREEN = '#10B981'
const CHART_AMBER = '#FBBF24'
const CHART_PURPLE = '#8B5CF6'

export default function Dashboard({ clients, products, rawMaterials, production, settings, hasDemoData, onClearDemoData }) {
  const totalClients = clients.length
  const totalRevenue = clients.reduce((sum, c) => sum + c.orders.reduce((s, o) => s + o.total, 0), 0)
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length
  const lowStockMaterials = rawMaterials.filter(m => m.stock <= m.minStock).length
  const pendingProduction = production.filter(p => p.status !== 'completado' && p.status !== 'cancelado').length
  const totalAlerts = lowStockProducts + lowStockMaterials

  const categoryData = clients.reduce((acc, c) => {
    const existing = acc.find(a => a.name === c.category)
    if (existing) existing.value++
    else acc.push({ name: c.category, value: 1 })
    return acc
  }, [])

  const productStockData = products.map(p => ({
    name: p.name.replace('Alfajor de ', '').replace('Alfajor ', ''),
    stock: p.stock,
    minimo: p.minStock,
  }))

  const revenueByClient = clients.map(c => ({
    name: c.name.length > 18 ? c.name.slice(0, 18) + '…' : c.name,
    total: c.orders.reduce((s, o) => s + o.total, 0),
  })).sort((a, b) => b.total - a.total)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h2>🏔️ {settings?.companyName || 'Ushuaia Alfajores'}</h2>
          <p>{new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {hasDemoData && (
        <div className="demo-banner">
          <div className="demo-banner-content">
            <span className="demo-banner-icon">💡</span>
            <div className="demo-banner-text">
              <strong>Datos de ejemplo cargados</strong>
              <p>El programa contiene datos de demostración. Podés eliminarlos para empezar con tu propia información.</p>
            </div>
          </div>
          <button className="btn-danger btn-sm" onClick={onClearDemoData}>
            🗑️ Eliminar datos de ejemplo
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-icon">👥</span>
          <div className="kpi-data">
            <span className="kpi-value">{totalClients}</span>
            <span className="kpi-label">Clientes activos</span>
          </div>
        </div>
        <div className="kpi-card">
          <span className="kpi-icon">💰</span>
          <div className="kpi-data">
            <span className="kpi-value">${(totalRevenue / 1000).toFixed(0)}k</span>
            <span className="kpi-label">Facturación total</span>
          </div>
        </div>
        <div className="kpi-card">
          <span className="kpi-icon">🏭</span>
          <div className="kpi-data">
            <span className="kpi-value">{pendingProduction}</span>
            <span className="kpi-label">Producción pendiente</span>
          </div>
        </div>
        <div className={`kpi-card${totalAlerts > 0 ? ' kpi-alert' : ''}`}>
          <span className="kpi-icon">⚠️</span>
          <div className="kpi-data">
            <span className="kpi-value">{totalAlerts}</span>
            <span className="kpi-label">Alertas de stock</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Ventas Mensuales</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Ventas']} />
              <Bar dataKey="ventas" fill={CHART_BLUE} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Clientes por Categoría</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Stock de Productos</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={productStockData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
              <Tooltip />
              <Bar dataKey="stock" fill={CHART_GREEN} radius={[0, 4, 4, 0]} name="Stock actual" />
              <Bar dataKey="minimo" fill={CHART_AMBER} radius={[0, 4, 4, 0]} name="Mínimo" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Facturación por Cliente</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueByClient}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Total']} />
              <Bar dataKey="total" fill={CHART_PURPLE} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      {totalAlerts > 0 && (
        <div className="alerts-section">
          <h3>⚠️ Alertas de Reposición</h3>
          <div className="alert-list">
            {products.filter(p => p.stock <= p.minStock).map(p => (
              <div className="alert-item alert-product" key={`p-${p.id}`}>
                <span className="alert-badge">Producto</span>
                <strong>{p.name}</strong>
                <span>Stock: {p.stock} / Mín: {p.minStock}</span>
              </div>
            ))}
            {rawMaterials.filter(m => m.stock <= m.minStock).map(m => (
              <div className="alert-item alert-material" key={`m-${m.id}`}>
                <span className="alert-badge material">Materia prima</span>
                <strong>{m.name}</strong>
                <span>Stock: {m.stock} {m.unit} / Mín: {m.minStock} — Proveedor: {m.supplier}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
