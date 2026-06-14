import { useInventory } from '../context/InventoryContext'
import '../App.css'

const platformDetails = {
  Amazon: { color: '#FF9900', icon: '🛒', desc: 'Sell to millions of Amazon customers worldwide.' },
  eBay: { color: '#0064D2', icon: '📦', desc: 'Auction and fixed-price listings on eBay.' },
  Shopify: { color: '#96BF48', icon: '🛍️', desc: 'Your own branded online store.' },
  Etsy: { color: '#D5641C', icon: '🎨', desc: 'Handmade, vintage & craft supplies.' },
  Walmart: { color: '#0071CE', icon: '🏪', desc: 'Reach Walmart shoppers across the US.' }
}

export default function Platforms() {
  const { getPlatformStats, getProductsByPlatform, PLATFORMS } = useInventory()
  const stats = getPlatformStats()

  return (
    <div className="platforms-page">
      <h2>Connected Platforms</h2>
      <p className="subtitle">Manage your listings across all sales channels</p>

      <div className="platform-detail-grid">
        {stats.map(s => {
          const detail = platformDetails[s.name]
          const products = getProductsByPlatform(s.name)
          return (
            <div key={s.name} className="platform-detail-card" style={{ borderTopColor: detail.color }}>
              <div className="platform-detail-header">
                <span className="platform-icon-large">{detail.icon}</span>
                <div>
                  <h3>{s.name}</h3>
                  <p>{detail.desc}</p>
                </div>
                <span className="platform-status" style={{ background: s.count > 0 ? '#22c55e' : '#94a3b8' }}>
                  {s.count > 0 ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="platform-detail-stats">
                <div><strong>{s.count}</strong> products listed</div>
                <div><strong>${s.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> total value</div>
              </div>
              {products.length > 0 && (
                <div className="platform-products">
                  <p className="mini-title">Listed Products:</p>
                  {products.slice(0, 4).map(p => (
                    <div key={p.id} className="mini-product">
                      <span>{p.name}</span>
                      <span>${p.price.toFixed(2)} ({p.quantity} units)</span>
                    </div>
                  ))}
                  {products.length > 4 && <span className="more-text">+{products.length - 4} more</span>}
                </div>
              )}
              <button className="btn-secondary" disabled>
                {s.count > 0 ? 'Sync Now' : 'Connect Platform'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
