import React, { useState } from 'react'
import PhoneCallTool from './PhoneCallTool'
import CalendarTool from './CalendarTool'
import WeatherTool from './WeatherTool'

interface AIToolsHubProps {
  onClose: () => void
}

export default function AIToolsHub({ onClose }: AIToolsHubProps) {
  const [activeTool, setActiveTool] = useState<'hub' | 'phone' | 'calendar' | 'weather-ai'>('hub')

  const tools = [
    {
      id: 'calendar',
      title: 'AI Calendar',
      description: 'Smart scheduling with natural language AI assistance',
      icon: '📅',
      color: 'from-blue-500 to-purple-600',
      hoverColor: 'from-blue-600 to-purple-700'
    },
    {
      id: 'phone',
      title: 'Phone Calls',
      description: 'Make calls to any phone number using Twilio service',
      icon: '📞',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'from-green-600 to-emerald-700'
    },
    {
      id: 'voice-ai',
      title: 'Voice AI Assistant',
      description: 'Voice-powered AI conversations and commands',
      icon: '🎙️',
      color: 'from-purple-500 to-pink-600',
      hoverColor: 'from-purple-600 to-pink-700',
      comingSoon: true
    },
    {
      id: 'weather-ai',
      title: 'Weather AI',
      description: 'AI-powered weather forecasts and intelligent recommendations',
      icon: '🌦️',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'from-orange-600 to-red-700'
    },
    {
      id: 'image-ai',
      title: 'Image AI',
      description: 'AI image generation and analysis tools',
      icon: '🎨',
      color: 'from-teal-500 to-cyan-600',
      hoverColor: 'from-teal-600 to-cyan-700',
      comingSoon: true
    },
    {
      id: 'code-ai',
      title: 'Code Assistant',
      description: 'AI-powered code review and generation',
      icon: '💻',
      color: 'from-indigo-500 to-blue-600',
      hoverColor: 'from-indigo-600 to-blue-700',
      comingSoon: true
    }
  ]

  const handleToolClick = (toolId: string) => {
    if (toolId === 'phone') {
      setActiveTool('phone')
    } else if (toolId === 'calendar') {
      setActiveTool('calendar')
    } else if (toolId === 'weather-ai') {
      setActiveTool('weather-ai')
    }
  }

  // If a specific tool is active, render that tool
  if (activeTool === 'phone') {
    return <PhoneCallTool onClose={() => setActiveTool('hub')} />
  }

  if (activeTool === 'calendar') {
    return <CalendarTool onClose={() => setActiveTool('hub')} />
  }

  if (activeTool === 'weather-ai') {
    return <WeatherTool onClose={() => setActiveTool('hub')} />
  }

  // Main hub interface
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Tools Hub</h1>
              <p className="text-gray-400">Powerful AI-powered productivity tools at your fingertips</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tools Grid */}
        <div className="p-6 overflow-y-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => !tool.comingSoon && handleToolClick(tool.id)}
                className={`
                  relative p-6 rounded-xl border border-white/10 transition-all duration-300 
                  ${tool.comingSoon 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'cursor-pointer hover:scale-105 hover:border-white/20'
                  }
                  bg-gradient-to-br ${tool.color}/10 hover:${tool.hoverColor}/20
                `}
              >
                {tool.comingSoon && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                    <span className="text-orange-400 text-xs font-semibold">Coming Soon</span>
                  </div>
                )}
                
                <div className="flex items-center mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                    <span className="text-2xl">{tool.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{tool.title}</h3>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed">{tool.description}</p>
                
                {!tool.comingSoon && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Ready to use</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>



          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => handleToolClick('calendar')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
            >
              📅 Open Calendar
            </button>
            <button
              onClick={() => handleToolClick('phone')}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:scale-105"
            >
              📞 Make a Call
            </button>
            <button
              disabled
              className="px-4 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
            >
              🎙️ Voice AI (Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 