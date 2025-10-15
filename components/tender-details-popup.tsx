// components/tender-details-popup.tsx
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  Users,
  Mail,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Building2,
  FileUp,
  ArrowRight,
  X,
  Phone,
} from "lucide-react"

interface Tender {
  id: string
  title: string
  description: string
  status: string
  budget: number
  deadline: string
  submissions: number
  category: string
  publishedDate: string
  requirements: string[]
  contactPerson: {
    name: string
    email: string
    phone: string
    department?: string
  } | string
  contactEmail: string
  documents: string[]
  evaluationCriteria?: string[]
  termsAndConditions?: string[]
  scopeOfWork?: string
  bidBondRequired?: boolean
  bidBondAmount?: number
  preBidMeeting?: string
  siteVisitRequired?: boolean
  siteVisitDate?: string
}

interface TenderDetailsPopupProps {
  isOpen: boolean
  onClose: () => void
  tender: Tender | null
  onApply: (tenderId: string) => void
  onDownloadDocuments: (tenderId: string, documentName: string) => void
}

// Safe rendering utility
const safeRender = (value: any): string => {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  
  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString()
  }
  
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  
  if (typeof value === 'object') {
    if (value.name || value.email) {
      return value.name || value.email || 'N/A'
    }
    return JSON.stringify(value)
  }
  
  return 'N/A'
}

export function TenderDetailsPopup({
  isOpen,
  onClose,
  tender,
  onApply,
  onDownloadDocuments,
}: TenderDetailsPopupProps) {
  const [isApplying, setIsApplying] = useState(false)

  if (!tender) return null

  const isExpired = new Date(tender.deadline) < new Date()

  const handleApply = async () => {
    setIsApplying(true)
    try {
      await onApply(tender.id)
    } finally {
      setIsApplying(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      new: "secondary",
      completed: "outline",
      awarded: "default",
      open: "default",
      evaluation: "secondary",
      draft: "outline",
      closed: "outline",
      submitted: "secondary"
    } as const

    const labels = {
      active: "Active",
      new: "New",
      completed: "Completed",
      awarded: "Awarded",
      open: "Open",
      evaluation: "Evaluation",
      draft: "Draft",
      closed: "Closed",
      submitted: "Submitted"
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  // Get contact information safely
  const getContactInfo = () => {
    if (typeof tender.contactPerson === 'string') {
      return {
        name: tender.contactPerson,
        email: tender.contactEmail,
        phone: '',
        department: ''
      }
    }
    return tender.contactPerson
  }

  const contactInfo = getContactInfo()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              {safeRender(tender.title)}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge(tender.status)}
            {isExpired && (
              <Badge variant="outline" className="text-red-600 border-red-300">
                <Clock className="h-3 w-3 mr-1" />
                Expired
              </Badge>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Category
                  </h3>
                  <p className="text-sm">{safeRender(tender.category)}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Budget
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(tender.budget)}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Submissions Received
                  </h3>
                  <p className="text-sm">{safeRender(tender.submissions)} submissions</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Published Date
                  </h3>
                  <p className="text-sm">
                    {new Date(tender.publishedDate).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Submission Deadline
                  </h3>
                  <p className={`text-sm ${isExpired ? 'text-red-600 font-semibold' : ''}`}>
                    {new Date(tender.deadline).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {isExpired && (
                    <p className="text-xs text-red-600 mt-1">
                      This tender has expired
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {safeRender(tender.description)}
              </p>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="font-semibold mb-3">Requirements</h3>
              <div className="space-y-2">
                {tender.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{safeRender(requirement)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            {(tender.scopeOfWork || tender.evaluationCriteria || tender.termsAndConditions) && (
              <div className="space-y-4">
                {tender.scopeOfWork && (
                  <div>
                    <h3 className="font-semibold mb-2">Scope of Work</h3>
                    <p className="text-sm text-muted-foreground">{safeRender(tender.scopeOfWork)}</p>
                  </div>
                )}

                {tender.evaluationCriteria && tender.evaluationCriteria.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Evaluation Criteria</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {tender.evaluationCriteria.map((criterion, index) => (
                        <li key={index}>• {safeRender(criterion)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {tender.termsAndConditions && tender.termsAndConditions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {tender.termsAndConditions.map((term, index) => (
                        <li key={index}>• {safeRender(term)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Special Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tender.bidBondRequired && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Bid Bond Required</p>
                    {tender.bidBondAmount && (
                      <p className="text-xs text-muted-foreground">
                        Amount: {formatCurrency(tender.bidBondAmount)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {tender.preBidMeeting && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Pre-Bid Meeting</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tender.preBidMeeting).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {tender.siteVisitRequired && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border">
                  <Building2 className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Site Visit Required</p>
                    {tender.siteVisitDate && (
                      <p className="text-xs text-muted-foreground">
                        Date: {new Date(tender.siteVisitDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm text-muted-foreground">
                    {safeRender(contactInfo.name)}
                  </p>
                  {contactInfo.department && (
                    <p className="text-xs text-muted-foreground">{contactInfo.department}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">Contact Details</p>
                  <div className="space-y-1">
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      {safeRender(contactInfo.email)}
                    </a>
                    {contactInfo.phone && (
                      <a 
                        href={`tel:${contactInfo.phone}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {safeRender(contactInfo.phone)}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                Tender Documents
              </h3>
              <div className="space-y-2">
                {tender.documents.map((document, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{safeRender(document)}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownloadDocuments(tender.id, document)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => onDownloadDocuments(tender.id, "All Tender Documents")}
            className="flex-1"
            disabled={isExpired}
          >
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
          <Button
            onClick={handleApply}
            disabled={isApplying || isExpired}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isApplying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Applying...
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4 mr-2" />
                {isExpired ? "Tender Expired" : "Apply Now"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}