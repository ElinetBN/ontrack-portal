"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  FileText,
  Users,
  Building2,
  Bell,
  Settings,
  LogOut,
  Search,
  Filter,
  Plus,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowRight,
  Upload,
  Eye,
  Edit,
  Trash2,
  FileUp,
  UserCheck,
  BarChart,
  Shield,
  Target,
} from "lucide-react"
import { logout } from "@/lib/auth"

// Mock data for the portal dashboard
const quickStats = [
  {
    title: "Active Tenders",
    value: "12",
    change: "+3",
    description: "From last month",
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Total Submissions",
    value: "47",
    change: "+12",
    description: "This quarter",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    title: "Pending Evaluation",
    value: "8",
    change: "-2",
    description: "Awaiting review",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    title: "Total Value",
    value: "R 18.2M",
    change: "+5.3M",
    description: "Active contracts",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  }
]

const recentActivities = [
  {
    id: 1,
    type: "tender",
    title: "New tender published",
    description: "IT Infrastructure Upgrade Project",
    time: "2 hours ago",
    status: "active"
  },
  {
    id: 2,
    type: "submission",
    title: "Submission received",
    description: "From TechCorp Solutions",
    time: "4 hours ago",
    status: "new"
  },
  {
    id: 3,
    type: "evaluation",
    title: "Evaluation completed",
    description: "Office Furniture Supply tender",
    time: "1 day ago",
    status: "completed"
  },
  {
    id: 4,
    type: "contract",
    title: "Contract awarded",
    description: "Security Services to SecurePlus Ltd",
    time: "2 days ago",
    status: "awarded"
  }
]

const upcomingDeadlines = [
  {
    id: 1,
    title: "IT Infrastructure Tender",
    deadline: "2024-02-15",
    submissions: 12,
    status: "open"
  },
  {
    id: 2,
    title: "Office Furniture Supply",
    deadline: "2024-01-30",
    submissions: 8,
    status: "evaluation"
  },
  {
    id: 3,
    title: "Cleaning Services",
    deadline: "2024-02-28",
    submissions: 0,
    status: "draft"
  }
]

// Tender Registration Steps
const registrationSteps = [
  {
    step: 1,
    title: "Tender Information",
    description: "Basic tender details and scope",
    icon: FileText,
    completed: true
  },
  {
    step: 2,
    title: "Requirements & Specifications",
    description: "Technical and compliance requirements",
    icon: Shield,
    completed: true
  },
  {
    step: 3,
    title: "Evaluation Criteria",
    description: "Scoring methodology and weights",
    icon: Target,
    completed: false
  },
  {
    step: 4,
    title: "Publish & Notify",
    description: "Final review and publication",
    icon: UserCheck,
    completed: false
  }
]

// User Role Types
type UserRole = "procurement-officer" | "bidder" | "evaluator";

