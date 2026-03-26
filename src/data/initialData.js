export const initialClients = [
  {
    id: 1, name: 'Distribuidora del Sur', contact: 'Martín López', email: 'martin@delsur.com',
    phone: '099-445566', address: 'Av. 18 de Julio 1234, Montevideo',
    category: 'distribuidor', notes: 'Pedidos regulares cada 2 semanas', createdAt: '2025-11-10',
    orders: [
      { date: '2026-01-15', product: 'Caja x6 Surtidos', quantity: 20, total: 14400, deliveryDate: '2026-01-17', delivered: true },
      { date: '2026-02-01', product: 'Caja x12 Premium', quantity: 10, total: 18000, deliveryDate: '2026-02-03', delivered: true },
      { date: '2026-02-15', product: 'Caja x6 Surtidos', quantity: 15, total: 10800, deliveryDate: '2026-02-17', delivered: true },
      { date: '2026-03-01', product: 'Caja x12 Premium', quantity: 12, total: 21600, deliveryDate: '2026-03-03', delivered: true },
      { date: '2026-03-20', product: 'Caja x6 Surtidos', quantity: 25, total: 18000, deliveryDate: '2026-03-28', delivered: false },
    ]
  },
  {
    id: 2, name: 'Kiosco El Faro', contact: 'Lucía Fernández', email: 'lucia@elfaro.com',
    phone: '098-223344', address: 'Rbla. 25 de Agosto 560, Montevideo',
    category: 'minorista', notes: 'Prefiere alfajores de chocolate', createdAt: '2025-12-05',
    orders: [
      { date: '2026-01-20', product: 'Alfajor de Chocolate', quantity: 24, total: 3120, deliveryDate: '2026-01-21', delivered: true },
      { date: '2026-02-10', product: 'Alfajor de Chocolate', quantity: 36, total: 4680, deliveryDate: '2026-02-11', delivered: true },
      { date: '2026-03-05', product: 'Alfajor de Maicena', quantity: 30, total: 3300, deliveryDate: '2026-03-06', delivered: true },
      { date: '2026-03-15', product: 'Alfajor Triple', quantity: 12, total: 2280, deliveryDate: '2026-03-20', delivered: false },
      { date: '2026-03-22', product: 'Alfajor de Chocolate', quantity: 48, total: 6240, deliveryDate: '2026-03-27', delivered: false },
    ]
  },
  {
    id: 3, name: 'Hotel Esplendor', contact: 'Roberto Sánchez', email: 'compras@esplendor.com',
    phone: '099-667788', address: 'Rbla. Gral. Artigas 3802, Montevideo',
    category: 'gastronomia', notes: 'Servicio de amenities para huéspedes', createdAt: '2026-01-15',
    orders: [
      { date: '2026-02-01', product: 'Caja x12 Premium', quantity: 8, total: 14400, deliveryDate: '2026-02-03', delivered: true },
      { date: '2026-03-01', product: 'Caja x12 Premium', quantity: 10, total: 18000, deliveryDate: '2026-03-03', delivered: true },
      { date: '2026-03-25', product: 'Caja x12 Premium', quantity: 12, total: 21600, deliveryDate: '2026-03-30', delivered: false },
    ]
  },
  {
    id: 4, name: 'Supermercado Disco', contact: 'Pedro Gómez', email: 'proveedores@disco.com.uy',
    phone: '099-112233', address: 'Av. Italia 3800, Montevideo',
    category: 'supermercado', notes: 'Requiere factura - Contrato trimestral', createdAt: '2025-10-20',
    orders: [
      { date: '2026-01-05', product: 'Caja x6 Surtidos', quantity: 50, total: 36000, deliveryDate: '2026-01-07', delivered: true },
      { date: '2026-01-20', product: 'Caja x6 Surtidos', quantity: 40, total: 28800, deliveryDate: '2026-01-22', delivered: true },
      { date: '2026-02-05', product: 'Caja x12 Premium', quantity: 20, total: 36000, deliveryDate: '2026-02-07', delivered: true },
      { date: '2026-02-20', product: 'Caja x6 Surtidos', quantity: 45, total: 32400, deliveryDate: '2026-02-22', delivered: true },
      { date: '2026-03-05', product: 'Caja x12 Premium', quantity: 25, total: 45000, deliveryDate: '2026-03-07', delivered: true },
      { date: '2026-03-18', product: 'Caja x6 Surtidos', quantity: 60, total: 43200, deliveryDate: '2026-03-26', delivered: false },
    ]
  },
  {
    id: 5, name: 'Café del Puerto', contact: 'Ana Torres', email: 'ana@cafedelpuerto.com',
    phone: '091-998877', address: 'Rambla 25 de Agosto 302, Montevideo',
    category: 'gastronomia', notes: 'Vende alfajores individuales en mostrador', createdAt: '2026-02-01',
    orders: [
      { date: '2026-02-15', product: 'Alfajor Triple', quantity: 20, total: 3800, deliveryDate: '2026-02-16', delivered: true },
      { date: '2026-03-10', product: 'Alfajor de Frutos Rojos', quantity: 24, total: 4080, deliveryDate: '2026-03-11', delivered: true },
      { date: '2026-03-24', product: 'Alfajor Triple', quantity: 30, total: 5700, deliveryDate: '2026-03-29', delivered: false },
    ]
  },
]

