import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { validateEmail, validatePassword } from '../utils/validation'
import { rateLimiter } from '../utils/security'

const AuthContext = createContext(null)

const DEMO_CREDENTIALS = {
  email: 'demo@digimartx.com',
  password: 'demo1234'
}

const loginLimiter = rateLimiter(5, 60000)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('digimartx_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const cleanedEmail = email.trim().toLowerCase()

    if (!loginLimiter(cleanedEmail)) {
      return { success: false, error: 'Too many attempts. Try again in 60 seconds.' }
    }

    if (!validateEmail(cleanedEmail)) {
      return { success: false, error: 'Invalid email format.' }
    }
    if (!validatePassword(password)) {
      return { success: false, error: 'Password must be 4-128 characters.' }
    }

    const isDemo = cleanedEmail === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password

    if (isDemo || (password.length >= 4)) {
      const userData = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
        email: cleanedEmail,
        name: cleanedEmail.split('@')[0],
        isDemo
      }
      setUser(userData)
      localStorage.setItem('digimartx_user', JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, error: 'Invalid credentials.' }
  }, [])

  const register = useCallback(async (email, password, name) => {
    const cleanedEmail = email.trim().toLowerCase()

    if (!validateEmail(cleanedEmail)) {
      return { success: false, error: 'Invalid email format.' }
    }
    if (!validatePassword(password)) {
      return { success: false, error: 'Password must be 4-128 characters.' }
    }
    if (!name || name.trim().length < 1) {
      return { success: false, error: 'Name is required.' }
    }

    const userData = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
      email: cleanedEmail,
      name: name.trim(),
      isDemo: false
    }
    setUser(userData)
    localStorage.setItem('digimartx_user', JSON.stringify(userData))
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('digimartx_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
