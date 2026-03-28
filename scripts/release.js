#!/usr/bin/env node
/* eslint-env node */

/**
 * Smart release script — analiza commits desde el último tag
 * y determina automáticamente si es patch, minor o major.
 *
 * Convención de commits:
 *   feat: ...     → minor  (feature nueva)
 *   fix: ...      → patch  (corrección)
 *   BREAKING: ... → major  (cambio incompatible)
 *   feat!: ...    → major  (breaking via !)
 *
 * Uso:
 *   npm run release          → auto-detecta tipo
 *   npm run release -- patch → fuerza patch
 *   npm run release -- minor → fuerza minor
 *   npm run release -- major → fuerza major
 */

import { execSync } from 'child_process'

const run = (cmd) => execSync(cmd, { encoding: 'utf-8' }).trim()

// Check for uncommitted changes
try {
  const status = run('git status --porcelain')
  if (status) {
    console.error('❌ Hay cambios sin commitear. Commiteá primero.')
    process.exit(1)
  }
} catch {
  console.error('❌ No se pudo verificar el estado de git.')
  process.exit(1)
}

// Get forced type from CLI arg
const forced = process.argv[2]
if (forced && !['patch', 'minor', 'major'].includes(forced)) {
  console.error(`❌ Tipo inválido: "${forced}". Usá: patch, minor o major.`)
  process.exit(1)
}

// Find last tag
let lastTag
try {
  lastTag = run('git describe --tags --abbrev=0')
} catch {
  lastTag = null
}

// Get commits since last tag
const range = lastTag ? `${lastTag}..HEAD` : 'HEAD'
let commits
try {
  commits = run(`git log ${range} --oneline`).split('\n').filter(Boolean)
} catch {
  commits = []
}

if (!commits.length && !forced) {
  console.error('❌ No hay commits nuevos desde el último tag. Nada que liberar.')
  process.exit(1)
}

// Analyze commit messages for SemVer type
let detectedType = 'patch' // default

for (const line of commits) {
  const msg = line.replace(/^[a-f0-9]+ /, '')

  if (/^BREAKING[\s:]|^[a-z]+!:/.test(msg)) {
    detectedType = 'major'
    break // major wins over everything
  }
  if (/^feat[\s(:]/.test(msg)) {
    detectedType = 'minor'
    // don't break — major could still appear
  }
}

const releaseType = forced || detectedType

// Show summary
console.log('')
console.log('📋 Commits desde el último release:')
for (const c of commits) {
  console.log(`   ${c}`)
}
console.log('')
console.log(`🏷️  Tipo detectado: ${detectedType}${forced ? ` (forzado a ${forced})` : ''}`)
console.log(`📦 Ejecutando: npm version ${releaseType}`)
console.log('')

// Bump version
try {
  const newVersion = run(`npm version ${releaseType} -m "release: %s"`)
  console.log(`✅ Nueva versión: ${newVersion}`)
  console.log('')
  console.log('🚀 Pusheando al remoto...')
  run('git push origin main --follow-tags')
  console.log('✅ Push completo. GitHub Actions se encargará del build, release y deploy.')
  console.log('')
} catch (err) {
  console.error('❌ Error al crear la versión:', err.message)
  process.exit(1)
}
