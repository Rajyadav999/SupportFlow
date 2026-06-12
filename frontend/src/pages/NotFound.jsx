import { Link } from 'react-router-dom'
import { AlertTriangle, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-yellow-50 dark:bg-yellow-950/40 p-4 rounded-full mb-6">
        <AlertTriangle className="text-yellow-500 w-12 h-12 animate-bounce" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
        404 - Page Not Found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md text-sm leading-relaxed">
        The page you are looking for does not exist, has been removed, or is temporarily unavailable. Double check the address and try again.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/10 transition-all"
      >
        <Home size={16} />
        Back to Dashboard
      </Link>
    </div>
  )
}
