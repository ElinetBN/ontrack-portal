// app/api/notifications/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { submissions, messageType, customMessage, tenderDetails } = await request.json()

    if (!submissions || !Array.isArray(submissions)) {
      return NextResponse.json(
        { success: false, error: 'Submissions array is required' },
        { status: 400 }
      )
    }

    // Filter out invalid submissions
    const validSubmissions = submissions.filter(sub => 
      sub && getSubmitterEmail(sub) && getSubmitterEmail(sub) !== 'no-email@example.com'
    )

    if (validSubmissions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid submissions with email addresses found' },
        { status: 400 }
      )
    }

    const results = await Promise.allSettled(
      validSubmissions.map(async (submission) => {
        try {
          const emailContent = generateEmailContent(
            submission,
            messageType,
            customMessage,
            tenderDetails
          )

          const { data, error } = await resend.emails.send({
            from: 'Tender Management <notifications@yourdomain.com>',
            to: [getSubmitterEmail(submission)],
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          })

          if (error) {
            throw new Error(`Email failed: ${error.message}`)
          }

          return {
            submissionId: submission.id,
            email: getSubmitterEmail(submission),
            status: 'sent',
            messageId: data?.id
          }
        } catch (error) {
          console.error(`Failed to send email for submission ${submission?.id}:`, error)
          return {
            submissionId: submission?.id || 'unknown',
            email: getSubmitterEmail(submission),
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.status === 'sent'
    ).length

    const failed = results.filter(result => 
      result.status === 'fulfilled' && result.value.status === 'failed'
    ).length

    return NextResponse.json({
      success: true,
      message: `Notifications sent: ${successful} successful, ${failed} failed`,
      total: validSubmissions.length,
      results: results.map(result => 
        result.status === 'fulfilled' ? result.value : { status: 'failed', error: 'Unknown error' }
      )
    })

  } catch (error) {
    console.error('Notification sending error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}

function generateEmailContent(
  submission: any,
  messageType: string,
  customMessage?: string,
  tenderDetails?: any
) {
  // Add null checks
  if (!submission) {
    return {
      subject: 'Application Update',
      html: '<p>No submission data available</p>',
      text: 'No submission data available'
    }
  }

  // Use the correct field names from your Submission type with proper null checks
  const applicantName = submission?.contactPerson || submission?.supplier || submission?.companyName || 'Applicant'
  const companyName = submission?.companyName || submission?.company || submission?.supplier || 'Company'
  const tenderTitle = submission?.tenderTitle || tenderDetails?.title || 'the tender'
  const applicationNumber = submission?.applicationNumber || submission?.id || 'N/A'
  const submissionDate = submission?.submissionDate || submission?.submittedAt || submission?.createdAt || new Date()

  const baseTemplates = {
    application_received: {
      subject: `Application Received - ${tenderTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; background: #f9fafb; border-radius: 0 0 8px 8px; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
            .details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Received</h1>
            </div>
            <div class="content">
              <p>Dear ${applicantName},</p>
              <p>Thank you for submitting your application for <strong>${tenderTitle}</strong> on behalf of <strong>${companyName}</strong>.</p>
              <p>We have successfully received your application and it is now under review.</p>
              
              ${customMessage ? `<div class="details"><strong>Additional Note:</strong> ${customMessage}</div>` : ''}
              
              <div class="details">
                <strong>Application Details:</strong>
                <ul>
                  <li><strong>Application ID:</strong> ${applicationNumber}</li>
                  <li><strong>Company:</strong> ${companyName}</li>
                  <li><strong>Submission Date:</strong> ${new Date(submissionDate).toLocaleDateString()}</li>
                </ul>
              </div>
              
              <p>We will notify you once the evaluation process is complete. This typically takes 2-3 weeks.</p>
              <p>Best regards,<br><strong>Tender Management Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Dear ${applicantName}, Thank you for submitting your application for ${tenderTitle} on behalf of ${companyName}. We have successfully received your application (Reference: ${applicationNumber}) and it is now under review. We will notify you once the evaluation process is complete. Best regards, Tender Management Team`
    },
    
    under_review: {
      subject: `Application Under Review - ${tenderTitle}`,
      html: `
        <div class="container">
          <div class="header">
            <h1>Application Under Review</h1>
          </div>
          <div class="content">
            <p>Dear ${applicantName},</p>
            <p>Your application for <strong>${tenderTitle}</strong> is now being reviewed by our evaluation committee.</p>
            
            <div class="details">
              <strong>Application Reference:</strong> ${applicationNumber}
            </div>
            
            ${customMessage ? `<div class="details"><strong>Update:</strong> ${customMessage}</div>` : ''}
            
            <p>We expect to complete the evaluation process within the stipulated timeframe. You will be notified immediately once a decision has been made.</p>
            <p>Thank you for your patience.</p>
            <p>Best regards,<br><strong>Tender Management Team</strong></p>
          </div>
        </div>
      `,
      text: `Dear ${applicantName}, Your application for ${tenderTitle} (Reference: ${applicationNumber}) is now under review by our evaluation committee. We expect to complete the evaluation process within the stipulated timeframe. You will be notified immediately once a decision has been made. Thank you for your patience. Best regards, Tender Management Team`
    },
    
    awarded: {
      subject: `Congratulations! Your Application Has Been Awarded - ${tenderTitle}`,
      html: `
        <div class="container">
          <div class="header" style="background: #10b981;">
            <h1>Application Awarded</h1>
          </div>
          <div class="content">
            <p>Dear ${applicantName},</p>
            <p>We are pleased to inform you that your application for <strong>${tenderTitle}</strong> has been successful!</p>
            <p style="font-size: 18px; font-weight: bold; color: #10b981;">Congratulations to ${companyName}!</p>
            
            <div class="details" style="border-left-color: #10b981;">
              <strong>Award Details:</strong>
              <ul>
                <li><strong>Application ID:</strong> ${applicationNumber}</li>
                <li><strong>Company:</strong> ${companyName}</li>
                <li><strong>Tender:</strong> ${tenderTitle}</li>
                ${submission?.bidAmount ? `<li><strong>Awarded Amount:</strong> ${submission.bidAmount}</li>` : ''}
              </ul>
            </div>
            
            ${customMessage ? `<div class="details" style="border-left-color: #10b981;"><strong>Next Steps:</strong> ${customMessage}</div>` : ''}
            
            <p>Our team will contact you shortly to discuss the next steps and contract formalities.</p>
            <p>Best regards,<br><strong>Tender Management Team</strong></p>
          </div>
        </div>
      `,
      text: `Dear ${applicantName}, Congratulations! Your application for ${tenderTitle} has been awarded to ${companyName}. Application Reference: ${applicationNumber}. Our team will contact you shortly to discuss next steps. ${customMessage ? 'Next Steps: ' + customMessage : ''} Best regards, Tender Management Team`
    },
    
    rejected: {
      subject: `Update on Your Application - ${tenderTitle}`,
      html: `
        <div class="container">
          <div class="header" style="background: #ef4444;">
            <h1>Application Update</h1>
          </div>
          <div class="content">
            <p>Dear ${applicantName},</p>
            <p>Thank you for your interest and the effort put into your application for <strong>${tenderTitle}</strong>.</p>
            <p>After careful consideration, we regret to inform you that your application was not successful on this occasion.</p>
            
            <div class="details" style="border-left-color: #ef4444;">
              <strong>Application Reference:</strong> ${applicationNumber}
            </div>
            
            ${customMessage ? `<div class="details" style="border-left-color: #ef4444;"><strong>Feedback:</strong> ${customMessage}</div>` : '<p>We encourage you to apply for future tenders that match your company\'s capabilities.</p>'}
            
            <p>We appreciate your interest in working with us and encourage you to apply for future opportunities.</p>
            <p>Best regards,<br><strong>Tender Management Team</strong></p>
          </div>
        </div>
      `,
      text: `Dear ${applicantName}, Thank you for your application for ${tenderTitle}. After careful consideration, we regret to inform you that your application (Reference: ${applicationNumber}) was not successful this time. ${customMessage ? 'Feedback: ' + customMessage : "We encourage you to apply for future tenders that match your company's capabilities."} Best regards, Tender Management Team`
    },
    
    custom: {
      subject: `Update on Your Application - ${tenderTitle}`,
      html: `
        <div class="container">
          <div class="header">
            <h1>Application Update</h1>
          </div>
          <div class="content">
            <p>Dear ${applicantName},</p>
            <p>This message is regarding your application for <strong>${tenderTitle}</strong>.</p>
            
            <div class="details">
              <strong>Application Reference:</strong> ${applicationNumber}
            </div>
            
            <div class="details">
              ${customMessage || 'Please check the tender portal for updates on your application status.'}
            </div>
            
            <p>Best regards,<br><strong>Tender Management Team</strong></p>
          </div>
        </div>
      `,
      text: `Dear ${applicantName}, Update regarding your application for ${tenderTitle}. Application Reference: ${applicationNumber}. ${customMessage || 'Please check the tender portal for updates.'} Best regards, Tender Management Team`
    }
  }

  return baseTemplates[messageType as keyof typeof baseTemplates] || baseTemplates.custom
}

function getSubmitterEmail(submission: any): string {
  return submission?.contactEmail || submission?.submitter?.email || 'no-email@example.com'
}