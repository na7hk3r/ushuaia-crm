import { useState } from 'react'
import guideRaw from '../../GUIA-DE-USO.md?raw'

function parseMarkdown(md) {
  const lines = md.split('\n')
  const elements = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') { i++; continue }

    if (/^---+\s*$/.test(line)) {
      elements.push(<hr key={key++} style={s.hr} />)
      i++; continue
    }

    const hMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (hMatch) {
      const level = hMatch[1].length
      const Tag = `h${level}`
      elements.push(<Tag key={key++} style={s[`h${level}`]}>{inline(hMatch[2])}</Tag>)
      i++; continue
    }

    if (line.includes('|') && i + 1 < lines.length && /^\|?\s*[-:]+/.test(lines[i + 1])) {
      const parseRow = r => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim())
      const headers = parseRow(line)
      i += 2
      const rows = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        rows.push(parseRow(lines[i]))
        i++
      }
      elements.push(
        <div key={key++} style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{headers.map((h, j) => <th key={j} style={s.th}>{inline(h)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={s.td}>{inline(cell)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    if (line.startsWith('>')) {
      const bqLines = []
      while (i < lines.length && lines[i].startsWith('>')) {
        bqLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      elements.push(
        <blockquote key={key++} style={s.blockquote}>
          {bqLines.map((bl, j) => <p key={j} style={s.p}>{inline(bl)}</p>)}
        </blockquote>
      )
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={key++} style={s.ol}>
          {items.map((item, j) => <li key={j} style={s.li}>{inline(item)}</li>)}
        </ol>
      )
      continue
    }

    if (/^[-*]\s/.test(line)) {
      const items = []
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s/, ''))
        i++
      }
      elements.push(
        <ul key={key++} style={s.ul}>
          {items.map((item, j) => <li key={j} style={s.li}>{inline(item)}</li>)}
        </ul>
      )
      continue
    }

    const pLines = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('>') &&
      !lines[i].startsWith('---') &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^[-*]\s/.test(lines[i]) &&
      !(lines[i].includes('|') && i + 1 < lines.length && /^\|?\s*[-:]+/.test(lines[i + 1]))
    ) {
      pLines.push(lines[i])
      i++
    }
    if (pLines.length) {
      elements.push(<p key={key++} style={s.p}>{inline(pLines.join(' '))}</p>)
    }
  }

  return elements
}

function inline(text) {
  const parts = []
  let remaining = text
  let k = 0

  while (remaining.length > 0) {
    const biMatch = remaining.match(/\*\*\*(.+?)\*\*\*/)
    const bMatch = remaining.match(/\*\*(.+?)\*\*/)
    const iMatch = remaining.match(/\*(.+?)\*/)
    const cMatch = remaining.match(/`(.+?)`/)
    const lMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)

    const matches = [
      biMatch && { idx: remaining.indexOf(biMatch[0]), len: biMatch[0].length, el: <strong key={k++}><em>{biMatch[1]}</em></strong> },
      bMatch && { idx: remaining.indexOf(bMatch[0]), len: bMatch[0].length, el: <strong key={k++}>{bMatch[1]}</strong> },
      iMatch && { idx: remaining.indexOf(iMatch[0]), len: iMatch[0].length, el: <em key={k++}>{iMatch[1]}</em> },
      cMatch && { idx: remaining.indexOf(cMatch[0]), len: cMatch[0].length, el: <code key={k++} style={s.code}>{cMatch[1]}</code> },
      lMatch && { idx: remaining.indexOf(lMatch[0]), len: lMatch[0].length, el: <span key={k++} style={s.link}>{lMatch[1]}</span> },
    ].filter(Boolean)

    if (matches.length === 0) {
      parts.push(remaining)
      break
    }

    matches.sort((a, b) => a.idx - b.idx)
    const first = matches[0]

    if (first.idx > 0) {
      parts.push(remaining.slice(0, first.idx))
    }
    parts.push(first.el)
    remaining = remaining.slice(first.idx + first.len)
  }

  return parts
}

