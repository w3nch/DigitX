import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import SellerDashboard from './pages/SellerDashboard'
import './App.css'

function DashboardWrapper() {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return <SellerDashboard user={user} />
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/inventory" element={<Navigate to="/dashboard" replace />} />
            <Route path="/platforms" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
