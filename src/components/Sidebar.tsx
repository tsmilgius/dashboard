import { FiHome, FiUsers, FiSettings, FiArrowUpCircle, FiActivity, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import './Sidebar.css'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  collapsed: boolean
  onToggle: () => void
}

const Sidebar = ({ activeTab, setActiveTab, collapsed, onToggle }: SidebarProps) => {
  const menuItems = [
    { id: 'metrics', label: 'Server Metrics', icon: FiActivity },
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'customers', label: 'Customers', icon: FiUsers },
    { id: 'organizations', label: 'Organizations', icon: HiOutlineOfficeBuilding },
    { id: 'upgrade', label: 'Upgrade account', icon: FiArrowUpCircle },
  ]

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">D</div>
          {!collapsed && <span className="logo-text">Dashboard</span>}
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
              title={collapsed ? item.label : undefined}
            >
              <Icon className="nav-icon" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" title={collapsed ? 'Settings' : undefined}>
          <FiSettings className="nav-icon" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button className="nav-item toggle-btn" onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <FiChevronsRight className="nav-icon" /> : <FiChevronsLeft className="nav-icon" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
