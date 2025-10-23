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

    // Filter out invalid submissions and validate emails
    const validSubmissions = submissions.filter(sub => {
      const email = getSubmitterEmail(sub)
      return sub && email && email !== 'no-email@example.com' && isValidEmail(email)
    })

    if (validSubmissions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid submissions with valid email addresses found' },
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

          const submitterEmail = getSubmitterEmail(submission)
          
          console.log(`📧 Attempting to send email to: ${submitterEmail} for submission: ${submission.id}`)

          const { data, error } = await resend.emails.send({
            from: 'Tender Management <notifications@resend.dev>',
            to: [submitterEmail],
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
            reply_to: 'support@yourdomain.com',
          })

          if (error) {
            console.error(`❌ Resend API error for ${submitterEmail}:`, error)
            throw new Error(`Email service error: ${error.message}`)
          }

          console.log(`✅ Email sent successfully to ${submitterEmail}, Message ID: ${data?.id}`)

          return {
            submissionId: submission.id,
            applicantName: submission.contactPerson || submission.supplier || 'Unknown',
            companyName: submission.companyName || submission.company || 'Unknown',
            email: submitterEmail,
            status: 'sent',
            messageId: data?.id,
            timestamp: new Date().toISOString()
          }
        } catch (error) {
          console.error(`🚨 Failed to send email for submission ${submission?.id}:`, error)
          return {
            submissionId: submission?.id || 'unknown',
            applicantName: submission?.contactPerson || submission?.supplier || 'Unknown',
            companyName: submission?.companyName || submission?.company || 'Unknown',
            email: getSubmitterEmail(submission),
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString()
          }
        }
      })
    )

    // Process results
    const fulfilledResults = results.map(result => 
      result.status === 'fulfilled' ? result.value : {
        status: 'failed',
        error: 'Promise rejected',
        timestamp: new Date().toISOString()
      }
    )

    const successful = fulfilledResults.filter(result => result.status === 'sent').length
    const failed = fulfilledResults.filter(result => result.status === 'failed').length
    const failedDetails = fulfilledResults.filter(result => result.status === 'failed')

    // Log detailed summary
    console.log('📊 Notification Summary:', {
      total: validSubmissions.length,
      successful,
      failed,
      failedDetails: failedDetails.map(f => ({
        email: f.email,
        error: f.error,
        submissionId: f.submissionId
      }))
    })

    return NextResponse.json({
      success: true,
      message: `Notifications processed: ${successful} successful, ${failed} failed`,
      total: validSubmissions.length,
      successful,
      failed,
      results: fulfilledResults,
      failedDetails: failedDetails
    })

  } catch (error) {
    console.error('🚨 Critical notification sending error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send notifications',
        details: error instanceof Error ? error.message : 'Unknown system error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ... keep the existing generateEmailContent, buildEmailHTML, buildEmailText functions the same ...

function getSubmitterEmail(submission: any): string {
  return submission?.contactEmail || submission?.submitter?.email || 'no-email@example.com'
}