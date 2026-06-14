import { useAuth } from '../context/AuthContext'
import { useInventory } from '../context/InventoryContext'
import '../App.css'

const platformColors = {
  Amazon: '#FF9900',
  eBay: '#0064D2',
  Shopify: '#96BF48',
  Etsy: '#D5641C',
  Walmart: '#0071CE'
}

const platformIcons = {
  Amazon: '🛒',
  eBay: '📦',
  Shopify: '🛍️',
  Etsy: '🎨',
  Walmart: '🏪'
}

export default function Dashboard() {
  const { user } = useAuth()
  const { totalProducts, totalValue, lowStock, getPlatformStats } = useInventory()
  const stats = getPlatformStats()

  return (
    <div className="dashboard">
      <div className="welcome">
        <h2>Welcome back, {user?.name}</h2>
        <p>Here's your inventory overview across all platforms</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{totalProducts}</span>
          <span className="stat-label">Total Products</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span className="stat-label">Total Inventory Value</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{lowStock}</span>
          <span className="stat-label">Low Stock Items</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.filter(s => s.count > 0).length}/{stats.length}</span>
          <span className="stat-label">Active Platforms</span>
        </div>
      </div>

      <h3>Platform Overview</h3>
      <div className="platform-grid">
        {stats.map(p => (
          <div key={p.name} className="platform-card" style={{ borderLeftColor: platformColors[p.name] }}>
            <div className="platform-header">
              <span className="platform-icon">{platformIcons[p.name]}</span>
              <strong>{p.name}</strong>
            </div>
            <div className="platform-stats">
              <div>{p.count} products listed</div>
              <div>${p.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
