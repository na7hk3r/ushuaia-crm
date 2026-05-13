export function normalizeProductName(name) {
  return String(name ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

export function getProductId(productOrId) {
  if (typeof productOrId === 'number' && Number.isFinite(productOrId)) return productOrId
  if (typeof productOrId === 'string' && productOrId.trim() !== '') {
    const parsed = Number(productOrId)
    return Number.isFinite(parsed) ? parsed : null
  }
  if (productOrId && Number.isFinite(Number(productOrId.id))) return Number(productOrId.id)
  return null
}

export function findProductByRef(products = [], ref = {}) {
  const productId = getProductId(ref.productId ?? ref.id)
  if (productId !== null) {
    const byId = products.find(p => Number(p.id) === productId)
    if (byId) return byId
  }

  const normalizedName = normalizeProductName(ref.product ?? ref.name)
  if (!normalizedName) return null
  return products.find(p => normalizeProductName(p.name) === normalizedName) || null
}

export function getProductSnapshot(products = [], ref = {}) {
  const product = findProductByRef(products, ref)
  return {
    productId: product ? product.id : getProductId(ref.productId),
    product: ref.product || product?.name || '',
  }
}

export function getProductDisplayName(products = [], ref = {}) {
  return ref.product || findProductByRef(products, ref)?.name || '-'
}

export function getActiveProducts(products = []) {
  return products.filter(p => !p.archived)
}

export function getProductPrice(product, priceType = 'retail') {
  if (!product) return 0
  if (priceType === 'wholesale') {
    return Number(product.wholesalePrice || product.retailPrice || product.price || 0)
  }
  return Number(product.retailPrice || product.price || 0)
}

export function calculateProductMargin(product, priceType = 'retail') {
  const price = getProductPrice(product, priceType)
  const cost = Number(product?.productionCost || 0)
  if (price <= 0 || cost <= 0) return null
  return Math.round(((price - cost) / price) * 100)
}

export function calculateOrderProfit(product, quantity = 0, priceType = 'retail') {
  const price = getProductPrice(product, priceType)
  const cost = Number(product?.productionCost || 0)
  const qty = Number(quantity) || 0
  if (price <= 0 || cost <= 0 || qty <= 0) return null
  return (price - cost) * qty
}

export function isDuplicateProductName(products = [], name, currentId = null) {
  const normalized = normalizeProductName(name)
  if (!normalized) return false
  const current = getProductId(currentId)
  return products.some(p => {
    if (current !== null && Number(p.id) === current) return false
    return normalizeProductName(p.name) === normalized
  })
}

export function isProductReferenced(product, clients = [], production = []) {
  const productId = getProductId(product)
  const productName = normalizeProductName(product?.name)

  const orderUsesProduct = clients.some(client =>
    (client.orders || []).some(order => {
      const orderId = getProductId(order.productId)
      if (productId !== null && orderId === productId) return true
      return productName && normalizeProductName(order.product) === productName
    })
  )

  if (orderUsesProduct) return true

  return production.some(item => {
    const itemId = getProductId(item.productId)
    if (productId !== null && itemId === productId) return true
    return productName && normalizeProductName(item.product) === productName
  })
}
