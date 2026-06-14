import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Home, Sliders, Truck, Globe, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import '../App.css'

const TABS = [
  { id: 'home', label: 'Home Dashboard', icon: Home },
  { id: 'inventory', label: 'Inventory Control', icon: Sliders },
  { id: 'orders', label: 'Channel Order Log', icon: Truck },
  { id: 'channels', label: 'Connected Platforms', icon: Globe },
]

export default function Navbar({ currentTab, setCurrentTab, onSimulate }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isDemo = user?.email === 'demo@digimartx.com'

  const handleLogoClick = () => {
    setCurrentTab('home')
    navigate('/dashboard')
  }

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={theme === 'dark' ? '/logo-dark.png' : '/logo.png'} alt="DigiMartX" className="navbar-logo" />
      </div>
      <div className="nav-links">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setCurrentTab(tab.id)}
              className={`nav-tab ${currentTab === tab.id ? 'nav-tab-active' : ''}`}>
              <Icon size={16} /> {tab.label}
            </button>
          )
        })}
      </div>
      <div className="nav-user">
        {!isDemo && <button className="nav-btn-demo" onClick={() => window.location.href = '/'}>Demo</button>}
        {onSimulate && <button onClick={onSimulate} className="nav-btn-simulate"><RefreshCw size={14} className="sd-icon-spin" /> Simulate</button>}
        <button className="theme-toggle nav-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <span className="user-email">{user?.email}</span>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  )
}
