"use client"

import { useState } from "react"
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

export function TenderProcurementDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [selectedTenderInfo, setSelectedTenderInfo] = useState<Tender | null>(null)
  const [showTenderInfo, setShowTenderInfo] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [selectedTenderForApplication, setSelectedTenderForApplication] = useState<Tender | null>(null)

  const {
    tenders,
    submissions,
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

  const handleReviewClick = (submission: Submission) => {
    const tender = tenders.find(t => t.id === submission.tenderId)
    if (tender) {
      setSelectedTenderInfo(tender)
      setShowTenderInfo(true)
    }
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
      
      // Create a new submission
      const newSubmission: Submission = {
        id: `sub-${Date.now()}`,
        tenderId: selectedTenderForApplication!.id,
        supplier: applicationData.companyName,
        company: applicationData.companyName,
        companyName: applicationData.companyName,
        proposal: applicationData.executiveSummary,
        amount: applicationData.totalBidAmount,
        bidAmount: `R ${applicationData.totalBidAmount?.toLocaleString() || '0'}`,
        documents: applicationData.uploadedDocuments,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        submissionDate: new Date().toISOString(),
        submittedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        tenderTitle: selectedTenderForApplication!.title,
        notes: applicationData.technicalProposal?.substring(0, 200) + '...'
      }

      console.log('New submission created:', newSubmission)
      
      // Show success message
      alert('Application submitted successfully! Your submission is now under review.')
      
      // Close the form
      setShowApplicationForm(false)
      setSelectedTenderForApplication(null)
      
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
                  submissions={submissions}
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
                  submissions={submissions}
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
              submissions={submissions}
              tenders={tenders}
              onDocumentsUpdate={handleDocumentsUpdate}
              onReviewClick={handleReviewClick}
              onTenderCreate={handleNewTenderClick}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="evaluation">
            <EvaluationTab 
              submissions={submissions}
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