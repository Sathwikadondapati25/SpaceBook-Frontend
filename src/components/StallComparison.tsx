import { X, Check, XCircle } from 'lucide-react'
import Badge from './Badge'
import Card from './Card'
import Button from './Button'

interface Stall {
  id: number
  stallNumber: string
  dimensions: string
  price: number
  category: string
  facilities: string[]
  gridRow: number
  gridCol: number
}

interface StallComparisonProps {
  stalls: Stall[]
  onRemove: (stallId: number) => void
  onClear: () => void
}

export default function StallComparison({ stalls, onRemove, onClear }: StallComparisonProps) {
  if (stalls.length === 0) return null

  const formatPrice = (price: number) => `$${price.toLocaleString()}`

  const renderFacilityCheck = (facility: string, hasFacility: boolean) => (
    <div key={facility} className="flex items-center gap-2 text-sm">
      {hasFacility ? (
        <Check className="w-4 h-4 text-green-strong" />
      ) : (
        <XCircle className="w-4 h-4 text-muted" />
      )}
      <span className={hasFacility ? 'text-text' : 'text-muted'}>{facility}</span>
    </div>
  )

  const allFacilities = Array.from(
    new Set(stalls.flatMap(s => s.facilities))
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border animate-slide-up">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-text">
            Comparing {stalls.length} Stall{stalls.length > 1 ? 's' : ''}
          </h3>
          <Button variant="ghost" size="small" onClick={onClear}>
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stalls.map(stall => (
            <Card key={stall.id} padding="medium" className="relative">
              <button
                onClick={() => onRemove(stall.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center hover:bg-red-soft hover:text-red-strong transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <Badge variant="primary" size="small" className="mb-2">
                  {stall.stallNumber}
                </Badge>
                <p className="text-2xl font-display font-bold text-text">
                  {formatPrice(stall.price)}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted mb-1">Dimensions</p>
                  <p className="font-medium text-text">{stall.dimensions}</p>
                </div>

                <div>
                  <p className="text-muted mb-1">Category</p>
                  <Badge variant="accent" size="small">{stall.category}</Badge>
                </div>

                <div>
                  <p className="text-muted mb-1">Location</p>
                  <p className="font-medium text-text">
                    Row {stall.gridRow}, Col {stall.gridCol}
                  </p>
                </div>

                {allFacilities.length > 0 && (
                  <div>
                    <p className="text-muted mb-2">Facilities</p>
                    <div className="space-y-1">
                      {allFacilities.map(facility =>
                        renderFacilityCheck(facility, stall.facilities.includes(facility))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {stalls.length < 3 && (
          <p className="text-center text-sm text-muted mt-4">
            Select up to {3 - stalls.length} more stall{3 - stalls.length > 1 ? 's' : ''} to compare
          </p>
        )}
      </div>
    </div>
  )
}
