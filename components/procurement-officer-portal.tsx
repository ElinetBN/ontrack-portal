"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Users,
  Building2,
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
  Loader2,
} from "lucide-react"

// Types for tender data
interface Tender {
  id: string
  title: string
  description: string
  status: string
  budget: number
  deadline: string
  submissions: number
  category: string
  publishedDate: string
  requirements: string[]
  contactPerson: string
  contactEmail: string
  documents: string[]
}

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

export function ProcurementOfficerPortal() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [showTenderRegistration, setShowTenderRegistration] = useState(false)
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch tenders from database
  const fetchTenders = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/tenders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tenders')
      }

      const data = await response.json()
      
      if (Array.isArray(data)) {
        setTenders(data)
      } else if (data && Array.isArray(data.tenders)) {
        setTenders(data.tenders)
      } else if (data && Array.isArray(data.data)) {
        setTenders(data.data)
      } else {
        console.warn('Unexpected API response structure')
        setTenders([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tenders')
      console.error('Error fetching tenders:', err)
      setTenders([])
    } finally {
      setLoading(false)
    }
  }

  const handleBrowseTenders = () => {
    setActiveTab("tenders")
    fetchTenders()
  }

  const handleViewTenderDetails = (tenderId: string) => {
    window.location.href = `/portals/tender-procurement/tenders/${tenderId}`
  }

  const handleNavigateToSubmissions = () => {
    window.location.href = "/portals/tender-procurement/submissions"
  }

  const handleStartTenderRegistration = () => {
    setShowTenderRegistration(true)
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
      draft: "outline",
      closed: "outline"
    } as const

    const labels = {
      active: "Active",
      new: "New",
      completed: "Completed",
      awarded: "Awarded",
      open: "Open",
      evaluation: "Evaluation",
      draft: "Draft",
      closed: "Closed"
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Filter tenders based on search term
  const filteredTenders = Array.isArray(tenders) ? tenders.filter(tender =>
    tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back, Procurement Officer
        </h2>
        <p className="text-lg text-muted-foreground">
          Choose your action to manage tenders or evaluate submissions.
        </p>
      </div>

      {/* Main Action Cards */}
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

      {/* Tender Registration Progress (Only when active) */}
      {showTenderRegistration && (
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
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="tenders" className="text-xs sm:text-sm">My Tenders</TabsTrigger>
          <TabsTrigger value="submissions" className="text-xs sm:text-sm">Submissions</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity - Will be populated by API data */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and actions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Recent activity will appear here</p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines - Will be populated by API data */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Tenders closing soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upcoming deadlines will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tenders Tab */}
        <TabsContent value="tenders" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Tender Management</h3>
              <p className="text-muted-foreground">Create and manage tender opportunities</p>
            </div>
            <Button onClick={handleStartTenderRegistration} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Tender
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search my tenders..." 
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="bg-transparent w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading tenders...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <p>Error loading tenders: {error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tenders Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTenders.map((tender) => (
                <Card key={tender.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{tender.title}</CardTitle>
                      {getStatusBadge(tender.status)}
                    </div>
                    <CardDescription className="line-clamp-2">{tender.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span>{tender.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Budget</span>
                        <span>{formatCurrency(tender.budget)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Submissions</span>
                        <span>{tender.submissions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Deadline</span>
                        <span>{new Date(tender.deadline).toLocaleDateString()}</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleViewTenderDetails(tender.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <BarChart className="mr-2 h-4 w-4" />
                          Evaluate
                        </Button>
                      </div>

                      {/* Requirements Preview */}
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Key Requirements:</p>
                        <div className="flex flex-wrap gap-1">
                          {tender.requirements.slice(0, 2).map((req, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {tender.requirements.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{tender.requirements.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredTenders.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tenders Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? "No tenders match your search criteria. Try adjusting your search terms."
                    : "You haven't created any tenders yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Submission Management</h3>
              <p className="text-muted-foreground">Review and evaluate tender submissions</p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>

          {/* Submissions List - Will be populated by API data */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Submissions requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Submissions will appear here once available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Reports & Analytics</h3>
              <p className="text-muted-foreground">Generate insights and performance reports</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
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
    </>
  )
}