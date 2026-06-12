import { Ticket, CircleDot, Clock, CheckCircle2 } from 'lucide-react'

const CARDS = [
  { 
    key: 'total',       
    label: 'Total Tickets', 
    icon: Ticket,        
    color: 'text-brand-500 dark:text-brand-400',  
    bg: 'bg-brand-50 dark:bg-brand-950/30' 
  },
  { 
    key: 'open',        
    label: 'Open',          
    icon: CircleDot,     
    color: 'text-blue-500 dark:text-blue-400',   
    bg: 'bg-blue-50 dark:bg-blue-950/30'  
  },
  { 
    key: 'in_progress', 
    label: 'In Progress',   
    icon: Clock,         
    color: 'text-amber-500 dark:text-amber-400',  
    bg: 'bg-amber-50 dark:bg-amber-950/30' 
  },
  { 
    key: 'closed',      
    label: 'Closed',        
    icon: CheckCircle2,  
    color: 'text-green-500 dark:text-green-400',  
    bg: 'bg-green-50 dark:bg-green-950/30' 
  },
]

export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 animate-fade-in">
      {CARDS.map(({ key, label, icon: Icon, color, bg }) => (
        <div key={key} className="card p-5 flex items-center gap-4 hover:shadow-md transition">
          <div className={`${bg} p-3 rounded-2xl`}>
            <Icon size={20} className={color} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {stats?.[key] ?? '—'}
            </p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}