import axios from 'axios'

// Base URL: reads from .env in dev, falls back to localhost
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export const ticketsApi = {
  // GET /api/tickets?search=X&status=Y&priority=Z
  list: (params = {}) => api.get('/api/tickets', { params }),

  // GET /api/tickets/:id
  get: (ticketId) => api.get(`/api/tickets/${ticketId}`),

  // POST /api/tickets
  create: (data) => api.post('/api/tickets', data),

  // PUT /api/tickets/:id
  update: (ticketId, data) => api.put(`/api/tickets/${ticketId}`, data),

  // GET /api/tickets/stats/summary
  stats: () => api.get('/api/tickets/stats/summary'),
}