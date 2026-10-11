export interface EventData {
  id: number
  name: string
  description: string
  venue: string
  city: string
  state: string
  country: string
  startDate: string
  endDate: string
  category: string
  status: string
  totalStalls: number
  availableStalls: number
  priceRange: string
  minPrice?: number
  imageUrl: string
  latitude: number
  longitude: number
  organizerId?: number
  organizerName: string
}

export interface StallData {
  id: number
  eventId: number
  stallNumber: string
  dimensions: string
  width: number
  depth: number
  price: number // In Indian Rupees (INR)
  gstPercentage: number
  category: string
  facilities: string[]
  gridRow: number
  gridCol: number
  isAvailable: boolean
  status: 'available' | 'pending' | 'booked'
  notes?: string
}

export interface BookingData {
  id: number
  stallId: number
  eventId: number
  eventName: string
  stallNumber: string
  vendorId: number
  vendorName: string
  vendorEmail: string
  vendorPhone: string
  vendorGstin?: string
  category: string
  price: number // In INR
  requestedDate: string
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  message?: string
  rejectionReason?: string
  paymentStatus?: 'PENDING' | 'PAID' | 'INVOICED'
}

// Indian Currency Formatter helper: e.g. ₹25,000
export const formatINR = (val: number | string): string => {
  const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, '')) : val
  if (isNaN(num)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

export const SAMPLE_EVENTS: EventData[] = [
  {
    id: 1,
    name: 'Bengaluru Tech & AI Innovation Summit 2026',
    description: 'India’s marquee technology exposition uniting AI developers, semiconductor founders, SaaS leaders, and deep-tech hardware innovators. Over 40,000 delegates.',
    venue: 'Bengaluru International Exhibition Centre (BIEC), Tumkur Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    startDate: '2026-11-15T09:00:00Z',
    endDate: '2026-11-18T18:00:00Z',
    category: 'Technology',
    status: 'PUBLISHED',
    totalStalls: 36,
    availableStalls: 14,
    priceRange: '₹35,000 - ₹1,20,000',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    latitude: 13.0618,
    longitude: 77.4746,
    organizerId: 2,
    organizerName: 'Nexus India Expos Pvt Ltd',
  },
  {
    id: 2,
    name: 'Hyderabad Global Food & Hospitality Fair 2026',
    description: 'South India’s premier culinary and beverage marketplace featuring commercial kitchen equipment, regional spice masters, organic growers, and packaging technology.',
    venue: 'HITEX Exhibition Center, Izzat Nagar, Hitec City',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    startDate: '2026-11-28T10:00:00Z',
    endDate: '2026-12-01T20:00:00Z',
    category: 'Food & Beverage',
    status: 'PUBLISHED',
    totalStalls: 30,
    availableStalls: 11,
    priceRange: '₹22,000 - ₹75,000',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    latitude: 17.4716,
    longitude: 78.3728,
    organizerId: 2,
    organizerName: 'Nexus India Expos Pvt Ltd',
  },
  {
    id: 3,
    name: 'Bharat Handloom & Artisanal Heritage Expo',
    description: 'A grand celebration of Indian handloom weavers, terracotta artisans, Kashmiri shawls, Brassware of Moradabad, and sustainable slow fashion designers.',
    venue: 'Bharat Mandapam (Pragati Maidan), Mathura Road',
    city: 'New Delhi',
    state: 'Delhi NCR',
    country: 'India',
    startDate: '2026-12-05T10:00:00Z',
    endDate: '2026-12-09T20:00:00Z',
    category: 'Art & Craft',
    status: 'PUBLISHED',
    totalStalls: 36,
    availableStalls: 16,
    priceRange: '₹18,000 - ₹55,000',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    latitude: 28.6186,
    longitude: 77.2435,
    organizerId: 2,
    organizerName: 'Nexus India Expos Pvt Ltd',
  },
  {
    id: 4,
    name: 'Mumbai SME & Industrial Manufacturing Expo',
    description: 'B2B engineering, CNC robotics, clean power systems, precision tools, and packaging logistics platform for commercial MSMEs and heavy industrial suppliers.',
    venue: 'Bombay Exhibition Centre (NESCO), Western Express Hwy, Goregaon East',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    startDate: '2026-12-14T09:30:00Z',
    endDate: '2026-12-17T18:00:00Z',
    category: 'Business',
    status: 'PUBLISHED',
    totalStalls: 36,
    availableStalls: 12,
    priceRange: '₹40,000 - ₹1,45,000',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    latitude: 19.1487,
    longitude: 72.8553,
    organizerId: 2,
    organizerName: 'Nexus India Expos Pvt Ltd',
  },
  {
    id: 5,
    name: 'Chennai Automotive & EV Components Conclave',
    description: 'India’s automotive capital hosts tier-1 component manufacturers, battery pack engineers, charging infra providers, and smart telematics providers.',
    venue: 'Chennai Trade Centre, Mount Poonamallee Rd, Nandambakkam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    startDate: '2027-01-10T09:00:00Z',
    endDate: '2027-01-13T17:30:00Z',
    category: 'Technology',
    status: 'PUBLISHED',
    totalStalls: 30,
    availableStalls: 9,
    priceRange: '₹30,000 - ₹95,000',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    latitude: 13.0185,
    longitude: 80.1837,
    organizerId: 2,
    organizerName: 'Nexus India Expos Pvt Ltd',
  },
  {
    id: 6,
    name: 'Kolkata Design, Book & Print Publishers Fair',
    description: 'Eastern India’s flagship literary and commercial print exhibition celebrating independent publishers, typography studios, stationery artisans, and digital print labs.',
    venue: 'Biswa Bangla Mela Prangan, J.B.S. Haldane Ave, Tangra',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    startDate: '2027-01-22T11:00:00Z',
    endDate: '2027-01-26T20:00:00Z',
    category: 'Art & Craft',
    status: 'PUBLISHED',
    totalStalls: 24,
    availableStalls: 10,
    priceRange: '₹15,000 - ₹48,000',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    latitude: 22.5448,
    longitude: 88.3975,
    organizerId: 2,
    organizerName: 'Nexus India Expos Pvt Ltd',
  },
]

export const generateSampleStalls = (eventId: number): StallData[] => {
  const facilitiesPool = [
    '230V 16A Commercial Power Plug',
    'High-Speed Wi-Fi (50 Mbps Dedicated)',
    'Overhead Spotlight Rigging',
    'Direct Water Outlet & Basin',
    'Indian Standard Furniture Set (1 Table, 2 Chairs)',
    'Nightly Housekeeping & Waste Clearance',
    'Lockable Storage Cabinet',
    'Prime Two-Side Corner Exposure',
  ]

  const stalls: StallData[] = []
  const rows = 5
  const cols = 6

  let idCounter = 1
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const stallNumber = `${String.fromCharCode(64 + r)}${c}`
      const isCorner = (r === 1 || r === rows) && (c === 1 || c === cols)
      const isFront = r === 1
      const category = isCorner
        ? 'Prime Corner'
        : isFront
        ? 'Main Aisle Front'
        : r === 3 && (c === 3 || c === 4)
        ? 'Center Island'
        : 'Standard Booth'

      // Realistic Indian Rupees Stall Pricing
      const basePrice = category === 'Prime Corner' ? 45000 : category === 'Center Island' ? 55000 : category === 'Main Aisle Front' ? 38000 : 25000
      const price = basePrice + (r * 1200) + (c * 800)

      // Deterministic realistic layout state
      const hash = (eventId * 19 + r * 7 + c * 13) % 10
      let status: 'available' | 'pending' | 'booked' = 'available'
      if (hash === 1 || hash === 4 || hash === 7) {
        status = 'booked'
      } else if (hash === 3 || hash === 8) {
        status = 'pending'
      }

      const assignedFacilities = [
        facilitiesPool[0],
        facilitiesPool[1],
        ...(isCorner ? [facilitiesPool[7], facilitiesPool[2]] : []),
        ...(r % 2 === 0 ? [facilitiesPool[4]] : []),
        facilitiesPool[5],
      ]

      stalls.push({
        id: (eventId - 1) * 30 + idCounter,
        eventId,
        stallNumber,
        dimensions: isCorner ? '4m × 3m (130 sq.ft)' : '3m × 3m (100 sq.ft)',
        width: isCorner ? 4 : 3,
        depth: 3,
        price,
        gstPercentage: 18,
        category,
        facilities: assignedFacilities,
        gridRow: r,
        gridCol: c,
        isAvailable: status === 'available',
        status,
        notes: isCorner ? 'Corner dual-aisle exposure facing entrance' : 'Standard 10x10 octanorm exhibition shell space',
      })

      idCounter++
    }
  }

  return stalls
}

