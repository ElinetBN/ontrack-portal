// components/evaluation-panel.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Submission } from "../types"

interface EvaluationPanelProps {
  submission: Submission
  onEvaluationComplete: (submissionId: string, score: number, status: string, comments: string) => void
  isSubmitting?: boolean
}

export function EvaluationPanel({ submission, onEvaluationComplete, isSubmitting = false }: EvaluationPanelProps) {
  const [score, setScore] = useState<number>(submission.score || 0)
  const [comments, setComments] = useState(submission.evaluation?.comments || "")
  const [status, setStatus] = useState(submission.status || "under_review")
  const [isDirty, setIsDirty] = useState(false)

  // Initialize form with submission data
  useEffect(() => {
    setScore(submission.score || 0)
    setComments(submission.evaluation?.comments || "")
    setStatus(submission.status || "under_review")
    setIsDirty(false)
  }, [submission])

  // Track form changes
  useEffect(() => {
    const initialScore = submission.score || 0
    const initialComments = submission.evaluation?.comments || ""
    const initialStatus = submission.status || "under_review"

    setIsDirty(
      score !== initialScore ||
      comments !== initialComments ||
      status !== initialStatus
    )
  }, [score, comments, status, submission])

  const handleSubmitEvaluation = async () => {
    if (!isDirty && submission.status !== "under_review") {
      console.log("No changes detected")
      return
    }

    try {
      await onEvaluationComplete(submission.id, score, status, comments)
      setIsDirty(false)
    } catch (error) {
      console.error("Failed to submit evaluation:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'evaluated':
        return 'bg-green-100 text-green-800'
      case 'awarded':
        return 'bg-purple-100 text-purple-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const canSubmit = isDirty && !isSubmitting

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Evaluation Panel</span>
          <Badge variant="outline" className={getStatusColor(status)}>
            {status.replace('_', ' ').toUpperCase()}
          </Badge>
        </CardTitle>
        <CardDescription>
          Evaluate submission from {submission.supplier} for {submission.tenderTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Submission Overview */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium">Supplier</p>
            <p className="text-sm text-muted-foreground">{submission.supplier}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Bid Amount</p>
            <p className="text-sm text-muted-foreground">{submission.bidAmount}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Application #</p>
            <p className="text-sm text-muted-foreground">{submission.applicationNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Current Score</p>
            <p className={`text-sm font-bold ${getScoreColor(submission.score || 0)}`}>
              {submission.score || 0}%
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Score Input */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="score" className="text-sm font-medium">
                Evaluation Score
              </Label>
              <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                {score}%
              </span>
            </div>
            <Input
              id="score"
              type="range"
              min="0"
              max="100"
              step="5"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Evaluation Status
            </Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="under_review">Under Review</option>
              <option value="evaluated">Evaluated</option>
              <option value="awarded">Awarded</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Comments */}
          <div>
            <Label htmlFor="comments" className="text-sm font-medium">
              Evaluation Comments & Notes
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide detailed evaluation comments, strengths, weaknesses, and recommendations..."
              rows={6}
              className="mt-1 resize-vertical"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comments.length}/1000 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleSubmitEvaluation}
              disabled={!canSubmit}
              className="w-full hover:bg-green-600 transition-colors"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Evaluation...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Evaluation
                </>
              )}
            </Button>

            {!isDirty && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-700">
                  No changes detected. Modify the score, status, or comments to submit evaluation.
                </p>
              </div>
            )}

            {isDirty && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-700">
                  You have unsaved changes. Click "Submit Evaluation" to save your changes.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}