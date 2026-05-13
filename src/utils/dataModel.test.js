import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DATA_SCHEMA_VERSION,
  makeBackupEnvelope,
  normalizeAppData,
  normalizeSettings,
} from './dataModel.js'

test('normalizeSettings adds defaults for older saved settings', () => {
  const settings = normalizeSettings({ companyName: 'Mi Empresa' })

  assert.equal(settings.companyName, 'Mi Empresa')
  assert.equal(settings.defaultPriceType, 'retail')
  assert.equal(settings.stockAlertEnabled, true)
  assert.deepEqual(settings.productCategories, ['chocolate', 'maicena', 'premium', 'caja'])
})

test('normalizeAppData accepts legacy backup shape and adds productId links', () => {
  const normalized = normalizeAppData({
    products: [{ id: 10, name: 'Alfajor Negro', retailPrice: 100, stock: 5, minStock: 2 }],
    clients: [{
      id: 1,
      name: 'Cliente',
      orders: [{ product: 'Alfajor Negro', quantity: 3, total: 300 }],
    }],
    materials: [],
    production: [{ id: 1, product: 'Alfajor Negro', quantity: 20 }],
    settings: {},
  })

  assert.equal(normalized.schemaVersion, DATA_SCHEMA_VERSION)
  assert.equal(normalized.clients[0].orders[0].productId, 10)
  assert.equal(normalized.clients[0].orders[0].product, 'Alfajor Negro')
  assert.equal(normalized.production[0].productId, 10)
})

test('normalizeAppData keeps unknown historical product names', () => {
  const normalized = normalizeAppData({
    products: [{ id: 1, name: 'Actual', retailPrice: 100, stock: 1, minStock: 1 }],
    clients: [{ id: 1, name: 'Cliente', orders: [{ product: 'Historico', quantity: 1, total: 10 }] }],
    materials: [],
    production: [],
    settings: {},
  })

  assert.equal(normalized.clients[0].orders[0].productId, null)
  assert.equal(normalized.clients[0].orders[0].product, 'Historico')
})

test('makeBackupEnvelope writes the versioned backup contract', () => {
  const envelope = makeBackupEnvelope({
    clients: [],
    products: [],
    materials: [],
    production: [],
    settings: {},
  }, '1.2.3')

  assert.equal(envelope.schemaVersion, DATA_SCHEMA_VERSION)
  assert.equal(envelope.appVersion, '1.2.3')
  assert.ok(envelope.exportedAt)
  assert.ok(Array.isArray(envelope.data.products))
})
