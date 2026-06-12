import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  MessageSquare, 
  RefreshCw, 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Send,
  CheckCircle,
  FileText
} from 'lucide-react'
import { ticketsApi } from '../api/tickets'
import { StatusBadge, PriorityBadge } from '../components/StatusBadge'
import toast from 'react-hot-toast'

const STATUSES = ['Open', 'In Progress', 'Closed']

function formatDateTime(ts) {
  if (!ts) return '—';
  // Parse standard ISO-8601 strings returned by SQLAlchemy
  return new Date(ts).toLocaleString('en-IN', {
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  })
}

export default function TicketDetail() {
  const { ticketId } = useParams()
  const [ticket, setTicket]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [newNote, setNewNote]   = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [saving, setSaving]     = useState(false)

  async function fetchTicket() {
    setLoading(true)
    try {
      const res = await ticketsApi.get(ticketId)
      setTicket(res.data)
      setNewStatus(res.data.status)
    } catch (err) {
      toast.error('Ticket not found or network error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchTicket() 
  }, [ticketId])

  async function handleUpdate() {
    // Determine changes to avoid redundant operations
    const payload = {}
    if (newStatus !== ticket.status) payload.status = newStatus
    if (newNote.trim())              payload.note   = newNote.trim()

    if (!Object.keys(payload).length) {
      toast('No updates specified', { icon: 'ℹ️' })
      return
    }

    setSaving(true)
    try {
      await ticketsApi.update(ticketId, payload)
      toast.success('Ticket updated successfully')
      setNewNote('')
      
      // Reload ticket details to display updated status and notes list
      const res = await ticketsApi.get(ticketId)
      setTicket(res.data)
      setNewStatus(res.data.status)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update ticket')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3 py-36 text-gray-400">
      <RefreshCw size={24} className="animate-spin text-brand-500" />
      <span className="text-sm font-medium">Loading ticket details...</span>
    </div>
  )

  if (!ticket) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-full inline-block mb-4">
        <FileText size={32} className="text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ticket Not Found</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
        We couldn't retrieve the ticket you requested. It may have been deleted or the ID is incorrect.
      </p>
      <div className="mt-6">
        <Link to="/dashboard" className="btn-primary inline-flex">
          <ArrowLeft size={16} />
          Go back to dashboard
        </Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* ── BACK NAVIGATION ────────────────────────────────────── */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition"
      >
        <ArrowLeft size={15} /> 
        Back to Dashboard
      </Link>

      {/* ── DETAILS MAIN CARD ──────────────────────────────────── */}
      <div className="card p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1.5 rounded-xl border border-brand-100 dark:border-brand-900/40 shadow-sm">
              {ticket.ticket_id}
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight pt-1.5">
              {ticket.subject}
            </h1>
          </div>
          <div className="flex gap-2 shrink-0">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4.5 rounded-control bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
          <InfoItem icon={User}     label="Customer Name"  value={ticket.customer_name} />
          <InfoItem icon={Mail}     label="Email Address"  value={ticket.customer_email} />
          <InfoItem icon={Calendar} label="Date Raised"   value={formatDateTime(ticket.created_at)} />
          <InfoItem icon={Clock}    label="Last Updated"   value={formatDateTime(ticket.updated_at)} />
        </div>

        {/* Ticket Description */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Issue Description
          </h3>
          <div className="bg-gray-50/50 dark:bg-gray-800/40 p-4.5 rounded-control border border-gray-100 dark:border-gray-700/60">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── UPDATE STATUS & NOTE WIDGET ────────────────────────── */}
      <div className="card p-6 md:p-8 space-y-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
          <CheckCircle size={18} className="text-brand-500" />
          Update Ticket State
        </h2>

        {/* Status toggles */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Set Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(s => {
              const selected = newStatus === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewStatus(s)}
                  className={`px-4.5 py-2.5 rounded-control text-sm font-semibold border transition duration-150 active:scale-[0.98] ${
                    selected
                      ? s === 'Open'
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/10'
                        : s === 'In Progress'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-green-500 text-white border-green-500 shadow-md shadow-green-500/10'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-400'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        {/* Comment Text Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Add a Comment / Progress Note
          </label>
          <textarea
            rows={4}
            className="input resize-none"
            placeholder="Add update comments, internal details, actions taken, or replies to the client..."
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
          />
        </div>

        {/* Submit triggers */}
        <div className="flex justify-end pt-1">
          <button 
            onClick={handleUpdate} 
            disabled={saving} 
            className="btn-primary px-5"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
            {saving ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── ACTIVITY TIMELINE (Notes history) ──────────────────── */}
      <div className="card p-6 md:p-8 space-y-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
          <MessageSquare size={18} className="text-brand-500" />
          Activity Log ({ticket.notes.length})
        </h2>
        
        {ticket.notes.length === 0 ? (
          
          /* No notes state */
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <p className="text-sm">No comments have been added to this ticket yet.</p>
            <p className="text-xs mt-1">Use the update form above to log progress comments.</p>
          </div>
          
        ) : (
          
          /* Timeline vertical rendering */
          <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4.5 space-y-6 pb-2 pl-6">
            
            {ticket.notes.map((note) => (
              <div key={note.id} className="relative group">
                
                {/* Timeline node circle indicator */}
                <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-brand-500 dark:bg-brand-600 border-4 border-white dark:border-gray-800 shadow-sm transition group-hover:scale-110" />

                {/* Comment box card */}
                <div className="bg-gray-50 dark:bg-gray-900/40 p-4.5 rounded-control border border-gray-200 dark:border-gray-700/60 shadow-sm">
                  
                  {/* Top metadata panel */}
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-2 pb-1.5 border-b border-gray-100 dark:border-gray-700/30">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5.5 h-5.5 bg-brand-100 dark:bg-brand-950/40 rounded-full flex items-center justify-center font-bold text-[10px] text-brand-700 dark:text-brand-400">
                        AG
                      </div>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-300">Agent Update</span>
                    </div>
                    
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {formatDateTime(note.created_at)}
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {note.note_text}
                  </p>

                </div>
              </div>
            ))}
            
          </div>
        )}
      </div>

    </div>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
        <Icon size={13} className="shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs font-semibold text-gray-800 dark:text-gray-300 truncate">
        {value}
      </p>
    </div>
  )
}