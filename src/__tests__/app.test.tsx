import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { formatINR, EventData } from '../lib/sampleData'
import StallIcon from '../components/StallIcon'
import PublicOnlyRoute from '../components/PublicOnlyRoute'
import ProtectedRoute from '../components/ProtectedRoute'
import * as AuthContext from '../context/AuthContext'

describe('Indian Currency Formatting (formatINR)', () => {
  it('formats numbers with the Indian Rupee symbol (₹)', () => {
    const formatted = formatINR(25000)
    expect(formatted).toContain('₹')
    expect(formatted).toContain('25,000')
  })

  it('formats large values using Indian lakh/crore commas', () => {
    const formatted = formatINR(100000)
    expect(formatted).toContain('₹')
    expect(formatted).toContain('1,00,000')
  })

  it('handles zero and string inputs gracefully', () => {
    expect(formatINR(0)).toBe('₹0')
    expect(formatINR('invalid')).toBe('₹0')
  })
})

describe('Stall Canopy Brand Icon (StallIcon)', () => {
  it('renders SVG stall canopy icon with correct geometry', () => {
    const { container } = render(<StallIcon size={24} className="text-primary" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })
})

describe('Event Minimum Price Sorting Logic', () => {
  const getEventMinPrice = (event: Partial<EventData>): number | null => {
    if (event.minPrice && typeof event.minPrice === 'number' && event.minPrice > 0) {
      return event.minPrice
    }
    if (!event.priceRange) return null
    const clean = event.priceRange.replace(/,/g, '')
    const match = clean.match(/([0-9]+(?:\.[0-9]+)?)/)
    if (match) {
      const val = parseFloat(match[1])
      return isNaN(val) ? null : val
    }
    return null
  }

  const events: Partial<EventData>[] = [
    { id: 1, name: 'High End Expo', minPrice: 75000 },
    { id: 2, name: 'Budget Expo', minPrice: 15000 },
    { id: 3, name: 'Mid Expo', minPrice: 35000 },
    { id: 4, name: 'TBD Expo', minPrice: undefined, priceRange: undefined },
  ]

  it('sorts events price low-to-high placing unpriced events last', () => {
    const sorted = [...events].sort((a, b) => {
      const pA = getEventMinPrice(a)
      const pB = getEventMinPrice(b)
      if (pA !== null && pB !== null) return pA - pB
      if (pA !== null && pB === null) return -1
      if (pA === null && pB !== null) return 1
      return 0
    })

    expect(sorted[0].name).toBe('Budget Expo')
    expect(sorted[1].name).toBe('Mid Expo')
    expect(sorted[2].name).toBe('High End Expo')
    expect(sorted[3].name).toBe('TBD Expo')
  })

  it('sorts events price high-to-low placing unpriced events last', () => {
    const sorted = [...events].sort((a, b) => {
      const pA = getEventMinPrice(a)
      const pB = getEventMinPrice(b)
      if (pA !== null && pB !== null) return pB - pA
      if (pA !== null && pB === null) return -1
      if (pA === null && pB !== null) return 1
      return 0
    })

    expect(sorted[0].name).toBe('High End Expo')
    expect(sorted[1].name).toBe('Mid Expo')
    expect(sorted[2].name).toBe('Budget Expo')
    expect(sorted[3].name).toBe('TBD Expo')
  })
})

describe('Route Navigation Guards and Role Authorization', () => {
  it('PublicOnlyRoute renders children when user is not authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
      setUserSession: vi.fn(),
      refreshUser: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/auth']}>
        <PublicOnlyRoute>
          <div>Public Login Page</div>
        </PublicOnlyRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Public Login Page')).toBeInTheDocument()
  })

  it('ProtectedRoute redirects unauthenticated users away from private content', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
      setUserSession: vi.fn(),
      refreshUser: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/vendor/dashboard']}>
        <ProtectedRoute requiredRole="VENDOR">
          <div>Private Vendor Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.queryByText('Private Vendor Dashboard')).not.toBeInTheDocument()
  })

  it('ProtectedRoute prevents Vendor from accessing Organizer private routes', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: {
        id: 1,
        email: 'vendor@test.com',
        role: 'VENDOR',
        isProfileComplete: true,
      },
      isAuthenticated: true,
      logout: vi.fn(),
      setUserSession: vi.fn(),
      refreshUser: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/organizer/dashboard']}>
        <ProtectedRoute requiredRole="ORGANIZER">
          <div>Private Organizer Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.queryByText('Private Organizer Dashboard')).not.toBeInTheDocument()
  })
})
