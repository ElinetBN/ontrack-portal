import { Submission, Tender } from "../types"
import { SubmissionCard } from "./submission-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

interface SubmissionsTabProps {
  submissions: Submission[]
  tenders: Tender[]
  onDocumentsUpdate: (submissionId: string, documents: any[]) => void
  onReviewClick: (submission: Submission) => void
  onTenderCreate?: () => void
}

export function SubmissionsTab({ 
  submissions, 
  tenders, 
  onDocumentsUpdate, 
  onReviewClick,
  onTenderCreate 
}: SubmissionsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  // CRITICAL FIX: Ensure submissions are unique and only for existing tenders
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
          submission.status.toLowerCase().includes(searchTerm.toLowerCase())
        )

    // Step 4: Calculate statistics
    const submissionStats = {
      total: uniqueSubmissions.length,
      underReview: uniqueSubmissions.filter(sub => sub.status === "Under Review").length,
      evaluated: uniqueSubmissions.filter(sub => sub.status === "Evaluated").length,
      compliant: uniqueSubmissions.filter(sub => sub.status === "Compliant").length
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Submission Management</h2>
          <p className="text-muted-foreground">
            Review and manage {uniqueSubmissions.length} submission{uniqueSubmissions.length !== 1 ? 's' : ''}
          </p>
        </div>
        {hasTenders && (
          <Button onClick={onTenderCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Tender
          </Button>
        )}
      </div>

      {/* Submission Statistics - Only show when there are submissions */}
      {hasSubmissions && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{submissionStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
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
                  <p className="text-2xl font-bold">{submissionStats.underReview}</p>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-yellow-600" />
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
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{submissionStats.compliant}</p>
                  <p className="text-sm text-muted-foreground">Compliant</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter - Only show when there are submissions */}
      {hasSubmissions && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search submissions by supplier, tender ID, or status..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
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
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No submissions found matching your search criteria.</p>
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
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Tender
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Submission Status Summary - Only show when there are submissions */}
      {hasSubmissions && (
        <Card>
          <CardHeader>
            <CardTitle>Submission Status Overview</CardTitle>
            <CardDescription>Current status distribution of all submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries({
                "Under Review": submissionStats.underReview,
                "Evaluated": submissionStats.evaluated,
                "Compliant": submissionStats.compliant,
                "Other": submissionStats.total - submissionStats.underReview - submissionStats.evaluated - submissionStats.compliant
              }).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{status}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${submissionStats.total > 0 ? (count / submissionStats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}