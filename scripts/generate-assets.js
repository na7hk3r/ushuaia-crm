// Script para generar los assets gráficos del instalador NSIS y el ícono de la app.
// Ejecutar con: node scripts/generate-assets.js
// Requiere: npm install canvas --save-dev

import { createCanvas } from 'canvas'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// ─── Colores de la Paleta Patagónica ──────────────────────────
const COLORS = {
  sidebarBg: '#0F172A',
  sidebarBgEnd: '#1E293B',
  primary: '#0EA5E9',
  accent: '#38BDF8',
  white: '#FFFFFF',
  textMuted: '#94A3B8',
}

// ─── Utilidades ───────────────────────────────────────────────
function drawMountain(ctx, cx, cy, size, color1, color2) {
  // Montaña principal
  const grad = ctx.createLinearGradient(cx - size, cy, cx + size, cy - size)
  grad.addColorStop(0, color1)
  grad.addColorStop(1, color2)
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(cx - size, cy)
  ctx.lineTo(cx - size * 0.1, cy - size * 0.85)
  ctx.lineTo(cx + size * 0.15, cy - size * 0.6)
  ctx.lineTo(cx + size * 0.4, cy - size * 0.95)
  ctx.lineTo(cx + size, cy)
  ctx.closePath()
  ctx.fill()

  // Nieve en la cima
  ctx.fillStyle = COLORS.white
  ctx.globalAlpha = 0.9
  ctx.beginPath()
  ctx.moveTo(cx - size * 0.1, cy - size * 0.85)
  ctx.lineTo(cx - size * 0.25, cy - size * 0.65)
  ctx.lineTo(cx + size * 0.05, cy - size * 0.7)
  ctx.lineTo(cx + size * 0.15, cy - size * 0.6)
  ctx.lineTo(cx + size * 0.25, cy - size * 0.72)
  ctx.lineTo(cx + size * 0.4, cy - size * 0.95)
  ctx.lineTo(cx + size * 0.32, cy - size * 0.78)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
}

// ─── 1. Ícono de la app (512×512 PNG) ──────────────────────────
function generateIcon() {
  const size = 512
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Fondo redondeado con gradiente
  const bgGrad = ctx.createLinearGradient(0, 0, 0, size)
  bgGrad.addColorStop(0, COLORS.sidebarBg)
  bgGrad.addColorStop(1, COLORS.sidebarBgEnd)

  const r = 80
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, r)
  ctx.fillStyle = bgGrad
  ctx.fill()

  // Resplandor circular sutil detrás de la montaña
  const glow = ctx.createRadialGradient(size / 2, size * 0.55, 0, size / 2, size * 0.55, size * 0.4)
  glow.addColorStop(0, 'rgba(14, 165, 233, 0.15)')
  glow.addColorStop(1, 'rgba(14, 165, 233, 0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, r)
  ctx.fill()

  // Montaña
  drawMountain(ctx, size / 2, size * 0.72, size * 0.35, COLORS.primary, COLORS.accent)

  // Línea de acento inferior
  const lineGrad = ctx.createLinearGradient(size * 0.2, 0, size * 0.8, 0)
  lineGrad.addColorStop(0, 'rgba(14, 165, 233, 0)')
  lineGrad.addColorStop(0.5, COLORS.primary)
  lineGrad.addColorStop(1, 'rgba(14, 165, 233, 0)')
  ctx.fillStyle = lineGrad
  ctx.fillRect(size * 0.15, size * 0.78, size * 0.7, 3)

  // Texto "U" estilizado debajo
  ctx.fillStyle = COLORS.white
  ctx.font = 'bold 72px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('U', size / 2, size * 0.9)

  const buf = canvas.toBuffer('image/png')
  writeFileSync(join(root, 'public', 'icon.png'), buf)
  console.log('✅ public/icon.png (512×512)')
}

// ─── 2. Installer Header (150×57 BMP) ──────────────────────────
function generateHeader() {
  const w = 150, h = 57
  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')

  // Fondo oscuro
  ctx.fillStyle = COLORS.sidebarBg
  ctx.fillRect(0, 0, w, h)

  // Mini montaña
  drawMountain(ctx, 24, 40, 16, COLORS.primary, COLORS.accent)

  // Texto
  ctx.fillStyle = COLORS.white
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('Ushuaia CRM', 48, 24)

  // Subtítulo
  ctx.fillStyle = COLORS.textMuted
  ctx.font = '10px sans-serif'
  ctx.fillText('Alfajores', 48, 40)

  // Línea de acento inferior
  const lineGrad = ctx.createLinearGradient(0, 0, w, 0)
  lineGrad.addColorStop(0, COLORS.primary)
  lineGrad.addColorStop(1, COLORS.accent)
  ctx.fillStyle = lineGrad
  ctx.fillRect(0, h - 2, w, 2)

  writeBMP(canvas, join(root, 'build', 'installerHeader.bmp'))
  console.log('✅ build/installerHeader.bmp (150×57)')
}

