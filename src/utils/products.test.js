import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateProductMargin,
  findProductByRef,
  getProductPrice,
  isDuplicateProductName,
  normalizeProductName,
} from './products.js'

const products = [
  { id: 1, name: 'Alfajor de Chocolate', retailPrice: 130, wholesalePrice: 95, productionCost: 45 },
  { id: 2, name: 'Caja x6 Surtidos', retailPrice: 720, wholesalePrice: 530, productionCost: 250 },
]

test('normalizeProductName ignores casing, spaces and accents', () => {
  assert.equal(normalizeProductName('  Álfajor   DE chocolate '), 'alfajor de chocolate')
})

test('findProductByRef prefers productId and falls back to product name', () => {
  assert.equal(findProductByRef(products, { productId: 2, product: 'Otro' })?.name, 'Caja x6 Surtidos')
  assert.equal(findProductByRef(products, { product: 'alfajor de chocolate' })?.id, 1)
})

test('price and margin helpers stay consistent', () => {
  assert.equal(getProductPrice(products[0], 'retail'), 130)
  assert.equal(getProductPrice(products[0], 'wholesale'), 95)
  assert.equal(calculateProductMargin(products[0], 'retail'), 65)
})

test('duplicate product names are detected without blocking the current edit row', () => {
  assert.equal(isDuplicateProductName(products, ' ALFAJOR DE CHOCOLATE '), true)
  assert.equal(isDuplicateProductName(products, 'Alfajor de Chocolate', 1), false)
})
