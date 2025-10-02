import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
import { Submission } from "../types"

interface EvaluationPanelProps {
  submission: Submission
  onEvaluationComplete: (submissionId: string, score: number, status: string) => void
}

export function EvaluationPanel({ submission, onEvaluationComplete }: EvaluationPanelProps) {
  const [score, setScore] = useState(submission.score ? parseInt(submission.score) : 0)
  const [comments, setComments] = useState("")
  const [status, setStatus] = useState(submission.status || "Under Review")

  const handleSubmitEvaluation = () => {
    onEvaluationComplete(submission.id, score, status)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation Panel - {submission.supplier}</CardTitle>
        <CardDescription>Evaluate this submission and provide feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="score" className="text-sm font-medium">
              Evaluation Score: {score}%
            </Label>
            <Input
              id="score"
              type="range"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <select
              id="status"
              className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Under Review">Under Review</option>
              <option value="Evaluated">Evaluated</option>
              <option value="Recommended">Recommended</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <Label htmlFor="comments" className="text-sm font-medium">
              Evaluation Comments
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide detailed evaluation comments..."
              rows={4}
              className="mt-1"
            />
          </div>

          <Button 
            onClick={handleSubmitEvaluation}
            className="w-full hover:bg-green-600 transition-colors"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Submit Evaluation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}