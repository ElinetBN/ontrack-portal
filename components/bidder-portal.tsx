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

// Mock data
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
    title: "My Submissions",
    value: "5",
    change: "+2",
    description: "This quarter",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    title: "Pending Evaluation",
    value: "3",
    change: "-1",
    description: "Awaiting review",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    title: "Awarded Contracts",
    value: "2",
    change: "+1",
    description: "This year",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  }
]

const recentActivities = [
  {
    id: 1,
    type: "submission",
    title: "Submission sent",
    description: "IT Infrastructure Upgrade Project",
    time: "2 hours ago",
    status: "submitted"
  },
  {
    id: 2,
    type: "tender",
    title: "New tender available",
    description: "Office Furniture Supply",
    time: "4 hours ago",
    status: "new"
  },
  {
    id: 3,
    type: "evaluation",
    title: "Evaluation completed",
    description: "Cleaning Services tender",
    time: "1 day ago",
    status: "completed"
  },
  {
    id: 4,
    type: "contract",
    title: "Contract awarded",
    description: "Security Services - You won!",
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
    title: "Software Development",
    deadline: "2024-01-30",
    submissions: 8,
    status: "evaluation"
  },
  {
    id: 3,
    title: "Catering Services",
    deadline: "2024-02-28",
    submissions: 0,
    status: "draft"
  }
]

export function BidderPortal() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [applyingTender, setApplyingTender] = useState<string | null>(null)

  const mockTenders: Tender[] = [
    {
      id: "1",
      title: "IT Infrastructure Upgrade",
      description: "Comprehensive upgrade of IT infrastructure including servers, networking equipment, and security systems.",
      status: "open",
      budget: 1500000,
      deadline: "2024-02-15",
      submissions: 8,
      category: "Technology",
      publishedDate: "2024-01-15",
      requirements: ["ISO 27001 Certification", "5+ years experience", "Technical proposal"],
      contactPerson: "John Smith",
      contactEmail: "john.smith@company.com",
      documents: ["tender_doc_1.pdf", "technical_specs.pdf"]
    },
    {
      id: "2",
      title: "Office Furniture Supply",
      description: "Supply and installation of modern office furniture for new headquarters.",
      status: "open",
      budget: 500000,
      deadline: "2024-02-28",
      submissions: 12,
      category: "Furniture",
      publishedDate: "2024-01-20",
      requirements: ["Quality certification", "Environmental compliance", "Installation plan"],
      contactPerson: "Sarah Johnson",
      contactEmail: "sarah.j@company.com",
      documents: ["furniture_specs.pdf", "requirements.pdf"]
    },
    {
      id: "3",
      title: "Cleaning Services Contract",
      description: "Professional cleaning services for corporate offices on a monthly contract basis.",
      status: "open",
      budget: 300000,
      deadline: "2024-03-10",
      submissions: 5,
      category: "Services",
      publishedDate: "2024-01-25",
      requirements: ["Cleaning certification", "Staff training records", "Insurance coverage"],
      contactPerson: "Mike Brown",
      contactEmail: "mike.brown@company.com",
      documents: ["cleaning_contract.pdf", "specifications.pdf"]
    }
  ]

  // Fetch tenders from database
  const fetchTenders = async () => {
    setLoading(true)
    setError(null)
    try {
      // Replace with actual API endpoint
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
        console.warn('Unexpected API response structure, using mock data')
        setTenders(mockTenders)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tenders')
      console.error('Error fetching tenders:', err)
      setTenders(mockTenders)
    } finally {
      setLoading(false)
    }
  }

  // Handle browse tenders button click
  const handleBrowseTenders = () => {
    setActiveTab("tenders")
    fetchTenders()
  }

  // Handle apply for tender with loading state
  const handleApplyForTender = async (tenderId: string) => {
    setApplyingTender(tenderId)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      window.location.href = `/portals/tender-procurement/apply/${tenderId}`
    } catch (error) {
      console.error('Error applying for tender:', error)
      alert('Failed to apply for tender. Please try again.')
    } finally {
      setApplyingTender(null)
    }
  }

  // Handle view tender details
  const handleViewTenderDetails = (tenderId: string) => {
    window.location.href = `/portals/tender-procurement/tenders/${tenderId}`
  }

  // Handle download tender documents
  const handleDownloadDocuments = (tenderId: string, documentName: string) => {
    console.log(`Downloading ${documentName} for tender ${tenderId}`)
    alert(`Downloading ${documentName}...`)
  }

  const handleNavigateToSubmissions = () => {
    window.location.href = "/portals/tender-procurement/submissions"
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
      closed: "outline",
      submitted: "secondary"
    } as const

    const labels = {
      active: "Active",
      new: "New",
      completed: "Completed",
      awarded: "Awarded",
      open: "Open",
      evaluation: "Evaluation",
      draft: "Draft",
      closed: "Closed",
      submitted: "Submitted"
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

  // Check if tender deadline has passed
  const isTenderExpired = (deadline: string) => {
    return new Date(deadline) < new Date()
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
          Welcome back, Valued Bidder
        </h2>
        <p className="text-lg text-muted-foreground">
          Browse available tenders or track your submissions.
        </p>
      </div>

      {/* Main Action Cards */}
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
                <Button 
                  onClick={handleBrowseTenders}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                >
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
                <Button 
                  onClick={handleNavigateToSubmissions}
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                >
                  <BarChart className="mr-2 h-5 w-5" />
                  View My Submissions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="tenders" className="text-xs sm:text-sm">Available Tenders</TabsTrigger>
          <TabsTrigger value="submissions" className="text-xs sm:text-sm">My Submissions</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
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
                <CardDescription>Your submission deadlines</CardDescription>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Available Tenders</h3>
              <p className="text-muted-foreground">Browse and apply for open tenders</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search available tenders..." 
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
              {filteredTenders.map((tender) => {
                const isExpired = isTenderExpired(tender.deadline)
                const isApplying = applyingTender === tender.id
                
                return (
                  <Card key={tender.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{tender.title}</CardTitle>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(tender.status)}
                          {isExpired && (
                            <Badge variant="outline" className="text-red-600 border-red-300">
                              Expired
                            </Badge>
                          )}
                        </div>
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
                            disabled={isApplying}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleDownloadDocuments(tender.id, "Tender Documents")}
                            disabled={isApplying || isExpired}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Documents
                          </Button>
                          <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleApplyForTender(tender.id)}
                            disabled={isApplying || isExpired}
                          >
                            {isApplying ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Applying...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                {isExpired ? "Expired" : "Apply"}
                              </>
                            )}
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
                )
              })}
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
                    : "There are currently no tenders available."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">My Submissions</h3>
              <p className="text-muted-foreground">Track your tender applications and status</p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>

          {/* Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle>My Recent Submissions</CardTitle>
              <CardDescription>Your recent tender applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">My Submission {item}</p>
                        <p className="text-sm text-muted-foreground">Tender: TND-2024-00{item}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">Submitted</Badge>
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
                      <Button size="sm">Track</Button>
                    </div>
                  </div>
                ))}
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
                  Submission Performance
                </CardTitle>
                <CardDescription>
                  Analysis of your submission success rates
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
                  Market Analysis
                </CardTitle>
                <CardDescription>
                  Industry trends and competitor analysis
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
                  Budget analysis and ROI tracking
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