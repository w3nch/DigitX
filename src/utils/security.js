export function sanitizeInput(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function sanitizeObject(obj) {
  const sanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = typeof value === 'string' ? sanitizeInput(value) : value
  }
  return sanitized
}

export function generateCSRFToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

export function rateLimiter(limit = 5, windowMs = 60000) {
  const hits = new Map()
  return (key) => {
    const now = Date.now()
    const windowStart = now - windowMs
    const valid = []
    const existing = hits.get(key) || []
    for (const time of existing) {
      if (time > windowStart) valid.push(time)
    }
    if (valid.length >= limit) return false
    valid.push(now)
    hits.set(key, valid)
    return true
  }
}
