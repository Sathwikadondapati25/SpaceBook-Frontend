import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  Lock,
  Compass,
  Store,
  ChevronRight,
  Zap
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { SAMPLE_EVENTS, formatINR } from '../lib/sampleData'

export default function Home() {
  const [selectedDemoStall, setSelectedDemoStall] = useState<number | null>(4)

  // Demo floor plan stalls for hero visualization with Indian Rupee Tariffs
  const demoStalls = [
    { id: 1, number: 'A-01', status: 'booked', price: 32000, category: 'Tech' },
    { id: 2, number: 'A-02', status: 'available', price: 28000, category: 'Tech' },
    { id: 3, number: 'A-03', status: 'booked', price: 35000, category: 'Tech' },
    { id: 4, number: 'A-04', status: 'selected', price: 48000, category: 'Prime' },
    { id: 5, number: 'A-05', status: 'available', price: 28000, category: 'Tech' },
    { id: 6, number: 'B-01', status: 'pending', price: 25000, category: 'Standard' },
    { id: 7, number: 'B-02', status: 'available', price: 25000, category: 'Standard' },
    { id: 8, number: 'B-03', status: 'booked', price: 32000, category: 'Standard' },
    { id: 9, number: 'B-04', status: 'available', price: 25000, category: 'Standard' },
    { id: 10, number: 'B-05', status: 'pending', price: 25000, category: 'Standard' },
    { id: 11, number: 'C-01', status: 'available', price: 22000, category: 'MSME' },
    { id: 12, number: 'C-02', status: 'available', price: 22000, category: 'MSME' },
  ]

  const featuredEvents = SAMPLE_EVENTS.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#0A0714] text-white selection:bg-[#7C3AED] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 overflow-hidden">
        {/* Ambient Glowing Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#7C3AED]/25 via-[#B794F6]/15 to-[#F472B6]/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[#7C3AED]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#F472B6]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1C1536] border border-[#3D2A5C] shadow-subtle">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Made in India 🇮🇳 • Conflict-Free Allocations
                </span>
                <span className="text-gray-400 text-xs">• Instant Concurrency Locks</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.1]">
                Spaces for <br />
                <span className="bg-gradient-to-r from-[#FFFFFF] via-[#E2D9F3] to-[#B794F6] bg-clip-text text-transparent">
                  Bigger
                </span>{' '}
                <span className="bg-gradient-to-r from-[#B794F6] via-[#F472B6] to-[#EC4899] bg-clip-text text-transparent">
                  Stories.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Conflict-free stall booking for premier Indian trade expos, industrial exhibitions, and artisan bazaars. 
                Discover live venue floor maps, calculate GST input credit, and reserve your booth with zero double-booking risk.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/vendor/events" className="w-full sm:w-auto">
                  <Button variant="primary" size="large" className="w-full sm:w-auto px-8 gap-3 shadow-[0_0_30px_rgba(183,148,246,0.35)] hover:shadow-[0_0_40px_rgba(244,114,182,0.5)]">
                    <Compass className="w-5 h-5" />
                    <span>Explore Indian Expos</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/auth" className="w-full sm:w-auto">
                  <Button variant="secondary" size="large" className="w-full sm:w-auto px-7 gap-2">
                    <Store className="w-5 h-5 text-accent" />
                    <span>Host an Event (Organizer)</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-300 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Atomic Stall Locks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Real-Time Availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-400" />
                  <span>GST Invoicing Ready (18% ITC)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Floor Plan Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#7C3AED]/50 via-[#F472B6]/40 to-[#7C3AED]/50 blur-lg opacity-70" />
                
                <div className="relative bg-[#140E26] border-2 border-[#3D2A5C] rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#2D1B4E] mb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <h3 className="font-display font-extrabold text-white text-base">Bengaluru BIEC Main Hall</h3>
                      </div>
                      <p className="text-xs text-gray-300 mt-0.5">Live allocation matrix • INR (₹) Tariffs</p>
                    </div>
                    <Badge variant="primary" size="small" outline>
                      Live Demo
                    </Badge>
                  </div>

                  {/* Entrance Marker */}
                  <div className="mb-3 flex items-center justify-center">
                    <div className="px-6 py-1 rounded-full bg-[#20163B] border border-[#5C3A8E] text-[11px] font-bold text-white tracking-wider uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Main Entrance & Registration Desk
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Floor Plan Grid - Vibrant, Crisp, Highly Readable Stalls */}
                  <div className="grid grid-cols-4 gap-2.5 mb-5 p-3 rounded-2xl bg-[#090612] border border-[#2D1B4E]">
                    {demoStalls.map((stall) => {
                      const isSelected = selectedDemoStall === stall.id
                      let bgStyle = 'bg-[#22101E] border-2 border-rose-500/70 text-rose-100 shadow-[inset_0_0_8px_rgba(244,63,94,0.15)] cursor-not-allowed'
                      let numColor = 'text-white font-extrabold'
                      let priceColor = 'text-rose-200/90 font-bold'

                      if (isSelected) {
                        bgStyle = 'bg-gradient-to-br from-violet-600 to-pink-600 border-2 border-white text-white shadow-[0_0_20px_rgba(244,114,182,0.7)] scale-105 z-10 ring-2 ring-pink-400'
                        numColor = 'text-white font-black'
                        priceColor = 'text-white font-bold'
                      } else if (stall.status === 'available') {
                        bgStyle = 'bg-[#0A261C] border-2 border-emerald-400 hover:border-emerald-300 text-emerald-300 hover:bg-[#103829] shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        numColor = 'text-white font-black'
                        priceColor = 'text-emerald-400 font-bold'
                      } else if (stall.status === 'pending') {
                        bgStyle = 'bg-[#2B1B0A] border-2 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        numColor = 'text-white font-black'
                        priceColor = 'text-amber-400 font-bold'
                      }

                      return (
                        <button
                          key={stall.id}
                          disabled={stall.status === 'booked'}
                          onClick={() => setSelectedDemoStall(stall.id)}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 text-xs p-1 ${bgStyle}`}
                        >
                          <span className={`text-[12px] tracking-tight ${numColor}`}>{stall.number}</span>
                          <span className={`text-[10px] font-mono mt-0.5 ${priceColor}`}>
                            {formatINR(stall.price)}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-4 gap-2 text-[11px] pb-4 border-b border-[#2D1B4E] font-medium">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10B981]" />
                      <span className="text-emerald-300">Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-amber-300">Pending</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_5px_#F43F5E]" />
                      <span className="text-rose-300">Booked</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                      <span className="text-pink-300">Selected</span>
                    </div>
                  </div>

                  {/* Live Selected Details Box */}
                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Selected Space:</p>
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Stall A-04</span>
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                          {formatINR(48000)} • Prime Corner
                        </span>
                      </p>
                    </div>
                    <Link to="/vendor/events/1">
                      <Button variant="primary" size="small" className="gap-1 text-xs">
                        Book Now
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Strip - Indian Scale */}
      <section className="py-12 border-y border-[#2D1B4E] bg-[#130E26]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <p className="text-4xl lg:text-5xl font-display font-black bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                500+
              </p>
              <p className="text-sm font-medium text-gray-300 mt-1">Indian Trade Expos</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-4xl lg:text-5xl font-display font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                15,000+
              </p>
              <p className="text-sm font-medium text-gray-300 mt-1">Stalls Allocated</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-4xl lg:text-5xl font-display font-black bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
                ₹45+ Cr
              </p>
              <p className="text-sm font-medium text-gray-300 mt-1">Exhibition Space Booked</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-4xl lg:text-5xl font-display font-black bg-gradient-to-r from-emerald-400 to-white bg-clip-text text-transparent">
                35+
              </p>
              <p className="text-sm font-medium text-gray-300 mt-1">Indian Metropolitan Hubs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Indian Events */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Discovery
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
                Upcoming Indian Exhibitions
              </h2>
              <p className="text-gray-300 mt-2 max-w-xl text-sm">
                Explore prime trade conventions across Bengaluru, Hyderabad, New Delhi, and Mumbai accepting verified stall bookings.
              </p>
            </div>
            <Link to="/vendor/events">
              <Button variant="secondary" size="small" className="gap-2">
                <span>View All Indian Expos</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredEvents.map((evt) => (
              <div
                key={evt.id}
                className="group bg-[#140E26] rounded-3xl border border-[#342258] overflow-hidden hover:border-primary/60 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={evt.imageUrl}
                    alt={evt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140E26] via-transparent to-black/40" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                      <span>🇮🇳</span> {evt.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                      {evt.availableStalls} Stalls Left
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors line-clamp-1 mb-2">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="space-y-2 text-xs text-gray-300 mb-6 font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{evt.venue}, {evt.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" />
                        <span>{new Date(evt.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2D1B4E] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-400">Tariff from</p>
                      <p className="text-base font-black text-white font-mono">{evt.priceRange.split(' - ')[0]}</p>
                    </div>
                    <Link to={`/vendor/events/${evt.id}`}>
                      <Button variant="primary" size="small" className="gap-1.5">
                        <span>Pick Stall</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-[#130E26]/40 border-y border-[#2D1B4E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2 block">
              Indian Exhibition Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
              How SpaceBook Works
            </h2>
            <p className="text-gray-300 mt-3 text-sm">
              Conflict-free stall reservation, atomic allocations, and transparent GST invoicing for Indian exhibitors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card padding="large" className="relative group hover:border-primary/50 transition-all bg-[#140E26]">
              <div className="w-14 h-14 rounded-2xl bg-primary-soft border border-primary/30 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-primary mb-1">STEP 01</div>
              <h3 className="text-xl font-display font-bold text-white mb-3">Organizer Sets Floor Matrix</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Organizers publish venue layouts, configure 10x10 and custom shell booth dimensions, electric load plugs, and Indian Rupee tariffs.
              </p>
            </Card>

            <Card padding="large" className="relative group hover:border-accent/50 transition-all bg-[#140E26]">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft border border-accent/30 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-accent mb-1">STEP 02</div>
              <h3 className="text-xl font-display font-bold text-white mb-3">Exhibitor Discovers & Selects</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Browse Indian venues in Bengaluru, Hyderabad, Delhi, and Mumbai. Inspect corner advantages, check electric power, and compare stalls.
              </p>
            </Card>

            <Card padding="large" className="relative group hover:border-emerald-500/50 transition-all bg-[#140E26]">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-emerald-400 mb-1">STEP 03</div>
              <h3 className="text-xl font-display font-bold text-white mb-3">Atomic Conflict-Free Allocation</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                When the organizer approves a request, database pessimistic locking allocates the stall atomically and safely cancels competing requests.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2D1B4E] bg-[#07050E] py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F472B6] p-0.5">
                <div className="w-full h-full bg-[#1A1233] rounded-[10px] flex items-center justify-center">
                  <span className="font-bold text-xs text-primary">SB</span>
                </div>
              </div>
              <span className="text-xl font-display font-extrabold text-white">SpaceBook India</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              India’s dedicated conflict-free exhibition stall reservation infrastructure for organizers and commercial exhibitors.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Indian Hubs</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>Bengaluru (BIEC)</li>
              <li>Hyderabad (HITEX)</li>
              <li>New Delhi (Bharat Mandapam)</li>
              <li>Mumbai (NESCO / BEC)</li>
              <li>Chennai (CTC Trade Centre)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/vendor/dashboard" className="hover:text-white transition-colors">Exhibitor Dashboard</Link></li>
              <li><Link to="/organizer/dashboard" className="hover:text-white transition-colors">Organizer Operations</Link></li>
              <li><Link to="/organizer/bookings" className="hover:text-white transition-colors">Stall Approval Queue</Link></li>
              <li><Link to="/vendor/bookings" className="hover:text-white transition-colors">My Stall Allocations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Compliance</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Protected by database-level unique constraints. Invoices compliant with Indian GST (18% ITC).
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#140E26] border border-[#2D1B4E] text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Conflict-Free Guarantee</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-[#1C1536] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} SpaceBook India Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Made with pride in India 🇮🇳</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
