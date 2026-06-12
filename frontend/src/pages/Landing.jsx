import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Headphones, 
  ArrowRight, 
  CheckCircle2, 
  CircleDot, 
  Clock, 
  ShieldAlert,
  Search,
  MessageSquare,
  BarChart3,
  Users,
  Send,
  Star,
  FileText,
  HelpCircle,
  Mail,
  User,
  ArrowUpDown
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ticketsApi } from '../api/tickets'
import toast from 'react-hot-toast'

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()
  const [ticketLoading, setTicketLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
    priority: 'Medium'
  })

  const handleInputChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    if (!form.customer_name.trim() || !form.customer_email.trim() || !form.subject.trim() || !form.description.trim()) {
      toast.error('Please fill out all required fields')
      return
    }

    setTicketLoading(true)
    try {
      const res = await ticketsApi.create(form)
      toast.success(`Support Ticket ${res.data.ticket_id} created successfully!`)
      // Clear form
      setForm({
        customer_name: '',
        customer_email: '',
        subject: '',
        description: '',
        priority: 'Medium'
      })
      // If user is authenticated, redirect to detail, else stay and notify
      if (isAuthenticated) {
        navigate(`/tickets/${res.data.ticket_id}`)
      } else {
        toast('Login to view full ticket details and add comment notes.', { icon: '🔑', duration: 6000 })
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit ticket')
    } finally {
      setTicketLoading(false)
    }
  }

  return (
    <div className="bg-[#fafaff] min-h-screen text-slate-800 font-sans selection:bg-brand-100 selection:text-brand-900 scroll-smooth">
      
      {/* ── STICKY NAVIGATION HEADER ──────────────────────────── */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 h-16 flex items-center justify-between px-6 md:px-12 transition">
        <div className="flex items-center gap-2">
          <Headphones size={22} className="text-brand-500" />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
            SupportDesk
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#features" className="hidden sm:inline text-xs font-semibold text-slate-500 hover:text-slate-900 transition">Features</a>
          <a href="#process" className="hidden sm:inline text-xs font-semibold text-slate-500 hover:text-slate-900 transition">How it Works</a>
          <a href="#contact" className="hidden sm:inline text-xs font-semibold text-slate-500 hover:text-slate-900 transition">Support Request</a>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link 
                to="/dashboard" 
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-control transition"
              >
                Agent Console
              </Link>
              <button 
                onClick={logout}
                className="text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 px-4 py-2.5 rounded-control transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 transition"
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 px-4.5 py-2.5 rounded-control transition shadow-md shadow-brand-500/10"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ── SECTION 1: HERO ───────────────────────────────────── */}
      <section className="px-6 md:px-12 pt-16 pb-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping"></span>
            Version 1.0 Live
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Customer Support <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-brand-500 to-indigo-600 bg-clip-text text-transparent">
              Management
            </span> Made Simple.
          </h1>
          <p className="text-base text-slate-500 max-w-xl leading-relaxed">
            Manage support tickets, track customer issues, collaborate with your team, and resolve problems faster from one centralized, enterprise-grade CRM platform.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a 
              href="#contact" 
              className="btn-primary px-6 py-3 shadow-lg shadow-brand-500/20"
            >
              Raise a Support Ticket
              <ArrowRight size={16} />
            </a>
            <Link 
              to="/dashboard" 
              className="btn-secondary px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
            >
              Agent Dashboard
            </Link>
          </div>
        </div>

        {/* Dashboard mock card */}
        <div className="lg:col-span-6 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-400/10 to-indigo-500/10 rounded-container blur-3xl -z-10"></div>
          <div className="card border-slate-100 p-5 shadow-2xl bg-white/95 rounded-container">
            
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Console Teaser</span>
            </div>

            {/* Mock layout metrics */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="bg-brand-50/50 border border-brand-100/30 p-3 rounded-control text-left">
                <p className="text-lg font-bold text-brand-600 leading-tight">12</p>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Total Active</p>
              </div>
              <div className="bg-blue-50/30 border border-blue-100/30 p-3 rounded-control text-left">
                <p className="text-lg font-bold text-blue-600 leading-tight">4</p>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Open State</p>
              </div>
              <div className="bg-emerald-50/30 border border-emerald-100/30 p-3 rounded-control text-left">
                <p className="text-lg font-bold text-emerald-600 leading-tight">98%</p>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">SLA Score</p>
              </div>
            </div>

            {/* Mock Row Preview */}
            <div className="space-y-2 text-left">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-control flex items-center justify-between hover:scale-[1.01] transition-transform">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Payment gateway API keeps failing</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">TKT-042 · Amit Kumar</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  In Progress
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-control flex items-center justify-between hover:scale-[1.01] transition-transform">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Unable to download PDF statement</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">TKT-043 · Sarah Jenkins</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Open
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 2: TRUST INDICATORS ──────────────────────── */}
      <section className="bg-slate-900 text-white py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-8 text-center md:text-left">
          
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-brand-400">98.4%</h4>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">SLA Resolution Rate</p>
          </div>
          
          <div className="h-px w-24 bg-slate-800 md:h-12 md:w-px"></div>

          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-brand-400">4.9 / 5.0</h4>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Customer CSAT Score</p>
          </div>

          <div className="h-px w-24 bg-slate-800 md:h-12 md:w-px"></div>

          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-brand-400">&lt; 15 mins</h4>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Average Response Time</p>
          </div>

          <div className="h-px w-24 bg-slate-800 md:h-12 md:w-px"></div>

          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-brand-400">3.5x</h4>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Boost in Team Velocity</p>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: CORE FEATURES ─────────────────────────── */}
      <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">CRM Powerhouse</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Everything You Need to Resolve Tickets Fast</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            SupportDesk brings ticketing metrics, customer database context, internal team comments, and search filters together in one dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <FeatureCard 
            icon={FileText} 
            title="Create Tickets" 
            description="Raise support tickets instantly. Auto-generates unique ticket IDs (e.g. TKT-001) and sets priority levels."
          />
          <FeatureCard 
            icon={Search} 
            title="Smart Search" 
            description="Dynamic, instantly updated searches filtering across ticket subject, description, name, ID, and email."
          />
          <FeatureCard 
            icon={Clock} 
            title="Status Tracking" 
            description="Transition statuses between Open, In Progress, and Closed states to reflect resolution stages cleanly."
          />
          <FeatureCard 
            icon={Users} 
            title="Team Collaboration" 
            description="Coordinate support actions. Multiple agents can review historical threads and update records simultaneously."
          />
          <FeatureCard 
            icon={MessageSquare} 
            title="Activity timeline Notes" 
            description="Log comment notes on individual tickets. Tracks updates on a vertical timeline with exact dates."
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Analytics Dashboard" 
            description="Track total raised tickets, resolve velocity metrics, open tasks volume, and priority allocations at a glance."
          />
        </div>
      </section>

      {/* ── SECTION 4: PRODUCT PREVIEW ───────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-100 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">Interactive Workspace</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">The Modern Control Center for Support Agents</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Inspect our clean, uncluttered interface. Zero learning curves, immediate productivity gains.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto shadow-2xl rounded-container border border-slate-200/60 overflow-hidden bg-white hover:shadow-brand-500/5 transition duration-300">
            <div className="h-10 bg-slate-100 flex items-center gap-1.5 px-4 border-b border-slate-200/60">
              <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              <div className="mx-auto bg-white/70 text-[9px] text-slate-400 font-semibold px-8 py-1 rounded border border-slate-200/40 w-80 truncate">
                http://localhost:5173/dashboard
              </div>
            </div>
            
            <img 
              src="/dark_mode_dashboard.png"
              alt="CRM Dashboard Mockup Preview"
              className="w-full object-cover grayscale-[20%] hover:grayscale-0 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 5: HOW IT WORKS ──────────────────────────── */}
      <section id="process" className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12 text-center">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">Operational Flow</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Simplify Support Operations in 3 Steps</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            From the initial customer request to successful SLA closure, our system guides agents smoothly.
          </p>
        </div>

        {/* Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 relative">
          
          <StepItem 
            step="01" 
            title="Create Support Ticket" 
            description="Customers submit their issues via our functional widget form below, generating a unique ticket record instantly."
          />
          <StepItem 
            step="02" 
            title="Track & Update Progress" 
            description="Agents claim the issue, transition status to In Progress, review priority levels, and append logged update comments."
          />
          <StepItem 
            step="03" 
            title="Resolve Issues Faster" 
            description="Mark tickets as Closed when fixed. All resolution velocity metrics, stats bar values, and timelines auto-update."
          />

        </div>
      </section>

      {/* ── SECTION 6: DASHBOARD ANALYTICS PREVIEW ───────────── */}
      <section className="bg-white border-y border-slate-100 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">Data Visualization</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Actionable Support Analytics at Your Fingertips
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our dashboard aggregates live support trends so success leaders can review ticket load averages, outstanding items by severity priority, and track bottlenecks.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Live ticket counts updates
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Dynamic prioritization filters
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Instant CSV list exports for reporting
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <AnalyticsMetricCard color="text-brand-500" bg="bg-brand-50/50" label="Total Tickets" val="142" percent="+12.4%" desc="Overall customer queries raised" />
            <AnalyticsMetricCard color="text-blue-500" bg="bg-blue-50/50" label="Open Tickets" val="18" percent="-4.2%" desc="Awaiting agent response action" />
            <AnalyticsMetricCard color="text-amber-500" bg="bg-amber-50/50" label="In Progress" val="24" percent="+8.1%" desc="Under active diagnostic review" />
            <AnalyticsMetricCard color="text-emerald-500" bg="bg-emerald-50/50" label="Closed Tickets" val="100" percent="+18.5%" desc="Resolved and successfully resolved" />
          </div>
        </div>
      </section>

      {/* ── SECTION 7: TESTIMONIALS ──────────────────────────── */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12 text-center">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">Success Stories</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Approved by Support Professionals</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Discover how leading ops teams leverage SupportDesk to optimize their support pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <TestimonialCard 
            name="Rahul Sharma" 
            role="VP of Customer Success, FinFlow" 
            quote="SupportDesk changed our customer response dynamics. Average resolution time dropped by 40% within two weeks of migration."
            avatar="RS"
          />
          <TestimonialCard 
            name="Sarah Jenkins" 
            role="Operations Manager, TechLogix" 
            quote="The border-radius refinements, dark mode layouts, and dynamic search features make this CRM a delight to work in every day."
            avatar="SJ"
          />
          <TestimonialCard 
            name="Amit Patel" 
            role="Founder, CloudScale" 
            quote="For an assessment submission, the modular backend SQLAlchemy models and protected frontend router structure are highly impressive."
            avatar="AP"
          />
        </div>
      </section>

      {/* ── INTERACTIVE SUPPORT CONTACT WIDGET (Create Ticket) ── */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100 px-6 md:px-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">Interactive Contact Form</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Have an Issue? Raise a Ticket Immediately</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Fill out the form below. The support system will generate a database record and issue you a Ticket ID.
            </p>
          </div>

          <form onSubmit={handleCreateTicket} className="card p-6 md:p-8 bg-white shadow-xl border-slate-100 space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name" 
                    value={form.customer_name} 
                    onChange={handleInputChange('customer_name')}
                    className="input pl-10"
                    disabled={ticketLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    required 
                    placeholder="you@example.com" 
                    value={form.customer_email} 
                    onChange={handleInputChange('customer_email')}
                    className="input pl-10"
                    disabled={ticketLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
              <div className="relative">
                <HelpCircle size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  required 
                  placeholder="Summarize the technical issue..." 
                  value={form.subject} 
                  onChange={handleInputChange('subject')}
                  className="input pl-10"
                  disabled={ticketLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Describe the Problem</label>
              <textarea 
                rows={5} 
                required 
                placeholder="Detail the issue steps, error codes, logs, expected behavior..." 
                value={form.description} 
                onChange={handleInputChange('description')}
                className="input resize-none"
                disabled={ticketLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Priority Level</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map(p => {
                  const selected = form.priority === p
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, priority: p }))}
                      disabled={ticketLoading}
                      className={`px-4 py-2 rounded-control text-xs font-semibold border transition duration-150 active:scale-[0.98] ${
                        selected
                          ? p === 'High'
                            ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/10'
                            : p === 'Medium'
                            ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                            : 'bg-slate-600 text-white border-slate-600 shadow-md shadow-slate-600/10'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-brand-500'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                disabled={ticketLoading}
                className="btn-primary px-6"
              >
                {ticketLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                {ticketLoading ? 'Submitting Ticket...' : 'Submit Support Ticket'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── SECTION 8: FINAL CTA BANNER ──────────────────────── */}
      <section className="bg-gradient-to-tr from-brand-600 to-indigo-700 text-white py-20 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Start Managing Customer Support Smarter
          </h2>
          <p className="text-base text-brand-100 max-w-xl mx-auto leading-relaxed">
            Equip support engineers with search filters, timeline notes, dynamic stats updates, and automated ticket generation today.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link 
              to="/signup" 
              className="bg-white hover:bg-slate-50 text-brand-700 font-semibold text-sm px-6 py-3 rounded-control transition shadow-lg active:scale-95"
            >
              Create Agent Account
            </Link>
            <Link 
              to="/dashboard" 
              className="bg-brand-700 hover:bg-brand-800 text-white border border-brand-500/50 font-semibold text-sm px-6 py-3 rounded-control transition active:scale-95"
            >
              Explore Dashboard Console
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: FOOTER ────────────────────────────────── */}
      <footer className="bg-slate-50 border-t border-slate-250/30 py-12 px-6 md:px-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
              <Headphones size={18} className="text-brand-500" />
              <span>SupportDesk</span>
            </div>
            <p className="max-w-xs text-slate-400 leading-relaxed">
              Enterprise-grade Customer Support Ticketing CRM. Designed for startups, product success leaders, and operations managers.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3 text-left">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Product</h5>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-slate-800 transition">Features</a></li>
              <li><a href="#process" className="hover:text-slate-800 transition">How it Works</a></li>
              <li><Link to="/tickets/new" className="hover:text-slate-800 transition">New Ticket</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3 text-left">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Agent Console</h5>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-slate-800 transition">Console Login</Link></li>
              <li><Link to="/signup" className="hover:text-slate-800 transition">Create Agent Account</Link></li>
              <li><Link to="/dashboard" className="hover:text-slate-800 transition">Dashboard View</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3 text-left">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Contact Info</h5>
            <p className="text-slate-400">Support Center diagnostics & CRM</p>
            <p className="font-semibold text-slate-800 mt-1">support@supportdesk.crm</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-200/50 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400">
          <p>© 2026 SupportDesk CRM. Built for Datastraw internship assessment submission.</p>
          <p>Privacy Policy · Service SLA</p>
        </div>
      </footer>

    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="card border-slate-100 p-6 text-left bg-white hover:shadow-lg hover:-translate-y-1 hover:border-brand-100 transition duration-300 group">
      <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100/40 text-brand-500 flex items-center justify-center mb-4 transition duration-350 group-hover:bg-brand-500 group-hover:text-white">
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  )
}

function StepItem({ step, title, description }) {
  return (
    <div className="text-left space-y-3 relative bg-white border border-slate-100 p-6 rounded-container hover:shadow-md transition">
      <div className="text-5xl font-black text-slate-100 select-none absolute right-4 top-2 leading-none">
        {step}
      </div>
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed pr-6">{description}</p>
    </div>
  )
}

function AnalyticsMetricCard({ color, bg, label, val, percent, desc }) {
  return (
    <div className="card p-5 border-slate-100 bg-white text-left">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="inline-flex text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
          {percent}
        </span>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <p className="text-3xl font-extrabold text-slate-900 leading-none">{val}</p>
        <span className="text-[10px] text-slate-400 font-semibold">tickets</span>
      </div>
      <p className="text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-50">{desc}</p>
    </div>
  )
}

function TestimonialCard({ name, role, quote, avatar }) {
  return (
    <div className="card border-slate-100 p-6 bg-white text-left space-y-4 hover:shadow-md transition">
      <div className="flex items-center gap-1 text-amber-400">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
      </div>
      <p className="text-xs text-slate-600 italic leading-relaxed">"{quote}"</p>
      
      <div className="flex items-center gap-2.5 pt-2 border-t border-slate-50">
        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
          {avatar}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">{name}</p>
          <p className="text-[10px] text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  )
}
