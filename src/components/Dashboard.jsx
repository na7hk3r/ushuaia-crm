import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CHART_BLUE = '#0EA5E9'
const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTH_NAMES_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function Dashboard({ clients, products, rawMaterials, production, settings, hasDemoData, onClearDemoData, onNavigate }) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const [chartStartMonth, setChartStartMonth] = useState(() => {
    const d = new Date(currentYear, currentMonth - 5, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [chartMonths, setChartMonths] = useState(6)
  const [calMonth, setCalMonth] = useState(currentMonth)
  const [calYear, setCalYear] = useState(currentYear)
  const [selectedDay, setSelectedDay] = useState(null)

  const totalClients = clients.length

  const { currentMonthRevenue, currentMonthCost, lastMonthRevenue } = useMemo(() => {
    let revenue = 0, cost = 0, lastRev = 0
    const productMap = {}
    products.forEach(p => { productMap[p.name] = p })
    const lastM = currentMonth === 0 ? 11 : currentMonth - 1
    const lastY = currentMonth === 0 ? currentYear - 1 : currentYear
    clients.forEach(c => {
      (c.orders || []).forEach(o => {
        const d = new Date(o.date)
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          revenue += o.total
          const prod = productMap[o.product]
          if (prod && prod.productionCost) cost += prod.productionCost * (o.quantity || 0)
        }
        if (d.getMonth() === lastM && d.getFullYear() === lastY) lastRev += o.total
      })
    })
    return { currentMonthRevenue: revenue, currentMonthCost: cost, lastMonthRevenue: lastRev }
  }, [clients, products, currentMonth, currentYear])

  const currentMonthProfit = currentMonthRevenue - currentMonthCost
  const revenueChange = lastMonthRevenue > 0 ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : null

  const pendingDeliveries = useMemo(() => {
    const deliveries = []
    clients.forEach(c => {
      (c.orders || []).forEach(o => {
        if (o.deliveryDate && !o.delivered) {
          deliveries.push({ ...o, clientName: c.name, clientAddress: c.address })
        }
      })
    })
    return deliveries.sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))
  }, [clients])

  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length
  const lowStockMaterials = rawMaterials.filter(m => m.stock <= m.minStock).length
  const totalAlerts = lowStockProducts + lowStockMaterials

  const chartData = useMemo(() => {
    const [startYear, startMonthNum] = chartStartMonth.split('-').map(Number)
    const productMap = {}
    products.forEach(p => { productMap[p.name] = p })
    const data = []
    for (let i = 0; i < chartMonths; i++) {
      const d = new Date(startYear, startMonthNum - 1 + i, 1)
      const y = d.getFullYear()
      const m = d.getMonth()
      let total = 0, cost = 0
      clients.forEach(c => {
        (c.orders || []).forEach(o => {
          const oDate = new Date(o.date)
          if (oDate.getFullYear() === y && oDate.getMonth() === m) {
            total += o.total
            const prod = productMap[o.product]
            if (prod && prod.productionCost) cost += prod.productionCost * (o.quantity || 0)
          }
        })
      })
      data.push({ month: `${MONTH_NAMES[m]} ${String(y).slice(2)}`, ingresos: total, costos: cost, ganancia: total - cost })
    }
    return data
  }, [clients, products, chartStartMonth, chartMonths])

  const deliveryDatesInMonth = useMemo(() => {
    const dates = new Set()
    clients.forEach(c => {
      (c.orders || []).forEach(o => {
        if (o.deliveryDate) {
          const d = new Date(o.deliveryDate + 'T12:00')
          if (d.getMonth() === calMonth && d.getFullYear() === calYear) dates.add(d.getDate())
        }
      })
    })
    return dates
  }, [clients, calMonth, calYear])

  const deliveriesForDay = useMemo(() => {
    if (!selectedDay) return []
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    const result = []
    clients.forEach(c => {
      (c.orders || []).forEach(o => {
        if (o.deliveryDate === dateStr) result.push({ ...o, clientName: c.name, clientAddress: c.address })
      })
    })
    return result
  }, [clients, selectedDay, calMonth, calYear])

  const upcomingDeliveries = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekLater = new Date(today)
    weekLater.setDate(weekLater.getDate() + 7)
    const deliveries = []
    clients.forEach(c => {
      (c.orders || []).forEach(o => {
        if (o.deliveryDate) {
          const d = new Date(o.deliveryDate + 'T12:00')
          d.setHours(0, 0, 0, 0)
          if (d >= today && d <= weekLater) deliveries.push({ ...o, clientName: c.name, clientAddress: c.address })
        }
      })
    })
    return deliveries.sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))
  }, [clients])

  // Top 5 clients by revenue
  const topClients = useMemo(() => {
    return [...clients]
      .map(c => ({ name: c.name, revenue: c.orders.reduce((s, o) => s + o.total, 0), orders: c.orders.length }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }, [clients])

  // Production summary
  const prodStats = useMemo(() => ({
    active: production.filter(p => p.status === 'en-progreso').length,
    planned: production.filter(p => p.status === 'planificado').length,
    completed: production.filter(p => p.status === 'completado').length,
    totalUnits: production.filter(p => p.status !== 'cancelado').reduce((s, p) => s + p.quantity, 0),
  }), [production])

  function renderCalendar() {
    const firstDay = new Date(calYear, calMonth, 1)
    const lastDay = new Date(calYear, calMonth + 1, 0)
    const startWeekDay = (firstDay.getDay() + 6) % 7
    const daysInMonth = lastDay.getDate()
    const cells = []
    for (let i = 0; i < startWeekDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    const todayDate = now.getDate()
    const isCurrentMonth = calMonth === currentMonth && calYear === currentYear
    return cells.map((d, i) => (
      <div
        key={i}
        className={`cal-day${!d ? ' empty' : ''}${d && isCurrentMonth && d === todayDate ? ' today' : ''}${d && deliveryDatesInMonth.has(d) ? ' has-delivery' : ''}${d && d === selectedDay ? ' selected' : ''}`}
        onClick={() => d && deliveryDatesInMonth.has(d) && setSelectedDay(d === selectedDay ? null : d)}
      >
        {d || ''}
        {d && deliveryDatesInMonth.has(d) && <span className="cal-dot">●</span>}
      </div>
    ))
  }

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) } else setCalMonth(calMonth - 1)
    setSelectedDay(null)
  }

  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) } else setCalMonth(calMonth + 1)
    setSelectedDay(null)
  }

  function openMapRoute(deliveries) {
    if (deliveries.length === 0) return
    const addresses = deliveries.map(d => encodeURIComponent(d.clientAddress)).join('/')
    window.open(`https://www.google.com/maps/dir/${addresses}`, '_blank')
  }

  function openMap(address) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
  }

  const monthOptions = useMemo(() => {
    const options = []
    for (let i = -12; i <= 0; i++) {
      const d = new Date(currentYear, currentMonth + i, 1)
      options.push({
        value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: `${MONTH_NAMES_FULL[d.getMonth()]} ${d.getFullYear()}`
      })
    }
    return options
  }, [currentMonth, currentYear])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h2>🏔️ {settings?.companyName || 'Ushuaia Alfajores'}</h2>
          <p>{now.toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
      <div className="dash-kpi-row">
        <div className="dash-kpi-card clickable" onClick={() => onNavigate('clients')}>
          <span className="dash-kpi-label">Clientes</span>
          <span className="dash-kpi-value">{totalClients}</span>
        </div>
        <div className="dash-kpi-card clickable" onClick={() => onNavigate('clients')}>
          <span className="dash-kpi-label">Ingresos del mes</span>
          <span className="dash-kpi-value">${currentMonthRevenue.toLocaleString('es-UY')}{revenueChange !== null && <span className={`dash-kpi-trend ${revenueChange >= 0 ? 'up' : 'down'}`}>{revenueChange >= 0 ? '↑' : '↓'} {Math.abs(revenueChange)}%</span>}</span>
        </div>
        <div className={`dash-kpi-card clickable${currentMonthProfit > 0 ? ' accent-green' : ''}`} onClick={() => onNavigate('clients')}>
          <span className="dash-kpi-label">Ganancia est.</span>
          <span className="dash-kpi-value">${currentMonthProfit.toLocaleString('es-UY')}</span>
        </div>
        <div className={`dash-kpi-card clickable${pendingDeliveries.length > 0 ? ' accent-amber' : ''}`} onClick={() => onNavigate('clients')}>
          <span className="dash-kpi-label">Entregas pend.</span>
          <span className="dash-kpi-value">{pendingDeliveries.length}</span>
        </div>
        <div className={`dash-kpi-card clickable${totalAlerts > 0 ? ' accent-red' : ''}`} onClick={() => onNavigate('alerts')}>
          <span className="dash-kpi-label">Alertas stock</span>
          <span className="dash-kpi-value">{totalAlerts}</span>
        </div>
        <div className="dash-kpi-card clickable" onClick={() => onNavigate('production')}>
          <span className="dash-kpi-label">En producción</span>
          <span className="dash-kpi-value">{prodStats.active}</span>
        </div>
      </div>

      {/* Main 3-column dashboard grid */}
      <div className="dash-grid-3">
        {/* Col 1: Deliveries */}
        <div className="chart-card dash-card-tight">
          <div className="delivery-header">
            <h3>🚚 Entregas (7 días)</h3>
            {upcomingDeliveries.length > 0 && (
              <button className="btn-sm" onClick={() => openMapRoute(upcomingDeliveries)}>🗺️ Ruta</button>
            )}
          </div>
          {upcomingDeliveries.length === 0 ? (
            <p className="empty-message">Sin entregas próximas</p>
          ) : (
            <div className="delivery-list dash-scroll">
              {upcomingDeliveries.map((d, i) => (
                <div className={`delivery-item${d.delivered ? ' delivered' : ''}`} key={i}>
                  <div className="delivery-date">
                    <span className="delivery-day">{new Date(d.deliveryDate + 'T12:00').getDate()}</span>
                    <span className="delivery-month">{MONTH_NAMES[new Date(d.deliveryDate + 'T12:00').getMonth()]}</span>
                  </div>
                  <div className="delivery-info">
                    <strong>{d.clientName}</strong>
                    <span>{d.product || '-'} · {d.quantity} uds · ${d.total?.toLocaleString('es-UY')}</span>
                  </div>
                  <button className="btn-map-sm" onClick={() => openMap(d.clientAddress)} title="Ver en mapa">📍</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Col 2: Calendar */}
        <div className="chart-card dash-card-tight">
          <div className="cal-nav">
            <button className="btn-mini" onClick={prevMonth}>◀</button>
            <h3>📅 {MONTH_NAMES_FULL[calMonth]} {calYear}</h3>
            <button className="btn-mini" onClick={nextMonth}>▶</button>
          </div>
          <div className="cal-grid">
            {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d => (
              <div className="cal-day-name" key={d}>{d}</div>
            ))}
            {renderCalendar()}
          </div>
          {selectedDay && deliveriesForDay.length > 0 && (
            <div className="cal-deliveries">
              <strong>Entregas del {selectedDay}/{calMonth + 1}:</strong>
              {deliveriesForDay.map((d, i) => (
                <div className="cal-delivery-item" key={i}>
                  <span>{d.clientName}</span>
                  <span>{d.product || '-'} · {d.quantity} uds</span>
                  <span className={`badge ${d.delivered ? 'badge-green' : 'badge-amber'}`}>
                    {d.delivered ? '✅' : '📦'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Col 3: Top clients + Production */}
        <div className="dash-sidebar-col">
          <div className="chart-card dash-card-tight">
            <h3 className="dash-link-header" onClick={() => onNavigate('clients')}>🏆 Top Clientes</h3>
            <div className="dash-top-list">
              {topClients.map((c, i) => (
                <div className="dash-top-item" key={i}>
                  <span className="dash-top-rank">{i + 1}</span>
                  <div className="dash-top-info">
                    <strong>{c.name}</strong>
                    <small>{c.orders} pedidos</small>
                  </div>
                  <span className="dash-top-value">${c.revenue.toLocaleString('es-UY')}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-card dash-card-tight">
            <h3 className="dash-link-header" onClick={() => onNavigate('production')}>🏭 Producción</h3>
            <div className="dash-prod-grid">
              <div className="dash-prod-stat">
                <span className="dash-prod-num">{prodStats.active}</span>
                <small>En progreso</small>
              </div>
              <div className="dash-prod-stat">
                <span className="dash-prod-num">{prodStats.planned}</span>
                <small>Planificadas</small>
              </div>
              <div className="dash-prod-stat">
                <span className="dash-prod-num">{prodStats.completed}</span>
                <small>Completadas</small>
              </div>
              <div className="dash-prod-stat">
                <span className="dash-prod-num">{prodStats.totalUnits}</span>
                <small>Uds. total</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Alerts row */}
      <div className="dash-grid-chart-alerts">
        {/* Ingresos Mensuales */}
        <div className="chart-card dash-card-tight">
          <div className="chart-header-row">
            <h3>📈 Ingresos y Ganancia</h3>
            <div className="chart-controls">
              <select value={chartStartMonth} onChange={e => setChartStartMonth(e.target.value)} className="chart-select">
                {monthOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select value={chartMonths} onChange={e => setChartMonths(Number(e.target.value))} className="chart-select">
                <option value={3}>3m</option>
                <option value={6}>6m</option>
                <option value={9}>9m</option>
                <option value={12}>12m</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v, name) => [`$${v.toLocaleString('es-UY')}`, name === 'ingresos' ? 'Ingresos' : name === 'costos' ? 'Costos' : 'Ganancia']} />
              <Bar dataKey="ingresos" fill={CHART_BLUE} radius={[4, 4, 0, 0]} />
              <Bar dataKey="ganancia" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts sidebar */}
        {totalAlerts > 0 && (
          <div className="chart-card dash-card-tight dash-alerts-compact">
            <h3 className="dash-link-header" onClick={() => onNavigate('alerts')}>⚠️ Alertas de Reposición</h3>
            <div className="dash-alert-list">
              {products.filter(p => p.stock <= p.minStock).map(p => (
                <div className="dash-alert-row dash-alert-red" key={`p-${p.id}`}>
                  <span className="dash-alert-icon">📦</span>
                  <div className="dash-alert-body">
                    <strong>{p.name}</strong>
                    <span>{p.stock} / {p.minStock}</span>
                  </div>
                </div>
              ))}
              {rawMaterials.filter(m => m.stock <= m.minStock).map(m => (
                <div className="dash-alert-row dash-alert-amber" key={`m-${m.id}`}>
                  <span className="dash-alert-icon">🧈</span>
                  <div className="dash-alert-body">
                    <strong>{m.name}</strong>
                    <span>{m.stock} / {m.minStock} {m.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
