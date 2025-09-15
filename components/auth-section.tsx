"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Mail, Lock, User, Phone } from "lucide-react"

const portals = [
  { value: "tender-procurement", label: "Tender & Procurement Portal" },
  { value: "supplier-management", label: "Supplier Management Portal" },
  { value: "project-management", label: "Project Management Portal" },
  { value: "budget-inclusion", label: "Budget & Inclusion Portal" },
  { value: "analytics-reporting", label: "Analytics & Reporting Portal" },
]

export function AuthSection() {
  const [selectedPortal, setSelectedPortal] = useState("")

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Access OnTrack System</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sign in to your account or register for access to the portal system
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-11">
              <TabsTrigger value="signin" className="text-sm">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="text-sm">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">Sign In</CardTitle>
                  <CardDescription className="text-sm">Enter your credentials to access your portal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="your.email@domain.com" className="pl-10 h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portal-select" className="text-sm font-medium">
                      Select Portal
                    </Label>
                    <Select value={selectedPortal} onValueChange={setSelectedPortal}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose your portal" />
                      </SelectTrigger>
                      <SelectContent>
                        {portals.map((portal) => (
                          <SelectItem key={portal.value} value={portal.value} className="text-sm">
                            {portal.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full h-11 text-sm font-medium" size="lg">
                    Sign In to Portal
                  </Button>

                  <div className="text-center">
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">Register</CardTitle>
                  <CardDescription className="text-sm">
                    Create a new account to access the portal system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-sm font-medium">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="first-name" placeholder="John" className="pl-10 h-11" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input id="last-name" placeholder="Doe" className="h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="reg-email" type="email" placeholder="your.email@domain.com" className="pl-10 h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" type="tel" placeholder="+27 12 345 6789" className="pl-10 h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-sm font-medium">
                      Organization
                    </Label>
                    <Input id="organization" placeholder="Your Organization Name" className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="reg-password" type="password" placeholder="••••••••" className="pl-10 h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="confirm-password" type="password" placeholder="••••••••" className="pl-10 h-11" />
                    </div>
                  </div>

                  <Button className="w-full h-11 text-sm font-medium" size="lg">
                    Create Account
                  </Button>

                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    By registering, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
