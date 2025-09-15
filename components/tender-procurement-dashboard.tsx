"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { PortalHeader } from "@/components/portal-header"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  DollarSign,
  Building2,
} from "lucide-react"

const tenders = [
  {
    id: "TND-2024-001",
    title: "IT Infrastructure Upgrade Project",
    department: "Information Technology",
    status: "Open",
    deadline: "2024-02-15",
    budget: "R 2,500,000",
    submissions: 12,
    category: "Technology",
  },
  {
    id: "TND-2024-002",
    title: "Office Furniture Supply Contract",
    department: "Facilities Management",
    status: "Evaluation",
    deadline: "2024-01-30",
    budget: "R 850,000",
    submissions: 8,
    category: "Supplies",
  },
  {
    id: "TND-2024-003",
    title: "Security Services Contract",
    department: "Security",
    status: "Awarded",
    deadline: "2024-01-20",
    budget: "R 1,200,000",
    submissions: 15,
    category: "Services",
  },
]

const submissions = [
  {
    id: "SUB-001",
    tenderId: "TND-2024-001",
    supplier: "TechCorp Solutions",
    submittedDate: "2024-01-25",
    status: "Under Review",
    score: 85,
    documents: 5,
  },
  {
    id: "SUB-002",
    tenderId: "TND-2024-001",
    supplier: "Digital Dynamics",
    submittedDate: "2024-01-24",
    status: "Evaluated",
    score: 92,
    documents: 6,
  },
  {
    id: "SUB-003",
    tenderId: "TND-2024-002",
    supplier: "Office Plus",
    submittedDate: "2024-01-28",
    status: "Compliant",
    score: 78,
    documents: 4,
  },
]

export function TenderProcurementDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenders">Tenders</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+3 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Evaluation</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">2 urgent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R 45.2M</div>
                  <p className="text-xs text-muted-foreground">Current tender value</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tenders</CardTitle>
                  <CardDescription>Latest tender publications and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tenders.slice(0, 3).map((tender) => (
                    <div key={tender.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{tender.title}</p>
                        <p className="text-xs text-muted-foreground">{tender.department}</p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              tender.status === "Open"
                                ? "default"
                                : tender.status === "Evaluation"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {tender.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{tender.budget}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        View
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Queue</CardTitle>
                  <CardDescription>Submissions awaiting evaluation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {submissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{submission.supplier}</p>
                        <p className="text-xs text-muted-foreground">Tender: {submission.tenderId}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {submission.status}
                          </Badge>
                          {submission.score && (
                            <span className="text-xs text-muted-foreground">Score: {submission.score}%</span>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Evaluate
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tenders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Tender Management</h2>
                <p className="text-muted-foreground">Create, publish, and manage tender opportunities</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Tender
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tenders..." className="pl-10" />
              </div>
              <Button variant="outline" className="bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Tenders List */}
            <div className="space-y-4">
              {tenders.map((tender) => (
                <Card key={tender.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{tender.title}</CardTitle>
                          <Badge
                            variant={
                              tender.status === "Open"
                                ? "default"
                                : tender.status === "Evaluation"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {tender.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          {tender.department} • {tender.category} • ID: {tender.id}
                        </CardDescription>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold">{tender.budget}</p>
                        <p className="text-sm text-muted-foreground">{tender.submissions} submissions</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {tender.deadline}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {tender.submissions} submissions
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Submission Management</h2>
              <p className="text-muted-foreground">Review and manage tender submissions</p>
            </div>

            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{submission.supplier}</CardTitle>
                          <Badge
                            variant={
                              submission.status === "Under Review"
                                ? "secondary"
                                : submission.status === "Evaluated"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {submission.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          Tender: {submission.tenderId} • Submitted: {submission.submittedDate}
                        </CardDescription>
                      </div>
                      {submission.score && (
                        <div className="text-right">
                          <p className="text-2xl font-bold">{submission.score}%</p>
                          <p className="text-sm text-muted-foreground">Evaluation Score</p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {submission.score && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Evaluation Progress</span>
                            <span>{submission.score}%</span>
                          </div>
                          <Progress value={submission.score} className="h-2" />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {submission.documents} documents
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {submission.supplier}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Download className="mr-2 h-4 w-4" />
                            Documents
                          </Button>
                          <Button size="sm">Review</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Evaluation Center</h2>
              <p className="text-muted-foreground">Automated and manual evaluation tools</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Evaluation Criteria Setup</CardTitle>
                <CardDescription>Configure evaluation parameters for tender assessments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="technical-weight">Technical Score Weight (%)</Label>
                    <Input id="technical-weight" type="number" placeholder="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="financial-weight">Financial Score Weight (%)</Label>
                    <Input id="financial-weight" type="number" placeholder="40" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evaluation-notes">Evaluation Notes</Label>
                  <Textarea id="evaluation-notes" placeholder="Additional evaluation criteria and notes..." />
                </div>
                <Button>Save Criteria</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Scoring</CardTitle>
                  <CardDescription>AI-powered initial evaluation results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Digital Dynamics</p>
                        <p className="text-sm text-muted-foreground">Technical compliance: 95%</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">92%</p>
                        <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">TechCorp Solutions</p>
                        <p className="text-sm text-muted-foreground">Technical compliance: 88%</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">85%</p>
                        <AlertCircle className="h-4 w-4 text-blue-600 ml-auto" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manual Review Queue</CardTitle>
                  <CardDescription>Submissions requiring manual evaluation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Office Plus</p>
                        <p className="text-sm text-muted-foreground">Pending technical review</p>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Review
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">SecureGuard Services</p>
                        <p className="text-sm text-muted-foreground">Awaiting financial assessment</p>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Contract Management</h2>
              <p className="text-muted-foreground">Manage awarded contracts and agreements</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Active Contracts</CardTitle>
                <CardDescription>Currently active procurement contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Security Services Contract</p>
                      <p className="text-sm text-muted-foreground">SecureGuard Services • R 1,200,000</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Active</Badge>
                        <span className="text-xs text-muted-foreground">Expires: 2024-12-31</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Download className="mr-2 h-4 w-4" />
                        Contract
                      </Button>
                      <Button size="sm">Manage</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
