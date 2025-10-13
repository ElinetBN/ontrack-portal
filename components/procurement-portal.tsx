"use client"

import { useState } from "react"
import { BidderPortal } from "./bidder-portal"
import { ProcurementOfficerPortal } from "./procurement-officer-portal"
import { logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, Bell, Settings, LogOut } from "lucide-react"

// User Role Types
type UserRole = "procurement-officer" | "bidder" | "evaluator";

export function TenderProcurementPortal() {
  const [userRole, setUserRole] = useState<UserRole>("bidder")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Tender & Procurement Portal</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {userRole === "procurement-officer" ? "Manage tenders and evaluate submissions" : "Browse tenders and track submissions"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role Switcher */}
              <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg">
                <Button
                  variant={userRole === "procurement-officer" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUserRole("procurement-officer")}
                  className="text-xs h-8 px-2 sm:px-3"
                >
                  Officer
                </Button>
                <Button
                  variant={userRole === "bidder" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUserRole("bidder")}
                  className="text-xs h-8 px-2 sm:px-3"
                >
                  Bidder
                </Button>
              </div>

              <Button variant="outline" size="icon" className="bg-transparent h-8 w-8 sm:h-10 sm:w-10">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent h-8 w-8 sm:h-10 sm:w-10">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarFallback className="text-xs sm:text-sm">
                  {userRole === "procurement-officer" ? "PO" : "BD"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="icon" className="bg-transparent h-8 w-8 sm:h-10 sm:w-10" onClick={logout}>
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {userRole === "bidder" ? <BidderPortal /> : <ProcurementOfficerPortal />}
        </div>
      </main>
    </div>
  )
}