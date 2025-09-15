"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortalHeader } from "@/components/portal-header"
import { FolderKanban, Calendar, Users, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react"

export function ProjectManagementDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const projects = [
    {
      id: "PRJ-001",
      name: "Municipal Infrastructure Tender",
      status: "In Progress",
      progress: 75,
      dueDate: "2024-12-15",
      team: 8,
      budget: "R 2.5M",
      priority: "High",
    },
    {
      id: "PRJ-002",
      name: "IT Equipment Procurement",
      status: "Planning",
      progress: 25,
      dueDate: "2024-11-30",
      team: 5,
      budget: "R 850K",
      priority: "Medium",
    },
    {
      id: "PRJ-003",
      name: "Healthcare Supplies Contract",
      status: "Review",
      progress: 90,
      dueDate: "2024-10-20",
      team: 12,
      budget: "R 4.2M",
      priority: "Critical",
    },
  ]

  const tasks = [
    { id: 1, title: "Review tender specifications", status: "completed", assignee: "John Doe", dueDate: "2024-10-15" },
    {
      id: 2,
      title: "Conduct supplier evaluation",
      status: "in-progress",
      assignee: "Jane Smith",
      dueDate: "2024-10-18",
    },
    {
      id: 3,
      title: "Prepare contract documentation",
      status: "pending",
      assignee: "Mike Johnson",
      dueDate: "2024-10-22",
    },
    {
      id: 4,
      title: "Schedule stakeholder meeting",
      status: "pending",
      assignee: "Sarah Wilson",
      dueDate: "2024-10-25",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader
        title="Project Management Portal"
        description="Comprehensive project tracking and management"
        icon={
          <div className="bg-purple-500 p-2 rounded-lg">
            <FolderKanban className="h-6 w-6 text-white" />
          </div>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+3 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">Across all projects</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Overview of current project status and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-2 sm:space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge
                            variant={
                              project.priority === "Critical"
                                ? "destructive"
                                : project.priority === "High"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {project.priority}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>{project.id}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {project.dueDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {project.team} members
                          </span>
                          <span>{project.budget}</span>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="w-full sm:w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">All Projects</h2>
                <p className="text-muted-foreground">Manage and track all procurement projects</p>
              </div>
              <Button>Create New Project</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>{project.id}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          project.status === "In Progress"
                            ? "default"
                            : project.status === "Planning"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Team Size</p>
                        <p className="font-medium">{project.team} members</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Due: {project.dueDate}
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Task Management</h2>
              <p className="text-muted-foreground">Track and manage individual tasks across projects</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Tasks requiring attention or recently updated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {task.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : task.status === "in-progress" ? (
                          <Clock className="h-5 w-5 text-blue-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        )}
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Assigned to {task.assignee} • Due: {task.dueDate}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "in-progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Resource Management</h2>
              <p className="text-muted-foreground">Manage team members, budgets, and project resources</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Allocation</CardTitle>
                  <CardDescription>Current team member assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Project Managers</span>
                      <span className="font-medium">8/10</span>
                    </div>
                    <Progress value={80} />

                    <div className="flex items-center justify-between">
                      <span>Procurement Officers</span>
                      <span className="font-medium">12/15</span>
                    </div>
                    <Progress value={80} />

                    <div className="flex items-center justify-between">
                      <span>Finance Analysts</span>
                      <span className="font-medium">6/8</span>
                    </div>
                    <Progress value={75} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                  <CardDescription>Project budget allocation and spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Total Budget</span>
                      <span className="font-medium">R 15.2M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Allocated</span>
                      <span className="font-medium">R 12.8M</span>
                    </div>
                    <Progress value={84} />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Available</span>
                      <span>R 2.4M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Reports & Analytics</h2>
              <p className="text-muted-foreground">Generate and view project performance reports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Project Performance</CardTitle>
                  <CardDescription>Detailed analysis of project metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Resource Utilization</CardTitle>
                  <CardDescription>Team and budget utilization analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Timeline Analysis</CardTitle>
                  <CardDescription>Project timeline and milestone tracking</CardDescription>
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
