// components/submission-review-popup.tsx
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, User, Mail, Phone, Building, MapPin, FileCheck, Award, Download, ExternalLink } from "lucide-react"
import { Submission } from "../types"

interface SubmissionReviewPopupProps {
  isOpen: boolean
  onClose: () => void
  submission: Submission | null
  onEvaluate: (submission: Submission) => void
}

// API function to fetch complete submission details
async function fetchCompleteSubmissionDetails(submissionId: string) {
  try {
    const response = await fetch(`/api/tender-applications/${submissionId}?details=full`)
    if (!response.ok) {
      throw new Error(`Failed to fetch submission details: ${response.status}`)
    }
    const result = await response.json()
    return result.success ? result.data : null
  } catch (error) {
    console.error('Error fetching submission details:', error)
    return null
  }
}

export function SubmissionReviewPopup({ isOpen, onClose, submission, onEvaluate }: SubmissionReviewPopupProps) {
  const [detailedSubmission, setDetailedSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch complete submission details when popup opens
  useEffect(() => {
    if (isOpen && submission) {
      loadDetailedSubmission()
    }
  }, [isOpen, submission])

  const loadDetailedSubmission = async () => {
    if (!submission) return
    
    setLoading(true)
    const completeData = await fetchCompleteSubmissionDetails(submission.id)
    if (completeData) {
      setDetailedSubmission(completeData)
    } else {
      // Fallback to the basic submission data
      setDetailedSubmission(submission)
    }
    setLoading(false)
  }

  if (!submission) return null

  // Use detailed data if available, otherwise fallback to basic submission data
  const currentSubmission = detailedSubmission || submission

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  // Enhanced data getters with proper fallbacks and object handling
  const getSubmitterName = () => {
    return currentSubmission.submitter?.name || 
           currentSubmission.contactPerson || 
           'Contact Person Information'
  }

  const getSubmitterEmail = () => {
    return currentSubmission.submitter?.email || 
           currentSubmission.contactEmail || 
           'Email Address Not Provided'
  }

  const getSubmitterPhone = () => {
    return currentSubmission.submitter?.phone || 
           currentSubmission.contactPhone || 
           'Phone Number Not Provided'
  }

  const getSubmitterPosition = () => {
    return currentSubmission.submitter?.position || 
           'Position Not Specified'
  }

  const getSubmitterDepartment = () => {
    return currentSubmission.submitter?.department || 
           'Department Not Specified'
  }

  const getCompanyRegistration = () => {
    return currentSubmission.companyDetails?.registrationNumber || 
           'Registration Number Not Provided'
  }

  const getCompanyTaxNumber = () => {
    return currentSubmission.companyDetails?.taxNumber || 
           'Tax Number Not Provided'
  }

  const getYearsInBusiness = () => {
    return currentSubmission.companyDetails?.yearsInBusiness || 
           'Years in Business Not Specified'
  }

  const getCompanyAddress = () => {
    return currentSubmission.companyDetails?.address || 
           'Company Address Not Provided'
  }

  // FIXED: Handle object proposal data
  const getProposalTitle = () => {
    if (!currentSubmission.proposal) {
      return 'Proposal Details Not Provided'
    }
    
    // If proposal is an object, extract the title
    if (typeof currentSubmission.proposal === 'object') {
      return (currentSubmission.proposal as any).title || 'Proposal Title Not Provided'
    }
    
    // If proposal is a string, use it directly
    return currentSubmission.proposal
  }

  // NEW: Get full proposal details if it's an object
  const getProposalDetails = () => {
    if (!currentSubmission.proposal || typeof currentSubmission.proposal !== 'object') {
      return null
    }
    
    const proposal = currentSubmission.proposal as any
    return {
      title: proposal.title || 'No Title',
      executiveSummary: proposal.executiveSummary || 'No executive summary provided',
      technicalProposal: proposal.technicalProposal || 'No technical proposal provided',
      methodology: proposal.methodology || 'No methodology provided',
      workPlan: proposal.workPlan || 'No work plan provided',
      teamComposition: proposal.teamComposition || 'No team composition provided'
    }
  }

  const getApplicationNumber = () => {
    return currentSubmission.applicationNumber || 
           'Application Number Not Assigned'
  }

  const getBidAmount = () => {
    return currentSubmission.bidAmount || 
           formatCurrency(currentSubmission.amount || 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const handleDownloadDocument = (document: any) => {
    console.log('Downloading document:', document)
    // Implement document download logic
    if (document.url) {
      window.open(document.url, '_blank')
    }
  }

  // Get proposal details if available
  const proposalDetails = getProposalDetails()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-blue-600" />
            Complete Application Review
            {loading && (
              <Badge variant="outline" className="ml-2">
                Loading Details...
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading complete application details...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{currentSubmission.tenderTitle}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <strong>Company:</strong> {currentSubmission.companyName}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <strong>Application #:</strong> {getApplicationNumber()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <strong>Submitted:</strong> {formatDate(currentSubmission.submissionDate)}
                    </span>
                  </div>
                </div>
                <Badge variant={getStatusVariant(currentSubmission.status)} className="text-sm px-3 py-2">
                  {getStatusDisplayText(currentSubmission.status)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Applicant & Company Details */}
              <div className="xl:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2 text-blue-700">
                    <User className="h-5 w-5" />
                    Applicant Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{getSubmitterName()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          {getSubmitterEmail()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          {getSubmitterPhone()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Position</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{getSubmitterPosition()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{getSubmitterDepartment()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2 text-green-700">
                    <Building className="h-5 w-5" />
                    Company Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company Name</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{currentSubmission.companyName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Registration Number</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{getCompanyRegistration()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tax Number</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{getCompanyTaxNumber()}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Years in Business</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{getYearsInBusiness()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company Address</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1 flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-red-600 flex-shrink-0 mt-1" />
                          <span className="text-left">{getCompanyAddress()}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proposal Details - UPDATED to handle object data */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2 text-purple-700">
                    <FileText className="h-5 w-5" />
                    Proposal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Proposal Title</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{getProposalTitle()}</p>
                    </div>
                    
                    {/* Display detailed proposal information if available */}
                    {proposalDetails && (
                      <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Executive Summary</label>
                          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                            {proposalDetails.executiveSummary}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Technical Proposal</label>
                          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                            {proposalDetails.technicalProposal}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Methodology</label>
                          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                            {proposalDetails.methodology}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Work Plan</label>
                          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                            {proposalDetails.workPlan}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Team Composition</label>
                          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                            {proposalDetails.teamComposition}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Bid Amount</label>
                        <p className="text-2xl font-bold text-green-600 mt-1">{getBidAmount()}</p>
                      </div>
                      {currentSubmission.score && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Current Score</label>
                          <p className="text-2xl font-bold text-blue-600 mt-1">{currentSubmission.score}/100</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Submission Details & Documents */}
              <div className="space-y-6">
                {/* Timeline Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2 text-orange-700">
                    <Calendar className="h-5 w-5" />
                    Submission Timeline
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date Submitted</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{formatDate(currentSubmission.submissionDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{formatDate(currentSubmission.lastUpdated)}</p>
                    </div>
                  </div>
                </div>

                {/* Supporting Documents */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2 text-indigo-700">
                    <FileText className="h-5 w-5" />
                    Supporting Documents
                    <Badge variant="outline" className="ml-2">
                      {currentSubmission.documents?.length || 0}
                    </Badge>
                  </h3>
                  <div className="space-y-3">
                    {currentSubmission.documents && currentSubmission.documents.length > 0 ? (
                      currentSubmission.documents.map((doc, index) => (
                        <div key={doc.id || index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.type} • {doc.size || 'Unknown size'}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadDocument(doc)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            View
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No supporting documents attached</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Evaluation Status */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2 text-red-700">
                    <Award className="h-5 w-5" />
                    Evaluation Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Current Status:</span>
                      <Badge variant={getStatusVariant(currentSubmission.status)}>
                        {getStatusDisplayText(currentSubmission.status)}
                      </Badge>
                    </div>
                    {currentSubmission.evaluation && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Evaluator:</span>
                          <span className="text-sm font-medium">
                            {typeof currentSubmission.evaluation === 'object' 
                              ? (currentSubmission.evaluation as any).evaluator 
                              : 'Unknown Evaluator'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Evaluation Date:</span>
                          <span className="text-sm font-medium">
                            {typeof currentSubmission.evaluation === 'object' 
                              ? formatDate((currentSubmission.evaluation as any).submittedAt) 
                              : 'Unknown Date'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {currentSubmission.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-yellow-800">Additional Notes from Applicant</h3>
                <p className="text-yellow-700 leading-relaxed">
                  {typeof currentSubmission.notes === 'string' 
                    ? currentSubmission.notes 
                    : JSON.stringify(currentSubmission.notes)}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Application ID: {currentSubmission.id}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Close Review
                </Button>
                <Button 
                  onClick={() => onEvaluate(currentSubmission)}
                  className="bg-green-600 hover:bg-green-700 px-6"
                  size="lg"
                >
                  <FileCheck className="mr-2 h-5 w-5" />
                  Proceed to Evaluation
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}