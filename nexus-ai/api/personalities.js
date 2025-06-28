const aiPersonalities = {
  friendly: {
    name: "Friendly",
    description: "Warm, welcoming, and enthusiastic",
    icon: "😊"
  },
  curious: {
    name: "Curious", 
    description: "Inquisitive and eager to learn",
    icon: "🤔"
  },
  supportive: {
    name: "Supportive",
    description: "Encouraging and motivational", 
    icon: "💪"
  },
  professional: {
    name: "Professional",
    description: "Formal, structured, and business-focused",
    icon: "👔"
  },
  creative: {
    name: "Creative",
    description: "Imaginative and artistic",
    icon: "🎨"
  }
};

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      personalities: Object.keys(aiPersonalities),
      details: aiPersonalities,
      current: 'friendly'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 