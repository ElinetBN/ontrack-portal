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

  const handleReviewClick = (submission: any) => {
    const tender = tenders.find(t => t.id === submission.tenderId)
    if (tender) {
      setSelectedTenderInfo(tender)
      setShowTenderInfo(true)
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
            <DashboardTab 
              tenders={tenders}
              submissions={submissions}
              onTenderCreate={() => setIsRegistrationOpen(true)}
              onTenderInfoClick={(tender) => {
                setSelectedTenderInfo(tender)
                setShowTenderInfo(true)
              }}
              onReviewClick={handleReviewClick}
            />
          </TabsContent>

          <TabsContent value="tenders">
            <TendersTab 
              tenders={tenders}
              onTenderCreate={() => setIsRegistrationOpen(true)}
              onTenderInfoClick={(tender) => {
                setSelectedTenderInfo(tender)
                setShowTenderInfo(true)
              }}
            />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsTab 
              submissions={submissions}
              tenders={tenders}
              onDocumentsUpdate={handleDocumentsUpdate}
              onReviewClick={handleReviewClick}
            />
          </TabsContent>

          <TabsContent value="evaluation">
            <EvaluationTab 
              submissions={submissions}
              tenders={tenders}
              onEvaluationComplete={handleEvaluationComplete}
              onReviewClick={handleReviewClick}
            />
          </TabsContent>

          <TabsContent value="contracts">
            <ContractsTab 
              tenders={tenders}
              onTenderInfoClick={(tender) => {
                setSelectedTenderInfo(tender)
                setShowTenderInfo(true)
              }}
            />
          </TabsContent>

          <TabsContent value="review">
            <ReviewTab 
              tenders={tenders}
              onTenderStatusChange={handleTenderStatusChange}
            />
          </TabsContent>
        </Tabs>
      </main>

      <TenderRegistrationPopup 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)}
        onTenderCreate={handleTenderCreate}
      />

      <TenderInfoPopup
        isOpen={showTenderInfo}
        onClose={() => setShowTenderInfo(false)}
        tender={selectedTenderInfo}
      />
    </div>
  )
}