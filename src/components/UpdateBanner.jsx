import { useState, useEffect } from 'react'
import { version as pkgVersion } from '../../package.json'

function parseSemver(v) {
  const m = String(v).replace(/^v/, '').match(/^(\d+)\.(\d+)\.(\d+)/)
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [0, 0, 0]
}

function getSemverChange(currentVer, newVer) {
  const [cMaj, cMin] = parseSemver(currentVer)
  const [nMaj, nMin] = parseSemver(newVer)
  if (nMaj !== cMaj) return 'major'
  if (nMin !== cMin) return 'minor'
  return 'patch'
}

const CHANGE_LABELS = {
  major: { text: 'Major', color: '#DC2626' },
  minor: { text: 'Minor', color: '#0EA5E9' },
  patch: { text: 'Patch', color: '#16A34A' },
}

export default function UpdateBanner() {
  const [status, setStatus] = useState(null)
  const [version, setVersion] = useState('')
  const [currentVersion, setCurrentVersion] = useState(pkgVersion)
  const [percent, setPercent] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (window.electronAPI?.getAppVersion) {
      window.electronAPI.getAppVersion().then(v => setCurrentVersion(v)).catch(() => {})
    }
  }, [])

  useEffect(() => {
    const api = window.electronAPI
    if (!api) return

    api.onUpdateAvailable((info) => {
      setVersion(info.version)
      setStatus('available')
    })

    api.onUpdateNotAvailable?.(() => {
      setStatus('up-to-date')
      setTimeout(() => setStatus(null), 4000)
    })

    api.onUpdateChecking?.(() => {
      setStatus('checking')
    })

    api.onUpdateProgress((progress) => {
      setPercent(progress.percent)
      setStatus('downloading')
    })

    api.onUpdateDownloaded(() => {
      setStatus('ready')
    })

    api.onUpdateError?.((err) => {
      setErrorMsg(err.message || 'Error al buscar actualizaciones')
      setStatus('error')
      setTimeout(() => setStatus(null), 6000)
    })

    return () => api.removeUpdateListeners()
  }, [])

  if (!status) return null

  const changeType = version ? getSemverChange(currentVersion, version) : null
  const badge = changeType ? CHANGE_LABELS[changeType] : null

  return (
    <div style={styles.wrapper}>
      <div style={{
        ...styles.banner,
        ...(status === 'checking' ? { background: '#F8FAFC', border: '1px solid #E2E8F0', borderLeft: '4px solid #94A3B8' } : {}),
        ...(status === 'up-to-date' ? { background: '#F0FDF4', border: '1px solid #BBF7D0', borderLeft: '4px solid #16A34A' } : {}),
        ...(status === 'error' ? { background: '#FEF2F2', border: '1px solid #FECACA', borderLeft: '4px solid #DC2626' } : {}),
      }}>
        <div style={styles.content}>
          <span style={styles.icon}>
            {status === 'checking' && '🔍'}
            {status === 'available' && '✨'}
            {status === 'downloading' && '🔄'}
            {status === 'ready' && '✅'}
            {status === 'up-to-date' && '✅'}
            {status === 'error' && '⚠️'}
          </span>
          <div>
            <strong style={styles.title}>
              {status === 'checking' && 'Buscando actualizaciones…'}
              {status === 'available' && (
                <>
                  Nueva versión {version} disponible
                  {badge && (
                    <span style={{ ...styles.semverBadge, background: badge.color }}>{badge.text}</span>
                  )}
                </>
              )}
              {status === 'downloading' && `Descargando actualización... ${percent}%`}
              {status === 'ready' && 'Actualización lista para instalar'}
              {status === 'up-to-date' && `Estás al día — v${currentVersion}`}
              {status === 'error' && `Error: ${errorMsg}`}
            </strong>
            {status === 'downloading' && (
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressBar, width: `${percent}%` }} />
              </div>
            )}
          </div>
        </div>
        <div style={styles.actions}>
          {status === 'available' && (
            <>
              <button
                style={styles.btn}
                onClick={() => window.electronAPI.startUpdateDownload()}
              >
                Descargar
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => window.electronAPI.openExternal('https://na7hk3r.github.io/ushuaia-crm/#releases')}
              >
                Ver cambios
              </button>
            </>
          )}
          {status === 'ready' && (
            <>
              <button
                style={styles.btn}
                onClick={() => window.electronAPI.restartForUpdate()}
              >
                Reiniciar ahora
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => setStatus(null)}
              >
                Después
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 260,
    right: 0,
    zIndex: 100,
    padding: '12px 24px',
    animation: 'slideDown 0.3s ease-out',
  },
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    background: '#E0F2FE',
    border: '1px solid #BAE6FD',
    borderLeft: '4px solid #0EA5E9',
    borderRadius: 12,
    padding: '10px 18px',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  icon: {
    fontSize: 24,
    flexShrink: 0,
  },
  title: {
    display: 'block',
    fontSize: 14,
    color: '#0F172A',
    fontWeight: 600,
  },
  progressTrack: {
    marginTop: 6,
    height: 6,
    borderRadius: 3,
    background: '#BAE6FD',
    overflow: 'hidden',
    width: 220,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    background: 'linear-gradient(90deg, #0EA5E9, #38BDF8)',
    transition: 'width 0.3s ease',
  },
  actions: {
    display: 'flex',
    gap: 8,
    flexShrink: 0,
  },
  btn: {
    padding: '6px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '6px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: '#475569',
    background: 'transparent',
    border: '1px solid #CBD5E1',
    borderRadius: 8,
    cursor: 'pointer',
  },
  semverBadge: {
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: 99,
    marginLeft: 8,
    verticalAlign: 'middle',
  },
}
