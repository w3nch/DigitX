import { useState, useMemo, useEffect } from 'react'
import {
  Boxes,
  Globe,
  RefreshCw,
  Plus,
  Search,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  Activity,
  ArrowRight
} from 'lucide-react'
import Navbar from '../components/Navbar'

const INITIAL_CHANNELS = [
  { id: 'shopify', name: 'Shopify Store', url: 'shop.digimartx.in', color: '#10B981', ordersCount: 142 },
  { id: 'amazon', name: 'Amazon IN', url: 'seller.amazon.in', color: '#F59E0B', ordersCount: 310 },
  { id: 'woocommerce', name: 'WooCommerce', url: 'direct.digimartx.com', color: '#8B5CF6', ordersCount: 88 },
  { id: 'flipkart', name: 'Flipkart Hub', url: 'seller.flipkart.com', color: '#3B82F6', ordersCount: 205 }
]

const INITIAL_CATALOG = [
  {
    sku: 'DMX-IPH15-128',
    name: 'Apple iPhone 15 (128GB, Blue)',
    category: 'Electronics',
    price: 71200,
    threshold: 10,
    channels: { shopify: 12, amazon: 25, woocommerce: 8, flipkart: 15 }
  },
  {
    sku: 'DMX-SNY-XM5',
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Audio Tech',
    price: 29990,
    threshold: 8,
    channels: { shopify: 8, amazon: 14, woocommerce: 5, flipkart: 10 }
  },
  {
    sku: 'DMX-BNS-SILK',
    name: 'Pure Banarasi Silk Saree',
    category: 'Fashion Wear',
    price: 4900,
    threshold: 5,
    channels: { shopify: 20, amazon: 15, woocommerce: 10, flipkart: 22 }
  },
  {
    sku: 'DMX-PHL-AFXL',
    name: 'Philips Air Fryer XL (6.2L)',
    category: 'Kitchen',
    price: 8999,
    threshold: 5,
    channels: { shopify: 4, amazon: 9, woocommerce: 3, flipkart: 6 }
  }
]

const INITIAL_ORDERS = [
  { id: 'ORD-9021', source: 'shopify', sku: 'DMX-SNY-XM5', quantity: 1, total: 29990, customer: 'Rajesh Nair', date: '2026-06-14', status: 'Processing' },
  { id: 'ORD-7440', source: 'amazon', sku: 'DMX-BNS-SILK', quantity: 2, total: 9800, customer: 'Priyanka Sen', date: '2026-06-13', status: 'Dispatched' }
]

const INITIAL_LOGS = [
  { id: 1, message: "Database audit complete: Master catalog matches channel allocations.", time: "10 mins ago", type: "success" },
  { id: 2, message: "Channel webhook API verified with shop.digimartx.in.", time: "1 hour ago", type: "info" },
  { id: 3, message: "Dispatched package ORD-7440. Tracking log uploaded to Amazon IN.", time: "3 hours ago", type: "success" }
]

