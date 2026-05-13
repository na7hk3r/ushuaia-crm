import { defaultSettings, initialClients, initialProducts, initialProduction, initialRawMaterials } from '../data/initialData.js'
import { findProductByRef, getProductId, getProductSnapshot } from './products.js'

export const DATA_SCHEMA_VERSION = 2

function asArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback
}

function asString(value, fallback = '') {
  return value == null ? fallback : String(value)
}

function asBoolean(value, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function asNonNegativeNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

function asPositiveNumber(value, fallback = 1) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function asUniqueList(value, fallback = []) {
  const source = asArray(value, fallback)
  const seen = new Set()
  const result = []

  source.forEach(item => {
    const normalized = asString(item).trim().toLowerCase()
    if (!normalized || seen.has(normalized)) return
    seen.add(normalized)
    result.push(normalized)
  })

  return result.length ? result : fallback
}

function nextAvailableId(usedIds) {
  let next = usedIds.size ? Math.max(...usedIds) + 1 : 1
  while (usedIds.has(next)) next += 1
  return next
}

function normalizeId(value, usedIds) {
  const parsed = Number(value)
  if (Number.isInteger(parsed) && parsed > 0 && !usedIds.has(parsed)) {
    usedIds.add(parsed)
    return parsed
  }

  const next = nextAvailableId(usedIds)
  usedIds.add(next)
  return next
}

export function normalizeSettings(settings = {}) {
  const source = settings && typeof settings === 'object' ? settings : {}

  return {
    ...defaultSettings,
    ...source,
    companyName: asString(source.companyName, defaultSettings.companyName),
    companyPhone: asString(source.companyPhone, defaultSettings.companyPhone),
    companyEmail: asString(source.companyEmail, defaultSettings.companyEmail),
    companyAddress: asString(source.companyAddress, defaultSettings.companyAddress),
    companyLogo: asString(source.companyLogo, defaultSettings.companyLogo),
    clientCategories: asUniqueList(source.clientCategories, defaultSettings.clientCategories),
    productCategories: asUniqueList(source.productCategories, defaultSettings.productCategories),
    productionStatuses: asUniqueList(source.productionStatuses, defaultSettings.productionStatuses),
    materialUnits: asUniqueList(source.materialUnits, defaultSettings.materialUnits),
    currency: asString(source.currency, defaultSettings.currency).slice(0, 5) || defaultSettings.currency,
    defaultPriceType: source.defaultPriceType === 'wholesale' ? 'wholesale' : 'retail',
    taxRate: asNonNegativeNumber(source.taxRate, defaultSettings.taxRate),
    defaultDeliveryDays: asNonNegativeNumber(source.defaultDeliveryDays, defaultSettings.defaultDeliveryDays),
    stockAlertEnabled: source.stockAlertEnabled === false ? false : true,
  }
}

export function normalizeProducts(products = initialProducts) {
  const usedIds = new Set()

  return asArray(products, initialProducts).map(product => {
    const source = product && typeof product === 'object' ? product : {}
    const retailPrice = asNonNegativeNumber(source.retailPrice ?? source.price, 0)

    return {
      ...source,
      id: normalizeId(source.id, usedIds),
      name: asString(source.name, 'Producto sin nombre').trim() || 'Producto sin nombre',
      description: asString(source.description),
      unitsPerBox: asPositiveNumber(source.unitsPerBox, 1),
      retailPrice,
      wholesalePrice: asNonNegativeNumber(source.wholesalePrice, 0),
      productionCost: asNonNegativeNumber(source.productionCost, 0),
      price: retailPrice,
      category: asString(source.category, defaultSettings.productCategories[0]).trim() || defaultSettings.productCategories[0],
      stock: asNonNegativeNumber(source.stock, 0),
      minStock: asNonNegativeNumber(source.minStock, 0),
      archived: source.archived === true,
    }
  })
}

export function normalizeMaterials(materials = initialRawMaterials) {
  const usedIds = new Set()

  return asArray(materials, initialRawMaterials).map(material => {
    const source = material && typeof material === 'object' ? material : {}
    return {
      ...source,
      id: normalizeId(source.id, usedIds),
      name: asString(source.name, 'Insumo sin nombre').trim() || 'Insumo sin nombre',
      unit: asString(source.unit, defaultSettings.materialUnits[0]).trim() || defaultSettings.materialUnits[0],
      stock: asNonNegativeNumber(source.stock, 0),
      minStock: asNonNegativeNumber(source.minStock, 0),
      supplier: asString(source.supplier),
    }
  })
}

export function normalizeOrder(order = {}, products = []) {
  const source = order && typeof order === 'object' ? order : {}
  const snapshot = getProductSnapshot(products, source)

  return {
    ...source,
    date: asString(source.date),
    productId: snapshot.productId,
    product: snapshot.product,
    quantity: asPositiveNumber(source.quantity, 1),
    total: asNonNegativeNumber(source.total, 0),
    deliveryDate: asString(source.deliveryDate),
    delivered: asBoolean(source.delivered, false),
    priceType: source.priceType === 'wholesale' ? 'wholesale' : source.priceType === 'retail' ? 'retail' : undefined,
  }
}

export function normalizeClients(clients = initialClients, products = []) {
  const usedIds = new Set()

  return asArray(clients, initialClients).map(client => {
    const source = client && typeof client === 'object' ? client : {}
    return {
      ...source,
      id: normalizeId(source.id, usedIds),
      name: asString(source.name, 'Cliente sin nombre').trim() || 'Cliente sin nombre',
      contact: asString(source.contact),
      email: asString(source.email),
      phone: asString(source.phone),
      address: asString(source.address),
      category: asString(source.category, defaultSettings.clientCategories[0]).trim() || defaultSettings.clientCategories[0],
      notes: asString(source.notes),
      createdAt: asString(source.createdAt),
      orders: asArray(source.orders).map(order => normalizeOrder(order, products)),
    }
  })
}

export function normalizeProduction(production = initialProduction, products = [], settings = defaultSettings) {
  const usedIds = new Set()
  const statuses = asArray(settings.productionStatuses, defaultSettings.productionStatuses)
  const fallbackStatus = statuses[0] || defaultSettings.productionStatuses[0]

  return asArray(production, initialProduction).map(item => {
    const source = item && typeof item === 'object' ? item : {}
    const product = findProductByRef(products, source)
    const productId = product ? product.id : getProductId(source.productId)

    return {
      ...source,
      id: normalizeId(source.id, usedIds),
      productId,
      product: asString(source.product || product?.name),
      quantity: asPositiveNumber(source.quantity, 1),
      date: asString(source.date),
      status: asString(source.status, fallbackStatus) || fallbackStatus,
    }
  })
}

export function unwrapBackupPayload(payload = {}) {
  if (payload && typeof payload === 'object' && payload.data && typeof payload.data === 'object') {
    return payload.data
  }
  return payload
}

export function normalizeAppData(payload = {}) {
  const source = unwrapBackupPayload(payload)
  const settings = normalizeSettings(source.settings)
  const products = normalizeProducts(source.products)
  const materials = normalizeMaterials(source.materials ?? source.rawMaterials)
  const clients = normalizeClients(source.clients, products)
  const production = normalizeProduction(source.production, products, settings)

  return {
    schemaVersion: DATA_SCHEMA_VERSION,
    clients,
    products,
    materials,
    production,
    settings,
  }
}

export function makeBackupEnvelope(allData, appVersion = '') {
  const normalized = normalizeAppData(allData)
  return {
    schemaVersion: DATA_SCHEMA_VERSION,
    appVersion,
    exportedAt: new Date().toISOString(),
    data: {
      clients: normalized.clients,
      products: normalized.products,
      materials: normalized.materials,
      production: normalized.production,
      settings: normalized.settings,
    },
  }
}

export function hasDataChanged(current, next) {
  return JSON.stringify(current) !== JSON.stringify(next)
}
