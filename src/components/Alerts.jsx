import { useState } from 'react'
import { getProductDisplayName } from '../utils/products.js'

const ORDER_BADGES = {
  critical: '!',
  warning: 'HOY',
  info: '7D',
}

export default function Alerts({ clients, products, rawMaterials, production, settings, onNavigate }) {
  const [collapsed, setCollapsed] = useState({})
  const [{ today, in7days, headerDate }] = useState(() => {
    const now = new Date()
    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)
    return {
      today: now.toISOString().slice(0, 10),
      in7days: nextWeek.toISOString().slice(0, 10),
      headerDate: now.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }),
    }
  })

  const safeClients = clients || []
  const safeProducts = products || []
  const safeMaterials = rawMaterials || []
  const safeProduction = production || []
  const stockAlertsEnabled = settings?.stockAlertEnabled !== false

  const toggle = key => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))

  const allOrders = []
  safeClients.forEach(client => {
    ;(client.orders || []).forEach(order => {
      if (order.deliveryDate && !order.delivered) {
        allOrders.push({ ...order, clientName: client.name, clientId: client.id })
      }
    })
  })

  const overdueOrders = allOrders.filter(order => order.deliveryDate < today).sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))
  const todayOrders = allOrders.filter(order => order.deliveryDate === today)
  const upcomingOrders = allOrders.filter(order => order.deliveryDate > today && order.deliveryDate <= in7days).sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))

  const lowProducts = stockAlertsEnabled ? safeProducts.filter(product => !product.archived && product.stock <= product.minStock) : []
  const lowMaterials = stockAlertsEnabled ? safeMaterials.filter(material => material.stock <= material.minStock) : []
  const activeProd = safeProduction.filter(item => item.status === 'en-progreso')
  const plannedProd = safeProduction.filter(item => item.status === 'planificado')

  const criticalCount = overdueOrders.length + lowProducts.length + lowMaterials.length
  const warningCount = todayOrders.length + activeProd.length
  const infoCount = upcomingOrders.length + plannedProd.length
  const totalOpenAlerts = criticalCount + warningCount + infoCount

  const summary = getAlertSummary()

  function getAlertSummary() {
    if (criticalCount > 0) {
      return {
        tone: 'summary-critical',
        label: 'Prioridad alta',
        title: `${criticalCount} alerta${criticalCount === 1 ? '' : 's'} critica${criticalCount === 1 ? '' : 's'}`,
        text: 'Revisar entregas vencidas y faltantes de stock antes de cargar nueva produccion.',
      }
    }

    if (warningCount > 0) {
      return {
        tone: 'summary-warning',
        label: 'Seguimiento',
        title: `${warningCount} tema${warningCount === 1 ? '' : 's'} para hoy`,
        text: 'Hay entregas o produccion en curso que conviene cerrar durante la jornada.',
      }
    }

    if (infoCount > 0) {
      return {
        tone: 'summary-info',
        label: 'Planificacion',
        title: `${infoCount} aviso${infoCount === 1 ? '' : 's'} proximo${infoCount === 1 ? '' : 's'}`,
        text: 'La agenda de los proximos dias esta visible para anticipar stock y produccion.',
      }
    }

    return {
      tone: 'summary-ok',
      label: 'Sin pendientes',
      title: 'Todo en orden',
      text: 'No hay entregas vencidas, stock bajo ni produccion pendiente para destacar.',
    }
  }

  function formatCurrency(value) {
    return (Number(value) || 0).toLocaleString()
  }

  function formatDate(dateStr) {
    if (!dateStr || !dateStr.includes('-')) return 'Sin fecha'
    const [, month, day] = dateStr.split('-')
    return `${day}/${month}`
  }

  function daysAgo(dateStr) {
    const diff = Math.floor((new Date(today) - new Date(dateStr)) / 86400000)
    if (diff === 1) return '1 dia de atraso'
    return `${diff} dias de atraso`
  }

  function daysUntil(dateStr) {
    const diff = Math.floor((new Date(dateStr) - new Date(today)) / 86400000)
    if (diff === 1) return 'manana'
    return `en ${diff} dias`
  }

  function getOrderKey(order) {
    return order.id || `${order.clientId}-${order.deliveryDate}-${order.productId || order.product}-${order.quantity}`
  }

  function renderSection({ id, tone, title, detail, count, children }) {
    if (count === 0) return null
    const isCollapsed = collapsed[id]

    return (
      <section className={`alert-section-card alert-${tone}`}>
        <button type="button" className="alert-section-header" onClick={() => toggle(id)}>
          <div className="alert-section-heading">
            <h3>
              <span className={`collapse-chevron${isCollapsed ? ' collapsed' : ''}`}>v</span>
              <span className="alert-section-title">{title}</span>
            </h3>
            {detail && <p>{detail}</p>}
          </div>
          <span className="alert-count">{count}</span>
        </button>
        {!isCollapsed && <div className="alert-entries">{children}</div>}
      </section>
    )
  }

  function renderOrderEntry(order, severity, actionText = 'Ver cliente') {
    const isOverdue = order.deliveryDate < today
    const isToday = order.deliveryDate === today
    const isUpcoming = order.deliveryDate > today

    return (
      <div className={`alert-entry alert-entry-${severity}`} key={getOrderKey(order)}>
        <div className="alert-entry-icon">{ORDER_BADGES[severity]}</div>
        <div className="alert-entry-body">
          <strong>{order.clientName}</strong>
          <span>{getProductDisplayName(safeProducts, order)} - {order.quantity} uds - ${formatCurrency(order.total)}</span>
          {isOverdue && <small className="alert-overdue">Entrega {formatDate(order.deliveryDate)} - {daysAgo(order.deliveryDate)}</small>}
          {isToday && <small>Entrega hoy - revisar antes del cierre</small>}
          {isUpcoming && <small>Entrega {formatDate(order.deliveryDate)} - {daysUntil(order.deliveryDate)}</small>}
        </div>
        <button className="btn-sm" onClick={() => onNavigate('clients')}>{actionText}</button>
      </div>
    )
  }

  return (
    <div className="page alerts-page">
      <div className="page-header alerts-header">
        <div>
          <h2>Centro de Alertas</h2>
          <p className="page-subtitle">Prioridades operativas, stock y entregas en una sola vista.</p>
        </div>
        <span className="header-date">{headerDate}</span>
      </div>

      <div className={`alerts-summary-panel ${summary.tone}`}>
        <div className="alerts-summary-status">
          <span>{summary.label}</span>
          <strong>{summary.title}</strong>
        </div>
        <p>{summary.text}</p>
        {!stockAlertsEnabled && <span className="alerts-summary-note">Alertas de stock desactivadas desde Configuracion.</span>}
      </div>

      <div className="kpi-grid four alerts-kpi-grid">
        <div className={`kpi-card mini alert-kpi-card alert-kpi-critical${criticalCount > 0 ? ' has-items' : ''}`}>
          <span className="kpi-icon">!</span>
          <div className="kpi-data"><span className="kpi-value">{criticalCount}</span><span className="kpi-label">Criticas</span></div>
        </div>
        <div className={`kpi-card mini alert-kpi-card alert-kpi-warning${warningCount > 0 ? ' has-items' : ''}`}>
          <span className="kpi-icon">HOY</span>
          <div className="kpi-data"><span className="kpi-value">{warningCount}</span><span className="kpi-label">Atencion</span></div>
        </div>
        <div className={`kpi-card mini alert-kpi-card alert-kpi-info${infoCount > 0 ? ' has-items' : ''}`}>
          <span className="kpi-icon">7D</span>
          <div className="kpi-data"><span className="kpi-value">{infoCount}</span><span className="kpi-label">Proximos</span></div>
        </div>
        <div className="kpi-card mini alert-kpi-card alert-kpi-total">
          <span className="kpi-icon">#</span>
          <div className="kpi-data"><span className="kpi-value">{allOrders.length}</span><span className="kpi-label">Pedidos abiertos</span></div>
        </div>
      </div>

      {totalOpenAlerts === 0 && (
        <div className="alerts-empty-state">
          <span className="alerts-empty-icon">OK</span>
          <h3>Todo en orden</h3>
          <p>No hay alertas pendientes.</p>
        </div>
      )}

      {renderSection({
        id: 'overdue',
        tone: 'critical',
        title: 'Entregas vencidas',
        detail: 'Pedidos sin marcar como entregados y con fecha anterior a hoy.',
        count: overdueOrders.length,
        children: overdueOrders.map(order => renderOrderEntry(order, 'critical')),
      })}

      {renderSection({
        id: 'today',
        tone: 'warning',
        title: 'Entregas de hoy',
        detail: 'Pedidos que necesitan confirmacion o salida durante la jornada.',
        count: todayOrders.length,
        children: todayOrders.map(order => renderOrderEntry(order, 'warning')),
      })}

      {renderSection({
        id: 'lowProd',
        tone: 'critical',
        title: 'Stock bajo - Productos',
        detail: 'Productos activos que llegaron o bajaron de su minimo configurado.',
        count: lowProducts.length,
        children: lowProducts.map(product => (
          <div className="alert-entry alert-entry-critical" key={product.id}>
            <div className="alert-entry-icon">ST</div>
            <div className="alert-entry-body">
              <strong>{product.name}</strong>
              <span>Actual: <b>{product.stock}</b> / Minimo: <b>{product.minStock}</b></span>
              <small className="alert-overdue">Reponer o planificar produccion.</small>
            </div>
            <button className="btn-sm" onClick={() => onNavigate('stock')}>Ir a Stock</button>
          </div>
        )),
      })}

      {renderSection({
        id: 'lowMat',
        tone: 'critical',
        title: 'Stock bajo - Materia Prima',
        detail: 'Insumos por debajo del minimo para sostener la produccion.',
        count: lowMaterials.length,
        children: lowMaterials.map(material => (
          <div className="alert-entry alert-entry-critical" key={material.id}>
            <div className="alert-entry-icon">MP</div>
            <div className="alert-entry-body">
              <strong>{material.name}</strong>
              <span>Actual: <b>{material.stock} {material.unit}</b> / Minimo: <b>{material.minStock} {material.unit}</b></span>
              {material.supplier && <small>Proveedor: {material.supplier}</small>}
            </div>
            <button className="btn-sm" onClick={() => onNavigate('materials')}>Ir a MP</button>
          </div>
        )),
      })}

      {renderSection({
        id: 'upcoming',
        tone: 'info',
        title: 'Proximas entregas (7 dias)',
        detail: 'Pedidos cercanos para anticipar armado, stock y reparto.',
        count: upcomingOrders.length,
        children: upcomingOrders.map(order => renderOrderEntry(order, 'info')),
      })}

      {renderSection({
        id: 'active',
        tone: 'warning',
        title: 'Produccion en progreso',
        detail: 'Ordenes abiertas que todavia no fueron completadas.',
        count: activeProd.length,
        children: activeProd.map(item => (
          <div className="alert-entry alert-entry-warning" key={item.id}>
            <div className="alert-entry-icon">PR</div>
            <div className="alert-entry-body">
              <strong>{getProductDisplayName(safeProducts, item)}</strong>
              <span>{item.quantity} unidades - Fecha: {formatDate(item.date)}</span>
            </div>
            <button className="btn-sm" onClick={() => onNavigate('production')}>Ir a Produccion</button>
          </div>
        )),
      })}

      {renderSection({
        id: 'planned',
        tone: 'info',
        title: 'Produccion planificada',
        detail: 'Ordenes programadas para sostener el flujo de stock.',
        count: plannedProd.length,
        children: plannedProd.map(item => (
          <div className="alert-entry alert-entry-info" key={item.id}>
            <div className="alert-entry-icon">PR</div>
            <div className="alert-entry-body">
              <strong>{getProductDisplayName(safeProducts, item)}</strong>
              <span>{item.quantity} unidades - Programado: {formatDate(item.date)}</span>
            </div>
            <button className="btn-sm" onClick={() => onNavigate('production')}>Ir a Produccion</button>
          </div>
        )),
      })}
    </div>
  )
}
