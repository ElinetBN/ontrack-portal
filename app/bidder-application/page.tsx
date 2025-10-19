// app/bidder-application/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { TenderApplicationForm } from "@/components/tender-application-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, AlertCircle, FileText, Calendar, DollarSign, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

// API Client for submissions
class TenderApplicationAPI {
  private static baseURL = '/api/tender-applications'

  static async submitApplication(data: any) {
    try {
      console.log('Submitting application to:', this.baseURL)
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Submission API response:', result)
      return result
    } catch (error) {
      console.error('Error in submitApplication:', error)
      throw error
    }
  }

  static async uploadDocument(file: File, tenderId: string, applicationId: string) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tenderId', tenderId)
      formData.append('applicationId', applicationId)

      const response = await fetch(`${this.baseURL}/documents`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload document')
      }

      return response.json()
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  }
}

// Keep your existing TenderAPI class and helper functions from your original code
class TenderAPI {
  private static baseURL = '/api/tenders';

  static async getTenderById(id: string) {
    try {
      console.log('Fetching tender by ID:', id);
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tender: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Tender API response:', result);
      return result;
    } catch (error) {
      console.error('Error fetching tender by ID:', error);
      throw error;
    }
  }

  static async getTenders(filters?: any) {
    try {
      console.log('Fetching tenders with filters:', filters);
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const url = `${this.baseURL}?${params.toString()}`;
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tenders: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Tenders API response:', result);
      return result;
    } catch (error) {
      console.error('Error fetching tenders:', error);
      throw error;
    }
  }
}

// Keep your existing helper functions...
const extractBudgetValue = (budget: string | number | undefined | null): number => {
  if (typeof budget === 'number') {
    return budget;
  }
  
  if (!budget) {
    return 0;
  }
  
  try {
    const numericString = budget.toString().replace(/[^0-9]/g, '');
    return parseInt(numericString) || 0;
  } catch (error) {
    console.warn('Error parsing budget:', budget, error);
    return 0;
  }
};

const formatBudget = (value: number | string | undefined | null, currency: string = 'ZAR'): string => {
  const numericValue = typeof value === 'number' ? value : extractBudgetValue(value);
  return `${currency} ${numericValue?.toLocaleString() || '0'}`;
};

const extractContactPerson = (contactPerson: any): string => {
  if (typeof contactPerson === 'string') {
    return contactPerson;
  }
  
  if (contactPerson && typeof contactPerson === 'object') {
    return contactPerson.name || contactPerson.fullName || '';
  }
  
  return '';
};

const extractContactEmail = (contactPerson: any): string => {
  if (typeof contactPerson === 'string') {
    return '';
  }
  
  if (contactPerson && typeof contactPerson === 'object') {
    return contactPerson.email || '';
  }
  
  return '';
};

const extractContactPhone = (contactPerson: any): string => {
  if (typeof contactPerson === 'string') {
    return '';
  }
  
  if (contactPerson && typeof contactPerson === 'object') {
    return contactPerson.phone || contactPerson.phoneNumber || '';
  }
  
  return '';
};

const mapApiTenderToDashboard = (apiTender: any) => {
  const statusMap = {
    'open': 'Open',
    'closed': 'Closed',
    'awarded': 'Awarded',
    'pending': 'Draft',
    'cancelled': 'Closed',
    'draft': 'Draft'
  };

  const budgetValue = apiTender.value || apiTender.budget || 0;
  const formattedBudget = formatBudget(budgetValue, apiTender.currency);

  const contactPerson = extractContactPerson(apiTender.contactPerson);
  const contactEmail = extractContactEmail(apiTender.contactPerson) || apiTender.contactEmail || '';
  const contactPhone = extractContactPhone(apiTender.contactPerson) || apiTender.contactPhone || '';

  const tenderId = apiTender._id || apiTender.id || `temp-${Date.now()}`;
  const referenceNumber = apiTender.tenderNumber || apiTender.referenceNumber || `TND-${Date.now()}`;

  return {
    id: tenderId,
    title: apiTender.title || 'Untitled Tender',
    department: apiTender.organization || apiTender.department || 'General',
    status: statusMap[apiTender.status] || 'Draft',
    deadline: apiTender.closingDate || apiTender.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    budget: formattedBudget,
    submissions: apiTender.submissions || 0,
    category: apiTender.category || 'General',
    description: apiTender.description || '',
    referenceNumber: referenceNumber,
    requestedItems: apiTender.requirements || apiTender.requestedItems || [],
    createdDate: apiTender.createdAt || apiTender.publishDate || apiTender.createdDate || new Date().toISOString(),
    location: apiTender.location || '',
    contractPeriod: apiTender.contractPeriod || '',
    cidbGrading: apiTender.cidbGrading || '',
    bbbeeLevel: apiTender.bbbeeLevel || '',
    contactPerson: contactPerson,
    contactEmail: contactEmail,
    contactPhone: contactPhone,
    submissionMethod: apiTender.submissionMethod || 'online',
    tenderFee: apiTender.tenderFee || 'No fee',
    advertisementLink: apiTender.advertisementLink || `https://example.gov.za/tenders/${referenceNumber}`,
    bidderApplicationLink: apiTender.bidderApplicationLink || '',
    isDraft: apiTender.status === 'draft' || apiTender.status === 'pending' || apiTender.isDraft === true,
    createdBy: apiTender.createdBy,
    requiresApproval: apiTender.requiresApproval
  };
};

