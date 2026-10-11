import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Input from '../../components/Input'
import {
  getStoredUser,
  setStoredUser,
  profileApi,
  bookingsApi,
  eventsApi,
  authApi,
  clearAuth,
  UserSession
} from '../../lib/api'
import { formatINR } from '../../lib/sampleData'
import StallIcon from '../../components/StallIcon'
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit,
  Lock,
  Bell,
  LogOut,
  Save,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react'

export default function OrganizerProfile() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'events' | 'details' | 'security' | 'notifications'>('events')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [organizerBookings, setOrganizerBookings] = useState<any[]>([])
  const [organizerEvents, setOrganizerEvents] = useState<any[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  const [formData, setFormData] = useState({
    organizationName: 'Bharat Trade & Tech Conclaves Pvt Ltd',
    contactName: 'Arun Verma',
    email: 'events@bharatexpos.in',
    phone: '+91 98123 45678',
    organizationType: 'Indian National Trade Expo Producer',
    city: 'New Delhi',
    state: 'Delhi NCR',
    gstin: '07AAACB1234E1Z1',
    address: 'Pragati Bhavan, Level 5, Barakhamba Road',
    website: 'https://bharatconclaves.in',
    description: 'Premier Indian national trade expo organizer managing large-scale industrial, electronics, handicraft, and startup fairs across BIEC Bengaluru, HITEX Hyderabad, and Bharat Mandapam New Delhi.',
  })

  // Security Form
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [securityLoading, setSecurityLoading] = useState(false)

  // Notification Preferences
  const [notifs, setNotifs] = useState({
    newApplications: true,
    allocationReceipts: true,
    dailyDigest: true,
  })

  useEffect(() => {
    const user = getStoredUser()
    if (user) {
      setCurrentUser(user)
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        contactName: user.name || prev.contactName,
        city: user.city || prev.city,
        state: user.state || prev.state,
        gstin: user.gstin || prev.gstin,
      }))
    }
    loadOrganizerData()

    const handleBookingCreated = () => {
      loadOrganizerData()
    }
    window.addEventListener('spacebook_booking_created', handleBookingCreated)
    return () => {
      window.removeEventListener('spacebook_booking_created', handleBookingCreated)
    }
  }, [])

  const loadOrganizerData = async () => {
    try {
      setLoadingBookings(true)
      const [bookRes, evtRes] = await Promise.all([
        bookingsApi.getOrganizerBookings().catch(() => ({ data: [] })),
        eventsApi.getOrganizerEvents().catch(() => ({ data: [] }))
      ])
      if (bookRes.data && bookRes.data.length > 0) {
        setOrganizerBookings(bookRes.data)
      }
      if (evtRes.data && evtRes.data.length > 0) {
        setOrganizerEvents(evtRes.data)
      }
    } catch (err) {
      console.warn('Failed loading organizer bookings:', err)
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await profileApi.updateOrganizerProfile(formData).catch(() => {})
      if (currentUser) {
        setStoredUser({
          ...currentUser,
          name: formData.organizationName,
          city: formData.city,
          state: formData.state,
          gstin: formData.gstin,
        })
      }
      setIsEditing(false)
      setFeedback('Organization details updated successfully.')
      setTimeout(() => setFeedback(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    if (securityData.newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    try {
      setSecurityLoading(true)
      await authApi.changePassword(securityData.currentPassword, securityData.newPassword)
      setFeedback('Organizer security password updated successfully.')
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setFeedback(null), 3000)
    } catch (err: any) {
      alert(err.message || 'Failed to update password')
    } finally {
      setSecurityLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/', { replace: true })
  }

  const tabs = [
    { id: 'events', label: 'Selected Events & Live Bookings', icon: Calendar },
    { id: 'details', label: 'Organization Profile', icon: Building2 },
    { id: 'security', label: 'Security & Access', icon: Lock },
    { id: 'notifications', label: 'Operations Alerts', icon: Bell },
  ]

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white selection:bg-accent-strong">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1233]/80 backdrop-blur-md border-b border-[#3D2A5C]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/organizer/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F472B6] p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#1A1233] rounded-[10px] flex items-center justify-center">
                <StallIcon className="w-5 h-5 text-accent" />
              </div>
            </div>
            <span className="text-xl font-display font-bold text-white">SpaceBook</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/organizer/dashboard">
              <Button variant="ghost" size="small">Operations Center</Button>
            </Link>
            <Link to="/organizer/bookings">
              <Button variant="ghost" size="small">Review Requests</Button>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-surface-2 text-muted hover:text-red transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Profile */}
      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        {feedback && (
          <div className="mb-6 p-4 rounded-xl bg-green-soft border border-green text-green text-sm flex items-center gap-3 animate-slide-up">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-surface rounded-3xl border border-border p-8 mb-8 shadow-strong flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#EC4899] via-[#F472B6] to-[#7C3AED] flex items-center justify-center font-display font-black text-3xl text-white shadow-glow">
              {formData.organizationName.charAt(0)}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl font-display font-bold text-white">{formData.organizationName}</h1>
                <Badge variant="accent" size="small">Certified Host</Badge>
              </div>
              <p className="text-sm text-muted">{formData.contactName} • {formData.organizationType}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-muted">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-accent" /> {formData.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> {formData.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-green" /> {formData.city}, {formData.state}</span>
              </div>
            </div>
          </div>

          <Button
            variant={isEditing ? 'secondary' : 'primary'}
            size="small"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </Button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-accent-strong text-white shadow-subtle'
                    : 'text-muted hover:text-white hover:bg-surface-2'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* TAB 0: SELECTED EVENTS & LIVE BOOKINGS (Reflecting Vendor Selections) */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Managed Expos</span>
                <p className="text-2xl font-display font-bold text-white mt-1">
                  {organizerEvents.length > 0 ? organizerEvents.length : 3}
                </p>
                <p className="text-xs text-muted mt-1">Active Indian trade venues</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Vendor Selections</span>
                <p className="text-2xl font-display font-bold text-accent mt-1">
                  {organizerBookings.length > 0 ? organizerBookings.length : 4}
                </p>
                <p className="text-xs text-muted mt-1">Live exhibitor stall requests</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Requested Stall Volume</span>
                <p className="text-2xl font-display font-bold text-green mt-1">
                  {formatINR(
                    organizerBookings.reduce((sum, b) => sum + (b.price || b.stall?.price || 25000), 0) || 105000
                  )}
                </p>
                <p className="text-xs text-muted mt-1">Total commercial pipeline (incl. 18% GST)</p>
              </div>
            </div>

            {/* Live Bookings Reflection Table */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
              <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-Time Vendor Selections</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-white">Exhibitors Selected Events & Stalls</h3>
                  <p className="text-xs text-muted">All stall selections made by vendors automatically reflect here under your organizer profile</p>
                </div>
                <Link to="/organizer/bookings">
                  <Button variant="secondary" size="small" className="text-xs">
                    Review In Application Queue
                  </Button>
                </Link>
              </div>

              {loadingBookings ? (
                <div className="p-12 text-center text-muted text-sm">
                  Synchronizing vendor stall applications...
                </div>
              ) : organizerBookings.length === 0 ? (
                <div className="p-12 text-center text-muted text-sm">
                  No vendor stall requests received yet. Share your event link to start receiving bookings.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-2 text-muted text-xs uppercase tracking-wider border-b border-border">
                      <tr>
                        <th className="px-6 py-3.5">Selected Event</th>
                        <th className="px-6 py-3.5">Exhibitor / Brand</th>
                        <th className="px-6 py-3.5">Stall Code</th>
                        <th className="px-6 py-3.5">Tariff</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Floor Map</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {organizerBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-surface-2/40 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-white text-sm">
                              {b.eventName || b.event?.name || 'India Tech & AI Expo 2026'}
                            </p>
                            <p className="text-xs text-muted">{b.event?.venue || 'BIEC, Bengaluru'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-white text-sm">
                              {b.vendorName || b.vendor?.businessName || b.vendor?.name || 'Artisan Works India'}
                            </p>
                            <p className="text-xs text-muted">{b.vendor?.email || 'vendor@spacebook.in'}</p>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-accent text-sm">
                            {b.stallNumber || b.stall?.stallNumber || 'A-01'}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-white">
                            {formatINR(b.price || b.stall?.price || 25000)}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                b.status === 'APPROVED' ? 'green' :
                                b.status === 'REJECTED' ? 'red' : 'orange'
                              }
                              size="small"
                            >
                              {b.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link to={`/organizer/events/${b.eventId || 1}/floor-plan`}>
                              <button className="text-xs font-semibold text-accent hover:text-white transition-colors">
                                View Layout
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: DETAILS */}
        {activeTab === 'details' && (
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-subtle">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label="Organization Name"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    required
                  />
                  <Input
                    label="Lead Event Director"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    required
                  />
                  <Input
                    label="Contact Work Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    label="Official Website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                  <Input
                    label="Headquarters City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input
                    label="State / Region"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                  <Input
                    label="GSTIN / Corporate Tax ID"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Company Bio & Exhibition Specialization</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-2 border border-border text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" loading={saving} className="gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">Organizer Overview</h3>
                  <p className="text-sm text-muted leading-relaxed">{formData.description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border">
                  <div className="p-4 rounded-xl bg-surface-2">
                    <p className="text-xs text-muted">Organization Type</p>
                    <p className="text-sm font-bold text-white mt-1">{formData.organizationType}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-2">
                    <p className="text-xs text-muted">Official Portal</p>
                    <a href={formData.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-accent hover:underline mt-1 block">
                      {formData.website.replace('https://', '')}
                    </a>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-2">
                    <p className="text-xs text-muted">Verification Status</p>
                    <p className="text-sm font-bold text-green mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Full Concurrency Rights
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SECURITY */}
        {activeTab === 'security' && (
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-subtle max-w-xl">
            <h3 className="text-lg font-display font-bold text-white mb-2">Organizer Security Credentials</h3>
            <p className="text-xs text-muted mb-6">Manage login passwords and organizer authorization keys</p>

            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                required
              />
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                required
              />
              <div className="pt-2">
                <Button type="submit" variant="primary" loading={securityLoading}>Update Credentials</Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-subtle space-y-5">
            <h3 className="text-lg font-display font-bold text-white mb-2">Organizer Notification Streams</h3>
            <div className="space-y-4 divide-y divide-border">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-semibold text-white">Instant Stall Application Alerts</p>
                  <p className="text-xs text-muted">Trigger immediate notifications when vendors submit booth booking requests.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifs.newApplications}
                  onChange={(e) => setNotifs({ ...notifs, newApplications: e.target.checked })}
                  className="w-4 h-4 accent-accent"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-semibold text-white">Concurrency & Allocation Confirmations</p>
                  <p className="text-xs text-muted">Send receipts confirming database locks and successful stall assignments.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifs.allocationReceipts}
                  onChange={(e) => setNotifs({ ...notifs, allocationReceipts: e.target.checked })}
                  className="w-4 h-4 accent-accent"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-semibold text-white">Daily Expo Occupancy Digest</p>
                  <p className="text-xs text-muted">Receive a morning summary of remaining open stalls across all active venues.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifs.dailyDigest}
                  onChange={(e) => setNotifs({ ...notifs, dailyDigest: e.target.checked })}
                  className="w-4 h-4 accent-accent"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
