"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Users, Trash2, Edit, ExternalLink, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tender, Submission } from "../types"
import { StatsCards } from "./stats-cards"
import { toast } from "@/components/ui/use-toast"

interface DashboardTabProps {
  tenders: Tender[]
  submissions: Submission[]
  onTenderCreate: () => void
  onTenderEdit: (tender: Tender) => void
  onTenderInfoClick: (tender: Tender) => void
  onReviewClick: (submission: Submission) => void
  onTenderDelete: (tenderId: string) => void
  onTenderPublish: (tenderId: string) => void
  onBidderApplication: (tender: Tender) => void
  onOpenBidderApplication: (link: string) => void
}

export function DashboardTab({ 
  tenders, 
  submissions, 
  onTenderCreate, 
  onTenderEdit,
  onTenderInfoClick, 
  onReviewClick,
  onTenderDelete,
  onTenderPublish,
  onBidderApplication,
  onOpenBidderApplication
}: DashboardTabProps) {
  // Calculate dynamic statistics
  const publishedTenders = tenders.filter(tender => tender.status !== "Draft")
  const draftTenders = tenders.filter(tender => tender.status === "Draft")
  
  const activeTendersCount = tenders.filter(tender => tender.status === "Open").length
  const totalSubmissionsCount = submissions.length
  const pendingEvaluationCount = submissions.filter(sub => sub.status === "Under Review").length
  const totalBudgetValue = tenders.reduce((sum, tender) => {
    const value = parseInt(tender.budget.replace(/[^0-9]/g, '')) || 0
    return sum + value
  }, 0)

  // Get recent tenders (both published and drafts)
  const recentTenders = [...tenders]
    .sort((a, b) => new Date(b.createdDate || b.deadline).getTime() - new Date(a.createdDate || a.deadline).getTime())
    .slice(0, 5)

  // Get submissions for evaluation queue
  const evaluationQueueSubmissions = submissions
    .filter(sub => sub.status === "Under Review")
    .slice(0, 3)

  const hasTenders = tenders.length > 0
  const hasSubmissions = submissions.length > 0

  const handleDeleteTender = (tenderId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onTenderDelete(tenderId)
  }

  const handleEditTender = (tender: Tender, event: React.MouseEvent) => {
    event.stopPropagation()
    onTenderEdit(tender)
  }

  const handlePublishTender = (tenderId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    
    // Find the tender to get its reference number
    const tender = tenders.find(t => t.id === tenderId)
    if (!tender) return

    // Generate application link using the correct format with query parameters
    const applicationLink = `${window.location.origin}/bidder-application?tenderId=${tenderId}&ref=${tender.referenceNumber || `TND-${tenderId.slice(-12)}`}`
    
    // Call the publish function with the generated link
    onTenderPublish(tenderId)
    
    // Show success message with the application link
    toast({
      title: "Tender Published Successfully!",
      description: (
        <div className="space-y-2">
          <p>Your tender has been published and is now open for applications.</p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                navigator.clipboard.writeText(applicationLink)
                toast({
                  title: "Link copied!",
                  description: "Application link copied to clipboard.",
                  duration: 2000,
                })
              }}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Application Link
            </Button>
            <Button
              variant="default"
              size="sm"
              className="text-xs"
              onClick={() => window.open(applicationLink, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Application Form
            </Button>
          </div>
        </div>
      ),
      duration: 5000,
    })
  }

  const handleCopyApplicationLink = (link: string, event: React.MouseEvent) => {
    event.stopPropagation()
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied!",
      description: "Bidder application link has been copied to clipboard.",
      duration: 3000,
    })
  }

  const handleOpenApplicationLink = (link: string, event: React.MouseEvent) => {
    event.stopPropagation()
    console.log('Opening application link:', link)
    onOpenBidderApplication(link)
  }

  const getStatusBadgeVariant = (status: Tender["status"]) => {
    switch (status) {
      case "Open":
        return "default"
      case "Evaluation":
        return "secondary"
      case "Awarded":
        return "default"
      case "Draft":
        return "outline"
      case "Closed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: Tender["status"]) => {
    switch (status) {
      case "Draft":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Open":
        return "bg-green-50 text-green-700 border-green-200"
      case "Evaluation":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Awarded":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "Closed":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Function to generate application link for existing tenders
  const generateApplicationLink = (tender: Tender) => {
    return `${window.location.origin}/bidder-application?tenderId=${tender.id}&ref=${tender.referenceNumber || `TND-${tender.id.slice(-12)}`}`
  }

  return (
    <div className="space-y-6">
      {hasTenders ? (
        <>
          <StatsCards 
            activeTendersCount={activeTendersCount}
            totalSubmissionsCount={totalSubmissionsCount}
            pendingEvaluationCount={pendingEvaluationCount}
            totalBudgetValue={totalBudgetValue}
            tendersCount={publishedTenders.length}
            draftTendersCount={draftTenders.length}
          />

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tenders</CardTitle>
                <CardDescription>
                  Latest tender publications {draftTenders.length > 0 && `and ${draftTenders.length} draft(s)`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTenders.map((tender) => (
                  <div 
                    key={tender.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => onTenderInfoClick(tender)}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{tender.title}</p>
                        {tender.status === "Draft" && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{tender.department} • {tender.category}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getStatusBadgeVariant(tender.status)}
                          className={`text-xs ${getStatusColor(tender.status)}`}
                        >
                          {tender.status}
                        </Badge>
                        {tender.status !== "Draft" && (
                          <span className="text-xs text-muted-foreground">{tender.budget}</span>
                        )}
                      </div>
                      
                      {/* Bidder Application Link - Only show for published tenders */}
                      {tender.status !== "Draft" && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                const link = generateApplicationLink(tender)
                                onOpenBidderApplication(link)
                              }}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Apply Now
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                const link = generateApplicationLink(tender)
                                navigator.clipboard.writeText(link)
                                toast({
                                  title: "Link copied!",
                                  description: "Bidder application link has been copied to clipboard.",
                                  duration: 3000,
                                })
                              }}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Link
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {tender.status === "Draft" ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent hover:bg-green-50 hover:text-green-600 transition-colors"
                            onClick={(e) => handlePublishTender(tender.id, e)}
                          >
                            Publish
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={(e) => handleEditTender(tender, e)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent hover:bg-gray-100 transition-colors"
                        >
                          View
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-transparent hover:bg-red-50 hover:text-red-600 transition-colors text-muted-foreground opacity-0 group-hover:opacity-100"
                        onClick={(e) => handleDeleteTender(tender.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                      <p className="text-xs text-muted-foreground">{submission.companyName}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {submission.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{submission.bidAmount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                      </p>
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
            Create New Tender
          </Button>
        </div>
      )}
    </div>
  )
}