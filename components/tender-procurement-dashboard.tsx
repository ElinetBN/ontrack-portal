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
  X,
  Bell,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Upload,
} from "lucide-react"

// Initial tenders data
const initialTenders = [
  {
    id: "TND-2024-001",
    title: "IT Infrastructure Upgrade Project",
    department: "Information Technology",
    status: "Open",
    deadline: "2024-02-15",
    budget: "R 2,500,000",
    submissions: 12,
    category: "Technology",
    description: "Upgrade of entire IT infrastructure including servers, networking equipment, and workstations.",
    referenceNumber: "REF-IT-001",
    requestedItems: ["Technical Specifications", "Financial Proposal", "Project Timeline"]
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
    description: "Supply and installation of modern office furniture for the new headquarters building.",
    referenceNumber: "REF-FM-002",
    requestedItems: ["Company Registration Documents", "Tax Compliance Certificate", "BEE Certificate"]
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
    description: "24/7 security services for corporate headquarters and satellite offices.",
    referenceNumber: "REF-SEC-003",
    requestedItems: ["Methodology Statement", "Health and Safety Policy", "Team CVs"]
  },
]

// Calendar events data
const calendarEvents = [
  {
    id: 1,
    date: "2024-06-01",
    time: "2:00pm",
    title: "Bid specification - Appointment of a consultant to formulate a strategy for Microsoft BI stack",
    type: "specification"
  },
  {
    id: 2,
    date: "2024-06-13",
    time: "8:00am",
    title: "Advert issue - Appointment of a consultant to formulate a strategy for Microsoft BI stack",
    type: "advert"
  },
  {
    id: 3,
    date: "2024-06-16",
    time: "10:00am",
    title: "Bid submission deadline - Office Furniture Supply",
    type: "deadline"
  },
  {
    id: 4,
    date: "2024-06-20",
    time: "3:00pm",
    title: "Evaluation committee meeting",
    type: "meeting"
  }
]

// Notifications data
const notifications = [
  {
    id: 1,
    title: "Document Approval Required",
    message: "SBD form document has been uploaded by Basic Moderna. Document needs Business Unit, SCM Manager, CEO & Support's approval.",
    date: "Apr 2024",
    type: "approval",
    urgent: true,
    read: false
  },
  {
    id: 2,
    title: "Document Approval Required",
    message: "SBD form document has been uploaded by Nails Moderna. Document needs Business Unit, SCM Manager, CEO & Support's approval.",
    date: "Apr 2024",
    type: "approval",
    urgent: true,
    read: false
  },
  {
    id: 3,
    title: "System Alert",
    message: "System failed to auto-update 34 bidder accounts. Click here to review CSD connection details.",
    date: "Jun 2024",
    type: "alert",
    urgent: true,
    read: true
  },
  {
    id: 4,
    title: "Bid Portal Reminder",
    message: "Open bid submission portal for list month submissions.",
    date: "Jun 2024",
    type: "reminder",
    urgent: false,
    read: true
  }
]