async function fetchTenderById(tenderId: string) {
  try {
    console.log('Fetching tender data for ID:', tenderId)
    
    try {
      const response = await TenderAPI.getTenderById(tenderId)
      
      if (response.success && response.data) {
        console.log('Tender data fetched successfully by ID:', response.data)
        return mapApiTenderToDashboard(response.data)
      }
    } catch (idError) {
      console.warn('Failed to fetch tender by ID, trying to find in list:', idError)
    }

    const allTendersResponse = await TenderAPI.getTenders({ limit: 100 })
    
    if (allTendersResponse.success && allTendersResponse.data) {
      const foundTender = allTendersResponse.data.find((tender: any) => {
        const tenderIdToCompare = tender._id || tender.id;
        return tenderIdToCompare === tenderId || 
               tender.tenderNumber === tenderId || 
               tender.referenceNumber === tenderId;
      })
      
      if (foundTender) {
        console.log('Tender found in list:', foundTender)
        return mapApiTenderToDashboard(foundTender)
      }
    }

    console.error('Tender not found in API response')
    return null
    
  } catch (error) {
    console.error('Error fetching tender from API:', error)
    throw new Error('Failed to load tender information from server. Please try again later.')
  }
}

export default function BidderApplicationPage() {
  const searchParams = useSearchParams()
  const tenderId = searchParams.get('tenderId')
  const ref = searchParams.get('ref')
  
  const [tender, setTender] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  useEffect(() => {
    const loadTender = async () => {
      if (!tenderId) {
        setError("Tender ID is missing from the URL")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        console.log('Loading tender with ID:', tenderId)
        const tenderData = await fetchTenderById(tenderId)
        
        if (tenderData) {
          console.log('Tender loaded successfully:', tenderData)
          setTender(tenderData)
        } else {
          setError("Tender not found. The tender may have been removed, expired, or the link is invalid.")
        }
      } catch (err: any) {
        console.error("Error loading tender:", err)
        setError(err.message || "Failed to load tender information. Please check your connection and try again.")
      } finally {
        setLoading(false)
      }
    }

    loadTender()
  }, [tenderId])

  const handleApplicationSubmit = async (applicationData: any) => {
    try {
      console.log('Submitting application for tender:', tenderId)
      console.log('Application data:', applicationData)
      
      // Prepare submission data
      const submissionData = {
        ...applicationData,
        tenderId: tender.id,
        tenderTitle: tender.title,
        tenderReference: tender.referenceNumber,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        // Remove file objects from the data sent to API (handle separately if needed)
        uploadedDocuments: applicationData.uploadedDocuments.map((doc: any) => ({
          name: doc.name,
          type: doc.type,
          size: doc.file.size
        })),
        supportingDocuments: applicationData.supportingDocuments.map((doc: any) => ({
          name: doc.name,
          type: doc.type,
          size: doc.file.size
        }))
      }

      // Submit to API
      const response = await TenderApplicationAPI.submitApplication(submissionData)
      
      if (response.success) {
        const newSubmissionId = response.data.id || response.data.submissionId
        setSubmissionId(newSubmissionId)
        setSubmissionSuccess(true)
        
        // Optional: Handle file uploads separately if your API supports it
        try {
          // Upload main documents
          for (const fileDoc of applicationData.uploadedDocuments) {
            await TenderApplicationAPI.uploadDocument(fileDoc.file, tender.id, newSubmissionId)
          }
          
          // Upload supporting documents
          for (const fileDoc of applicationData.supportingDocuments) {
            await TenderApplicationAPI.uploadDocument(fileDoc.file, tender.id, newSubmissionId)
          }
        } catch (uploadError) {
          console.warn('Document upload failed, but submission was successful:', uploadError)
        }

        // Close the form after successful submission
        setTimeout(() => {
          setShowApplicationForm(false)
        }, 2000)
        
      } else {
        throw new Error(response.message || 'Failed to submit application')
      }
      
    } catch (error: any) {
      console.error('Error submitting application:', error)
      throw new Error(error.message || 'Failed to submit application. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading tender information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="font-semibold">Unable to Load Tender</h3>
                <p className="text-muted-foreground mt-2">{error}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tender ID: {tenderId}
                </p>
              </div>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="font-semibold">Tender Not Found</h3>
                <p className="text-muted-foreground mt-2">
                  The tender you're looking for doesn't exist or has been removed.
                </p>
              </div>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = new Date(tender.deadline) < new Date()
  const isDraft = tender.status === "Draft" || tender.isDraft

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portal
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Bidder Application Portal</h1>
                <p className="text-muted-foreground">
                  Tender Reference: {tender.referenceNumber || ref}
                </p>
              </div>
            </div>
            <Badge variant={
              isExpired ? "destructive" : 
              isDraft ? "outline" : 
              "default"
            }>
              {isExpired ? "Closed" : isDraft ? "Draft" : "Open"}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {submissionSuccess ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-green-900">Application Submitted Successfully!</h2>
                    <p className="text-green-700 mt-2">
                      Your bid application for <strong>{tender.title}</strong> has been submitted.
                    </p>
                    {submissionId && (
                      <p className="text-sm text-green-600 mt-1">
                        Reference Number: <strong>{submissionId}</strong>
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>You will receive a confirmation email shortly.</p>
                    <p>You can track your application status in the supplier portal.</p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button asChild>
                      <Link href="/">
                        Return to Portal
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={() => setSubmissionSuccess(false)}>
                      View Tender Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !showApplicationForm ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Success Alert after submission */}
            {submissionSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your application has been submitted successfully! Submission ID: {submissionId}
                </AlertDescription>
              </Alert>
            )}

            {/* Tender Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  {tender.title}
                </CardTitle>
                <CardDescription>
                  Reference: {tender.referenceNumber || ref} | Category: {tender.category} | Department: {tender.department}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Budget</p>
                      <p className="text-lg font-bold">{tender.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Deadline</p>
                      <p className="text-lg font-bold">{new Date(tender.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Submissions</p>
                      <p className="text-lg font-bold">{tender.submissions || 0}</p>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                {tender.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{tender.description}</p>
                  </div>
                )}

                {/* Requirements */}
                {tender.requestedItems && tender.requestedItems.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      {tender.requestedItems.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Additional Tender Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  {tender.location && (
                    <div>
                      <span className="font-medium">Location:</span> {tender.location}
                    </div>
                  )}
                  {tender.contractPeriod && (
                    <div>
                      <span className="font-medium">Contract Period:</span> {tender.contractPeriod}
                    </div>
                  )}
                  {tender.cidbGrading && tender.cidbGrading !== 'N/A' && (
                    <div>
                      <span className="font-medium">CIDB Grading:</span> {tender.cidbGrading}
                    </div>
                  )}
                  {tender.bbbeeLevel && (
                    <div>
                      <span className="font-medium">B-BBEE Level:</span> {tender.bbbeeLevel}
                    </div>
                  )}
                  {tender.submissionMethod && (
                    <div>
                      <span className="font-medium">Submission Method:</span> {tender.submissionMethod}
                    </div>
                  )}
                  {tender.tenderFee && (
                    <div>
                      <span className="font-medium">Tender Fee:</span> {tender.tenderFee}
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                {(tender.contactPerson || tender.contactEmail || tender.contactPhone) && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {tender.contactPerson && (
                        <div>
                          <span className="font-medium">Contact Person:</span> {tender.contactPerson}
                        </div>
                      )}
                      {tender.contactEmail && (
                        <div>
                          <span className="font-medium">Email:</span> {tender.contactEmail}
                        </div>
                      )}
                      {tender.contactPhone && (
                        <div>
                          <span className="font-medium">Phone:</span> {tender.contactPhone}
                        </div>
                      )}
                      {tender.department && (
                        <div>
                          <span className="font-medium">Department:</span> {tender.department}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    onClick={() => setShowApplicationForm(true)}
                    size="lg"
                    disabled={isExpired || isDraft}
                    className="flex-1"
                  >
                    {isExpired ? "Tender Closed" : isDraft ? "Tender Not Published" : "Start Application"}
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link href="/">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Return to Portal
                    </Link>
                  </Button>
                </div>

                {isExpired && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      This tender has closed. The deadline was {new Date(tender.deadline).toLocaleDateString()}.
                    </p>
                  </div>
                )}

                {isDraft && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      This tender is currently in draft mode and not yet published for applications.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <TenderApplicationForm
            isOpen={showApplicationForm}
            onClose={() => setShowApplicationForm(false)}
            tender={tender}
            onApply={handleApplicationSubmit}
          />
        )}
      </main>
    </div>
  )
}