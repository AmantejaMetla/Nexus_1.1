// AI Personalities
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
  },
  professional: {
    responses: [
      "Thank you for your input. Let me analyze this systematically.",
      "Based on the information provided, I recommend the following approach.",
      "I understand your requirements. Here's my professional assessment.",
      "Let's approach this methodically to ensure optimal results.",
      "I'll provide you with a comprehensive solution.",
      "Your request has been processed. Here's the detailed response.",
      "I'm committed to delivering high-quality assistance."
    ]
  },
  creative: {
    responses: [
      "What an imaginative idea! Let's explore this creatively!",
      "I love thinking outside the box with you!",
      "That sparks so many creative possibilities!",
      "Let's brainstorm some innovative solutions!",
      "Your creativity is inspiring! What if we tried...",
      "I'm getting excited about all the creative directions we could take!",
      "Art and creativity make everything more beautiful!"
    ]
  }
};

// AI Response Generator
function generatePersonalizedResponse(message, personality = 'friendly') {
  const responses = aiPersonalities[personality]?.responses || aiPersonalities.friendly.responses;
  
  // Simple keyword-based personalization
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('sad') || lowerMessage.includes('down')) {
    return "I'm sorry you're feeling that way. Remember that it's okay to have tough days. Is there anything specific I can help you with?";
  }
  
  if (lowerMessage.includes('happy') || lowerMessage.includes('excited')) {
    return "That's amazing! I love seeing you happy! What's making you feel so great today?";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
    return "I'm here to help! Let's work through this together. Can you tell me more about what you're trying to accomplish?";
  }
  
  if (lowerMessage.includes('create') || lowerMessage.includes('build')) {
    return "I love creative projects! What are you working on? I'd be happy to brainstorm ideas with you!";
  }
  
  // Default to personality-based response
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { message, personality = 'friendly' } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const response = generatePersonalizedResponse(message, personality);
      
      res.status(200).json({
        success: true,
        response,
        timestamp: new Date().toISOString(),
        personality
      });
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 