import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      clearAuth()
      if (typeof window !== 'undefined') {
        window.location.href = '/auth'
      }
    }
    // Check if backend is unreachable
    if (!error.response && error.code === 'ECONNREFUSED') {
      // Backend is offline - throw a clear error
      const backendError = new Error('Cannot reach the server. Please check your connection and try again.')
      backendError.name = 'BACKEND_OFFLINE'
      throw backendError
    }
    return Promise.reject(error)
  }
)

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}

export function setAccessToken(token: string) {
  localStorage.setItem('accessToken', token)
}

export function clearAuth() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  window.dispatchEvent(new Event('spacebook_auth_changed'))
}

export interface UserSession {
  id: number
  email: string
  role: 'VENDOR' | 'ORGANIZER'
  name?: string
  businessName?: string
  phone?: string
  city?: string
  state?: string
  gstin?: string
  isProfileComplete?: boolean
}

export function getStoredUser(): UserSession | null {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setStoredUser(user: UserSession) {
  localStorage.setItem('user', JSON.stringify(user))
  window.dispatchEvent(new Event('spacebook_auth_changed'))
}

export async function refreshToken() {
  try {
    const rfToken = localStorage.getItem('refreshToken')
    if (!rfToken) return
    const response = await api.post('/api/auth/refresh', { refreshToken: rfToken })
    if (response.data?.data?.accessToken) {
      setAccessToken(response.data.data.accessToken)
    }
  } catch (error) {
    console.warn('Silent token refresh failed')
  }
}

// ============================================
// Events API
// ============================================
export const eventsApi = {
  getPublishedEvents: async () => {
    const response = await api.get('/api/public/events')
    return response.data
  },

  getEvent: async (eventId: number) => {
    const response = await api.get(`/api/public/events/${eventId}`)
    return response.data
  },

  getMyEvents: async () => {
    const response = await api.get('/api/events/my-events')
    return response.data
  },

  createEvent: async (data: any) => {
    const response = await api.post('/api/events', data)
    return response.data
  },

  updateEvent: async (eventId: number, data: any) => {
    const response = await api.put(`/api/events/${eventId}`, data)
    return response.data
  },

  deleteEvent: async (eventId: number) => {
    const response = await api.delete(`/api/events/${eventId}`)
    return response.data
  },

  getOrganizerEvents: async () => {
    return eventsApi.getMyEvents()
  },
}

// ============================================
// Stalls API
// ============================================
export const stallsApi = {
  getEventStalls: async (eventId: number) => {
    const response = await api.get(`/api/events/${eventId}/stalls`)
    return response.data
  },

  getStall: async (eventId: number, stallId: number) => {
    const response = await api.get(`/api/events/${eventId}/stalls/${stallId}`)
    return response.data
  },

  createStall: async (eventId: number, data: any) => {
    const response = await api.post(`/api/events/${eventId}/stalls`, data)
    return response.data
  },

  updateStall: async (eventId: number, stallId: number, data: any) => {
    const response = await api.put(`/api/events/${eventId}/stalls/${stallId}`, data)
    return response.data
  },

  deleteStall: async (eventId: number, stallId: number) => {
    const response = await api.delete(`/api/events/${eventId}/stalls/${stallId}`)
    return response.data
  },
}

// ============================================
// Bookings API
// ============================================
export const bookingsApi = {
  getMyBookings: async () => {
    const response = await api.get('/api/bookings/my-bookings')
    return response.data
  },

  createBooking: async (data: any) => {
    const response = await api.post('/api/bookings', data)
    return response.data
  },

  cancelBooking: async (bookingId: number) => {
    const response = await api.post(`/api/bookings/${bookingId}/cancel`)
    return response.data
  },

  approveBooking: async (bookingId: number, action: 'APPROVE' | 'REJECT', rejectionReason?: string) => {
    const response = await api.post(`/api/bookings/${bookingId}/approve`, {
      action,
      approved: action === 'APPROVE',
      rejectionReason,
    })
    return response.data
  },

  rejectBooking: async (bookingId: number, rejectionReason: string) => {
    return bookingsApi.approveBooking(bookingId, 'REJECT', rejectionReason)
  },

  getEventBookings: async (eventId: number) => {
    const response = await api.get(`/api/bookings/event/${eventId}`)
    return response.data
  },

  getOrganizerBookings: async () => {
    // For now, return empty array - organizer needs to select an event first
    return { success: true, data: [] }
  },

  getBooking: async (bookingId: number) => {
    const response = await api.get(`/api/bookings/${bookingId}`)
    return response.data
  },
}

// ============================================
// Auth API
// ============================================
export const authApi = {
  login: async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase()
    const response = await api.post('/api/auth/login', { email: cleanEmail, password })
    if (response.data?.data?.accessToken) {
      setAccessToken(response.data.data.accessToken)
      const user: UserSession = {
        id: response.data.data.userId,
        email: response.data.data.email,
        role: response.data.data.role,
        isProfileComplete: true,
      }
      setStoredUser(user)
    }
    return response.data
  },

  register: async (data: { email: string; password: string; role: 'VENDOR' | 'ORGANIZER'; organizerInviteCode?: string }) => {
    const cleanEmail = data.email.trim().toLowerCase()
    const response = await api.post('/api/auth/register', {
      ...data,
      email: cleanEmail,
    })
    if (response.data?.data?.accessToken) {
      setAccessToken(response.data.data.accessToken)
      const user: UserSession = {
        id: response.data.data.userId,
        email: response.data.data.email,
        role: response.data.data.role,
        isProfileComplete: false,
      }
      setStoredUser(user)
    }
    return response.data
  },

  completeProfile: async (profileData: any) => {
    const response = await api.post('/api/profile/vendor', profileData)
    const current = getStoredUser()
    if (current) {
      setStoredUser({ ...current, ...profileData, isProfileComplete: true })
    }
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const response = await api.post('/api/auth/reset-password', { email, otp, newPassword })
    return response.data
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/api/auth/change-password', { currentPassword, newPassword })
    return response.data
  },
}

// ============================================
// Profile API
// ============================================
export const profileApi = {
  getVendorProfile: async () => {
    const response = await api.get('/api/profile/vendor')
    return response.data
  },

  updateVendorProfile: async (data: any) => {
    const response = await api.put('/api/profile/vendor', data)
    const current = getStoredUser()
    if (current) {
      setStoredUser({ ...current, ...data })
    }
    return response.data
  },

  getOrganizerProfile: async () => {
    const response = await api.get('/api/profile/organizer')
    return response.data
  },

  updateOrganizerProfile: async (data: any) => {
    const response = await api.put('/api/profile/organizer', data)
    const current = getStoredUser()
    if (current) {
      setStoredUser({ ...current, ...data })
    }
    return response.data
  },
}
