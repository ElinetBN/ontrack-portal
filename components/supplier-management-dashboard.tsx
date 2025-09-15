"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PortalHeader } from "@/components/portal-header"
import {
  Users,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  BookOpen,
} from "lucide-react"

const suppliers = [
  {
    id: "SUP-001",
    name: "TechCorp Solutions",
    category: "Technology",
    status: "Active",
    rating: 4.8,
    contracts: 12,
    totalValue: "R 15,200,000",
    compliance: 95,
    lastAudit: "2024-01-15",
    riskLevel: "Low",
  },
  {
    id: "SUP-002",
    name: "Office Plus",
    category: "Supplies",
    status: "Active",
    rating: 4.2,
    contracts: 8,
    totalValue: "R 3,400,000",
    compliance: 88,
    lastAudit: "2024-01-10",
    riskLevel: "Medium",
  },
  {
    id: "SUP-003",
    name: "SecureGuard Services",
    category: "Services",
    status: "Under Review",
    rating: 4.6,
    contracts: 5,
    totalValue: "R 8,900,000",
    compliance: 92,
    lastAudit: "2024-01-20",
    riskLevel: "Low",
  },
]

const developmentPrograms = [
  {
    id: "DEV-001",
    title: "Digital Transformation Training",
    supplier: "Office Plus",
    progress: 65,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "In Progress",
    mentor: "Sarah Johnson",
  },
  {
    id: "DEV-002",
    title: "Quality Management Certification",
    supplier: "TechCorp Solutions",
    progress: 90,
    startDate: "2023-12-01",
    endDate: "2024-02-28",
    status: "Near Completion",
    mentor: "Michael Chen",
  },
  {
    id: "DEV-003",
    title: "Sustainability Practices Workshop",
    supplier: "SecureGuard Services",
    progress: 30,
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    status: "In Progress",
    mentor: "Lisa Williams",
  },
]

const performanceMetrics = [
  { name: "On-time Delivery", value: 94, trend: "up", target: 95 },
  { name: "Quality Score", value: 88, trend: "up", target: 90 },
  { name: "Cost Efficiency", value: 92, trend: "down", target: 95 },
  { name: "Compliance Rate", value: 96, trend: "up", target: 98 },
]

