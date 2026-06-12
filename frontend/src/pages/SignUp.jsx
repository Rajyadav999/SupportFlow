import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Headphones, User, Mail, Lock, RefreshCw, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  function validate() {
    const e = {}
    if (!form.name.trim()) {
      e.name = 'Full name is required'
    } else if (form.name.trim().length < 2) {
      e.name = 'Name must be at least 2 characters'
    }

    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Please enter a valid email address'
    }

    if (!form.password) {
      e.password = 'Password is required'
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters'
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const res = await signUp(form.name, form.email, form.password)
    setLoading(false)

    if (res && res.success) {
      toast.success(res.message)
      // Redirect to Verify OTP screen, sending the email and test OTP in state
      navigate('/verify-otp', { 
        state: { 
          email: form.email, 
          test_otp: res.test_otp 
        } 
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaff] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-brand-100">
      
      {/* Brand Header link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-xl tracking-tight text-slate-800">
          <Headphones size={24} className="text-brand-500 animate-pulse" />
          <span>SupportDesk</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Agent Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 transition">
            Log In here
          </Link>
        </p>
      </div>

      {/* SignUp card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card bg-white py-8 px-4 shadow-xl border-slate-100 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  disabled={loading}
                  className={`input pl-10 ${errors.name ? 'border-red-500 focus:ring-red-400/20' : ''}`}
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  className={`input pl-10 ${errors.email ? 'border-red-500 focus:ring-red-400/20' : ''}`}
                  placeholder="rahul@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  disabled={loading}
                  className={`input pl-10 ${errors.password ? 'border-red-500 focus:ring-red-400/20' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange('password')}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.password}</p>}
            </div>

            {/* Register button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 font-bold"
              >
                {loading ? <RefreshCw size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  )
}
