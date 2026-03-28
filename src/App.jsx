import { useState } from 'react'
import './App.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import { initialClients, initialProducts, initialRawMaterials, initialProduction, defaultSettings, demoClientIds, demoProductIds, demoMaterialIds, demoProductionIds } from './data/initialData'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Clients from './components/Clients'
import Production from './components/Production'
import Stock from './components/Stock'
import Materials from './components/Materials'
import Settings from './components/Settings'
import Alerts from './components/Alerts'
import UpdateBanner from './components/UpdateBanner'

function App() {
  const [page, setPage] = useState('dashboard')
  const [clients, setClients] = useLocalStorage('ushuaia-clients', initialClients)
  const [products, setProducts] = useLocalStorage('ushuaia-products', initialProducts)
  const [rawMaterials, setRawMaterials] = useLocalStorage('ushuaia-materials', initialRawMaterials)
  const [production, setProduction] = useLocalStorage('ushuaia-production', initialProduction)
  const [settings, setSettings] = useLocalStorage('ushuaia-settings', defaultSettings)
  const [demoCleared, setDemoCleared] = useLocalStorage('ushuaia-demo-cleared', false)

  function handleRestore(data) {
    if (data.clients) setClients(data.clients)
    if (data.products) setProducts(data.products)
    if (data.materials) setRawMaterials(data.materials)
    if (data.production) setProduction(data.production)
    if (data.settings) setSettings(data.settings)
  }

  const allData = {
    clients, products, materials: rawMaterials, production, settings
  }

  const hasDemoData = !demoCleared &&
    (clients.some(c => demoClientIds.has(c.id)) ||
    products.some(p => demoProductIds.has(p.id)) ||
    rawMaterials.some(m => demoMaterialIds.has(m.id)) ||
    production.some(p => demoProductionIds.has(p.id)))

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
        return <Alerts clients={clients} products={products} rawMaterials={rawMaterials} production={production} onNavigate={setPage} />
      case 'clients':
        return <Clients clients={clients} setClients={setClients} settings={settings} products={products} />
      case 'production':
        return <Production production={production} setProduction={setProduction} products={products} settings={settings} />
      case 'stock':
        return <Stock products={products} setProducts={setProducts} settings={settings} />
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
        {renderPage()}
      </main>
    </div>
  )
}

export default App
