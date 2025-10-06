"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  FileText,
  Building2,
  Bell,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  BarChart3,
} from "lucide-react"
import { logout } from "@/lib/auth"

// Mock data matching your main component structure
const initialSubmissions = [
  {
    id: 1,
    tenderId: 1,
    supplierName: "TechCorp Solutions",
    tenderTitle: "IT Infrastructure Upgrade Project",
    submissionDate: "2024-01-22",
    status: "under_review",
    documents: ["Proposal.pdf", "Technical_Specs.docx"],
    score: 85,
    evaluator: "John Smith"
  },
  {
    id: 2,
    tenderId: 2,
    supplierName: "OfficePro Supplies",
    tenderTitle: "Office Furniture Supply",
    submissionDate: "2024-01-20",
    status: "evaluated",
    documents: ["Quotation.pdf", "Catalog.zip"],
    score: 92,
    evaluator: "Sarah Johnson"
  },
  {
    id: 3,
    tenderId: 1,
    supplierName: "InnovateTech Ltd",
    tenderTitle: "IT Infrastructure Upgrade Project",
    submissionDate: "2024-01-21",
    status: "under_review",
    documents: ["Proposal.docx", "Pricing.xlsx"],
    score: 78,
    evaluator: "John Smith"
  },
  {
    id: 4,
    tenderId: 3,
    supplierName: "CleanSweep Services",
    tenderTitle: "Cleaning Services Contract",
    submissionDate: "2024-01-18",
    status: "rejected",
    documents: ["Service_Agreement.pdf"],
    score: 65,
    evaluator: "Mike Chen"
  },
  {
    id: 5,
    tenderId: 2,
    supplierName: "Furniture World",
    tenderTitle: "Office Furniture Supply",
    submissionDate: "2024-01-19",
    status: "evaluated",
    documents: ["Proposal.pdf", "Designs.zip"],
    score: 88,
    evaluator: "Sarah Johnson"
  }
]

// Change this to default export
export default function AllSubmissionsPage() {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter submissions based on search and status
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      under_review: { variant: "secondary" as const, label: "Under Review", icon: Clock },
      evaluated: { variant: "default" as const, label: "Evaluated", icon: CheckCircle },
      rejected: { variant: "destructive" as const, label: "Rejected", icon: AlertCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.under_review
    const IconComponent = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getStatusCounts = () => {
    const counts = {
      all: submissions.length,
      under_review: submissions.filter(s => s.status === "under_review").length,
      evaluated: submissions.filter(s => s.status === "evaluated").length,
      rejected: submissions.filter(s => s.status === "rejected").length
    }
    return counts
  }

  const statusCounts = getStatusCounts()

  const handleEvaluate = (submissionId: number) => {
    // Navigate to evaluation page or open evaluation modal
    console.log("Evaluate submission:", submissionId)
    // You can implement navigation to evaluation page here
    // window.location.href = `/portals/tender-procurement/evaluate/${submissionId}`
  }

  const handleViewDetails = (submissionId: number) => {
    // Navigate to submission details page
    console.log("View details for submission:", submissionId)
    // window.location.href = `/portals/tender-procurement/submissions/${submissionId}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="bg-primary p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">All Submissions</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  View and manage all tender submissions
                </p>
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
                <AvatarFallback className="text-xs sm:text-sm">PO</AvatarFallback>
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
          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">{statusCounts.all}</p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                    <p className="text-2xl font-bold">{statusCounts.under_review}</p>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Evaluated</p>
                    <p className="text-2xl font-bold">{statusCounts.evaluated}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold">{statusCounts.rejected}</p>
                  </div>
                  <div className="bg-red-100 p-2 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search submissions by supplier or tender..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="all">All Status</option>
                    <option value="under_review">Under Review</option>
                    <option value="evaluated">Evaluated</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  
                  <Button variant="outline" className="bg-transparent">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle>All Submissions ({filteredSubmissions.length})</CardTitle>
              <CardDescription>
                Manage and evaluate all tender submissions in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium">{submission.supplierName}</p>
                          {getStatusBadge(submission.status)}
                          {submission.score && (
                            <Badge variant="outline" className="bg-blue-50">
                              Score: {submission.score}/100
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Tender: {submission.tenderTitle}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Submitted: {new Date(submission.submissionDate).toLocaleDateString()}</span>
                          <span>Documents: {submission.documents.length}</span>
                          {submission.evaluator && (
                            <span>Evaluator: {submission.evaluator}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(submission.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {submission.status === "under_review" && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleEvaluate(submission.id)}
                        >
                          Evaluate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredSubmissions.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No submissions found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}