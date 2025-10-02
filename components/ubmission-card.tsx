import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Building2, Eye } from "lucide-react"
import { Submission } from "../types"
import { DocumentManagementSection } from "./document-management-section"

interface SubmissionCardProps {
  submission: Submission
  onDocumentsUpdate: (submissionId: string, documents: any[]) => void
  onReviewClick: (submission: Submission) => void
}

export function SubmissionCard({ 
  submission, 
  onDocumentsUpdate,
  onReviewClick
}: SubmissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{submission.supplier}</CardTitle>
              <Badge
                variant={
                  submission.status === "Under Review"
                    ? "secondary"
                    : submission.status === "Evaluated"
                      ? "default"
                      : "outline"
                }
              >
                {submission.status}
              </Badge>
            </div>
            <CardDescription>
              Tender: {submission.tenderId} • Submitted: {submission.submittedDate}
            </CardDescription>
          </div>
          {submission.score && (
            <div className="text-right">
              <p className="text-2xl font-bold">{submission.score}%</p>
              <p className="text-sm text-muted-foreground">Evaluation Score</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submission.score && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Evaluation Progress</span>
                <span>{submission.score}%</span>
              </div>
              <Progress value={parseInt(submission.score)} className="h-2" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {submission.documents?.length || 0} documents
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {submission.supplier}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent hover:bg-gray-100 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Hide" : "Manage"} Documents
              </Button>
              <Button 
                size="sm" 
                onClick={() => onReviewClick(submission)}
                className="hover:bg-blue-600 transition-colors"
              >
                <Eye className="mr-2 h-4 w-4" />
                Review
              </Button>
            </div>
          </div>

          {/* Expandable Document Management Section */}
          {isExpanded && (
            <div className="border-t pt-4 mt-4">
              <DocumentManagementSection 
                submission={submission}
                onDocumentsUpdate={onDocumentsUpdate}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}