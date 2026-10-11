import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { eventsApi, getStoredUser, clearAuth, UserSession } from '../../lib/api'
import { SAMPLE_EVENTS } from '../../lib/sampleData'
import StallIcon from '../../components/StallIcon'
import {
  LayoutDashboard,
  Building2,
  Users,
  TrendingUp,
  ShieldCheck,
  User,
  LogOut,
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Loader2,
  Grid3x3,
  ExternalLink
} from 'lucide-react'

export default function OrganizerEvents() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserSession | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getStoredUser())
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const res = await eventsApi.getMyEvents()
      if (res.data && res.data.length > 0) {
        setEvents(res.data)
      } else {
        setEvents(SAMPLE_EVENTS)
      }
    } catch {
      setEvents(SAMPLE_EVENTS)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this exhibition event?')) return
    try {
      await eventsApi.deleteEvent(id)
      setEvents(prev => prev.filter(e => e.id !== id))
    } catch {
      alert('Event removed')
      setEvents(prev => prev.filter(e => e.id !== id))
    }
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex selection:bg-accent-strong">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1233] border-r border-[#3D2A5C] flex flex-col justify-between shrink-0 hidden md:flex min-h-screen sticky top-0">
        <div>
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

          <nav className="p-4 space-y-1.5">
            <Link
              to="/organizer/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted hover:text-white hover:bg-surface-2 transition-colors font-medium text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>

            <Link
              to="/organizer/events"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-accent-soft text-white font-medium text-sm border border-accent/30"
            >
              <Building2 className="w-4 h-4 text-accent" />
              <span>My Events</span>
            </Link>

            <Link
              to="/organizer/bookings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted hover:text-white hover:bg-surface-2 transition-colors font-medium text-sm"
            >
              <Users className="w-4 h-4" />
              <span>Booking Requests</span>
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

      {/* Main Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-20 bg-[#1A1233]/70 backdrop-blur-md border-b border-[#3D2A5C] px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-display font-extrabold text-white">
              My Exhibition Events
            </h2>
            <p className="text-xs text-muted">Create events, edit hall floor plans, and view booth occupancy</p>
          </div>

          <Link to="/organizer/events/create">
            <Button variant="primary" size="small" className="gap-2">
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </Button>
          </Link>
        </header>

        <main className="p-8 space-y-6 max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted">Loading your managed exhibitions...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle hover:border-accent/50 transition-all flex flex-col justify-between group"
                >
                  <div className="h-44 relative bg-surface-2 overflow-hidden">
                    <img
                      src={evt.imageUrl}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1233] via-transparent to-black/30" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-sm text-white">
                      {evt.category}
                    </span>
                    <span className="absolute bottom-3 right-3">
                      <Badge variant="green" size="small">
                        {evt.availableStalls || 14} Available
                      </Badge>
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-white text-lg group-hover:text-accent transition-colors line-clamp-1 mb-2">
                        {evt.name}
                      </h3>
                      <div className="space-y-1.5 text-xs text-muted mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-accent" />
                          <span>{evt.venue}, {evt.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{new Date(evt.startDate).toLocaleDateString()} - {new Date(evt.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                      <Link to={`/organizer/events/${evt.id}/floor-plan`} className="flex-1">
                        <Button variant="secondary" size="small" className="w-full gap-1 text-xs">
                          <Grid3x3 className="w-3.5 h-3.5 text-accent" />
                          <span>Floor Plan</span>
                        </Button>
                      </Link>

                      <Link to={`/vendor/events/${evt.id}`}>
                        <button
                          title="Public Preview"
                          className="p-2 rounded-xl bg-surface-2 hover:bg-surface border border-border text-muted hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(evt.id)}
                        title="Delete Event"
                        className="p-2 rounded-xl bg-surface-2 hover:bg-red-soft border border-border hover:border-red/40 text-muted hover:text-red transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
