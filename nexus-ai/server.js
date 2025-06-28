import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import twilio from 'twilio'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
app.use(express.json())

// Store user sessions and AI personalities
const userSessions = new Map()
const aiPersonalities = {
  friendly: {
    responses: [
      "That's wonderful! I'm so happy to hear that!",
      "I love chatting with you about this!",
      "You always have such interesting thoughts!",
      "Thanks for sharing that with me!",
      "I'm here to help you with whatever you need!",
      "That sounds really exciting!",
      "I appreciate you taking the time to talk with me!"
    ]
  },
  curious: {
    responses: [
      "That's fascinating! Can you tell me more?",
      "I'm really curious about your perspective on this.",
      "What made you think about that?",
      "Have you noticed any patterns in that?",
      "I wonder what would happen if...",
      "That raises an interesting question...",
      "I'd love to explore this idea further with you!"
    ]
  },
  supportive: {
    responses: [
      "You're doing great! Keep it up!",
      "I believe in you and your abilities!",
      "That's a smart approach to the problem.",
      "You've got this! I'm here if you need help.",
      "I'm proud of how you're handling this.",
      "Remember, every step forward is progress!",
      "You're stronger than you know!"
    ]
  }
}

// AI Response Generator
function generatePersonalizedResponse(message, personality = 'friendly', userContext = {}) {
  const responses = aiPersonalities[personality]?.responses || aiPersonalities.friendly.responses
  
  // Simple keyword-based personalization
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('sad') || lowerMessage.includes('down')) {
    return "I'm sorry you're feeling that way. Remember that it's okay to have tough days. Is there anything specific I can help you with?"
  }
  
  if (lowerMessage.includes('happy') || lowerMessage.includes('excited')) {
    return "That's amazing! I love seeing you happy! What's making you feel so great today?"
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
    return "I'm here to help! Let's work through this together. Can you tell me more about what you're trying to accomplish?"
  }
  
  if (lowerMessage.includes('create') || lowerMessage.includes('build')) {
    return "I love creative projects! What are you working on? I'd be happy to brainstorm ideas with you!"
  }
  
  // Default to personality-based response
  return responses[Math.floor(Math.random() * responses.length)]
}

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  // Initialize user session
  userSessions.set(socket.id, {
    personality: 'friendly',
    chatHistory: [],
    level: 1,
    xp: 0
  })

  socket.on('chat_message', async (data) => {
    const { message, personality } = data
    const userSession = userSessions.get(socket.id)
    
    // Add user message to history
    userSession.chatHistory.push({ role: 'user', content: message, timestamp: new Date() })
    
    // Generate AI response
    const aiResponse = generatePersonalizedResponse(message, personality || userSession.personality, userSession)
    
    // Add AI response to history
    userSession.chatHistory.push({ role: 'ai', content: aiResponse, timestamp: new Date() })
    
    // Update XP
    userSession.xp += 10
    if (userSession.xp >= 100) {
      userSession.level += 1
      userSession.xp = 0
      
      // Send level up notification
      socket.emit('level_up', {
        newLevel: userSession.level,
        message: `🎉 Congratulations! You've reached level ${userSession.level}!`
      })
    }
    
    // Send AI response back to client
    socket.emit('ai_response', {
      message: aiResponse,
      timestamp: new Date(),
      userLevel: userSession.level,
      userXp: userSession.xp
    })
  })

  socket.on('update_personality', (personality) => {
    const userSession = userSessions.get(socket.id)
    if (userSession) {
      userSession.personality = personality
      socket.emit('personality_updated', { personality })
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    userSessions.delete(socket.id)
  })
})

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NEXUS AI Server is running!' })
})

app.post('/api/chat', async (req, res) => {
  try {
    const { message, personality = 'friendly' } = req.body
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }
    
    const response = generatePersonalizedResponse(message, personality)
    
    res.json({
      success: true,
      response,
      timestamp: new Date(),
      personality
    })
  } catch (error) {
    console.error('Chat API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/personalities', (req, res) => {
  res.json({
    personalities: Object.keys(aiPersonalities),
    current: 'friendly'
  })
})

// Twilio Phone Call API
app.post('/api/start-call', async (req, res) => {
  // Set proper headers to ensure JSON response
  res.setHeader('Content-Type', 'application/json')
  
  try {
    console.log('📞 Received call request:', req.body)
    
    const { phoneNumber } = req.body
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false,
        error: 'Phone number is required' 
      })
    }
    
    // Validate Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
    
    console.log('🔑 Twilio credentials check:', { 
      accountSid: !!accountSid, 
      authToken: !!authToken, 
      twilioPhoneNumber: !!twilioPhoneNumber 
    })
    
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error('❌ Missing Twilio credentials')
      return res.status(500).json({ 
        success: false,
        error: 'Twilio configuration is missing. Please check environment variables.' 
      })
    }
    
    // Initialize Twilio client
    const client = twilio(accountSid, authToken)
    
    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid phone number format. Please use E.164 format (e.g., +1234567890)' 
      })
    }
    
    console.log(`📞 Initiating call from ${twilioPhoneNumber} to ${phoneNumber}`)
    
    // Create TwiML for the call - using a simple message instead of hold music
    const twimlUrl = `http://twimlets.com/message?Message%5B0%5D=Hello%20from%20Nexus%20AI!%20This%20is%20a%20test%20call.%20Thank%20you%20for%20using%20our%20service.`
    
    // Make the call
    const call = await client.calls.create({
      url: twimlUrl, // Custom TwiML message
      to: phoneNumber,
      from: twilioPhoneNumber,
      timeout: 30, // Ring for 30 seconds
      record: false // Don't record the call
    })
    
    console.log(`✅ Call initiated successfully. Call SID: ${call.sid}`)
    
    return res.status(200).json({
      success: true,
      callSid: call.sid,
      status: call.status,
      to: phoneNumber,
      from: twilioPhoneNumber,
      message: 'Call initiated successfully'
    })
    
  } catch (error) {
    console.error('❌ Twilio call error:', error)
    
    // Handle specific Twilio errors
    if (error.code === 21211) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid phone number. Please check the number and try again.',
        code: error.code
      })
    } else if (error.code === 21212) {
      return res.status(400).json({ 
        success: false,
        error: 'The phone number is invalid or cannot receive calls.',
        code: error.code
      })
    } else if (error.code === 21219) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid Twilio phone number in configuration.',
        code: error.code
      })
    } else if (error.code === 20003) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication failed. Please check Twilio credentials.',
        code: error.code
      })
    } else if (error.code === 21608) {
      return res.status(400).json({ 
        success: false,
        error: 'The phone number is not verified. In trial mode, you can only call verified numbers.',
        code: error.code
      })
    }
    
    // Generic error handling
    return res.status(500).json({ 
      success: false,
      error: 'Failed to initiate call. Please try again.',
      details: error.message || 'Unknown error occurred'
    })
  }
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 NEXUS AI Server running on port ${PORT}`)
  console.log(`💬 Chat available at http://localhost:${PORT}`)
  console.log(`🎮 Frontend at http://localhost:5173`)
}) 