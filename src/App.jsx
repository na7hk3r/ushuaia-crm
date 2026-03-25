import { useState } from 'react'
import './App.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import { initialClients, initialProducts, initialRawMaterials, initialProduction, defaultSettings } from './data/initialData'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Clients from './components/Clients'
import Production from './components/Production'
import Stock from './components/Stock'
import Materials from './components/Materials'
import Settings from './components/Settings'

function App() {
  const [page, setPage] = useState('dashboard')
  const [clients, setClients] = useLocalStorage('ushuaia-clients', initialClients)
  const [products, setProducts] = useLocalStorage('ushuaia-products', initialProducts)
  const [rawMaterials, setRawMaterials] = useLocalStorage('ushuaia-materials', initialRawMaterials)
  const [production, setProduction] = useLocalStorage('ushuaia-production', initialProduction)
  const [settings, setSettings] = useLocalStorage('ushuaia-settings', defaultSettings)

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

  function renderPage() {
    switch (page) {
      case 'clients':
        return <Clients clients={clients} setClients={setClients} settings={settings} />
      case 'production':
        return <Production production={production} setProduction={setProduction} products={products} settings={settings} />
      case 'stock':
        return <Stock products={products} setProducts={setProducts} settings={settings} />
      case 'materials':
        return <Materials materials={rawMaterials} setMaterials={setRawMaterials} settings={settings} />
      case 'settings':
        return <Settings settings={settings} setSettings={setSettings} allData={allData} onRestore={handleRestore} />
      default:
        return <Dashboard clients={clients} products={products} rawMaterials={rawMaterials} production={production} settings={settings} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar active={page} onNavigate={setPage} companyName={settings.companyName} companyLogo={settings.companyLogo} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
