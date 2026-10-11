import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store, Building2, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StallIcon from '../components/StallIcon'

export default function AuthHub() {
  const { user } = useAuth()
  const navigate = useNavigate()

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
  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#7C3AED]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#F472B6]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#B794F6] to-[#F472B6] p-0.5 shadow-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#1A1233] rounded-[14px] flex items-center justify-center">
                <StallIcon className="w-6 h-6 text-[#B794F6]" />
              </div>
            </div>
            <span className="text-3xl font-display font-extrabold bg-gradient-to-r from-white via-[#E2D9F3] to-[#B794F6] bg-clip-text text-transparent">
              SpaceBook
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white">Choose Your Workspace</h1>
          <p className="text-sm text-muted mt-1">Select your role to access customized dashboards and tools</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-5">
          <Link to="/auth/stallholder" className="block group">
            <div className="bg-[#1A1233] border border-[#3D2A5C] rounded-2xl p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_0_25px_rgba(183,148,246,0.25)] hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-soft border border-primary/30 flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform shadow-subtle">
                  <Store className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">
                      I'm an Exhibitor / Vendor
                    </h2>
                    <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">
                    Discover upcoming expos, browse interactive hall floor plans, compare stalls, and request instant bookings with conflict-free guarantees.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-primary">
                    <span>Enter Vendor Portal</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/auth/organizer" className="block group">
            <div className="bg-[#1A1233] border border-[#3D2A5C] rounded-2xl p-6 transition-all duration-300 hover:border-accent hover:shadow-[0_0_25px_rgba(244,114,182,0.25)] hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-accent-soft border border-accent/30 flex items-center justify-center shrink-0 text-accent group-hover:scale-110 transition-transform shadow-subtle">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-white group-hover:text-accent transition-colors">
                      I'm an Event Organizer
                    </h2>
                    <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">
                    Configure hall layouts, set booth pricing and amenities, approve or reject applications, and monitor real-time event analytics.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-accent">
                    <span>Enter Organizer Operations</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-[11px] text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-green" />
            <span>Protected by Concurrency Locking & Secure JWT Auth</span>
          </div>
          <div>
            <Link to="/" className="text-xs text-muted hover:text-white transition-colors">
              Return to SpaceBook Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