// ─── 3. Installer Sidebar (164×314 BMP) ────────────────────────
function generateSidebar() {
  const w = 164, h = 314
  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')

  // Fondo gradiente vertical
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
  bgGrad.addColorStop(0, COLORS.sidebarBg)
  bgGrad.addColorStop(1, COLORS.sidebarBgEnd)
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, w, h)

  // Resplandor sutil inferior
  const glow = ctx.createRadialGradient(w / 2, h * 0.85, 0, w / 2, h * 0.85, w * 0.8)
  glow.addColorStop(0, 'rgba(14, 165, 233, 0.12)')
  glow.addColorStop(1, 'rgba(14, 165, 233, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  // Montaña centrada en el tercio superior
  drawMountain(ctx, w / 2, h * 0.35, 50, COLORS.primary, COLORS.accent)

  // Texto "Ushuaia"
  ctx.fillStyle = COLORS.white
  ctx.font = 'bold 22px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Ushuaia', w / 2, h * 0.48)

  // Subtítulo
  ctx.fillStyle = COLORS.textMuted
  ctx.font = '12px sans-serif'
  ctx.fillText('Alfajores · CRM', w / 2, h * 0.55)

  // Línea separadora
  const lineGrad = ctx.createLinearGradient(w * 0.15, 0, w * 0.85, 0)
  lineGrad.addColorStop(0, 'rgba(14, 165, 233, 0)')
  lineGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.4)')
  lineGrad.addColorStop(1, 'rgba(14, 165, 233, 0)')
  ctx.fillStyle = lineGrad
  ctx.fillRect(w * 0.15, h * 0.6, w * 0.7, 1)

  // Versión en la parte inferior
  ctx.fillStyle = COLORS.textMuted
  ctx.font = '10px sans-serif'
  ctx.fillText('Gestión integral', w / 2, h * 0.9)

  writeBMP(canvas, join(root, 'build', 'installerSidebar.bmp'))
  console.log('✅ build/installerSidebar.bmp (164×314)')
}

// ─── BMP Writer (24-bit sin compresión) ─────────────────────────
function writeBMP(canvas, filepath) {
  const w = canvas.width
  const h = canvas.height
  const ctx = canvas.getContext('2d')
  const imgData = ctx.getImageData(0, 0, w, h)
  const pixels = imgData.data

  const rowSize = Math.ceil((w * 3) / 4) * 4
  const pixelDataSize = rowSize * h
  const fileSize = 54 + pixelDataSize

  const buf = Buffer.alloc(fileSize)

  // BMP Header
  buf.write('BM', 0)
  buf.writeUInt32LE(fileSize, 2)
  buf.writeUInt32LE(54, 10) // pixel data offset

  // DIB Header (BITMAPINFOHEADER)
  buf.writeUInt32LE(40, 14) // header size
  buf.writeInt32LE(w, 18)
  buf.writeInt32LE(h, 22) // positive = bottom-up
  buf.writeUInt16LE(1, 26) // color planes
  buf.writeUInt16LE(24, 28) // bits per pixel
  buf.writeUInt32LE(0, 30) // no compression
  buf.writeUInt32LE(pixelDataSize, 34)
  buf.writeInt32LE(2835, 38) // horizontal resolution
  buf.writeInt32LE(2835, 42) // vertical resolution

  // Pixel data (bottom-up, BGR)
  for (let y = 0; y < h; y++) {
    const srcRow = h - 1 - y // BMP is bottom-up
    for (let x = 0; x < w; x++) {
      const srcIdx = (srcRow * w + x) * 4
      const dstIdx = 54 + y * rowSize + x * 3
      buf[dstIdx] = pixels[srcIdx + 2]     // B
      buf[dstIdx + 1] = pixels[srcIdx + 1] // G
      buf[dstIdx + 2] = pixels[srcIdx]     // R
    }
  }

  writeFileSync(filepath, buf)
}

// ─── Ejecutar ────────────────────────────────────────────────────
console.log('Generando assets del instalador...\n')
generateIcon()
generateHeader()
generateSidebar()
console.log('\n🎉 Todos los assets generados correctamente!')
