import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import StallIcon from '../../components/StallIcon'
import { eventsApi } from '../../lib/api'
import { Loader2 } from 'lucide-react'

export default function CreateEvent() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const isEditing = !!eventId

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    city: '',
    startDate: '',
    endDate: '',
    category: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEditing && eventId) {
      loadEvent()
    }
  }, [eventId, isEditing])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const response = await eventsApi.getEvent(Number(eventId))
      const event = response.data
      setFormData({
        name: event.name || '',
        description: event.description || '',
        venue: event.venue || '',
        city: event.city || '',
        startDate: event.startDate ? event.startDate.split('T')[0] : '',
        endDate: event.endDate ? event.endDate.split('T')[0] : '',
        category: event.category || '',
      })
    } catch (error) {
      console.error('Failed to load event:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Event name is required'
      if (!formData.description.trim()) newErrors.description = 'Description is required'
      if (!formData.category.trim()) newErrors.category = 'Category is required'
    }

    if (currentStep === 2) {
      if (!formData.venue.trim()) newErrors.venue = 'Venue is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
    }

    if (currentStep === 3) {
      if (!formData.startDate) newErrors.startDate = 'Start date is required'
      if (!formData.endDate) newErrors.endDate = 'End date is required'
      if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(step)) return

    try {
      setSubmitting(true)

      const eventData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      }

      if (isEditing && eventId) {
        await eventsApi.updateEvent(Number(eventId), eventData)
        navigate('/organizer/events')
      } else {
        const response = await eventsApi.createEvent(eventData)
        // Navigate to floor plan editor after creating event
        navigate(`/organizer/events/${response.data.id}/floor-plan`)
      }
    } catch (error: any) {
      console.error('Failed to save event:', error)
      alert(error.response?.data?.message || 'Failed to save event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-muted animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
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
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb Navigation without back arrow */}
          <div className="flex items-center gap-2 text-xs text-muted mb-6">
            <Link to="/organizer/events" className="hover:text-white transition-colors">
              Events
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{isEditing ? 'Edit Event' : 'Create Event'}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-text mb-2">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-muted">
              {isEditing ? 'Update your event details' : 'Fill in the details to create a new event'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-medium
                    ${step >= s ? 'bg-primary-strong text-white' : 'bg-surface-2 text-muted'}
                  `}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`
                      w-16 h-0.5 mx-2
                      ${step > s ? 'bg-primary-strong' : 'bg-border'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <Card padding="large">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-display font-bold text-text mb-4">Basic Information</h2>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Event Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g., Summer Food Festival 2024"
                      className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-strong/30"
                    />
                    {errors.name && <p className="text-sm text-red-strong mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe your event..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-strong/30 resize-none"
                    />
                    {errors.description && <p className="text-sm text-red-strong mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary-strong/30"
                    >
                      <option value="">Select a category</option>
                      <option value="Food Festival">Food Festival</option>
                      <option value="Art Fair">Art Fair</option>
                      <option value="Craft Market">Craft Market</option>
                      <option value="Tech Expo">Tech Expo</option>
                      <option value="Music Festival">Music Festival</option>
                      <option value="Trade Show">Trade Show</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.category && <p className="text-sm text-red-strong mt-1">{errors.category}</p>}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="button" variant="primary" size="large" onClick={handleNext}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-display font-bold text-text mb-4">Location</h2>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Venue *</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => handleChange('venue', e.target.value)}
                      placeholder="e.g., BIEC / HITEX / Bharat Mandapam"
                      className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-strong/30"
                    />
                    {errors.venue && <p className="text-sm text-red-strong mt-1">{errors.venue}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="e.g., Bengaluru, New Delhi, Hyderabad"
                      className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-strong/30"
                    />
                    {errors.city && <p className="text-sm text-red-strong mt-1">{errors.city}</p>}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" size="large" onClick={handleBack}>
                      Back
                    </Button>
                    <Button type="button" variant="primary" size="large" onClick={handleNext}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Dates */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-display font-bold text-text mb-4">Event Dates</h2>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary-strong/30"
                    />
                    {errors.startDate && <p className="text-sm text-red-strong mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">End Date *</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary-strong/30"
                    />
                    {errors.endDate && <p className="text-sm text-red-strong mt-1">{errors.endDate}</p>}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" size="large" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        isEditing ? 'Update Event' : 'Create Event'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            {!isEditing && (
              <div className="mt-6 pt-6 border-t border-border">
                <Link to="/organizer/events">
                  <Button variant="ghost" size="large" className="w-full">
                    Skip for now, manage stalls later
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
