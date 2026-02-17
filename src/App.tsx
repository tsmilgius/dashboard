import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Metrics from './components/Metrics'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('metrics')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  return (
    <div className="app">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'metrics' && <Metrics />}
        {activeTab !== 'dashboard' && activeTab !== 'metrics' && (
          <div style={{ padding: 24 }}>
            <h2 style={{ color: '#1d1d1f' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p style={{ color: '#86868b', marginTop: 8 }}>Coming soon…</p>
          </div>
        )}
      </main>
    </div>
  )
}