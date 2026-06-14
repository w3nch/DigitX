import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../App.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fn = isRegister ? register : login
    const params = isRegister ? [form.email, form.password, form.name] : [form.email, form.password]
    const result = await fn(...params)
    if (result.success) navigate('/dashboard')
    else setError(result.error)
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-header">
          <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>
          <p>{isRegister ? 'Start managing your inventory across all platforms.' : 'Welcome back to your dashboard.'}</p>
        </div>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="field">
              <label>Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Your name" maxLength={100} autoComplete="name" />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" maxLength={254} autoComplete="email" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Min 4 characters" maxLength={128}
              autoComplete={isRegister ? 'new-password' : 'current-password'} required />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        <p className="toggle-auth">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button className="link-btn" onClick={() => { setIsRegister(!isRegister); setError('') }}>
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </p>
        <p className="back-link">
          <Link to="/">&larr; Back to home</Link>
        </p>
      </div>
    </div>
  )
}
