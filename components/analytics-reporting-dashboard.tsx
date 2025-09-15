"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortalHeader } from "@/components/portal-header"
import { BarChart3, TrendingUp, Download, Calendar, Eye, FileText, PieChart, Activity } from "lucide-react"

export function AnalyticsReportingDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const kpiData = [
    { title: "Total Tenders", value: "1,247", change: "+12%", trend: "up" },
    { title: "Active Suppliers", value: "3,892", change: "+8%", trend: "up" },
    { title: "Contract Value", value: "R 45.2M", change: "+15%", trend: "up" },
    { title: "Compliance Rate", value: "94.7%", change: "+2%", trend: "up" },
  ]

  const reports = [
    {
      id: "RPT-001",
      title: "Monthly Procurement Summary",
      description: "Comprehensive overview of monthly procurement activities",
      type: "Monthly",
      lastGenerated: "2024-10-01",
      status: "Ready",
    },
    {
      id: "RPT-002",
      title: "Supplier Performance Analysis",
      description: "Detailed analysis of supplier performance metrics",
      type: "Quarterly",
      lastGenerated: "2024-09-30",
      status: "Ready",
    },
    {
      id: "RPT-003",
      title: "Budget Utilization Report",
      description: "Budget allocation and spending analysis",
      type: "Monthly",
      lastGenerated: "2024-10-01",
      status: "Processing",
    },
    {
      id: "RPT-004",
      title: "Compliance Audit Report",
      description: "Regulatory compliance and audit findings",
      type: "Quarterly",
      lastGenerated: "2024-09-15",
      status: "Ready",
    },
  ]

  const dashboards = [
    {
      title: "Executive Dashboard",
      description: "High-level KPIs and strategic metrics",
      icon: TrendingUp,
      color: "bg-blue-500",
      metrics: ["Revenue", "Growth", "Efficiency", "Compliance"],
    },
    {
      title: "Procurement Dashboard",
      description: "Tender and procurement process metrics",
      icon: FileText,
      color: "bg-green-500",
      metrics: ["Tenders", "Submissions", "Awards", "Contracts"],
    },
    {
      title: "Supplier Dashboard",
      description: "Supplier performance and development metrics",
      icon: Activity,
      color: "bg-purple-500",
      metrics: ["Performance", "Development", "Compliance", "Risk"],
    },
    {
      title: "Financial Dashboard",
      description: "Budget and financial performance metrics",
      icon: PieChart,
      color: "bg-orange-500",
      metrics: ["Budget", "Spending", "Variance", "Forecasts"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader
        title="Analytics & Reporting Portal"
        description="Consolidated dashboards and reporting"
        icon={
          <div className="bg-indigo-500 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <TrendingUp
                      className={`h-4 w-4 ${kpi.trend === "up" ? "text-green-500" : "text-muted-foreground"}`}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className={`text-xs ${kpi.trend === "up" ? "text-green-600" : "text-muted-foreground"}`}>
                      {kpi.change} from last period
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Access Dashboards */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Access Dashboards</CardTitle>
                <CardDescription>Access frequently used dashboards and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboards.map((dashboard, index) => {
                    const IconComponent = dashboard.icon
                    return (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`${dashboard.color} p-2 rounded-lg`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <h4 className="font-medium text-sm">{dashboard.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{dashboard.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {dashboard.metrics.slice(0, 2).map((metric, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                          {dashboard.metrics.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{dashboard.metrics.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest generated reports and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 3).map((report) => (
                    <div
                      key={report.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{report.id}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.lastGenerated}
                          </span>
                          <Badge variant={report.status === "Ready" ? "default" : "secondary"} className="text-xs">
                            {report.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboards" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Interactive Dashboards</h2>
                <p className="text-muted-foreground">Real-time dashboards for different user roles and functions</p>
              </div>
              <Button>Create Custom Dashboard</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboards.map((dashboard, index) => {
                const IconComponent = dashboard.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${dashboard.color} p-3 rounded-lg`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{dashboard.title}</CardTitle>
                            <CardDescription>{dashboard.description}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Key Metrics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {dashboard.metrics.map((metric, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        Open Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Report Library</h2>
                <p className="text-muted-foreground">Generate, schedule, and manage reports</p>
              </div>
              <Button>Generate New Report</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          report.status === "Ready"
                            ? "default"
                            : report.status === "Processing"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium">{report.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Generated</p>
                        <p className="font-medium">{report.lastGenerated}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Advanced Analytics</h2>
              <p className="text-muted-foreground">Deep insights and trend analysis across all portals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Procurement Trends</CardTitle>
                  <CardDescription>Monthly procurement activity and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <p>Chart visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supplier Performance</CardTitle>
                  <CardDescription>Supplier performance metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <p>Chart visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Analysis</CardTitle>
                  <CardDescription>Budget utilization and variance analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <p>Chart visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Metrics</CardTitle>
                  <CardDescription>Regulatory compliance tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <p>Chart visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Custom Reports & Dashboards</h2>
              <p className="text-muted-foreground">Create personalized reports and dashboards</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-muted p-4 rounded-lg w-fit mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">Create Custom Report</CardTitle>
                  <CardDescription>Build a custom report with your selected metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Start Building
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-muted p-4 rounded-lg w-fit mb-4">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">Create Custom Dashboard</CardTitle>
                  <CardDescription>Design a personalized dashboard layout</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Start Building
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-muted p-4 rounded-lg w-fit mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">Schedule Reports</CardTitle>
                  <CardDescription>Set up automated report generation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Setup Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
