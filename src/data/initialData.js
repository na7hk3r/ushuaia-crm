const today = new Date().toISOString().slice(0, 10)

export const initialClients = [
  {
    id: 1, name: 'Distribuidora del Sur', contact: 'Martín López', email: 'martin@delsur.com',
    phone: '2901-445566', address: 'Av. San Martín 450, Ushuaia',
    category: 'distribuidor', notes: 'Pedidos regulares cada 2 semanas', createdAt: '2025-11-10',
    orders: [
      { date: '2026-01-15', total: 85000 },
      { date: '2026-02-01', total: 92000 },
      { date: '2026-02-15', total: 78000 },
      { date: '2026-03-01', total: 105000 },
    ]
  },
  {
    id: 2, name: 'Kiosco El Faro', contact: 'Lucía Fernández', email: 'lucia@elfaro.com',
    phone: '2901-223344', address: 'Gobernador Paz 120, Ushuaia',
    category: 'minorista', notes: 'Prefiere alfajores de chocolate', createdAt: '2025-12-05',
    orders: [
      { date: '2026-01-20', total: 15000 },
      { date: '2026-02-10', total: 18000 },
      { date: '2026-03-05', total: 22000 },
    ]
  },
  {
    id: 3, name: 'Hotel Los Cauquenes', contact: 'Roberto Sánchez', email: 'compras@cauquenes.com',
    phone: '2901-667788', address: 'De los Cauquenes 3802, Ushuaia',
    category: 'gastronomia', notes: 'Servicio de amenities para huéspedes', createdAt: '2026-01-15',
    orders: [
      { date: '2026-02-01', total: 45000 },
      { date: '2026-03-01', total: 52000 },
    ]
  },
  {
    id: 4, name: 'Supermercado La Anónima', contact: 'Pedro Gómez', email: 'proveedores@laano.com',
    phone: '2901-112233', address: 'Av. Maipú 800, Ushuaia',
    category: 'supermercado', notes: 'Requiere factura A - Contrato trimestral', createdAt: '2025-10-20',
    orders: [
      { date: '2026-01-05', total: 180000 },
      { date: '2026-01-20', total: 165000 },
      { date: '2026-02-05', total: 195000 },
      { date: '2026-02-20', total: 210000 },
      { date: '2026-03-05', total: 188000 },
    ]
  },
  {
    id: 5, name: 'Café del Beagle', contact: 'Ana Torres', email: 'ana@cafedelbeagle.com',
    phone: '2901-998877', address: 'Av. Maipú 302, Ushuaia',
    category: 'gastronomia', notes: 'Vende alfajores individuales en mostrador', createdAt: '2026-02-01',
    orders: [
      { date: '2026-02-15', total: 12000 },
      { date: '2026-03-10', total: 14500 },
    ]
  },
]

export const initialProducts = [
  { id: 1, name: 'Alfajor de Chocolate', description: 'Chocolate negro, dulce de leche', price: 950, category: 'chocolate', stock: 240, minStock: 100 },
  { id: 2, name: 'Alfajor de Maicena', description: 'Maicena clásica, dulce de leche, coco', price: 800, category: 'maicena', stock: 180, minStock: 80 },
  { id: 3, name: 'Alfajor Blanco', description: 'Chocolate blanco, mousse de DDL', price: 1050, category: 'chocolate', stock: 45, minStock: 60 },
  { id: 4, name: 'Alfajor Triple', description: 'Triple chocolate, dulce de leche', price: 1400, category: 'premium', stock: 150, minStock: 50 },
  { id: 5, name: 'Alfajor de Frutos Rojos', description: 'Chocolate, mermelada de frutos rojos', price: 1200, category: 'premium', stock: 30, minStock: 40 },
  { id: 6, name: 'Caja x6 Surtidos', description: 'Mix de variedades clásicas', price: 5200, category: 'caja', stock: 65, minStock: 30 },
  { id: 7, name: 'Caja x12 Premium', description: 'Selección premium para regalo', price: 12800, category: 'caja', stock: 20, minStock: 15 },
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

export const monthlySales = [
  { month: 'Oct', ventas: 420000 },
  { month: 'Nov', ventas: 510000 },
  { month: 'Dic', ventas: 680000 },
  { month: 'Ene', ventas: 590000 },
  { month: 'Feb', ventas: 720000 },
  { month: 'Mar', ventas: 385000 },
]

export const clientCategories = ['distribuidor', 'minorista', 'gastronomia', 'supermercado', 'mayorista']
export const productCategories = ['chocolate', 'maicena', 'premium', 'caja']
export const productionStatuses = ['planificado', 'en-progreso', 'completado', 'cancelado']

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
}
