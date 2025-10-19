"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortalHeader } from "@/components/portal-header"
import { FileText } from "lucide-react"

// Import all the sub-components
import { DashboardTab } from "./dashboard-tab"
import { TendersTab } from "./tenders-tab"
import { SubmissionsTab } from "./submissions-tab"
import { EvaluationTab } from "./evaluation-tab"
import { ContractsTab } from "./contracts-tab"
import { ReviewTab } from "./review-tab"
import { TenderRegistrationPopup } from "./tender-registration-popup"
import { TenderInfoPopup } from "./tender-info-popup"
import { CalendarSidebar } from "./calendar-sidebar"
import { TenderApplicationForm } from "./tender-application-form"

// Import data and types
import { initialTenders, initialSubmissions } from "../data/mock-data"
import { useTenderManagement } from "../hooks/use-tender-management"
import { Tender, Submission } from "../types"

// API function to fetch submissions from database
async function fetchSubmissionsFromDB() {
  try {
    console.log('🔄 Fetching submissions from /api/tender-applications...');
    const response = await fetch('/api/tender-applications');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch submissions: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('📦 API Response - Success:', result.success, 'Count:', result.count);
    
    return result.success ? result.data : [];
  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    return [];
  }
}

export function TenderProcurementDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [selectedTenderInfo, setSelectedTenderInfo] = useState<Tender | null>(null)
  const [showTenderInfo, setShowTenderInfo] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [selectedTenderForApplication, setSelectedTenderForApplication] = useState<Tender | null>(null)
  const [dbSubmissions, setDbSubmissions] = useState<Submission[]>(initialSubmissions)
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)

  const {
    tenders,
    submissions: initialSubmissionsData,
    handleTenderCreate,
    handleTenderUpdate,
    handleTenderDelete,
    handleDocumentsUpdate,
    handleEvaluationComplete,
    handleTenderStatusChange,
    handleTenderPublish,
    refreshTenders,
    openBidderApplicationByLink
  } = useTenderManagement(initialTenders, initialSubmissions)

  // Mock user role
  const [userRole] = useState<'admin' | 'super_admin' | 'user'>('super_admin')

  // Fetch submissions from database on component mount
  useEffect(() => {
    const loadSubmissions = async () => {
      setLoadingSubmissions(true)
      try {
        const submissionsData = await fetchSubmissionsFromDB()
        console.log('📊 Main Component: Loaded submissions from DB:', submissionsData.length);
        
        if (submissionsData.length > 0) {
          // Map database submissions to Submission type with submitter details
          const mappedSubmissions: Submission[] = submissionsData.map((sub: any) => {
            const mappedSubmission: Submission = {
              id: sub._id || sub.id,
              tenderId: (sub.tender && sub.tender._id) || sub.tender || 'unknown-tender',
              supplier: sub.company?.name || sub.companyName || 'Unknown Supplier',
              company: sub.company?.name || sub.companyName || 'Unknown Company',
              proposal: sub.proposal?.title || sub.proposalTitle || 'No proposal title',
              amount: sub.financial?.totalBidAmount || sub.totalBidAmount || 0,
              documents: sub.documents || [],
              status: mapStatus(sub.status),
              score: sub.score || 0,
              submittedAt: sub.submittedAt || sub.createdAt,
              evaluation: sub.evaluation,
              tenderTitle: (sub.tender && sub.tender.title) || 'Unknown Tender',
              companyName: sub.company?.name || sub.companyName || 'Unknown Company',
              submissionDate: sub.submittedAt || sub.createdAt,
              submittedDate: sub.submittedAt || sub.createdAt,
              lastUpdated: sub.lastUpdated || sub.updatedAt || sub.submittedAt || sub.createdAt,
              bidAmount: formatCurrency(sub.financial?.totalBidAmount || sub.totalBidAmount || 0),
              notes: sub.notes,
              contactPerson: sub.contact?.person || sub.contactPerson,
              contactEmail: sub.contact?.email || sub.contactEmail,
              contactPhone: sub.contact?.phone || sub.contactPhone,
              applicationNumber: sub.applicationNumber,
              
              // Submitter details
              submitter: {
                name: sub.submitter?.name || sub.contact?.person || sub.contactPerson || 'Unknown Submitter',
                email: sub.submitter?.email || sub.contact?.email || sub.contactEmail || 'unknown@example.com',
                phone: sub.submitter?.phone || sub.contact?.phone || sub.contactPhone,
                position: sub.submitter?.position || sub.contact?.position,
                department: sub.submitter?.department || sub.contact?.department
              },
              
              // Company details
              companyDetails: {
                name: sub.company?.name || sub.companyName || 'Unknown Company',
                registrationNumber: sub.company?.registrationNumber || sub.companyRegistrationNumber,
                address: sub.company?.address || sub.companyAddress,
                contactPerson: sub.company?.contactPerson || sub.contact?.person || sub.contactPerson || 'Unknown Contact',
                contactEmail: sub.company?.contactEmail || sub.contact?.email || sub.contactEmail || 'unknown@example.com',
                contactPhone: sub.company?.contactPhone || sub.contact?.phone || sub.contactPhone,
                taxNumber: sub.company?.taxNumber || sub.taxNumber,
                yearsInBusiness: sub.company?.yearsInBusiness || sub.yearsInBusiness
              }
            };
            
            console.log('✅ Main Component - Mapped submission:', {
              id: mappedSubmission.id,
              supplier: mappedSubmission.supplier,
              tenderTitle: mappedSubmission.tenderTitle,
              status: mappedSubmission.status,
              applicationNumber: mappedSubmission.applicationNumber,
              submitter: mappedSubmission.submitter
            });
            
            return mappedSubmission;
          });
          
          console.log('🎯 Main Component: Setting mapped submissions:', mappedSubmissions.length);
          setDbSubmissions(mappedSubmissions);
        } else {
          console.log('📭 Main Component: No submissions found in database');
          setDbSubmissions(initialSubmissionsData);
        }
      } catch (error) {
        console.error('💥 Main Component: Error loading submissions:', error);
        setDbSubmissions(initialSubmissionsData);
      } finally {
        setLoadingSubmissions(false);
      }
    }

    loadSubmissions();
  }, [initialSubmissionsData]);

  // Helper function to map API status to Submission status
  const mapStatus = (status: string): Submission['status'] => {
    const statusMap: { [key: string]: Submission['status'] } = {
      'submitted': 'submitted',
      'under_review': 'under_review',
      'evaluated': 'evaluated',
      'awarded': 'awarded',
      'rejected': 'rejected',
      'under review': 'under_review'
    }
    return statusMap[status] || 'submitted';
  }

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  const handleReviewClick = (submission: Submission) => {
    console.log('📋 Review clicked for submission:', {
      id: submission.id,
      tenderTitle: submission.tenderTitle,
      companyName: submission.companyName,
      submitter: submission.submitter,
      companyDetails: submission.companyDetails
    });
    
    const tender = tenders.find(t => t.id === submission.tenderId)
    if (tender) {
      setSelectedTenderInfo(tender)
      setShowTenderInfo(true)
    }
    
    // You can also navigate to a dedicated review page or open a review modal
    // setActiveTab('review');
    // setSelectedSubmissionForReview(submission);
  }

  // Enhanced tender creation handler
  const handleTenderCreateWithRole = async (tenderData: any) => {
    try {
      const tenderWithRole = {
        ...tenderData,
        createdBy: userRole,
        createdDate: new Date().toISOString(),
        status: userRole === 'super_admin' && tenderData.status === 'published' ? 'Open' : 'Draft',
        requiresApproval: userRole !== 'super_admin'
      }

      const result = await handleTenderCreate(tenderWithRole)
      
      if (userRole === 'super_admin' && tenderData.status === 'published') {
        console.log('Tender published successfully by super admin')
      } else {
        console.log('Tender saved as draft successfully')
      }
      
      return result
    } catch (error) {
      console.error('Error creating tender:', error)
      throw error
    }
  }

  // Handle tender deletion
  const handleTenderDeleteWithConfirmation = (tenderId: string) => {
    if (window.confirm('Are you sure you want to delete this tender? This action cannot be undone.')) {
      handleTenderDelete(tenderId)
      console.log('Tender deleted:', tenderId)
    }
  }

  // Handle tender editing
  const handleTenderEdit = (tender: Tender) => {
    setSelectedTenderInfo(tender)
    setIsRegistrationOpen(true)
  }

  // Handle bidder application
  const handleBidderApplication = (tender: Tender) => {
    setSelectedTenderForApplication(tender)
    setShowApplicationForm(true)
  }

  // Handle application submission
  const handleApplicationSubmit = async (applicationData: any) => {
    try {
      console.log('Submitting application for tender:', selectedTenderForApplication?.id)
      console.log('Application data:', applicationData)
      
      // Prepare submitter and company details for API
      const submissionData = {
        ...applicationData,
        tender: selectedTenderForApplication!.id,
        status: 'submitted',
        // Include submitter details
        submitter: {
          name: applicationData.contactPerson,
          email: applicationData.contactEmail,
          phone: applicationData.contactPhone,
          position: applicationData.position,
          department: applicationData.department
        },
        // Include company details
        company: {
          name: applicationData.companyName,
          registrationNumber: applicationData.registrationNumber,
          address: applicationData.companyAddress,
          contactPerson: applicationData.contactPerson,
          contactEmail: applicationData.contactEmail,
          contactPhone: applicationData.contactPhone,
          taxNumber: applicationData.taxNumber,
          yearsInBusiness: applicationData.yearsInBusiness
        }
      }
      
      // Submit to API to store in database
      const response = await fetch('/api/tender-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      const result = await response.json()
      
      if (result.success) {
        // Show success message
        alert('Application submitted successfully! Your submission is now under review.')
        
        // Refresh submissions data
        const submissionsData = await fetchSubmissionsFromDB()
        if (submissionsData.length > 0) {
          const mappedSubmissions: Submission[] = submissionsData.map((sub: any) => ({
            id: sub._id || sub.id,
            tenderId: (sub.tender && sub.tender._id) || sub.tender || 'unknown-tender',
            supplier: sub.company?.name || sub.companyName || 'Unknown Supplier',
            company: sub.company?.name || sub.companyName || 'Unknown Company',
            proposal: sub.proposal?.title || sub.proposalTitle || 'No proposal title',
            amount: sub.financial?.totalBidAmount || sub.totalBidAmount || 0,
            documents: sub.documents || [],
            status: mapStatus(sub.status),
            score: sub.score || 0,
            submittedAt: sub.submittedAt || sub.createdAt,
            evaluation: sub.evaluation,
            tenderTitle: (sub.tender && sub.tender.title) || 'Unknown Tender',
            companyName: sub.company?.name || sub.companyName || 'Unknown Company',
            submissionDate: sub.submittedAt || sub.createdAt,
            submittedDate: sub.submittedAt || sub.createdAt,
            lastUpdated: sub.lastUpdated || sub.updatedAt || sub.submittedAt || sub.createdAt,
            bidAmount: formatCurrency(sub.financial?.totalBidAmount || sub.totalBidAmount || 0),
            notes: sub.notes,
            contactPerson: sub.contact?.person || sub.contactPerson,
            contactEmail: sub.contact?.email || sub.contactEmail,
            contactPhone: sub.contact?.phone || sub.contactPhone,
            applicationNumber: sub.applicationNumber,
            // Submitter details
            submitter: {
              name: sub.submitter?.name || sub.contact?.person || sub.contactPerson || 'Unknown Submitter',
              email: sub.submitter?.email || sub.contact?.email || sub.contactEmail || 'unknown@example.com',
              phone: sub.submitter?.phone || sub.contact?.phone || sub.contactPhone,
              position: sub.submitter?.position || sub.contact?.position,
              department: sub.submitter?.department || sub.contact?.department
            },
            // Company details
            companyDetails: {
              name: sub.company?.name || sub.companyName || 'Unknown Company',
              registrationNumber: sub.company?.registrationNumber || sub.companyRegistrationNumber,
              address: sub.company?.address || sub.companyAddress,
              contactPerson: sub.company?.contactPerson || sub.contact?.person || sub.contactPerson || 'Unknown Contact',
              contactEmail: sub.company?.contactEmail || sub.contact?.email || sub.contactEmail || 'unknown@example.com',
              contactPhone: sub.company?.contactPhone || sub.contact?.phone || sub.contactPhone,
              taxNumber: sub.company?.taxNumber || sub.taxNumber,
              yearsInBusiness: sub.company?.yearsInBusiness || sub.yearsInBusiness
            }
          }))
          setDbSubmissions(mappedSubmissions)
        }
        
        // Close the form
        setShowApplicationForm(false)
        setSelectedTenderForApplication(null)
      } else {
        throw new Error(result.message || 'Failed to submit application')
      }
      
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    }
  }

  // Calendar Sidebar Handlers
  const handleStatsClick = (statType: string, data: any) => {
    console.log('Stats clicked:', statType, data)
    if (statType === 'pendingRequests') {
      setActiveTab('submissions')
    } else if (statType === 'upcomingDeadlines' || statType === 'activeProjects') {
      setActiveTab('tenders')
    } else if (statType === 'completedThisMonth') {
      setActiveTab('review')
    }
  }

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event)
    if (event.type === 'deadline') {
      const relatedTender = tenders.find(t => 
        t.title.toLowerCase().includes(event.title.toLowerCase().split(' - ')[1]?.toLowerCase() || '')
      )
      if (relatedTender) {
        setSelectedTenderInfo(relatedTender)
        setShowTenderInfo(true)
      }
    } else if (event.type === 'meeting') {
      setActiveTab('evaluation')
    }
  }

  const handleBidPortalClick = () => {
    console.log('Bid portal clicked')
    setActiveTab('submissions')
  }

  // Handle tender info click from various components
  const handleTenderInfoClick = (tender: Tender) => {
    setSelectedTenderInfo(tender)
    setShowTenderInfo(true)
  }

  // Handle new tender creation from various components
  const handleNewTenderClick = () => {
    setSelectedTenderInfo(null)
    setIsRegistrationOpen(true)
  }

  // Handle opening bidder application link - FIXED FUNCTION
  const handleOpenBidderApplication = (link: string) => {
    console.log('Opening bidder application link from dashboard:', link)
    if (openBidderApplicationByLink) {
      openBidderApplicationByLink(link)
    } else {
      // Fallback if the function is not available
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  // Refresh submissions data
  const handleRefreshSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const submissionsData = await fetchSubmissionsFromDB();
      if (submissionsData.length > 0) {
        const mappedSubmissions: Submission[] = submissionsData.map((sub: any) => ({
          id: sub._id || sub.id,
          tenderId: (sub.tender && sub.tender._id) || sub.tender || 'unknown-tender',
          supplier: sub.company?.name || sub.companyName || 'Unknown Supplier',
          company: sub.company?.name || sub.companyName || 'Unknown Company',
          proposal: sub.proposal?.title || sub.proposalTitle || 'No proposal title',
          amount: sub.financial?.totalBidAmount || sub.totalBidAmount || 0,
          documents: sub.documents || [],
          status: mapStatus(sub.status),
          score: sub.score || 0,
          submittedAt: sub.submittedAt || sub.createdAt,
          evaluation: sub.evaluation,
          tenderTitle: (sub.tender && sub.tender.title) || 'Unknown Tender',
          companyName: sub.company?.name || sub.companyName || 'Unknown Company',
          submissionDate: sub.submittedAt || sub.createdAt,
          submittedDate: sub.submittedAt || sub.createdAt,
          lastUpdated: sub.lastUpdated || sub.updatedAt || sub.submittedAt || sub.createdAt,
          bidAmount: formatCurrency(sub.financial?.totalBidAmount || sub.totalBidAmount || 0),
          notes: sub.notes,
          contactPerson: sub.contact?.person || sub.contactPerson,
          contactEmail: sub.contact?.email || sub.contactEmail,
          contactPhone: sub.contact?.phone || sub.contactPhone,
          applicationNumber: sub.applicationNumber,
          // Submitter details
          submitter: {
            name: sub.submitter?.name || sub.contact?.person || sub.contactPerson || 'Unknown Submitter',
            email: sub.submitter?.email || sub.contact?.email || sub.contactEmail || 'unknown@example.com',
            phone: sub.submitter?.phone || sub.contact?.phone || sub.contactPhone,
            position: sub.submitter?.position || sub.contact?.position,
            department: sub.submitter?.department || sub.contact?.department
          },
          // Company details
          companyDetails: {
            name: sub.company?.name || sub.companyName || 'Unknown Company',
            registrationNumber: sub.company?.registrationNumber || sub.companyRegistrationNumber,
            address: sub.company?.address || sub.companyAddress,
            contactPerson: sub.company?.contactPerson || sub.contact?.person || sub.contactPerson || 'Unknown Contact',
            contactEmail: sub.company?.contactEmail || sub.contact?.email || sub.contactEmail || 'unknown@example.com',
            contactPhone: sub.company?.contactPhone || sub.contact?.phone || sub.contactPhone,
            taxNumber: sub.company?.taxNumber || sub.taxNumber,
            yearsInBusiness: sub.company?.yearsInBusiness || sub.yearsInBusiness
          }
        }));
        setDbSubmissions(mappedSubmissions);
      }
    } catch (error) {
      console.error('Error refreshing submissions:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader
        title="Tender & Procurement Portal"
        description="Manage tenders, submissions, and evaluations"
        icon={
          <div className="bg-blue-500 p-2 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
        }
        userRole={userRole}
      />

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tenders">Tenders</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - 2/3 width */}
              <div className="lg:col-span-2">
                <DashboardTab 
                  tenders={tenders}
                  submissions={dbSubmissions}
                  onTenderCreate={handleNewTenderClick}
                  onTenderEdit={handleTenderEdit}
                  onTenderInfoClick={handleTenderInfoClick}
                  onReviewClick={handleReviewClick}
                  onTenderDelete={handleTenderDeleteWithConfirmation}
                  onTenderPublish={handleTenderPublish}
                  onBidderApplication={handleBidderApplication}
                  onOpenBidderApplication={handleOpenBidderApplication}
                />
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="space-y-6">
                <CalendarSidebar 
                  onStatsClick={handleStatsClick}
                  onEventClick={handleEventClick}
                  onBidPortalClick={handleBidPortalClick}
                  tenders={tenders}
                  submissions={dbSubmissions}
                  userRole={userRole}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tenders">
            <TendersTab 
              tenders={tenders}
              onTenderCreate={handleNewTenderClick}
              onTenderEdit={handleTenderEdit}
              onTenderInfoClick={handleTenderInfoClick}
              onTenderDelete={handleTenderDeleteWithConfirmation}
              onTenderPublish={handleTenderPublish}
              onBidderApplication={handleBidderApplication}
              onOpenBidderApplication={handleOpenBidderApplication}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsTab 
              submissions={dbSubmissions}
              tenders={tenders}
              onDocumentsUpdate={handleDocumentsUpdate}
              onReviewClick={handleReviewClick}
              onTenderCreate={handleNewTenderClick}
            />
          </TabsContent>

          <TabsContent value="evaluation">
            <EvaluationTab 
              submissions={dbSubmissions}
              tenders={tenders}
              onEvaluationComplete={handleEvaluationComplete}
              onReviewClick={handleReviewClick}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="contracts">
            <ContractsTab 
              tenders={tenders}
              onTenderInfoClick={handleTenderInfoClick}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="review">
            <ReviewTab 
              tenders={tenders}
              onTenderStatusChange={handleTenderStatusChange}
              userRole={userRole}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Tender Registration Popup */}
      <TenderRegistrationPopup 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)}
        onTenderCreate={handleTenderCreateWithRole}
        userRole={userRole}
        editTender={selectedTenderInfo}
      />

      {/* Tender Info Popup */}
      <TenderInfoPopup
        isOpen={showTenderInfo}
        onClose={() => setShowTenderInfo(false)}
        tender={selectedTenderInfo}
        onEditTender={handleTenderEdit}
        onDeleteTender={handleTenderDeleteWithConfirmation}
        onPublishTender={handleTenderPublish}
        onBidderApplication={handleBidderApplication}
      />

      {/* Tender Application Form */}
      <TenderApplicationForm
        isOpen={showApplicationForm}
        onClose={() => {
          setShowApplicationForm(false)
          setSelectedTenderForApplication(null)
        }}
        tender={selectedTenderForApplication}
        onApply={handleApplicationSubmit}
      />

      {/* User Role Badge */}
      <div className="fixed bottom-4 right-4">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          userRole === 'super_admin' 
            ? 'bg-purple-100 text-purple-800 border border-purple-300' 
            : userRole === 'admin'
            ? 'bg-blue-100 text-blue-800 border border-blue-300'
            : 'bg-gray-100 text-gray-800 border border-gray-300'
        }`}>
          {userRole === 'super_admin' ? 'Super Admin' : userRole === 'admin' ? 'Admin' : 'User'}
        </div>
      </div>
    </div>
  )
}