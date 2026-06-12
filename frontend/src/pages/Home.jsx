import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  RefreshCw, 
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox,
  PlusCircle
} from 'lucide-react'
import { ticketsApi } from '../api/tickets'
import { StatusBadge, PriorityBadge } from '../components/StatusBadge'
import StatsBar from '../components/StatsBar'
import { exportToCSV } from '../utils/csvExport'
import toast from 'react-hot-toast'

const STATUSES  = ['All', 'Open', 'In Progress', 'Closed']
const PRIORITIES = ['All', 'High', 'Medium', 'Low']

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric', 
    month: 'short', 
    year: 'numeric'
  })
}

export default function Home() {
  const [tickets, setTickets]     = useState([])
  const [stats, setStats]         = useState(null)
  const [search, setSearch]       = useState('')
  const [status, setStatus]       = useState('All')
  const [priority, setPriority]   = useState('All')
  const [loading, setLoading]     = useState(true)
  
  // Sorting & Pagination States
  const [sortOrder, setSortOrder] = useState('desc') // desc | asc
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6 // Number of tickets to render per page

  // Fetch tickets and statistics counts
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (search.trim())            params.search   = search.trim()
      if (status !== 'All')         params.status   = status
      if (priority !== 'All')       params.priority = priority

      const [ticketsRes, statsRes] = await Promise.all([
        ticketsApi.list(params),
        ticketsApi.stats(),
      ])
      
      setTickets(ticketsRes.data)
      setStats(statsRes.data)
    } catch (err) {
      toast.error('Failed to load tickets. Please check server connection.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, status, priority])

  // Debounce search input changes
  useEffect(() => {
    const timer = setTimeout(fetchData, 300)
    return () => clearTimeout(timer)
  }, [fetchData])

  // Reset pagination page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, status, priority])

  // Sort tickets in memory based on sortOrder
  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime()
      const timeB = new Date(b.created_at).getTime()
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA
    })
  }, [tickets, sortOrder])

  // Paginated Slice
  const totalPages = Math.ceil(sortedTickets.length / pageSize)
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedTickets.slice(start, start + pageSize)
  }, [sortedTickets, currentPage, pageSize])

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
    toast.success(`Sorted by date: ${sortOrder === 'desc' ? 'oldest first' : 'newest first'}`)
  }

  const handleExport = () => {
    if (tickets.length === 0) {
      toast.error('No tickets found to export')
      return
    }
    exportToCSV(sortedTickets, `crm_tickets_${new Date().toISOString().split('T')[0]}.csv`)
    toast.success('CSV export downloaded')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      
      {/* ── HEADER TITLE ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Support Tickets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track, manage, and resolve customer support queries in real time.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchData} 
            className="btn-secondary"
            title="Refresh tickets list"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button 
            onClick={handleExport} 
            className="btn-secondary flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            title="Export filtered tickets to CSV"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards grid */}
      <StatsBar stats={stats} />

      {/* ── FILTER & TOOLBAR CARD ──────────────────────────────── */}
      <div className="card !rounded-control p-5 space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 justify-between">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              className="input pl-10"
              placeholder="Search by ID (e.g. TKT-001), customer name, email, subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
            {/* Status filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <SlidersHorizontal size={12} />
                Status
              </span>
              <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-control">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1.5 rounded-small text-xs font-semibold transition-all ${
                      status === s
                        ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Priority
              </span>
              <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-control">
                {PRIORITIES.map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1.5 rounded-small text-xs font-semibold transition-all ${
                      priority === p
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── TICKETS TABLE & GRID CARD ──────────────────────────── */}
      <div className="card overflow-hidden">
        
        {/* Table header (Desktop only) */}
        <div className="hidden md:grid grid-cols-[120px_1fr_200px_130px_110px_40px] gap-4 px-6 py-3.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider items-center">
          <span>Ticket ID</span>
          <span>Subject & Customer</span>
          <span>Email</span>
          <span>Status</span>
          
          {/* Sorting Trigger Column header */}
          <button 
            onClick={toggleSort}
            className="flex items-center gap-1.5 hover:text-brand-500 transition font-bold text-left"
          >
            Created At
            {sortOrder === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
          </button>
          <span></span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
            <RefreshCw size={24} className="animate-spin text-brand-500" />
            <span className="text-sm font-medium">Fetching support tickets...</span>
          </div>
        ) : paginatedTickets.length === 0 ? (
          
          /* Empty state */
          <div className="py-20 text-center px-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-full inline-block mb-4">
              <Inbox size={32} className="text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">No Tickets Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
              There are no support tickets matching your current search filters. Create a new support ticket to get started.
            </p>
            <div className="mt-5">
              <Link to="/tickets/new" className="btn-primary inline-flex items-center gap-2">
                <PlusCircle size={15} />
                Create New Ticket
              </Link>
            </div>
          </div>
          
        ) : (
          
          /* Table Lists rendering */
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedTickets.map((ticket) => (
              <Link
                key={ticket.ticket_id}
                to={`/tickets/${ticket.ticket_id}`}
                className="grid grid-cols-1 md:grid-cols-[120px_1fr_200px_130px_110px_40px] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition duration-150 group"
              >
                {/* ID */}
                <div className="flex justify-between items-center md:block">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-lg">
                    {ticket.ticket_id}
                  </span>
                  
                  {/* Priority Badge on mobile */}
                  <span className="md:hidden">
                    <PriorityBadge priority={ticket.priority} />
                  </span>
                </div>

                {/* Subject & Name */}
                <div className="min-w-0 pr-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                    Raised by <span className="font-medium text-gray-600 dark:text-gray-400">{ticket.customer_name}</span>
                  </p>
                </div>

                {/* Email (hidden on mobile) */}
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate hidden md:block">
                  {ticket.customer_email}
                </span>

                {/* Status and Priority Badges */}
                <div className="flex items-center gap-2 md:block">
                  <StatusBadge status={ticket.status} />
                  <span className="hidden md:inline-block ml-2 align-middle">
                    <PriorityBadge priority={ticket.priority} />
                  </span>
                </div>

                {/* Created Date */}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(ticket.created_at)}
                </span>

                {/* Action Arrow (hidden on mobile) */}
                <div className="justify-self-end text-gray-300 dark:text-gray-600 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition hidden md:block">
                  <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

      {/* ── PAGINATION CONTROLS BAR ────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Showing <span className="text-gray-900 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="text-gray-900 dark:text-white">
              {Math.min(currentPage * pageSize, tickets.length)}
            </span>{' '}
            of <span className="text-gray-900 dark:text-white">{tickets.length}</span> tickets
          </p>
          
          <div className="flex items-center gap-1.5">
            {/* Previous Page */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-secondary px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => {
              const p = index + 1
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                    currentPage === p
                      ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/10'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            
            {/* Next Page */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-secondary px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Result stats summary */}
      {!loading && tickets.length > 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
          {tickets.length} matching record{tickets.length !== 1 ? 's' : ''} found.
        </p>
      )}

    </div>
  )
}