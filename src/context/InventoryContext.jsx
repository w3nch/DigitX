import { createContext, useContext, useState, useCallback } from 'react'
import { validateProductName, validatePrice, validateQuantity } from '../utils/validation'
import { sanitizeObject } from '../utils/security'

const InventoryContext = createContext(null)

const PLATFORMS = ['Amazon', 'eBay', 'Shopify', 'Etsy', 'Walmart']

const defaultProducts = [
  { id: '1', name: 'Wireless Bluetooth Headphones', price: 49.99, quantity: 150, sku: 'WBH-001', platforms: { Amazon: true, eBay: true, Shopify: true, Etsy: false, Walmart: true } },
  { id: '2', name: 'Smart Water Bottle 32oz', price: 24.99, quantity: 200, sku: 'SWB-002', platforms: { Amazon: true, eBay: true, Shopify: true, Etsy: true, Walmart: false } },
  { id: '3', name: 'Organic Cotton T-Shirt (Unisex)', price: 19.99, quantity: 300, sku: 'OCT-003', platforms: { Amazon: true, eBay: false, Shopify: true, Etsy: true, Walmart: true } },
  { id: '4', name: 'Mini Portable Projector', price: 89.99, quantity: 75, sku: 'MPP-004', platforms: { Amazon: true, eBay: true, Shopify: false, Etsy: false, Walmart: true } },
  { id: '5', name: 'Bamboo Phone Stand', price: 12.99, quantity: 500, sku: 'BPS-005', platforms: { Amazon: true, eBay: true, Shopify: true, Etsy: true, Walmart: true } },
  { id: '6', name: 'LED Desk Lamp Wireless Charger', price: 39.99, quantity: 120, sku: 'LDL-006', platforms: { Amazon: false, eBay: true, Shopify: true, Etsy: false, Walmart: false } },
  { id: '7', name: 'Yoga Mat Premium Non-Slip', price: 34.99, quantity: 180, sku: 'YMP-007', platforms: { Amazon: true, eBay: false, Shopify: true, Etsy: true, Walmart: false } },
  { id: '8', name: 'Mechanical Keyboard RGB', price: 79.99, quantity: 90, sku: 'MKR-008', platforms: { Amazon: true, eBay: true, Shopify: true, Etsy: false, Walmart: true } },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('digimartx_inventory')
    if (stored) {
      try { return JSON.parse(stored) } catch {}
    }
    return defaultProducts
  })

  const save = (items) => {
    setProducts(items)
    localStorage.setItem('digimartx_inventory', JSON.stringify(items))
  }

  const addProduct = useCallback((data) => {
    if (!validateProductName(data.name)) return { success: false, error: 'Invalid product name (1-200 chars).' }
    if (!validatePrice(data.price)) return { success: false, error: 'Invalid price (0-999999.99).' }
    if (!validateQuantity(data.quantity)) return { success: false, error: 'Invalid quantity (0-999999).' }

    const sanitized = sanitizeObject(data)
    const newProduct = {
      id: generateId(),
      name: sanitized.name,
      price: parseFloat(sanitized.price),
      quantity: parseInt(sanitized.quantity, 10),
      sku: sanitized.sku || `SKU-${generateId().toUpperCase()}`,
      platforms: sanitized.platforms || PLATFORMS.reduce((acc, p) => ({ ...acc, [p]: false }), {})
    }
    save([...products, newProduct])
    return { success: true }
  }, [products])

  const updateProduct = useCallback((id, data) => {
    const idx = products.findIndex(p => p.id === id)
    if (idx === -1) return { success: false, error: 'Product not found.' }

    const updated = [...products]
    if (data.name !== undefined) {
      if (!validateProductName(data.name)) return { success: false, error: 'Invalid product name.' }
      updated[idx] = { ...updated[idx], name: sanitizeInput(data.name) }
    }
    if (data.price !== undefined) {
      if (!validatePrice(data.price)) return { success: false, error: 'Invalid price.' }
      updated[idx] = { ...updated[idx], price: parseFloat(data.price) }
    }
    if (data.quantity !== undefined) {
      if (!validateQuantity(data.quantity)) return { success: false, error: 'Invalid quantity.' }
      updated[idx] = { ...updated[idx], quantity: parseInt(data.quantity, 10) }
    }
    if (data.platforms !== undefined) {
      updated[idx] = { ...updated[idx], platforms: data.platforms }
    }
    save(updated)
    return { success: true }
  }, [products])

  const deleteProduct = useCallback((id) => {
    save(products.filter(p => p.id !== id))
    return { success: true }
  }, [products])

  const getProductsByPlatform = useCallback((platform) => {
    return products.filter(p => p.platforms[platform])
  }, [products])

  const getPlatformStats = useCallback(() => {
    return PLATFORMS.map(p => ({
      name: p,
      count: products.filter(prod => prod.platforms[p]).length,
      totalValue: products
        .filter(prod => prod.platforms[p])
        .reduce((sum, prod) => sum + (prod.price * prod.quantity), 0)
    }))
  }, [products])

  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 20).length

  return (
    <InventoryContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      getProductsByPlatform, getPlatformStats,
      totalProducts, totalValue, lowStock, PLATFORMS
    }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be inside InventoryProvider')
  return ctx
}
