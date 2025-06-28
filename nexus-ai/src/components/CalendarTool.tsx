import React, { useState, useCallback } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { useAuth } from '../contexts/AuthContext'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  category: 'work' | 'personal' | 'birthday' | 'holiday' | 'meeting'
  color: string
  description?: string
  location?: string
  allDay?: boolean
}

interface CalendarToolProps {
  onClose: () => void
}

const eventCategories = {
  work: { color: '#3b82f6', label: 'Work' },
  personal: { color: '#10b981', label: 'Personal' },
  birthday: { color: '#f59e0b', label: 'Birthday' },
  holiday: { color: '#ef4444', label: 'Holiday' },
  meeting: { color: '#8b5cf6', label: 'Meeting' }
}

const getInitialEvents = (): CalendarEvent[] => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  
  return [
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(currentYear, currentMonth, 15, 10, 0),
      end: new Date(currentYear, currentMonth, 15, 11, 0),
      category: 'meeting',
      color: eventCategories.meeting.color,
      description: 'Weekly team sync meeting',
      location: 'Conference Room A'
    },
    {
      id: '2',
      title: 'Project Deadline',
      start: new Date(currentYear, currentMonth, 20, 9, 0),
      end: new Date(currentYear, currentMonth, 20, 17, 0),
      category: 'work',
      color: eventCategories.work.color,
      description: 'Submit final project deliverables'
    },
    {
      id: '3',
      title: 'Birthday Party',
      start: new Date(currentYear, currentMonth, 25, 18, 0),
      end: new Date(currentYear, currentMonth, 25, 22, 0),
      category: 'birthday',
      color: eventCategories.birthday.color,
      description: 'Celebrate with friends and family',
      location: 'Home'
    },
    {
      id: '4',
      title: 'Holiday Event',
      start: new Date(currentYear, currentMonth, 30),
      end: new Date(currentYear, currentMonth, 30),
      category: 'holiday',
      color: eventCategories.holiday.color,
      allDay: true,
      description: 'Special holiday celebration'
    },
    {
      id: '5',
      title: 'Personal Task',
      start: new Date(currentYear, currentMonth, today.getDate() + 2, 14, 0),
      end: new Date(currentYear, currentMonth, today.getDate() + 2, 15, 30),
      category: 'personal',
      color: eventCategories.personal.color,
      description: 'Important personal appointment'
    },
    {
      id: '6',
      title: 'Today\'s Meeting',
      start: new Date(currentYear, currentMonth, today.getDate(), 15, 0),
      end: new Date(currentYear, currentMonth, today.getDate(), 16, 0),
      category: 'meeting',
      color: eventCategories.meeting.color,
      description: 'Sample meeting for today',
      location: 'Virtual'
    }
  ]
}

