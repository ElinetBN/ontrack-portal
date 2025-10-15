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

// Import data and types
import { initialTenders, initialSubmissions } from "../data/mock-data"
import { useTenderManagement } from "../hooks/use-tender-management"

export function TenderProcurementDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [selectedTenderInfo, setSelectedTenderInfo] = useState<any>(null)
  const [showTenderInfo, setShowTenderInfo] = useState(false)

  const {
    tenders,
    submissions,
    handleTenderCreate,
    handleDocumentsUpdate,
    handleEvaluationComplete,
    handleTenderStatusChange
  } = useTenderManagement(initialTenders, initialSubmissions)

  // Mock user role - you can replace this with actual authentication logic
  const [userRole] = useState<'admin' | 'super_admin' | 'user'>('super_admin')

  const handleReviewClick = (submission: any) => {
    const tender = tenders.find(t => t.id === submission.tenderId)
    if (tender) {
      setSelectedTenderInfo(tender)
      setShowTenderInfo(true)
    }
  }

  // Enhanced tender creation handler
  const handleTenderCreateWithRole = async (tenderData: any) => {
    try {
      // Add user role information to tender data
      const tenderWithRole = {
        ...tenderData,
        createdBy: userRole,
        createdAt: new Date().toISOString(),
        // Add draft/published status based on user role and action
        status: userRole === 'super_admin' && tenderData.status === 'published' ? 'published' : 'draft',
        requiresApproval: userRole !== 'super_admin'
      }

      const result = await handleTenderCreate(tenderWithRole)
      
      // Show appropriate success message based on user role and action
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

  // Calendar Sidebar Handlers
  const handleStatsClick = (statType: string, data: any) => {
    console.log('Stats clicked:', statType, data)
    // Navigate to relevant tabs based on stat type
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
    // Show event details or navigate to relevant section
    if (event.type === 'deadline') {
      // Find related tender and show its info
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
    // Navigate to submissions tab for bid management
    setActiveTab('submissions')
  }

  // Handle tender info click from various components
  const handleTenderInfoClick = (tender: any) => {
    setSelectedTenderInfo(tender)
    setShowTenderInfo(true)
  }

  // Handle new tender creation from various components
  const handleNewTenderClick = () => {
    setIsRegistrationOpen(true)
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
        userRole={userRole} // Pass user role to header if needed
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
                  onTenderInfoClick={handleTenderInfoClick}
                  onReviewClick={handleReviewClick}
                  userRole={userRole}
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
              onTenderInfoClick={handleTenderInfoClick}
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

      {/* Tender Registration Popup with User Role */}
      <TenderRegistrationPopup 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)}
        onTenderCreate={handleTenderCreateWithRole}
        userRole={userRole}
      />

      {/* Tender Info Popup */}
      <TenderInfoPopup
        isOpen={showTenderInfo}
        onClose={() => setShowTenderInfo(false)}
        tender={selectedTenderInfo}
      />

      {/* User Role Badge in Corner (optional) */}
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