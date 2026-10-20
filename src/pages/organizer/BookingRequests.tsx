import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { bookingsApi, getStoredUser, clearAuth, UserSession } from '../../lib/api'
import {
  LayoutGrid,
  Building2,
  Users,
  TrendingUp,
  ShieldCheck,
  User,
  LogOut,
  CheckCircle,
  XCircle,
  Check,
  X,
  AlertTriangle,
  Search,
  Loader2
} from 'lucide-react'

export default function BookingRequests() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserSession | null>(null)
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'REQUESTED' | 'APPROVED' | 'REJECTED'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Confirmation Modals
  const [approveConfirmId, setApproveConfirmId] = useState<number | null>(null)
  const [rejectModalId, setRejectModalId] = useState<number | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [processing, setProcessing] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    setUser(getStoredUser())
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const res = await bookingsApi.getOrganizerBookings()
      if (res.data && res.data.length > 0) {
        setBookings(res.data)
      } else {
        setBookings([])
      }
    } catch (err) {
      console.warn('Booking load error:', err)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }

  const handleApprove = async (id: number) => {
    try {
      setProcessing(true)
      const res = await bookingsApi.approveBooking(id, 'APPROVE')
      if (res.success) {
        setFeedback({
          message: `Booking #${id} successfully approved! Stall allocation locked into database. Competing requests resolved.`,
          type: 'success'
        })
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'APPROVED' } : b))
        setApproveConfirmId(null)
      } else {
        setFeedback({ message: res.message || 'Approval failed', type: 'error' })
      }
    } catch (err: any) {
      setFeedback({ message: err.message || 'Approval request failed', type: 'error' })
    } finally {
      setProcessing(false)
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  const handleReject = async (id: number) => {
    if (!rejectionReason.trim()) {
      alert('Please specify a rejection reason for the vendor.')
      return
    }

    try {
      setProcessing(true)
      const res = await bookingsApi.rejectBooking(id, rejectionReason)
      if (res.success) {
        setFeedback({
          message: `Booking #${id} rejected with notice sent to vendor.`,
          type: 'success'
        })
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'REJECTED', rejectionReason } : b))
        setRejectModalId(null)
        setRejectionReason('')
      } else {
        setFeedback({ message: res.message || 'Rejection failed', type: 'error' })
      }
    } catch (err: any) {
      setFeedback({ message: err.message || 'Rejection request failed', type: 'error' })
    } finally {
      setProcessing(false)
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  const filteredBookings = bookings.filter(b => {
    const matchStatus = filterStatus === 'ALL' || b.status === filterStatus
    const query = searchQuery.toLowerCase()
    const matchQuery =
      b.vendorName.toLowerCase().includes(query) ||
      b.eventName.toLowerCase().includes(query) ||
      b.stallNumber.toLowerCase().includes(query) ||
      b.vendorEmail.toLowerCase().includes(query)

    return matchStatus && matchQuery
  })

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex selection:bg-accent-strong">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1233] border-r border-[#3D2A5C] flex flex-col justify-between shrink-0 hidden md:flex min-h-screen sticky top-0">
        <div>
          <div className="p-6 border-b border-[#3D2A5C]/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F472B6] p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#1A1233] rounded-[10px] flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-[#F472B6]" />
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
              <LayoutGrid className="w-4 h-4" />
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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-accent-soft text-white font-medium text-sm border border-accent/30"
            >
              <Users className="w-4 h-4 text-accent" />
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

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-[#1A1233]/70 backdrop-blur-md border-b border-[#3D2A5C] px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-display font-extrabold text-white">
              Booking Request Management
            </h2>
            <p className="text-xs text-muted">Review, approve, and reject vendor applications with conflict prevention</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted font-mono">
              Total in queue: <strong className="text-white">{filteredBookings.length}</strong>
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 space-y-6 max-w-7xl">
          {feedback && (
            <div
              className={`p-4 rounded-xl border text-sm flex items-center gap-3 animate-slide-up ${
                feedback.type === 'success'
                  ? 'bg-green-soft border-green text-green'
                  : 'bg-red-soft border-red text-red'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Search & Filter Toolbar */}
          <div className="bg-surface rounded-2xl border border-border p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendor, stall, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-2 border border-border text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto">
              {(['ALL', 'REQUESTED', 'APPROVED', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filterStatus === st
                      ? 'bg-gradient-to-r from-accent to-primary text-white shadow-[0_0_12px_rgba(244,114,182,0.3)]'
                      : 'bg-surface-2 text-muted hover:text-white border border-border'
                  }`}
                >
                  {st === 'ALL' ? 'All Requests' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Booking Table */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-strong">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-2 text-muted text-xs uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Vendor Info</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Stall Space</th>
                    <th className="px-6 py-4">Category & Price</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-accent" />
                          <span>Loading booking queue...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted">
                        No booking requests found matching this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((req) => (
                      <tr key={req.id} className="hover:bg-surface-2/40 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white text-sm">{req.vendorName}</p>
                          <p className="text-xs text-muted font-mono">{req.vendorEmail}</p>
                          <p className="text-[11px] text-muted">{req.vendorPhone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-white text-sm">{req.eventName}</p>
                          <span className="text-[11px] text-muted">BIEC Bengaluru Hall 1</span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-primary">
                          {req.stallNumber}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-muted block">{req.category}</span>
                          <span className="font-mono font-bold text-white">{formatINR(req.price)}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted">
                          {new Date(req.requestedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                          {req.rejectionReason && (
                            <p className="text-[10px] text-red mt-1 max-w-xs truncate" title={req.rejectionReason}>
                              Reason: {req.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {req.status === 'REQUESTED' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setApproveConfirmId(req.id)}
                                className="px-3 py-1.5 rounded-lg bg-green/20 hover:bg-green text-green hover:text-black text-xs font-bold transition-all flex items-center gap-1 shadow-subtle"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => setRejectModalId(req.id)}
                                className="px-3 py-1.5 rounded-lg bg-red/20 hover:bg-red text-red hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted">
                              {req.status === 'APPROVED' ? 'Allocated' : 'Declined'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal for Approve */}
      {approveConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-[#1A1233] border border-border-strong rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-green-soft border border-green/30 flex items-center justify-center text-green">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">
              Confirm Stall Allocation
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Approving this request will atomically allocate the stall to the vendor and transition competing pending requests to safely prevent overlapping assignments.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="medium"
                onClick={() => setApproveConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="medium"
                loading={processing}
                onClick={() => handleApprove(approveConfirmId)}
              >
                Confirm Approval
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal with Reason */}
      {rejectModalId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-[#1A1233] border border-border-strong rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-soft border border-red/30 flex items-center justify-center text-red">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">
              Reject Booking Request
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Please state why this request cannot be fulfilled so the vendor can choose another stall or submit revisions.
            </p>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                Rejection Reason
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g., Space reserved for headline sponsor or power requirements exceed booth capacity..."
                className="w-full p-3 rounded-xl bg-[#0F0A1E] border border-border text-xs text-white focus:outline-none focus:border-red transition-colors"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="medium"
                onClick={() => setRejectModalId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="medium"
                loading={processing}
                onClick={() => handleReject(rejectModalId)}
              >
                Send Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
