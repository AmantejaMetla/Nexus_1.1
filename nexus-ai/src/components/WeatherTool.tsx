import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface WeatherToolProps {
  onClose: () => void
}

interface WeatherData {
  location: {
    name: string
    region: string
    country: string
  }
  current: {
    temp_c: number
    temp_f: number
    condition: {
      text: string
      icon: string
    }
    wind_mph: number
    wind_kph: number
    humidity: number
    feelslike_c: number
    feelslike_f: number
    uv: number
  }
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        maxtemp_f: number
        mintemp_c: number
        mintemp_f: number
        condition: {
          text: string
          icon: string
        }
        daily_chance_of_rain: number
      }
      hour: Array<{
        time: string
        temp_c: number
        temp_f: number
        condition: {
          text: string
          icon: string
        }
        chance_of_rain: number
      }>
    }>
  }
}

const API_KEY = 'a69c401787644a5086d162322252706'

export default function WeatherTool({ onClose }: WeatherToolProps) {
  const { currentUser } = useAuth()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [currentCity, setCurrentCity] = useState('')
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C')
  const [activeTab, setActiveTab] = useState('weather')
  const [savedCities, setSavedCities] = useState<string[]>(['Gwalior', 'Mumbai', 'Delhi', 'Bangalore'])
  const [showLocationPermission, setShowLocationPermission] = useState(false)
  const [aiInsight, setAiInsight] = useState('')

  // Transform WeatherAPI.com data to our interface
  const transformWeatherData = (data: any): WeatherData => {
    const transformedData: WeatherData = {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country
      },
      current: {
        temp_c: Math.round(data.current.temp_c),
        temp_f: Math.round(data.current.temp_f),
        condition: {
          text: data.current.condition.text,
          icon: data.current.condition.icon
        },
        wind_mph: Math.round(data.current.wind_mph),
        wind_kph: Math.round(data.current.wind_kph),
        humidity: data.current.humidity,
        feelslike_c: Math.round(data.current.feelslike_c),
        feelslike_f: Math.round(data.current.feelslike_f),
        uv: data.current.uv
      },
      forecast: {
        forecastday: data.forecast?.forecastday?.map((day: any) => ({
          date: day.date,
          day: {
            maxtemp_c: Math.round(day.day.maxtemp_c),
            maxtemp_f: Math.round(day.day.maxtemp_f),
            mintemp_c: Math.round(day.day.mintemp_c),
            mintemp_f: Math.round(day.day.mintemp_f),
            condition: {
              text: day.day.condition.text,
              icon: day.day.condition.icon
            },
            daily_chance_of_rain: day.day.daily_chance_of_rain || 0
          },
          hour: day.hour?.map((hour: any) => ({
            time: hour.time,
            temp_c: Math.round(hour.temp_c),
            temp_f: Math.round(hour.temp_f),
            condition: {
              text: hour.condition.text,
              icon: hour.condition.icon
            },
            chance_of_rain: hour.chance_of_rain || 0
          })) || []
        })) || []
      }
    }
    
    return transformedData
  }

  // Fetch weather data by city name
  const fetchWeather = async (city: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`
      )
      
      if (!response.ok) {
        throw new Error(`City "${city}" not found. Please check the spelling and try again.`)
      }
      
      const data = await response.json()
      const transformedData = transformWeatherData(data)
      
      setWeatherData(transformedData)
      generateAIInsight(transformedData)
      setCurrentCity(data.location.name) // Update current city with the exact name from API
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  // Generate AI insights
  const generateAIInsight = (data: WeatherData) => {
    const temp = tempUnit === 'C' ? data.current.temp_c : data.current.temp_f
    const condition = data.current.condition.text.toLowerCase()
    const chanceOfRain = data.forecast.forecastday[0]?.day.daily_chance_of_rain || 0
    
    let insight = ''
    
    if (temp < 10 && tempUnit === 'C') {
      insight = "🧥 It's quite cold today! Consider wearing warm layers and a coat."
    } else if (temp > 25 && tempUnit === 'C') {
      insight = "☀️ It's a warm day! Perfect for outdoor activities. Don't forget sunscreen."
    } else if (chanceOfRain > 70) {
      insight = "☔ High chance of rain today. Take an umbrella and maybe reschedule outdoor plans."
    } else if (condition.includes('sunny') || condition.includes('clear')) {
      insight = "🌞 Beautiful clear weather! Great day for a walk or outdoor lunch."
    } else if (condition.includes('cloud')) {
      insight = "⛅ Partly cloudy today. Comfortable weather for most activities."
    } else {
      insight = "🤖 Check the hourly forecast for the best times to step outside today!"
    }
    
    setAiInsight(insight)
  }

  // Search for city
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const cityToSearch = searchCity.trim()
    
    if (cityToSearch) {
      // Clear any previous errors
      setError('')
      fetchWeather(cityToSearch)
      setSearchCity('')
    }
  }

  // Handle temperature unit change
  const handleTempUnitChange = (unit: 'C' | 'F') => {
    setTempUnit(unit)
    if (weatherData) {
      generateAIInsight(weatherData)
    }
  }

  // Quick city selection
  const selectQuickCity = (city: string) => {
    setError('')
    fetchWeather(city)
  }

  // Get today's hourly forecast
  const getTodayHourly = () => {
    if (!weatherData?.forecast.forecastday[0]) return []
    
    return weatherData.forecast.forecastday[0].hour
      .filter(hour => {
        const hourTime = new Date(hour.time)
        return hourTime.getHours() >= 6 && hourTime.getHours() <= 21
      })
      .slice(0, 8)
  }

  // Format temperature
  const formatTemp = (tempC: number, tempF: number) => {
    return tempUnit === 'C' ? `${Math.round(tempC)}°C` : `${Math.round(tempF)}°F`
  }

  // Get weather icon URL
  const getWeatherIcon = (icon: string) => {
    // WeatherAPI.com returns full URLs for icons
    return icon.startsWith('http') ? icon : `https:${icon}`
  }

  // Validate if coordinates are reasonable for Gwalior area
  const isValidGwaliorCoordinates = (lat: number, lon: number) => {
    // Gwalior is approximately at 26.2183° N, 78.1828° E
    // Allow a reasonable radius of ~50km for GPS accuracy
    const gwaliorLat = 26.2183
    const gwaliorLon = 78.1828
    const tolerance = 0.5 // degrees (~55km)
    
    const latDiff = Math.abs(lat - gwaliorLat)
    const lonDiff = Math.abs(lon - gwaliorLon)
    
    return latDiff <= tolerance && lonDiff <= tolerance
  }

  // Get user's current location with validation
  const getCurrentLocation = () => {
    setLoading(true)
    setShowLocationPermission(true)
    setError('') // Clear any previous errors
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords
          setShowLocationPermission(false)
          
          console.log(`🌍 GPS coordinates: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`)
          
          // Validate coordinates
          const isValidForGwalior = isValidGwaliorCoordinates(latitude, longitude)
          
          if (!isValidForGwalior) {
            console.log(`⚠️ GPS coordinates seem incorrect for Gwalior. Expected ~26.2, 78.2 but got ${latitude}, ${longitude}`)
            setError(`⚠️ GPS location seems inaccurate (detected far from Gwalior). Using Gwalior weather instead.`)
            // Fallback to Gwalior
            setCurrentCity('Gwalior')
            fetchWeather('Gwalior')
            setLoading(false)
            return
          }
          
          console.log(`🔍 GPS coordinates look valid for Gwalior area. Looking up location...`)
          
          try {
            // Use the forecast endpoint with coordinates to get full weather data
            const response = await fetch(
              `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`
            )
            
            if (response.ok) {
              const data = await response.json()
              const cityName = data.location.name
              const region = data.location.region
              const country = data.location.country
              const fullLocation = `${cityName}, ${region}, ${country}`
              
              console.log(`✅ WeatherAPI detected your location as: ${fullLocation}`)
              
              // Double-check if the detected city makes sense for Gwalior area
              if (cityName.toLowerCase() !== 'gwalior' && !['madhya pradesh', 'mp'].includes(region.toLowerCase())) {
                console.log(`⚠️ Detected city "${cityName}" in "${region}" - this doesn't match expected Gwalior location`)
                setError(`⚠️ GPS detected "${fullLocation}" but you're in Gwalior. Using Gwalior weather.`)
                setCurrentCity('Gwalior')
                fetchWeather('Gwalior')
                setLoading(false)
                return
              }
              
              // Transform and set the data directly
              const transformedData = transformWeatherData(data)
              setWeatherData(transformedData)
              generateAIInsight(transformedData)
              setCurrentCity(cityName)
              
              // Show success message
              setError(`✅ Location confirmed: ${fullLocation}`)
              
              // Clear the success message after 3 seconds
              setTimeout(() => setError(''), 3000)
            } else {
              const errorText = await response.text()
              console.error('❌ WeatherAPI error:', errorText)
              setError(`GPS location lookup failed. Using Gwalior weather instead.`)
              setCurrentCity('Gwalior')
              fetchWeather('Gwalior')
            }
          } catch (err: any) {
            console.error('❌ Location fetch error:', err)
            setError(`GPS location lookup failed. Using Gwalior weather instead.`)
            setCurrentCity('Gwalior')
            fetchWeather('Gwalior')
          } finally {
            setLoading(false)
          }
        },
        (error) => {
          console.log('❌ Geolocation error:', error)
          setShowLocationPermission(false)
          setLoading(false)
          
          let errorMessage = '📍 GPS detection failed: '
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location access denied. Using Gwalior weather.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'GPS signal unavailable. Using Gwalior weather.'
              break
            case error.TIMEOUT:
              errorMessage += 'GPS timeout. Using Gwalior weather.'
              break
            default:
              errorMessage += 'GPS error. Using Gwalior weather.'
              break
          }
          setError(errorMessage)
          // Fallback to Gwalior
          setCurrentCity('Gwalior')
          fetchWeather('Gwalior')
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, // Reduced timeout to avoid long waits
          maximumAge: 300000 // 5 minutes cache to avoid repeated inaccurate readings
        }
      )
    } else {
      setShowLocationPermission(false)
      setLoading(false)
      setError('❌ GPS not supported. Using Gwalior weather.')
      setCurrentCity('Gwalior')
      fetchWeather('Gwalior')
    }
  }

  // Add city to saved cities
  const addToSavedCities = (city: string) => {
    if (!savedCities.includes(city)) {
      setSavedCities(prev => [...prev, city])
    }
  }

  // Remove city from saved cities
  const removeFromSavedCities = (city: string) => {
    setSavedCities(prev => prev.filter(c => c !== city))
  }

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`
      )
      
      if (!response.ok) {
        throw new Error('Weather data not available')
      }
      
      const data = await response.json()
      const transformedData = transformWeatherData(data)
      
      setWeatherData(transformedData)
      generateAIInsight(transformedData)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Start with Gwalior as default, user can manually get their location
    setCurrentCity('Gwalior')
    fetchWeather('Gwalior')
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-white">Loading weather data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Weather Error</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <div className="flex gap-3 mb-4">
              <button
                onClick={getCurrentLocation}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                📍 My Location
              </button>
              <button
                onClick={() => fetchWeather('Gwalior')}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Gwalior
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex">
        
        {/* Sidebar */}
        <div className="w-80 bg-white/5 border-r border-white/10 p-6 flex flex-col overflow-y-auto max-h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Weather AI</h2>
              <p className="text-gray-400 text-sm">{currentUser?.email?.split('@')[0]}</p>
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

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search for cities..."
                className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Get My Location Button */}
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="w-full mb-4 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-lg hover:from-green-500/30 hover:to-emerald-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showLocationPermission ? '🔄 Getting Your Location...' : '📍 Detect My Location'}
          </button>

          {/* Current Location Display */}
          {currentCity && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">📍 Current Location:</p>
              <p className="text-white font-semibold">{currentCity}</p>
            </div>
          )}



          {/* Navigation */}
          <div className="mb-6">
            <div className="space-y-2">
              {[
                { id: 'weather', label: 'Weather', icon: '🌤️' },
                { id: 'cities', label: 'Cities', icon: '🏙️' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-blue-500/20 border border-blue-500/30 text-white' 
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Unit Toggle */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Temperature Unit</h3>
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => handleTempUnitChange('C')}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  tempUnit === 'C' ? 'bg-blue-500 text-white' : 'text-gray-300'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => handleTempUnitChange('F')}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  tempUnit === 'F' ? 'bg-blue-500 text-white' : 'text-gray-300'
                }`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Quick City Selection */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Popular Cities</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Gwalior', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'London', 'Tokyo'].map((city) => (
                <button
                  key={city}
                  onClick={() => selectQuickCity(city)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentCity === city 
                      ? 'bg-blue-500/30 border border-blue-500/50 text-white' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          {aiInsight && (
            <div className="mt-auto p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">🤖 AI Insight</h4>
              <p className="text-gray-300 text-sm">{aiInsight}</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tab Content */}
          <div className="flex-1 p-6">
            {activeTab === 'weather' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              
              {/* Current Weather */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Conditions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-white">{weatherData?.location.name}</h1>
                      <p className="text-gray-400">{weatherData?.location.region}, {weatherData?.location.country}</p>
                    </div>
                    <img 
                      src={getWeatherIcon(weatherData?.current.condition.icon || '01d')}
                      alt={weatherData?.current.condition.text}
                      className="w-16 h-16"
                    />
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-6xl font-bold text-white">
                      {formatTemp(weatherData?.current.temp_c || 0, weatherData?.current.temp_f || 0)}
                    </div>
                    <div>
                      <p className="text-xl text-gray-300 capitalize">{weatherData?.current.condition.text}</p>
                      <p className="text-gray-400">
                        Feels like {formatTemp(weatherData?.current.feelslike_c || 0, weatherData?.current.feelslike_f || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hourly Forecast */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Today's Forecast</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {getTodayHourly().map((hour, index) => (
                      <div key={index} className="flex-shrink-0 text-center">
                        <p className="text-gray-400 text-sm mb-2">
                          {new Date(hour.time).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            hour12: true 
                          })}
                        </p>
                        <img 
                          src={getWeatherIcon(hour.condition.icon)}
                          alt={hour.condition.text}
                          className="w-10 h-10 mx-auto mb-2"
                        />
                        <p className="text-white font-semibold">
                          {formatTemp(hour.temp_c, hour.temp_f)}
                        </p>
                        <p className="text-blue-400 text-xs">
                          {Math.round(hour.chance_of_rain)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Air Conditions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Air Conditions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Real Feel</p>
                      <p className="text-white font-semibold">
                        {formatTemp(weatherData?.current.feelslike_c || 0, weatherData?.current.feelslike_f || 0)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Wind</p>
                      <p className="text-white font-semibold">
                        {tempUnit === 'C' ? `${weatherData?.current.wind_kph} km/h` : `${weatherData?.current.wind_mph} mph`}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">UV Index</p>
                      <p className="text-white font-semibold">{weatherData?.current.uv}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Humidity</p>
                      <p className="text-white font-semibold">{weatherData?.current.humidity}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7-Day Forecast */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">7-Day Forecast</h3>
                <div className="space-y-3">
                  {weatherData?.forecast.forecastday.map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getWeatherIcon(day.day.condition.icon)}
                          alt={day.day.condition.text}
                          className="w-8 h-8"
                        />
                        <div>
                          <p className="text-white font-medium">
                            {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <p className="text-gray-400 text-sm capitalize">{day.day.condition.text}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          {formatTemp(day.day.maxtemp_c, day.day.maxtemp_f)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatTemp(day.day.mintemp_c, day.day.mintemp_f)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}

            {/* Cities Tab */}
            {activeTab === 'cities' && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Saved Cities</h2>
                  <div className="space-y-3">
                    {savedCities.map((city) => (
                      <div key={city} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <button
                          onClick={() => selectQuickCity(city)}
                          className="flex-1 text-left text-white hover:text-blue-400 transition-colors"
                        >
                          {city}
                        </button>
                        <button
                          onClick={() => removeFromSavedCities(city)}
                          className="px-3 py-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  {currentCity && !savedCities.includes(currentCity) && (
                    <button
                      onClick={() => addToSavedCities(currentCity)}
                      className="mt-4 w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      + Add {currentCity} to Saved Cities
                    </button>
                  )}
                </div>
              </div>
            )}



            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Weather Settings</h2>
                  
                  {/* Temperature Unit */}
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Temperature Unit</h3>
                    <div className="flex bg-white/10 rounded-lg p-1">
                      <button
                        onClick={() => handleTempUnitChange('C')}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                          tempUnit === 'C' ? 'bg-blue-500 text-white' : 'text-gray-300'
                        }`}
                      >
                        Celsius (°C)
                      </button>
                      <button
                        onClick={() => handleTempUnitChange('F')}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                          tempUnit === 'F' ? 'bg-blue-500 text-white' : 'text-gray-300'
                        }`}
                      >
                        Fahrenheit (°F)
                      </button>
                    </div>
                  </div>

                  {/* Weather Notifications */}
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Daily weather updates</span>
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Severe weather alerts</span>
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Rain notifications</span>
                        <input type="checkbox" className="w-4 h-4" />
                      </label>
                    </div>
                  </div>

                  {/* Refresh Settings */}
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Data Refresh</h3>
                    <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                      <option value="5">Every 5 minutes</option>
                      <option value="15" selected>Every 15 minutes</option>
                      <option value="30">Every 30 minutes</option>
                      <option value="60">Every hour</option>
                    </select>
                  </div>

                  {/* About */}
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-white font-semibold mb-2">About Weather AI</h3>
                    <p className="text-gray-400 text-sm mb-2">Powered by WeatherAPI.com</p>
                    <p className="text-gray-400 text-sm">Version 1.0.0</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 