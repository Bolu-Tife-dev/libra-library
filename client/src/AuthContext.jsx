import { createContext, useContext, useEffect, useState } from 'react'
import * as api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => api.getCurrentUser())

  useEffect(() => {
    const onUnauthorized = () => setUser(null)
    window.addEventListener('libra:unauthorized', onUnauthorized)
    return () => window.removeEventListener('libra:unauthorized', onUnauthorized)
  }, [])

  const value = {
    user,
    login: async (credentials) => {
      const u = await api.login(credentials)
      setUser(u)
      return u
    },
    register: async (data) => {
      const u = await api.register(data)
      setUser(u)
      return u
    },
    logout: () => {
      api.logout()
      setUser(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
