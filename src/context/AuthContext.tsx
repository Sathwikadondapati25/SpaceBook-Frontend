import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserSession, getStoredUser, clearAuth as clearAuthStorage, setStoredUser as setStoredUserStorage } from '../lib/api'

interface AuthContextType {
  user: UserSession | null
  isAuthenticated: boolean
  logout: () => void
  setUserSession: (user: UserSession) => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => getStoredUser())

  const syncUser = () => {
    const storedUser = getStoredUser()
    setUser(storedUser)
  }

  useEffect(() => {
    // Listen to custom auth events, window storage events (cross-tab sync), and browser history navigation
    const handleAuthChange = () => {
      syncUser()
    }

    window.addEventListener('spacebook_auth_changed', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)
    window.addEventListener('popstate', handleAuthChange)

    return () => {
      window.removeEventListener('spacebook_auth_changed', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener('popstate', handleAuthChange)
    }
  }, [])

  const logout = () => {
    clearAuthStorage()
    setUser(null)
  }

  const setUserSession = (newUser: UserSession) => {
    setStoredUserStorage(newUser)
    setUser(newUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout,
        setUserSession,
        refreshUser: syncUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
