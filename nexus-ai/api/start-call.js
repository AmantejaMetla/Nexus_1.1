export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      console.log('📞 Received call request:', req.body);
      
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ 
          success: false,
          error: 'Phone number is required' 
        });
      }
      
      // Check for Twilio credentials from environment variables
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
      
      if (!accountSid || !authToken || !twilioPhoneNumber) {
        console.log('⚠️ Twilio credentials not found - returning demo response');
        return res.status(200).json({
          success: true,
          message: 'Demo mode: Call simulation completed successfully! 📞',
          callSid: 'demo_' + Date.now(),
          status: 'demo'
        });
      }
      
      // Dynamic import for Twilio (only if credentials exist)
      const twilio = (await import('twilio')).default;
      const client = twilio(accountSid, authToken);
      
      // Make the actual call
      const call = await client.calls.create({
        url: 'http://demo.twilio.com/docs/voice.xml', // Demo TwiML
        to: phoneNumber,
        from: twilioPhoneNumber,
      });
      
      console.log('✅ Call created successfully:', call.sid);
      
      res.status(200).json({
        success: true,
        message: 'Call initiated successfully! 📞',
        callSid: call.sid,
        status: call.status
      });
      
    } catch (error) {
      console.error('❌ Call API error:', error);
      
      // Return user-friendly error messages
      let errorMessage = 'Failed to initiate call';
      
      if (error.code === 21211) {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 21608) {
        errorMessage = 'Phone number is not reachable';
      } else if (error.status === 400) {
        errorMessage = 'Invalid request - please check phone number format';
      }
      
      res.status(500).json({ 
        success: false,
        error: errorMessage,
        details: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 