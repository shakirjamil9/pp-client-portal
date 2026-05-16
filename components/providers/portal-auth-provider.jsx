"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import {
  clearStoredToken,
  getStoredToken,
  portalLogin,
  portalMe,
  setStoredToken,
} from "@/lib/portal-api"

const PortalAuthContext = createContext(null)

export function PortalAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function boot() {
      const token = getStoredToken()
      if (!token) {
        if (!cancelled) {
          setUser(null)
          setInitializing(false)
        }
        return
      }
      try {
        const data = await portalMe(token)
        if (!cancelled) setUser(data.portalUser ?? null)
      } catch {
        clearStoredToken()
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setInitializing(false)
      }
    }

    boot()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await portalLogin(credentials)
    setStoredToken(data.token)
    setUser(data.portalUser ?? null)
    return data
  }, [])

  const logout = useCallback(() => {
    clearStoredToken()
    setUser(null)
    router.push("/login")
  }, [router])

  const refreshMe = useCallback(async () => {
    const token = getStoredToken()
    if (!token) {
      setUser(null)
      return null
    }
    const data = await portalMe(token)
    setUser(data.portalUser ?? null)
    return data.portalUser
  }, [])

  const value = useMemo(
    () => ({
      user,
      initializing,
      login,
      logout,
      refreshMe,
    }),
    [user, initializing, login, logout, refreshMe]
  )

  return <PortalAuthContext.Provider value={value}>{children}</PortalAuthContext.Provider>
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext)
  if (!ctx) {
    throw new Error("usePortalAuth must be used within PortalAuthProvider")
  }
  return ctx
}
