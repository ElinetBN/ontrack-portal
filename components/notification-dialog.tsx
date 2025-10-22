// components/notification-dialog.tsx
"use client"

import { useState, useEffect } from "react"
import { Submission } from "../types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  AlertCircle,
  FileText,
  Send,
  Mail,
  Clock,
  Loader2,
  XCircle,
  Users,
  FileWarning,
  ChevronRight,
  ChevronLeft,
  Building,
  User,
  FileCheck,
  ExternalLink
} from "lucide-react"

interface NotificationDialogProps {
  isOpen: boolean
  onClose: () => void
  submissions: Submission[]
  tenderTitle: string
}

type NotificationStep = 'selection' | 'template' | 'review' | 'sending' | 'complete'

interface NotificationStats {
  total: number
  withMissingDocs: number
  successful: number
  failed: number
  pending: number
}

interface NotificationTemplate {
  id: string
  name: string
  description: string
  subject: string
  icon: any
  message: string
  type: 'received' | 'missing_docs' | 'status_update' | 'awarded' | 'rejected' | 'custom'
}

interface SendResult {
  submissionId: string
  email: string
  status: 'sent' | 'failed'
  messageId?: string
  error?: string
  timestamp?: string
}

export function NotificationDialog({ isOpen, onClose, submissions, tenderTitle }: NotificationDialogProps) {
  const [currentStep, setCurrentStep] = useState<NotificationStep>('selection')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedRecipients, setSelectedRecipients] = useState<'all' | 'missing_docs' | 'status'>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [customMessage, setCustomMessage] = useState<string>('')
  const [isSending, setIsSending] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sendResults, setSendResults] = useState<SendResult[]>([])
  const [stats, setStats] = useState<NotificationStats>({
    total: submissions.length,
    withMissingDocs: 0,
    successful: 0,
    failed: 0,
    pending: submissions.length
  })

  // Calculate submissions with missing documents and by status
  useEffect(() => {
    const withMissingDocs = submissions.filter(sub => 
      sub.documents && sub.documents.some(doc => doc.status === 'missing' || doc.status === 'rejected')
    ).length

    setStats(prev => ({ ...prev, withMissingDocs }))
  }, [submissions])

  // Notification templates
  const templates: NotificationTemplate[] = [
    {
      id: 'application_received',
      name: 'Application Received',
      description: 'Notify applicants that their application has been received and is being processed',
      subject: `Application Received - ${tenderTitle}`,
      icon: CheckCircle,
      message: `Dear {applicantName},

Thank you for submitting your application for {tenderTitle} on behalf of {companyName}.

We have successfully received your submission and it is now being processed. Our team will review your application and you will be notified of any updates regarding your application status.

Application Reference: {applicationNumber}

Best regards,
Tender Management Team`,
      type: 'received'
    },
    {
      id: 'missing_documents',
      name: 'Missing Documents',
      description: 'Notify applicants about missing or required documents in their application',
      subject: `Action Required: Missing Documents - ${tenderTitle}`,
      icon: FileWarning,
      message: `Dear {applicantName},

We are reviewing your application for {tenderTitle} and have identified that the following documents are missing or require attention:

{missingDocuments}

Please submit these documents within 7 days to ensure your application can proceed to the next stage of evaluation.

Application Reference: {applicationNumber}

Best regards,
Tender Management Team`,
      type: 'missing_docs'
    },
    {
      id: 'under_review',
      name: 'Under Review',
      description: 'Notify applicants that their application is currently under review',
      subject: `Application Under Review - ${tenderTitle}`,
      icon: Clock,
      message: `Dear {applicantName},

Your application for {tenderTitle} is now under review by our evaluation committee.

We expect to complete the evaluation process within the next 2-3 weeks. You will be notified immediately once a decision has been made.

Application Reference: {applicationNumber}

Best regards,
Tender Management Team`,
      type: 'status_update'
    },
    {
      id: 'awarded',
      name: 'Awarded',
      description: 'Notify successful applicants that their application has been awarded',
      subject: `Congratulations! Your Application Has Been Awarded - ${tenderTitle}`,
      icon: CheckCircle,
      message: `Dear {applicantName},

We are pleased to inform you that your application for {tenderTitle} has been successful!

Congratulations to {companyName}! Your submission has been selected for award.

Application Reference: {applicationNumber}

Our team will contact you shortly to discuss the next steps and contract formalities.

Best regards,
Tender Management Team`,
      type: 'awarded'
    },
    {
      id: 'rejected',
      name: 'Rejected',
      description: 'Notify applicants that their application was not successful',
      subject: `Update on Your Application - ${tenderTitle}`,
      icon: XCircle,
      message: `Dear {applicantName},

Thank you for your interest in {tenderTitle} and for the time and effort you put into your application.

After careful consideration, we regret to inform you that your application was not successful on this occasion. We received a high number of quality submissions and the selection process was very competitive.

Application Reference: {applicationNumber}

We encourage you to apply for future opportunities that match your company's capabilities.

Best regards,
Tender Management Team`,
      type: 'rejected'
    },
    {
      id: 'custom',
      name: 'Custom Message',
      description: 'Send a custom message to selected applicants',
      subject: `Update on Your Application - ${tenderTitle}`,
      icon: Mail,
      message: `Dear {applicantName},

This message is regarding your application for {tenderTitle}.

{customMessage}

Application Reference: {applicationNumber}

Best regards,
Tender Management Team`,
      type: 'custom'
    }
  ]

  // Get filtered recipients based on selection
  const getFilteredRecipients = () => {
    switch (selectedRecipients) {
      case 'all':
        return submissions
      case 'missing_docs':
        return submissions.filter(sub => 
          sub.documents && sub.documents.some(doc => doc.status === 'missing' || doc.status === 'rejected')
        )
      case 'status':
        return submissions.filter(sub => sub.status === selectedStatus)
      default:
        return submissions
    }
  }

  const filteredRecipients = getFilteredRecipients()
  const selectedTemplateData = templates.find(t => t.id === selectedTemplate)

  const handleNextStep = () => {
    switch (currentStep) {
      case 'selection':
        setCurrentStep('template')
        break
      case 'template':
        setCurrentStep('review')
        break
      case 'review':
        handleSendNotifications()
        break
      default:
        break
    }
  }

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'template':
        setCurrentStep('selection')
        break
      case 'review':
        setCurrentStep('template')
        break
      default:
        break
    }
  }

  const handleSendNotifications = async () => {
    setIsSending(true)
    setCurrentStep('sending')
    setSendResults([])
    
    let successful = 0
    let failed = 0
    const results: SendResult[] = []
    
    try {
      // Send all notifications in a single API call
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissions: filteredRecipients,
          messageType: selectedTemplate,
          customMessage: customMessage,
          tenderDetails: {
            title: tenderTitle
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        successful = result.successful
        failed = result.failed
        setSendResults(result.results || [])
        
        // Update progress
        setProgress(100)
        setStats(prev => ({
          ...prev,
          successful,
          failed,
          pending: 0
        }))
      } else {
        throw new Error(result.error || 'Failed to send notifications')
      }
    } catch (error) {
      console.error('Failed to send notifications:', error)
      failed = filteredRecipients.length
      setStats(prev => ({
        ...prev,
        successful: 0,
        failed,
        pending: 0
      }))
    } finally {
      setIsSending(false)
      setCurrentStep('complete')
    }
  }

  const handleClose = () => {
    setCurrentStep('selection')
    setSelectedTemplate('')
    setSelectedRecipients('all')
    setSelectedStatus('')
    setCustomMessage('')
    setProgress(0)
    setSendResults([])
    setStats({
      total: submissions.length,
      withMissingDocs: 0,
      successful: 0,
      failed: 0,
      pending: submissions.length
    })
    onClose()
  }

  const handleRestart = () => {
    setCurrentStep('selection')
    setSelectedTemplate('')
    setSelectedRecipients('all')
    setSelectedStatus('')
    setCustomMessage('')
    setProgress(0)
    setSendResults([])
    setStats({
      total: submissions.length,
      withMissingDocs: 0,
      successful: 0,
      failed: 0,
      pending: submissions.length
    })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'selection':
        return true
      case 'template':
        return selectedTemplate !== ''
      case 'review':
        return true
      default:
        return true
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 'selection':
        return 'Select Recipients'
      case 'template':
        return 'Choose Template'
      case 'review':
        return 'Review & Send'
      case 'sending':
        return 'Sending Notifications'
      case 'complete':
        return 'Notifications Sent'
      default:
        return 'Notify Applicants'
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 'selection':
        return 'Choose which applicants you want to notify'
      case 'template':
        return 'Select a notification template or create a custom message'
      case 'review':
        return 'Review your notification before sending'
      case 'sending':
        return 'Please wait while we send notifications to all selected applicants'
      case 'complete':
        return 'The notification process has been completed'
      default:
        return 'Send notifications to applicants'
    }
  }

  const viewResendDashboard = () => {
    window.open('https://resend.com', '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="h-6 w-6" />
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-base">
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8">
          {['selection', 'template', 'review', 'sending', 'complete'].map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep === step ? 'bg-primary text-primary-foreground' :
                ['sending', 'complete'].includes(currentStep) && index < ['sending', 'complete'].indexOf(currentStep) + 1 ? 
                'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep === step && currentStep !== 'sending' && currentStep !== 'complete' ? (
                  index + 1
                ) : currentStep === step && currentStep === 'sending' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : ['sending', 'complete'].includes(currentStep) && index < ['sending', 'complete'].indexOf(currentStep) + 1 ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`ml-3 text-sm font-medium ${
                currentStep === step ? 'text-primary' : 
                ['sending', 'complete'].includes(currentStep) && index < ['sending', 'complete'].indexOf(currentStep) + 1 ? 
                'text-green-600' : 'text-muted-foreground'
              }`}>
                {step === 'selection' ? 'Recipients' : 
                 step === 'template' ? 'Template' :
                 step === 'review' ? 'Review' :
                 step === 'sending' ? 'Sending' : 'Complete'}
              </span>
              {index < 4 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  ['sending', 'complete'].includes(currentStep) && index < ['sending', 'complete'].indexOf(currentStep) + 1 ? 
                  'bg-green-500' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Recipient Selection */}
        {currentStep === 'selection' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Select Recipients
                </CardTitle>
                <CardDescription>
                  Choose which applicants you want to send notifications to
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* All Applicants */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRecipients === 'all' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedRecipients('all')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">All Applicants</h4>
                          {selectedRecipients === 'all' && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Send to all {submissions.length} applicants
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {new Set(submissions.map(s => s.companyName)).size} companies
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {new Set(submissions.map(s => s.contactPerson)).size} contacts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Missing Documents */}
                  {stats.withMissingDocs > 0 && (
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedRecipients === 'missing_docs' 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'border-muted hover:border-amber-300'
                      }`}
                      onClick={() => setSelectedRecipients('missing_docs')}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <FileWarning className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Missing Documents</h4>
                            {selectedRecipients === 'missing_docs' && (
                              <CheckCircle className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Applicants with incomplete document submissions
                          </p>
                          <div className="mt-2">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700">
                              {stats.withMissingDocs} applicants need attention
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* By Status */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRecipients === 'status' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedRecipients('status')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FileCheck className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">By Application Status</h4>
                          {selectedRecipients === 'status' && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Filter applicants by their current application status
                        </p>
                        {selectedRecipients === 'status' && (
                          <div className="mt-3">
                            <Label htmlFor="status-select" className="text-sm font-medium">
                              Select Status
                            </Label>
                            <select
                              id="status-select"
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="">Choose a status...</option>
                              <option value="submitted">Submitted ({submissions.filter(s => s.status === 'submitted').length})</option>
                              <option value="under_review">Under Review ({submissions.filter(s => s.status === 'under_review').length})</option>
                              <option value="evaluated">Evaluated ({submissions.filter(s => s.status === 'evaluated').length})</option>
                              <option value="awarded">Awarded ({submissions.filter(s => s.status === 'awarded').length})</option>
                              <option value="rejected">Rejected ({submissions.filter(s => s.status === 'rejected').length})</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipient Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Recipient Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{filteredRecipients.length}</div>
                        <div className="text-xs text-muted-foreground">Total Selected</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {filteredRecipients.filter(s => s.contactEmail).length}
                        </div>
                        <div className="text-xs text-muted-foreground">With Email</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {new Set(filteredRecipients.map(s => s.companyName)).size}
                        </div>
                        <div className="text-xs text-muted-foreground">Companies</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {stats.withMissingDocs}
                        </div>
                        <div className="text-xs text-muted-foreground">Missing Docs</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {currentStep === 'template' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Choose Notification Template
                </CardTitle>
                <CardDescription>
                  Select a pre-defined template or create a custom message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {templates.map((template) => {
                    const TemplateIcon = template.icon
                    return (
                      <div
                        key={template.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedTemplate === template.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-start gap-4">
                          <TemplateIcon className={`h-6 w-6 mt-0.5 ${
                            selectedTemplate === template.id ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-lg">{template.name}</h4>
                              {selectedTemplate === template.id && (
                                <CheckCircle className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {template.description}
                            </p>
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <p className="text-sm font-medium">Subject: {template.subject}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {template.message.split('\n').slice(0, 3).join(' ')}...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Custom Message Input */}
                {selectedTemplate === 'custom' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Custom Message</CardTitle>
                      <CardDescription>
                        Write your custom message. Use {"{applicantName}"}, {"{companyName}"}, {"{tenderTitle}"}, {"{applicationNumber}"} as placeholders.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Enter your custom message here..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 'review' && selectedTemplateData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Review Notification
                </CardTitle>
                <CardDescription>
                  Preview your notification before sending it to {filteredRecipients.length} applicants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recipient Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{filteredRecipients.length}</div>
                    <div className="text-xs text-muted-foreground">Recipients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredRecipients.filter(s => s.contactEmail).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Valid Emails</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(filteredRecipients.map(s => s.companyName)).size}
                    </div>
                    <div className="text-xs text-muted-foreground">Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedTemplateData.name}
                    </div>
                    <div className="text-xs text-muted-foreground">Template</div>
                  </div>
                </div>

                {/* Message Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Message Preview</CardTitle>
                    <CardDescription>
                      This is how the message will appear to applicants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Subject</Label>
                        <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">
                          {selectedTemplateData.subject}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Message Body</Label>
                        <div className="mt-1 p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm max-h-60 overflow-y-auto">
                          {selectedTemplateData.type === 'custom' ? customMessage : selectedTemplateData.message}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Recipients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Sample Recipients</CardTitle>
                    <CardDescription>
                      First 5 applicants who will receive this notification
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filteredRecipients.slice(0, 5).map((recipient, index) => (
                        <div key={recipient.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{recipient.contactPerson || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground">{recipient.companyName}</p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {recipient.contactEmail || 'No email'}
                          </div>
                        </div>
                      ))}
                      {filteredRecipients.length > 5 && (
                        <p className="text-xs text-center text-muted-foreground pt-2">
                          ... and {filteredRecipients.length - 5} more applicants
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Sending */}
        {currentStep === 'sending' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending Notifications via Resend
                </CardTitle>
                <CardDescription>
                  Processing emails through Resend email service...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress value={progress} className="w-full h-2" />
                
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-600">{stats.successful}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing through Resend... ({Math.round(progress)}% complete)
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Emails are being sent via Resend's secure email API
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Complete */}
        {currentStep === 'complete' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                  Notifications Sent Successfully!
                </CardTitle>
                <CardDescription>
                  All emails have been processed through Resend
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-600">{stats.successful}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>

                {stats.failed > 0 ? (
                  <div className="flex items-center gap-3 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        {stats.failed} notification{stats.failed !== 1 ? 's' : ''} failed to send
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Check Resend dashboard for detailed delivery reports and error information.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 border border-green-200 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        All notifications sent successfully via Resend!
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Emails are being delivered through Resend's secure email service.
                      </p>
                    </div>
                  </div>
                )}

                {/* Resend Dashboard Link */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Resend Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      View detailed email analytics, delivery status, and performance metrics in your Resend dashboard.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={viewResendDashboard}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Resend Dashboard
                    </Button>
                  </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Notification summary has been saved to your activity logs.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <DialogFooter className="flex gap-3 sm:gap-3 pt-6 border-t">
          {currentStep !== 'sending' && currentStep !== 'complete' && (
            <Button
              variant="outline"
              onClick={currentStep === 'selection' ? handleClose : handlePreviousStep}
              disabled={isSending}
            >
              {currentStep === 'selection' ? 'Cancel' : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </>
              )}
            </Button>
          )}

          <div className="flex-1" />

          {currentStep === 'complete' ? (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={handleRestart} className="flex-1">
                Send More Notifications
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          ) : currentStep === 'sending' ? (
            <Button variant="outline" disabled className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing with Resend...
            </Button>
          ) : (
            <Button 
              onClick={handleNextStep}
              disabled={!canProceed() || isSending}
              className="min-w-[120px]"
            >
              {currentStep === 'review' ? (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send via Resend
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}