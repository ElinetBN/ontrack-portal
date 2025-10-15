"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Users,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle,
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  Upload,
  Eye,
  Loader2,
  BarChart,
  AlertCircle,
} from "lucide-react"
import { TenderDetailsPopup } from "@/components/tender-details-popup"
import { TenderApplicationForm } from "@/components/tender-application-form"

// Types for tender data
interface Tender {
  id: string
  title: string
  description: string
  status: string
  budget: number
  deadline: string
  submissions: number
  category: string
  publishedDate: string
  requirements: string[]
  contactPerson: string
  contactEmail: string
  documents: string[]
  evaluationCriteria?: string[]
  termsAndConditions?: string[]
  scopeOfWork?: string
  bidBondRequired?: boolean
  bidBondAmount?: number
  preBidMeeting?: string
  siteVisitRequired?: boolean
  siteVisitDate?: string
}

interface ApplicationFormData {
  [key: string]: any
}

export function BidderPortal() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [applyingTender, setApplyingTender] = useState<string | null>(null)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [showTenderDetails, setShowTenderDetails] = useState(false)

  // ✅ New states for application form
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [selectedTenderForApplication, setSelectedTenderForApplication] = useState<Tender | null>(null)

  // Fetch tenders from API
  const fetchTenders = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/tenders', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch tenders')

      const data = await response.json()
      if (Array.isArray(data)) setTenders(data)
      else if (Array.isArray(data.tenders)) setTenders(data.tenders)
      else if (Array.isArray(data.data)) setTenders(data.data)
      else setTenders([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tenders')
      console.error('Error fetching tenders:', err)
      setTenders([])
    } finally {
      setLoading(false)
    }
  }

  const handleBrowseTenders = () => {
    setActiveTab("tenders")
    fetchTenders()
  }

  const handleViewTenderDetails = (tender: Tender) => {
    setSelectedTender(tender)
    setShowTenderDetails(true)
  }

  // ✅ Updated handleApplyForTender
  const handleApplyForTender = async (tender: Tender) => {
    setSelectedTenderForApplication(tender)
    setShowApplicationForm(true)
  }

  // ✅ New function for submitting application form
  const handleApplicationSubmit = async (applicationData: ApplicationFormData) => {
    setApplyingTender(selectedTenderForApplication?.id || null)
    try {
      const response = await fetch('/api/tenders/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderId: selectedTenderForApplication?.id,
          applicationData,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit application')

      await response.json()
      alert('Application submitted successfully!')
      fetchTenders()
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setApplyingTender(null)
    }
  }

  const handleDownloadDocuments = (tenderId: string, documentName: string) => {
    console.log(`Downloading ${documentName} for tender ${tenderId}`)
    alert(`Downloading ${documentName}...`)
  }

  const handleNavigateToSubmissions = () => {
    window.location.href = "/portals/tender-procurement/submissions"
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      new: "secondary",
      completed: "outline",
      awarded: "default",
      open: "default",
      evaluation: "secondary",
      draft: "outline",
      closed: "outline",
      submitted: "secondary"
    } as const

    const labels = {
      active: "Active",
      new: "New",
      completed: "Completed",
      awarded: "Awarded",
      open: "Open",
      evaluation: "Evaluation",
      draft: "Draft",
      closed: "Closed",
      submitted: "Submitted"
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const isTenderExpired = (deadline: string) => new Date(deadline) < new Date()

  const filteredTenders = Array.isArray(tenders)
    ? tenders.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, Valued Bidder</h2>
        <p className="text-lg text-muted-foreground">Browse available tenders or track your submissions.</p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Available Tenders */}
        <Card className="bg-primary/10 border-primary/20 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary p-3 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary mb-2">Available Tenders</h3>
                <p className="text-primary/80 mb-4">
                  Browse and apply for open tender opportunities. View requirements and submit your proposals.
                </p>
                <Button onClick={handleBrowseTenders} className="bg-primary text-white w-full">
                  <Eye className="mr-2 h-5 w-5" /> Browse Tenders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Submissions */}
        <Card className="bg-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">My Submissions</h3>
                <p className="text-green-700 mb-4">
                  Track your submitted tender applications and view evaluation status and feedback.
                </p>
                <Button onClick={handleNavigateToSubmissions} className="bg-green-600 hover:bg-green-700 text-white w-full">
                  <BarChart className="mr-2 h-5 w-5" /> View My Submissions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tenders">Available Tenders</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Tenders Tab */}
        <TabsContent value="tenders" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search available tenders..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading tenders...</span>
            </div>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" /> {error}
              </CardContent>
            </Card>
          )}

          {!loading && filteredTenders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTenders.map((tender) => {
                const isExpired = isTenderExpired(tender.deadline)
                const isApplying = applyingTender === tender.id

                return (
                  <Card key={tender.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{tender.title}</CardTitle>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(tender.status)}
                          {isExpired && (
                            <Badge variant="outline" className="text-red-600 border-red-300">
                              Expired
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription>{tender.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Budget</span>
                          <span>{formatCurrency(tender.budget)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Deadline</span>
                          <span>{new Date(tender.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleViewTenderDetails(tender)}
                            disabled={isApplying}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleDownloadDocuments(tender.id, "Tender Documents")}
                          >
                            <Download className="mr-2 h-4 w-4" /> Docs
                          </Button>
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleApplyForTender(tender)}
                            disabled={isApplying || isExpired}
                          >
                            {isApplying ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                {isExpired ? "Expired" : "Apply"}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Tender Details Popup */}
      <TenderDetailsPopup
        isOpen={showTenderDetails}
        onClose={() => setShowTenderDetails(false)}
        tender={selectedTender}
        onApply={handleApplyForTender}
        onDownloadDocuments={handleDownloadDocuments}
      />

      {/* ✅ Tender Application Form */}
      <TenderApplicationForm
        isOpen={showApplicationForm}
        onClose={() => {
          setShowApplicationForm(false)
          setSelectedTenderForApplication(null)
        }}
        tender={selectedTenderForApplication}
        onApply={handleApplicationSubmit}
      />
    </>
  )
}
