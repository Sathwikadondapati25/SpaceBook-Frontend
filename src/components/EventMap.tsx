import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issues
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface Event {
  id: number
  name: string
  city: string
  state?: string
  venue: string
  latitude?: number
  longitude?: number
  totalStalls: number
  availableStalls: number
  priceRange?: string
  category?: string
}

interface EventMapProps {
  events: Event[]
  onEventClick: (event: Event) => void
  selectedEventId?: number
  selectedCity?: string
  customCenter?: [number, number]
}

// Indian metropolitan hub coordinates default map
export const INDIA_CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'bengaluru': { lat: 13.0618, lng: 77.4746 },
  'hyderabad': { lat: 17.4716, lng: 78.3728 },
  'new delhi': { lat: 28.6186, lng: 77.2435 },
  'delhi': { lat: 28.6186, lng: 77.2435 },
  'mumbai': { lat: 19.1487, lng: 72.8553 },
  'chennai': { lat: 13.0185, lng: 80.1837 },
  'kolkata': { lat: 22.5448, lng: 88.3975 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
}

function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom, { animate: true })
  }, [center, zoom, map])
  return null
}

export default function EventMap({ events, onEventClick, selectedCity, customCenter }: EventMapProps) {
  const [markers, setMarkers] = useState<any[]>([])

  useEffect(() => {
    // Only map events with verified geographical coordinates. Never plot fake [0,0] markers.
    const validMarkers = events.filter((event) => {
      const lat = Number(event.latitude)
      const lng = Number(event.longitude)
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0 && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
    }).map((event) => ({
      ...event,
      latitude: Number(event.latitude),
      longitude: Number(event.longitude),
    }))

    setMarkers(validMarkers)
  }, [events])

  const createIcon = (availableCount: number) => {
    const isPlenty = availableCount > 10
    const bgColor = isPlenty ? '#10B981' : '#F59E0B'
    return L.divIcon({
      className: 'custom-india-marker',
      html: `
        <div style="
          background: ${bgColor};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid #1A1233;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 11px;
          box-shadow: 0 0 15px ${bgColor};
          cursor: pointer;
        ">
          ${availableCount}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })
  }

  const cityKey = (selectedCity || '').toLowerCase().trim()
  const cityMatch = INDIA_CITY_COORDS[cityKey]
  const targetCenter: [number, number] = customCenter || (cityMatch ? [cityMatch.lat, cityMatch.lng] : [20.5937, 78.9629])
  const targetZoom = (selectedCity && selectedCity !== 'All') || customCenter ? 11 : 5

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-[#3D2A5C] group">
      <MapContainer
        center={targetCenter}
        zoom={targetZoom}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[480px] spacebook-osm-map"
        style={{ background: '#0F0A1E' }}
      >
        <MapViewController center={targetCenter} zoom={targetZoom} />
        {/* Standard OpenStreetMap Tile Layer - No API key watermark, full contributor attribution */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {markers.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={createIcon(event.availableStalls)}
          >
            <Popup className="custom-popup">
              <div style={{ background: '#1A1233', color: '#FFFFFF', padding: '12px', borderRadius: '12px', minWidth: '220px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#B794F6', fontWeight: 'bold' }}>
                  {event.city}, India 🇮🇳
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: '4px 0', color: '#FFFFFF', lineHeight: '1.2' }}>
                  {event.name}
                </h4>
                <p style={{ fontSize: '11px', color: '#A89BC0', margin: '0 0 8px 0' }}>
                  {event.venue}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #3D2A5C' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 'bold' }}>
                      {event.availableStalls} Stalls Open
                    </span>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#FFFFFF' }}>
                      {event.priceRange || '₹25,000+'}
                    </div>
                  </div>
                  <button
                    onClick={() => onEventClick(event)}
                    style={{
                      background: '#7C3AED',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    View Plan
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
