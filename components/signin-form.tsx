"use client"

import type React from "react"
import { setAuthCookie } from "@/lib/auth"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedPortal, setSelectedPortal] = useState("")

  const portals = [
    { value: "tender-procurement", label: "Tender & Procurement Portal" },
    { value: "supplier-management", label: "Supplier Management Portal" },
    { value: "project-management", label: "Project Management Portal" },
    { value: "budget-inclusion", label: "Budget & Inclusion Portal" },
    { value: "analytics-reporting", label: "Analytics & Reporting Portal" },
  ]

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPortal) {
      const userData = {
        id: "1", // In real app, this would come from authentication
        email: "user@example.com", // This would come from form
        name: "John Doe", // This would come from authentication
        portal: selectedPortal,
      }

      setAuthCookie(userData)
      window.location.href = `/portals/${selectedPortal}`
    } else {
      alert("Please select a portal to continue")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3">
            <div className="bg-primary p-2.5 sm:p-3 rounded-lg">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">OnTrack</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Portal System</p>
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <Card>
          <CardHeader className="text-center pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl">Sign In</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your credentials to access the OnTrack portal system
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@domain.com"
                  required
                  className="w-full h-10 sm:h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="w-full h-10 sm:h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 sm:h-11 w-10 sm:w-11 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portal" className="text-sm font-medium">
                  Select Portal <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedPortal} onValueChange={setSelectedPortal} required>
                  <SelectTrigger className="h-10 sm:h-11">
                    <SelectValue placeholder="Choose which portal to access" />
                  </SelectTrigger>
                  <SelectContent>
                    {portals.map((portal) => (
                      <SelectItem key={portal.value} value={portal.value}>
                        {portal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the portal you need to access. You can request access to additional portals later.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-sm">
                <Link href="/auth/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
                <Link href="/auth/register" className="text-primary hover:underline">
                  Need an account?
                </Link>
              </div>

              <Button type="submit" className="w-full h-10 sm:h-11" disabled={!selectedPortal}>
                {selectedPortal
                  ? `Sign In to ${portals.find((p) => p.value === selectedPortal)?.label}`
                  : "Select Portal to Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>&copy; 2024 OnTrack Portal System. All rights reserved.</p>
          <p className="mt-1">Developed for Government Excellence</p>
        </div>
      </div>
    </div>
  )
}
