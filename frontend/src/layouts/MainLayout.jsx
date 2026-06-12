import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  PlusCircle, 
  Headphones, 
  Moon, 
  Sun, 
  Menu, 
  X,
  ShieldCheck,
  LogOut
} from 'lucide-react'
import { useDarkMode } from '../context/DarkModeContext'
import { useAuth } from '../context/AuthContext'

export default function MainLayout({ children }) {
  const { pathname } = useLocation()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { logout, user } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // List of public routes that should render standalone (without agent sidebar/header)
  const publicRoutes = ['/', '/login', '/signup', '/verify-otp', '/tickets/new']
  const isPublicRoute = publicRoutes.includes(pathname)

  if (isPublicRoute) {
    return <>{children}</>
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tickets/new', label: 'New Ticket', icon: PlusCircle },
  ]

  const isActive = (path) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(path)
  }

  const handleLinkClick = () => {
    setMobileSidebarOpen(false)
  }

  const getInitials = (name) => {
    if (!name) return 'AG'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0].substring(0, 2).toUpperCase()
  }

  const agentName = user?.name || 'Support Agent'
  const agentInitials = getInitials(agentName)
  const agentEmail = user?.email || 'agent@supportdesk.crm'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex transition-colors duration-200">
      
      {/* ── SIDEBAR (Desktop) ────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700 gap-2">
          <Headphones size={22} className="text-brand-500 animate-pulse" />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
            SupportDesk
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navLinks.map((link) => {
            const Active = isActive(link.to)
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-sidebar-item text-sm font-medium transition-all ${
                  Active
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          
          {/* Dark Mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-control text-xs font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
          >
            <span className="flex items-center gap-2">
              {darkMode ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} />}
              {darkMode ? 'Light Theme' : 'Dark Theme'}
            </span>
            <span className="text-[10px] uppercase font-semibold text-gray-400">
              {darkMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Log Out Action */}
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-control text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition text-left"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-1 text-xs text-gray-400">
            <ShieldCheck size={14} className="text-brand-500" />
            <span>Agent Console v1.0</span>
          </div>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ──────────────────────────── */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 md:hidden flex flex-col ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Headphones size={22} className="text-brand-500" />
            <span className="font-bold text-lg text-gray-900 dark:text-white">SupportDesk</span>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navLinks.map((link) => {
            const Active = isActive(link.to)
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-sidebar-item text-sm font-medium transition-all ${
                  Active
                    ? 'bg-brand-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          {/* Dark Mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left text-gray-700 dark:text-gray-300"
          >
            <span className="flex items-center gap-2">
              {darkMode ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {/* Log Out Action */}
          <button
            onClick={() => {
              setMobileSidebarOpen(false)
              logout()
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition text-left"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTAINER ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
            >
              <Menu size={20} />
            </button>
            
            {/* Page Header title */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">CRM Console</span>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
                {pathname === '/dashboard' ? 'dashboard' : pathname.split('/')[1]}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick action for desktop */}
            {pathname !== '/tickets/new' && (
              <Link 
                to="/tickets/new" 
                className="hidden sm:inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4.5 py-2 rounded-control transition duration-150 shadow-md shadow-brand-500/10"
              >
                <PlusCircle size={14} />
                Create Ticket
              </Link>
            )}
            
            {/* Profile Avatar widget */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center font-bold text-xs text-brand-700 dark:text-brand-300">
                {agentInitials}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{agentName}</p>
                <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{agentEmail}</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
          {children}
        </main>
      </div>

    </div>
  )
}
