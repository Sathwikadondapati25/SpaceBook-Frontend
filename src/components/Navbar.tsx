import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, LogIn, Sparkles, LogOut, ArrowRight, Menu, X } from 'lucide-react'
import Button from './Button'
import { useAuth } from '../context/AuthContext'
import StallIcon from './StallIcon'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0A1E]/90 backdrop-blur-xl border-b border-[#3D2A5C]/70">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] via-[#B794F6] to-[#F472B6] p-0.5 shadow-[0_0_20px_rgba(183,148,246,0.35)] group-hover:shadow-[0_0_25px_rgba(244,114,182,0.5)] transition-all duration-300">
            <div className="w-full h-full bg-[#1A1233] rounded-[10px] flex items-center justify-center">
              <StallIcon className="w-5 h-5 text-[#B794F6] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display font-extrabold tracking-tight bg-gradient-to-r from-white via-[#E2D9F3] to-[#B794F6] bg-clip-text text-transparent">
                SpaceBook
              </span>
            </div>
            <p className="text-[11px] text-[#A89BC0] -mt-0.5 font-medium tracking-wide">Conflict-Free Indian Expos</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/vendor/events"
            className="text-sm font-medium text-[#A89BC0] hover:text-white transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#B794F6]" />
            Discover Expos
          </Link>
          <a
            href="/#how-it-works"
            className="text-sm font-medium text-[#A89BC0] hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="/#features"
            className="text-sm font-medium text-[#A89BC0] hover:text-white transition-colors"
          >
            Features
          </a>
          <Link
            to="/organizer/dashboard"
            className="text-sm font-medium text-[#A89BC0] hover:text-[#F472B6] transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
            Organizer Portal
          </Link>
        </div>

        {/* Auth CTA or User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={user.role === 'ORGANIZER' ? '/organizer/dashboard' : '/vendor/dashboard'}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface border border-border hover:border-primary transition-all text-sm font-medium text-white shadow-subtle"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#F472B6] flex items-center justify-center text-xs font-bold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="font-semibold">{user.name || (user.role === 'ORGANIZER' ? 'Organizer' : 'Exhibitor')}</span>
                <span className="text-[10px] text-primary bg-primary-soft px-1.5 py-0.5 rounded uppercase font-bold">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl bg-surface hover:bg-surface-2 border border-border hover:border-red/40 text-muted hover:text-red transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm font-medium text-[#A89BC0] hover:text-white transition-colors flex items-center gap-1.5 px-3 py-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link to="/auth">
                <Button variant="primary" size="small" className="gap-2">
                  <span>Register Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-surface border border-border text-muted hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1233] border-b border-border px-6 py-6 space-y-4">
          <Link
            to="/vendor/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-white hover:text-primary py-2"
          >
            Discover Expos
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-muted hover:text-white py-2"
          >
            How It Works
          </a>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-muted hover:text-white py-2"
          >
            Features
          </a>
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  to={user.role === 'ORGANIZER' ? '/organizer/dashboard' : '/vendor/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-2 text-white"
                >
                  <span className="font-medium">{user.name || user.email}</span>
                  <span className="text-xs bg-primary-soft text-primary px-2 py-0.5 rounded">{user.role}</span>
                </Link>
                <Button variant="ghost" size="small" onClick={handleLogout} className="w-full text-red">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="medium" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="medium" className="w-full">
                    Register Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
