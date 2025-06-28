// Nexus AI - React App with Firebase Authentication
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import LandingPage from './components/LandingPage'
import FloatingShapes from './components/FloatingShapes'
import ChatCustomizer from './components/ChatCustomizer.tsx'
import AIToolsHub from './components/AIToolsHub.tsx'
import './App.css'

// Main Nexus App Component (Protected)
function NexusApp() {
  const [showLanding, setShowLanding] = useState(true)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [showAITools, setShowAITools] = useState(false)
  const { currentUser, logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  if (showLanding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white relative overflow-hidden">
        <LandingPage onEnterApp={() => setShowLanding(false)} />
      </div>
    )
  }

  // Your main Nexus AI app goes here
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white relative overflow-hidden flex items-center justify-center">
      <FloatingShapes />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-12 transform transition-all duration-500 hover:scale-105">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🎉 Welcome to Nexus AI!
          </h1>
          
          <p className="text-gray-300 text-xl mb-8 leading-relaxed">
            Your AI-powered workspace is ready! Access your chatbot, tools, and intelligent features.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <button 
              onClick={() => setShowCustomizer(true)}
              className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-xl hover:from-blue-500/30 hover:to-purple-600/30 transition-all duration-300 hover:scale-105 text-left"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">AI Chatbot</h3>
              </div>
              <p className="text-gray-300 text-sm">Start a conversation with your intelligent AI assistant</p>
            </button>

            <button 
              onClick={() => setShowAITools(true)}
              className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-xl hover:from-purple-500/30 hover:to-pink-600/30 transition-all duration-300 hover:scale-105 text-left"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">AI Tools</h3>
              </div>
              <p className="text-gray-300 text-sm">Access powerful AI tools including calendar, phone calls, and more</p>
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              🎮 Welcome back, <span className="text-blue-400 font-medium">{currentUser?.email?.split('@')[0]}</span>
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Chat Customizer Modal */}
      {showCustomizer && <ChatCustomizer onClose={() => setShowCustomizer(false)} />}

      {/* AI Tools Hub Modal */}
      {showAITools && <AIToolsHub onClose={() => setShowAITools(false)} />}
    </div>
  )
}

// Public Homepage for non-authenticated users
function PublicHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white relative overflow-hidden flex items-center justify-center">
      <FloatingShapes />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-12 transform transition-all duration-500 hover:scale-105">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome to Nexus AI
          </h1>
          
          <p className="text-gray-300 text-xl mb-8 leading-relaxed">
            Experience the future of AI interaction with beautiful design and powerful authentication.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Sign In
            </a>
            
            <a
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg backdrop-blur-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Create Account
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              Powered by <span className="text-purple-400 font-semibold">Firebase Auth</span> • 
              Built with <span className="text-blue-400 font-semibold">React + Vite</span> • 
              Styled with <span className="text-teal-400 font-semibold">Tailwind CSS</span>
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">🔐 Secure</h3>
            <p className="text-gray-400 text-sm">Advanced Firebase authentication with session management</p>
          </div>

          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">🎨 Beautiful</h3>
            <p className="text-gray-400 text-sm">Glass-morphism design with smooth animations</p>
          </div>

          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">⚡ Fast</h3>
            <p className="text-gray-400 text-sm">Lightning-fast performance with modern tech stack</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component to show landing page or handle routing
function AppContent() {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  // Show loading if auth is still initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex items-center justify-center">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-center">Loading Nexus AI...</p>
        </div>
      </div>
    )
  }

  // If user is on auth routes, show auth pages
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname)
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          currentUser ? (
            <PrivateRoute>
              <NexusApp />
            </PrivateRoute>
          ) : (
            <PublicHomepage />
          )
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App
