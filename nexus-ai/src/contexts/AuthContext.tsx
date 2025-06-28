import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'

interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const signup = async (email: string, password: string) => {
    try {
      setError(null)
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    console.log('🔥 Setting up Firebase auth listener...')
    
    // Timeout fallback in case Firebase takes too long
    const timeoutId = setTimeout(() => {
      console.log('⚠️ Firebase auth timeout - continuing without auth')
      setLoading(false)
    }, 10000) // 10 second timeout

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Firebase auth state changed:', user ? '✅ User signed in' : '❌ No user')
      clearTimeout(timeoutId)
      setCurrentUser(user)
      setLoading(false)
    }, (error) => {
      console.error('🔥 Firebase auth error:', error)
      clearTimeout(timeoutId)
      setError(error.message)
      setLoading(false)
    })

    return () => {
      clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    error
  }

  // Show loading spinner while Firebase initializes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <div className="text-center backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Show error if Firebase fails to initialize
  if (error && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <div className="text-center max-w-md mx-auto backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-300 mb-2">Authentication Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded hover:bg-red-500/30 hover:text-red-300 transition-all"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 