export default function CalendarTool({ onClose }: CalendarToolProps) {
  const { currentUser } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>(getInitialEvents())
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [isProcessingAI, setIsProcessingAI] = useState(false)
  
  // Calendar toggles
  const [calendarToggles, setCalendarToggles] = useState({
    calendar: true,
    birthdays: true,
    holidays: true
  })

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    start: '',
    end: '',
    category: 'personal' as keyof typeof eventCategories,
    description: '',
    location: '',
    allDay: false
  })

  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setEventForm({
      title: event.title,
      start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
      end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
      category: event.category,
      description: event.description || '',
      location: event.location || '',
      allDay: event.allDay || false
    })
    setShowEventModal(true)
  }, [])

  // Handle slot selection (new event)
  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent(null)
    setEventForm({
      title: '',
      start: moment(start).format('YYYY-MM-DDTHH:mm'),
      end: moment(end).format('YYYY-MM-DDTHH:mm'),
      category: 'personal',
      description: '',
      location: '',
      allDay: false
    })
    setShowEventModal(true)
  }, [])

  // Save event
  const handleSaveEvent = () => {
    if (!eventForm.title.trim()) return

    const eventData: CalendarEvent = {
      id: selectedEvent?.id || Date.now().toString(),
      title: eventForm.title,
      start: new Date(eventForm.start),
      end: new Date(eventForm.end),
      category: eventForm.category,
      color: eventCategories[eventForm.category].color,
      description: eventForm.description,
      location: eventForm.location,
      allDay: eventForm.allDay
    }

    if (selectedEvent) {
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? eventData : e))
    } else {
      setEvents(prev => [...prev, eventData])
    }

    setShowEventModal(false)
    resetEventForm()
  }

  // Delete event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id))
      setShowEventModal(false)
      resetEventForm()
    }
  }

  const resetEventForm = () => {
    setEventForm({
      title: '',
      start: '',
      end: '',
      category: 'personal',
      description: '',
      location: '',
      allDay: false
    })
    setSelectedEvent(null)
  }

  // AI Assistant for natural language scheduling
  const handleAIScheduling = async () => {
    if (!aiInput.trim()) return

    setIsProcessingAI(true)
    
    try {
      // Simulate AI processing - in real implementation, this would call OpenAI API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Parse the AI input and create event (simplified example)
      const aiEvent = parseAIInput(aiInput)
      if (aiEvent) {
        setEvents(prev => [...prev, aiEvent])
        setAiInput('')
        setShowAIAssistant(false)
      }
    } catch (error) {
      console.error('AI scheduling error:', error)
    } finally {
      setIsProcessingAI(false)
    }
  }

  // Simple AI input parser (in real implementation, use OpenAI)
  const parseAIInput = (input: string): CalendarEvent | null => {
    const lowerInput = input.toLowerCase()
    
    // Simple pattern matching for demo
    if (lowerInput.includes('meeting') && lowerInput.includes('tomorrow')) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(14, 0, 0, 0)
      
      return {
        id: Date.now().toString(),
        title: 'AI Scheduled Meeting',
        start: tomorrow,
        end: new Date(tomorrow.getTime() + 60 * 60 * 1000),
        category: 'meeting',
        color: eventCategories.meeting.color,
        description: `Scheduled via AI: "${input}"`
      }
    }
    
    return null
  }

  // Filter events based on toggles
  const filteredEvents = events.filter(event => {
    if (!calendarToggles.calendar && ['work', 'personal', 'meeting'].includes(event.category)) return false
    if (!calendarToggles.birthdays && event.category === 'birthday') return false
    if (!calendarToggles.holidays && event.category === 'holiday') return false
    return true
  })

  // Custom event style
  const eventStyleGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '6px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    }
  })

  // Get today's events
  const todayEvents = events.filter(event => 
    moment(event.start).isSame(moment(), 'day')
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex">
        
        {/* Sidebar */}
        <div className="w-80 bg-white/5 border-r border-white/10 p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Calendar</h2>
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

          {/* New Event Button */}
          <button
            onClick={() => {
              const now = new Date()
              handleSelectSlot({ 
                start: now, 
                end: new Date(now.getTime() + 60 * 60 * 1000) 
              })
            }}
            className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
          >
            + New Event
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={() => setShowAIAssistant(true)}
            className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 hover:scale-105"
          >
            🤖 AI Schedule Assistant
          </button>

          {/* My Calendars */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">My Calendars</h3>
            <div className="space-y-2">
              {Object.entries(calendarToggles).map(([key, enabled]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setCalendarToggles(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/20 bg-transparent"
                  />
                  <span className="text-gray-300 capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Today's Events */}
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-3">Today's Events</h3>
            <div className="space-y-2">
              {todayEvents.length > 0 ? (
                todayEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg bg-white/5 border-l-4 cursor-pointer hover:bg-white/10 transition-colors"
                    style={{ borderLeftColor: event.color }}
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div className="text-white text-sm font-medium">{event.title}</div>
                    <div className="text-gray-400 text-xs">
                      {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No events today</p>
              )}
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-white text-sm font-semibold mb-2">Categories</h4>
            <div className="space-y-1">
              {Object.entries(eventCategories).map(([key, category]) => (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-400 text-xs">{category.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Calendar */}
        <div className="flex-1 p-6 bg-white/5">
          <div className="h-full">
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              view={currentView}
              onView={setCurrentView}
              date={currentDate}
              onNavigate={setCurrentDate}
              className="nexus-calendar"
            />
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {selectedEvent ? 'Edit Event' : 'New Event'}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start</label>
                  <input
                    type="datetime-local"
                    value={eventForm.start}
                    onChange={(e) => setEventForm(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End</label>
                  <input
                    type="datetime-local"
                    value={eventForm.end}
                    onChange={(e) => setEventForm(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value as keyof typeof eventCategories }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(eventCategories).map(([key, category]) => (
                    <option key={key} value={key} className="bg-slate-800">
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event location"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventForm.allDay}
                  onChange={(e) => setEventForm(prev => ({ ...prev, allDay: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/20 bg-transparent"
                />
                <span className="text-gray-300 text-sm">All day event</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEvent}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                {selectedEvent ? 'Update' : 'Create'} Event
              </button>
              {selectedEvent && (
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Schedule Assistant</h3>
                  <p className="text-gray-400 text-sm">Natural language scheduling</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tell me what you'd like to schedule
                </label>
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 'Schedule a meeting with John tomorrow at 2 PM' or 'Block time for project work next Friday morning'"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <h4 className="text-emerald-400 text-sm font-semibold mb-2">✨ AI Features:</h4>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li>• Natural language event creation</li>
                  <li>• Smart time slot suggestions</li>
                  <li>• Conflict detection and resolution</li>
                  <li>• Meeting invitation automation</li>
                </ul>
              </div>

              <button
                onClick={handleAIScheduling}
                disabled={!aiInput.trim() || isProcessingAI}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Schedule with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 