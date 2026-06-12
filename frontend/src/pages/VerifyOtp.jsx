import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Headphones, Mail, Key, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyOtp } = useAuth()
  
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [testOtp, setTestOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Attempt to parse state parameters passed during successful signup
    if (location.state) {
      if (location.state.email) {
        setEmail(location.state.email)
      }
      if (location.state.test_otp) {
        setTestOtp(location.state.test_otp)
      }
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP code')
      return
    }
    setError('')
    setLoading(true)

    const success = await verifyOtp(email.trim(), otpCode.trim())
    setLoading(false)

    if (success) {
      navigate('/login')
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
          Verify Agent Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          We have generated an OTP for your safety.
        </p>
      </div>

      {/* Verify OTP Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card bg-white py-8 px-4 shadow-xl border-slate-100 sm:px-10 space-y-6">
          
          {/* Test OTP Sandbox Alert */}
          {testOtp && (
            <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-container text-emerald-800 text-sm flex flex-col gap-1.5 shadow-sm">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Sandbox Test Mode</span>
              </div>
              <p className="text-emerald-700 leading-relaxed">
                Your sign-up OTP was generated successfully:
              </p>
              <div className="mt-1 font-mono font-bold text-lg tracking-wider text-emerald-950 bg-emerald-100/60 rounded-control py-1 px-3 w-fit">
                {testOtp}
              </div>
            </div>
          )}

          {!testOtp && (
            <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-container text-amber-800 text-sm flex flex-col gap-1 shadow-sm">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck size={16} className="text-amber-600" />
                <span>Verification OTP</span>
              </div>
              <p className="text-amber-700 leading-relaxed">
                Please check the terminal / backend server logs for the 6-digit OTP code.
              </p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  disabled={loading || !!(location.state && location.state.email)}
                  className="input pl-10 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100"
                  placeholder="agent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* OTP Code Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">6-Digit Verification Code</label>
              <div className="relative">
                <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  disabled={loading}
                  maxLength={6}
                  className={`input pl-10 tracking-widest text-center font-mono font-bold text-base ${
                    error ? 'border-red-500 focus:ring-red-400/20' : ''
                  }`}
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    if (val.length <= 6) {
                      setOtpCode(val)
                    }
                  }}
                />
              </div>
              {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 font-bold"
              >
                {loading ? <RefreshCw size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                {loading ? 'Verifying Account...' : 'Verify & Continue'}
              </button>
            </div>

          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link to="/signup" className="text-sm text-slate-400 hover:text-slate-600 transition">
              ← Back to Sign Up
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}
