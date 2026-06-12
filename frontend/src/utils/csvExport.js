/**
 * Exports support tickets to a downloadable CSV file.
 * Automatically escapes values and wraps them in quotes to handle commas.
 * @param {Array} tickets List of tickets to export
 * @param {string} filename Name of the downloaded file
 */
export function exportToCSV(tickets, filename = 'tickets_export.csv') {
  if (!tickets || tickets.length === 0) return;

  const headers = [
    'Ticket ID',
    'Customer Name',
    'Customer Email',
    'Subject',
    'Status',
    'Priority',
    'Created At',
    'Updated At'
  ]

  // Formats rows and escapes double quotes
  const rows = tickets.map(t => {
    const cleanDate = (d) => d ? new Date(d).toLocaleString('en-IN') : '—';
    return [
      t.ticket_id,
      t.customer_name,
      t.customer_email,
      t.subject,
      t.status,
      t.priority,
      cleanDate(t.created_at),
      cleanDate(t.updated_at)
    ]
  })

  // Convert array to CSV string
  const csvRows = [
    headers.join(','),
    ...rows.map(row => 
      row.map(val => {
        const str = String(val);
        // If string contains comma, newline or quotes, wrap it in double-quotes and escape internal double-quotes
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    )
  ]

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
