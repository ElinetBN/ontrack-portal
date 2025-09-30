"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic here
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
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

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>We've sent password reset instructions to your email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  If you don't see the email in your inbox, please check your spam folder.
                </p>
                <p className="text-sm text-muted-foreground">
                  The reset link will expire in 24 hours for security reasons.
                </p>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/auth/signin">Back to Sign In</Link>
                </Button>
                <Button variant="outline" onClick={() => setIsSubmitted(false)} className="w-full bg-transparent">
                  Try Different Email
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            <p>&copy; 2024 OnTrack Portal System. All rights reserved.</p>
            <p className="mt-1">Developed for Government Excellence</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
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

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-muted p-3 rounded-full w-fit mb-4">
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your.email@domain.com" required className="w-full" />
              </div>

              <Button type="submit" className="w-full">
                Send Reset Instructions
              </Button>

              <div className="text-center">
                <Link href="/auth/signin" className="text-sm text-primary hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>&copy; 2025 OnTrack Portal System. All rights reserved.</p>
          <p className="mt-1">Developed for Government Excellence</p>
        </div>
      </div>
    </div>
  )
}
