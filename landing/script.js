const REPO = 'na7hk3r/ushuaia-crm'
const API_URL = `https://api.github.com/repos/${REPO}/releases`
const RELEASES_PAGE = `https://github.com/${REPO}/releases`

document.addEventListener('DOMContentLoaded', init)

async function init() {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)
    const releases = await res.json()
    if (!releases.length) throw new Error('No releases found')

    setupDownloadButton(releases[0])
    renderReleases(releases)
  } catch (err) {
    console.error('Failed to load releases:', err)
    setupFallbackDownload()
    renderError()
  }
}

/* ── Download button ── */

function setupDownloadButton(latest) {
  const btn = document.getElementById('download-btn')
  const versionEl = document.getElementById('download-version')

  // Find the NSIS installer (.exe that starts with "UshuaiaCRM-Setup")
  const installer = latest.assets.find(a =>
    a.name.startsWith('UshuaiaCRM-Setup') && a.name.endsWith('.exe')
  )

  if (installer) {
    btn.href = installer.browser_download_url
  } else {
    // Fallback to the release page
    btn.href = latest.html_url
  }

  versionEl.textContent = `v${latest.tag_name.replace(/^v/, '')} · ${formatDate(latest.published_at)}`
}

function setupFallbackDownload() {
  const btn = document.getElementById('download-btn')
  const versionEl = document.getElementById('download-version')
  btn.href = RELEASES_PAGE
  versionEl.textContent = 'Ver todas las versiones'
}

/* ── Release notes rendering ── */

function renderReleases(releases) {
  const container = document.getElementById('releases-list')
  container.innerHTML = ''

  releases.forEach((release, i) => {
    const card = document.createElement('div')
    card.className = 'release-card'

    const tag = release.tag_name
    const date = formatDate(release.published_at)
    const body = parseMarkdown(release.body || 'Sin notas de versión.')
    const isLatest = i === 0

    card.innerHTML = `
      <div class="release-header">
        <span class="release-tag">
          ${tag}
          ${isLatest ? '<span class="release-badge">Última</span>' : ''}
        </span>
        <span class="release-date">${date}</span>
      </div>
      <div class="release-body">${body}</div>
    `

    container.appendChild(card)
  })
}

function renderError() {
  const container = document.getElementById('releases-list')
  container.innerHTML = `
    <div class="releases-error">
      <p>No se pudieron cargar las notas de versión.</p>
      <p><a href="${RELEASES_PAGE}" target="_blank" rel="noopener">Ver versiones en GitHub →</a></p>
    </div>
  `
}

/* ── Minimal Markdown → HTML parser ── */

function parseMarkdown(md) {
  let html = escapeHtml(md)

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Links: [text](url) — only allow http/https URLs
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  // Unordered lists
  html = html.replace(/^[*-] (.+)$/gm, '<li>$1</li>')
  html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>')

  // Line breaks → paragraphs
  html = html
    .split(/\n{2,}/)
    .map(block => {
      block = block.trim()
      if (!block) return ''
      if (/^<[hulo]/.test(block)) return block
      return `<p>${block}</p>`
    })
    .join('\n')

  // Single line breaks inside paragraphs
  html = html.replace(/([^>])\n([^<])/g, '$1<br>$2')

  return html
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

/* ── Utils ── */

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
