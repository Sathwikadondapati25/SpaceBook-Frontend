import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import { authApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import {
  Building2,
  Store,
  Phone,
  MapPin,
  CheckCircle2,
  FileText
} from 'lucide-react'

const INDIAN_STATES = [
  'Karnataka',
  'Telangana',
  'Maharashtra',
  'Delhi NCR',
  'Tamil Nadu',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'Kerala',
  'Punjab',
  'Madhya Pradesh',
  'Andhra Pradesh',
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, setUserSession } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    category: 'Technology',
    gstin: '',
    description: '',
  })

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true })
      return
    }
    if (user.isProfileComplete === true) {
      navigate(user.role === 'ORGANIZER' ? '/organizer/dashboard' : '/vendor/dashboard', { replace: true })
      return
    }
    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      businessName: user.businessName || '',
      phone: user.phone || '',
      city: user.city || 'Bengaluru',
      state: user.state || 'Karnataka',
      gstin: user.gstin || '',
    }))
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Please provide your full contact name.')
      return
    }
    if (!formData.phone.trim()) {
      setError('Please provide an active mobile number for verification.')
      return
    }

    try {
      setSubmitting(true)
      const res = authApi.completeProfile({
        name: formData.name,
        businessName: formData.businessName || formData.name,
        phone: formData.phone.startsWith('+91') ? formData.phone : `+91 ${formData.phone}`,
        city: formData.city,
        state: formData.state,
        gstin: formData.gstin || undefined,
        category: formData.category,
        description: formData.description || 'Indian commercial exhibitor and verified stall partner.',
      })

      if (res.data) {
        setUserSession(res.data)
      }

      if (user?.role === 'ORGANIZER') {
        navigate('/organizer/dashboard', { replace: true })
      } else {
        navigate('/vendor/dashboard', { replace: true })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile registration.')
    } finally {
      setSubmitting(false)
    }
  }

  const isOrganizer = user?.role === 'ORGANIZER'

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex items-center justify-center p-6 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F472B6]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 my-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-xs font-semibold text-primary mb-3">
            <span>🇮🇳</span>
            <span>Indian Exhibition Compliance & KYC</span>
          </div>

          <h1 className="text-3xl font-display font-black text-white tracking-tight">
            Complete Your {isOrganizer ? 'Organizer' : 'Exhibitor'} Profile
          </h1>
          <p className="text-sm text-muted mt-1.5 max-w-md mx-auto">
            Mandatory one-time registration to comply with Indian trade expo allocation regulations and conflict-free booth guarantees.
          </p>
        </div>

        {/* Onboarding Form Card */}
        <div className="bg-[#1A1233] border border-[#3D2A5C] rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-soft border border-red text-red text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Role Banner */}
            <div className="p-4 rounded-2xl bg-surface-2 border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center text-primary">
                  {isOrganizer ? <Building2 className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs text-muted">Account Registered As</p>
                  <p className="text-sm font-bold text-white font-mono">{user?.email}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                {user?.role}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label={isOrganizer ? "Organization / Company Name" : "Business / Brand Name"}
                placeholder={isOrganizer ? "E.g., Nexus India Expos Pvt Ltd" : "E.g., Sattva AI & Hardware Labs"}
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />

              <Input
                label="Authorized Representative / Contact Name"
                placeholder="Full Legal Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Mobile Phone Number"
                placeholder="+91 98451 23456"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                leftIcon={<Phone className="w-4 h-4" />}
                helper="Used for instant WhatsApp/SMS booking confirmations"
                required
              />

              <Input
                label={isOrganizer ? "CIN / Registration Number (Optional)" : "GSTIN / Udyam Number (Optional)"}
                placeholder={isOrganizer ? "U74999KA2020PTC123456" : "29AABCS1429B1Z8"}
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                leftIcon={<FileText className="w-4 h-4" />}
                helper="For tax invoices and GST credits"
              />

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">State (India)</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0F0A1E] border border-border text-sm text-white focus:outline-none focus:border-primary"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <Input
                label="City / District"
                placeholder="E.g., Bengaluru, Hyderabad, Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                leftIcon={<MapPin className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Primary Exhibition Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#0F0A1E] border border-border text-sm text-white focus:outline-none focus:border-primary"
              >
                <option value="Technology">Technology, AI & Electronics</option>
                <option value="Food & Beverage">Food & Beverage, Hospitality</option>
                <option value="Art & Craft">Handloom, Artisanal Crafts & Heritage</option>
                <option value="Business">MSME, Heavy Machinery & Engineering</option>
                <option value="Fashion & Apparel">Fashion, Jewelry & Bridal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                {isOrganizer ? "Exhibition Portfolio & Venue Experience" : "Product Catalog & Stall Display Description"}
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe what products, demonstrations, or machinery you exhibit..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-[#0F0A1E] border border-border text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-muted/60"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={submitting}
                className="w-full gap-2 shadow-[0_0_25px_rgba(183,148,246,0.35)]"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Save Profile & Enter Workspace</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
