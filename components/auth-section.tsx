"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Mail, Lock, User, Phone, CheckCircle, ArrowLeft } from "lucide-react"

const portals = [
  { value: "tender-procurement", label: "Tender & Procurement Portal" },
  { value: "supplier-management", label: "Supplier Management Portal" },
  { value: "project-management", label: "Project Management Portal" },
  { value: "budget-inclusion", label: "Budget & Inclusion Portal" },
  { value: "analytics-reporting", label: "Analytics & Reporting Portal" },
]

const userTypes = [
  { value: "supplier", label: "As a Supplier" },
  { value: "admin", label: "As an Admin" },
  { value: "company", label: "As a Company" },
  { value: "transformation", label: "As a Transformation Partner" },
]

const securityQuestions = [
  "What was the name of your first pet?",
  "In which city were you born?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favorite book?",
]

export function AuthSection() {
  const [selectedPortal, setSelectedPortal] = useState("")
  const [userType, setUserType] = useState("")
  const [currentStep, setCurrentStep] = useState("auth") // auth, verification, otp, success
  const [otpCode, setOtpCode] = useState(["", "", "", "", ""])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
    employeeNumber: "",
    identityNumber: ""
  })

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otpCode]
      newOtp[index] = value
      setOtpCode(newOtp)
      
      // Auto-focus next input
      if (value && index < 4) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignIn = () => {
    // Simulate sign in process
    console.log("Signing in with:", { email: formData.email, portal: selectedPortal })
  }

  const handleRegister = () => {
    setCurrentStep("verification")
  }

  const handleRequestOtp = () => {
    setCurrentStep("otp")
  }

  const handleVerifyOtp = () => {
    setCurrentStep("success")
  }

  const handleBackToAuth = () => {
    setCurrentStep("auth")
  }

  if (currentStep === "verification") {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="bg-green-100 border-green-200">
              <CardHeader className="text-center pb-6">
                <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
                  <h2 className="text-xl font-bold">LET'S GET YOU VERIFIED!</h2>
                </div>
                <CardDescription>
                  To confirm your email, we're going to send you a 5-digit OTP number
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={handleRequestOtp}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full"
                >
                  REQUEST OTP
                </Button>
                <div className="mt-4">
                  <Button variant="ghost" onClick={handleBackToAuth}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  if (currentStep === "otp") {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="bg-green-100 border-green-200">
              <CardHeader className="text-center pb-6">
                <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
                  <h2 className="text-xl font-bold">LET'S GET YOU VERIFIED!</h2>
                </div>
                <CardDescription>
                  Enter the 5-digit OTP that's been sent to your email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center space-x-2">
                  {otpCode.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-lg font-bold bg-white border-2"
                      maxLength={1}
                    />
                  ))}
                </div>
                <div className="text-center space-y-4">
                  <Button 
                    onClick={handleVerifyOtp}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full"
                    disabled={otpCode.some(digit => !digit)}
                  >
                    VERIFY OTP
                  </Button>
                  <div>
                    <Button variant="ghost" onClick={handleBackToAuth}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  if (currentStep === "success") {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="bg-green-100 border-green-200">
              <CardHeader className="text-center pb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
                  <h2 className="text-xl font-bold">GREAT! YOU'VE BEEN VERIFIED!</h2>
                </div>
                <CardDescription>
                  Your OnTrack system account has been successfully created and verified!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => setCurrentStep("auth")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full"
                >
                  CONTINUE TO DASHBOARD
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

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
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your.email@domain.com" 
                        className="pl-10 h-11" 
                        value={formData.email}
                        onChange={(e) => handleFormChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 h-11" 
                        value={formData.password}
                        onChange={(e) => handleFormChange("password", e.target.value)}
                      />
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

                  <Button 
                    onClick={handleSignIn}
                    className="w-full h-11 text-sm font-medium" 
                    size="lg"
                  >
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
                  <div className="space-y-2">
                    <Label htmlFor="user-type" className="text-sm font-medium">
                      Register As
                    </Label>
                    <Select value={userType} onValueChange={setUserType}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-sm">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-sm font-medium">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="first-name" 
                          placeholder="John" 
                          className="pl-10 h-11" 
                          value={formData.firstName}
                          onChange={(e) => handleFormChange("firstName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input 
                        id="last-name" 
                        placeholder="Doe" 
                        className="h-11" 
                        value={formData.lastName}
                        onChange={(e) => handleFormChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="your.email@domain.com" 
                        className="pl-10 h-11" 
                        value={formData.email}
                        onChange={(e) => handleFormChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+27 12 345 6789" 
                        className="pl-10 h-11" 
                        value={formData.phone}
                        onChange={(e) => handleFormChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-sm font-medium">
                      {userType === "supplier" ? "Company Name" : "Organization"}
                    </Label>
                    <Input 
                      id="organization" 
                      placeholder="Your Organization Name" 
                      className="h-11" 
                      value={formData.organization}
                      onChange={(e) => handleFormChange("organization", e.target.value)}
                    />
                  </div>

                  {(userType === "company" || userType === "transformation") && (
                    <div className="space-y-2">
                      <Label htmlFor="employee-number" className="text-sm font-medium">
                        Employee Number
                      </Label>
                      <Input 
                        id="employee-number" 
                        placeholder="EMP001234" 
                        className="h-11" 
                        value={formData.employeeNumber}
                        onChange={(e) => handleFormChange("employeeNumber", e.target.value)}
                      />
                    </div>
                  )}

                  {userType === "supplier" && (
                    <div className="space-y-2">
                      <Label htmlFor="identity-number" className="text-sm font-medium">
                        Identity Number
                      </Label>
                      <Input 
                        id="identity-number" 
                        placeholder="Identity/Registration Number" 
                        className="h-11" 
                        value={formData.identityNumber}
                        onChange={(e) => handleFormChange("identityNumber", e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="security-question" className="text-sm font-medium">
                      Security Question
                    </Label>
                    <Select value={formData.securityQuestion} onValueChange={(value) => handleFormChange("securityQuestion", value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose a security question" />
                      </SelectTrigger>
                      <SelectContent>
                        {securityQuestions.map((question, index) => (
                          <SelectItem key={index} value={question} className="text-sm">
                            {question}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-answer" className="text-sm font-medium">
                      Security Answer
                    </Label>
                    <Input 
                      id="security-answer" 
                      placeholder="Your answer" 
                      className="h-11" 
                      value={formData.securityAnswer}
                      onChange={(e) => handleFormChange("securityAnswer", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="reg-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 h-11" 
                        value={formData.password}
                        onChange={(e) => handleFormChange("password", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 h-11" 
                        value={formData.confirmPassword}
                        onChange={(e) => handleFormChange("confirmPassword", e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleRegister}
                    className="w-full h-11 text-sm font-medium" 
                    size="lg"
                  >
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