export const initialProducts = [
  { id: 1, name: 'Alfajor de Chocolate', description: 'Chocolate negro, dulce de leche', unitsPerBox: 1, retailPrice: 130, wholesalePrice: 95, productionCost: 45, price: 130, category: 'chocolate', stock: 240, minStock: 100 },
  { id: 2, name: 'Alfajor de Maicena', description: 'Maicena clásica, dulce de leche, coco', unitsPerBox: 1, retailPrice: 110, wholesalePrice: 80, productionCost: 38, price: 110, category: 'maicena', stock: 180, minStock: 80 },
  { id: 3, name: 'Alfajor Blanco', description: 'Chocolate blanco, mousse de DDL', unitsPerBox: 1, retailPrice: 150, wholesalePrice: 110, productionCost: 55, price: 150, category: 'chocolate', stock: 45, minStock: 60 },
  { id: 4, name: 'Alfajor Triple', description: 'Triple chocolate, dulce de leche', unitsPerBox: 1, retailPrice: 190, wholesalePrice: 140, productionCost: 65, price: 190, category: 'premium', stock: 150, minStock: 50 },
  { id: 5, name: 'Alfajor de Frutos Rojos', description: 'Chocolate, mermelada de frutos rojos', unitsPerBox: 1, retailPrice: 170, wholesalePrice: 125, productionCost: 60, price: 170, category: 'premium', stock: 30, minStock: 40 },
  { id: 6, name: 'Caja x6 Surtidos', description: 'Mix de variedades clásicas', unitsPerBox: 6, retailPrice: 720, wholesalePrice: 530, productionCost: 250, price: 720, category: 'caja', stock: 65, minStock: 30 },
  { id: 7, name: 'Caja x12 Premium', description: 'Selección premium para regalo', unitsPerBox: 12, retailPrice: 1800, wholesalePrice: 1350, productionCost: 620, price: 1800, category: 'caja', stock: 20, minStock: 15 },
]

export const initialRawMaterials = [
  { id: 1, name: 'Harina 000', unit: 'kg', stock: 120, minStock: 50, supplier: 'Molinos del Sur' },
  { id: 2, name: 'Dulce de leche', unit: 'kg', stock: 35, minStock: 40, supplier: 'La Serenísima' },
  { id: 3, name: 'Chocolate cobertura', unit: 'kg', stock: 80, minStock: 30, supplier: 'Fenoglio' },
  { id: 4, name: 'Manteca', unit: 'kg', stock: 15, minStock: 20, supplier: 'La Serenísima' },
  { id: 5, name: 'Azúcar', unit: 'kg', stock: 90, minStock: 40, supplier: 'Ledesma' },
  { id: 6, name: 'Maicena', unit: 'kg', stock: 55, minStock: 25, supplier: 'Maizena' },
  { id: 7, name: 'Coco rallado', unit: 'kg', stock: 12, minStock: 10, supplier: 'Proveedor local' },
  { id: 8, name: 'Chocolate blanco', unit: 'kg', stock: 8, minStock: 15, supplier: 'Fenoglio' },
  { id: 9, name: 'Mermelada frutos rojos', unit: 'kg', stock: 5, minStock: 10, supplier: 'Patagonia Berries' },
  { id: 10, name: 'Cajas de cartón', unit: 'unidades', stock: 200, minStock: 100, supplier: 'Embalajes TDF' },
  { id: 11, name: 'Film alimenticio', unit: 'rollos', stock: 18, minStock: 10, supplier: 'Embalajes TDF' },
]

export const initialProduction = [
  { id: 1, product: 'Alfajor de Chocolate', quantity: 200, date: '2026-03-15', status: 'completado' },
  { id: 2, product: 'Alfajor de Maicena', quantity: 150, date: '2026-03-16', status: 'completado' },
  { id: 3, product: 'Alfajor Triple', quantity: 100, date: '2026-03-17', status: 'en-progreso' },
  { id: 4, product: 'Alfajor Blanco', quantity: 120, date: '2026-03-18', status: 'en-progreso' },
  { id: 5, product: 'Caja x6 Surtidos', quantity: 40, date: '2026-03-19', status: 'planificado' },
  { id: 6, product: 'Alfajor de Frutos Rojos', quantity: 80, date: '2026-03-20', status: 'planificado' },
  { id: 7, product: 'Caja x12 Premium', quantity: 25, date: '2026-03-21', status: 'planificado' },
]

export const clientCategories = ['distribuidor', 'minorista', 'gastronomia', 'supermercado', 'mayorista']
export const productCategories = ['chocolate', 'maicena', 'premium', 'caja']
export const productionStatuses = ['planificado', 'en-progreso', 'completado', 'cancelado']

// IDs de datos de ejemplo para poder detectarlos y eliminarlos
export const demoClientIds = new Set(initialClients.map(c => c.id))
export const demoProductIds = new Set(initialProducts.map(p => p.id))
export const demoMaterialIds = new Set(initialRawMaterials.map(m => m.id))
export const demoProductionIds = new Set(initialProduction.map(p => p.id))

export const defaultSettings = {
  companyName: 'Ushuaia Alfajores',
  companyPhone: '+54 2901-000000',
  companyEmail: 'info@ushuaia-alfajores.com',
  companyAddress: 'Ushuaia, Tierra del Fuego, Argentina',
  companyLogo: '',
  clientCategories: ['distribuidor', 'minorista', 'gastronomia', 'supermercado', 'mayorista'],
  productCategories: ['chocolate', 'maicena', 'premium', 'caja'],
  productionStatuses: ['planificado', 'en-progreso', 'completado', 'cancelado'],
  materialUnits: ['kg', 'litros', 'unidades', 'rollos', 'paquetes'],
  // Precios y moneda
  currency: '$',
  defaultPriceType: 'retail',
  taxRate: 22,
  // Entregas
  defaultDeliveryDays: 3,
  // Alertas de stock
  stockAlertEnabled: true,
}
