const STATUS_STYLES = {
  'Open':        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
  'Closed':      'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50',
}

const PRIORITY_STYLES = {
  'High':   'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50',
  'Medium': 'bg-orange-50 text-orange-705 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50',
  'Low':    'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/60 dark:text-gray-400 dark:border-gray-700',
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'Open' ? 'bg-blue-500' :
        status === 'In Progress' ? 'bg-amber-500' : 'bg-green-500'
      }`} />
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${PRIORITY_STYLES[priority] || 'bg-gray-100 text-gray-600'}`}>
      {priority}
    </span>
  )
}