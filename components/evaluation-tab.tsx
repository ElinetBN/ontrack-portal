"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Eye, FileText, User, Building, Award, Calendar } from "lucide-react"
import { Submission, Tender } from "../types"
import { EvaluationPanel } from "./evaluation-panel"

interface EvaluationTabProps {
  submissions: Submission[]
  tenders: Tender[]
  onEvaluationComplete: (submissionId: string, score: number, status: string) => void
  onReviewClick: (submission: Submission) => void
  userRole: 'admin' | 'super_admin' | 'user'
  selectedSubmission?: Submission | null
}

export function EvaluationTab({ 
  submissions, 
  tenders, 
  onEvaluationComplete, 
  onReviewClick, 
  userRole,
  selectedSubmission 
}: EvaluationTabProps) {
  const [technicalWeight, setTechnicalWeight] = useState(60)
  const [financialWeight, setFinancialWeight] = useState(40)
  const [evaluationNotes, setEvaluationNotes] = useState("")
  const [highlightedSubmission, setHighlightedSubmission] = useState<Submission | null>(null)

  // Set highlighted submission when selectedSubmission changes
  useEffect(() => {
    if (selectedSubmission) {
      setHighlightedSubmission(selectedSubmission)
      // Scroll to the evaluation panel for this submission
      const element = document.getElementById(`submission-${selectedSubmission.id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Add highlight effect
        element.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50')
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50')
        }, 3000)
      }
    }
  }, [selectedSubmission])

  const handleSaveCriteria = () => {
    console.log('Saving evaluation criteria:', {
      technicalWeight,
      financialWeight,
      evaluationNotes
    })
    // Here you would typically save to your backend
    alert('Evaluation criteria saved successfully!')
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Filter submissions by status
  const underReviewSubmissions = submissions.filter(sub => sub.status === "under_review")
  const evaluatedSubmissions = submissions.filter(sub => sub.status === "evaluated")
  const highScoreSubmissions = submissions.filter(sub => sub.score && sub.score > 80)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Evaluation Center</h2>
        <p className="text-muted-foreground">
          Automated and manual evaluation tools for {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
          {highlightedSubmission && (
            <span className="ml-2 text-blue-600 font-medium">
              • Currently evaluating: {highlightedSubmission.companyName}
            </span>
          )}
        </p>
      </div>

      {/* Selected Submission Banner */}
      {highlightedSubmission && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Currently Evaluating</h3>
                  <p className="text-blue-700">
                    {highlightedSubmission.companyName} - {highlightedSubmission.tenderTitle}
                  </p>
                  <p className="text-sm text-blue-600">
                    Submitted on {formatDate(highlightedSubmission.submissionDate)} • 
                    Application #{highlightedSubmission.applicationNumber || 'N/A'}
                  </p>
                </div>
              </div>
              <Badge variant={getStatusVariant(highlightedSubmission.status)}>
                {getStatusDisplayText(highlightedSubmission.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evaluation Criteria Setup */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria Setup</CardTitle>
              <CardDescription>Configure evaluation parameters for tender assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technical-weight">Technical Score Weight (%)</Label>
                  <Input 
                    id="technical-weight" 
                    type="number" 
                    placeholder="60" 
                    value={technicalWeight}
                    onChange={(e) => setTechnicalWeight(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financial-weight">Financial Score Weight (%)</Label>
                  <Input 
                    id="financial-weight" 
                    type="number" 
                    placeholder="40" 
                    value={financialWeight}
                    onChange={(e) => setFinancialWeight(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              {/* Total weight indicator */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Weight:</span>
                  <span className={`font-bold ${technicalWeight + financialWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {technicalWeight + financialWeight}%
                  </span>
                </div>
                {technicalWeight + financialWeight !== 100 && (
                  <p className="text-sm text-red-600 mt-1">
                    Total weight must equal 100%
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="evaluation-notes">Evaluation Notes</Label>
                <Textarea 
                  id="evaluation-notes" 
                  placeholder="Additional evaluation criteria and notes..." 
                  value={evaluationNotes}
                  onChange={(e) => setEvaluationNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleSaveCriteria}
                disabled={technicalWeight + financialWeight !== 100}
                className="hover:bg-blue-600 transition-colors"
              >
                Save Criteria
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Evaluation Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Evaluation</CardTitle>
              <CardDescription>Evaluate submissions quickly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {underReviewSubmissions.slice(0, 3).map((submission) => (
                <div key={submission.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{submission.companyName}</p>
                      <p className="text-xs text-muted-foreground">{submission.tenderTitle}</p>
                    </div>
                    <Badge variant={getStatusVariant(submission.status)} className="text-xs">
                      {getStatusDisplayText(submission.status)}
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full mt-2 hover:bg-blue-600 transition-colors"
                    onClick={() => {
                      setHighlightedSubmission(submission)
                      onReviewClick(submission)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Evaluate Now
                  </Button>
                </div>
              ))}
              {underReviewSubmissions.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">
                  No submissions under review
                </p>
              )}
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Stats</CardTitle>
              <CardDescription>Current evaluation progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Under Review:</span>
                <Badge variant="secondary">{underReviewSubmissions.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Evaluated:</span>
                <Badge variant="default">{evaluatedSubmissions.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">High Scores (80+):</span>
                <Badge variant="default">{highScoreSubmissions.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Submissions:</span>
                <Badge variant="outline">{submissions.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automated Scoring */}
        <Card>
          <CardHeader>
            <CardTitle>Automated Scoring</CardTitle>
            <CardDescription>AI-powered initial evaluation results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {highScoreSubmissions.slice(0, 3).map((submission) => (
                <div 
                  key={submission.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setHighlightedSubmission(submission)}
                >
                  <div>
                    <p className="font-medium">{submission.companyName}</p>
                    <p className="text-sm text-muted-foreground">
                      {submission.tenderTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Score: {submission.score}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{submission.score}%</p>
                    <CheckCircle className="h-4 w-4 text-green-600 ml-auto mt-1" />
                  </div>
                </div>
              ))}
              {highScoreSubmissions.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">
                  No high-scoring submissions yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Manual Review Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Review Queue</CardTitle>
            <CardDescription>Submissions requiring manual evaluation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {underReviewSubmissions.slice(0, 4).map((submission) => (
                <div 
                  key={submission.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setHighlightedSubmission(submission)}
                >
                  <div>
                    <p className="font-medium">{submission.companyName}</p>
                    <p className="text-sm text-muted-foreground">
                      {submission.tenderTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {formatDate(submission.submissionDate)}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-transparent hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onReviewClick(submission)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Review
                  </Button>
                </div>
              ))}
              {underReviewSubmissions.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">
                  No submissions in review queue
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evaluation Panels for each submission */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Detailed Evaluation Panels</CardTitle>
            <CardDescription>
              Complete evaluation forms for each submission. {highlightedSubmission && (
                <span className="text-blue-600">
                  Currently selected: {highlightedSubmission.companyName}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {submissions.slice(0, 4).map((submission) => (
                <div 
                  key={submission.id} 
                  id={`submission-${submission.id}`}
                  className={`transition-all duration-300 ${
                    highlightedSubmission?.id === submission.id ? 'ring-2 ring-blue-500 rounded-lg' : ''
                  }`}
                >
                  <EvaluationPanel
                    submission={submission}
                    onEvaluationComplete={onEvaluationComplete}
                    isHighlighted={highlightedSubmission?.id === submission.id}
                  />
                </div>
              ))}
            </div>
            
            {submissions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No submissions to evaluate</h3>
                <p className="text-muted-foreground mt-2">
                  Submissions will appear here once applicants submit their proposals.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Role Information */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Evaluator Role</p>
                <p className="text-sm text-muted-foreground">
                  {userRole === 'super_admin' ? 'Super Administrator' : 
                   userRole === 'admin' ? 'Administrator' : 'Evaluator'}
                </p>
              </div>
            </div>
            <Badge variant={userRole === 'super_admin' ? 'default' : 'secondary'}>
              {userRole}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}