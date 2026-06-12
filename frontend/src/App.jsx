import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { RefreshCw } from 'lucide-react'

import Home from './pages/Home'
import CreateTicket from './pages/CreateTicket'
import TicketDetail from './pages/TicketDetail'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import VerifyOtp from './pages/VerifyOtp'

import MainLayout from './layouts/MainLayout'
import { DarkModeProvider } from './context/DarkModeContext'
import { AuthProvider, useAuth } from './context/AuthContext'

// Route Guard for authenticated paths
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-brand-500" size={28} />
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Loading Session...</span>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Route Guard for auth/public page paths (guest only)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-brand-500" size={28} />
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Loading Session...</span>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { 
                fontSize: '14px', 
                borderRadius: '12px',
                background: '#1f2937',
                color: '#ffffff'
              }
            }}
          />
          <MainLayout>
            <Routes>
              {/* Public SaaS Landing Page */}
              <Route path="/" element={<Landing />} />

              {/* Public/Guest Authentication Routes */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
              <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />

              {/* Public Support Submission Route */}
              <Route path="/tickets/new" element={<CreateTicket />} />

              {/* Protected Internal Agent Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/tickets/:ticketId" element={<PrivateRoute><TicketDetail /></PrivateRoute>} />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </DarkModeProvider>
  )
}