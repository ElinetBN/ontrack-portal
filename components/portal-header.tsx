"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Bell, Settings, LogOut } from "lucide-react"
import { logout, getAuthUser } from "@/lib/auth"
import { useEffect, useState } from "react"

interface PortalHeaderProps {
  title: string
  description: string
  icon: React.ReactNode
  onBack?: () => void
}

export function PortalHeader({ title, description, icon, onBack }: PortalHeaderProps) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = getAuthUser()
    setUser(userData)
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.location.href = "/portal-selection"
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="bg-transparent h-8 w-8 sm:h-10 sm:w-10"
              onClick={handleBack}
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <div className="flex items-center gap-3">
              {icon}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">{title}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="icon" className="bg-transparent h-8 w-8 sm:h-10 sm:w-10">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-transparent h-8 w-8 sm:h-10 sm:w-10">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarFallback className="text-xs sm:text-sm">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="bg-transparent h-8 w-8 sm:h-10 sm:w-10"
              onClick={handleLogout}
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
