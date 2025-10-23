// components/submissions-tab.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Submission, Tender } from "../types"
import { SubmissionCard } from "./submission-card"
import { NotificationDialog } from "./notification-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  BarChart3,
  Mail,
  Send,
  FileWarning
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// API function to fetch submissions
async function fetchSubmissions(tenderId?: string, status?: string, page: number = 1, limit: number = 50) {
  try {
    const params = new URLSearchParams()
    if (tenderId) {
      params.append('tenderId', tenderId)
    }
    if (status) {
      params.append('status', status)
    }
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await fetch(`/api/tender-applications?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch submissions')
    }

    const result = await response.json()
    return result.success ? result : { data: [], pagination: { total: 0, pages: 0 } }
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return { data: [], pagination: { total: 0, pages: 0 } }
  }
}

interface SubmissionsTabProps {
  submissions: Submission[]
  tenders: Tender[]
  onDocumentsUpdate: (submissionId: string, documents: any[]) => void
  onReviewClick: (submission: Submission) => void
  onTenderCreate?: () => void
  onRefresh?: () => void
}

export function SubmissionsTab({ 
  submissions: initialSubmissions, 
  tenders, 
  onDocumentsUpdate, 
  onReviewClick,
  onTenderCreate,
  onRefresh
}: SubmissionsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tenderFilter, setTenderFilter] = useState("all")
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedSubmissions, setSelectedSubmissions] = useState<Submission[]>([])
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false)
  const [notificationType, setNotificationType] = useState<'all' | 'filtered' | 'selected'>('all')
  const [isSubmittingEvaluation, setIsSubmittingEvaluation] = useState(false)

  // Helper function to map API status to Submission status
  const mapStatus = (status: string): Submission['status'] => {
    const statusMap: { [key: string]: Submission['status'] } = {
      'submitted': 'submitted',
      'under_review': 'under_review',
      'evaluated': 'evaluated',
      'awarded': 'awarded',
      'rejected': 'rejected',
      'under review': 'under_review'
    }
    return statusMap[status] || 'submitted'
  }

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Helper function to map API submission to Submission type
  const mapApiSubmissionToSubmission = (sub: any): Submission => {
    // Get the tender title - handle both populated tender and tender ID
    let tenderTitle = 'Unknown Tender';
    if (sub.tender) {
      tenderTitle = typeof sub.tender === 'object' ? sub.tender.title : 'Tender';
    }

    // Get company name - handle both populated company and company object
    let companyName = 'Unknown Company';
    if (sub.company) {
      companyName = typeof sub.company === 'string' ? sub.company : sub.company.name;
    }

    // Map document status
    const documents = (sub.documents || []).map((doc: any) => ({
      id: doc._id || doc.id,
      name: doc.name || doc.filename,
      type: doc.type || 'document',
      url: doc.url || doc.path,
      uploadedAt: doc.uploadedAt || doc.createdAt,
      status: doc.status || 'uploaded',
      reviewedAt: doc.reviewedAt,
      notes: doc.notes
    }))

    return {
      id: sub._id || sub.id,
      tenderId: (typeof sub.tender === 'object' ? sub.tender._id : sub.tender) || sub.tenderId,
      supplier: companyName,
      company: companyName,
      proposal: sub.proposal?.title || sub.proposalTitle || 'No proposal title',
      amount: sub.financial?.totalBidAmount || sub.totalBidAmount || 0,
      documents: documents,
      status: mapStatus(sub.status),
      score: sub.score || 0,
      submittedAt: sub.submittedAt || sub.createdAt,
      evaluation: sub.evaluation || {},
      tenderTitle: tenderTitle,
      companyName: companyName,
      submissionDate: sub.submittedAt || sub.createdAt,
      submittedDate: sub.submittedAt || sub.createdAt,
      lastUpdated: sub.lastUpdated || sub.updatedAt || sub.submittedAt || sub.createdAt,
      bidAmount: formatCurrency(sub.financial?.totalBidAmount || sub.totalBidAmount || 0),
      notes: sub.notes,
      contactPerson: sub.contact?.person || sub.contactPerson,
      contactEmail: sub.contact?.email || sub.contactEmail,
      contactPhone: sub.contact?.phone || sub.contactPhone,
      applicationNumber: sub.applicationNumber,
      // Additional fields from your model that might be useful
      companyRegistration: sub.company?.registrationNumber,
      taxNumber: sub.company?.taxNumber,
      bbbeeStatus: sub.compliance?.bbbeeStatus,
      bbbeeLevel: sub.compliance?.bbbeeLevel,
      complianceStatus: sub.compliance?.taxCompliance ? 'compliant' : 'non-compliant'
    }
  }

  // Fetch submissions on component mount and when filters change
  useEffect(() => {
    const loadSubmissions = async () => {
      setLoading(true)
      try {
        const tenderId = tenderFilter !== 'all' ? tenderFilter : undefined
        const status = statusFilter !== 'all' ? statusFilter : undefined
        
        const result = await fetchSubmissions(tenderId, status)
        
        // Map API submissions to your Submission type using the helper function
        const mappedSubmissions: Submission[] = result.data.map(mapApiSubmissionToSubmission)
        setSubmissions(mappedSubmissions)
      } catch (error) {
        console.error('Error loading submissions:', error)
        // Fallback to initial submissions if API fails
        setSubmissions(initialSubmissions)
      } finally {
        setLoading(false)
      }
    }

    loadSubmissions()
  }, [statusFilter, tenderFilter, initialSubmissions])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const result = await fetchSubmissions()
      const mappedSubmissions: Submission[] = result.data.map(mapApiSubmissionToSubmission)
      setSubmissions(mappedSubmissions)
      onRefresh?.()
    } catch (error) {
      console.error('Error refreshing submissions:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Handle evaluation submission
  const handleEvaluationSubmit = async (submissionId: string, score: number, status: string, comments: string) => {
    setIsSubmittingEvaluation(true)
    try {
      console.log("Submitting evaluation:", { submissionId, score, status, comments })
      
      // Call API to update the evaluation
      const response = await fetch('/api/submissions/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          score,
          status,
          comments,
          evaluatedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit evaluation')
      }

      const result = await response.json()
      
      if (result.success) {
        // Update local state
        setSubmissions(prev => prev.map(sub => 
          sub.id === submissionId 
            ? { 
                ...sub, 
                score, 
                status: status as any,
                evaluation: {
                  ...sub.evaluation,
                  comments,
                  evaluatedAt: new Date().toISOString()
                }
              }
            : sub
        ))
        
        // Refresh the data
        await handleRefresh()
        
        console.log("Evaluation submitted successfully")
        return Promise.resolve()
      } else {
        throw new Error(result.error || 'Failed to submit evaluation')
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error)
      return Promise.reject(error)
    } finally {
      setIsSubmittingEvaluation(false)
    }
  }

  // Notification functions
  const handleNotifyAll = () => {
    setSelectedSubmissions(uniqueSubmissions)
    setNotificationType('all')
    setNotificationDialogOpen(true)
  }

  const handleNotifyFiltered = () => {
    setSelectedSubmissions(filteredSubmissions)
    setNotificationType('filtered')
    setNotificationDialogOpen(true)
  }

  const handleNotifyByStatus = (status: string) => {
    const statusSubmissions = uniqueSubmissions.filter(sub => sub.status === status)
    setSelectedSubmissions(statusSubmissions)
    setNotificationType('selected')
    setNotificationDialogOpen(true)
  }

  const handleNotifyMissingDocuments = () => {
    const missingDocsSubmissions = uniqueSubmissions.filter(sub => 
      sub.documents && sub.documents.some(doc => doc.status === 'missing' || doc.status === 'rejected')
    )
    setSelectedSubmissions(missingDocsSubmissions)
    setNotificationType('selected')
    setNotificationDialogOpen(true)
  }

  const handleNotifyApplicants = () => {
    setSelectedSubmissions(uniqueSubmissions)
    setNotificationDialogOpen(true)
  }

  const getStatusIcon = (status: Submission['status']) => {
    switch (status) {
      case 'submitted':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'under_review':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'evaluated':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'awarded':
        return <Award className="h-4 w-4 text-purple-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: Submission['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'evaluated':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'awarded':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const { uniqueSubmissions, filteredSubmissions, submissionStats } = useMemo(() => {
    // Step 1: Get all valid tender IDs
    const validTenderIds = new Set(tenders.map(tender => tender.id))
    
    // Step 2: Remove duplicate submissions and filter by valid tenders
    const seenSubmissionIds = new Set()
    const uniqueSubmissions = submissions.filter(submission => {
      // Remove duplicates by ID
      if (seenSubmissionIds.has(submission.id)) {
        return false
      }
      seenSubmissionIds.add(submission.id)
      
      // Only include submissions for existing tenders
      return validTenderIds.has(submission.tenderId)
    })
    
    // Step 3: Apply search filter
    const filteredSubmissions = searchTerm.trim() === "" 
      ? uniqueSubmissions 
      : uniqueSubmissions.filter(submission =>
          submission.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.tenderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.tenderTitle?.toLowerCase().includes(searchTerm.toLowerCase())
        )

    // Step 4: Calculate statistics
    const total = uniqueSubmissions.length
    const submitted = uniqueSubmissions.filter(sub => sub.status === "submitted").length
    const underReview = uniqueSubmissions.filter(sub => sub.status === "under_review").length
    const evaluated = uniqueSubmissions.filter(sub => sub.status === "evaluated").length
    const awarded = uniqueSubmissions.filter(sub => sub.status === "awarded").length
    const rejected = uniqueSubmissions.filter(sub => sub.status === "rejected").length
    const withMissingDocs = uniqueSubmissions.filter(sub => 
      sub.documents && sub.documents.some(doc => doc.status === 'missing' || doc.status === 'rejected')
    ).length

    const submissionStats = {
      total,
      submitted,
      underReview,
      evaluated,
      awarded,
      rejected,
      withMissingDocs,
      compliant: evaluated + awarded // Consider evaluated and awarded as compliant
    }

    return { 
      uniqueSubmissions, 
      filteredSubmissions, 
      submissionStats 
    }
  }, [submissions, tenders, searchTerm])

  const hasTenders = tenders.length > 0
  const hasSubmissions = uniqueSubmissions.length > 0

  // Get tender title for display
  const getTenderTitle = (tenderId: string) => {
    const tender = tenders.find(t => t.id === tenderId)
    return tender ? tender.title : tenderId
  }

  // Get current tender title for notifications
  const getCurrentTenderTitle = () => {
    if (tenderFilter !== 'all') {
      const tender = tenders.find(t => t.id === tenderFilter)
      return tender?.title || 'Selected Tender'
    }
    return 'All Tenders'
  }

  // Export submissions as CSV
  const exportSubmissions = () => {
    const headers = [
      'Application Number',
      'Tender', 
      'Supplier', 
      'Company', 
      'Contact Person',
      'Contact Email',
      'Bid Amount', 
      'Status', 
      'Submitted Date',
      'Score',
      'BBBEE Status',
      'BBBEE Level',
      'Missing Documents'
    ]
    
    const csvData = uniqueSubmissions.map(sub => {
      const missingDocs = sub.documents?.filter(doc => doc.status === 'missing' || doc.status === 'rejected')
        .map(doc => doc.name).join('; ') || 'None'
      
      return [
        sub.applicationNumber || sub.id,
        getTenderTitle(sub.tenderId),
        sub.supplier,
        sub.companyName || sub.company,
        sub.contactPerson || 'N/A',
        sub.contactEmail || 'N/A',
        sub.bidAmount || `R ${sub.amount?.toLocaleString()}`,
        sub.status.replace('_', ' ').toUpperCase(),
        new Date(sub.submittedAt).toLocaleDateString(),
        sub.score?.toString() || 'N/A',
        sub.bbbeeStatus || 'N/A',
        sub.bbbeeLevel || 'N/A',
        missingDocs
      ]
    })

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Submission Management</h2>
            <p className="text-muted-foreground">Loading submissions...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading submissions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Submission Management</h2>
          <p className="text-muted-foreground">
            Review and manage {uniqueSubmissions.length} submission{uniqueSubmissions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Notification Button */}
          {hasSubmissions && (
            <Button 
              variant="outline"
              onClick={handleNotifyApplicants}
            >
              <Mail className="h-4 w-4 mr-2" />
              Notify Applicants
            </Button>
          )}
          
          {/* Notification Dropdown (Alternative) */}
          {hasSubmissions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Quick Notify
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleNotifyAll}>
                  <Mail className="h-4 w-4 mr-2" />
                  Notify All Applicants ({uniqueSubmissions.length})
                </DropdownMenuItem>
                {filteredSubmissions.length !== uniqueSubmissions.length && (
                  <DropdownMenuItem onClick={handleNotifyFiltered}>
                    <Filter className="h-4 w-4 mr-2" />
                    Notify Filtered ({filteredSubmissions.length})
                  </DropdownMenuItem>
                )}
                {submissionStats.withMissingDocs > 0 && (
                  <DropdownMenuItem onClick={handleNotifyMissingDocuments}>
                    <FileWarning className="h-4 w-4 mr-2 text-amber-500" />
                    Notify Missing Documents ({submissionStats.withMissingDocs})
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleNotifyByStatus('submitted')}>
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  Notify Submitted ({submissionStats.submitted})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNotifyByStatus('under_review')}>
                  <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                  Notify Under Review ({submissionStats.underReview})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNotifyByStatus('awarded')}>
                  <Award className="h-4 w-4 mr-2 text-purple-500" />
                  Notify Awarded ({submissionStats.awarded})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNotifyByStatus('rejected')}>
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  Notify Rejected ({submissionStats.rejected})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <Loader2 className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {hasSubmissions && (
            <Button variant="outline" onClick={exportSubmissions}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
          {hasTenders && onTenderCreate && (
            <Button onClick={onTenderCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Tender
            </Button>
          )}
        </div>
      </div>

      {/* Submission Statistics */}
      {hasSubmissions && (
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{submissionStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{submissionStats.submitted}</p>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{submissionStats.underReview}</p>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{submissionStats.evaluated}</p>
                  <p className="text-sm text-muted-foreground">Evaluated</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{submissionStats.awarded}</p>
                  <p className="text-sm text-muted-foreground">Awarded</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Award className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{submissionStats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
                <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          {submissionStats.withMissingDocs > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-amber-600">{submissionStats.withMissingDocs}</p>
                    <p className="text-sm text-muted-foreground">Missing Docs</p>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-full">
                    <FileWarning className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Search and Filter */}
      {hasSubmissions && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search submissions by supplier, tender ID, application number, or status..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="evaluated">Evaluated</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tenderFilter} onValueChange={setTenderFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenders</SelectItem>
                {tenders.map(tender => (
                  <SelectItem key={tender.id} value={tender.id}>
                    {tender.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      )}

      {/* Submissions List */}
      <div className="space-y-4">
        {hasTenders ? (
          hasSubmissions ? (
            filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <SubmissionCard 
                  key={submission.id} 
                  submission={submission}
                  tenderTitle={getTenderTitle(submission.tenderId)}
                  onDocumentsUpdate={onDocumentsUpdate}
                  onReviewClick={onReviewClick}
                  onEvaluationSubmit={handleEvaluationSubmit}
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Submissions Found</h3>
                  <p className="text-muted-foreground">
                    No submissions match your search criteria. Try adjusting your filters.
                  </p>
                </CardContent>
              </Card>
            )
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
                <p className="text-muted-foreground mb-4">
                  When suppliers submit bids for your tenders, they will appear here for review.
                </p>
                <p className="text-sm text-muted-foreground">
                  Make sure your tenders are published and shared with suppliers to start receiving submissions.
                </p>
              </CardContent>
            </Card>
          )
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Tenders or Submissions</h3>
              <p className="text-muted-foreground mb-4">
                Create your first tender to start receiving submissions from suppliers.
              </p>
              {onTenderCreate && (
                <Button onClick={onTenderCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Tender
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Submission Status Summary */}
      {hasSubmissions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Submission Status Overview
            </CardTitle>
            <CardDescription>Current status distribution of all submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: "Submitted", count: submissionStats.submitted, color: "bg-gray-500" },
                { status: "Under Review", count: submissionStats.underReview, color: "bg-yellow-500" },
                { status: "Evaluated", count: submissionStats.evaluated, color: "bg-green-500" },
                { status: "Awarded", count: submissionStats.awarded, color: "bg-purple-500" },
                { status: "Rejected", count: submissionStats.rejected, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">{item.status}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.count} ({submissionStats.total > 0 ? Math.round((item.count / submissionStats.total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ 
                        width: `${submissionStats.total > 0 ? (item.count / submissionStats.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Dialog */}
      <NotificationDialog
        isOpen={notificationDialogOpen}
        onClose={() => setNotificationDialogOpen(false)}
        submissions={selectedSubmissions}
        tenderTitle={getCurrentTenderTitle()}
        onSubmissionsSelect={setSelectedSubmissions}
      />
    </div>
  )
}