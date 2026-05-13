import { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import { initialClients, initialProducts, initialRawMaterials, initialProduction, defaultSettings, demoClientIds, demoProductIds, demoMaterialIds, demoProductionIds } from './data/initialData'
import { hasDataChanged, normalizeAppData, normalizeClients, normalizeMaterials, normalizeProduction, normalizeProducts, normalizeSettings } from './utils/dataModel.js'
import Sidebar from './components/Sidebar'
import UpdateBanner from './components/UpdateBanner'

const Dashboard = lazy(() => import('./components/Dashboard'))
const Clients = lazy(() => import('./components/Clients'))
const Production = lazy(() => import('./components/Production'))
const Stock = lazy(() => import('./components/Stock'))
const Materials = lazy(() => import('./components/Materials'))
const Settings = lazy(() => import('./components/Settings'))
const Alerts = lazy(() => import('./components/Alerts'))

function App() {
  const [page, setPage] = useState('dashboard')
  const [clients, setClients] = useLocalStorage('ushuaia-clients', initialClients, normalizeClients)
  const [products, setProducts] = useLocalStorage('ushuaia-products', initialProducts, normalizeProducts)
  const [rawMaterials, setRawMaterials] = useLocalStorage('ushuaia-materials', initialRawMaterials, normalizeMaterials)
  const [production, setProduction] = useLocalStorage('ushuaia-production', initialProduction, normalizeProduction)
  const [settings, setSettings] = useLocalStorage('ushuaia-settings', defaultSettings, normalizeSettings)
  const [demoCleared, setDemoCleared] = useLocalStorage('ushuaia-demo-cleared', false)

  function handleRestore(data) {
    const normalized = normalizeAppData(data)
    setClients(normalized.clients)
    setProducts(normalized.products)
    setRawMaterials(normalized.materials)
    setProduction(normalized.production)
    setSettings(normalized.settings)
  }

  const allData = {
    clients, products, materials: rawMaterials, production, settings
  }

  const hasDemoData = !demoCleared &&
    (clients.some(c => demoClientIds.has(c.id)) ||
    products.some(p => demoProductIds.has(p.id)) ||
    rawMaterials.some(m => demoMaterialIds.has(m.id)) ||
    production.some(p => demoProductionIds.has(p.id)))

  useEffect(() => {
    const normalized = normalizeAppData({ clients, products, materials: rawMaterials, production, settings })

    if (hasDataChanged(clients, normalized.clients)) setClients(normalized.clients)
    if (hasDataChanged(products, normalized.products)) setProducts(normalized.products)
    if (hasDataChanged(rawMaterials, normalized.materials)) setRawMaterials(normalized.materials)
    if (hasDataChanged(production, normalized.production)) setProduction(normalized.production)
    if (hasDataChanged(settings, normalized.settings)) setSettings(normalized.settings)
  }, [clients, products, rawMaterials, production, settings, setClients, setProducts, setRawMaterials, setProduction, setSettings])

  // Auto-mark demo as cleared when all demo items have been removed manually
  useEffect(() => {
    if (demoCleared) return
    const hasAnyDemoItem =
      clients.some(c => demoClientIds.has(c.id)) ||
      products.some(p => demoProductIds.has(p.id)) ||
      rawMaterials.some(m => demoMaterialIds.has(m.id)) ||
      production.some(p => demoProductionIds.has(p.id))
    if (!hasAnyDemoItem) setDemoCleared(true)
  }, [clients, products, rawMaterials, production, demoCleared, setDemoCleared])

  function handleClearDemoData() {
    setClients(prev => prev.filter(c => !demoClientIds.has(c.id)))
    setProducts(prev => prev.filter(p => !demoProductIds.has(p.id)))
    setRawMaterials(prev => prev.filter(m => !demoMaterialIds.has(m.id)))
    setProduction(prev => prev.filter(p => !demoProductionIds.has(p.id)))
    setDemoCleared(true)
  }

  function renderPage() {
    switch (page) {
      case 'alerts':
        return <Alerts clients={clients} products={products} rawMaterials={rawMaterials} production={production} settings={settings} onNavigate={setPage} />
      case 'clients':
        return <Clients clients={clients} setClients={setClients} settings={settings} products={products} />
      case 'production':
        return <Production production={production} setProduction={setProduction} products={products} settings={settings} />
      case 'stock':
        return <Stock products={products} setProducts={setProducts} clients={clients} production={production} settings={settings} />
      case 'materials':
        return <Materials materials={rawMaterials} setMaterials={setRawMaterials} settings={settings} />
      case 'settings':
        return <Settings settings={settings} setSettings={setSettings} allData={allData} onRestore={handleRestore} products={products} />
      default:
        return <Dashboard clients={clients} products={products} rawMaterials={rawMaterials} production={production} settings={settings} hasDemoData={hasDemoData} onClearDemoData={handleClearDemoData} onNavigate={setPage} />
    }
  }

  return (
    <div className="app-layout">
      {window.electronAPI?.isElectron && <UpdateBanner />}
      <Sidebar active={page} onNavigate={setPage} companyName={settings.companyName} companyLogo={settings.companyLogo} />
      <main className="main-content">
        <Suspense fallback={<div className="page loading-page">Cargando...</div>}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  )
}

export default App
