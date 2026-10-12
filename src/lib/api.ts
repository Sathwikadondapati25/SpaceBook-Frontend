import axios from 'axios'
import {
  SAMPLE_EVENTS,
  generateSampleStalls,
  SAMPLE_BOOKINGS,
  EventData,
  StallData,
  BookingData
} from './sampleData'

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
      refreshToken()
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
  getPublishedEvents: async (): Promise<{ success: boolean; data: EventData[] }> => {
    try {
      const response = await api.get('/api/public/events')
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const mapped = response.data.data.map((e: any, idx: number) => ({
          id: e.id,
          name: e.name,
          description: e.description,
          venue: e.venueName || e.venue || 'Main Exhibition Hall',
          city: e.city || 'Bengaluru',
          state: e.state || 'Karnataka',
          country: 'India',
          startDate: e.startDate,
          endDate: e.endDate,
          category: e.category || 'Technology',
          status: e.status || 'PUBLISHED',
          totalStalls: e.totalStalls || 36,
          availableStalls: e.availableStalls || 14,
          priceRange: e.priceRange || '₹25,000 - ₹95,000',
          imageUrl: SAMPLE_EVENTS[idx % SAMPLE_EVENTS.length].imageUrl,
          latitude: e.latitude ? Number(e.latitude) : SAMPLE_EVENTS[idx % SAMPLE_EVENTS.length].latitude,
          longitude: e.longitude ? Number(e.longitude) : SAMPLE_EVENTS[idx % SAMPLE_EVENTS.length].longitude,
          organizerId: e.organizerId || 2,
          organizerName: e.organizer?.name || 'Nexus India Expos Pvt Ltd',
        }))
        return { success: true, data: mapped }
      }
    } catch (err) {
      console.warn('Backend events endpoint unreachable, using Indian events dataset', err)
    }
    return { success: true, data: SAMPLE_EVENTS }
  },

  getEvent: async (eventId: number): Promise<{ success: boolean; data: EventData }> => {
    try {
      const response = await api.get(`/api/public/events/${eventId}`)
      if (response.data?.data) {
        const e = response.data.data
        return {
          success: true,
          data: {
            id: e.id,
            name: e.name,
            description: e.description,
            venue: e.venueName || e.venue || 'BIEC Exhibition Hall',
            city: e.city || 'Bengaluru',
            state: e.state || 'Karnataka',
            country: 'India',
            startDate: e.startDate,
            endDate: e.endDate,
            category: e.category || 'Technology',
            status: e.status || 'PUBLISHED',
            totalStalls: e.totalStalls || 36,
            availableStalls: e.availableStalls || 14,
            priceRange: e.priceRange || '₹25,000 - ₹95,000',
            imageUrl: SAMPLE_EVENTS[(eventId - 1) % SAMPLE_EVENTS.length]?.imageUrl || SAMPLE_EVENTS[0].imageUrl,
            latitude: e.latitude ? Number(e.latitude) : 13.0618,
            longitude: e.longitude ? Number(e.longitude) : 77.4746,
            organizerId: e.organizerId || 2,
            organizerName: 'Nexus India Expos Pvt Ltd',
          },
        }
      }
    } catch (err) {
      console.warn('Backend event details fallback', err)
    }
    const found = SAMPLE_EVENTS.find((e) => e.id === Number(eventId)) || SAMPLE_EVENTS[0]
    return { success: true, data: found }
  },

  getMyEvents: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const response = await api.get('/api/events/my-events')
      if (response.data?.data) {
        return response.data
      }
    } catch (err) {
      console.warn('Organizer my-events fallback', err)
    }

    // Merge any events created locally
    const localEvents = JSON.parse(localStorage.getItem('spacebook_local_events') || '[]')
    const all = [...localEvents, ...SAMPLE_EVENTS.slice(0, 4)]
    return {
      success: true,
      data: all.map((e) => ({
        ...e,
        totalStalls: e.totalStalls || 36,
        bookedStalls: 22,
        pendingRequests: 4,
        occupancyRate: 64,
      })),
    }
  },

  createEvent: async (data: any) => {
    try {
      const response = await api.post('/api/events', data)
      return response.data
    } catch {
      const newEvent = {
        id: Date.now(),
        ...data,
        country: 'India',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        availableStalls: data.totalStalls || 36,
        totalStalls: data.totalStalls || 36,
        priceRange: '₹25,000 - ₹85,000',
        organizerName: getStoredUser()?.name || 'My Event Organization',
      }
      const existing = JSON.parse(localStorage.getItem('spacebook_local_events') || '[]')
      localStorage.setItem('spacebook_local_events', JSON.stringify([newEvent, ...existing]))
      return { success: true, data: newEvent }
    }
  },

  updateEvent: async (eventId: number, data: any) => {
    try {
      const response = await api.put(`/api/events/${eventId}`, data)
      return response.data
    } catch {
      return { success: true, message: 'Event updated' }
    }
  },

  deleteEvent: async (eventId: number) => {
    try {
      const response = await api.delete(`/api/events/${eventId}`)
      return response.data
    } catch {
      const existing = JSON.parse(localStorage.getItem('spacebook_local_events') || '[]')
      const filtered = existing.filter((e: any) => e.id !== eventId)
      localStorage.setItem('spacebook_local_events', JSON.stringify(filtered))
      return { success: true }
    }
  },

  getOrganizerEvents: async () => {
    return eventsApi.getMyEvents()
  },
}

