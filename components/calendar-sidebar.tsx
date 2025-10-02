import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, FileText, Upload, Clock, Users, AlertTriangle } from "lucide-react"
import { calendarEvents } from "../data/mock-data"

export function CalendarSidebar() {
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  
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
        return 'border-l-blue-500'
      case 'advert':
        return 'border-l-green-500'
      case 'deadline':
        return 'border-l-red-500'
      case 'meeting':
        return 'border-l-purple-500'
      default:
        return 'border-l-gray-500'
    }
  }

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
        <CardDescription>Upcoming tender-related events and deadlines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <div className="text-xs text-blue-600">Pending Requests</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">30</div>
            <div className="text-xs text-green-600">Active Projects</div>
          </div>
        </div>

        {/* Calendar Events */}
        <div className="space-y-3">
          {calendarEvents.map((event) => (
            <div 
              key={event.id}
              className={`p-3 border rounded-lg border-l-4 ${getEventColor(event.type)} bg-white hover:bg-gray-50 transition-colors cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                {getEventIcon(event.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{event.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bid Portal Section */}
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Bid Portal Reminder</span>
          </div>
          <p className="text-xs text-orange-700 mb-3">
            Open bid submission portal for list month submissions.
          </p>
          <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white transition-colors">
            Open Portal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}