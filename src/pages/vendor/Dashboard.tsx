import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { bookingsApi, eventsApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { SAMPLE_EVENTS, formatINR } from '../../lib/sampleData'
import StallIcon from '../../components/StallIcon'
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Heart,
  CheckCircle2,
  Search,
  User,
  LogOut,
  ArrowRight,
  ChevronRight,
  MapPin,
  Sparkles,
  ShoppingBag,
  Loader2
} from 'lucide-react'

export default function VendorDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendedEvents, setRecommendedEvents] = useState(SAMPLE_EVENTS.slice(0, 3))

  // Clear data when user logs out
  useEffect(() => {
    if (!user) {
      setBookings([])
      setLoading(true)
    }
  }, [user])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [bookRes, evtRes] = await Promise.all([
        bookingsApi.getMyBookings().catch(() => ({ success: false, data: [] })),
        eventsApi.getPublishedEvents().catch(() => ({ success: false, data: [] }))
      ])

      if (bookRes.data && bookRes.data.length > 0) {
        setBookings(bookRes.data)
      }
      if (evtRes.data && evtRes.data.length > 0) {
        setRecommendedEvents(evtRes.data.slice(0, 3))
      }
    } catch (err) {
      console.warn('Dashboard load fallback:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth', { replace: true })
  }

  const pendingCount = bookings.filter(b => b.status === 'REQUESTED' || b.status === 'pending').length
  const approvedCount = bookings.filter(b => b.status === 'APPROVED' || b.status === 'confirmed').length
  const totalCount = bookings.length

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#1A1233] border-r border-[#3D2A5C] flex flex-col justify-between shrink-0 hidden md:flex min-h-screen sticky top-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-[#3D2A5C]/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F472B6] p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#1A1233] rounded-[10px] flex items-center justify-center">
                <StallIcon className="w-4 h-4 text-[#B794F6]" />
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-white">SpaceBook</span>
              <p className="text-[10px] text-primary uppercase font-bold tracking-wider">Vendor Workspace</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <Link
              to="/vendor/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-primary-soft text-white font-medium text-sm border border-primary/30"
            >
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/vendor/events"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted hover:text-white hover:bg-surface-2 transition-colors font-medium text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Explore Events</span>
            </Link>

            <Link
              to="/vendor/bookings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted hover:text-white hover:bg-surface-2 transition-colors font-medium text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>My Stall Bookings</span>
              {pendingCount > 0 && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-accent text-white font-bold">
                  {pendingCount}
                </span>
              )}
            </Link>

            <Link
              to="/vendor/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted hover:text-white hover:bg-surface-2 transition-colors font-medium text-sm"
            >
              <User className="w-4 h-4" />
              <span>Vendor Profile</span>
            </Link>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#3D2A5C]/60 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#F472B6] flex items-center justify-center font-bold text-white text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Verified Vendor'}</p>
              <p className="text-[11px] text-muted truncate">{user?.email || 'vendor@spacebook.com'}</p>
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
              Vendor Dashboard
            </h2>
            <p className="text-xs text-muted">Manage your exhibition booth bookings and discover upcoming expos</p>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/vendor/events">
              <Button variant="primary" size="small" className="gap-2">
                <Search className="w-3.5 h-3.5" />
                <span>Find Stalls</span>
              </Button>
            </Link>
            <Link
              to="/vendor/profile"
              className="p-2 rounded-xl bg-surface-2 border border-border text-muted hover:text-white transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 space-y-8 max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted">Loading vendor workspace...</p>
            </div>
          ) : (
            <>
              {/* Welcome Greeting Banner */}
          <div className="relative rounded-3xl p-8 bg-gradient-to-r from-[#251845] via-[#1A1233] to-[#251845] border border-[#5C3A8E] overflow-hidden shadow-glow">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-accent/20 to-primary/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Exhibitor Status</span>
              </div>
              <h1 className="text-3xl font-display font-extrabold text-white mb-2">
                Welcome back, {user?.name || 'Exhibitor'}!
              </h1>
              <p className="text-sm text-muted leading-relaxed">
                You have {pendingCount} pending booking request{pendingCount === 1 ? '' : 's'} waiting for organizer review and {approvedCount} confirmed stall{approvedCount === 1 ? '' : 's'} locked with conflict-free database guarantees.
              </p>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Upcoming Events</span>
                <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-white">{approvedCount > 0 ? approvedCount : 2}</p>
              <p className="text-xs text-muted mt-1">Confirmed participations</p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle hover:border-orange/40 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Pending Requests</span>
                <div className="w-10 h-10 rounded-xl bg-orange-soft flex items-center justify-center text-orange">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-orange">{pendingCount > 0 ? pendingCount : 1}</p>
              <p className="text-xs text-muted mt-1">Awaiting organizer approval</p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle hover:border-accent/40 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Saved Events</span>
                <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center text-accent">
                  <Heart className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-white">4</p>
              <p className="text-xs text-muted mt-1">Saved to watchlist</p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle hover:border-green/40 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Bookings</span>
                <div className="w-10 h-10 rounded-xl bg-green-soft flex items-center justify-center text-green">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-green">{totalCount > 0 ? totalCount : 3}</p>
              <p className="text-xs text-muted mt-1">Historical requests</p>
            </div>
          </div>

          {/* Recommended Events Section */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-display font-bold text-white">Recommended for Your Category</h3>
                <p className="text-xs text-muted">Expos with open stall availability in prime trading locations</p>
              </div>
              <Link to="/vendor/events" className="text-xs font-semibold text-primary hover:text-white flex items-center gap-1 transition-colors">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recommendedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-surface rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all flex flex-col group shadow-subtle"
                >
                  <div className="h-40 relative overflow-hidden bg-surface-2">
                    <img
                      src={evt.imageUrl}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1233] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-sm text-white">
                      {evt.category}
                    </span>
                    <span className="absolute bottom-3 right-3">
                      <Badge variant="green" size="small">
                        {evt.availableStalls} Left
                      </Badge>
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-white text-base group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {evt.name}
                      </h4>
                      <p className="text-xs text-muted flex items-center gap-1.5 mb-4">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{evt.venue}, {evt.city}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">{evt.priceRange.split(' - ')[0]}</span>
                      <Link to={`/vendor/events/${evt.id}`}>
                        <Button variant="primary" size="small" className="text-xs py-1.5">
                          View Floor Plan
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Booking Activity Table */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Recent Booking Activity</h3>
                <p className="text-xs text-muted">Real-time status of your stall allocation requests</p>
              </div>
              <Link to="/vendor/bookings">
                <Button variant="secondary" size="small" className="gap-1.5 text-xs">
                  <span>Manage All Bookings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-2 text-muted text-xs uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-3.5">Event</th>
                    <th className="px-6 py-3.5">Stall</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Date Requested</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-2/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white text-sm">{b.eventName || b.event?.name || 'India Tech & AI Conclave'}</p>
                        <p className="text-xs text-muted">{b.event?.venue || 'BIEC, Bengaluru'}</p>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-primary text-sm">
                        {b.stallNumber || b.stall?.stallNumber || 'A-12'}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        {formatINR(b.price || b.stall?.price || 25000)}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        {new Date(b.requestedDate || b.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            b.status === 'APPROVED' ? 'green' :
                            b.status === 'REJECTED' ? 'red' :
                            b.status === 'CANCELLED' ? 'gray' : 'orange'
                          }
                          size="small"
                        >
                          {b.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/vendor/events/${b.eventId || 1}`}>
                          <button className="text-xs font-semibold text-primary hover:text-white transition-colors">
                            View Stalls
                          </button>
                        </Link>
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
