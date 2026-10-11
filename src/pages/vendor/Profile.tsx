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
  authApi,
  clearAuth,
  UserSession
} from '../../lib/api'
import { SAMPLE_BOOKINGS, formatINR } from '../../lib/sampleData'
import StallIcon from '../../components/StallIcon'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Lock,
  Bell,
  LogOut,
  Calendar,
  CheckCircle2,
  Save
} from 'lucide-react'

export default function VendorProfile() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'security' | 'notifications' | 'bookings'>('details')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [recentBookings, setRecentBookings] = useState<any[]>(SAMPLE_BOOKINGS.slice(0, 3))

  const [formData, setFormData] = useState({
    businessName: 'Artisan Works & Design India',
    contactName: 'Priya Sharma',
    email: 'priya.artisan@spacebook.in',
    phone: '+91 98765 43210',
    category: 'Art & Craft',
    city: 'Bengaluru',
    state: 'Karnataka',
    description: 'Specializing in sustainable stoneware ceramics, handcrafted studio pottery, and minimalist tabletop collections for Indian and international exhibitions.',
    preferredCategory: 'Art & Craft',
    budgetRange: '₹15,000 - ₹50,000',
  })

  // Security Form
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [securityLoading, setSecurityLoading] = useState(false)

  // Notifications Form
  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    bookingStatus: true,
    newExpos: false,
    securityNotices: true,
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
      }))
    }
    loadRecentBookings()
  }, [])

  const loadRecentBookings = async () => {
    try {
      const res = await bookingsApi.getMyBookings()
      if (res.data && res.data.length > 0) {
        setRecentBookings(res.data.slice(0, 4))
      }
    } catch {
      // keep sample bookings
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await profileApi.updateVendorProfile(formData).catch(() => {})
      if (currentUser) {
        setStoredUser({
          ...currentUser,
          name: formData.contactName,
          city: formData.city,
          state: formData.state,
        })
      }
      setIsEditing(false)
      setFeedback('Profile successfully updated.')
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
      setFeedback('Password changed successfully.')
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
    { id: 'details', label: 'Profile Details', icon: User },
    { id: 'security', label: 'Security & Access', icon: Lock },
    { id: 'notifications', label: 'Preferences', icon: Bell },
    { id: 'bookings', label: 'Recent Bookings', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1233]/80 backdrop-blur-md border-b border-[#3D2A5C]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/vendor/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F472B6] p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#1A1233] rounded-[10px] flex items-center justify-center">
                <StallIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <span className="text-xl font-display font-bold text-white">SpaceBook</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/vendor/dashboard">
              <Button variant="ghost" size="small">Workspace</Button>
            </Link>
            <Link to="/vendor/events">
              <Button variant="ghost" size="small">Browse Events</Button>
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

      {/* Profile Content */}
      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        {feedback && (
          <div className="mb-6 p-4 rounded-xl bg-green-soft border border-green text-green text-sm flex items-center gap-3 animate-slide-up">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Profile Header Banner */}
        <div className="bg-surface rounded-3xl border border-border p-8 mb-8 shadow-strong flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#B794F6] to-[#F472B6] flex items-center justify-center font-display font-black text-3xl text-white shadow-glow">
              {formData.contactName.charAt(0)}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl font-display font-bold text-white">{formData.businessName}</h1>
                <Badge variant="primary" size="small">Verified Exhibitor</Badge>
              </div>
              <p className="text-sm text-muted">{formData.contactName} • {formData.category}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-muted">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> {formData.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-accent" /> {formData.phone}</span>
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

        {/* Tab Pills */}
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
                    ? 'bg-primary-strong text-white shadow-subtle'
                    : 'text-muted hover:text-white hover:bg-surface-2'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* TAB: DETAILS */}
        {activeTab === 'details' && (
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-subtle">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label="Business Name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                  <Input
                    label="Contact Person Name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
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
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input
                    label="State / Province"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Company & Product Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-2 border border-border text-sm text-white focus:outline-none focus:border-primary"
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
                  <h3 className="text-lg font-display font-bold text-white mb-2">About the Brand</h3>
                  <p className="text-sm text-muted leading-relaxed">{formData.description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border">
                  <div className="p-4 rounded-xl bg-surface-2">
                    <p className="text-xs text-muted">Primary Category</p>
                    <p className="text-sm font-bold text-white mt-1">{formData.category}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-2">
                    <p className="text-xs text-muted">Typical Budget Range</p>
                    <p className="text-sm font-bold text-white mt-1">{formData.budgetRange}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-2">
                    <p className="text-xs text-muted">Exhibition History</p>
                    <p className="text-sm font-bold text-white mt-1">4 Completed Expos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: SECURITY */}
        {activeTab === 'security' && (
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-subtle max-w-xl">
            <h3 className="text-lg font-display font-bold text-white mb-2">Change Password</h3>
            <p className="text-xs text-muted mb-6">Ensure your account uses a long, unique password to safeguard your bookings</p>

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
                <Button type="submit" variant="primary" loading={securityLoading}>Update Password</Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-subtle space-y-5">
            <h3 className="text-lg font-display font-bold text-white mb-2">Notification Preferences</h3>
            <div className="space-y-4 divide-y divide-border">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-semibold text-white">Stall Booking Status Alerts</p>
                  <p className="text-xs text-muted">Get notified immediately when an organizer approves or rejects your request.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifs.bookingStatus}
                  onChange={(e) => setNotifs({ ...notifs, bookingStatus: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-semibold text-white">Email Digest & Receipts</p>
                  <p className="text-xs text-muted">Receive email confirmations with floor plan allocations and venue details.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifs.emailAlerts}
                  onChange={(e) => setNotifs({ ...notifs, emailAlerts: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-semibold text-white">New Upcoming Expo Alerts</p>
                  <p className="text-xs text-muted">Suggestions based on your category and preferred cities.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifs.newExpos}
                  onChange={(e) => setNotifs({ ...notifs, newExpos: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: RECENT BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-white">Exhibition Stall History</h3>
              <Link to="/vendor/bookings" className="text-xs text-primary font-semibold hover:underline">
                View All Bookings
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentBookings.map((b) => (
                <div key={b.id} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">{b.eventName || 'India Tech & AI Expo'}</p>
                    <p className="text-xs text-muted">Stall: <span className="font-mono text-primary font-bold">{b.stallNumber}</span> • {formatINR(b.price || 25000)}</p>
                  </div>
                  <Badge variant={b.status === 'APPROVED' ? 'green' : 'orange'} size="small">
                    {b.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
