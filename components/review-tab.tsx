import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, X, AlertCircle, Plus, User, Calendar, Bell, FileText, Eye } from "lucide-react"
import { Tender } from "../types"
import { TenderInfoPopup } from "./tender-info-popup"

interface ReviewTabProps {
  tenders: Tender[]
  onTenderStatusChange: (tenderId: string, newStatus: string) => void
}

export function ReviewTab({ tenders, onTenderStatusChange }: ReviewTabProps) {
  const [isApproved, setIsApproved] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const [requestChanges, setRequestChanges] = useState(false)
  const [comment, setComment] = useState("")
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [showTenderInfo, setShowTenderInfo] = useState(false)

  const handleApprove = () => {
    setIsApproved(true)
    setIsRejected(false)
    setRequestChanges(false)
    if (selectedTender) {
      onTenderStatusChange(selectedTender.id, "Awarded")
    }
  }

  const handleReject = () => {
    setIsRejected(true)
    setIsApproved(false)
    setRequestChanges(false)
    if (selectedTender) {
      onTenderStatusChange(selectedTender.id, "Rejected")
    }
  }

  const handleRequestChanges = () => {
    setRequestChanges(true)
    setIsApproved(false)
    setIsRejected(false)
  }

  const handleSubmitComment = () => {
    if (comment.trim()) {
      console.log("Comment submitted:", comment)
      setComment("")
    }
  }

  const handleReviewClick = (tender: Tender) => {
    setSelectedTender(tender)
    setShowTenderInfo(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tender Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <Checkbox id="dashboard" />
                <Label htmlFor="dashboard" className="font-medium cursor-pointer">
                  Dashboard
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <Checkbox id="tenders" />
                <Label htmlFor="tenders" className="font-medium cursor-pointer">
                  Tenders
                </Label>
              </div>
              <div className="text-sm text-muted-foreground pl-6">
                Supply of Office Furniture
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                <Checkbox id="reviews" checked readOnly />
                <Label htmlFor="reviews" className="font-medium cursor-pointer">
                  Reviews
                </Label>
              </div>
              <div className="text-sm pl-6 space-y-2">
                <div className="font-medium">Reference</div>
                <div className="text-muted-foreground">TENDER-2024-001</div>
                <div className="font-medium">Closing Date</div>
                <div className="text-muted-foreground">April 30, 2024</div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <Checkbox id="settings" />
                <Label htmlFor="settings" className="font-medium cursor-pointer">
                  Settings
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Tenders List for Review */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tenders for Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tenders.map((tender) => (
                <div 
                  key={tender.id} 
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedTender?.id === tender.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedTender(tender)}
                >
                  <div className="font-medium text-sm">{tender.title}</div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge
                      variant={
                        tender.status === "Open"
                          ? "default"
                          : tender.status === "Evaluation"
                            ? "secondary"
                            : tender.status === "Awarded"
                              ? "outline"
                              : "destructive"
                      }
                      className="text-xs"
                    >
                      {tender.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReviewClick(tender)
                      }}
                      className="hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Supply of Office Furniture</CardTitle>
                  <CardDescription>
                    TENDER-2024-001 • Closing Date: April 30, 2024
                  </CardDescription>
                </div>
                <Badge variant={isApproved ? "default" : isRejected ? "destructive" : "secondary"}>
                  {isApproved ? "Approved" : isRejected ? "Rejected" : "Under Review"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground">
                  We are seeking bids for the supply and installation of office furniture for our new office spaces. 
                  The tender includes desks, chairs, filing cabinets, and other office furniture. Please refer to 
                  the attached documents for detailed specifications and requirements.
                </p>
              </div>

              <div className="border-t pt-6">
                {/* Attachments Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox id="specification" />
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="specification" className="cursor-pointer">
                        Specification.pdf
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox id="terms" />
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="terms" className="cursor-pointer">
                        Terms.pdf
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox id="budget" />
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="budget" className="cursor-pointer">
                        Budget.xlsx
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox id="in-review" />
                      <Label htmlFor="in-review" className="cursor-pointer">
                        In Review
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox id="approved" />
                      <Label htmlFor="approved" className="cursor-pointer">
                        Approved
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Review Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={handleApprove}
                      variant={isApproved ? "default" : "outline"}
                      className={`${isApproved ? "bg-green-600 hover:bg-green-700" : ""} transition-colors`}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant={isRejected ? "destructive" : "outline"}
                      className="transition-colors"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={handleRequestChanges}
                      variant={requestChanges ? "secondary" : "outline"}
                      className="transition-colors"
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Request Changes
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Comments</h3>
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button 
                      onClick={handleSubmitComment} 
                      disabled={!comment.trim()}
                      className="hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Review Information</CardTitle>
              <CardDescription>
                This review section is only accessible to project owners and project leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Reviewer Role:</span>
                    <span>Project Lead</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Review Deadline:</span>
                    <span>May 15, 2024</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Approval Required:</span>
                    <span>Project Owner & Project Lead</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Notifications:</span>
                    <span>Enabled</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tender Information Popup */}
      <TenderInfoPopup
        isOpen={showTenderInfo}
        onClose={() => setShowTenderInfo(false)}
        tender={selectedTender}
      />
    </div>
  )
}