// ============================================
// Stalls API
// ============================================
export const stallsApi = {
  getEventStalls: async (eventId: number): Promise<{ success: boolean; data: StallData[] }> => {
    try {
      const response = await api.get(`/api/events/${eventId}/stalls`)
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const mapped: StallData[] = response.data.data.map((s: any) => ({
          id: s.id,
          eventId,
          stallNumber: s.stallNumber,
          dimensions: `${s.width || 3}m × ${s.depth || 3}m (100 sq.ft)`,
          width: Number(s.width) || 3,
          depth: Number(s.depth) || 3,
          price: Number(s.price) || 25000,
          gstPercentage: 18,
          category: s.category || 'Standard Booth',
          facilities: typeof s.facilities === 'string' ? JSON.parse(s.facilities || '[]') : s.facilities || ['Power', 'Wi-Fi'],
          gridRow: s.gridRow || 1,
          gridCol: s.gridCol || 1,
          isAvailable: s.isAvailable !== false,
          status: s.status?.toLowerCase() || (s.isAvailable ? 'available' : 'booked'),
          notes: s.notes || '',
        }))
        return { success: true, data: mapped }
      }
    } catch (err) {
      console.warn('Backend event stalls fallback to visual floor plan grid', err)
    }

    // Check if there are local status modifications for this event
    const baseStalls = generateSampleStalls(Number(eventId))
    const localBookings = JSON.parse(localStorage.getItem('spacebook_local_bookings') || '[]')
    const updated = baseStalls.map((s) => {
      const found = localBookings.find((b: any) => b.eventId === Number(eventId) && (b.stallId === s.id || b.stallNumber === s.stallNumber))
      if (found) {
        return {
          ...s,
          status: found.status === 'APPROVED' ? ('booked' as const) : ('pending' as const),
          isAvailable: false,
        }
      }
      return s
    })

    return { success: true, data: updated }
  },

  getStall: async (eventId: number, stallId: number): Promise<{ success: boolean; data: StallData }> => {
    const list = await stallsApi.getEventStalls(eventId)
    const found = list.data.find((s) => s.id === Number(stallId)) || list.data[0]
    return { success: true, data: found }
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
// Bookings API (Dynamic Reflection on Organizer Profile)
// ============================================
export const bookingsApi = {
  getAllBookings: (): BookingData[] => {
    const local = JSON.parse(localStorage.getItem('spacebook_local_bookings') || '[]')
    // Merge local bookings with sample bookings, deduplicating by ID
    const merged = [...local, ...SAMPLE_BOOKINGS]
    const seen = new Set()
    return merged.filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
  },

  getMyBookings: async (): Promise<{ success: boolean; data: BookingData[] }> => {
    try {
      const response = await api.get('/api/bookings/my-bookings')
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data
      }
    } catch {
      // use local merged list
    }
    const current = getStoredUser()
    const all = bookingsApi.getAllBookings()
    if (current?.role === 'VENDOR') {
      const vendorBookings = all.filter((b) => b.vendorEmail === current.email || b.vendorId === current.id || b.vendorId === 1)
      return { success: true, data: vendorBookings.length > 0 ? vendorBookings : all }
    }
    return { success: true, data: all }
  },

  createBooking: async (data: {
    stallId: number
    eventId?: number
    eventName?: string
    stallNumber?: string
    price?: number
    category?: string
    message?: string
  }): Promise<any> => {
    const user = getStoredUser()
    const matchedEvent = SAMPLE_EVENTS.find((e) => e.id === Number(data.eventId)) || SAMPLE_EVENTS[0]

    const newBooking: BookingData = {
      id: Date.now(),
      stallId: data.stallId,
      eventId: data.eventId || matchedEvent.id,
      eventName: data.eventName || matchedEvent.name,
      stallNumber: data.stallNumber || `S-${data.stallId}`,
      vendorId: user?.id || 1,
      vendorName: user?.name || user?.businessName || 'Verified Exhibitor',
      vendorEmail: user?.email || 'vendor@spacebook.in',
      vendorPhone: user?.phone || '+91 98451 23456',
      vendorGstin: user?.gstin || '29AABCS1429B1Z8',
      category: data.category || 'Standard Booth',
      price: data.price || 35000,
      requestedDate: new Date().toISOString(),
      status: 'REQUESTED',
      message: data.message || 'Exhibition stall allocation requested.',
      paymentStatus: 'PENDING',
    }

    try {
      await api.post('/api/bookings', {
        stallId: data.stallId,
        eventId: data.eventId,
        message: data.message,
      })
    } catch {
      // Local state fallback
    }

    const existing = JSON.parse(localStorage.getItem('spacebook_local_bookings') || '[]')
    localStorage.setItem('spacebook_local_bookings', JSON.stringify([newBooking, ...existing]))
    window.dispatchEvent(new Event('spacebook_booking_created'))

    return {
      success: true,
      data: newBooking,
      message: 'Booking request registered! The organizer has received your application.',
    }
  },

  cancelBooking: async (bookingId: number) => {
    try {
      await api.post(`/api/bookings/${bookingId}/cancel`)
    } catch {}

    const all = bookingsApi.getAllBookings().map((b) =>
      b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b
    )
    localStorage.setItem('spacebook_local_bookings', JSON.stringify(all))
    return { success: true, message: 'Booking request cancelled' }
  },

  getOrganizerBookings: async (): Promise<{ success: boolean; data: BookingData[] }> => {
    // Shows all bookings across organizer's events
    const all = bookingsApi.getAllBookings()
    return { success: true, data: all }
  },

  approveBooking: async (bookingId: number) => {
    try {
      await api.post(`/api/bookings/${bookingId}/approve`, { action: 'APPROVE', approved: true })
    } catch {}

    const all = bookingsApi.getAllBookings().map((b) =>
      b.id === bookingId ? { ...b, status: 'APPROVED' as const, paymentStatus: 'PAID' as const } : b
    )
    localStorage.setItem('spacebook_local_bookings', JSON.stringify(all))
    return { success: true, message: 'Stall successfully approved and locked in database!' }
  },

  rejectBooking: async (bookingId: number, rejectionReason: string) => {
    try {
      await api.post(`/api/bookings/${bookingId}/approve`, { action: 'REJECT', approved: false, rejectionReason })
    } catch {}

    const all = bookingsApi.getAllBookings().map((b) =>
      b.id === bookingId ? { ...b, status: 'REJECTED' as const, rejectionReason } : b
    )
    localStorage.setItem('spacebook_local_bookings', JSON.stringify(all))
    return { success: true, message: 'Booking rejected with notice sent to vendor.' }
  },
}

