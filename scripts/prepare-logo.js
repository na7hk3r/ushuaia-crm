import { createCanvas, loadImage } from 'canvas'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const inputPath = join(root, 'public', 'ushuaia-logo.png')
const outputPath = join(root, 'public', 'ushuaia-logo-transparent.png')

const WHITE_THRESHOLD = 238
const PADDING = 12

function isBackground(data, index) {
  return (
    data[index] >= WHITE_THRESHOLD &&
    data[index + 1] >= WHITE_THRESHOLD &&
    data[index + 2] >= WHITE_THRESHOLD
  )
}

function markConnectedBackground(data, width, height) {
  const seen = new Uint8Array(width * height)
  const queue = []

  function push(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const pixel = y * width + x
    if (seen[pixel]) return
    if (!isBackground(data, pixel * 4)) return
    seen[pixel] = 1
    queue.push(pixel)
  }

  for (let x = 0; x < width; x += 1) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y)
    push(width - 1, y)
  }

  for (let i = 0; i < queue.length; i += 1) {
    const pixel = queue[i]
    const x = pixel % width
    const y = Math.floor(pixel / width)
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }

  return seen
}

function softenWhiteEdge(data, backgroundMask, width, height) {
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const pixel = y * width + x
      if (backgroundMask[pixel]) continue

      const touchesBackground =
        backgroundMask[pixel - 1] ||
        backgroundMask[pixel + 1] ||
        backgroundMask[pixel - width] ||
        backgroundMask[pixel + width]

      if (!touchesBackground) continue

      const index = pixel * 4
      if (!isBackground(data, index)) continue

      const average = (data[index] + data[index + 1] + data[index + 2]) / 3
      data[index + 3] = Math.max(0, Math.min(255, 255 - (average - WHITE_THRESHOLD) * 10))
    }
  }
}

function findContentBounds(data, width, height) {
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha === 0) continue
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }

  return {
    x: Math.max(0, minX - PADDING),
    y: Math.max(0, minY - PADDING),
    width: Math.min(width - Math.max(0, minX - PADDING), maxX - minX + 1 + PADDING * 2),
    height: Math.min(height - Math.max(0, minY - PADDING), maxY - minY + 1 + PADDING * 2),
  }
}

const image = await loadImage(inputPath)
const canvas = createCanvas(image.width, image.height)
const context = canvas.getContext('2d')
context.drawImage(image, 0, 0)

const source = context.getImageData(0, 0, canvas.width, canvas.height)
const backgroundMask = markConnectedBackground(source.data, canvas.width, canvas.height)

for (let pixel = 0; pixel < backgroundMask.length; pixel += 1) {
  if (backgroundMask[pixel]) source.data[pixel * 4 + 3] = 0
}
softenWhiteEdge(source.data, backgroundMask, canvas.width, canvas.height)

context.putImageData(source, 0, 0)

const bounds = findContentBounds(source.data, canvas.width, canvas.height)
const output = createCanvas(bounds.width, bounds.height)
const outputContext = output.getContext('2d')
outputContext.drawImage(
  canvas,
  bounds.x,
  bounds.y,
  bounds.width,
  bounds.height,
  0,
  0,
  bounds.width,
  bounds.height
)

writeFileSync(outputPath, output.toBuffer('image/png'))
console.log(`Generated ${outputPath}`)
console.log(`Size: ${bounds.width}x${bounds.height}`)
