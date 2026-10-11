import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { bookingsApi } from '../../lib/api'
import { SAMPLE_BOOKINGS, formatINR } from '../../lib/sampleData'
import {
  Calendar,
  Loader2,
  Store,
  Compass
} from 'lucide-react'

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingsApi.getMyBookings()
      if (response.data && response.data.length > 0) {
        setBookings(response.data)
      } else {
        setBookings(SAMPLE_BOOKINGS)
      }
    } catch (error) {
      console.warn('Fallback bookings:', error)
      setBookings(SAMPLE_BOOKINGS)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking request? This will release your pending reservation.')) return

    try {
      setCancellingId(bookingId)
      await bookingsApi.cancelBooking(bookingId)
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b)
      )
    } catch (error) {
      alert('Failed to cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'ALL') return true
    return b.status === filterStatus
  })

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Just now'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white selection:bg-primary-strong">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              <Store className="w-3.5 h-3.5" />
              Exhibitor Allocations
            </div>
            <h1 className="text-4xl font-display font-extrabold text-white">
              My Stall Bookings
            </h1>
            <p className="text-muted mt-1 text-sm max-w-xl">
              Track allocation status, view venue layout links, and monitor organizer review milestones.
            </p>
          </div>

          <Link to="/vendor/events">
            <Button variant="primary" size="small" className="gap-2">
              <Compass className="w-4 h-4" />
              <span>Book Another Stall</span>
            </Button>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="bg-surface rounded-2xl border border-border p-3 mb-8 shadow-subtle flex flex-wrap gap-2">
          {['ALL', 'REQUESTED', 'APPROVED', 'REJECTED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_12px_rgba(183,148,246,0.3)]'
                  : 'bg-surface-2 text-muted hover:text-white border border-border/80'
              }`}
            >
              {st === 'ALL' ? 'All Bookings' : st}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-sm text-muted">Retrieving your booth requests...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4 border border-border">
              <Calendar className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">No bookings found</h3>
            <p className="text-sm text-muted mb-6">
              You haven't made any booking requests in this category yet. Explore active exhibitions and choose your space.
            </p>
            <Link to="/vendor/events">
              <Button variant="primary" size="small">Explore Events</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((b) => {
              const eventName = b.eventName || b.event?.name || 'India Tech & AI Expo 2026'
              const stallNum = b.stallNumber || b.stall?.stallNumber || 'A-01'
              const price = b.price || b.stall?.price || 25000
              const eventId = b.eventId || b.event?.id || 1

              return (
                <div
                  key={b.id}
                  className="bg-surface rounded-2xl border border-border p-6 shadow-subtle hover:border-primary/40 transition-colors flex flex-col lg:flex-row lg:items-start justify-between gap-6"
                >
                  <div className="flex-1 space-y-4">
                    {/* Header info */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        variant={
                          b.status === 'APPROVED' ? 'green' :
                          b.status === 'REJECTED' ? 'red' :
                          b.status === 'CANCELLED' ? 'gray' : 'orange'
                        }
                        size="medium"
                      >
                        {b.status}
                      </Badge>
                      <span className="text-xs font-mono text-muted">
                        Reference: #SB-2026-0{b.id}
                      </span>
                      <span className="text-xs text-muted">
                        Requested on {formatDate(b.requestedDate || b.createdAt)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-display font-bold text-white mb-1">
                        {eventName}
                      </h3>
                      <p className="text-xs text-muted">
                        Exhibition Complex • Guaranteed atomic single-stall assignment
                      </p>
                    </div>

                    {/* Specification Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-2 border border-border/80">
                      <div>
                        <p className="text-[11px] text-muted">Allocated Stall</p>
                        <p className="text-base font-bold font-mono text-primary mt-0.5">{stallNum}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted">Dimensions</p>
                        <p className="text-sm font-semibold text-white mt-0.5">{b.stall?.dimensions || '3m × 3m (10x10 ft)'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted">Category</p>
                        <p className="text-sm font-semibold text-white mt-0.5">{b.category || b.stall?.category || 'Standard'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted">Fee Amount</p>
                        <p className="text-base font-bold font-mono text-green mt-0.5">{formatINR(price)}</p>
                      </div>
                    </div>

                    {b.rejectionReason && (
                      <div className="p-3.5 rounded-xl bg-red-soft border border-red/40 text-red text-xs">
                        <strong className="block mb-0.5 font-semibold">Organizer Feedback:</strong>
                        {b.rejectionReason}
                      </div>
                    )}

                    {/* Booking Progress Timeline */}
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                        Booking Lifecycle
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-green" />
                          <span className="text-white font-medium">Submitted</span>
                        </div>
                        <div className="w-6 h-0.5 bg-border" />

                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${b.status !== 'REQUESTED' ? 'bg-green' : 'bg-orange animate-pulse'}`} />
                          <span className={b.status !== 'REQUESTED' ? 'text-white' : 'text-orange font-medium'}>Review</span>
                        </div>
                        <div className="w-6 h-0.5 bg-border" />

                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              b.status === 'APPROVED' ? 'bg-green' :
                              b.status === 'REJECTED' ? 'bg-red' :
                              b.status === 'CANCELLED' ? 'bg-muted' : 'bg-surface-2'
                            }`}
                          />
                          <span className="text-muted">
                            {b.status === 'APPROVED' ? 'Allocated' : b.status === 'REJECTED' ? 'Declined' : 'Decision'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex lg:flex-col gap-2.5 shrink-0 self-start w-full lg:w-44">
                    <Link to={`/vendor/events/${eventId}`} className="w-full">
                      <Button variant="secondary" size="small" className="w-full">
                        View Floor Plan
                      </Button>
                    </Link>

                    {b.status === 'REQUESTED' && (
                      <Button
                        variant="ghost"
                        size="small"
                        loading={cancellingId === b.id}
                        onClick={() => handleCancel(b.id)}
                        className="w-full text-red hover:bg-red-soft/30 hover:text-red"
                      >
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
