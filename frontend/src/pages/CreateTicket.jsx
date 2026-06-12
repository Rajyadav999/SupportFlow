import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Send, RefreshCw, AlertCircle } from 'lucide-react'
import { ticketsApi } from '../api/tickets'
import toast from 'react-hot-toast'

const PRIORITIES = ['Low', 'Medium', 'High']

export default function CreateTicket() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name:  '',
    customer_email: '',
    subject:        '',
    description:    '',
    priority:       'Medium',
  })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  // Client-side validations matching the constraints
  function validate() {
    const e = {}
    if (!form.customer_name.trim()) {
      e.customer_name = 'Customer name is required'
    } else if (form.customer_name.trim().length > 100) {
      e.customer_name = 'Name must be 100 characters or less'
    }

    if (!form.customer_email.trim()) {
      e.customer_email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(form.customer_email)) {
      e.customer_email = 'Please enter a valid email address'
    }

    if (!form.subject.trim()) {
      e.subject = 'Issue subject is required'
    } else if (form.subject.trim().length > 200) {
      e.subject = 'Subject must be 200 characters or less'
    }

    if (!form.description.trim()) {
      e.description = 'Issue description is required'
    } else if (form.description.trim().length > 5000) {
      e.description = 'Description must be 5000 characters or less'
    }

    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { 
      setErrors(e)
      toast.error('Please fix the errors in the form')
      return 
    }
    setErrors({})
    setLoading(true)
    try {
      const res = await ticketsApi.create(form)
      toast.success(`Support Ticket ${res.data.ticket_id} created successfully!`)
      navigate(`/tickets/${res.data.ticket_id}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit support ticket')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, field, type = 'text', placeholder, required, maxLength }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        {maxLength && (
          <span className="text-[10px] text-gray-400">
            {form[field].length}/{maxLength}
          </span>
        )}
      </div>
      <input
        type={type}
        maxLength={maxLength}
        className={`input ${errors[field] ? 'border-red-500 focus:ring-red-550/20 focus:border-red-500 dark:border-red-800' : ''}`}
        placeholder={placeholder}
        value={form[field]}
        onChange={set(field)}
        disabled={loading}
      />
      {errors[field] && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 mt-1 font-medium">
          <AlertCircle size={12} />
          {errors[field]}
        </p>
      )}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* Back Navigation */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition"
      >
        <ArrowLeft size={15} /> 
        Back to Dashboard
      </Link>

      <div className="card p-6 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">New Support Ticket</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill in the customer information and detail the technical problem to open a new CRM record.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {/* Customer info side-by-side grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field 
              label="Customer Name"  
              field="customer_name"  
              placeholder="Raj Yadav" 
              required 
              maxLength={100}
            />
            <Field 
              label="Customer Email" 
              field="customer_email" 
              type="email" 
              placeholder="rajyadav@example.com" 
              required 
            />
          </div>

          <Field 
            label="Issue Subject" 
            field="subject" 
            placeholder="e.g. Cannot connect database to server dashboard" 
            required 
            maxLength={200}
          />

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Detailed Description <span className="text-red-500 font-bold">*</span>
              </label>
              <span className="text-[10px] text-gray-400">
                {form.description.length}/5000
              </span>
            </div>
            <textarea
              rows={6}
              maxLength={5000}
              className={`input resize-none ${errors.description ? 'border-red-500 focus:ring-red-550/20 focus:border-red-500 dark:border-red-800' : ''}`}
              placeholder="Describe the issue in detail. Please provide steps to reproduce, errors encountered, expected results..."
              value={form.description}
              onChange={set('description')}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle size={12} />
                {errors.description}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Select Priority Level
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => {
                const selected = form.priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, priority: p }))}
                    disabled={loading}
                    className={`px-4.5 py-2.5 rounded-control text-sm font-semibold border transition duration-150 active:scale-[0.98] ${
                      selected
                        ? p === 'High'
                          ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/10'
                          : p === 'Medium'
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                          : 'bg-gray-500 text-white border-gray-500 shadow-md shadow-gray-500/10'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-400'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="mt-6 pt-2 flex justify-end">
          <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="btn-primary px-5"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
            {loading ? 'Submitting...' : 'Create Ticket'}
          </button>
        </div>
      </div>
    </div>
  )
}