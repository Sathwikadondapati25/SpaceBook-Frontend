import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import StallComparison from '../../components/StallComparison'
import { eventsApi, stallsApi, bookingsApi, getStoredUser } from '../../lib/api'
import { EventData, StallData, SAMPLE_EVENTS, generateSampleStalls, formatINR } from '../../lib/sampleData'
import {
  MapPin,
  Calendar,
  Grid3x3,
  List,
  Info,
  Scale,
  CheckCircle,
  Loader2,
  Wifi,
  Zap,
  Droplet,
  Send,
  X,
  ShieldCheck,
  Building,
  Check
} from 'lucide-react'

export default function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<EventData | null>(null)
  const [stalls, setStalls] = useState<StallData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'info'>('map')
  const [selectedStall, setSelectedStall] = useState<StallData | null>(null)
  const [comparisonStalls, setComparisonStalls] = useState<StallData[]>([])

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [bookingNotes, setBookingNotes] = useState('')
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null)
  const [bookingError, setBookingError] = useState<string | null>(null)

  // Filters
  const [filterCategory, setFilterCategory] = useState('All')

  const currentUser = getStoredUser()

  useEffect(() => {
    if (eventId) {
      loadEventData(Number(eventId))
    }
  }, [eventId])

  const loadEventData = async (id: number) => {
    try {
      setLoading(true)
      const [eventRes, stallsRes] = await Promise.all([
        eventsApi.getEvent(id).catch(() => ({ success: false, data: null })),
        stallsApi.getEventStalls(id).catch(() => ({ success: false, data: [] }))
      ])

      if (eventRes.data) {
        setEvent(eventRes.data)
      } else {
        const fallback = SAMPLE_EVENTS.find(e => e.id === id) || SAMPLE_EVENTS[0]
        setEvent(fallback)
      }

      if (stallsRes.data && stallsRes.data.length > 0) {
        setStalls(stallsRes.data)
      } else {
        setStalls(generateSampleStalls(id))
      }
    } catch {
      const fallback = SAMPLE_EVENTS.find(e => e.id === id) || SAMPLE_EVENTS[0]
      setEvent(fallback)
      setStalls(generateSampleStalls(id))
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStall || !event) return

    try {
      setBookingSubmitting(true)
      setBookingError(null)

      const res = await bookingsApi.createBooking({
        stallId: selectedStall.id,
        eventId: event.id,
        eventName: event.name,
        stallNumber: selectedStall.stallNumber,
        price: selectedStall.price,
        category: selectedStall.category,
        message: bookingNotes || 'Vendor stall allocation request'
      })

      if (res.success) {
        setBookingSuccess(`Booking request for Stall ${selectedStall.stallNumber} submitted! Reflected in Organizer queue.`)
        // Update local stall status to pending
        setStalls(prev =>
          prev.map(s => s.id === selectedStall.id ? { ...s, status: 'pending', isAvailable: false } : s)
        )
        setTimeout(() => {
          setBookingModalOpen(false)
          setBookingSuccess(null)
          setSelectedStall(null)
          setBookingNotes('')
        }, 2200)
      } else {
        setBookingError(res.message || 'Failed to submit booking')
      }
    } catch (err: any) {
      setBookingError(err.message || 'Booking submission failed')
    } finally {
      setBookingSubmitting(false)
    }
  }

  const addToComparison = (stall: StallData) => {
    if (comparisonStalls.length >= 3) {
      alert('You can compare up to 3 stalls at a time.')
      return
    }
    if (comparisonStalls.some(s => s.id === stall.id)) {
      alert('This stall is already in your comparison tray.')
      return
    }
    setComparisonStalls([...comparisonStalls, stall])
  }

  const filteredStalls = stalls.filter(s => {
    return filterCategory === 'All' || s.category.toLowerCase() === filterCategory.toLowerCase()
  })

  const categories = ['All', ...Array.from(new Set(stalls.map(s => s.category)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0714] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-gray-300">Loading interactive venue floor plan...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0A0714] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0714] text-white selection:bg-primary-strong">
      <Navbar />

      <main className="pt-24 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Breadcrumb Navigation (Back Arrow Disabled as requested) */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <span className="hover:text-white cursor-default">Exhibitions (India 🇮🇳)</span>
          <span>/</span>
          <span className="text-gray-300 font-semibold">{event.city}</span>
          <span>/</span>
          <span className="text-primary font-bold">{event.name}</span>
        </div>

        {/* Hero Event Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#2D1B4E] bg-[#130E26] mb-8 shadow-2xl">
          <div className="h-60 sm:h-72 w-full relative">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#130E26] via-[#130E26]/80 to-transparent" />
            
            <div className="absolute top-5 left-5 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5">
                <span>🇮🇳</span> {event.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Atomic Concurrency Locked
              </span>
            </div>
          </div>

          {/* Banner Details */}
          <div className="p-6 sm:p-8 -mt-20 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
                {event.name}
              </h1>
              <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                {event.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-gray-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-white font-medium">{event.venue}, {event.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-pink-400" />
                  <span className="text-white font-medium">
                    {new Date(event.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} -{' '}
                    {new Date(event.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>Host: <strong className="text-white">{event.organizerName}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Metrics in Indian Rupees */}
            <div className="bg-[#1C1536] border border-[#3D2A5C] p-4 rounded-2xl flex items-center gap-6 shrink-0 shadow-lg">
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Available Stalls</p>
                <p className="text-2xl font-black font-display text-emerald-400">
                  {stalls.filter(s => s.status === 'available').length} <span className="text-xs text-gray-400 font-normal">/ {stalls.length}</span>
                </p>
              </div>
              <div className="border-l border-[#3D2A5C] pl-6">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Stall Tariff</p>
                <p className="text-base font-black font-mono text-white">{event.priceRange}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#2D1B4E] mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'map'
                  ? 'border-primary text-white bg-primary-soft/30'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Grid3x3 className="w-4 h-4 text-primary" />
              <span>Interactive Stall Map</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'list'
                  ? 'border-primary text-white bg-primary-soft/30'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4 text-pink-400" />
              <span>Stall Directory ({filteredStalls.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'info'
                  ? 'border-primary text-white bg-primary-soft/30'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4 text-blue-400" />
              <span>Venue Specifications (India)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE FLOOR MAP WITH VIBRANT HIGH-CONTRAST COLORS */}
        {activeTab === 'map' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Floor Map Layout Area */}
            <div className="lg:col-span-8 bg-[#140E26] rounded-3xl border border-[#342258] p-6 sm:p-8 shadow-2xl">
              {/* Floor Plan Header & Legend */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2D1B4E] mb-6">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-white">Main Exhibition Hall A</h3>
                  <p className="text-xs text-gray-300">Live floor matrix • Prices in Indian Rupees (INR ₹) excl. GST</p>
                </div>

                {/* Status Legend with Bright High-Contrast Colors */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 border border-emerald-400 shadow-[0_0_8px_#10B981]" />
                    <span className="text-emerald-300">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-amber-500 border border-amber-400 shadow-[0_0_8px_#F59E0B]" />
                    <span className="text-amber-300 font-medium">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-[#25101E] border-2 border-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                    <span className="text-rose-300 font-semibold">Booked / Unavailable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-r from-violet-500 to-pink-500 border-2 border-white shadow-[0_0_10px_#EC4899]" />
                    <span className="text-pink-300 font-semibold">Selected</span>
                  </div>
                </div>
              </div>

              {/* Entrance Gate Arch */}
              <div className="mb-6 flex items-center justify-center">
                <div className="px-8 py-2.5 rounded-2xl bg-[#20163B] border-2 border-[#5C3A8E] text-xs font-black text-white uppercase tracking-widest flex items-center gap-3 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  MAIN ENTRANCE & VISITOR REGISTRATION FOYER
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Floor Plan Grid - High-Contrast, Crystal-Clear Stalls */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#090612] border border-[#2D1B4E]">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {stalls.map((stall) => {
                    const isSelected = selectedStall?.id === stall.id
                    const isAvailable = stall.status === 'available'
                    const isPending = stall.status === 'pending'
                    const isBooked = stall.status === 'booked'

                    // High contrast color design - Every stall status is distinct and boundary clearly defined
                    let containerStyles = 'bg-[#22101E] border-2 border-rose-500/70 text-rose-100 cursor-not-allowed shadow-[inset_0_0_12px_rgba(244,63,94,0.15)] hover:border-rose-400'
                    let stallNumColor = 'text-white font-extrabold'
                    let priceColor = 'text-rose-200/90 font-bold'
                    let statusLabel = 'BOOKED'
                    let labelColor = 'text-rose-300 font-black bg-rose-950/90 px-1 py-0.5 rounded border border-rose-500/40'

                    if (isSelected) {
                      containerStyles = 'bg-gradient-to-br from-violet-600 to-pink-600 border-2 border-white text-white shadow-[0_0_25px_rgba(236,72,153,0.7)] scale-105 z-10 ring-4 ring-pink-500/50'
                      stallNumColor = 'text-white font-black'
                      priceColor = 'text-white font-black'
                      statusLabel = 'SELECTED'
                      labelColor = 'text-white font-black bg-black/40 px-1 py-0.5 rounded border border-white/40'
                    } else if (isAvailable) {
                      containerStyles = 'bg-[#0A261C] border-2 border-emerald-400 hover:border-emerald-300 hover:bg-[#103829] hover:shadow-[0_0_18px_rgba(16,185,129,0.35)] cursor-pointer'
                      stallNumColor = 'text-white font-black'
                      priceColor = 'text-emerald-400 font-bold'
                      statusLabel = 'OPEN'
                      labelColor = 'text-emerald-300 font-black bg-emerald-950/90 px-1 py-0.5 rounded border border-emerald-500/40'
                    } else if (isPending) {
                      containerStyles = 'bg-[#2B1B0A] border-2 border-amber-400 text-amber-200 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer'
                      stallNumColor = 'text-white font-black'
                      priceColor = 'text-amber-300 font-bold'
                      statusLabel = 'PENDING'
                      labelColor = 'text-amber-300 font-black bg-amber-950/90 px-1 py-0.5 rounded border border-amber-500/40'
                    }

                    return (
                      <button
                        key={stall.id}
                        disabled={isBooked}
                        onClick={() => setSelectedStall(stall)}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-between p-2.5 transition-all duration-200 relative ${containerStyles}`}
                      >
                        {/* Stall Number Header */}
                        <div className="w-full flex items-center justify-between">
                          <span className={`text-sm ${stallNumColor}`}>
                            {stall.stallNumber}
                          </span>
                          <span className={`text-[9px] font-black tracking-widest uppercase ${labelColor}`}>
                            {statusLabel}
                          </span>
                        </div>

                        {/* Price in Indian Rupees */}
                        <div className="text-center my-auto">
                          <span className={`text-xs font-mono font-black ${priceColor}`}>
                            {formatINR(stall.price)}
                          </span>
                          <span className="block text-[8px] uppercase tracking-wider text-gray-300 font-semibold truncate max-w-[70px]">
                            {stall.category.replace('Standard ', '').replace('Booth', '')}
                          </span>
                        </div>

                        {/* Selection check icon */}
                        {isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-pink-600 flex items-center justify-center shadow-lg font-bold">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                        {comparisonStalls.some(c => c.id === stall.id) && (
                          <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white">
                            <Scale className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Central Promenade Divider */}
                <div className="mt-6 pt-4 border-t border-dashed border-[#2D1B4E] flex items-center justify-between text-xs text-gray-300 font-medium">
                  <span>← Aisle 1 (Cafeteria & Restrooms)</span>
                  <span className="uppercase font-bold tracking-wider text-primary">CENTRAL BUSINESS PROMENADE</span>
                  <span>Aisle 2 (Keynote Stage) →</span>
                </div>
              </div>
            </div>

            {/* Selected Stall Details Panel (Right Sidebar) */}
            <div className="lg:col-span-4">
              {selectedStall ? (
                <div className="bg-[#140E26] rounded-3xl border-2 border-primary p-6 sm:p-7 shadow-2xl sticky top-28 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${
                            selectedStall.status === 'available'
                              ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500'
                              : 'bg-amber-900/80 text-amber-300 border border-amber-500'
                          }`}
                        >
                          {selectedStall.status}
                        </span>
                        <span className="text-xs text-gray-300 font-semibold">{selectedStall.category}</span>
                      </div>
                      <h3 className="text-2xl font-display font-black text-white">
                        Stall {selectedStall.stallNumber}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedStall(null)}
                      className="p-1.5 rounded-xl text-gray-400 hover:text-white bg-[#20163B]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Pricing Breakdown with 18% GST in Indian Rupees */}
                  <div className="p-4 rounded-2xl bg-[#090612] border border-[#2D1B4E] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Base Space Tariff:</span>
                      <span className="text-base font-bold font-mono text-white">{formatINR(selectedStall.price)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>GST (18% Input Credit):</span>
                      <span className="font-mono font-medium">{formatINR(Math.round(selectedStall.price * 0.18))}</span>
                    </div>
                    <div className="border-t border-[#2D1B4E] pt-2 flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total Payable:</span>
                      <span className="text-xl font-black font-mono text-emerald-400">{formatINR(Math.round(selectedStall.price * 1.18))}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 pt-1">
                      Dimensions: <strong className="text-white">{selectedStall.dimensions}</strong> • Row {selectedStall.gridRow}, Col {selectedStall.gridCol}
                    </p>
                  </div>

                  {/* Included Facilities */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2.5">
                      Included Venue Facilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStall.facilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1.5 rounded-xl bg-[#20163B] border border-[#342258] text-xs text-white flex items-center gap-1.5"
                        >
                          {fac.includes('Power') && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                          {fac.includes('Wi-Fi') && <Wifi className="w-3.5 h-3.5 text-pink-400" />}
                          {fac.includes('Water') && <Droplet className="w-3.5 h-3.5 text-blue-400" />}
                          {!fac.includes('Power') && !fac.includes('Wi-Fi') && !fac.includes('Water') && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    {selectedStall.status === 'available' ? (
                      <Button
                        variant="primary"
                        size="large"
                        className="w-full gap-2 shadow-[0_0_25px_rgba(183,148,246,0.35)]"
                        onClick={() => setBookingModalOpen(true)}
                      >
                        <Send className="w-4 h-4" />
                        <span>Request Stall Booking</span>
                      </Button>
                    ) : (
                      <Button variant="secondary" size="large" className="w-full text-amber-400" disabled>
                        Reservation Already Pending
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="medium"
                      className="w-full gap-2"
                      onClick={() => addToComparison(selectedStall)}
                      disabled={comparisonStalls.some(c => c.id === selectedStall.id)}
                    >
                      <Scale className="w-4 h-4 text-pink-400" />
                      <span>{comparisonStalls.some(c => c.id === selectedStall.id) ? 'In Comparison Tray' : 'Compare Stall'}</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#140E26] rounded-3xl border border-[#342258] p-8 text-center sticky top-28 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-[#20163B] flex items-center justify-center mx-auto mb-4 border border-[#5C3A8E] text-primary">
                    <Grid3x3 className="w-7 h-7" />
                  </div>
                  <h4 className="font-display font-black text-white text-lg mb-2">Select an Exhibition Stall</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Click any stall square on the interactive floor plan to inspect exact dimensions, view GST tariff breakdown, and submit your reservation request.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: STALL DIRECTORY LIST */}
        {activeTab === 'list' && (
          <div className="bg-[#140E26] rounded-3xl border border-[#342258] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#2D1B4E] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Full Venue Inventory (India)</h3>
                <p className="text-xs text-gray-300">Complete list of all spaces in this venue with live status</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-semibold">Category:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#090612] border border-[#2D1B4E] text-xs text-white focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1F1738] text-gray-300 text-xs uppercase tracking-wider border-b border-[#2D1B4E]">
                  <tr>
                    <th className="px-6 py-4">Stall Number</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Dimensions</th>
                    <th className="px-6 py-4">Facilities</th>
                    <th className="px-6 py-4">Tariff (INR ₹)</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D1B4E]">
                  {filteredStalls.map((stall) => (
                    <tr key={stall.id} className="hover:bg-[#1E1738]/50 transition-colors">
                      <td className="px-6 py-4 font-black text-white font-mono text-base">
                        {stall.stallNumber}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-300">
                        {stall.category}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-white">
                        {stall.dimensions}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {stall.facilities.slice(0, 2).map((f, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#20163B] text-gray-300 border border-[#342258]">
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black font-mono text-emerald-400">
                        {formatINR(stall.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            stall.status === 'available'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                              : stall.status === 'pending'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {stall.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => {
                            setSelectedStall(stall)
                            setActiveTab('map')
                          }}
                        >
                          Locate
                        </Button>
                        {stall.status === 'available' && (
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => {
                              setSelectedStall(stall)
                              setBookingModalOpen(true)
                            }}
                          >
                            Book
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VENUE INFO */}
        {activeTab === 'info' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#140E26] rounded-3xl border border-[#342258] p-7 space-y-4">
              <h3 className="text-xl font-display font-black text-white">Indian Exhibition Venue Infrastructure</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p><strong className="text-white">Venue:</strong> {event.venue}</p>
                <p><strong className="text-white">City & State:</strong> {event.city}, {event.state}, India 🇮🇳</p>
                <p><strong className="text-white">Electric Standards:</strong> 230V 16A single-phase Indian 3-pin standard included; 415V 3-phase industrial power available on request.</p>
                <p><strong className="text-white">Material Inward Gate:</strong> Gate 3 & 4 open from 6:00 AM for exhibitor freight loading.</p>
                <p><strong className="text-white">Security & Surveillance:</strong> 24x7 CISF / Venue private security, CCTV surveillance, and fire safety sprinklers.</p>
              </div>
            </div>

            <div className="bg-[#140E26] rounded-3xl border border-[#342258] p-7 space-y-4">
              <h3 className="text-xl font-display font-black text-white">Indian GST & Allocation Policies</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p><strong className="text-white">GST Invoicing:</strong> Valid GST tax invoice will be issued by {event.organizerName} for claiming 18% Input Tax Credit (ITC).</p>
                <p><strong className="text-white">Double-Booking Prevention:</strong> Our atomic reservation algorithm guarantees no stall can be double-confirmed.</p>
                <p><strong className="text-white">Payment Options:</strong> RTGS / NEFT / UPI (Razorpay) / Net Banking supported after organizer approval.</p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Request Modal */}
        {bookingModalOpen && selectedStall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#140E26] border-2 border-[#5C3A8E] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
              <button
                onClick={() => setBookingModalOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-xl text-gray-400 hover:text-white bg-[#20163B]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-pink-500 p-0.5">
                  <div className="w-full h-full bg-[#140E26] rounded-[14px] flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-white">
                    Request Stall {selectedStall.stallNumber}
                  </h3>
                  <p className="text-xs text-gray-300">{event.name}</p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-sm flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>{bookingSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {bookingError && (
                    <div className="p-3 rounded-xl bg-red-950 border border-red-500 text-red-300 text-xs">
                      {bookingError}
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-[#090612] border border-[#2D1B4E] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dimensions:</span>
                      <span className="text-white font-medium">{selectedStall.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white font-medium">{selectedStall.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tariff (Excl. GST):</span>
                      <span className="text-white font-bold font-mono">{formatINR(selectedStall.price)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#2D1B4E] pt-2">
                      <span className="text-emerald-400 font-bold">Total with 18% GST:</span>
                      <span className="text-emerald-400 font-black font-mono text-sm">{formatINR(Math.round(selectedStall.price * 1.18))}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-gray-400">Applicant:</span>
                      <span className="text-white font-medium">{currentUser?.name || 'Verified Exhibitor'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Proposal / Demonstration Notes for Organizer
                    </label>
                    <textarea
                      rows={3}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Specify products to display, required power load, or special branding requirements..."
                      className="w-full p-3 rounded-xl bg-[#090612] border border-[#2D1B4E] text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="medium"
                      onClick={() => setBookingModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="medium"
                      loading={bookingSubmitting}
                      className="px-6"
                    >
                      Confirm Booking Request
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Stall Comparison Drawer */}
        <StallComparison
          stalls={comparisonStalls}
          onRemove={(id) => setComparisonStalls(comparisonStalls.filter(s => s.id !== id))}
          onClear={() => setComparisonStalls([])}
        />
      </main>
    </div>
  )
}
