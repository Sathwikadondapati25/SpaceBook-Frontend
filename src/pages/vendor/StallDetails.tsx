import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import StallIcon from '../../components/StallIcon'
import { eventsApi, stallsApi, bookingsApi } from '../../lib/api'
import { formatINR } from '../../lib/sampleData'
import { MapPin, Calendar, Check, Loader2, AlertCircle } from 'lucide-react'

interface Event {
  id: number
  name: string
  venue: string
  city: string
  startDate: string
  endDate: string
}

interface Stall {
  id: number
  stallNumber: string
  dimensions: string
  price: number
  category: string
  facilities: string[]
  gridRow: number
  gridCol: number
  isAvailable: boolean
}

export default function StallDetails() {
  const { eventId, stallId } = useParams<{ eventId: string; stallId: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [stall, setStall] = useState<Stall | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (eventId && stallId) {
      loadStallData()
    }
  }, [eventId, stallId])

  const loadStallData = async () => {
    try {
      setLoading(true)
      const [eventResponse, stallResponse] = await Promise.all([
        eventsApi.getEvent(Number(eventId)),
        stallsApi.getStall(Number(eventId), Number(stallId))
      ])
      setEvent(eventResponse.data)
      setStall(stallResponse.data)
    } catch (error) {
      console.error('Failed to load stall data:', error)
      setError('Failed to load stall information')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stall || !eventId) return

    try {
      setSubmitting(true)
      setError('')

      await bookingsApi.createBooking({
        stallId: stall.id,
        eventId: Number(eventId),
        message: message || undefined,
      })

      // Navigate to bookings page on success
      navigate('/vendor/bookings')
    } catch (error: any) {
      console.error('Failed to submit booking:', error)
      setError(error.response?.data?.message || 'Failed to submit booking request')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-muted animate-spin" />
      </div>
    )
  }

  if (!stall || !event) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Card padding="large">
          <p className="text-muted">Stall not found</p>
          <Link to={`/vendor/events/${eventId}`}>
            <Button variant="primary" className="mt-4">Back to Event</Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (!stall.isAvailable) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Card padding="large" className="max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-soft flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-strong" />
            </div>
            <h3 className="text-xl font-display font-bold text-text mb-2">Stall Not Available</h3>
            <p className="text-muted mb-6">This stall is already booked or unavailable.</p>
            <Link to={`/vendor/events/${eventId}`}>
              <Button variant="primary">Back to Event</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/vendor/events" className="flex items-center gap-2">
            <StallIcon color="green" size={32} />
            <span className="text-2xl font-display font-bold text-text">SpaceBook</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/vendor/dashboard">
              <Button variant="ghost" size="small">Dashboard</Button>
            </Link>
            <Link to="/vendor/bookings">
              <Button variant="ghost" size="small">My Bookings</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation without back arrow */}
          <div className="flex items-center gap-2 text-xs text-muted mb-6">
            <Link to="/vendor/events" className="hover:text-white transition-colors">
              Events
            </Link>
            <span>/</span>
            <Link to={`/vendor/events/${eventId}`} className="hover:text-white transition-colors">
              {event.name}
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Stall {stall.stallNumber}</span>
          </div>

          {/* Stall Header */}
          <Card padding="large" className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge variant="green" size="medium" className="mb-2">Available</Badge>
                <h1 className="text-4xl font-display font-bold text-text mb-2">
                  Stall {stall.stallNumber}
                </h1>
                <p className="text-muted">{event.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted mb-1">Tariff (excl. GST)</p>
                <p className="text-4xl font-display font-bold text-green-strong">{formatINR(stall.price)}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-muted" />
                </div>
                <div>
                  <p className="text-sm text-muted">Venue</p>
                  <p className="font-medium text-text">{event.venue}</p>
                  <p className="text-sm text-muted">{event.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-muted" />
                </div>
                <div>
                  <p className="text-sm text-muted">Event Date</p>
                  <p className="font-medium text-text">{formatDate(event.startDate)}</p>
                  <p className="text-sm text-muted">to {formatDate(event.endDate)}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Stall Details */}
            <Card padding="large">
              <h2 className="text-2xl font-display font-bold text-text mb-6">Stall Details</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted mb-1">Dimensions</p>
                  <p className="text-lg font-medium text-text">{stall.dimensions}</p>
                </div>

                <div>
                  <p className="text-sm text-muted mb-1">Category</p>
                  <Badge variant="blue" size="medium">{stall.category}</Badge>
                </div>

                <div>
                  <p className="text-sm text-muted mb-1">Location</p>
                  <p className="text-lg font-medium text-text">
                    Row {stall.gridRow}, Column {stall.gridCol}
                  </p>
                </div>

                {stall.facilities.length > 0 && (
                  <div>
                    <p className="text-sm text-muted mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {stall.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-strong" />
                          <span className="text-sm text-text">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Booking Form */}
            <Card padding="large">
              <h2 className="text-2xl font-display font-bold text-text mb-6">Request Booking</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Message to Organizer (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add any special requests or notes for the organizer..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-green-strong/30 resize-none"
                  />
                  <p className="text-xs text-muted mt-1">
                    This message will be visible to the event organizer
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-soft border border-red-strong rounded-lg">
                    <p className="text-sm text-red-strong">{error}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-text">Total</span>
                    <span className="text-2xl font-display font-bold text-green-strong">{formatINR(stall.price)}</span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Booking Request'
                    )}
                  </Button>

                  <p className="text-xs text-muted text-center mt-3">
                    By submitting, you agree to the event organizer's terms and conditions
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
