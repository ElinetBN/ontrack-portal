// components/submission-card.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Eye } from "lucide-react"
import { Submission, Document } from "../types"

interface SubmissionCardProps {
  submission: Submission
  onDocumentsUpdate: (submissionId: string, documents: Document[]) => void
  onReviewClick: (submission: Submission) => void
}

export function SubmissionCard({ submission, onReviewClick }: SubmissionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "submitted": return "secondary"
      case "under_review": return "default"
      case "evaluated": return "default"
      case "awarded": return "default"
      case "rejected": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusDisplayText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'submitted': 'Submitted',
      'under_review': 'Under Review',
      'evaluated': 'Evaluated',
      'awarded': 'Awarded',
      'rejected': 'Rejected'
    }
    return statusMap[status] || status
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{submission.tenderTitle}</CardTitle>
            <CardDescription>
              Submitted by {submission.companyName}
              {submission.applicationNumber && ` • Application #: ${submission.applicationNumber}`}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(submission.status)}>
            {getStatusDisplayText(submission.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Submitted: {formatDate(submission.submissionDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Documents: {submission.documents?.length || 0}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Bid Amount: {submission.bidAmount}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Last updated: {formatDate(submission.lastUpdated)}</span>
          </div>
          <div className="flex gap-2">
            <button 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              onClick={() => onReviewClick(submission)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Review
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}