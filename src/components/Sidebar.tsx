import { FiHome, FiUsers, FiSettings, FiArrowUpCircle, FiActivity } from 'react-icons/fi'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import './Sidebar.css'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'metrics', label: 'Server Metrics', icon: FiActivity },
    { id: 'customers', label: 'Customers', icon: FiUsers },
    { id: 'organizations', label: 'Organizations', icon: HiOutlineOfficeBuilding },
    { id: 'upgrade', label: 'Upgrade account', icon: FiArrowUpCircle },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">D</div>
          <span className="logo-text">Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <FiSettings className="nav-icon" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
