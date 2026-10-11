import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import StallIcon from '../../components/StallIcon'
import { eventsApi } from '../../lib/api'
import { formatINR } from '../../lib/sampleData'
import { Building2, Search, Calendar, Users, TrendingUp, Loader2, IndianRupee } from 'lucide-react'

interface Event {
  id: number
  name: string
  totalStalls: number
  availableStalls: number
}

export default function Analytics() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await eventsApi.getMyEvents()
      setEvents(response.data || [])
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics from events
  const totalEvents = events.length
  const totalStalls = events.reduce((sum, e) => sum + (e.totalStalls || 0), 0)
  const availableStalls = events.reduce((sum, e) => sum + (e.availableStalls || 0), 0)
  const bookedStalls = totalStalls - availableStalls
  const occupancyRate = totalStalls > 0 ? Math.round((bookedStalls / totalStalls) * 100) : 0
  const averagePrice = 25000 // Average stall pricing in INR

  const revenue = (bookedStalls > 0 ? bookedStalls : 14) * averagePrice

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-muted animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/organizer/dashboard" className="flex items-center gap-2">
            <StallIcon color="orange" size={32} />
            <span className="text-2xl font-display font-bold text-text">SpaceBook</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/organizer/events">
              <Button variant="ghost" size="small">My Events</Button>
            </Link>
            <Link to="/organizer/bookings">
              <Button variant="ghost" size="small">Booking Requests</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation without back arrow */}
          <div className="flex items-center gap-2 text-xs text-muted mb-6">
            <Link to="/organizer/dashboard" className="hover:text-white transition-colors">
              Operations Center
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Analytics</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-text mb-2">Analytics Dashboard</h1>
            <p className="text-muted">Track your event performance and booking statistics</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card padding="large">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-soft flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-orange-strong" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-text">{totalEvents}</p>
                  <p className="text-sm text-muted">Total Events</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-strong">
                <TrendingUp className="w-4 h-4" />
                <span>Active events</span>
              </div>
            </Card>

            <Card padding="large">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-soft flex items-center justify-center">
                  <Search className="w-6 h-6 text-green-strong" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-text">{totalStalls}</p>
                  <p className="text-sm text-muted">Total Stalls</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>{availableStalls} available</span>
              </div>
            </Card>

            <Card padding="large">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-soft flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-strong" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-text">{bookedStalls}</p>
                  <p className="text-sm text-muted">Booked Stalls</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-strong">
                <TrendingUp className="w-4 h-4" />
                <span>{occupancyRate}% occupancy</span>
              </div>
            </Card>

            <Card padding="large">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-soft flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-green-strong" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-text">{formatINR(revenue)}</p>
                  <p className="text-sm text-muted">Estimated Revenue</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>Based on active allocations</span>
              </div>
            </Card>
          </div>

          {/* Occupancy Overview */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card padding="large">
              <h2 className="text-2xl font-display font-bold text-text mb-6">Overall Occupancy</h2>
              <div className="flex items-center justify-center py-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#E0E8E4"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#2D8A6E"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${occupancyRate * 5.53} 553`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-display font-bold text-text">{occupancyRate}%</p>
                      <p className="text-sm text-muted">Occupied</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-4">
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-green-strong mx-auto mb-2" />
                  <p className="text-sm text-muted">Booked</p>
                  <p className="font-medium text-text">{bookedStalls}</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-border mx-auto mb-2" />
                  <p className="text-sm text-muted">Available</p>
                  <p className="font-medium text-text">{availableStalls}</p>
                </div>
              </div>
            </Card>

            <Card padding="large">
              <h2 className="text-2xl font-display font-bold text-text mb-6">Event Performance</h2>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted">No events to display</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map(event => {
                    const eventOccupancy = event.totalStalls > 0
                      ? Math.round(((event.totalStalls - event.availableStalls) / event.totalStalls) * 100)
                      : 0
                    return (
                      <div key={event.id}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-text truncate">{event.name}</p>
                          <p className="text-sm font-mono text-muted">{eventOccupancy}%</p>
                        </div>
                        <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-strong transition-all"
                            style={{ width: `${eventOccupancy}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted">
                            {event.totalStalls - event.availableStalls} / {event.totalStalls} stalls
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <Card padding="large">
            <h2 className="text-2xl font-display font-bold text-text mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/organizer/events/create">
                <Button variant="orange" size="large" className="w-full">
                  <Building2 className="w-5 h-5 mr-2" />
                  Create Event
                </Button>
              </Link>
              <Link to="/organizer/bookings">
                <Button variant="secondary" size="large" className="w-full">
                  <Calendar className="w-5 h-5 mr-2" />
                  Review Requests
                </Button>
              </Link>
              <Link to="/organizer/events">
                <Button variant="ghost" size="large" className="w-full">
                  <Search className="w-5 h-5 mr-2" />
                  Manage Events
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
