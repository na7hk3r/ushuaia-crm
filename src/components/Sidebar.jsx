import { useState, useEffect } from 'react'
import { version as pkgVersion } from '../../package.json'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'alerts', label: 'Alertas', icon: '🔔' },
  { id: 'clients', label: 'Clientes', icon: '👥' },
  { id: 'production', label: 'Producción', icon: '🏭' },
  { id: 'stock', label: 'Stock', icon: '📦' },
  { id: 'materials', label: 'Materia Prima', icon: '🧈' },
  { id: 'settings', label: 'Configuración', icon: '⚙️' },
]

export default function Sidebar({ active, onNavigate, companyName, companyLogo }) {
  const [version, setVersion] = useState(pkgVersion)

  useEffect(() => {
    if (window.electronAPI?.getAppVersion) {
      window.electronAPI.getAppVersion().then(v => setVersion(v)).catch(() => {})
    }
  }, [])

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        {companyLogo ? (
          <img src={companyLogo} alt="Logo" className="brand-logo" />
        ) : (
          <span className="brand-icon">🏔️</span>
        )}
        <div>
          <h1 className="brand-name">{companyName || 'Ushuaia'}</h1>
          <span className="brand-sub">Alfajores · CRM</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item${active === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span>{companyName || 'Ushuaia Alfajores'} © {new Date().getFullYear()}</span>
        <span className="version" title="Semantic Versioning: MAJOR.MINOR.PATCH">{version ? `v${version}` : ''}</span>
      </div>
    </aside>
  )
}
