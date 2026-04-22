export const bookingStorageKey = 'wls-air-bookings'

export const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
export const formatTime = (value) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
export const formatDateTime = (value) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
export const formatDuration = (minutes) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`
export const getFlightById = (items, id) => items.find((flight) => flight.id === id)
export const getAirportLabel = (airports, code) => airports.find((airport) => airport.code === code)?.label || code
export const readBookings = () => {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(bookingStorageKey)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}
export const writeBookings = (bookings) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(bookingStorageKey, JSON.stringify(bookings))
}
export const createReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let token = ''
  for (let index = 0; index < 6; index += 1) token += chars[Math.floor(Math.random() * chars.length)]
  return `WLS-${token}`
}