export function SupplierManagementDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader
        title="Supplier Management & Development Portal"
        description="Onboarding, performance monitoring, and development"
        icon={
          <div className="bg-green-500 p-2 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+8 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.5</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last quarter</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Development Programs</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">12 active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-xs text-muted-foreground">+2% this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Overall supplier performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <div className="flex items-center gap-1">
                          {metric.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm font-bold">{metric.value}%</span>
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current: {metric.value}%</span>
                        <span>Target: {metric.target}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Suppliers</CardTitle>
                  <CardDescription>Highest rated suppliers this quarter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suppliers
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3)
                    .map((supplier) => (
                      <div key={supplier.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{supplier.name}</p>
                          <p className="text-xs text-muted-foreground">{supplier.category}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{supplier.rating}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {supplier.contracts} contracts
                            </Badge>
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
                  <CardTitle>Development Programs</CardTitle>
                  <CardDescription>Active supplier development initiatives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {developmentPrograms.slice(0, 3).map((program) => (
                    <div key={program.id} className="space-y-3 p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{program.title}</p>
                          <p className="text-sm text-muted-foreground">{program.supplier}</p>
                        </div>
                        <Badge
                          variant={program.status === "Near Completion" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {program.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Supplier Directory</h2>
                <p className="text-muted-foreground">Manage and monitor all registered suppliers</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search suppliers..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Suppliers List */}
            <div className="space-y-4">
              {suppliers.map((supplier) => (
                <Card key={supplier.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{supplier.name}</CardTitle>
                          <Badge
                            variant={
                              supplier.status === "Active"
                                ? "default"
                                : supplier.status === "Under Review"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {supplier.status}
                          </Badge>
                          <Badge
                            variant={
                              supplier.riskLevel === "Low"
                                ? "outline"
                                : supplier.riskLevel === "Medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {supplier.riskLevel} Risk
                          </Badge>
                        </div>
                        <CardDescription>
                          {supplier.category} • ID: {supplier.id} • Last Audit: {supplier.lastAudit}
                        </CardDescription>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{supplier.rating}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{supplier.totalValue}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Compliance</span>
                          <span>{supplier.compliance}%</span>
                        </div>
                        <Progress value={supplier.compliance} className="h-2" />
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{supplier.contracts}</p>
                        <p className="text-xs text-muted-foreground">Active Contracts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{supplier.totalValue}</p>
                        <p className="text-xs text-muted-foreground">Total Contract Value</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Performance
                      </Button>
                      <Button size="sm">Manage</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Performance Monitoring</h2>
              <p className="text-muted-foreground">Track and analyze supplier performance metrics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Key metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceMetrics.map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{metric.name}</span>
                          <div className="flex items-center gap-2">
                            {metric.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm font-bold">{metric.value}%</span>
                          </div>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Target: {metric.target}%</span>
                          <span className={metric.value >= metric.target ? "text-green-600" : "text-orange-600"}>
                            {metric.value >= metric.target ? "On Target" : "Below Target"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>Supplier risk analysis and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-medium text-sm">Office Plus</p>
                          <p className="text-xs text-muted-foreground">Compliance below threshold</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Medium Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-sm">TechCorp Solutions</p>
                          <p className="text-xs text-muted-foreground">All metrics on target</p>
                        </div>
                      </div>
                      <Badge variant="outline">Low Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm">SecureGuard Services</p>
                          <p className="text-xs text-muted-foreground">Audit due next month</p>
                        </div>
                      </div>
                      <Badge variant="outline">Low Risk</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Scorecard</CardTitle>
                <CardDescription>Detailed performance breakdown by supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliers.map((supplier) => (
                    <div key={supplier.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{supplier.name}</h3>
                          <Badge variant="outline">{supplier.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{supplier.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Compliance</span>
                            <span>{supplier.compliance}%</span>
                          </div>
                          <Progress value={supplier.compliance} className="h-1" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Quality</span>
                            <span>{Math.round(supplier.rating * 20)}%</span>
                          </div>
                          <Progress value={supplier.rating * 20} className="h-1" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Delivery</span>
                            <span>92%</span>
                          </div>
                          <Progress value={92} className="h-1" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Cost Efficiency</span>
                            <span>88%</span>
                          </div>
                          <Progress value={88} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Supplier Development</h2>
                <p className="text-muted-foreground">Training programs and capacity building initiatives</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Programs</CardTitle>
                  <CardDescription>Currently running development initiatives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">12</div>
                    <p className="text-sm text-muted-foreground">Programs in progress</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate</CardTitle>
                  <CardDescription>Average program completion rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-600">87%</div>
                    <p className="text-sm text-muted-foreground">Successfully completed</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Score</CardTitle>
                  <CardDescription>Performance improvement after training</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-600">+23%</div>
                    <p className="text-sm text-muted-foreground">Average improvement</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Development Programs</CardTitle>
                <CardDescription>Manage supplier training and development initiatives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {developmentPrograms.map((program) => (
                  <div key={program.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{program.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {program.supplier} • Mentor: {program.mentor}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {program.startDate} - {program.endDate}
                        </p>
                      </div>
                      <Badge
                        variant={
                          program.status === "Near Completion"
                            ? "default"
                            : program.status === "In Progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {program.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Contact Mentor
                      </Button>
                      <Button size="sm">Manage</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Supplier Onboarding</h2>
              <p className="text-muted-foreground">Streamlined registration and verification process</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Pipeline</CardTitle>
                  <CardDescription>Current applications and their status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Green Energy Solutions</p>
                        <p className="text-xs text-muted-foreground">Document verification</p>
                      </div>
                      <Badge variant="secondary">In Review</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Smart Logistics Ltd</p>
                        <p className="text-xs text-muted-foreground">Compliance check</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Digital Marketing Pro</p>
                        <p className="text-xs text-muted-foreground">Final approval</p>
                      </div>
                      <Badge variant="default">Approved</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Checklist</CardTitle>
                  <CardDescription>Required steps for new suppliers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Company registration documents</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Tax compliance certificate</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <span className="text-sm">Insurance documentation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <span className="text-sm">Quality certifications</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="text-sm">Background verification</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Onboarding</CardTitle>
                <CardDescription>Fast-track registration for pre-qualified suppliers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" placeholder="Enter company name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration-number">Registration Number</Label>
                    <Input id="registration-number" placeholder="Company registration number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" type="email" placeholder="contact@company.com" />
                  </div>
                </div>
                <Button className="w-full">Start Onboarding Process</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
