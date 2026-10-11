import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EventMap, { INDIA_CITY_COORDS } from '../../components/EventMap'
import { eventsApi } from '../../lib/api'
import { EventData, SAMPLE_EVENTS } from '../../lib/sampleData'
import {
  Search,
  MapPin,
  Calendar,
  ChevronRight,
  Loader2,
  Grid,
  Map as MapIcon,
  Tag,
  ArrowUpDown,
  Filter,
  Sparkles,
  Navigation,
  Compass
} from 'lucide-react'

const PRESET_CITIES = [
  { id: 'All', name: 'All Cities (Pan-India)' },
  { id: 'Hyderabad', name: 'Hyderabad (HITEX & Hitec City)' },
  { id: 'Bengaluru', name: 'Bengaluru (BIEC & KTPO)' },
  { id: 'Mumbai', name: 'Mumbai (Jio World & Nesco BEC)' },
  { id: 'New Delhi', name: 'New Delhi (Bharat Mandapam & Pragati Maidan)' },
  { id: 'Chennai', name: 'Chennai (Chennai Trade Centre)' },
  { id: 'Kolkata', name: 'Kolkata (Milan Mela & Biswa Bangla)' },
  { id: 'Pune', name: 'Pune (Auto Cluster & PIECC)' },
]

export default function Events() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem('spacebook_preferred_city') || 'All'
  })
  const [detectingLocation, setDetectingLocation] = useState(false)
  const [locationMessage, setLocationMessage] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'date' | 'stalls' | 'name'>('recommended')
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await eventsApi.getPublishedEvents()
      if (response.data && response.data.length > 0) {
        setEvents(response.data)
      } else {
        setEvents(SAMPLE_EVENTS)
      }
    } catch (error) {
      console.warn('API fetch failed, falling back to sample events:', error)
      setEvents(SAMPLE_EVENTS)
    } finally {
      setLoading(false)
    }
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    localStorage.setItem('spacebook_preferred_city', city)
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.')
      return
    }
    setDetectingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        // Calculate closest Indian metropolitan hub
        const cityDistances = Object.entries(INDIA_CITY_COORDS).map(([cityName, coords]) => {
          const d = Math.hypot(coords.lat - lat, coords.lng - lng)
          return { cityName, dist: d }
        })
        cityDistances.sort((a, b) => a.dist - b.dist)
        const closestKey = cityDistances[0].cityName
        const formatted =
          closestKey === 'new delhi' || closestKey === 'delhi'
            ? 'New Delhi'
            : closestKey.charAt(0).toUpperCase() + closestKey.slice(1)

        setSelectedCity(formatted)
        localStorage.setItem('spacebook_preferred_city', formatted)
        setLocationMessage(`Detected location! Prioritizing Indian expos in ${formatted}.`)
        setDetectingLocation(false)
        setTimeout(() => setLocationMessage(null), 4000)
      },
      (err) => {
        console.warn('Geolocation error:', err)
        // Graceful fallback to Hyderabad hub
        setSelectedCity('Hyderabad')
        localStorage.setItem('spacebook_preferred_city', 'Hyderabad')
        setLocationMessage('Set to premier expo hub: Hyderabad (HITEX).')
        setDetectingLocation(false)
        setTimeout(() => setLocationMessage(null), 4000)
      },
      { timeout: 7000 }
    )
  }

  const getEventMinPrice = (event: EventData): number | null => {
    if (event.minPrice && typeof event.minPrice === 'number' && event.minPrice > 0) {
      return event.minPrice
    }
    if (!event.priceRange) return null
    const clean = event.priceRange.replace(/,/g, '')
    const matches = clean.match(/\d+/g)
    if (matches && matches.length > 0) {
      const num = Number(matches[0])
      return isNaN(num) ? null : num
    }
    return null
  }

  const categories = ['All', 'Technology', 'Art & Craft', 'Food & Beverage', 'Fashion', 'Business']

  const filteredEvents = events
    .filter((event) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        event.name.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query)

      const matchesCategory =
        selectedCategory === 'All' ||
        event.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // 1. Price sorting: Low to High (Minimum available stall price)
      if (sortBy === 'price-asc') {
        const pA = getEventMinPrice(a)
        const pB = getEventMinPrice(b)
        if (pA !== null && pB !== null) return pA - pB
        if (pA !== null && pB === null) return -1
        if (pA === null && pB !== null) return 1
        return 0
      }

      // 2. Price sorting: High to Low (Minimum available stall price)
      if (sortBy === 'price-desc') {
        const pA = getEventMinPrice(a)
        const pB = getEventMinPrice(b)
        if (pA !== null && pB !== null) return pB - pA
        if (pA !== null && pB === null) return -1
        if (pA === null && pB !== null) return 1
        return 0
      }

      // 3. Recommended / Priority: Prioritize selected city, then earliest date
      if (sortBy === 'recommended') {
        if (selectedCity !== 'All') {
          const aMatchesCity = a.city.toLowerCase() === selectedCity.toLowerCase()
          const bMatchesCity = b.city.toLowerCase() === selectedCity.toLowerCase()
          if (aMatchesCity && !bMatchesCity) return -1
          if (!aMatchesCity && bMatchesCity) return 1
        }
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      }

      if (sortBy === 'stalls') return b.availableStalls - a.availableStalls
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Location-Aware Event Discovery
            </div>
            <h1 className="text-4xl font-display font-extrabold tracking-tight text-white">
              Discover Upcoming Expos & Fairs
            </h1>
            <p className="text-muted mt-2 max-w-2xl text-sm leading-relaxed">
              Find prime exhibition stalls with verified physical dimensions, live allocation matrixes, and instant organizer request handling across India.
            </p>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-surface border border-border self-start md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-primary-strong text-white shadow-subtle'
                  : 'text-muted hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-primary-strong text-white shadow-subtle'
                  : 'text-muted hover:text-white'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Location Notice Banner */}
        {locationMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#1E1438] border border-primary text-primary-light text-xs flex items-center justify-between gap-3 animate-slide-up shadow-subtle">
            <div className="flex items-center gap-2.5">
              <Navigation className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
              <span>{locationMessage}</span>
            </div>
            <button
              onClick={() => setLocationMessage(null)}
              className="text-muted hover:text-white text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Location Filter Bar */}
        <div className="bg-surface rounded-2xl border border-border p-4 mb-8 shadow-subtle space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search expo name, category, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-[#0F0A1E] text-white placeholder:text-muted/70 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* City Selector */}
            <div className="md:col-span-4 flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  aria-label="Filter events by Indian city"
                  className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-border bg-[#0F0A1E] text-white text-xs font-semibold focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  {PRESET_CITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Geolocation Trigger */}
              <button
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                title="Detect My Location"
                className="p-2.5 rounded-xl bg-surface-2 border border-border hover:border-emerald-500 hover:text-emerald-400 text-muted transition-all shrink-0 flex items-center justify-center"
              >
                {detectingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 flex items-center gap-2">
              <div className="relative w-full">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort events"
                  className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-border bg-[#0F0A1E] text-white text-xs font-medium focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="recommended">Recommended (Selected City Priority)</option>
                  <option value="price-asc">Price: Low to High (Min Stall Price)</option>
                  <option value="price-desc">Price: High to Low (Min Stall Price)</option>
                  <option value="date">Date: Earliest First</option>
                  <option value="stalls">Stalls: Most Available</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-xs font-semibold text-muted flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase()
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_12px_rgba(183,148,246,0.3)]'
                      : 'bg-surface-2 text-muted hover:text-white border border-border/80'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* View Content: Grid or Interactive Map */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-sm text-muted">Retrieving verified events...</p>
          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-strong mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary" />
                  Interactive Event Map (India)
                </h3>
                <p className="text-xs text-muted">
                  {selectedCity !== 'All'
                    ? `Showing venue coordinates centered on ${selectedCity}. Click any pin to open floor plan.`
                    : 'Click pins to inspect venues across India and jump directly to stall allocations.'}
                </p>
              </div>
              <Badge variant="primary" size="small">
                {filteredEvents.length} Events on Map
              </Badge>
            </div>
            <div className="h-[550px] rounded-xl overflow-hidden border border-border">
              <EventMap
                events={filteredEvents}
                selectedCity={selectedCity}
                onEventClick={(event) => navigate(`/vendor/events/${event.id}`)}
              />
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4 border border-border">
              <Search className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">No matching events</h3>
            <p className="text-sm text-muted mb-6">
              We couldn't find any events matching your filter criteria. Try selecting a different city or category.
            </p>
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedCity('All')
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const isCityMatch =
                selectedCity !== 'All' &&
                evt.city.toLowerCase() === selectedCity.toLowerCase()

              const hasValidCoords =
                typeof evt.latitude === 'number' &&
                typeof evt.longitude === 'number' &&
                evt.latitude !== 0 &&
                evt.longitude !== 0 &&
                !isNaN(evt.latitude) &&
                !isNaN(evt.longitude)

              return (
                <div
                  key={evt.id}
                  className={`group bg-surface rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-subtle hover:shadow-strong flex flex-col ${
                    isCityMatch
                      ? 'border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                      : 'border-border hover:border-primary/60'
                  }`}
                >
                  {/* Event Image */}
                  <div className="relative h-52 overflow-hidden bg-surface-2">
                    <img
                      src={evt.imageUrl}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1233] via-transparent to-black/30" />

                    {/* Category Pill */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-primary" />
                        {evt.category}
                      </span>
                      {isCityMatch && (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1 shadow-sm">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>Near You</span>
                        </span>
                      )}
                    </div>

                    {/* Availability Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant={evt.availableStalls > 0 ? 'green' : 'red'} size="small">
                        {evt.availableStalls > 0 ? `${evt.availableStalls} Stalls Left` : 'Sold Out'}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-muted">
                      <span className="bg-surface/80 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] text-white">
                        Host: {evt.organizerName}
                      </span>
                      {!hasValidCoords && (
                        <span className="bg-rose-950/80 backdrop-blur-sm border border-rose-500/50 text-rose-300 px-2 py-0.5 rounded text-[10px] font-medium">
                          📍 Map location unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors line-clamp-1 mb-2">
                        {evt.name}
                      </h3>
                      <p className="text-xs text-muted line-clamp-2 mb-4 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="space-y-2.5 text-xs text-muted mb-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">
                            {evt.venue}, <strong>{evt.city}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span>
                            {formatDate(evt.startDate)} - {formatDate(evt.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom Bar */}
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-muted">Minimum available stall price</p>
                        <p className="text-sm font-bold text-emerald-400 font-mono">{evt.priceRange || 'Not Available'}</p>
                      </div>
                      <Link to={`/vendor/events/${evt.id}`}>
                        <Button variant="primary" size="small" className="gap-1.5">
                          <span>Floor Plan</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
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
