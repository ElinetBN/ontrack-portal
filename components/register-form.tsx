"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const projects = [
    { value: "project-owner", label: "Project Owner" },
    { value: "quantity-surveyor", label: "Quantity Surveyor" },
    { value: "architect", label: "Architect" },
    { value: "structural-engineer", label: "Structural Engineer" },
    { value: "mechanical-electrical", label: "Mechanical & Electrical Engineer" },
    { value: "main-contractor", label: "Main Contractor" },
    { value: "site-manager", label: "Site Manager" },
    { value: "health-safety", label: "Health & Safety Officer" },
    { value: "legal", label: "Legal" },
    { value: "specialist-consultants", label: "Specialist Consultants" },
    { value: "other", label: "Other" },
  ]

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Show success message
    setSuccessMessage("✅ Account created successfully. Redirecting to sign in...")

    // Redirect to sign-in after short delay
    setTimeout(() => {
      window.location.href = "/auth/signin"
    }, 2000) // waits 2 seconds before redirect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3">
            <div className="bg-primary p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">OnTrack</h1>
              <p className="text-sm text-muted-foreground">Portal System</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Register for access to the OnTrack portal system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" type="text" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" type="text" placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@organization.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+27 12 345 6789" required />
                </div>
              </div>

              {/* Project Role */}
              <div className="space-y-2">
                <Label htmlFor="project-role" className="text-sm font-medium">
                  Project Role
                </Label>
                <Select value={selectedProjects} onValueChange={setSelectedProjects} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your project role" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.value} value={project.value} className="text-sm">
                        {project.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Security Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    required
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I accept the terms and conditions
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      By registering, you agree to our{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Already have an account?
                </Link>
              </div>

              {/* Success Message */}
              {successMessage && (
                <p className="text-green-600 text-sm font-medium text-center">{successMessage}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!acceptedTerms || !selectedProjects}
              >
                Create Account
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
