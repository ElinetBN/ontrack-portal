import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2, AlertTriangle } from "lucide-react"
import { notifications } from "../data/mock-data"
import { Notification } from "../types"

export function NotificationsSidebar() {
  const [notificationsList, setNotificationsList] = useState<Notification[]>(notifications)

  const markAsRead = (id: number) => {
    setNotificationsList(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotificationsList(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const unreadCount = notificationsList.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'reminder':
        return <Bell className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="hover:bg-gray-100 transition-colors">
              Mark all read
            </Button>
          )}
        </div>
        <CardDescription>Recent system alerts and approvals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationsList.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              !notification.read ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${
                    !notification.read ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </span>
                  {notification.urgent && !notification.read && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className={`text-sm mb-2 ${
                  !notification.read ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {notification.message}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{notification.date}</span>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs hover:bg-blue-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(notification.id)
                      }}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* System Alert Card */}
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">System Alert</span>
          </div>
          <p className="text-xs text-red-700 mb-3">
            System failed to auto-update 34 bidder accounts. Click here to review CSD connection details.
          </p>
          <Button size="sm" variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-200 transition-colors">
            Review CSD Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}