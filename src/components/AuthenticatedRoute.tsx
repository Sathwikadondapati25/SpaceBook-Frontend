import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface AuthenticatedRouteProps {
  children: ReactNode
}

/**
 * Route wrapper that allows access to public pages (like homepage) only for unauthenticated users.
 * If a user is authenticated, redirect them to their appropriate dashboard.
 * This prevents logged-in users from accessing the homepage via browser Back button.
 */
export default function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
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
