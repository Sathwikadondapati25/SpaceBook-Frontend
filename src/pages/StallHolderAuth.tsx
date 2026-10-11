import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import { authApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import StallIcon from '../components/StallIcon'
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Phone,
  AlertCircle
} from 'lucide-react'

export default function StallHolderAuth() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    contactName: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (user.isProfileComplete === false) {
        navigate('/onboarding', { replace: true })
      } else if (user.role === 'ORGANIZER') {
        navigate('/organizer/dashboard', { replace: true })
      } else {
        navigate('/vendor/dashboard', { replace: true })
      }
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.')
      return
    }

    try {
      setLoading(true)
      if (isLogin) {
        const res = await authApi.login(formData.email, formData.password)
        const loggedInUser = res?.data || res?.user
        // Force sync user state immediately
        refreshUser()
        if (loggedInUser?.isProfileComplete === false) {
          navigate('/onboarding', { replace: true })
        } else {
          navigate('/vendor/dashboard', { replace: true })
        }
      } else {
        await authApi.register({
          email: formData.email,
          password: formData.password,
          role: 'VENDOR',
        })
        // Force sync user state immediately
        refreshUser()
        // Strict Onboarding: Every newly registered user must complete their business profile
        navigate('/onboarding', { replace: true })
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please verify your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#7C3AED]/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#F472B6]/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F472B6] p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#1A1233] rounded-[10px] flex items-center justify-center">
                <StallIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <span className="text-2xl font-display font-extrabold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              SpaceBook
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white">
            {isLogin ? 'Vendor Sign In' : 'Create Vendor Account'}
          </h1>
          <p className="text-xs text-muted mt-1">
            {isLogin ? 'Access your stall bookings and floor map selections' : 'Join as an exhibitor to book stalls across premier expos'}
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-[#1A1233] border border-[#3D2A5C] rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-soft border border-red/40 text-red text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="vendor@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              showPasswordToggle
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            {isLogin && (
              <div className="flex justify-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-primary hover:text-accent font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            {!isLogin && (
              <>
                <Input
                  label="Business / Brand Name"
                  type="text"
                  placeholder="E.g., Bangalore Tech Innovations Pvt Ltd"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  leftIcon={<StallIcon className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Contact Person Name"
                  type="text"
                  placeholder="Full name (e.g., Rajesh Kumar)"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Phone Number (Indian WhatsApp / Mobile)"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
              </>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full gap-2 shadow-[0_0_20px_rgba(183,148,246,0.3)]"
                loading={loading}
              >
                <span>{isLogin ? 'Sign In to Workspace' : 'Create Vendor Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Switch Login / Register */}
          <div className="mt-6 text-center pt-5 border-t border-border/60">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-xs text-muted hover:text-white transition-colors"
            >
              {isLogin ? (
                <>New to SpaceBook? <span className="text-primary font-bold">Register as Exhibitor</span></>
              ) : (
                <>Already have an account? <span className="text-primary font-bold">Sign In</span></>
              )}
            </button>
          </div>
        </div>

        {/* Portal Switch Link without back arrow */}
        <div className="text-center mt-6">
          <Link to="/auth/organizer" className="text-xs text-muted hover:text-white transition-colors">
            Switch to Organizer Operations Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