// Tender Registration Popup Component
function TenderRegistrationPopup({ 
  isOpen, 
  onClose, 
  onTenderCreate 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onTenderCreate: (tender: any) => void;
}) {
  const [formData, setFormData] = useState({
    referenceNumber: "",
    projectTitle: "",
    budgetEstimate: "",
    projectDescription: "",
    selectedItems: [] as string[],
  })

  const requestItems = [
    "Technical Specifications",
    "Financial Proposal",
    "Company Registration Documents",
    "Tax Compliance Certificate",
    "BEE Certificate",
    "Project Timeline",
    "Team CVs",
    "Methodology Statement",
    "Quality Assurance Plan",
    "Health and Safety Policy",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleItemToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(item)
        ? prev.selectedItems.filter(i => i !== item)
        : [...prev.selectedItems, item]
    }))
  }

  const generateTenderId = () => {
    const currentYear = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 900) + 100
    return `TND-${currentYear}-${randomNum}`
  }

  const getRandomDepartment = () => {
    const departments = [
      "Information Technology",
      "Facilities Management", 
      "Security",
      "Human Resources",
      "Finance",
      "Operations",
      "Marketing",
      "Research & Development"
    ]
    return departments[Math.floor(Math.random() * departments.length)]
  }

  const getRandomCategory = () => {
    const categories = ["Technology", "Supplies", "Services", "Construction", "Consulting"]
    return categories[Math.floor(Math.random() * categories.length)]
  }

  const getRandomDeadline = () => {
    const date = new Date()
    date.setDate(date.getDate() + Math.floor(Math.random() * 60) + 30)
    return date.toISOString().split('T')[0]
  }

  const formatBudget = (amount: string) => {
    const numericValue = parseInt(amount.replace(/\D/g, '') || '0')
    return `R ${numericValue.toLocaleString()}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new tender object
    const newTender = {
      id: generateTenderId(),
      title: formData.projectTitle,
      department: getRandomDepartment(),
      status: "Open",
      deadline: getRandomDeadline(),
      budget: formatBudget(formData.budgetEstimate),
      submissions: Math.floor(Math.random() * 15),
      category: getRandomCategory(),
      description: formData.projectDescription,
      referenceNumber: formData.referenceNumber || `REF-${Math.floor(Math.random() * 1000)}`,
      requestedItems: formData.selectedItems,
      createdDate: new Date().toISOString().split('T')[0]
    }

    // Call the callback to add the new tender
    onTenderCreate(newTender)

    // Reset form
    setFormData({
      referenceNumber: "",
      projectTitle: "",
      budgetEstimate: "",
      projectDescription: "",
      selectedItems: [],
    })
    
    onClose()
  }

  const handleClose = () => {
    setFormData({
      referenceNumber: "",
      projectTitle: "",
      budgetEstimate: "",
      projectDescription: "",
      selectedItems: [],
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Create New Service Request</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Reference Number */}
          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference number</Label>
            <Input
              id="referenceNumber"
              placeholder="Enter reference number"
              value={formData.referenceNumber}
              onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
            />
          </div>

          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="projectTitle" className="flex items-center gap-1">
              Project title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="projectTitle"
              placeholder="Enter project title"
              value={formData.projectTitle}
              onChange={(e) => handleInputChange("projectTitle", e.target.value)}
              required
            />
          </div>

          {/* Budget Estimate */}
          <div className="space-y-2">
            <Label htmlFor="budgetEstimate" className="flex items-center gap-1">
              Budget estimate <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">R</span>
              <Input
                id="budgetEstimate"
                placeholder="Enter budget estimate"
                className="pl-8"
                value={formData.budgetEstimate}
                onChange={(e) => handleInputChange("budgetEstimate", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Project Brief Description */}
          <div className="space-y-2">
            <Label htmlFor="projectDescription" className="flex items-center gap-1">
              Project brief description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="projectDescription"
              placeholder="Provide a detailed description of the project..."
              rows={4}
              value={formData.projectDescription}
              onChange={(e) => handleInputChange("projectDescription", e.target.value)}
              required
            />
          </div>

          {/* Select Request Items */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1">
              Select request items
            </Label>
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requestItems.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`item-${item}`}
                      checked={formData.selectedItems.includes(item)}
                      onChange={() => handleItemToggle(item)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label
                      htmlFor={`item-${item}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Create Service Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Calendar Component
function CalendarSidebar() {
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'specification':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'advert':
        return <Upload className="h-4 w-4 text-green-500" />
      case 'deadline':
        return <Clock className="h-4 w-4 text-red-500" />
      case 'meeting':
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <CalendarDays className="h-4 w-4 text-gray-500" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'specification':
        return 'border-l-blue-500'
      case 'advert':
        return 'border-l-green-500'
      case 'deadline':
        return 'border-l-red-500'
      case 'meeting':
        return 'border-l-purple-500'
      default:
        return 'border-l-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            Calendar Events
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {currentMonth}
          </Badge>
        </div>
        <CardDescription>Upcoming tender-related events and deadlines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <div className="text-xs text-blue-600">Pending Requests</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">30</div>
            <div className="text-xs text-green-600">Active Projects</div>
          </div>
        </div>

        {/* Calendar Events */}
        <div className="space-y-3">
          {calendarEvents.map((event) => (
            <div 
              key={event.id}
              className={`p-3 border rounded-lg border-l-4 ${getEventColor(event.type)} bg-white`}
            >
              <div className="flex items-start gap-3">
                {getEventIcon(event.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{event.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bid Portal Section */}
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Bid Portal Reminder</span>
          </div>
          <p className="text-xs text-orange-700 mb-3">
            Open bid submission portal for list month submissions.
          </p>
          <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            Open Portal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Notifications Component
function NotificationsSidebar() {
  const [notificationsList, setNotificationsList] = useState(notifications)

  const markAsRead = (id: number) => {
    setNotificationsList(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotificationsList(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const unreadCount = notificationsList.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'reminder':
        return <Bell className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <CardDescription>Recent system alerts and approvals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationsList.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 border rounded-lg ${
              !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${
                    !notification.read ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </span>
                  {notification.urgent && !notification.read && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className={`text-sm mb-2 ${
                  !notification.read ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {notification.message}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{notification.date}</span>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* System Alert Card */}
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">System Alert</span>
          </div>
          <p className="text-xs text-red-700 mb-3">
            System failed to auto-update 34 bidder accounts. Click here to review CSD connection details.
          </p>
          <Button size="sm" variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100">
            Review CSD Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function TenderProcurementDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [tenders, setTenders] = useState(initialTenders)
  const [submissions, setSubmissions] = useState([
    {
      id: "SUB-001",
      tenderId: "TND-2024-001",
      supplier: "TechCorp Solutions",
      submittedDate: "2024-01-25",
      status: "Under Review",
      score: "85",
      documents: 5,
    },
    {
      id: "SUB-002",
      tenderId: "TND-2024-001",
      supplier: "Digital Dynamics",
      submittedDate: "2024-01-24",
      status: "Evaluated",
      score: "92",
      documents: 6,
    },
    {
      id: "SUB-003",
      tenderId: "TND-2024-002",
      supplier: "Office Plus",
      submittedDate: "2024-01-28",
      status: "Compliant",
      score: "78",
      documents: 4,
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")

  const handleTenderCreate = (newTender: any) => {
    setTenders(prev => [newTender, ...prev])
    
    const supplierNames = ["Global Solutions Inc", "Innovate Partners", "Prime Contractors", "Elite Services Co", "Advanced Systems Ltd"]
    const newSubmissions = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, index) => ({
      id: `SUB-${Date.now()}-${index}`,
      tenderId: newTender.id,
      supplier: supplierNames[Math.floor(Math.random() * supplierNames.length)],
      submittedDate: new Date().toISOString().split('T')[0],
      status: "Under Review",
      score: (Math.floor(Math.random() * 20) + 70).toString(),
      documents: Math.floor(Math.random() * 5) + 2,
    }))
    
    setSubmissions(prev => [...newSubmissions, ...prev])
  }

  // Calculate dynamic statistics
  const activeTendersCount = tenders.filter(tender => tender.status === "Open").length
  const totalSubmissionsCount = submissions.length
  const pendingEvaluationCount = submissions.filter(sub => sub.status === "Under Review").length
  const totalBudgetValue = tenders.reduce((sum, tender) => {
    const value = parseInt(tender.budget.replace(/[^0-9]/g, '')) || 0
    return sum + value
  }, 0)

  // Filter tenders for display
  const filteredTenders = tenders.filter(tender =>
    tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get recent tenders (sorted by creation date, most recent first)
  const recentTenders = [...tenders]
    .sort((a, b) => new Date(b.createdDate || b.deadline).getTime() - new Date(a.createdDate || a.deadline).getTime())
    .slice(0, 5)

  // Get submissions for evaluation queue
  const evaluationQueueSubmissions = submissions
    .filter(sub => sub.status === "Under Review")
    .slice(0, 3)

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{activeTendersCount}</div>
                      <p className="text-xs text-muted-foreground">
                        {activeTendersCount > 3 ? `+${activeTendersCount - 3} from last month` : 'Consistent with last month'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalSubmissionsCount}</div>
                      <p className="text-xs text-muted-foreground">
                        {totalSubmissionsCount > 3 ? `+${totalSubmissionsCount - 3} total submissions` : 'Managing submissions'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Evaluation</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{pendingEvaluationCount}</div>
                      <p className="text-xs text-muted-foreground">
                        {pendingEvaluationCount > 0 ? `${pendingEvaluationCount} awaiting review` : 'All caught up'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                      <span className="h-4 w-4 text-muted-foreground flex items-center justify-center font-bold text-sm">R</span>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">R {(totalBudgetValue / 1000000).toFixed(1)}M</div>
                      <p className="text-xs text-muted-foreground">Across {tenders.length} active tenders</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => setIsRegistrationOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Register New Tender
                  </Button>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Tenders</CardTitle>
                      <CardDescription>Latest tender publications and updates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentTenders.map((tender) => (
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
                      {evaluationQueueSubmissions.map((submission) => (
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
                      {evaluationQueueSubmissions.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          No submissions awaiting evaluation
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="space-y-6">
                <CalendarSidebar />
                <NotificationsSidebar />
              </div>
            </div>
          </TabsContent>

          {/* Other tabs remain the same */}
          <TabsContent value="tenders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Tender Management</h2>
                <p className="text-muted-foreground">
                  Manage {tenders.length} tender{tenders.length !== 1 ? 's' : ''} and opportunities
                </p>
              </div>
              <Button onClick={() => setIsRegistrationOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Tender
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tenders..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Tenders List */}
            <div className="space-y-4">
              {filteredTenders.map((tender) => (
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
                          {tender.referenceNumber && ` • Ref: ${tender.referenceNumber}`}
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
              {filteredTenders.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No tenders found matching your search criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Submission Management</h2>
              <p className="text-muted-foreground">
                Review and manage {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </p>
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
                          <Progress value={parseInt(submission.score)} className="h-2" />
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
              <p className="text-muted-foreground">
                Automated and manual evaluation tools for {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </p>
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
                    {submissions.filter(sub => sub.score && parseInt(sub.score) > 80).slice(0, 2).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{submission.supplier}</p>
                          <p className="text-sm text-muted-foreground">Technical compliance: {submission.score}%</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{submission.score}%</p>
                          <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                        </div>
                      </div>
                    ))}
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
                    {submissions.filter(sub => sub.status === "Under Review").slice(0, 3).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{submission.supplier}</p>
                          <p className="text-sm text-muted-foreground">Pending {submission.tenderId.includes('IT') ? 'technical' : 'financial'} review</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Review
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Contract Management</h2>
              <p className="text-muted-foreground">
                Manage awarded contracts from {tenders.filter(t => t.status === "Awarded").length} tender{tenders.filter(t => t.status === "Awarded").length !== 1 ? 's' : ''}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Active Contracts</CardTitle>
                <CardDescription>Currently active procurement contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenders.filter(tender => tender.status === "Awarded").map((tender) => (
                    <div key={tender.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{tender.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {tender.department} • {tender.budget}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Active</Badge>
                          <span className="text-xs text-muted-foreground">Expires: {tender.deadline}</span>
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
                  ))}
                  {tenders.filter(tender => tender.status === "Awarded").length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No awarded contracts yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Tender Registration Popup */}
      <TenderRegistrationPopup 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)}
        onTenderCreate={handleTenderCreate}
      />
    </div>
  )
}