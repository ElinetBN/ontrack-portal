import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, FileText, Upload, Clock, Users, AlertTriangle, TrendingUp, FolderOpen } from "lucide-react"
import { calendarEvents } from "../data/mock-data"
import { useState } from "react"

interface CalendarSidebarProps {
  onStatsClick?: (statType: string, data: any) => void
  onEventClick?: (event: any) => void
  onBidPortalClick?: () => void
  tenders?: any[]
  submissions?: any[]
}

export function CalendarSidebar({ onStatsClick, onEventClick, onBidPortalClick, tenders = [], submissions = [] }: CalendarSidebarProps) {
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  
  const hasTenders = tenders.length > 0
  const hasSubmissions = submissions.length > 0

  const [quickStats] = useState({
    pendingRequests: hasSubmissions ? submissions.filter(sub => sub.status === "Under Review").length : 0,
    activeProjects: hasTenders ? tenders.filter(tender => tender.status === "Open").length : 0,
    upcomingDeadlines: hasTenders ? tenders.filter(tender => {
      const deadline = new Date(tender.deadline)
      const daysUntil = Math.ceil((deadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil <= 7 && daysUntil >= 0
    }).length : 0,
    completedThisMonth: hasTenders ? tenders.filter(tender => {
      const createdDate = new Date(tender.createdDate || tender.deadline)
      return createdDate.getMonth() === currentDate.getMonth() && 
             createdDate.getFullYear() === currentDate.getFullYear() &&
             tender.status === "Awarded"
    }).length : 0
  })

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'specification':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'advert':
        return <Upload className="h-4 w-4 text-green-500" />
      case 'deadline':
        return <Clock className="h-4 w-4 text-red-500" />
      case 'meeting':
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <CalendarDays className="h-4 w-4 text-gray-500" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'specification':
        return 'border-l-blue-500 hover:bg-blue-50'
      case 'advert':
        return 'border-l-green-500 hover:bg-green-50'
      case 'deadline':
        return 'border-l-red-500 hover:bg-red-50'
      case 'meeting':
        return 'border-l-purple-500 hover:bg-purple-50'
      default:
        return 'border-l-gray-500 hover:bg-gray-50'
    }
  }

  const handleStatClick = (statType: string) => {
    if (onStatsClick) {
      const statData = {
        type: statType,
        value: quickStats[statType as keyof typeof quickStats],
        description: getStatDescription(statType),
        relatedEvents: getRelatedEvents(statType),
        timestamp: new Date().toISOString(),
        hasData: hasTenders || hasSubmissions
      }
      onStatsClick(statType, statData)
    }
  }

  const handleEventClick = (event: any) => {
    if (onEventClick) {
      const eventData = {
        ...event,
        fullDate: new Date(event.date).toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        daysUntil: Math.ceil((new Date(event.date).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)),
        priority: getEventPriority(event.type),
        hasData: hasTenders || hasSubmissions
      }
      onEventClick(eventData)
    }
  }

  const handleBidPortalClick = () => {
    if (onBidPortalClick) {
      const portalData = {
        action: 'open_bid_portal',
        timestamp: new Date().toISOString(),
        reminder: 'Open bid submission portal for list month submissions',
        status: 'pending',
        submissionsCount: hasSubmissions ? submissions.length : 0,
        lastOpened: '2024-06-15',
        hasData: hasTenders || hasSubmissions
      }
      onBidPortalClick()
    }
  }

  const getStatDescription = (statType: string) => {
    if (!hasTenders && !hasSubmissions) {
      return 'No data available - Create tenders to see statistics'
    }
    
    switch (statType) {
      case 'pendingRequests':
        return 'Document approvals and tender requests awaiting action'
      case 'activeProjects':
        return 'Currently active tender projects and procurement processes'
      case 'upcomingDeadlines':
        return 'Tender deadlines and submission cut-offs in the next 7 days'
      case 'completedThisMonth':
        return 'Tenders and evaluations completed this calendar month'
      default:
        return 'Statistical information'
    }
  }

  const getRelatedEvents = (statType: string) => {
    if (!hasTenders && !hasSubmissions) {
      return []
    }
    
    switch (statType) {
      case 'pendingRequests':
        return calendarEvents.filter(event => event.type === 'specification' || event.type === 'advert')
      case 'upcomingDeadlines':
        return calendarEvents.filter(event => event.type === 'deadline')
      case 'activeProjects':
        return calendarEvents.filter(event => event.type === 'meeting')
      default:
        return []
    }
  }

  const getEventPriority = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'high'
      case 'specification':
        return 'medium'
      case 'meeting':
        return 'medium'
      case 'advert':
        return 'low'
      default:
        return 'low'
    }
  }

  // Filter calendar events based on whether we have data
  const filteredCalendarEvents = (hasTenders || hasSubmissions) ? calendarEvents : []

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            Calendar Events
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {currentMonth}
          </Badge>
        </div>
        <CardDescription>
          {hasTenders || hasSubmissions 
            ? "Upcoming tender-related events and deadlines" 
            : "No events - Create tenders to see calendar"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div 
            className={`text-center p-3 rounded-lg border transition-colors ${
              hasTenders || hasSubmissions 
                ? "bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer" 
                : "bg-gray-50 border-gray-200 cursor-not-allowed"
            }`}
            onClick={() => (hasTenders || hasSubmissions) && handleStatClick('pendingRequests')}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <FileText className={`h-3 w-3 ${hasTenders || hasSubmissions ? "text-blue-600" : "text-gray-400"}`} />
              <div className={`text-2xl font-bold ${hasTenders || hasSubmissions ? "text-blue-600" : "text-gray-400"}`}>
                {quickStats.pendingRequests}
              </div>
            </div>
            <div className={`text-xs font-medium ${hasTenders || hasSubmissions ? "text-blue-600" : "text-gray-400"}`}>
              Pending Requests
            </div>
          </div>
          <div 
            className={`text-center p-3 rounded-lg border transition-colors ${
              hasTenders || hasSubmissions 
                ? "bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer" 
                : "bg-gray-50 border-gray-200 cursor-not-allowed"
            }`}
            onClick={() => (hasTenders || hasSubmissions) && handleStatClick('activeProjects')}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className={`h-3 w-3 ${hasTenders || hasSubmissions ? "text-green-600" : "text-gray-400"}`} />
              <div className={`text-2xl font-bold ${hasTenders || hasSubmissions ? "text-green-600" : "text-gray-400"}`}>
                {quickStats.activeProjects}
              </div>
            </div>
            <div className={`text-xs font-medium ${hasTenders || hasSubmissions ? "text-green-600" : "text-gray-400"}`}>
              Active Projects
            </div>
          </div>
          <div 
            className={`text-center p-3 rounded-lg border transition-colors ${
              hasTenders || hasSubmissions 
                ? "bg-red-50 border-red-200 hover:bg-red-100 cursor-pointer" 
                : "bg-gray-50 border-gray-200 cursor-not-allowed"
            }`}
            onClick={() => (hasTenders || hasSubmissions) && handleStatClick('upcomingDeadlines')}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className={`h-3 w-3 ${hasTenders || hasSubmissions ? "text-red-600" : "text-gray-400"}`} />
              <div className={`text-2xl font-bold ${hasTenders || hasSubmissions ? "text-red-600" : "text-gray-400"}`}>
                {quickStats.upcomingDeadlines}
              </div>
            </div>
            <div className={`text-xs font-medium ${hasTenders || hasSubmissions ? "text-red-600" : "text-gray-400"}`}>
              Upcoming Deadlines
            </div>
          </div>
          <div 
            className={`text-center p-3 rounded-lg border transition-colors ${
              hasTenders || hasSubmissions 
                ? "bg-purple-50 border-purple-200 hover:bg-purple-100 cursor-pointer" 
                : "bg-gray-50 border-gray-200 cursor-not-allowed"
            }`}
            onClick={() => (hasTenders || hasSubmissions) && handleStatClick('completedThisMonth')}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <FolderOpen className={`h-3 w-3 ${hasTenders || hasSubmissions ? "text-purple-600" : "text-gray-400"}`} />
              <div className={`text-2xl font-bold ${hasTenders || hasSubmissions ? "text-purple-600" : "text-gray-400"}`}>
                {quickStats.completedThisMonth}
              </div>
            </div>
            <div className={`text-xs font-medium ${hasTenders || hasSubmissions ? "text-purple-600" : "text-gray-400"}`}>
              Completed This Month
            </div>
          </div>
        </div>

        {/* Calendar Events */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Upcoming Events</h4>
          {filteredCalendarEvents.length > 0 ? (
            filteredCalendarEvents.map((event) => (
              <div 
                key={event.id}
                className={`p-3 border rounded-lg border-l-4 ${getEventColor(event.type)} bg-white hover:shadow-sm transition-all cursor-pointer group`}
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{event.time}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          event.type === 'deadline' ? 'bg-red-50 text-red-700 border-red-200' :
                          event.type === 'specification' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          event.type === 'meeting' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-green-50 text-green-700 border-green-200'
                        }`}
                      >
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        getEventPriority(event.type) === 'high' ? 'bg-red-100 text-red-700' :
                        getEventPriority(event.type) === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {getEventPriority(event.type).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground border rounded-lg bg-gray-50">
              <CalendarDays className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm">No upcoming events</p>
              <p className="text-xs mt-1">Create tenders to see calendar events</p>
            </div>
          )}
        </div>

        {/* Bid Portal Section */}
        <div 
          className={`mt-4 p-3 border rounded-lg transition-colors ${
            hasTenders || hasSubmissions 
              ? "bg-orange-50 border-orange-200 hover:bg-orange-100 cursor-pointer" 
              : "bg-gray-50 border-gray-200 cursor-not-allowed"
          }`}
          onClick={() => (hasTenders || hasSubmissions) && handleBidPortalClick()}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`h-4 w-4 ${hasTenders || hasSubmissions ? "text-orange-600" : "text-gray-400"}`} />
            <span className={`text-sm font-medium ${hasTenders || hasSubmissions ? "text-orange-800" : "text-gray-500"}`}>
              Bid Portal Reminder
            </span>
          </div>
          <p className={`text-xs mb-3 ${hasTenders || hasSubmissions ? "text-orange-700" : "text-gray-500"}`}>
            {hasTenders || hasSubmissions 
              ? `Open bid submission portal for list month submissions. ${submissions.length} submissions pending review.`
              : "No submissions available - Create tenders first"
            }
          </p>
          <Button 
            size="sm" 
            className={`w-full transition-colors ${
              hasTenders || hasSubmissions 
                ? "bg-orange-600 hover:bg-orange-700 text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!hasTenders && !hasSubmissions}
            onClick={(e) => {
              e.stopPropagation()
              if (hasTenders || hasSubmissions) {
                handleBidPortalClick()
              }
            }}
          >
            Open Portal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}