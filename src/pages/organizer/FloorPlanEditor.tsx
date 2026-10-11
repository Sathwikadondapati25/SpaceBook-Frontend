import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import StallIcon from '../../components/StallIcon'
import { eventsApi, stallsApi } from '../../lib/api'
import { formatINR } from '../../lib/sampleData'
import { Plus, Grid3x3, Save, Trash2, Edit2, Loader2 } from 'lucide-react'

interface Stall {
  id?: number
  stallNumber: string
  dimensions: string
  price: number
  category: string
  facilities: string[]
  gridRow: number
  gridCol: number
  isAvailable: boolean
}

interface Event {
  id: number
  name: string
}

export default function FloorPlanEditor() {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [stalls, setStalls] = useState<Stall[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [gridSize, setGridSize] = useState(5)
  const [editingStall, setEditingStall] = useState<Stall | null>(null)
  const [showStallForm, setShowStallForm] = useState(false)

  useEffect(() => {
    if (eventId) {
      loadEventData()
    }
  }, [eventId])

  const loadEventData = async () => {
    try {
      setLoading(true)
      const [eventResponse, stallsResponse] = await Promise.all([
        eventsApi.getEvent(Number(eventId)),
        stallsApi.getEventStalls(Number(eventId))
      ])
      setEvent(eventResponse.data)
      setStalls(stallsResponse.data || [])
      
      // Calculate grid size based on max positions
      if (stallsResponse.data && stallsResponse.data.length > 0) {
        const maxRow = Math.max(...stallsResponse.data.map((s: Stall) => s.gridRow))
        const maxCol = Math.max(...stallsResponse.data.map((s: Stall) => s.gridCol))
        setGridSize(Math.max(gridSize, maxRow, maxCol))
      }
    } catch (error) {
      console.error('Failed to load event data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCellClick = (row: number, col: number) => {
    const existingStall = stalls.find(s => s.gridRow === row && s.gridCol === col)
    if (existingStall) {
      setEditingStall(existingStall)
      setShowStallForm(true)
    } else {
      setEditingStall({
        stallNumber: `${String.fromCharCode(65 + col)}${row + 1}`,
        dimensions: '3x3m',
        price: 25000,
        category: 'Standard',
        facilities: [],
        gridRow: row,
        gridCol: col,
        isAvailable: true,
      })
      setShowStallForm(true)
    }
  }

  const handleSaveStall = async () => {
    if (!editingStall || !eventId) return

    try {
      setSaving(true)
      if (editingStall.id) {
        await stallsApi.updateStall(Number(eventId), editingStall.id, editingStall)
      } else {
        await stallsApi.createStall(Number(eventId), editingStall)
      }
      loadEventData()
      setShowStallForm(false)
      setEditingStall(null)
    } catch (error) {
      console.error('Failed to save stall:', error)
      alert('Failed to save stall')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStall = async (stallId: number) => {
    if (!confirm('Are you sure you want to delete this stall?')) return

    try {
      await stallsApi.deleteStall(Number(eventId), stallId)
      loadEventData()
    } catch (error) {
      console.error('Failed to delete stall:', error)
      alert('Failed to delete stall')
    }
  }

  const getStallAtPosition = (row: number, col: number) => {
    return stalls.find(s => s.gridRow === row && s.gridCol === col)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-muted animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pb-80">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/organizer/events" className="flex items-center gap-2">
            <StallIcon color="accent" size={32} />
            <span className="text-2xl font-display font-bold text-text">SpaceBook</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/organizer/dashboard">
              <Button variant="ghost" size="small">Dashboard</Button>
            </Link>
            <Link to="/organizer/bookings">
              <Button variant="ghost" size="small">Booking Requests</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation without back arrow */}
          <div className="flex items-center gap-2 text-xs text-muted mb-6">
            <Link to="/organizer/events" className="hover:text-white transition-colors">
              Events
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Floor Plan Editor</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-text mb-2">Floor Plan Editor</h1>
              <p className="text-muted">{event?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted">Grid Size:</label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  className="w-20 px-3 py-2 rounded-lg border border-border bg-surface text-text text-center"
                />
              </div>
            </div>
          </div>

          {/* Grid Editor */}
          <Card padding="large" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-text">
                <Grid3x3 className="w-6 h-6 inline mr-2 text-primary-strong" />
                Stall Layout
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary-soft border border-primary-strong" />
                  <span className="text-muted">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#2D1220] border-2 border-rose-500/80" />
                  <span className="text-rose-300 font-medium">Booked</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-2 rounded-xl p-8">
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                  const row = Math.floor(index / gridSize)
                  const col = index % gridSize
                  const stall = getStallAtPosition(row, col)

                  return (
                    <button
                      key={index}
                      onClick={() => handleCellClick(row, col)}
                      className={`
                        relative aspect-square rounded-lg border-2 p-3 transition-all
                        ${stall
                          ? stall.isAvailable
                            ? 'border-emerald-500 bg-[#0E261E] text-emerald-300 hover:shadow-subtle cursor-pointer'
                            : 'border-2 border-rose-500/80 bg-[#2D1220] text-rose-100 cursor-not-allowed shadow-[inset_0_0_8px_rgba(244,63,94,0.25)]'
                          : 'border-border hover:border-border-strong hover:bg-surface cursor-pointer'
                        }
                      `}
                    >
                      {stall ? (
                        <div className="text-center">
                          <p className="text-lg font-display font-bold text-text">{stall.stallNumber}</p>
                          <p className="text-xs font-mono text-muted">{formatINR(stall.price)}</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Plus className="w-6 h-6 text-muted" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Stall List */}
          <Card padding="large">
            <h2 className="text-2xl font-display font-bold text-text mb-6">
              Stalls ({stalls.length})
            </h2>
            {stalls.length === 0 ? (
              <p className="text-muted text-center py-8">No stalls created yet. Click on the grid to add stalls.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stalls.map(stall => (
                  <div key={stall.id} className="bg-surface-2 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="primary" size="medium">{stall.stallNumber}</Badge>
                      <Badge variant={stall.isAvailable ? 'green' : 'red'} size="small">
                        {stall.isAvailable ? 'Available' : 'Booked'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted">Price:</span>
                        <span className="font-medium text-green-strong">{formatINR(stall.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Dimensions:</span>
                        <span className="font-medium text-text">{stall.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Category:</span>
                        <span className="font-medium text-text">{stall.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => {
                          setEditingStall(stall)
                          setShowStallForm(true)
                        }}
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => stall.id && handleDeleteStall(stall.id)}
                        className="text-red-strong hover:bg-red-soft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Stall Form Dialog */}
      {showStallForm && editingStall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <Card padding="large" className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-display font-bold text-text mb-6">
              {editingStall.id ? 'Edit Stall' : 'Add Stall'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Stall Number</label>
                <input
                  type="text"
                  value={editingStall.stallNumber}
                  onChange={(e) => setEditingStall({ ...editingStall, stallNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Dimensions</label>
                <input
                  type="text"
                  value={editingStall.dimensions}
                  onChange={(e) => setEditingStall({ ...editingStall, dimensions: e.target.value })}
                  placeholder="e.g., 3x3m"
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={editingStall.price}
                  onChange={(e) => setEditingStall({ ...editingStall, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Category</label>
                <select
                  value={editingStall.category}
                  onChange={(e) => setEditingStall({ ...editingStall, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Corner">Corner</option>
                  <option value="Food">Food</option>
                  <option value="Retail">Retail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Facilities (comma-separated)</label>
                <input
                  type="text"
                  value={editingStall.facilities.join(', ')}
                  onChange={(e) => setEditingStall({ 
                    ...editingStall, 
                    facilities: e.target.value.split(',').map(f => f.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., Power, Water, WiFi"
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={editingStall.isAvailable}
                  onChange={(e) => setEditingStall({ ...editingStall, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="available" className="text-sm text-text">Available for booking</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="primary"
                size="large"
                onClick={handleSaveStall}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Stall
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="large"
                onClick={() => {
                  setShowStallForm(false)
                  setEditingStall(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
