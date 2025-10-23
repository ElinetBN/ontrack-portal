// components/submission-card.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Eye, Star, MessageSquare } from "lucide-react"
import { Submission, Document } from "../types"
import { EvaluationPanel } from "./evaluation-panel"

interface SubmissionCardProps {
  submission: Submission
  tenderTitle: string
  onDocumentsUpdate: (submissionId: string, documents: Document[]) => void
  onReviewClick: (submission: Submission) => void
  onEvaluationSubmit?: (submissionId: string, score: number, status: string, comments: string) => Promise<void>
}

export function SubmissionCard({ 
  submission, 
  tenderTitle, 
  onDocumentsUpdate, 
  onReviewClick,
  onEvaluationSubmit 
}: SubmissionCardProps) {
  const [showEvaluation, setShowEvaluation] = useState(false)
  const [isSubmittingEvaluation, setIsSubmittingEvaluation] = useState(false)

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const handleEvaluationComplete = async (submissionId: string, score: number, status: string, comments: string) => {
    if (!onEvaluationSubmit) {
      console.error("onEvaluationSubmit callback not provided")
      return
    }

    setIsSubmittingEvaluation(true)
    try {
      await onEvaluationSubmit(submissionId, score, status, comments)
      setShowEvaluation(false)
    } catch (error) {
      console.error("Failed to submit evaluation:", error)
    } finally {
      setIsSubmittingEvaluation(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{tenderTitle}</CardTitle>
            <CardDescription>
              Submitted by {submission.companyName}
              {submission.applicationNumber && ` • Application #: ${submission.applicationNumber}`}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getStatusVariant(submission.status)}>
              {getStatusDisplayText(submission.status)}
            </Badge>
            {submission.score !== undefined && submission.score > 0 && (
              <Badge variant="outline" className={getScoreColor(submission.score)}>
                <Star className="h-3 w-3 mr-1" />
                {submission.score}%
              </Badge>
            )}
          </div>
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

        {/* Contact Information */}
        {(submission.contactPerson || submission.contactEmail) && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Contact Information</p>
            <div className="text-sm text-muted-foreground">
              {submission.contactPerson && <span>{submission.contactPerson}</span>}
              {submission.contactEmail && (
                <span className={submission.contactPerson ? "ml-2" : ""}>
                  {submission.contactPerson ? `(${submission.contactEmail})` : submission.contactEmail}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Last updated: {formatDate(submission.lastUpdated)}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEvaluation(!showEvaluation)}
            >
              <Star className="mr-2 h-4 w-4" />
              {showEvaluation ? 'Hide Evaluation' : 'Evaluate'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReviewClick(submission)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Review
            </Button>
          </div>
        </div>

        {/* Evaluation Panel */}
        {showEvaluation && (
          <div className="mt-4 border-t pt-4">
            <EvaluationPanel
              submission={submission}
              onEvaluationComplete={handleEvaluationComplete}
              isSubmitting={isSubmittingEvaluation}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}