import { useState, useEffect } from 'react'
import { version as pkgVersion } from '../../package.json'
import { OFFICIAL_LOGO_ALT, OFFICIAL_LOGO_URL } from '../constants/branding.js'

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
  const hasCustomLogo = Boolean(companyLogo)
  const logoSrc = hasCustomLogo ? companyLogo : OFFICIAL_LOGO_URL

  useEffect(() => {
    if (window.electronAPI?.getAppVersion) {
      window.electronAPI.getAppVersion().then(v => setVersion(v)).catch(() => {})
    }
  }, [])

  return (
    <aside className="sidebar">
      <div className={`sidebar-brand${hasCustomLogo ? '' : ' sidebar-brand-official'}`}>
        <div className="brand-logo-frame">
          <img
            src={logoSrc}
            alt={hasCustomLogo ? 'Logo de la empresa' : OFFICIAL_LOGO_ALT}
            className={`brand-logo${hasCustomLogo ? ' brand-logo-custom' : ' brand-logo-official'}`}
          />
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
        <span className="dev-credit">por <a href="https://smcurbelo.vercel.app" target="_blank" rel="noopener noreferrer">smcurbelo</a></span>
      </div>
    </aside>
  )
}
