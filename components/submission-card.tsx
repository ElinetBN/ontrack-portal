import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Eye, Calendar } from "lucide-react"
import { Submission } from "../types"

interface SubmissionCardProps {
  submission: Submission
  onDocumentsUpdate: (submissionId: string, documents: any[]) => void
  onReviewClick: (submission: Submission) => void
}

export function SubmissionCard({ submission, onDocumentsUpdate, onReviewClick }: SubmissionCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Submitted": return "secondary"
      case "Under Review": return "default"
      case "Approved": return "default"
      case "Rejected": return "destructive"
      case "Needs Revision": return "outline"
      default: return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{submission.tenderTitle}</CardTitle>
            <CardDescription>
              Submitted by {submission.companyName}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(submission.status)}>
            {submission.status}
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

        {submission.notes && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              <strong>Notes:</strong> {submission.notes}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {submission.documents?.map((doc, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md text-sm">
              <FileText className="h-3 w-3" />
              <span>{doc.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-200"
                onClick={() => window.open(doc.url, '_blank')}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Last updated: {formatDate(submission.lastUpdated)}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDocumentsUpdate(submission.id, submission.documents || [])}
            >
              <FileText className="mr-2 h-4 w-4" />
              Manage Documents
            </Button>
            <Button
              size="sm"
              onClick={() => onReviewClick(submission)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}