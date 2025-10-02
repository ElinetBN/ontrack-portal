import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Eye } from "lucide-react"
import { Submission, Tender } from "../types"
import { EvaluationPanel } from "./evaluation-panel"

interface EvaluationTabProps {
  submissions: Submission[]
  tenders: Tender[]
  onEvaluationComplete: (submissionId: string, score: number, status: string) => void
  onReviewClick: (submission: Submission) => void
}

export function EvaluationTab({ submissions, onEvaluationComplete, onReviewClick }: EvaluationTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Evaluation Center</h2>
        <p className="text-muted-foreground">
          Automated and manual evaluation tools for {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
        </p>
      </div>

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
                  <Input id="technical-weight" type="number" placeholder="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financial-weight">Financial Score Weight (%)</Label>
                  <Input id="financial-weight" type="number" placeholder="40" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluation-notes">Evaluation Notes</Label>
                <Textarea id="evaluation-notes" placeholder="Additional evaluation criteria and notes..." />
              </div>
              <Button className="hover:bg-blue-600 transition-colors">Save Criteria</Button>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Evaluation</CardTitle>
              <CardDescription>Evaluate submissions quickly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {submissions.filter(sub => sub.status === "Under Review").slice(0, 2).map((submission) => (
                <div key={submission.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-sm">{submission.supplier}</p>
                  <p className="text-xs text-muted-foreground">{submission.tenderId}</p>
                  <Button 
                    size="sm" 
                    className="w-full mt-2 hover:bg-blue-600 transition-colors"
                    onClick={() => onReviewClick(submission)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Evaluate Now
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automated Scoring</CardTitle>
            <CardDescription>AI-powered initial evaluation results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {submissions.filter(sub => sub.score && parseInt(sub.score) > 80).slice(0, 2).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium">{submission.supplier}</p>
                    <p className="text-sm text-muted-foreground">Technical compliance: {submission.score}%</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{submission.score}%</p>
                    <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Review Queue</CardTitle>
            <CardDescription>Submissions requiring manual evaluation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {submissions.filter(sub => sub.status === "Under Review").slice(0, 3).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium">{submission.supplier}</p>
                    <p className="text-sm text-muted-foreground">Pending {submission.tenderId.includes('IT') ? 'technical' : 'financial'} review</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-transparent hover:bg-gray-100 transition-colors"
                    onClick={() => onReviewClick(submission)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evaluation Panels for each submission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {submissions.slice(0, 2).map((submission) => (
          <EvaluationPanel
            key={submission.id}
            submission={submission}
            onEvaluationComplete={onEvaluationComplete}
          />
        ))}
      </div>
    </div>
  )
}