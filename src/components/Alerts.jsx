import { useState } from 'react'

export default function Alerts({ clients, products, rawMaterials, production, onNavigate }) {
  const [collapsed, setCollapsed] = useState({})
  const toggle = key => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))

  const today = new Date().toISOString().slice(0, 10)
  const in7days = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)

  // ── Pedidos: vencidos, hoy, próximos ──
  const allOrders = []
  clients.forEach(c => {
    c.orders.forEach(o => {
      if (o.deliveryDate && !o.delivered) {
        allOrders.push({ ...o, clientName: c.name, clientId: c.id })
      }
    })
  })

  const overdueOrders = allOrders.filter(o => o.deliveryDate < today).sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))
  const todayOrders = allOrders.filter(o => o.deliveryDate === today)
  const upcomingOrders = allOrders.filter(o => o.deliveryDate > today && o.deliveryDate <= in7days).sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))

  // ── Stock bajo ──
  const lowProducts = products.filter(p => p.stock <= p.minStock)
  const lowMaterials = rawMaterials.filter(m => m.stock <= m.minStock)

  // ── Producción activa ──
  const activeProd = production.filter(p => p.status === 'en-progreso')
  const plannedProd = production.filter(p => p.status === 'planificado')

  // ── Contadores ──
  const criticalCount = overdueOrders.length + lowProducts.length + lowMaterials.length
  const warningCount = todayOrders.length + activeProd.length
  const infoCount = upcomingOrders.length + plannedProd.length

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}`
  }

  function daysAgo(dateStr) {
    const diff = Math.floor((new Date(today) - new Date(dateStr)) / 86400000)
    if (diff === 1) return '1 día de atraso'
    return `${diff} días de atraso`
  }

  function daysUntil(dateStr) {
    const diff = Math.floor((new Date(dateStr) - new Date(today)) / 86400000)
    if (diff === 1) return 'mañana'
    return `en ${diff} días`
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>🔔 Centro de Alertas</h2>
        <span className="header-date">{new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      </div>

      {/* ── Resumen rápido ── */}
      <div className="kpi-grid four">
        <div className={`kpi-card mini${criticalCount > 0 ? ' kpi-alert' : ''}`}>
          <span className="kpi-icon">🔴</span>
          <div className="kpi-data"><span className="kpi-value">{criticalCount}</span><span className="kpi-label">Críticas</span></div>
        </div>
        <div className="kpi-card mini">
          <span className="kpi-icon">🟡</span>
          <div className="kpi-data"><span className="kpi-value">{warningCount}</span><span className="kpi-label">Atención</span></div>
        </div>
        <div className="kpi-card mini">
          <span className="kpi-icon">🔵</span>
          <div className="kpi-data"><span className="kpi-value">{infoCount}</span><span className="kpi-label">Próximos</span></div>
        </div>
        <div className="kpi-card mini">
          <span className="kpi-icon">📦</span>
          <div className="kpi-data"><span className="kpi-value">{allOrders.length}</span><span className="kpi-label">Pendientes total</span></div>
        </div>
      </div>

      {criticalCount === 0 && warningCount === 0 && infoCount === 0 && (
        <div className="alerts-empty-state">
          <span className="alerts-empty-icon">✅</span>
          <h3>Todo en orden</h3>
          <p>No hay alertas pendientes. ¡Buen trabajo!</p>
        </div>
      )}

      {/* ── Entregas vencidas ── */}
      {overdueOrders.length > 0 && (
        <div className="alert-section-card alert-critical">
          <div className="alert-section-header" onClick={() => toggle('overdue')}>
            <h3><span className={`collapse-chevron${collapsed.overdue ? ' collapsed' : ''}`}>▾</span> 🔴 Entregas vencidas</h3>
            <span className="alert-count">{overdueOrders.length}</span>
          </div>
          {!collapsed.overdue && <div className="alert-entries">
            {overdueOrders.map((o, i) => (
              <div className="alert-entry" key={i}>
                <div className="alert-entry-icon">📦</div>
                <div className="alert-entry-body">
                  <strong>{o.clientName}</strong>
                  <span>{o.product} — {o.quantity} uds · ${o.total.toLocaleString()}</span>
                  <small className="alert-overdue">Entrega {formatDate(o.deliveryDate)} · {daysAgo(o.deliveryDate)}</small>
                </div>
                <button className="btn-sm" onClick={() => onNavigate('clients')}>Ver cliente</button>
              </div>
            ))}
          </div>}
        </div>
      )}

      {/* ── Entregas de hoy ── */}
      {todayOrders.length > 0 && (
        <div className="alert-section-card alert-warning">
          <div className="alert-section-header" onClick={() => toggle('today')}>
            <h3><span className={`collapse-chevron${collapsed.today ? ' collapsed' : ''}`}>▾</span> 📦 Entregas de hoy</h3>
            <span className="alert-count">{todayOrders.length}</span>
          </div>
          {!collapsed.today && <div className="alert-entries">
            {todayOrders.map((o, i) => (
              <div className="alert-entry" key={i}>
                <div className="alert-entry-icon">🚚</div>
                <div className="alert-entry-body">
                  <strong>{o.clientName}</strong>
                  <span>{o.product} — {o.quantity} uds · ${o.total.toLocaleString()}</span>
                </div>
                <button className="btn-sm" onClick={() => onNavigate('clients')}>Ver cliente</button>
              </div>
            ))}
          </div>}
        </div>
      )}

      {/* ── Stock bajo: Productos ── */}
      {lowProducts.length > 0 && (
        <div className="alert-section-card alert-critical">
          <div className="alert-section-header" onClick={() => toggle('lowProd')}>
            <h3><span className={`collapse-chevron${collapsed.lowProd ? ' collapsed' : ''}`}>▾</span> ⚠️ Stock bajo — Productos</h3>
            <span className="alert-count">{lowProducts.length}</span>
          </div>
          {!collapsed.lowProd && <div className="alert-entries">
            {lowProducts.map(p => (
              <div className="alert-entry" key={p.id}>
                <div className="alert-entry-icon">📉</div>
                <div className="alert-entry-body">
                  <strong>{p.name}</strong>
                  <span>Actual: <b>{p.stock}</b> / Mínimo: <b>{p.minStock}</b></span>
                </div>
                <button className="btn-sm" onClick={() => onNavigate('stock')}>Ir a Stock</button>
              </div>
            ))}
          </div>}
        </div>
      )}

      {/* ── Stock bajo: Materias Primas ── */}
      {lowMaterials.length > 0 && (
        <div className="alert-section-card alert-critical">
          <div className="alert-section-header" onClick={() => toggle('lowMat')}>
            <h3><span className={`collapse-chevron${collapsed.lowMat ? ' collapsed' : ''}`}>▾</span> ⚠️ Stock bajo — Materia Prima</h3>
            <span className="alert-count">{lowMaterials.length}</span>
          </div>
          {!collapsed.lowMat && <div className="alert-entries">
            {lowMaterials.map(m => (
              <div className="alert-entry" key={m.id}>
                <div className="alert-entry-icon">🧈</div>
                <div className="alert-entry-body">
                  <strong>{m.name}</strong>
                  <span>Actual: <b>{m.stock} {m.unit}</b> / Mínimo: <b>{m.minStock} {m.unit}</b></span>
                  {m.supplier && <small>Proveedor: {m.supplier}</small>}
                </div>
                <button className="btn-sm" onClick={() => onNavigate('materials')}>Ir a MP</button>
              </div>
            ))}
          </div>}
        </div>
      )}

      {/* ── Próximas entregas ── */}
      {upcomingOrders.length > 0 && (
        <div className="alert-section-card alert-info">
          <div className="alert-section-header" onClick={() => toggle('upcoming')}>
            <h3><span className={`collapse-chevron${collapsed.upcoming ? ' collapsed' : ''}`}>▾</span> 📅 Próximas entregas (7 días)</h3>
            <span className="alert-count">{upcomingOrders.length}</span>
          </div>
          {!collapsed.upcoming && <div className="alert-entries">
            {upcomingOrders.map((o, i) => (
              <div className="alert-entry" key={i}>
                <div className="alert-entry-icon">📅</div>
                <div className="alert-entry-body">
                  <strong>{o.clientName}</strong>
                  <span>{o.product} — {o.quantity} uds · ${o.total.toLocaleString()}</span>
                  <small>Entrega {formatDate(o.deliveryDate)} · {daysUntil(o.deliveryDate)}</small>
                </div>
                <button className="btn-sm" onClick={() => onNavigate('clients')}>Ver cliente</button>
              </div>
            ))}
          </div>}
        </div>
      )}

      {/* ── Producción activa ── */}
      {activeProd.length > 0 && (
        <div className="alert-section-card alert-warning">
          <div className="alert-section-header" onClick={() => toggle('active')}>
            <h3><span className={`collapse-chevron${collapsed.active ? ' collapsed' : ''}`}>▾</span> 🔧 Producción en progreso</h3>
            <span className="alert-count">{activeProd.length}</span>
          </div>
          {!collapsed.active && <div className="alert-entries">
            {activeProd.map(p => (
              <div className="alert-entry" key={p.id}>
                <div className="alert-entry-icon">🏭</div>
                <div className="alert-entry-body">
                  <strong>{p.product}</strong>
                  <span>{p.quantity} unidades · Fecha: {formatDate(p.date)}</span>
                </div>
                <button className="btn-sm" onClick={() => onNavigate('production')}>Ir a Producción</button>
              </div>
            ))}
          </div>}
        </div>
      )}

      {/* ── Producción planificada ── */}
      {plannedProd.length > 0 && (
        <div className="alert-section-card alert-info">
          <div className="alert-section-header" onClick={() => toggle('planned')}>
            <h3><span className={`collapse-chevron${collapsed.planned ? ' collapsed' : ''}`}>▾</span> 📋 Producción planificada</h3>
            <span className="alert-count">{plannedProd.length}</span>
          </div>
          {!collapsed.planned && <div className="alert-entries">
            {plannedProd.map(p => (
              <div className="alert-entry" key={p.id}>
                <div className="alert-entry-icon">📋</div>
                <div className="alert-entry-body">
                  <strong>{p.product}</strong>
                  <span>{p.quantity} unidades · Programado: {formatDate(p.date)}</span>
                </div>
                <button className="btn-sm" onClick={() => onNavigate('production')}>Ir a Producción</button>
              </div>
            ))}
          </div>}
        </div>
      )}
    </div>
  )
}
