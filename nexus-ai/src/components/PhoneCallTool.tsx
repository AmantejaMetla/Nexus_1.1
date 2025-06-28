import React, { useState, useEffect } from 'react'

interface PhoneCallToolProps {
  onClose: () => void
}

export default function PhoneCallTool({ onClose }: PhoneCallToolProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('US')
  const [isLoading, setIsLoading] = useState(false)
  const [callStatus, setCallStatus] = useState('')
  const [error, setError] = useState('')

  const handleCancelCall = () => {
    setIsLoading(false)
    setCallStatus('')
    setError('')
    onClose()
  }

  // Country codes and formatting rules
  const countries = [
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', maxLength: 10, format: '(XXX) XXX-XXXX' },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', maxLength: 10, format: '(XXX) XXX-XXXX' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', maxLength: 11, format: 'XXXX XXX XXXX' },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', maxLength: 9, format: 'XXX XXX XXX' },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', maxLength: 11, format: 'XXX XXXX XXXX' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', maxLength: 10, format: 'XX XX XX XX XX' },
    { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', maxLength: 10, format: 'XXXXX XXXXX' },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', maxLength: 11, format: 'XXX XXXX XXXX' },
    { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', maxLength: 11, format: 'XXX XXXX XXXX' },
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', maxLength: 11, format: '(XX) XXXXX-XXXX' },
    { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', maxLength: 10, format: 'XXX XXX XXXX' },
    { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', maxLength: 9, format: 'XXX XXX XXX' },
    { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', maxLength: 10, format: 'XXX XXX XXXX' },
    { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺', maxLength: 10, format: 'XXX XXX XXXX' },
    { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', maxLength: 11, format: 'XXX XXXX XXXX' },
    { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', maxLength: 9, format: 'XX XXX XXXX' },
    { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', maxLength: 9, format: 'XXX XXX XXX' },
    { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', maxLength: 8, format: 'XXX XX XXX' },
    { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', maxLength: 9, format: 'XXX XXX XXXX' },
    { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', maxLength: 9, format: 'XXX XXX XXXX' }
  ]

  const getCurrentCountry = () => countries.find(c => c.code === selectedCountry) || countries[0]

  const validatePhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, '')
    const country = getCurrentCountry()
    
    // Check if the number length matches the country's requirements
    if (cleaned.length === country.maxLength) {
      return `${country.dialCode}${cleaned}`
    }
    
    return null
  }

  const formatPhoneNumber = (value: string, countryCode: string) => {
    const cleaned = value.replace(/\D/g, '')
    const country = countries.find(c => c.code === countryCode) || countries[0]
    
    // Limit input to country's max length
    const limited = cleaned.slice(0, country.maxLength)
    
    // Format based on country
    switch (countryCode) {
      case 'US':
      case 'CA':
        if (limited.length <= 3) return limited
        if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`
        return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6, 10)}`
      
      case 'GB':
        if (limited.length <= 4) return limited
        if (limited.length <= 7) return `${limited.slice(0, 4)} ${limited.slice(4)}`
        return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(7, 11)}`
      
      case 'DE':
      case 'JP':
      case 'CN':
      case 'KR':
        if (limited.length <= 3) return limited
        if (limited.length <= 7) return `${limited.slice(0, 3)} ${limited.slice(3)}`
        return `${limited.slice(0, 3)} ${limited.slice(3, 7)} ${limited.slice(7)}`
      
      case 'FR':
        if (limited.length <= 2) return limited
        if (limited.length <= 4) return `${limited.slice(0, 2)} ${limited.slice(2)}`
        if (limited.length <= 6) return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4)}`
        if (limited.length <= 8) return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6)}`
        return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`
      
      case 'IN':
        if (limited.length <= 5) return limited
        return `${limited.slice(0, 5)} ${limited.slice(5)}`
      
      case 'BR':
        if (limited.length <= 2) return limited
        if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`
      
      case 'AU':
      case 'MX':
      case 'ES':
      case 'IT':
      case 'RU':
      case 'NL':
      case 'SE':
      case 'ZA':
        if (limited.length <= 3) return limited
        if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`
        return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
      
      case 'NO':
        if (limited.length <= 3) return limited
        if (limited.length <= 5) return `${limited.slice(0, 3)} ${limited.slice(3)}`
        return `${limited.slice(0, 3)} ${limited.slice(3, 5)} ${limited.slice(5)}`
      
      case 'CH':
        if (limited.length <= 3) return limited
        if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`
        return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
      
      default:
        return limited
    }
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatPhoneNumber(value, selectedCountry)
    setPhoneNumber(formatted)
    setError('')
    setCallStatus('')
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value)
    setPhoneNumber('') // Clear phone number when country changes
    setError('')
    setCallStatus('')
  }

  const handleStartCall = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number')
      return
    }

    const validatedNumber = validatePhoneNumber(phoneNumber)
    if (!validatedNumber) {
      setError('Please enter a valid phone number')
      return
    }

    setIsLoading(true)
    setError('')
    setCallStatus('Initiating call...')

    try {
      const response = await fetch('/api/start-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: validatedNumber }),
      })

      // Check if response has content before trying to parse JSON
      const responseText = await response.text()
      let data: any = {}
      
      try {
        // Only parse as JSON if response is not empty
        if (responseText.trim()) {
          data = JSON.parse(responseText)
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response text:', responseText)
        throw new Error('Invalid JSON response from server')
      }

      if (response.ok) {
        setCallStatus(`Call initiated successfully! Call SID: ${data.callSid || 'Unknown'}`)
        setTimeout(() => {
          setCallStatus('Call in progress...')
          // Auto-close modal after call is successfully initiated and in progress
          setTimeout(() => {
            onClose()
          }, 3000) // Close 3 seconds after "Call in progress" message
        }, 2000)
      } else {
        const errorMessage = data.error || `Server error: ${response.status} ${response.statusText}`
        setError(errorMessage)
        setCallStatus('')
      }
    } catch (err) {
      console.error('Call initiation error:', err)
      
      // More specific error messages
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to server. Please check your internet connection.')
      } else if (err.message.includes('JSON')) {
        setError('Server response error. Please try again.')
      } else {
        setError('Network error. Please try again.')
      }
      setCallStatus('')
      
      // Auto-close modal after error (longer delay to let user read error)
      setTimeout(() => {
        onClose()
      }, 8000) // Close after 8 seconds for errors
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleStartCall()
    }
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [onClose, isLoading])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Call a Phone Number</h2>
              <p className="text-gray-400 text-sm">Powered by Twilio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Country Selection */}
        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
            Country
          </label>
          <div className="relative">
            <select
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm disabled:opacity-50 appearance-none cursor-pointer"
            >
              {countries.map((country) => (
                <option 
                  key={country.code} 
                  value={country.code}
                  className="bg-slate-800 text-white"
                >
                  {country.flag} {country.name} ({country.dialCode})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-400 text-sm">{getCurrentCountry().dialCode}</span>
            </div>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              onKeyPress={handleKeyPress}
              placeholder={getCurrentCountry().format.replace(/X/g, '#')}
              disabled={isLoading}
              className="w-full pl-16 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm disabled:opacity-50"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter {getCurrentCountry().maxLength} digits without the country code
          </p>
        </div>

        {/* Call Button */}
        <div className="space-y-3">
          <button
            onClick={handleStartCall}
            disabled={isLoading || !phoneNumber.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Calling...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Start Call</span>
              </>
            )}
          </button>

          {/* Cancel Button (shown during loading) */}
          {isLoading && (
            <button
              onClick={handleCancelCall}
              className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-red-500/20 border border-red-500/30 text-red-400 font-medium rounded-lg hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel Call</span>
            </button>
          )}
        </div>

        {/* Status Messages */}
        {(callStatus || error) && (
          <div className="mt-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Close"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {callStatus && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-400 text-sm">{callStatus}</p>
                  </div>
                  {callStatus.includes('Call in progress') && (
                    <button
                      onClick={onClose}
                      className="text-green-400 hover:text-green-300 transition-colors text-xs px-2 py-1 bg-green-500/20 rounded border border-green-500/30"
                      title="Close - Call is active"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs text-gray-400">
              <p className="mb-1"><strong>Note:</strong> Calls are made using Twilio service.</p>
              <p>• Only verified numbers can receive calls in Twilio trial mode</p>
              <p>• International rates may apply for non-US numbers</p>
              <p>• This modal will auto-close when call is completed or cancelled</p>
              <p>• Press ESC to close manually</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 