export default function UsageGuide({ onClose }) {
  const [search, setSearch] = useState('')

  const filteredMd = search.trim()
    ? guideRaw.split('\n').reduce((acc, line, i, arr) => {
        if (line.toLowerCase().includes(search.toLowerCase())) {
          const start = Math.max(0, i - 2)
          const end = Math.min(arr.length, i + 3)
          for (let j = start; j < end; j++) {
            if (!acc.includes(arr[j])) acc.push(arr[j])
          }
          acc.push('---')
        }
        return acc
      }, []).join('\n')
    : guideRaw

  return (
    <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={s.modal}>
        <div style={s.header}>
          <h2 style={s.headerTitle}>📖 Guía de Uso</h2>
          <div style={s.headerActions}>
            <input
              style={s.searchInput}
              placeholder="Buscar en la guía..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button style={s.closeBtn} onClick={onClose} title="Cerrar">✕</button>
          </div>
        </div>
        <div style={s.body}>
          {parseMarkdown(filteredMd)}
        </div>
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },
  modal: {
    background: '#F8FAFC', borderRadius: 16,
    width: '100%', maxWidth: 800, maxHeight: '90vh',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
    border: '1px solid #E2E8F0',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 24px', borderBottom: '1px solid #E2E8F0',
    background: '#FFFFFF', borderRadius: '16px 16px 0 0',
    flexWrap: 'wrap', gap: 12,
  },
  headerTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: '#0F172A' },
  headerActions: { display: 'flex', alignItems: 'center', gap: 10 },
  searchInput: {
    padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1',
    fontSize: 14, width: 200, outline: 'none', background: '#F8FAFC',
  },
  closeBtn: {
    background: 'none', border: 'none', fontSize: 20, cursor: 'pointer',
    color: '#64748B', padding: '4px 8px', borderRadius: 6,
  },
  body: {
    padding: '24px 32px', overflowY: 'auto', flex: 1,
    lineHeight: 1.7, color: '#1E293B',
  },
  h1: { fontSize: 26, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', borderBottom: '2px solid #E2E8F0', paddingBottom: 12 },
  h2: { fontSize: 21, fontWeight: 700, color: '#0F172A', margin: '32px 0 12px', borderBottom: '1px solid #E2E8F0', paddingBottom: 8 },
  h3: { fontSize: 17, fontWeight: 700, color: '#334155', margin: '24px 0 8px' },
  h4: { fontSize: 15, fontWeight: 600, color: '#475569', margin: '16px 0 6px' },
  h5: { fontSize: 14, fontWeight: 600, color: '#475569', margin: '12px 0 4px' },
  h6: { fontSize: 13, fontWeight: 600, color: '#64748B', margin: '12px 0 4px' },
  p: { margin: '8px 0', fontSize: 14, color: '#334155' },
  hr: { border: 'none', borderTop: '1px solid #E2E8F0', margin: '20px 0' },
  ol: { margin: '8px 0', paddingLeft: 24 },
  ul: { margin: '8px 0', paddingLeft: 24 },
  li: { marginBottom: 4, fontSize: 14, color: '#334155' },
  blockquote: {
    margin: '12px 0', padding: '10px 16px',
    borderLeft: '3px solid #0EA5E9', background: '#F0F9FF',
    borderRadius: '0 8px 8px 0',
  },
  code: {
    background: '#E2E8F0', padding: '2px 6px', borderRadius: 4,
    fontFamily: 'monospace', fontSize: 13, color: '#0F172A',
  },
  link: { color: '#0EA5E9', fontWeight: 500 },
  tableWrap: { overflowX: 'auto', margin: '12px 0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: { textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #CBD5E1', fontWeight: 600, color: '#0F172A', background: '#F1F5F9' },
  td: { padding: '8px 12px', borderBottom: '1px solid #E2E8F0', color: '#334155' },
}