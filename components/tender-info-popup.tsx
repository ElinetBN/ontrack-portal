import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Calendar, CalendarDays, User, Mail, Phone, MapPin, ExternalLink, CheckCircle } from "lucide-react"
import { Tender } from "../types"

interface TenderInfoPopupProps {
  isOpen: boolean
  onClose: () => void
  tender: Tender | null
}

export function TenderInfoPopup({ isOpen, onClose, tender }: TenderInfoPopupProps) {
  if (!isOpen || !tender) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Tender Information</h2>
            <p className="text-sm text-muted-foreground">Complete details for {tender.title}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Tender ID</Label>
                  <p className="text-sm">{tender.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reference Number</Label>
                  <p className="text-sm">{tender.referenceNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="text-sm">{tender.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm">{tender.category}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Financial Details</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Budget</Label>
                  <p className="text-sm font-semibold">{tender.budget}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Submissions Received</Label>
                  <p className="text-sm">{tender.submissions}</p>
                </div>
                {tender.evaluationScore && (
                  <div>
                    <Label className="text-sm font-medium">Evaluation Score</Label>
                    <p className="text-sm">{tender.evaluationScore}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium">Description</Label>
            <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{tender.description}</p>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium">Deadline</Label>
                    <p className="text-sm">{tender.deadline}</p>
                  </div>
                </div>
                {tender.createdDate && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Created Date</Label>
                      <p className="text-sm">{tender.createdDate}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {tender.contactPerson && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Contact Person</Label>
                      <p className="text-sm">{tender.contactPerson}</p>
                    </div>
                  </div>
                )}
                {tender.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{tender.contactEmail}</p>
                    </div>
                  </div>
                )}
                {tender.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm">{tender.contactPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          {tender.location && (
            <div>
              <Label className="text-sm font-medium">Location</Label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{tender.location}</p>
              </div>
            </div>
          )}

          {/* Requested Items */}
          <div>
            <Label className="text-sm font-medium">Requested Documents/Items</Label>
            <div className="mt-2 space-y-2">
              {tender.requestedItems?.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Advertisement Link */}
          {tender.advertisementLink && (
            <div>
              <Label className="text-sm font-medium">Advertisement Link</Label>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.open(tender.advertisementLink, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Tender Advertisement
                </Button>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
            <Label className="text-sm font-medium">Current Status:</Label>
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
              className="text-sm"
            >
              {tender.status}
            </Badge>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.open(tender.advertisementLink, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Advertisement
          </Button>
        </div>
      </div>
    </div>
  )
}