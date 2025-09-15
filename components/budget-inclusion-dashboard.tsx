"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortalHeader } from "@/components/portal-header"
import { PieChart, TrendingUp, AlertTriangle, Target, DollarSign, Users } from "lucide-react"

export function BudgetInclusionDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const budgetAllocations = [
    { sector: "Small Business", allocated: 2500000, spent: 2100000, target: 30, actual: 28 },
    { sector: "Women-Owned", allocated: 1800000, spent: 1650000, target: 25, actual: 27 },
    { sector: "Youth-Owned", allocated: 1200000, spent: 980000, target: 15, actual: 13 },
    { sector: "Disability-Owned", allocated: 800000, spent: 720000, target: 10, actual: 9 },
    { sector: "Rural Enterprises", allocated: 1500000, spent: 1350000, target: 20, actual: 23 },
  ]

  const inclusionMetrics = [
    { category: "Gender Inclusion", current: 68, target: 70, trend: "up" },
    { category: "Youth Participation", current: 45, target: 50, trend: "up" },
    { category: "Disability Inclusion", current: 12, target: 15, trend: "stable" },
    { category: "Rural Development", current: 78, target: 75, trend: "up" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Portal Header */}
      <PortalHeader
        title="Budget & Inclusion Portal"
        description="Track inclusive budget allocation and spending"
        icon={
          <div className="bg-orange-500 p-2 rounded-lg">
            <PieChart className="h-6 w-6 text-white" />
          </div>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="inclusion">Inclusion</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R 8.8M</div>
                  <p className="text-xs text-muted-foreground">Allocated this quarter</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inclusion Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">73%</div>
                  <p className="text-xs text-muted-foreground">+8% from last quarter</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Target Achievement</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                  <p className="text-xs text-muted-foreground">Above target</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Variance Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Budget Allocation Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation by Sector</CardTitle>
                <CardDescription>Current spending vs allocated budget across inclusion categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetAllocations.map((allocation) => (
                    <div key={allocation.sector} className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-medium">{allocation.sector}</h4>
                          <p className="text-sm text-muted-foreground">
                            R {(allocation.spent / 1000000).toFixed(1)}M of R{" "}
                            {(allocation.allocated / 1000000).toFixed(1)}M allocated
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={allocation.actual >= allocation.target ? "default" : "secondary"}>
                            {allocation.actual}% (Target: {allocation.target}%)
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(allocation.spent / allocation.allocated) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Budget Allocation</h2>
                <p className="text-muted-foreground">Manage and track budget distribution across sectors</p>
              </div>
              <Button>Adjust Allocations</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {budgetAllocations.map((allocation) => (
                <Card key={allocation.sector} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{allocation.sector}</CardTitle>
                        <CardDescription>
                          Target: {allocation.target}% | Actual: {allocation.actual}%
                        </CardDescription>
                      </div>
                      <Badge variant={allocation.actual >= allocation.target ? "default" : "secondary"}>
                        {allocation.actual >= allocation.target ? "On Track" : "Below Target"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budget Utilization</span>
                        <span>{Math.round((allocation.spent / allocation.allocated) * 100)}%</span>
                      </div>
                      <Progress value={(allocation.spent / allocation.allocated) * 100} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Allocated</p>
                        <p className="font-medium">R {(allocation.allocated / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spent</p>
                        <p className="font-medium">R {(allocation.spent / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inclusion" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Inclusion Metrics</h2>
              <p className="text-muted-foreground">Track diversity and inclusion performance across categories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inclusionMetrics.map((metric) => (
                <Card key={metric.category}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{metric.category}</CardTitle>
                      <div className="flex items-center gap-2">
                        <TrendingUp
                          className={`h-4 w-4 ${metric.trend === "up" ? "text-green-500" : "text-muted-foreground"}`}
                        />
                        <Badge variant={metric.current >= metric.target ? "default" : "secondary"}>
                          {metric.current >= metric.target ? "Target Met" : "Below Target"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Performance</span>
                        <span>{metric.current}%</span>
                      </div>
                      <Progress value={metric.current} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Target: {metric.target}%</span>
                        <span>
                          {metric.current >= metric.target
                            ? `+${metric.current - metric.target}%`
                            : `${metric.current - metric.target}%`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Budget Analytics</h2>
              <p className="text-muted-foreground">Advanced analytics and trend analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Trends</CardTitle>
                  <CardDescription>Monthly spending patterns across sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <p>Chart visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inclusion Progress</CardTitle>
                  <CardDescription>Quarterly inclusion metrics progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <p>Chart visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Reports & Compliance</h2>
              <p className="text-muted-foreground">Generate compliance and performance reports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Quarterly Report</CardTitle>
                  <CardDescription>Comprehensive quarterly budget and inclusion analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Compliance Report</CardTitle>
                  <CardDescription>Regulatory compliance and audit trail</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Variance Analysis</CardTitle>
                  <CardDescription>Budget variance and deviation analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Generate Report
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
