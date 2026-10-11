import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'VENDOR' | 'ORGANIZER'
  allowIncompleteProfile?: boolean
}

export default function ProtectedRoute({
  children,
  requiredRole,
  allowIncompleteProfile = false
}: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  // 1. Strict Authentication: Must be logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // 2. Strict Onboarding: Every user must create/complete their profile after signup
  if (!allowIncompleteProfile && user.isProfileComplete === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  // 3. Strict Role-Based Authorization & Privacy Separation
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'ORGANIZER') {
      return <Navigate to="/organizer/dashboard" replace />
    } else {
      return <Navigate to="/vendor/dashboard" replace />
    }
  }

  return <>{children}</>
}
