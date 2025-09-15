"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  FileText,
  Users,
  FolderKanban,
  PieChart,
  BarChart3,
  ArrowRight,
  Building2,
  LogOut,
  Settings,
  Bell,
} from "lucide-react"
import { logout } from "@/lib/auth"

const portals = [
  {
    id: "tender-procurement",
    title: "Tender & Procurement Portal",
    description: "Manage tender publication, electronic submission, automated evaluation, and contract management.",
    icon: FileText,
    color: "bg-blue-500",
    users: ["Procurement Officers", "Evaluators", "Suppliers", "Entity Admins"],
    features: ["E-submission", "Automated Scoring", "Document Management", "Notifications"],
    notifications: 5,
    href: "/portals/tender-procurement",
  },
  {
    id: "supplier-management",
    title: "Supplier Management & Development Portal",
    description: "Handle supplier onboarding, performance monitoring, and development planning.",
    icon: Users,
    color: "bg-green-500",
    users: ["Supplier Development Managers", "Auditors", "Suppliers"],
    features: ["KPI Tracking", "Gap Analysis", "Training Programs", "Performance Reports"],
    notifications: 3,
    href: "/portals/supplier-management",
  },
  {
    id: "project-management",
    title: "Project Management Portal",
    description: "Embedded project management for tenders and contracts with comprehensive tracking.",
    icon: FolderKanban,
    color: "bg-purple-500",
    users: ["Project Managers", "Procurement Officers", "Finance Analysts"],
    features: ["Task Management", "Timeline Tracking", "Resource Management", "Issue Logging"],
    notifications: 8,
    href: "/portals/project-management",
  },
  {
    id: "budget-inclusion",
    title: "Budget & Inclusion Portal",
    description: "Track inclusive budget allocation and spending across sectors and demographics.",
    icon: PieChart,
    color: "bg-orange-500",
    users: ["Finance Analysts", "Entity Admins", "Steering Committee"],
    features: ["Budget Dashboards", "Variance Alerts", "Allocation Analytics", "Inclusion Metrics"],
    notifications: 2,
    href: "/portals/budget-inclusion",
  },
  {
    id: "analytics-reporting",
    title: "Analytics & Reporting Portal",
    description: "Consolidated dashboards and reporting across all procurement and supplier activities.",
    icon: BarChart3,
    color: "bg-indigo-500",
    users: ["Executives", "Auditors", "Managers"],
    features: ["Real-time KPIs", "Custom Reports", "Trend Analysis", "Compliance Tracking"],
    notifications: 1,
    href: "/portals/analytics-reporting",
  },
]

export function PortalSelectionInterface() {
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">OnTrack Portal System</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Select your portal to continue</p>
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
                <AvatarFallback className="text-xs sm:text-sm">JD</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="icon" className="bg-transparent h-8 w-8 sm:h-10 sm:w-10" onClick={logout}>
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Welcome to OnTrack</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance px-4 sm:px-0">
              Choose the portal that matches your role and responsibilities. Each portal provides specialized tools and
              insights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {portals.map((portal) => {
              const IconComponent = portal.icon
              const isSelected = selectedPortal === portal.id

              return (
                <Card
                  key={portal.id}
                  className={`h-full cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected ? "ring-2 ring-primary shadow-lg" : ""
                  }`}
                  onClick={() => setSelectedPortal(portal.id)}
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`${portal.color} p-2.5 sm:p-3 rounded-lg w-fit mb-2 sm:mb-3`}>
                        <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      {portal.notifications > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {portal.notifications}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base sm:text-lg leading-tight">{portal.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{portal.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 sm:space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-muted-foreground">Target Users:</h4>
                      <div className="flex flex-wrap gap-1">
                        {portal.users.map((user, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {user}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2 text-muted-foreground">Key Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {portal.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {portal.features.length > 3 && (
                          <li className="text-xs text-muted-foreground/70">
                            +{portal.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    <Button
                      className="w-full mt-3 sm:mt-4 h-10 sm:h-11"
                      variant={isSelected ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.href = portal.href
                      }}
                    >
                      {isSelected ? "Enter Portal" : "Select Portal"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Access Section */}
          <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Quick Access</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Button variant="outline" className="justify-start bg-transparent h-10 sm:h-11">
                <FileText className="mr-2 h-4 w-4" />
                Recent Tenders
              </Button>
              <Button variant="outline" className="justify-start bg-transparent h-10 sm:h-11">
                <Users className="mr-2 h-4 w-4" />
                My Suppliers
              </Button>
              <Button variant="outline" className="justify-start bg-transparent h-10 sm:h-11">
                <FolderKanban className="mr-2 h-4 w-4" />
                Active Projects
              </Button>
              <Button variant="outline" className="justify-start bg-transparent h-10 sm:h-11">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              All systems operational
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
