import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface UserProfile {
  theme: 'light' | 'dark'
  accentColor: string
  personality: string
  avatar: string
  name: string
}

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface ChatCustomizerProps {
  onClose: () => void
}

export default function ChatCustomizer({ onClose }: ChatCustomizerProps) {
  const { currentUser } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // User Profile Model with default values
  const [userProfile, setUserProfile] = useState<UserProfile>({
    theme: 'dark',
    accentColor: 'purple',
    personality: 'friendly',
    avatar: '🤖',
    name: currentUser?.email?.split('@')[0] || 'User'
  })

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const GEMINI_API_KEY = 'AIzaSyBISM_5jm5D9LKHZalWQzOimEx81iGjHGI'

  const colors = [
    { name: 'purple', value: '#8b5cf6' },
    { name: 'pink', value: '#ec4899' },
    { name: 'red', value: '#ef4444' },
    { name: 'orange', value: '#f97316' },
    { name: 'yellow', value: '#eab308' },
    { name: 'green', value: '#22c55e' },
    { name: 'blue', value: '#3b82f6' },
    { name: 'indigo', value: '#6366f1' }
  ]

  const personalities = [
    { value: 'friendly', emoji: '😊', label: 'Friendly', desc: 'Warm and encouraging' },
    { value: 'curious', emoji: '🤔', label: 'Curious', desc: 'Asks thoughtful questions' },
    { value: 'supportive', emoji: '💪', label: 'Supportive', desc: 'Motivational and uplifting' },
    { value: 'professional', emoji: '💼', label: 'Professional', desc: 'Formal and focused' },
    { value: 'creative', emoji: '🎨', label: 'Creative', desc: 'Imaginative and artistic' }
  ]

  const avatars = ['🤖', '👨‍💻', '👩‍💻', '🦾', '🧠', '⚡', '🌟', '💎']

  // Generate personality-based system prompt
  const getPersonalityPrompt = (personality: string) => {
    const prompts = {
      friendly: "You are a friendly, warm, and encouraging AI assistant. Use casual language, include emojis, and be enthusiastic in your responses. Make the user feel comfortable and welcomed.",
      curious: "You are a curious and inquisitive AI assistant. Ask thoughtful follow-up questions, show genuine interest in the user's thoughts, and encourage exploration of ideas.",
      supportive: "You are a motivational and uplifting AI assistant. Provide encouragement, celebrate achievements, and help boost the user's confidence. Be positive and empowering.",
      professional: "You are a professional and formal AI assistant. Use proper language, be concise and focused, and maintain a business-like tone while being helpful.",
      creative: "You are an imaginative and artistic AI assistant. Think outside the box, suggest creative solutions, and inspire innovative thinking. Be playful with language and ideas."
    }
    return prompts[personality as keyof typeof prompts] || prompts.friendly
  }

  // Format markdown text by removing ** formatting and replacing with proper formatting
  const formatMarkdown = (text: string) => {
    return text
      // Remove ** bold formatting and replace with plain text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Remove * italic formatting  
      .replace(/\*(.*?)\*/g, '$1')
      // Clean up any remaining markdown artifacts
      .replace(/###\s*/g, '')
      .replace(/##\s*/g, '')
      .replace(/#\s*/g, '')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Call Gemini API
  const callGeminiAPI = async (message: string) => {
    try {
      const personalityPrompt = getPersonalityPrompt(userProfile.personality)
      
      console.log('Calling Gemini API with message:', message)
      console.log('API Key (first 10 chars):', GEMINI_API_KEY.substring(0, 10) + '...')
      
      const requestBody = {
        contents: [{
          parts: [{
            text: `${personalityPrompt}\n\nUser: ${message}\n\nPlease respond in a conversational way without using markdown formatting like ** or *. Use plain text with emojis when appropriate.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }

      console.log('Request body:', JSON.stringify(requestBody, null, 2))
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      )

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const rawResponse = data.candidates[0].content.parts[0].text
        return formatMarkdown(rawResponse)
      } else if (data.error) {
        throw new Error(`API Error: ${data.error.message}`)
      } else {
        throw new Error('No valid response from AI')
      }
    } catch (error: any) {
      console.error('Gemini API Error:', error)
      
      // Return a fallback response instead of throwing
      const fallbackResponses = {
        friendly: "Sorry, I'm having trouble connecting right now! 😅 But I'm here and ready to chat once my connection is back!",
        curious: "Hmm, I'm experiencing some technical difficulties. 🤔 What would you like to talk about while I get back online?",
        supportive: "Don't worry, I'm still here for you! 💪 I'm just having a small technical hiccup. How can I support you today?",
        professional: "I apologize for the technical difficulty. Please try again in a moment.",
        creative: "Oh no! My creative circuits are having a moment! 🎨 Let me try to reconnect and we can brainstorm together!"
      }
      
      return fallbackResponses[userProfile.personality as keyof typeof fallbackResponses] || fallbackResponses.friendly
    }
  }

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setError('')

    try {
      const aiResponse = await callGeminiAPI(userMessage.content)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error: any) {
      setError(error.message)
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: getWelcomeMessage(userProfile.personality),
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [userProfile.personality])

  // Get personality-based welcome message
  const getWelcomeMessage = (personality: string) => {
    const welcomes = {
      friendly: "Hey there! I'm excited to chat with you! 😊 How can I help you today?",
      curious: "Hello! I'm curious to learn more about you. What's on your mind? 🤔",
      supportive: "Hi there! You've got this! I'm here to support you every step of the way! 💪 What can I help you with?",
      professional: "Good day. I'm ready to assist you with your inquiries. How may I help you today?",
      creative: "Hello! Let's spark some creativity together! What amazing ideas can we explore today? 🎨"
    }
    return welcomes[personality as keyof typeof welcomes] || welcomes.friendly
  }

  // Update welcome message when personality changes
  useEffect(() => {
    if (messages.length > 0 && messages[0].id === 'welcome') {
      const updatedMessages = [...messages]
      updatedMessages[0] = {
        ...updatedMessages[0],
        content: getWelcomeMessage(userProfile.personality)
      }
      setMessages(updatedMessages)
    }
  }, [userProfile.personality])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nexus-user-profile')
    if (saved) {
      try {
        const profile = JSON.parse(saved)
        setUserProfile(profile)
      } catch (error) {
        console.error('Failed to load user profile:', error)
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('nexus-user-profile', JSON.stringify(userProfile))
  }, [userProfile])

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }))
  }

  const selectedColor = colors.find(c => c.name === userProfile.accentColor)
  const selectedPersonality = personalities.find(p => p.value === userProfile.personality)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`flex h-[90vh] w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden ${
        userProfile.theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-white text-gray-900'
      }`}>
        
        {/* Sidebar */}
        <aside className={`w-80 p-6 overflow-y-auto ${
          userProfile.theme === 'dark' 
            ? 'bg-gray-800 border-r border-gray-700' 
            : 'bg-gray-50 border-r border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Customize Your Bot</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Profile Card */}
          <div className={`p-4 rounded-xl mb-6 ${
            userProfile.theme === 'dark' ? 'bg-gray-700' : 'bg-white shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: selectedColor?.value + '20' }}
              >
                {userProfile.avatar}
              </div>
              <div>
                <h3 className="font-semibold">{userProfile.name}</h3>
                <p className="text-sm text-gray-400">{selectedPersonality?.label} Mode</p>
              </div>
            </div>
            <div className="flex gap-2">
              {avatars.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => updateProfile({ avatar: emoji })}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    userProfile.avatar === emoji ? 'bg-purple-500 scale-110' : 'hover:bg-gray-600'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="mb-6">
            <p className="font-semibold mb-3">Theme</p>
            <div className="flex gap-2">
              <button
                onClick={() => updateProfile({ theme: 'light' })}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  userProfile.theme === 'light' ? 'bg-yellow-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                🌞 Light
              </button>
              <button
                onClick={() => updateProfile({ theme: 'dark' })}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  userProfile.theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-100'
                }`}
              >
                🌙 Dark
              </button>
            </div>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <p className="font-semibold mb-3">Accent Color</p>
            <div className="grid grid-cols-4 gap-3">
              {colors.map(color => (
                <button
                  key={color.name}
                  onClick={() => updateProfile({ accentColor: color.name })}
                  className={`w-12 h-12 rounded-xl border-4 transition-all hover:scale-110 ${
                    userProfile.accentColor === color.name ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          {/* Personality Selector */}
          <div className="mb-6">
            <p className="font-semibold mb-3">AI Personality</p>
            <div className="space-y-2">
              {personalities.map(personality => (
                <button
                  key={personality.value}
                  onClick={() => updateProfile({ personality: personality.value })}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    userProfile.personality === personality.value ? 'bg-gray-600 border-l-4' : 'hover:bg-gray-700'
                  }`}
                  style={{
                    borderLeftColor: userProfile.personality === personality.value ? selectedColor?.value : 'transparent'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{personality.emoji}</span>
                    <div>
                      <div className="font-medium">{personality.label}</div>
                      <div className="text-sm text-gray-400">{personality.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Chat Interface */}
        <main className="flex-1 p-6 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h1 className="text-2xl font-bold">AI Chat</h1>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedColor?.value }}
              />
              <span className="text-sm font-medium">{selectedPersonality?.label} Mode</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex-shrink-0">
              {error}
            </div>
          )}

          {/* Chat Messages */}
          <div className={`flex-1 rounded-xl p-4 overflow-y-auto ${
            userProfile.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
          }`} style={{ minHeight: '300px', maxHeight: 'calc(100vh - 300px)' }}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.sender === 'ai' ? (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: selectedColor?.value + '20' }}
                      >
                        {userProfile.avatar}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {userProfile.name[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className={`flex flex-col max-w-sm lg:max-w-md ${
                    message.sender === 'user' ? 'items-end' : 'items-start'
                  }`}>
                    <div className={`px-4 py-3 rounded-lg ${
                      message.sender === 'ai' 
                        ? userProfile.theme === 'dark' 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        : 'text-white'
                    }`}
                    style={message.sender === 'user' ? { backgroundColor: selectedColor?.value } : {}}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 flex-row">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: selectedColor?.value + '20' }}
                    >
                      {userProfile.avatar}
                    </div>
                  </div>
                  
                  {/* Loading Content */}
                  <div className="flex flex-col items-start">
                    <div className={`px-4 py-3 rounded-lg ${
                      userProfile.theme === 'dark' 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="mt-4 flex-shrink-0">
            <div className={`flex gap-3 p-4 rounded-lg ${
              userProfile.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className={`flex-1 px-4 py-3 rounded-lg border-0 outline-none resize-none ${
                  userProfile.theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'
                } disabled:opacity-50 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: selectedColor?.value }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  'Send'
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </main>
      </div>
    </div>
  )
} 