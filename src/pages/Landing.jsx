import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const LOGOS = {
  Amazon: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  eBay: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
  Shopify: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo.svg',
  Flipkart: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Flipkart_logo_%282026%29.svg',
  Walmart: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg',
  Meesho: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Meesho_logo.png',
}

const platforms = ['Amazon', 'eBay', 'Shopify', 'Flipkart', 'Walmart', 'Meesho']

export default function Landing() {
  const { theme, toggleTheme } = useTheme()
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const handleDemoLogin = async () => {
    setDemoLoading(true)
    const result = await login('demo@digimartx.com', 'demo1234')
    if (result.success) navigate('/dashboard')
    setDemoLoading(false)
  }

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
    <div className="landing">

      <header className="landing-header">
        <div className="landing-header-inner">
          <img src={theme === 'dark' ? '/logo-dark.png' : '/logo.png'} alt="DigiMartX" className="logo-img" />
          <nav className="landing-nav">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#platforms" className="landing-nav-link">Platforms</a>
          </nav>
          <div className="header-right">
            <button className="nav-btn-demo" onClick={handleDemoLogin} disabled={demoLoading}>{demoLoading ? 'Loading...' : 'Demo'}</button>
            <button className="nav-btn-signin" onClick={() => setShowLogin(true)}>Sign in</button>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLogin(false)}>
              <X size={18} />
            </button>
            <div className="modal-header">
              <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>
              <p>{isRegister ? 'Start managing your inventory across all platforms.' : 'Welcome back to your dashboard.'}</p>
            </div>
            <form onSubmit={handleSubmit}>
              {isRegister && (
                <div className="modal-field">
                  <label>Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name" maxLength={100} autoComplete="name" />
                </div>
              )}
              <div className="modal-field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" maxLength={254} autoComplete="email" required />
              </div>
              <div className="modal-field">
                <label>Password</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 4 characters" maxLength={128}
                  autoComplete={isRegister ? 'new-password' : 'current-password'} required />
              </div>
              {error && <div className="modal-error">{error}</div>}
              <button type="submit" className="modal-btn-primary" disabled={loading}>
                {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
              </button>
            </form>
            <p className="modal-toggle">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button className="modal-link" onClick={() => { setIsRegister(!isRegister); setError('') }}>
                {isRegister ? 'Sign In' : 'Register'}
              </button>
            </p>
          </div>
        </div>
      )}

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <h1>
            <span className="hero-tagline">AI-powered selling across every major marketplace.</span>
          </h1>
          <div className="logo-row">
            {platforms.map(name => (
              <img key={name} src={LOGOS[name]} alt={name} className="platform-logo" />
            ))}
          </div>
          <p className="hero-text">
            You are already selling on Amazon, eBay, Shopify, Flipkart, and Meesho.
            That is multiple logins, multiple places to update stock, multiple sets of fees to track.
            DigiMartX brings everything into one dashboard and uses AI to help you sell more
            with less busywork. List once. Manage everywhere. Let the AI figure out the rest.
          </p>
          <div className="hero-actions">
            <button className="btn-hero" onClick={() => setShowLogin(true)}>Start selling smarter</button>
          </div>
        </div>
      </section>

      <section className="ai-section" id="features">
        <div className="ai-section-inner">
          <h2>What AI does for your business</h2>
          <div className="ai-grid">
            <div className="ai-card">
              <span className="ai-number">01</span>
              <h3>Smart restock alerts</h3>
              <p>AI tracks your sales velocity across all platforms and tells you exactly when to reorder. No more stockouts or dead inventory. It learns your sales patterns and adjusts.</p>
            </div>
            <div className="ai-card">
              <span className="ai-number">02</span>
              <h3>Pricing suggestions</h3>
              <p>See which products are underperforming and get pricing recommendations based on market trends. The AI analyzes what similar items sell for and suggests competitive prices.</p>
            </div>
            <div className="ai-card">
              <span className="ai-number">03</span>
              <h3>Platform insights</h3>
              <p>Know which marketplace performs best for each product. The AI identifies where your items move fastest so you can double down on what works and cut what does not.</p>
            </div>
            <div className="ai-card">
              <span className="ai-number">04</span>
              <h3>Demand forecasting</h3>
              <p>Predictive analytics that tell you what to stock up on before the rush hits. The AI spots seasonal trends and buying patterns so you are never caught off guard.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="value-section">
        <div className="value-section-inner">
          <h2>What sellers actually deal with</h2>
          <div className="compare-grid">
            <div className="compare-col without">
              <h3>Without DigiMartX</h3>
              <ul>
                <li>Log into 6 platforms every morning</li>
                <li>Update quantities one by one</li>
                <li>Manually track fees and deductions</li>
                <li>Guess when to restock</li>
                <li>Spreadsheets everywhere</li>
                <li>Find out about stockouts from customer complaints</li>
              </ul>
            </div>
            <div className="compare-divider">
              <span>VS</span>
            </div>
            <div className="compare-col with">
              <h3>With DigiMartX</h3>
              <ul>
                <li>One dashboard for everything</li>
                <li>Update once, syncs everywhere</li>
                <li>AI tracks fees and profit margins</li>
                <li>Smart alerts tell you when to reorder</li>
                <li>No spreadsheets needed</li>
                <li>AI predicts stockouts before they happen</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="platform-breakdown" id="platforms">
        <div className="platform-breakdown-inner">
          <h2>Every platform has its quirks. We track them.</h2>
          <div className="breakdown-grid">
            <div className="breakdown-card">
              <div className="breakdown-header" style={{ borderColor: '#FF9900' }}>
                <img src={LOGOS.Amazon} alt="Amazon" />
              </div>
              <p>The biggest marketplace, but FBA fees keep changing and stranded inventory is a real problem. DigiMartX tracks your Amazon costs so you know your actual profit.</p>
            </div>
            <div className="breakdown-card">
              <div className="breakdown-header" style={{ borderColor: '#0064D2' }}>
                <img src={LOGOS.eBay} alt="ebay" />
              </div>
              <p>eBay Best Match can bury your listings if you are not careful. We help you track visibility and adjust pricing so your items actually get seen.</p>
            </div>
            <div className="breakdown-card">
              <div className="breakdown-header" style={{ borderColor: '#96BF48' }}>
                <img src={LOGOS.Shopify} alt="Shopify" />
              </div>
              <p>Your own store is great but transaction fees and app costs add up fast. DigiMartX gives you a clear picture of what you are actually making.</p>
            </div>
            <div className="breakdown-card">
              <div className="breakdown-header" style={{ borderColor: '#2874F0' }}>
                <img src={LOGOS.Flipkart} alt="Flipkart" />
              </div>
              <p>Flipkart marketplace has huge reach in India, but seller policies keep shifting. We help you stay on top of fees, returns, and what is actually selling.</p>
            </div>
            <div className="breakdown-card">
              <div className="breakdown-header" style={{ borderColor: '#0071CE' }}>
                <img src={LOGOS.Walmart} alt="Walmart" />
              </div>
              <p>Walmart margins are tight but the traffic is undeniable. Our AI helps you price competitively without selling at a loss.</p>
            </div>
            <div className="breakdown-card">
              <div className="breakdown-header" style={{ borderColor: '#E91E63' }}>
                <img src={LOGOS.Meesho} alt="Meesho" />
              </div>
              <p>Meesho is growing fast for Indian sellers, but margins are thin and competition is intense. We track your costs so you know which products are actually worth listing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to simplify your business?</h2>
        <p>No credit card. No commitment. Just a working demo.</p>
        <button className="btn-hero" onClick={() => setShowLogin(true)}>Try DigiMartX free</button>
      </section>

      <footer className="landing-footer">
        <span>DigiMartX &middot; built for sellers who sell across platforms</span>
        <span className="footer-credits">No affiliation with Amazon, eBay, Shopify, Flipkart, Walmart, or Meesho. Just a tool that works with all of them.</span>
      </footer>

    </div>
  )
}
