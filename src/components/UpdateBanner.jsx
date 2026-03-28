import { useState, useEffect } from 'react'

export default function UpdateBanner() {
  const [status, setStatus] = useState(null)
  const [version, setVersion] = useState('')
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const api = window.electronAPI
    if (!api) return

    api.onUpdateAvailable((info) => {
      setVersion(info.version)
      setStatus('available')
    })

    api.onUpdateProgress((progress) => {
      setPercent(progress.percent)
      setStatus('downloading')
    })

    api.onUpdateDownloaded(() => {
      setStatus('ready')
    })

    return () => api.removeUpdateListeners()
  }, [])

  if (!status) return null

  return (
    <div style={styles.wrapper}>
      <div style={styles.banner}>
        <div style={styles.content}>
          <span style={styles.icon}>
            {status === 'available' && '✨'}
            {status === 'downloading' && '🔄'}
            {status === 'ready' && '✅'}
          </span>
          <div>
            <strong style={styles.title}>
              {status === 'available' && `Nueva versión ${version} disponible`}
              {status === 'downloading' && `Descargando actualización... ${percent}%`}
              {status === 'ready' && 'Actualización lista para instalar'}
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
}
