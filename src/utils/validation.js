import { sanitizeInput } from './security'

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false
  const cleaned = sanitizeInput(email.trim())
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) && cleaned.length <= 254
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return false
  return password.length >= 4 && password.length <= 128
}

export function validateProductName(name) {
  if (!name || typeof name !== 'string') return false
  const cleaned = sanitizeInput(name.trim())
  return cleaned.length >= 1 && cleaned.length <= 200
}

export function validatePrice(price) {
  const num = parseFloat(price)
  return !isNaN(num) && num >= 0 && num <= 999999.99
}

export function validateQuantity(qty) {
  const num = parseInt(qty, 10)
  return !isNaN(num) && num >= 0 && num <= 999999
}
