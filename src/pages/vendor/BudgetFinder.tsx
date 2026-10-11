import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import StallIcon from '../../components/StallIcon'
import { stallsApi } from '../../lib/api'
import { formatINR } from '../../lib/sampleData'
import { Filter, Check, Loader2, SlidersHorizontal } from 'lucide-react'

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

export default function BudgetFinder() {
  const { eventId } = useParams<{ eventId: string }>()
  const [stalls, setStalls] = useState<Stall[]>([])
  const [loading, setLoading] = useState(true)
  const [maxBudget, setMaxBudget] = useState<number>(35000)
  const [preferredCategory, setPreferredCategory] = useState<string>('')
  const [requiredFacilities, setRequiredFacilities] = useState<string[]>([])
  const [matches, setMatches] = useState<Stall[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (eventId) {
      loadStalls()
    }
  }, [eventId])

  const loadStalls = async () => {
    try {
      setLoading(true)
      const response = await stallsApi.getEventStalls(Number(eventId))
      setStalls(response.data || [])
    } catch (error) {
      console.error('Failed to load stalls:', error)
    } finally {
      setLoading(false)
    }
  }

  const findMatches = () => {
    const matching = stalls.filter(stall => {
      if (!stall.isAvailable) return false
      if (stall.price > maxBudget) return false
      if (preferredCategory && stall.category !== preferredCategory) return false
      if (requiredFacilities.length > 0) {
        const hasAllFacilities = requiredFacilities.every(facility =>
          stall.facilities.includes(facility)
        )
        if (!hasAllFacilities) return false
      }
      return true
    })

    setMatches(matching)
    setShowResults(true)
  }

  const toggleFacility = (facility: string) => {
    if (requiredFacilities.includes(facility)) {
      setRequiredFacilities(requiredFacilities.filter(f => f !== facility))
    } else {
      setRequiredFacilities([...requiredFacilities, facility])
    }
  }

  const allFacilities = Array.from(new Set(stalls.flatMap(s => s.facilities)))
  const allCategories = Array.from(new Set(stalls.map(s => s.category)))

  const getMatchReason = (stall: Stall) => {
    const reasons = []
    if (stall.price <= maxBudget) {
      reasons.push(`Within budget (${formatINR(stall.price)} ≤ ${formatINR(maxBudget)})`)
    }
    if (!preferredCategory || stall.category === preferredCategory) {
      reasons.push(`Matches category: ${stall.category}`)
    }
    if (requiredFacilities.length === 0 || requiredFacilities.every(f => stall.facilities.includes(f))) {
      reasons.push(`Has all required facilities`)
    }
    return reasons
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-muted animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={`/vendor/events/${eventId}`} className="flex items-center gap-2">
            <StallIcon color="primary" size={32} />
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
              Floor Plan
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Budget Finder</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-text mb-2">Budget-Based Stall Finder</h1>
            <p className="text-muted">Find stalls that match your budget and requirements across Indian venues</p>
          </div>

          {/* Budget Finder Form */}
          <Card padding="large" className="mb-8">
            <h2 className="text-2xl font-display font-bold text-text mb-6 flex items-center gap-2">
              <SlidersHorizontal className="w-6 h-6 text-primary" />
              Set Your Requirements
            </h2>

            <div className="space-y-6">
              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Maximum Budget: {formatINR(maxBudget)}
                </label>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-primary-strong"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>₹5,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Preferred Category (Optional)</label>
                <select
                  value={preferredCategory}
                  onChange={(e) => setPreferredCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary-strong/30"
                >
                  <option value="">Any Category</option>
                  {allCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Facilities */}
              {allFacilities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Required Facilities (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {allFacilities.map(facility => (
                      <button
                        key={facility}
                        onClick={() => toggleFacility(facility)}
                        className={`
                          px-4 py-2 rounded-lg font-medium transition-all
                          ${requiredFacilities.includes(facility)
                            ? 'bg-primary-strong text-white'
                            : 'bg-surface-2 text-text hover:bg-surface-2/80'
                          }
                        `}
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Button */}
              <Button
                variant="primary"
                size="large"
                onClick={findMatches}
                className="w-full"
              >
                <Filter className="w-5 h-5 mr-2" />
                Find Matching Stalls
              </Button>
            </div>
          </Card>

          {/* Results */}
          {showResults && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-text">
                  {matches.length} Matching Stall{matches.length !== 1 ? 's' : ''}
                </h2>
                <Button variant="ghost" size="small" onClick={() => setShowResults(false)}>
                  Clear Results
                </Button>
              </div>

              {matches.length === 0 ? (
                <Card padding="large" className="text-center">
                  <div className="py-12">
                    <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-4">
                      <Filter className="w-8 h-8 text-muted" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-text mb-2">No Matching Stalls</h3>
                    <p className="text-muted mb-4">Try adjusting your budget or requirements</p>
                    <Button variant="primary" onClick={() => {
                      setMaxBudget(5000)
                      setPreferredCategory('')
                      setRequiredFacilities([])
                    }}>
                      Reset Filters
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {matches.map(stall => (
                    <Card key={stall.id} padding="medium">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="primary" size="medium">{stall.stallNumber}</Badge>
                            <Badge variant="accent" size="small">{stall.category}</Badge>
                            <span className="text-2xl font-display font-bold text-green-strong">
                              {formatINR(stall.price)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-muted">Dimensions</p>
                              <p className="font-medium text-text">{stall.dimensions}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted">Location</p>
                              <p className="font-medium text-text">Row {stall.gridRow}, Col {stall.gridCol}</p>
                            </div>
                          </div>

                          <div className="bg-surface-2 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-text mb-2">Why this matches:</p>
                            <ul className="space-y-1">
                              {getMatchReason(stall).map((reason, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-muted">
                                  <Check className="w-4 h-4 text-green-strong flex-shrink-0" />
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {stall.facilities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {stall.facilities.map((facility, index) => (
                                <Badge key={index} variant="blue" size="small">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <Link to={`/vendor/events/${eventId}/stalls/${stall.id}`}>
                          <Button variant="primary" size="medium">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
