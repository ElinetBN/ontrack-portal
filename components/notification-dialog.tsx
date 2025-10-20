// components/notification-dialog.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Users, AlertCircle, CheckCircle2 } from "lucide-react"
import { Submission } from "../types"

interface NotificationDialogProps {
  isOpen: boolean
  onClose: () => void
  submissions: Submission[]
  tenderTitle: string
}

type NotificationType = 'application_received' | 'under_review' | 'awarded' | 'rejected' | 'custom'

export function NotificationDialog({ isOpen, onClose, submissions, tenderTitle }: NotificationDialogProps) {
  const [notificationType, setNotificationType] = useState<NotificationType>('application_received')
  const [customMessage, setCustomMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [results, setResults] = useState<any[] | null>(null)

  const handleSendNotifications = async () => {
    if (submissions.length === 0) return

    setSending(true)
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissions,
          messageType: notificationType,
          customMessage: customMessage || undefined,
          tenderDetails: { title: tenderTitle }
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResults(data.results)
      } else {
        throw new Error(data.error || 'Failed to send notifications')
      }
    } catch (error) {
      console.error('Error sending notifications:', error)
      setResults([{ status: 'error', message: 'Failed to send notifications' }])
    } finally {
      setSending(false)
    }
  }

  const getTemplatePreview = () => {
    if (submissions.length === 0) {
      return "No submissions available for preview."
    }
    
    const sampleSubmission = submissions[0]
    const content = generateEmailContent(
      sampleSubmission,
      notificationType,
      customMessage,
      { title: tenderTitle }
    )
    return content.text
  }

  const successfulCount = results?.filter(r => r.status === 'sent').length || 0
  const failedCount = results?.filter(r => r.status === 'failed').length || 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Notifications to Applicants
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">
                  Sending to {submissions.length} applicant{submissions.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-blue-700">
                  {tenderTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Notification Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Notification Type</label>
            <Select value={notificationType} onValueChange={(value: NotificationType) => setNotificationType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="application_received">Application Received</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="custom">Custom Message</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Message */}
          {(notificationType === 'custom' || notificationType === 'rejected' || notificationType === 'awarded') && (
            <div className="space-y-3">
              <label className="text-sm font-medium">
                {notificationType === 'custom' ? 'Custom Message' : 'Additional Details'}
              </label>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={
                  notificationType === 'rejected' ? 'Provide constructive feedback...' :
                  notificationType === 'awarded' ? 'Provide next steps and instructions...' :
                  'Enter your custom message...'
                }
                rows={4}
              />
            </div>
          )}

          {/* Preview */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Message Preview</label>
            <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-600">
              {getTemplatePreview()}
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className={`p-4 rounded-lg border ${
              failedCount === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {failedCount === 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <p className="font-medium">
                    {failedCount === 0 ? 'All notifications sent successfully!' : 'Some notifications failed'}
                  </p>
                  <p className="text-sm">
                    Successful: <Badge variant="outline" className="ml-1">{successfulCount}</Badge>{' '}
                    Failed: <Badge variant="outline" className="ml-1">{failedCount}</Badge>
                  </p>
                </div>
              </div>
              
              {failedCount > 0 && (
                <div className="text-sm space-y-2">
                  <p className="font-medium">Failed deliveries:</p>
                  {results.filter(r => r.status === 'failed').map((result, index) => (
                    <p key={index} className="text-red-600">
                      {result.email}: {result.error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendNotifications} 
            disabled={sending || submissions.length === 0}
            className="gap-2"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send to {submissions.length} Applicant{submissions.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper function for preview with proper null checks
function generateEmailContent(
  submission: any, 
  messageType: string, 
  customMessage?: string, 
  tenderDetails?: any
) {
  // Add null checks for submission
  if (!submission) {
    return {
      text: "No submission data available for preview."
    }
  }

  // Use the correct field names from your Submission type with proper null checks
  const applicantName = submission?.contactPerson || submission?.supplier || submission?.companyName || 'Applicant'
  const companyName = submission?.companyName || submission?.company || submission?.supplier || 'Company'
  const tenderTitle = submission?.tenderTitle || tenderDetails?.title || 'the tender'
  const applicationNumber = submission?.applicationNumber || submission?.id || 'N/A'

  // Template definitions with proper string concatenation
  const templates = {
    application_received: {
      text: `Dear ${applicantName}, Thank you for submitting your application for ${tenderTitle} on behalf of ${companyName}. We have successfully received your application (Reference: ${applicationNumber}) and it is now under review. We will notify you once the evaluation process is complete. Best regards, Tender Management Team`
    },
    under_review: {
      text: `Dear ${applicantName}, Your application for ${tenderTitle} (Reference: ${applicationNumber}) is now under review by our evaluation committee. We expect to complete the evaluation process within the stipulated timeframe. You will be notified immediately once a decision has been made. Thank you for your patience. Best regards, Tender Management Team`
    },
    awarded: {
      text: `Dear ${applicantName}, Congratulations! Your application for ${tenderTitle} has been awarded to ${companyName}. Application Reference: ${applicationNumber}. Our team will contact you shortly to discuss the next steps and contract formalities. ${customMessage ? 'Next Steps: ' + customMessage : ''} Best regards, Tender Management Team`
    },
    rejected: {
      text: `Dear ${applicantName}, Thank you for your interest and the effort put into your application for ${tenderTitle}. After careful consideration, we regret to inform you that your application (Reference: ${applicationNumber}) was not successful on this occasion. ${customMessage ? 'Feedback: ' + customMessage : "We encourage you to apply for future tenders that match your company's capabilities."} Best regards, Tender Management Team`
    },
    custom: {
      text: `Dear ${applicantName}, This message is regarding your application for ${tenderTitle}. Application Reference: ${applicationNumber}. ${customMessage || 'Please check the tender portal for updates on your application status.'} Best regards, Tender Management Team`
    }
  }

  return templates[messageType as keyof typeof templates] || templates.custom
}