export function TenderProcurementPortal() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [userRole, setUserRole] = useState<UserRole>("procurement-officer")
  const [showTenderRegistration, setShowTenderRegistration] = useState(false)

  const handleNavigateToDashboard = () => {
    window.location.href = "/portals/tender-procurement"
  }

  const handleNavigateToSubmissions = () => {
    window.location.href = "/portals/tender-procurement/submissions"
  }

  const handleStartTenderRegistration = () => {
    setShowTenderRegistration(true)
    //setActiveTab("tenders")
    window.location.href = "/portals/tender-procurement"
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      new: "secondary",
      completed: "outline",
      awarded: "default",
      open: "default",
      evaluation: "secondary",
      draft: "outline"
    } as const

    const labels = {
      active: "Active",
      new: "New",
      completed: "Completed",
      awarded: "Awarded",
      open: "Open",
      evaluation: "Evaluation",
      draft: "Draft"
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  // Main Action Cards based on user role
  const MainActionCards = () => {
    if (userRole === "procurement-officer") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Register New Tender Card */}
          <Card className="bg-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 p-3 rounded-lg">
                  <FileUp className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 mb-2">Register New Tender</h3>
                  <p className="text-green-700 mb-4">
                    Create and publish new tender opportunities. Define requirements, evaluation criteria, and manage the entire tender lifecycle.
                  </p>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Define tender specifications</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Set evaluation criteria</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Publish to suppliers</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleStartTenderRegistration}
                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Start Tender Registration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Submissions Card */}
          <Card className="bg-primary/10 border-primary/20 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary p-3 rounded-lg">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-2">View & Evaluate Submissions</h3>
                  <p className="text-primary/80 mb-4">
                    Review, evaluate, and manage all tender submissions. Access comprehensive evaluation tools and scoring systems.
                  </p>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <CheckCircle className="h-4 w-4" />
                      <span>Review submitted documents</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <CheckCircle className="h-4 w-4" />
                      <span>Automated scoring system</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <CheckCircle className="h-4 w-4" />
                      <span>Comparative analysis</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleNavigateToSubmissions}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                  >
                    <BarChart className="mr-2 h-5 w-5" />
                    View All Submissions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Bidder View
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Available Tenders Card */}
        <Card className="bg-primary/10 border-primary/20 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary p-3 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary mb-2">Available Tenders</h3>
                <p className="text-primary/80 mb-4">
                  Browse and apply for open tender opportunities. View requirements and submit your proposals.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-primary">
                    <CheckCircle className="h-4 w-4" />
                    <span>View open tenders</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-primary">
                    <CheckCircle className="h-4 w-4" />
                    <span>Download tender documents</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-primary">
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit your proposal</span>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                  <Eye className="mr-2 h-5 w-5" />
                  Browse Tenders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Submissions Card */}
        <Card className="bg-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">My Submissions</h3>
                <p className="text-green-700 mb-4">
                  Track your submitted tender applications and view evaluation status and feedback.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Track submission status</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>View evaluation results</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Download submission documents</span>
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                  <BarChart className="mr-2 h-5 w-5" />
                  View My Submissions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
                  className="text-xs h-8"
                >
                  Officer
                </Button>
                <Button
                  variant={userRole === "bidder" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUserRole("bidder")}
                  className="text-xs h-8"
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back, {userRole === "procurement-officer" ? "Procurement Officer" : "Valued Bidder"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {userRole === "procurement-officer" 
                ? "Choose your action to manage tenders or evaluate submissions." 
                : "Browse available tenders or track your submissions."}
            </p>
          </div>

          {/* Main Action Cards */}
          <MainActionCards />

          {/* Tender Registration Progress (Only for officers when active) */}
          {userRole === "procurement-officer" && showTenderRegistration && (
            <Card className="mb-8 border-l-4 border-l-green-500 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUp className="h-5 w-5 text-green-600" />
                  Tender Registration in Progress
                </CardTitle>
                <CardDescription>
                  Complete the following steps to publish your tender
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registrationSteps.map((step) => (
                    <div key={step.step} className="flex items-center space-x-4 p-3 border rounded-lg bg-white">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <step.icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      <Button variant={step.completed ? "outline" : "default"} size="sm">
                        {step.completed ? "Edit" : "Start"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tenders">
                {userRole === "procurement-officer" ? "My Tenders" : "Available Tenders"}
              </TabsTrigger>
              <TabsTrigger value="submissions">
                {userRole === "procurement-officer" ? "Submissions" : "My Submissions"}
              </TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and actions in the system</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {activity.type === 'tender' && <FileText className="h-5 w-5 text-primary" />}
                          {activity.type === 'submission' && <Upload className="h-5 w-5 text-green-600" />}
                          {activity.type === 'evaluation' && <CheckCircle className="h-5 w-5 text-orange-600" />}
                          {activity.type === 'contract' && <Building2 className="h-5 w-5 text-purple-600" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{activity.title}</p>
                            {getStatusBadge(activity.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                    <CardDescription>
                      {userRole === "procurement-officer" ? "Tenders closing soon" : "Your submission deadlines"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{deadline.title}</p>
                          {getStatusBadge(deadline.status)}
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Closes: {new Date(deadline.deadline).toLocaleDateString()}</span>
                          <span>{deadline.submissions} submissions</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Time remaining</span>
                            <span>
                              {Math.ceil((new Date(deadline.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </div>
                          <Progress 
                            value={Math.max(0, 100 - (Math.ceil((new Date(deadline.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) / 30) * 100)} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tenders Tab */}
            <TabsContent value="tenders" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">
                    {userRole === "procurement-officer" ? "Tender Management" : "Available Tenders"}
                  </h3>
                  <p className="text-muted-foreground">
                    {userRole === "procurement-officer" 
                      ? "Create and manage tender opportunities" 
                      : "Browse and apply for open tenders"}
                  </p>
                </div>
                {userRole === "procurement-officer" && (
                  <Button onClick={handleStartTenderRegistration} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Tender
                  </Button>
                )}
              </div>

              {/* Search and Filter */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={userRole === "procurement-officer" ? "Search my tenders..." : "Search available tenders..."} 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>

              {/* Tenders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Card key={item} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">Tender {item}</CardTitle>
                        <Badge variant={item % 2 === 0 ? "default" : "secondary"}>
                          {item % 2 === 0 ? "Open" : "Draft"}
                        </Badge>
                      </div>
                      <CardDescription>
                        Tender description and brief details would appear here...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Submissions</span>
                          <span>{item * 3}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Budget</span>
                          <span>R {item * 500000}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Deadline</span>
                          <span>2024-02-{10 + item}</span>
                        </div>
                        <Button className="w-full mt-2" variant="outline">
                          {userRole === "procurement-officer" ? "Manage" : "View Details"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">
                    {userRole === "procurement-officer" ? "Submission Management" : "My Submissions"}
                  </h3>
                  <p className="text-muted-foreground">
                    {userRole === "procurement-officer" 
                      ? "Review and evaluate tender submissions" 
                      : "Track your tender applications and status"}
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>

              {/* Submissions List */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {userRole === "procurement-officer" ? "Recent Submissions" : "My Recent Submissions"}
                  </CardTitle>
                  <CardDescription>
                    {userRole === "procurement-officer" 
                      ? "Submissions requiring attention" 
                      : "Your recent tender applications"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {userRole === "procurement-officer" ? `Supplier ${item}` : `My Submission ${item}`}
                            </p>
                            <p className="text-sm text-muted-foreground">Tender: TND-2024-00{item}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary">
                                {userRole === "procurement-officer" ? "Under Review" : "Submitted"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">Submitted: 2024-01-{20 + item}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {userRole === "procurement-officer" ? (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">Evaluate</Button>
                          ) : (
                            <Button size="sm">Track</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Reports & Analytics</h3>
                  <p className="text-muted-foreground">Generate insights and performance reports</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <PieChart className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>

              {/* Report Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Tender Performance
                    </CardTitle>
                    <CardDescription>
                      Analysis of tender publication and success rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      View Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Supplier Analysis
                    </CardTitle>
                    <CardDescription>
                      Supplier participation and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      View Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      Financial Overview
                    </CardTitle>
                    <CardDescription>
                      Budget allocation and spending analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      View Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          {/* {userRole === "procurement-officer" && (
            <Card className="mt-8 bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Ready for detailed management?</h3>
                    <p className="text-green-700">
                      Access the full tender procurement dashboard with advanced features and comprehensive tools.
                    </p>
                  </div>
                  <Button onClick={handleNavigateToDashboard} className="bg-green-600 hover:bg-green-700">
                    Go to Full Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )} */}
        </div>
      </main>
    </div>
  )
}