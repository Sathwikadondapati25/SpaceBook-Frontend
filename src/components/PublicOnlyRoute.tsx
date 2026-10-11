import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface PublicOnlyRouteProps {
  children: ReactNode
}

/**
 * Route wrapper that prevents authenticated users from landing back on
 * public authentication or registration pages when pressing the browser back button.
 */
export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { user } = useAuth()

  if (user) {
    if (user.isProfileComplete === false) {
      return <Navigate to="/onboarding" replace />
    }
    if (user.role === 'ORGANIZER') {
      return <Navigate to="/organizer/dashboard" replace />
    }
    return <Navigate to="/vendor/dashboard" replace />
  }

  return <>{children}</>
}
