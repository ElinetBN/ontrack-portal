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
            from: 'Tender Management <notifications@resend.dev>',
            to: [getSubmitterEmail(submission)],
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
            reply_to: 'support@yourdomain.com',
          })

          if (error) {
            throw new Error(`Resend API error: ${error.message}`)
          }

          // Log successful send
          console.log(`✅ Email sent to ${getSubmitterEmail(submission)} for submission ${submission.id}`)

          return {
            submissionId: submission.id,
            email: getSubmitterEmail(submission),
            status: 'sent',
            messageId: data?.id,
            timestamp: new Date().toISOString()
          }
        } catch (error) {
          console.error(`❌ Failed to send email for submission ${submission?.id}:`, error)
          return {
            submissionId: submission?.id || 'unknown',
            email: getSubmitterEmail(submission),
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
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

    // Log summary
    console.log(`📧 Notification summary: ${successful} successful, ${failed} failed out of ${validSubmissions.length} total`)

    return NextResponse.json({
      success: true,
      message: `Notifications processed: ${successful} successful, ${failed} failed`,
      total: validSubmissions.length,
      successful,
      failed,
      results: results.map(result => 
        result.status === 'fulfilled' ? result.value : { 
          status: 'failed', 
          error: 'Unknown error',
          timestamp: new Date().toISOString()
        }
      )
    })

  } catch (error) {
    console.error('🚨 Notification sending error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
  if (!submission) {
    return {
      subject: 'Application Update',
      html: '<p>No submission data available</p>',
      text: 'No submission data available'
    }
  }

  const applicantName = submission?.contactPerson || submission?.supplier || submission?.companyName || 'Applicant'
  const companyName = submission?.companyName || submission?.company || submission?.supplier || 'Company'
  const tenderTitle = submission?.tenderTitle || tenderDetails?.title || 'the tender'
  const applicationNumber = submission?.applicationNumber || submission?.id || 'N/A'
  const submissionDate = submission?.submissionDate || submission?.submittedAt || submission?.createdAt || new Date()

  // Check for missing documents
  const missingDocuments = submission?.documents?.filter((doc: any) => 
    doc.status === 'missing' || doc.status === 'rejected'
  ) || []

  const baseTemplates = {
    application_received: {
      subject: `Application Received - ${tenderTitle}`,
      html: buildEmailHTML(
        'Application Received',
        `
          <p>Dear <strong>${applicantName}</strong>,</p>
          <p>Thank you for submitting your application for <strong>${tenderTitle}</strong> on behalf of <strong>${companyName}</strong>.</p>
          <p>We have successfully received your application and it is now under review.</p>
          
          ${missingDocuments.length > 0 ? `
            <div class="warning-box">
              <h3>📋 Important: Missing Documents</h3>
              <p>The following documents are missing or require attention in your application:</p>
              <ul>
                ${missingDocuments.map((doc: any) => `<li>${doc.name}</li>`).join('')}
              </ul>
              <p><strong>Action Required:</strong> Please submit these documents within 7 days to ensure your application can proceed to the next stage.</p>
            </div>
          ` : ''}
          
          ${customMessage ? `<div class="info-box"><strong>Additional Note:</strong> ${customMessage}</div>` : ''}
          
          <div class="details-box">
            <h3>Application Details</h3>
            <table>
              <tr><td><strong>Application ID:</strong></td><td>${applicationNumber}</td></tr>
              <tr><td><strong>Company:</strong></td><td>${companyName}</td></tr>
              <tr><td><strong>Submission Date:</strong></td><td>${new Date(submissionDate).toLocaleDateString()}</td></tr>
            </table>
          </div>
          
          <p>We will notify you once the evaluation process is complete. This typically takes 2-3 weeks.</p>
        `,
        'received'
      ),
      text: buildEmailText(
        `Application Received - ${tenderTitle}`,
        `
Dear ${applicantName},

Thank you for submitting your application for ${tenderTitle} on behalf of ${companyName}.

We have successfully received your application and it is now under review.

${missingDocuments.length > 0 ? `
IMPORTANT: MISSING DOCUMENTS
The following documents are missing or require attention:
${missingDocuments.map((doc: any) => `• ${doc.name}`).join('\n')}

Please submit these documents within 7 days to ensure your application can proceed.
` : ''}

${customMessage ? `Additional Note: ${customMessage}\n` : ''}

APPLICATION DETAILS:
• Application ID: ${applicationNumber}
• Company: ${companyName}
• Submission Date: ${new Date(submissionDate).toLocaleDateString()}

We will notify you once the evaluation process is complete.

Best regards,
Tender Management Team
        `
      )
    },

    missing_documents: {
      subject: `Action Required: Missing Documents - ${tenderTitle}`,
      html: buildEmailHTML(
        'Missing Documents Required',
        `
          <p>Dear <strong>${applicantName}</strong>,</p>
          <p>We are reviewing your application for <strong>${tenderTitle}</strong> and have identified that the following documents are missing or require attention:</p>
          
          <div class="warning-box">
            <h3>📋 Required Documents</h3>
            <ul>
              ${missingDocuments.map((doc: any) => `<li><strong>${doc.name}</strong></li>`).join('')}
            </ul>
          </div>
          
          <div class="details-box">
            <h3>Application Details</h3>
            <table>
              <tr><td><strong>Application ID:</strong></td><td>${applicationNumber}</td></tr>
              <tr><td><strong>Company:</strong></td><td>${companyName}</td></tr>
              <tr><td><strong>Submission Date:</strong></td><td>${new Date(submissionDate).toLocaleDateString()}</td></tr>
            </table>
          </div>
          
          <p><strong>Action Required:</strong> Please submit these documents within <strong>7 days</strong> to ensure your application can proceed to the next stage of evaluation.</p>
          
          ${customMessage ? `<div class="info-box"><strong>Additional Instructions:</strong> ${customMessage}</div>` : ''}
          
          <p>If you have already submitted these documents or have any questions, please contact our support team immediately.</p>
        `,
        'warning'
      ),
      text: buildEmailText(
        `Action Required: Missing Documents - ${tenderTitle}`,
        `
URGENT: MISSING DOCUMENTS REQUIRED

Dear ${applicantName},

We are reviewing your application for ${tenderTitle} and have identified missing or incomplete documents.

MISSING DOCUMENTS:
${missingDocuments.map((doc: any) => `• ${doc.name}`).join('\n')}

APPLICATION DETAILS:
• Application ID: ${applicationNumber}
• Company: ${companyName}
• Submission Date: ${new Date(submissionDate).toLocaleDateString()}

ACTION REQUIRED: Please submit these documents within 7 days to ensure your application can proceed.

${customMessage ? `Additional Instructions: ${customMessage}\n` : ''}

If you have questions, please contact our support team immediately.

Best regards,
Tender Management Team
        `
      )
    },

    under_review: {
      subject: `Application Under Review - ${tenderTitle}`,
      html: buildEmailHTML(
        'Application Under Review',
        `
          <p>Dear <strong>${applicantName}</strong>,</p>
          <p>Your application for <strong>${tenderTitle}</strong> is now being reviewed by our evaluation committee.</p>
          
          <div class="info-box">
            <h3>Application Reference: ${applicationNumber}</h3>
          </div>
          
          ${customMessage ? `<div class="details-box"><strong>Update:</strong> ${customMessage}</div>` : ''}
          
          <p>We expect to complete the evaluation process within the next 2-3 weeks. You will be notified immediately once a decision has been made.</p>
          <p>Thank you for your patience.</p>
        `,
        'info'
      ),
      text: buildEmailText(
        `Application Under Review - ${tenderTitle}`,
        `
Dear ${applicantName},

Your application for ${tenderTitle} is now under review by our evaluation committee.

Application Reference: ${applicationNumber}

${customMessage ? `Update: ${customMessage}\n` : ''}

We expect to complete the evaluation process within 2-3 weeks. You will be notified immediately once a decision has been made.

Thank you for your patience.

Best regards,
Tender Management Team
        `
      )
    },

    awarded: {
      subject: `Congratulations! Your Application Has Been Awarded - ${tenderTitle}`,
      html: buildEmailHTML(
        'Application Awarded',
        `
          <p>Dear <strong>${applicantName}</strong>,</p>
          <p>We are pleased to inform you that your application for <strong>${tenderTitle}</strong> has been successful!</p>
          
          <div class="success-box">
            <h2>🎉 Congratulations to ${companyName}!</h2>
          </div>
          
          <div class="details-box">
            <h3>Award Details</h3>
            <table>
              <tr><td><strong>Application ID:</strong></td><td>${applicationNumber}</td></tr>
              <tr><td><strong>Company:</strong></td><td>${companyName}</td></tr>
              <tr><td><strong>Tender:</strong></td><td>${tenderTitle}</td></tr>
              ${submission?.bidAmount ? `<tr><td><strong>Awarded Amount:</strong></td><td>${submission.bidAmount}</td></tr>` : ''}
            </table>
          </div>
          
          ${customMessage ? `<div class="info-box"><strong>Next Steps:</strong> ${customMessage}</div>` : ''}
          
          <p>Our team will contact you shortly to discuss the next steps and contract formalities.</p>
        `,
        'success'
      ),
      text: buildEmailText(
        `Congratulations! Your Application Has Been Awarded - ${tenderTitle}`,
        `
CONGRATULATIONS!

Dear ${applicantName},

We are pleased to inform you that your application for ${tenderTitle} has been successful!

Congratulations to ${companyName}!

AWARD DETAILS:
• Application ID: ${applicationNumber}
• Company: ${companyName}
• Tender: ${tenderTitle}
${submission?.bidAmount ? `• Awarded Amount: ${submission.bidAmount}\n` : ''}

${customMessage ? `Next Steps: ${customMessage}\n` : ''}

Our team will contact you shortly to discuss next steps and contract formalities.

Best regards,
Tender Management Team
        `
      )
    },

    rejected: {
      subject: `Update on Your Application - ${tenderTitle}`,
      html: buildEmailHTML(
        'Application Update',
        `
          <p>Dear <strong>${applicantName}</strong>,</p>
          <p>Thank you for your interest and the effort put into your application for <strong>${tenderTitle}</strong>.</p>
          <p>After careful consideration, we regret to inform you that your application was not successful on this occasion.</p>
          
          <div class="info-box">
            <h3>Application Reference: ${applicationNumber}</h3>
          </div>
          
          ${customMessage ? `<div class="details-box"><strong>Feedback:</strong> ${customMessage}</div>` : '<p>We encourage you to apply for future tenders that match your company\'s capabilities.</p>'}
          
          <p>We appreciate your interest in working with us and encourage you to apply for future opportunities.</p>
        `,
        'info'
      ),
      text: buildEmailText(
        `Update on Your Application - ${tenderTitle}`,
        `
Dear ${applicantName},

Thank you for your application for ${tenderTitle}.

After careful consideration, we regret to inform you that your application was not successful this time.

Application Reference: ${applicationNumber}

${customMessage ? `Feedback: ${customMessage}\n` : "We encourage you to apply for future tenders that match your company's capabilities.\n"}

We appreciate your interest and encourage you to apply for future opportunities.

Best regards,
Tender Management Team
        `
      )
    },

    custom: {
      subject: `Update on Your Application - ${tenderTitle}`,
      html: buildEmailHTML(
        'Application Update',
        `
          <p>Dear <strong>${applicantName}</strong>,</p>
          <p>This message is regarding your application for <strong>${tenderTitle}</strong>.</p>
          
          <div class="info-box">
            <h3>Application Reference: ${applicationNumber}</h3>
          </div>
          
          <div class="details-box">
            ${customMessage || '<p>Please check the tender portal for updates on your application status.</p>'}
          </div>
        `,
        'info'
      ),
      text: buildEmailText(
        `Update on Your Application - ${tenderTitle}`,
        `
Dear ${applicantName},

Update regarding your application for ${tenderTitle}.

Application Reference: ${applicationNumber}

${customMessage || 'Please check the tender portal for updates on your application status.'}

Best regards,
Tender Management Team
        `
      )
    }
  }

  return baseTemplates[messageType as keyof typeof baseTemplates] || baseTemplates.custom
}

function buildEmailHTML(title: string, content: string, type: 'received' | 'warning' | 'info' | 'success' = 'info') {
  const colors = {
    received: { primary: '#2563eb', bg: '#dbeafe' },
    warning: { primary: '#d97706', bg: '#fef3c7' },
    info: { primary: '#2563eb', bg: '#dbeafe' },
    success: { primary: '#059669', bg: '#d1fae5' }
  }

  const color = colors[type]

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #374151; 
      margin: 0; 
      padding: 0; 
      background-color: #f9fafb;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: ${color.primary}; 
      color: white; 
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 24px; 
      font-weight: 600;
    }
    .content { 
      padding: 30px; 
    }
    .footer { 
      padding: 20px; 
      text-align: center; 
      color: #6b7280; 
      font-size: 14px; 
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .details-box, .info-box, .warning-box, .success-box { 
      background: ${color.bg}; 
      padding: 20px; 
      border-radius: 8px; 
      margin: 20px 0; 
      border-left: 4px solid ${color.primary};
    }
    .warning-box { 
      background: #fef3c7; 
      border-left-color: #d97706;
    }
    .success-box { 
      background: #d1fae5; 
      border-left-color: #059669;
      text-align: center;
    }
    table { width: 100%; border-collapse: collapse; }
    table td { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    table td:first-child { font-weight: 600; width: 140px; }
    ul { margin: 10px 0; padding-left: 20px; }
    li { margin: 5px 0; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background: ${color.primary}; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px; 
      margin: 10px 0; 
    }
    @media (max-width: 600px) {
      .content { padding: 20px; }
      .header { padding: 20px 15px; }
      .header h1 { font-size: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>This is an automated message from Tender Management System. Please do not reply to this email.</p>
      <p>If you have questions, contact our support team.</p>
    </div>
  </div>
</body>
</html>
  `
}

function buildEmailText(subject: string, content: string) {
  return content.trim()
}

function getSubmitterEmail(submission: any): string {
  return submission?.contactEmail || submission?.submitter?.email || 'no-email@example.com'
}