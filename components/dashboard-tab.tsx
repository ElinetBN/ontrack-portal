import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tender, Submission } from "../types"
import { StatsCards } from "./stats-cards"

interface DashboardTabProps {
  tenders: Tender[]
  submissions: Submission[]
  onTenderCreate: () => void
  onTenderInfoClick: (tender: Tender) => void
  onReviewClick: (submission: Submission) => void
}

export function DashboardTab({ tenders, submissions, onTenderCreate, onTenderInfoClick, onReviewClick }: DashboardTabProps) {
  // Calculate dynamic statistics
  const activeTendersCount = tenders.filter(tender => tender.status === "Open").length
  const totalSubmissionsCount = submissions.length
  const pendingEvaluationCount = submissions.filter(sub => sub.status === "Under Review").length
  const totalBudgetValue = tenders.reduce((sum, tender) => {
    const value = parseInt(tender.budget.replace(/[^0-9]/g, '')) || 0
    return sum + value
  }, 0)

  // Get recent tenders
  const recentTenders = [...tenders]
    .sort((a, b) => new Date(b.createdDate || b.deadline).getTime() - new Date(a.createdDate || a.deadline).getTime())
    .slice(0, 5)

  // Get submissions for evaluation queue
  const evaluationQueueSubmissions = submissions
    .filter(sub => sub.status === "Under Review")
    .slice(0, 3)

  const hasTenders = tenders.length > 0
  const hasSubmissions = submissions.length > 0

  return (
    <div className="space-y-6">
      {hasTenders ? (
        <>
          <StatsCards 
            activeTendersCount={activeTendersCount}
            totalSubmissionsCount={totalSubmissionsCount}
            pendingEvaluationCount={pendingEvaluationCount}
            totalBudgetValue={totalBudgetValue}
            tendersCount={tenders.length}
          />

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tenders</CardTitle>
                <CardDescription>Latest tender publications and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTenders.map((tender) => (
                  <div 
                    key={tender.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onTenderInfoClick(tender)}
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{tender.title}</p>
                      <p className="text-xs text-muted-foreground">{tender.department}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            tender.status === "Open"
                              ? "default"
                              : tender.status === "Evaluation"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {tender.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{tender.budget}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent hover:bg-gray-100 transition-colors">
                      View
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evaluation Queue</CardTitle>
                <CardDescription>Submissions awaiting evaluation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {evaluationQueueSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{submission.supplier}</p>
                      <p className="text-xs text-muted-foreground">Tender: {submission.tenderId}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {submission.status}
                        </Badge>
                        {submission.score && (
                          <span className="text-xs text-muted-foreground">Score: {submission.score}%</span>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-transparent hover:bg-gray-100 transition-colors"
                      onClick={() => onReviewClick(submission)}
                    >
                      Evaluate
                    </Button>
                  </div>
                ))}
                {evaluationQueueSubmissions.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    {hasSubmissions ? "No submissions awaiting evaluation" : "No submissions received yet"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        // Empty State when no tenders exist
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to Tender Management</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first tender to manage procurement opportunities.
            </p>
            <Button onClick={onTenderCreate} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Tender
            </Button>
            
            {/* Quick Stats Placeholder */}
            <div className="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
              <div className="text-center p-4 border rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Tenders</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="bg-green-100 p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button - Show when there are tenders */}
      {hasTenders && (
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={onTenderCreate}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Register New Tender
          </Button>
        </div>
      )}
    </div>
  )
}