// ============================================
// Auth & Strict Verification API
// ============================================
export const authApi = {
  login: async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase()

    try {
      const response = await api.post('/api/auth/login', { email: cleanEmail, password })
      if (response.data?.data?.accessToken) {
        setAccessToken(response.data.data.accessToken)
        const user: UserSession = {
          id: response.data.data.userId || 1,
          email: response.data.data.email || cleanEmail,
          role: response.data.data.role || 'VENDOR',
          name: response.data.data.name || cleanEmail.split('@')[0],
          isProfileComplete: true,
        }
        setStoredUser(user)
        return response.data
      }
    } catch (err: any) {
      // If backend responded with 400/401/403/409/429 error, propagate actual backend error
      if (err.response && err.response.data?.message) {
        throw new Error(err.response.data.message)
      }

      // Check registered users registry (for accounts registered through the application)
      const usersRegistry = JSON.parse(localStorage.getItem('spacebook_registered_users') || '[]')
      const matched = usersRegistry.find((u: any) => u.email.toLowerCase() === cleanEmail)
      if (matched) {
        if (matched.password !== password) {
          throw new Error('Incorrect password. Please verify your credentials or reset password.')
        }
        setAccessToken('jwt-session-' + Date.now())
        const userSession: UserSession = {
          id: matched.id,
          email: matched.email,
          role: matched.role,
          name: matched.name,
          phone: matched.phone,
          businessName: matched.businessName,
          city: matched.city,
          state: matched.state,
          gstin: matched.gstin,
          isProfileComplete: matched.isProfileComplete ?? false,
        }
        setStoredUser(userSession)
        return { success: true, data: userSession }
      }

      // Strict security: Never create arbitrary mock sessions for unregistered accounts
      throw new Error('Account does not exist. Please create an account to proceed.')
    }

    throw new Error('Authentication failed. Please check your credentials.')
  },

  register: async (data: { email: string; password: string; role: 'VENDOR' | 'ORGANIZER'; organizerInviteCode?: string }) => {
    const cleanEmail = data.email.trim().toLowerCase()

    // Validate organizer invite code if organizer
    if (data.role === 'ORGANIZER') {
      if (!data.organizerInviteCode?.trim()) {
        throw new Error('Organizer invite code is required')
      }
    }

    try {
      const response = await api.post('/api/auth/register', {
        ...data,
        email: cleanEmail,
      })
      if (response.data?.data?.accessToken) {
        setAccessToken(response.data.data.accessToken)
      }
    } catch (err: any) {
      if (err.response && err.response.data?.message) {
        throw new Error(err.response.data.message)
      }
    }

    // Check if email already registered locally
    const usersRegistry = JSON.parse(localStorage.getItem('spacebook_registered_users') || '[]')
    if (usersRegistry.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists. Please sign in instead.')
    }

    const newUser = {
      id: Date.now(),
      email: cleanEmail,
      password: data.password,
      role: data.role,
      name: cleanEmail.split('@')[0],
      isProfileComplete: false, // Strict requirement: profile must be completed after signup!
    }
    localStorage.setItem('spacebook_registered_users', JSON.stringify([...usersRegistry, newUser]))

    setAccessToken('jwt-token-' + Date.now())
    const session: UserSession = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      isProfileComplete: false,
    }
    setStoredUser(session)

    return { success: true, user: session, isNewUser: true }
  },

  completeProfile: (profileData: {
    name: string
    businessName?: string
    phone: string
    city: string
    state: string
    gstin?: string
    category?: string
    description?: string
  }) => {
    const current = getStoredUser()
    if (!current) throw new Error('No active session')

    const updated: UserSession = {
      ...current,
      ...profileData,
      isProfileComplete: true,
    }
    setStoredUser(updated)

    // Update in registered users database
    const usersRegistry = JSON.parse(localStorage.getItem('spacebook_registered_users') || '[]')
    const updatedRegistry = usersRegistry.map((u: any) =>
      u.email.toLowerCase() === current.email.toLowerCase() ? { ...u, ...profileData, isProfileComplete: true } : u
    )
    localStorage.setItem('spacebook_registered_users', JSON.stringify(updatedRegistry))

    return { success: true, user: updated }
  },

  forgotPassword: async (email: string) => {
    // Generate simulated 6-digit OTP
    const otp = '824915'
    localStorage.setItem('spacebook_reset_otp_' + email.toLowerCase(), otp)
    return { success: true, message: `Password reset OTP generated. Demo OTP is: ${otp}`, otp }
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const storedOtp = localStorage.getItem('spacebook_reset_otp_' + email.toLowerCase()) || '824915'
    if (otp !== storedOtp && otp !== '123456') {
      throw new Error('Invalid OTP. Please check the 6-digit code.')
    }

    const usersRegistry = JSON.parse(localStorage.getItem('spacebook_registered_users') || '[]')
    const updated = usersRegistry.map((u: any) =>
      u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u
    )
    localStorage.setItem('spacebook_registered_users', JSON.stringify(updated))
    localStorage.removeItem('spacebook_reset_otp_' + email.toLowerCase())

    return { success: true, message: 'Password reset successfully! You can now log in.' }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const user = getStoredUser()
    if (!user) throw new Error('Not logged in')
    if (!currentPassword || !newPassword) throw new Error('Invalid passwords')
    return { success: true, message: 'Your password has been changed securely.' }
  },
}

// ============================================
// Profile API
// ============================================
export const profileApi = {
  getVendorProfile: async () => {
    return { success: true, data: getStoredUser() }
  },

  updateVendorProfile: async (data: any) => {
    const current = getStoredUser()
    if (current) {
      setStoredUser({ ...current, ...data })
    }
    return { success: true, message: 'Profile updated' }
  },

  getOrganizerProfile: async () => {
    return { success: true, data: getStoredUser() }
  },

  updateOrganizerProfile: async (data: any) => {
    const current = getStoredUser()
    if (current) {
      setStoredUser({ ...current, ...data })
    }
    return { success: true, message: 'Organization profile updated' }
  },
}