export const SAMPLE_BOOKINGS: BookingData[] = [
  {
    id: 101,
    stallId: 4,
    eventId: 1,
    eventName: 'Bengaluru Tech & AI Innovation Summit 2026',
    stallNumber: 'A4',
    vendorId: 1,
    vendorName: 'Kavita Sundaram (Sattva AI Labs)',
    vendorEmail: 'kavita@sattvalabs.in',
    vendorPhone: '+91 98451 23456',
    vendorGstin: '29AABCS1429B1Z8',
    category: 'Technology',
    price: 48000,
    requestedDate: '2026-10-08T11:20:00Z',
    status: 'APPROVED',
    message: 'We will be showcasing our edge-AI inference microchips and demo workstations.',
    paymentStatus: 'PAID',
  },
  {
    id: 102,
    stallId: 7,
    eventId: 1,
    eventName: 'Bengaluru Tech & AI Innovation Summit 2026',
    stallNumber: 'B1',
    vendorId: 3,
    vendorName: 'Rohit Verma (Indus Robotic Arms)',
    vendorEmail: 'rohit@indusrobotics.co.in',
    vendorPhone: '+91 99100 88234',
    vendorGstin: '07AAACI1921K1ZM',
    category: 'Technology',
    price: 36000,
    requestedDate: '2026-10-10T14:45:00Z',
    status: 'REQUESTED',
    message: 'Need 3-phase electric supply for collaborative industrial arm demo.',
    paymentStatus: 'PENDING',
  },
  {
    id: 103,
    stallId: 35,
    eventId: 2,
    eventName: 'Hyderabad Global Food & Hospitality Fair 2026',
    stallNumber: 'B5',
    vendorId: 1,
    vendorName: 'Rameshwaram Specialty Coffee',
    vendorEmail: 'rameshwaram.brews@gmail.com',
    vendorPhone: '+91 98200 44556',
    vendorGstin: '36AAACR8823F1ZV',
    category: 'Food & Beverage',
    price: 32000,
    requestedDate: '2026-10-09T09:15:00Z',
    status: 'REQUESTED',
    message: 'Specialty filter coffee bean roastery live cupping stall.',
    paymentStatus: 'PENDING',
  },
  {
    id: 104,
    stallId: 18,
    eventId: 3,
    eventName: 'Bharat Handloom & Artisanal Heritage Expo',
    stallNumber: 'C6',
    vendorId: 4,
    vendorName: 'Chanderi Weavers Collective',
    vendorEmail: 'contact@chanderiheritage.org',
    vendorPhone: '+91 94250 67123',
    vendorGstin: '23AABCC1122D1Z0',
    category: 'Art & Craft',
    price: 28000,
    requestedDate: '2026-10-07T16:00:00Z',
    status: 'APPROVED',
    message: 'Authentic GI-tagged silk and cotton sarees direct from loom master craftsmen.',
    paymentStatus: 'PAID',
  },
  {
    id: 105,
    stallId: 21,
    eventId: 4,
    eventName: 'Mumbai SME & Industrial Manufacturing Expo',
    stallNumber: 'D3',
    vendorId: 5,
    vendorName: 'Zenith Laser Tools Pvt Ltd',
    vendorEmail: 'sales@zenithlasers.in',
    vendorPhone: '+91 98220 11998',
    vendorGstin: '27AAACZ4455H1ZP',
    category: 'Business',
    price: 52000,
    requestedDate: '2026-10-11T08:30:00Z',
    status: 'REQUESTED',
    message: 'CNC fiber laser marking and welding machine live display.',
    paymentStatus: 'PENDING',
  },
]
