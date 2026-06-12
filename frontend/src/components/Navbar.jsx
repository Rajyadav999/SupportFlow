import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, Headphones } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        pathname === to
          ? 'bg-brand-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={16} />
      {label}
    </Link>
  )

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <Headphones size={20} className="text-brand-500" />
          <span>SupportDesk</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLink('/', 'Dashboard', LayoutDashboard)}
          {navLink('/tickets/new', 'New Ticket', PlusCircle)}
        </nav>
      </div>
    </header>
  )
}