export default function SellerDashboard({ user }) {
  const [currentTab, setCurrentTab] = useState('home')
  const [channels, setChannels] = useState(INITIAL_CHANNELS)
  const [catalog, setCatalog] = useState(INITIAL_CATALOG)
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [systemLogs, setSystemLogs] = useState(INITIAL_LOGS)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSku, setExpandedSku] = useState(null)
  const [isAddSkuOpen, setIsAddSkuOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const [newSku, setNewSku] = useState({
    sku: '', name: '', category: 'Electronics', price: '', threshold: '5',
    shopify: '10', amazon: '10', woocommerce: '10', flipkart: '10'
  })

  const triggerToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  useEffect(() => {
    if (user?.email && user.email !== 'demo@digimartx.com') {
      triggerToast(`Welcome, ${user.name || user.email}! Your dashboard is ready.`)
    }
  }, [])

  const simulateChannelSale = () => {
    const randomProduct = catalog[Math.floor(Math.random() * catalog.length)]
    const activeChannelsForProduct = Object.keys(randomProduct.channels).filter(cId => randomProduct.channels[cId] > 0)

    if (activeChannelsForProduct.length === 0) {
      triggerToast("Out of stock! Please restock before simulating a sale.", "error")
      return
    }

    const randomChannelId = activeChannelsForProduct[Math.floor(Math.random() * activeChannelsForProduct.length)]
    const targetChannel = channels.find(c => c.id === randomChannelId)

    setCatalog(prev => prev.map(p => {
      if (p.sku === randomProduct.sku) {
        return { ...p, channels: { ...p.channels, [randomChannelId]: Math.max(0, p.channels[randomChannelId] - 1) } }
      }
      return p
    }))

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    const newOrder = {
      id: orderId, source: randomChannelId, sku: randomProduct.sku, quantity: 1,
      total: randomProduct.price,
      customer: ['Amit Verma', 'Simran Kaur', 'Harsh Patel', 'Komal Shah', 'Rajesh Nair'][Math.floor(Math.random() * 5)],
      date: new Date().toISOString().split('T')[0], status: 'Processing'
    }

    setOrders(prev => [newOrder, ...prev])
    setChannels(prev => prev.map(c => c.id === randomChannelId ? { ...c, ordersCount: c.ordersCount + 1 } : c))
    setSystemLogs(prev => [{
      id: Date.now(),
      message: `Incoming sale from ${targetChannel.name}: 1x ${randomProduct.sku} processed. Inventory decremented across cluster.`,
      time: "Just now", type: "sale"
    }, ...prev])

    triggerToast(`Sale simulated on ${targetChannel.name}: 1x ${randomProduct.name} (SKU: ${randomProduct.sku}) updated across all systems!`, "success")
  }

  const handleAddSku = (e) => {
    e.preventDefault()
    if (!newSku.sku || !newSku.name || !newSku.price) {
      triggerToast("Please fill in SKU code, name, and pricing.", "error")
      return
    }

    const priceNum = parseInt(newSku.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast("Please input a valid price.", "error")
      return
    }

    const formattedSku = {
      sku: newSku.sku.toUpperCase().replace(/\s+/g, '-'),
      name: newSku.name,
      category: newSku.category,
      price: priceNum,
      threshold: parseInt(newSku.threshold) || 5,
      channels: {
        shopify: parseInt(newSku.shopify) || 0,
        amazon: parseInt(newSku.amazon) || 0,
        woocommerce: parseInt(newSku.woocommerce) || 0,
        flipkart: parseInt(newSku.flipkart) || 0
      }
    }

    setCatalog(prev => [formattedSku, ...prev])
    setIsAddSkuOpen(false)
    setNewSku({ sku: '', name: '', category: 'Electronics', price: '', threshold: '5', shopify: '10', amazon: '10', woocommerce: '10', flipkart: '10' })
    setSystemLogs(prev => [{
      id: Date.now(),
      message: `New Master SKU ${formattedSku.sku} created. Integrated stock levels published to active storefronts.`,
      time: "Just now", type: "success"
    }, ...prev])
    triggerToast(`SKU ${formattedSku.sku} is now live and distributed.`, "success")
  }

  const handleUpdateInlineStock = (sku, channelId, value) => {
    setCatalog(prev => prev.map(p => {
      if (p.sku === sku) {
        return { ...p, channels: { ...p.channels, [channelId]: Math.max(0, parseInt(value) || 0) } }
      }
      return p
    }))
  }

  const handleDeleteSku = (skuCode) => {
    setCatalog(prev => prev.filter(p => p.sku !== skuCode))
    setSystemLogs(prev => [{
      id: Date.now(),
      message: `Master SKU ${skuCode} has been deleted and depublished from all sales channels.`,
      time: "Just now", type: "info"
    }, ...prev])
    triggerToast(`SKU ${skuCode} removed from central database.`, "info")
  }

  const handleShipOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Dispatched' } : o))
    setSystemLogs(prev => [{
      id: Date.now(),
      message: `Order logistics approved for ${orderId}. Fulfillment status flagged as Dispatched.`,
      time: "Just now", type: "success"
    }, ...prev])
    triggerToast(`Order ${orderId} marked as Dispatched.`, "success")
  }

  const stats = useMemo(() => {
    let globalStock = 0, totalValuation = 0, criticalItems = 0
    catalog.forEach(item => {
      const sum = Object.values(item.channels).reduce((a, b) => a + b, 0)
      globalStock += sum
      totalValuation += sum * item.price
      if (sum <= item.threshold) criticalItems++
    })
    return { globalStock, totalValuation, criticalItems, totalSkus: catalog.length }
  }, [catalog])

  const filteredCatalog = useMemo(() => {
    return catalog.filter(p =>
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [catalog, searchQuery])

  return (
    <div className="seller-dashboard">

      {toasts.map(toast => (
        <div key={toast.id} className={`sd-toast ${toast.type === 'success' ? 'sd-toast-success' : 'sd-toast-error'}`}>
          <span className="sd-toast-dot" />
          <span>{toast.message}</span>
        </div>
      ))}

      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} onSimulate={simulateChannelSale} />

      <main className="sd-main">
        <section className="sd-stats">
          <div className="sd-stat-card">
            <span className="sd-stat-label">Global Master SKUs</span>
            <span className="sd-stat-value">{stats.totalSkus} Products</span>
          </div>
          <div className="sd-stat-card">
            <span className="sd-stat-label">Total Synced Stock</span>
            <span className="sd-stat-value">{stats.globalStock} Units</span>
          </div>
          <div className="sd-stat-card">
            <span className="sd-stat-label">Central Asset Valuation</span>
            <span className="sd-stat-value">₹{stats.totalValuation.toLocaleString('en-IN')}</span>
          </div>
          <div className="sd-stat-card">
            <span className="sd-stat-label">Low Stock Alert Limit</span>
            <span className={`sd-stat-value ${stats.criticalItems > 0 ? 'sd-stat-warning' : ''}`}>
              {stats.criticalItems} SKUs Warning
            </span>
          </div>
        </section>

        {currentTab === 'home' && (
          <div className="sd-home">
            <div className="sd-welcome-card">
              <div className="sd-welcome-left">
                <span className="sd-badge-live">
                  <span className="sd-ping" /> Global Node Operations Active
                </span>
                <h2>Welcome back, {user?.name || 'Merchant'}</h2>
                <p>All external channels (Shopify, Amazon, WooCommerce, Flipkart) are online with zero catalog sync mismatches.</p>
              </div>
              <button onClick={() => { setIsAddSkuOpen(true); setCurrentTab('inventory') }} className="sd-btn sd-btn-primary">
                <Plus className="sd-icon" /> Deploy New SKU
              </button>
            </div>

            <div className="sd-home-grid">
              <div className="sd-home-left">
                <div className="sd-card">
                  <div className="sd-card-header">
                    <span className="sd-card-title"><Globe className="sd-icon" /> Synced Storefront Platforms</span>
                    <span className="sd-card-badge">Active Rest API Handshake Status</span>
                  </div>
                  <div className="sd-channel-grid">
                    {channels.map(chan => {
                      const channelStock = catalog.reduce((sum, item) => sum + (item.channels[chan.id] || 0), 0)
                      return (
                        <div key={chan.id} className="sd-channel-card">
                          <div className="sd-channel-top">
                            <span className="sd-channel-name"><span className="sd-dot" style={{ backgroundColor: chan.color }} /> {chan.name}</span>
                            <span className="sd-badge-online">ONLINE</span>
                          </div>
                          <div className="sd-channel-metrics">
                            <div className="sd-metric"><span className="sd-metric-label">Allocated Stock</span><span className="sd-metric-val">{channelStock} units</span></div>
                            <div className="sd-metric"><span className="sd-metric-label">Orders Handled</span><span className="sd-metric-val">{chan.ordersCount} requests</span></div>
                          </div>
                          <div className="sd-channel-footer">
                            <span className="sd-channel-url">{chan.url}</span>
                            <button onClick={() => setCurrentTab('channels')} className="sd-link">Config <ArrowRight className="sd-icon-sm" /></button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="sd-home-right">
                <div className="sd-card">
                  <div className="sd-card-header">
                    <span className="sd-card-title"><Activity className="sd-icon" /> Central Sync Logs</span>
                    <span className="sd-ping-sm" />
                  </div>
                  <div className="sd-logs">
                    {systemLogs.map(log => (
                      <div key={log.id} className="sd-log">
                        <div className="sd-log-top">
                          <span className={`sd-log-type sd-log-type-${log.type}`}>
                            {log.type === 'sale' ? 'Platform Sale' : log.type === 'success' ? 'Database Sync' : 'Info Log'}
                          </span>
                          <span className="sd-log-time">{log.time}</span>
                        </div>
                        <p className="sd-log-msg">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sd-system-card">
                  <Boxes className="sd-system-bg-icon" />
                  <span className="sd-system-label">Central Diagnostics</span>
                  <h4>E-Commerce Asset Security Pool</h4>
                  <p>Your central database holds encrypted webhooks matching inventory listings on target shop sites with absolute state parity.</p>
                  <div className="sd-system-footer">
                    <span>SSL Tunnel Protection</span>
                    <span>REST Security: Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'inventory' && (
          <div className="sd-inventory">
            <div className="sd-inv-toolbar">
              <div className="sd-search">
                <Search className="sd-search-icon" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Quick search SKU, brand, model..." className="sd-search-input" />
              </div>
              <button onClick={() => setIsAddSkuOpen(!isAddSkuOpen)} className="sd-btn sd-btn-primary">
                <Plus className="sd-icon" /> Create New SKU
              </button>
            </div>

            {isAddSkuOpen && (
              <form onSubmit={handleAddSku} className="sd-form">
                <div className="sd-form-header">
                  <h4>Define New Stock Catalog Item</h4>
                  <button type="button" onClick={() => setIsAddSkuOpen(false)} className="sd-link">Close</button>
                </div>
                <div className="sd-form-grid">
                  <div className="sd-field">
                    <label>SKU CODE *</label>
                    <input type="text" required placeholder="e.g. DMX-AIR-PRO" value={newSku.sku}
                      onChange={e => setNewSku(prev => ({ ...prev, sku: e.target.value }))} />
                  </div>
                  <div className="sd-field sd-field-wide">
                    <label>PRODUCT SPECIFICATION NAME *</label>
                    <input type="text" required placeholder="e.g. Apple iPad Air 256GB" value={newSku.name}
                      onChange={e => setNewSku(prev => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div className="sd-field">
                    <label>MASTER PRICE *</label>
                    <input type="number" required placeholder="e.g. 54999" value={newSku.price}
                      onChange={e => setNewSku(prev => ({ ...prev, price: e.target.value }))} />
                  </div>
                </div>
                <div className="sd-form-channels">
                  {['shopify', 'amazon', 'woocommerce', 'flipkart'].map(cId => {
                    const chan = channels.find(c => c.id === cId)
                    return (
                      <div key={cId} className="sd-field">
                        <label>{chan.name.toUpperCase()} STOCK</label>
                        <input type="number" value={newSku[cId]}
                          onChange={e => setNewSku(prev => ({ ...prev, [cId]: e.target.value }))} />
                      </div>
                    )
                  })}
                  <div className="sd-field">
                    <label>LOW STOCK ALARM</label>
                    <input type="number" value={newSku.threshold}
                      onChange={e => setNewSku(prev => ({ ...prev, threshold: e.target.value }))} />
                  </div>
                </div>
                <div className="sd-form-actions">
                  <button type="button" onClick={() => setIsAddSkuOpen(false)} className="sd-btn sd-btn-cancel">Cancel</button>
                  <button type="submit" className="sd-btn sd-btn-primary">Publish & Sync Item</button>
                </div>
              </form>
            )}

            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Central SKU / Specifications</th>
                    <th>Billed Price</th>
                    <th>Multi-Website Stock Distribution</th>
                    <th>Combined Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalog.map(product => {
                    const totalInventory = Object.values(product.channels).reduce((a, b) => a + b, 0)
                    const isExpanded = expandedSku === product.sku
                    const isLow = totalInventory <= product.threshold
                    return (
                      <>
                        <tr key={product.sku} onClick={() => setExpandedSku(isExpanded ? null : product.sku)}
                          className={isExpanded ? 'sd-row-expanded' : ''}>
                          <td>
                            <span className="sd-category">{product.category}</span>
                            <h4>{product.name}</h4>
                            <span className="sd-sku">{product.sku}</span>
                          </td>
                          <td className="sd-price">₹{product.price.toLocaleString('en-IN')}</td>
                          <td>
                            <div className="sd-channel-tags">
                              {Object.entries(product.channels).map(([chanId, count]) => {
                                const chanMeta = channels.find(c => c.id === chanId) || { name: chanId, color: '#a1a1aa' }
                                return (
                                  <span key={chanId} className="sd-tag">
                                    <span className="sd-dot" style={{ backgroundColor: chanMeta.color }} />
                                    <span>{chanMeta.name}:</span>
                                    <b>{count}</b>
                                  </span>
                                )
                              })}
                            </div>
                          </td>
                          <td>
                            {isLow ? (
                              <span className="sd-badge-warning"><AlertCircle className="sd-icon-sm" /> {totalInventory} Alert</span>
                            ) : (
                              <span className="sd-badge-stock">{totalInventory} In stock</span>
                            )}
                          </td>
                          <td>
                            <div className="sd-row-actions">
                              <button onClick={e => { e.stopPropagation(); setExpandedSku(isExpanded ? null : product.sku) }}
                                className="sd-icon-btn">{isExpanded ? <ChevronUp /> : <ChevronDown />}</button>
                              <button onClick={e => { e.stopPropagation(); handleDeleteSku(product.sku) }}
                                className="sd-icon-btn sd-icon-btn-danger"><Trash2 /></button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="sd-expand-row">
                            <td colSpan={5}>
                              <div className="sd-expand-panel">
                                <span className="sd-expand-title">Immediate Cross-Website Distribution Manager</span>
                                <div className="sd-expand-grid">
                                  {Object.entries(product.channels).map(([chanId, stock]) => {
                                    const chanMeta = channels.find(c => c.id === chanId) || { name: chanId, color: '#a1a1aa' }
                                    return (
                                      <div key={chanId} className="sd-field">
                                        <label><span className="sd-dot" style={{ backgroundColor: chanMeta.color }} /> {chanMeta.name} Stock</label>
                                        <input type="number" value={stock}
                                          onChange={e => handleUpdateInlineStock(product.sku, chanId, e.target.value)} />
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                  {filteredCatalog.length === 0 && (
                    <tr><td colSpan={5} className="sd-empty"><AlertCircle /> <p>No stock spec matching current queries.</p></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentTab === 'orders' && (
          <div className="sd-orders">
            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Source Website</th>
                    <th>SKU details</th>
                    <th>Recipient / Destination</th>
                    <th>Total Valuation</th>
                    <th>Sync Fulfillment State</th>
                    <th>Fulfillment Gate</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const chanMeta = channels.find(c => c.id === order.source) || { name: order.source, color: '#a1a1aa' }
                    const prodMeta = catalog.find(p => p.sku === order.sku) || { name: 'Legacy product' }
                    return (
                      <tr key={order.id}>
                        <td className="sd-mono">{order.id}</td>
                        <td><span className="sd-tag"><span className="sd-dot" style={{ backgroundColor: chanMeta.color }} /> {chanMeta.name}</span></td>
                        <td><b>{prodMeta.name}</b><span className="sd-sku">{order.sku}</span></td>
                        <td><b>{order.customer}</b><span className="sd-date">{order.date}</span></td>
                        <td className="sd-price">₹{(order.total * order.quantity).toLocaleString('en-IN')}</td>
                        <td>
                          {order.status === 'Processing' ? (
                            <span className="sd-badge-processing"><span className="sd-pulse" /> Processing</span>
                          ) : (
                            <span className="sd-badge-dispatched"><span className="sd-dot-green" /> Dispatched</span>
                          )}
                        </td>
                        <td>
                          {order.status === 'Processing' ? (
                            <button onClick={() => handleShipOrder(order.id)} className="sd-btn sd-btn-sm sd-btn-primary">Mark Dispatched</button>
                          ) : (
                            <span className="sd-logged">Synchronized Log</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {orders.length === 0 && (
                    <tr><td colSpan={7} className="sd-empty"><p>No synchronized transaction logs recorded.</p></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentTab === 'channels' && (
          <div className="sd-channels">
            {channels.map(chan => {
              const channelStock = catalog.reduce((sum, item) => sum + (item.channels[chan.id] || 0), 0)
              return (
                <div key={chan.id} className="sd-channel-detail">
                  <div className="sd-channel-detail-left">
                    <div className="sd-channel-detail-name">
                      <span className="sd-dot-lg" style={{ backgroundColor: chan.color }} />
                      <h4>{chan.name} Website</h4>
                    </div>
                    <span className="sd-url">{chan.url}</span>
                    <div className="sd-channel-detail-meta">
                      <span>Queries logged: <b>{chan.ordersCount}</b></span>
                      <span>REST API Version: <b>v4.1</b></span>
                      <span>Stock allocated: <b>{channelStock} units</b></span>
                    </div>
                  </div>
                  <div className="sd-channel-detail-right">
                    <span className="sd-badge-online"><span className="sd-ping" /> Online</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <footer className="sd-footer">
        &copy; 2026 DIGI MART X &bull; SECURE ALL-IN-ONE STOCK CENTRAL DESK
      </footer>

    </div>
  )
}
