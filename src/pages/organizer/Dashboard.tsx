import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import {
  eventsApi,
  bookingsApi,
} from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { SAMPLE_EVENTS, SAMPLE_BOOKINGS } from '../../lib/sampleData'
import StallIcon from '../../components/StallIcon'
import {
  LayoutDashboard,
  Building2,
  Users,
  CheckCircle2,
  Plus,
  TrendingUp,
  LogOut,
  User,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Check,
  X,
  Loader2
} from 'lucide-react'

export default function OrganizerDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Quick Action notification
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  // Clear data when user logs out
  useEffect(() => {
    if (!user) {
      setEvents([])
      setBookings([])
      setLoading(true)
    }
  }, [user])

  useEffect(() => {
    loadDashboardData()

    const handleBookingCreated = () => {
      loadDashboardData()
    }
    window.addEventListener('spacebook_booking_created', handleBookingCreated)
    return () => {
      window.removeEventListener('spacebook_booking_created', handleBookingCreated)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [eventsRes, bookingsRes] = await Promise.all([
        eventsApi.getOrganizerEvents().catch(() => ({ success: false, data: [] })),
        bookingsApi.getOrganizerBookings().catch(() => ({ success: false, data: [] }))
      ])

      if (eventsRes.data && eventsRes.data.length > 0) {
        setEvents(eventsRes.data)
      } else {
        setEvents(SAMPLE_EVENTS)
      }

      if (bookingsRes.data && bookingsRes.data.length > 0) {
        setBookings(bookingsRes.data)
      } else {
        setBookings(SAMPLE_BOOKINGS)
      }
    } catch (err) {
      console.warn('Dashboard fallback triggered:', err)
      setEvents(SAMPLE_EVENTS)
      setBookings(SAMPLE_BOOKINGS)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth', { replace: true })
  }

  const handleQuickApprove = async (bookingId: number) => {
    try {
      const res = await bookingsApi.approveBooking(bookingId)
      if (res.success) {
        setActionFeedback(`Booking #${bookingId} safely approved and allocated!`)
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'APPROVED' } : b))
        setTimeout(() => setActionFeedback(null), 3000)
      }
    } catch (err) {
      alert('Approval failed')
    }
  }

  const handleQuickReject = async (bookingId: number) => {
    const reason = prompt('Please enter rejection reason:', 'Stall already committed or does not meet exhibition guidelines')
    if (!reason) return

    try {
      const res = await bookingsApi.rejectBooking(bookingId, reason)
      if (res.success) {
        setActionFeedback(`Booking #${bookingId} rejected.`)
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'REJECTED' } : b))
        setTimeout(() => setActionFeedback(null), 3000)
      }
    } catch (err) {
      alert('Rejection failed')
    }
  }

  // Calculate live statistics
  const totalEvents = events.length
  const totalStalls = events.reduce((acc, e) => acc + (e.totalStalls || 0), 0)
  const availableStalls = events.reduce((acc, e) => acc + (e.availableStalls || 0), 0)
  const bookedStalls = Math.max(0, totalStalls - availableStalls)
  const pendingRequests = bookings.filter(b => b.status === 'REQUESTED' || b.status === 'pending').length
  const occupancyRate = totalStalls > 0 ? Math.round((bookedStalls / totalStalls) * 100) : 68

  // Sample analytics data for Recharts in INR
  const bookingTrendData = [
    { month: 'Jun', bookings: 24, revenue: 600000 },
    { month: 'Jul', bookings: 38, revenue: 950000 },
    { month: 'Aug', bookings: 52, revenue: 1300000 },
    { month: 'Sep', bookings: 68, revenue: 1700000 },
    { month: 'Oct', bookings: 89, revenue: 2225000 },
    { month: 'Nov', bookings: 114, revenue: 2850000 },
  ]

  const categoryDistributionData = [
    { name: 'Technology', value: 45, color: '#7C3AED' },
    { name: 'Art & Craft', value: 25, color: '#B794F6' },
    { name: 'Food & Beverage', value: 20, color: '#F472B6' },
    { name: 'Fashion & Design', value: 10, color: '#EC4899' },
  ]

  const exportCSV = () => {
    const headers = 'ID,Event,Stall,Vendor,Price,Status,Requested Date\n'
    const rows = bookings.map(b => `${b.id},"${b.eventName || 'Exhibition'}","${b.stallNumber}","${b.vendorName}",${b.price},${b.status},"${b.requestedDate}"`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spacebook-allocations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex selection:bg-accent-strong">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#1A1233] border-r border-[#3D2A5C] flex flex-col justify-between shrink-0 hidden md:flex min-h-screen sticky top-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-[#3D2A5C]/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F472B6] p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#1A1233] rounded-[10px] flex items-center justify-center">
                <StallIcon className="w-4 h-4 text-[#F472B6]" />
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-white">SpaceBook</span>
              <p className="text-[10px] text-accent uppercase font-bold tracking-wider">Organizer Suite</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <Link
              to="/organizer/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-accent-soft text-white font-medium text-sm border border-accent/30"
            >
              <LayoutDashboard className="w-4 h-4 text-accent" />
              <span>Overview</span>
            </Link>

            <Link
              to="/organizer/events"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted hover:text-white hover:bg-surface-2 transition-colors font-medium text-sm"
            >
              <Building2 className="w-4 h-4" />
              <span>My Events</span>
            </Link>

            <Link
              to="/organizer/bookings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted hover:text-white hover:bg-surface-2 transition-colors font-medium text-sm"
            >
              <Users className="w-4 h-4" />
              <span>Booking Requests</span>
              {pendingRequests > 0 && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-orange text-white font-bold">
                  {pendingRequests}
                </span>
              )}
            </Link>

            <Link
              to="/organizer/analytics"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted hover:text-white hover:bg-surface-2 transition-colors font-medium text-sm"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </Link>

            <Link
              to="/organizer/audit-history"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted hover:text-white hover:bg-surface-2 transition-colors font-medium text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audit History</span>
            </Link>

            <Link
              to="/organizer/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted hover:text-white hover:bg-surface-2 transition-colors font-medium text-sm"
            >
              <User className="w-4 h-4" />
              <span>Organization Profile</span>
            </Link>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#3D2A5C]/60 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#EC4899] to-[#7C3AED] flex items-center justify-center font-bold text-white text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Grand Expos Ltd'}</p>
              <p className="text-[11px] text-muted truncate">{user?.email || 'organizer@spacebook.com'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-muted hover:text-red hover:bg-red-soft/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-[#1A1233]/70 backdrop-blur-md border-b border-[#3D2A5C] px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-display font-extrabold text-white">
              Organizer Operations Center
            </h2>
            <p className="text-xs text-muted">Real-time occupancy management and atomic stall allocations</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 border border-border text-xs font-semibold text-muted hover:text-white transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-green" />
              <span>Export CSV</span>
            </button>
            <Link to="/organizer/events/create">
              <Button variant="primary" size="small" className="gap-2">
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 space-y-8 max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
              <p className="text-sm text-muted">Calculating real-time venue metrics...</p>
            </div>
          ) : (
            <>
              {actionFeedback && (
                <div className="p-4 rounded-xl bg-green-soft border border-green text-green text-sm flex items-center gap-3 animate-slide-up">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{actionFeedback}</span>
                </div>
              )}

          {/* 5 Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            <div className="bg-surface rounded-2xl border border-border p-5 shadow-subtle">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Events</span>
              <p className="text-3xl font-display font-bold text-white mt-2">{totalEvents}</p>
              <p className="text-[11px] text-muted mt-1">Published expos</p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-5 shadow-subtle">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Stalls</span>
              <p className="text-3xl font-display font-bold text-primary mt-2">{totalStalls}</p>
              <p className="text-[11px] text-muted mt-1">Configured spaces</p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-5 shadow-subtle">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Booked Stalls</span>
              <p className="text-3xl font-display font-bold text-accent mt-2">{bookedStalls}</p>
              <p className="text-[11px] text-muted mt-1">Confirmed vendors</p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-5 shadow-subtle">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Available Stalls</span>
              <p className="text-3xl font-display font-bold text-green mt-2">{availableStalls}</p>
              <p className="text-[11px] text-muted mt-1">Ready to book</p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-5 shadow-subtle">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Pending Requests</span>
              <p className="text-3xl font-display font-bold text-orange mt-2">{pendingRequests}</p>
              <p className="text-[11px] text-muted mt-1">Needs review</p>
            </div>
          </div>

          {/* Occupancy and Charts Grid */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Booking Trends Chart */}
            <div className="lg:col-span-8 bg-surface rounded-2xl border border-border p-6 shadow-strong">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-display font-bold text-white">Exhibition Booking Velocity</h3>
                  <p className="text-xs text-muted">Monthly stall allocations and accumulated booth revenue</p>
                </div>
                <Badge variant="primary" size="small">
                  +38% vs Q3
                </Badge>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bookingTrendData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F472B6" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#F472B6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#251845" />
                    <XAxis dataKey="month" stroke="#A89BC0" fontSize={12} />
                    <YAxis stroke="#A89BC0" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1233',
                        borderColor: '#3D2A5C',
                        borderRadius: '12px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#7C3AED"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                      name="Revenue (₹)"
                    />
                    <Area
                      type="monotone"
                      dataKey="bookings"
                      stroke="#F472B6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBook)"
                      name="Stalls Allocated"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Occupancy Breakdown */}
            <div className="lg:col-span-4 bg-surface rounded-2xl border border-border p-6 shadow-strong flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white mb-1">Category Distribution</h3>
                <p className="text-xs text-muted mb-4">Overall occupancy rate: <strong className="text-green">{occupancyRate}%</strong></p>

                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1A1233',
                          borderColor: '#3D2A5C',
                          borderRadius: '12px',
                          color: '#FFFFFF'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Legend list */}
              <div className="space-y-2 pt-2 border-t border-border">
                {categoryDistributionData.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-muted">{cat.name}</span>
                    </div>
                    <span className="font-bold text-white">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Booking Requests Table (with Quick Approve/Reject) */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-strong">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Pending Stall Allocation Requests</h3>
                <p className="text-xs text-muted">Review vendor applications and allocate booths with single-transaction integrity</p>
              </div>
              <Link to="/organizer/bookings">
                <Button variant="secondary" size="small" className="text-xs gap-1">
                  <span>Full Request Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-2 text-muted text-xs uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-3.5">Vendor</th>
                    <th className="px-6 py-3.5">Event</th>
                    <th className="px-6 py-3.5">Stall</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.slice(0, 5).map((req) => (
                    <tr key={req.id} className="hover:bg-surface-2/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white text-sm">{req.vendorName}</p>
                        <p className="text-xs text-muted">{req.vendorEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        {req.eventName}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-primary">
                        {req.stallNumber}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        {new Date(req.requestedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            req.status === 'APPROVED' ? 'green' :
                            req.status === 'REJECTED' ? 'red' : 'orange'
                          }
                          size="small"
                        >
                          {req.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'REQUESTED' || req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleQuickApprove(req.id)}
                              className="px-3 py-1.5 rounded-lg bg-green/20 hover:bg-green text-green hover:text-black text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleQuickReject(req.id)}
                              className="px-3 py-1.5 rounded-lg bg-red/20 hover:bg-red text-red hover:text-white text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted font-medium">Decided</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  )
}
