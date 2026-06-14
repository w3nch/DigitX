import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import '../App.css'

export default function Inventory() {
  const { products, addProduct, updateProduct, deleteProduct, PLATFORMS } = useInventory()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', quantity: '', sku: '', platforms: {} })
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const resetForm = () => {
    setForm({ name: '', price: '', quantity: '', sku: '', platforms: {} })
    setError('')
    setEditingId(null)
    setShowForm(false)
  }

  const openEdit = (p) => {
    setForm({
      name: p.name,
      price: String(p.price),
      quantity: String(p.quantity),
      sku: p.sku,
      platforms: { ...p.platforms }
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const togglePlatform = (name) => {
    setForm(prev => ({
      ...prev,
      platforms: { ...prev.platforms, [name]: !prev.platforms[name] }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const platforms = PLATFORMS.reduce((acc, p) => {
      acc[p] = form.platforms[p] || false
      return acc
    }, {})

    if (editingId) {
      const result = updateProduct(editingId, {
        name: form.name,
        price: form.price,
        quantity: form.quantity,
        platforms
      })
      if (!result.success) { setError(result.error); return }
    } else {
      const result = addProduct({
        name: form.name,
        price: form.price,
        quantity: form.quantity,
        sku: form.sku,
        platforms
      })
      if (!result.success) { setError(result.error); return }
    }
    resetForm()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h2>Inventory</h2>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true) }}>
          + Add Product
        </button>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Search products or SKU..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        maxLength={200}
      />

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="form-row">
            <div className="field">
              <label>Product Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} maxLength={200} required />
            </div>
            <div className="field">
              <label>Price ($)</label>
              <input type="number" step="0.01" min="0" max="999999.99" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="field">
              <label>Quantity</label>
              <input type="number" min="0" max="999999" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div className="field">
              <label>SKU</label>
              <input type="text" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} maxLength={50} placeholder="Auto-generated if empty" />
            </div>
          </div>
          <div className="platform-toggles">
            <label>List on platforms:</label>
            <div className="toggle-group">
              {PLATFORMS.map(p => (
                <label key={p} className={`toggle-chip ${form.platforms[p] ? 'active' : ''}`}>
                  <input type="checkbox" checked={form.platforms[p] || false} onChange={() => togglePlatform(p)} />
                  {p}
                </label>
              ))}
            </div>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add Product'}</button>
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="products-table">
        <div className="table-header">
          <span>Product</span>
          <span>SKU</span>
          <span>Price</span>
          <span>Qty</span>
          <span>Platforms</span>
          <span>Actions</span>
        </div>
        {filtered.length === 0 && <div className="empty-state">No products found.</div>}
        {filtered.map(p => (
          <div key={p.id} className="table-row">
            <span className="product-name">{p.name}</span>
            <span className="product-sku">{p.sku}</span>
            <span>${p.price.toFixed(2)}</span>
            <span className={p.quantity <= 20 ? 'low-stock' : ''}>{p.quantity}</span>
            <span className="platform-badges">
              {PLATFORMS.filter(pl => p.platforms[pl]).map(pl => (
                <span key={pl} className="badge">{pl}</span>
              ))}
            </span>
            <span className="actions">
              <button className="btn-small" onClick={() => openEdit(p)}>Edit</button>
              <button className="btn-small btn-danger" onClick={() => deleteProduct(p.id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
