import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Headphones, Mail, Lock, RefreshCw, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) {
      setError('Please provide email and password')
      return
    }
    setError('')
    setLoading(true)

    const success = await login(form.email.trim(), form.password)
    setLoading(false)

    if (success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaff] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-brand-100">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-xl tracking-tight text-slate-800">
          <Headphones size={24} className="text-brand-500 animate-pulse" />
          <span>SupportDesk</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to SupportDesk
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Enter agent credentials to access the ticketing dashboard.
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card bg-white py-8 px-4 shadow-xl border-slate-100 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-control font-semibold">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  className="input pl-10"
                  placeholder="agent@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  disabled={loading}
                  className="input pl-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange('password')}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 font-bold"
              >
                {loading ? <RefreshCw size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                {loading ? 'Signing In...' : 'Log In'}
              </button>
            </div>

          </form>

          {/* Registration Redirect Footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              New to SupportDesk?{' '}
              <Link to="/signup" className="font-bold text-brand-600 hover:text-brand-700 transition">
                Create agent account
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
