import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import { authApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import {
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import StallIcon from '../components/StallIcon'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      navigate(user.role === 'ORGANIZER' ? '/organizer/dashboard' : '/vendor/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Please enter your registered account email.')
      return
    }

    try {
      setLoading(true)
      const res = await authApi.forgotPassword(email)
      setDemoOtpHint(res.otp || '824915')
      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset instructions.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      await authApi.resetPassword(email, otp, newPassword)
      setSuccess('Your password has been successfully reset! Redirecting to login...')
      setTimeout(() => {
        navigate('/auth', { replace: true })
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Invalid OTP or reset failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#7C3AED]/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#F472B6]/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
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
          <h1 className="text-2xl font-display font-bold text-white">Reset Account Password</h1>
          <p className="text-xs text-muted mt-1">
            {step === 1 ? 'Enter your registered email to receive verification code' : 'Verify OTP code and create a new secure password'}
          </p>
        </div>

        <div className="bg-[#1A1233] border border-[#3D2A5C] rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-soft border border-red/40 text-red text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-4 rounded-xl bg-green-soft border border-green text-green text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  loading={loading}
                  className="w-full gap-2"
                >
                  <span>Send Reset Code</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {demoOtpHint && (
                <div className="p-3 rounded-xl bg-surface-2 border border-primary/30 flex items-center justify-between text-xs">
                  <span className="text-muted">Simulated Demo OTP: <strong className="text-primary font-mono">{demoOtpHint}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtp(demoOtpHint)}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Auto-Fill OTP
                  </button>
                </div>
              )}

              <Input
                label="6-Digit Verification Code (OTP)"
                placeholder="824915"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                leftIcon={<KeyRound className="w-4 h-4" />}
                required
              />

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                showPasswordToggle
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                showPasswordToggle
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  loading={loading}
                  className="w-full"
                >
                  Update Password & Sign In
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center pt-5 border-t border-border/60">
            <Link to="/auth" className="text-xs text-primary font-semibold hover:underline">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
