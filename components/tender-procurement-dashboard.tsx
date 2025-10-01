"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
  MapPin,
  User,
  Phone,
  Mail,
  FileUp,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Star,
  BarChart3,
} from "lucide-react"

// Initial tenders data with advertisement links
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
    requestedItems: ["Technical Specifications", "Financial Proposal", "Project Timeline"],
    advertisementLink: "https://example.gov.za/tenders/TND-2024-001",
    evaluationScore: 85,
    contactPerson: "John Smith",
    contactEmail: "john.smith@company.com",
    contactPhone: "+27 11 123 4567",
    location: "Johannesburg, Gauteng",
    createdDate: "2024-01-10"
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
    requestedItems: ["Company Registration Documents", "Tax Compliance Certificate", "BEE Certificate"],
    advertisementLink: "https://example.gov.za/tenders/TND-2024-002",
    evaluationScore: 92,
    contactPerson: "Sarah Johnson",
    contactEmail: "sarah.j@company.com",
    contactPhone: "+27 11 234 5678",
    location: "Cape Town, Western Cape",
    createdDate: "2024-01-05"
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
    requestedItems: ["Methodology Statement", "Health and Safety Policy", "Team CVs"],
    advertisementLink: "https://example.gov.za/tenders/TND-2024-003",
    evaluationScore: 78,
    contactPerson: "Mike Brown",
    contactEmail: "mike.brown@company.com",
    contactPhone: "+27 11 345 6789",
    location: "Durban, KwaZulu-Natal",
    createdDate: "2024-01-02"
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

// Service categories
const serviceCategories = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Catering",
  "Security",
  "Construction",
  "IT Services",
  "Facilities Management",
  "Landscaping",
  "Maintenance",
  "Consulting",
  "Transportation"
]

// CIDB Grading levels
const cidbGrading = [
  "1GB",
  "2GB",
  "3GB",
  "4GB",
  "5GB",
  "6GB",
  "7GB",
  "8GB",
  "9GB"
]

// B-BBEE Levels
const bbbeeLevels = [
  "Level 1",
  "Level 2",
  "Level 3",
  "Level 4",
  "Level 5",
  "Level 6",
  "Level 7",
  "Level 8",
  "Non-Compliant"
]

// Evaluation criteria
const evaluationCriteria = [
  "Price Competitiveness",
  "Technical Experience",
  "B-BBEE Status",
  "Safety Compliance",
  "Quality Assurance",
  "Project Methodology",
  "Team Experience",
  "Financial Stability",
  "References",
  "Innovation"
]

// Mandatory documents
const mandatoryDocuments = [
  "CIPC Registration Documents",
  "Tax Clearance Certificate",
  "B-BBEE Certificate",
  "CIDB Certificate",
  "Company Profile",
  "Reference Letters",
  "Insurance Certificates",
  "Health and Safety Policy",
  "CVs of Key Personnel",
  "Quality Management System"
]

// Tender Information Popup Component
function TenderInfoPopup({ 
  isOpen, 
  onClose, 
  tender 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  tender: any;
}) {
  if (!isOpen || !tender) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Tender Information</h2>
            <p className="text-sm text-muted-foreground">Complete details for {tender.title}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Tender ID</Label>
                  <p className="text-sm">{tender.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reference Number</Label>
                  <p className="text-sm">{tender.referenceNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="text-sm">{tender.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm">{tender.category}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Financial Details</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Budget</Label>
                  <p className="text-sm font-semibold">{tender.budget}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Submissions Received</Label>
                  <p className="text-sm">{tender.submissions}</p>
                </div>
                {tender.evaluationScore && (
                  <div>
                    <Label className="text-sm font-medium">Evaluation Score</Label>
                    <p className="text-sm">{tender.evaluationScore}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium">Description</Label>
            <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{tender.description}</p>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium">Deadline</Label>
                    <p className="text-sm">{tender.deadline}</p>
                  </div>
                </div>
                {tender.createdDate && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Created Date</Label>
                      <p className="text-sm">{tender.createdDate}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {tender.contactPerson && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Contact Person</Label>
                      <p className="text-sm">{tender.contactPerson}</p>
                    </div>
                  </div>
                )}
                {tender.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{tender.contactEmail}</p>
                    </div>
                  </div>
                )}
                {tender.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm">{tender.contactPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          {tender.location && (
            <div>
              <Label className="text-sm font-medium">Location</Label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{tender.location}</p>
              </div>
            </div>
          )}

          {/* Requested Items */}
          <div>
            <Label className="text-sm font-medium">Requested Documents/Items</Label>
            <div className="mt-2 space-y-2">
              {tender.requestedItems?.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Advertisement Link */}
          {tender.advertisementLink && (
            <div>
              <Label className="text-sm font-medium">Advertisement Link</Label>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.open(tender.advertisementLink, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Tender Advertisement
                </Button>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
            <Label className="text-sm font-medium">Current Status:</Label>
            <Badge
              variant={
                tender.status === "Open"
                  ? "default"
                  : tender.status === "Evaluation"
                    ? "secondary"
                    : tender.status === "Awarded"
                      ? "outline"
                      : "destructive"
              }
              className="text-sm"
            >
              {tender.status}
            </Badge>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.open(tender.advertisementLink, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Advertisement
          </Button>
        </div>
      </div>
    </div>
  )
}

// Document Upload/Edit Modal Component
function DocumentModal({ 
  isOpen, 
  onClose, 
  document = null,
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  document?: any;
  onSave: (document: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: document?.name || "",
    type: document?.type || "",
    description: document?.description || "",
    file: null as File | null,
    version: document?.version || "1.0",
    category: document?.category || "Technical",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        file: files[0],
        name: files[0].name
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const documentData = {
      id: document?.id || `doc-${Date.now()}`,
      ...formData,
      uploadDate: document?.uploadDate || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      size: formData.file?.size || document?.size || 0,
      uploadedBy: document?.uploadedBy || "Current User"
    }
    onSave(documentData)
    onClose()
  }

  const documentCategories = [
    "Technical",
    "Financial",
    "Legal",
    "Compliance",
    "Administrative",
    "Other"
  ]

  const documentTypes = [
    "PDF",
    "Word Document",
    "Excel Spreadsheet",
    "PowerPoint",
    "Image",
    "Other"
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">
              {document ? "Edit Document" : "Upload New Document"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {document ? "Update document details" : "Add a new document to the submission"}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <Label htmlFor="documentFile" className="text-sm font-medium">
              Document File {!document && <span className="text-red-500">*</span>}
            </Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-3">
                {document ? "Replace current file or keep existing" : "Drag and drop files here or click to browse"}
              </p>
              <Input
                id="documentFile"
                type="file"
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
              />
              <Label htmlFor="documentFile">
                <Button variant="outline" type="button" asChild>
                  <span>{document ? "Replace File" : "Choose File"}</span>
                </Button>
              </Label>
              {formData.file && (
                <p className="mt-3 text-sm text-green-600">
                  Selected: {formData.file.name}
                </p>
              )}
              {document && !formData.file && (
                <p className="mt-3 text-sm text-gray-600">
                  Current: {document.name}
                </p>
              )}
            </div>
          </div>

          {/* Document Name */}
          <div>
            <Label htmlFor="documentName" className="text-sm font-medium">
              Document Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="documentName"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="mt-1"
              placeholder="Enter document name"
            />
          </div>

          {/* Document Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="documentType" className="text-sm font-medium">
                Document Type
              </Label>
              <select
                id="documentType"
                className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <option value="">Select Type</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="documentCategory" className="text-sm font-medium">
                Category
              </Label>
              <select
                id="documentCategory"
                className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                {documentCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Version */}
          <div>
            <Label htmlFor="documentVersion" className="text-sm font-medium">
              Version
            </Label>
            <Input
              id="documentVersion"
              value={formData.version}
              onChange={(e) => handleInputChange("version", e.target.value)}
              className="mt-1"
              placeholder="e.g., 1.0"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="documentDescription" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="documentDescription"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="mt-1 resize-vertical"
              placeholder="Enter document description..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {document ? "Update Document" : "Upload Document"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Document Management Section Component
function DocumentManagementSection({ submission, onDocumentsUpdate }: { 
  submission: any; 
  onDocumentsUpdate: (submissionId: string, documents: any[]) => void;
}) {
  const [documents, setDocuments] = useState(submission.documents || [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<any>(null)

  const handleAddDocument = (newDocument: any) => {
    const updatedDocuments = [...documents, newDocument]
    setDocuments(updatedDocuments)
    onDocumentsUpdate(submission.id, updatedDocuments)
  }

  const handleEditDocument = (updatedDocument: any) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    )
    setDocuments(updatedDocuments)
    onDocumentsUpdate(submission.id, updatedDocuments)
  }

  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId)
    setDocuments(updatedDocuments)
    onDocumentsUpdate(submission.id, updatedDocuments)
  }

  const openEditModal = (document: any) => {
    setEditingDocument(document)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingDocument(null)
  }

  const handleSaveDocument = (document: any) => {
    if (editingDocument) {
      handleEditDocument(document)
    } else {
      handleAddDocument(document)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.includes('.pdf')) return '📄'
    if (fileName.includes('.doc') || fileName.includes('.docx')) return '📝'
    if (fileName.includes('.xls') || fileName.includes('.xlsx')) return '📊'
    if (fileName.includes('.ppt') || fileName.includes('.pptx')) return '📽️'
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) return '🖼️'
    return '📎'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documents</h3>
        <Button onClick={() => setIsModalOpen(true)} className="hover:bg-blue-600 transition-colors">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No documents uploaded yet</p>
          <Button variant="outline" onClick={() => setIsModalOpen(true)} className="hover:bg-gray-100 transition-colors">
            Upload First Document
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document: any) => (
            <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-2xl">
                  {getFileIcon(document.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-sm truncate">{document.name}</p>
                    <Badge variant="outline" className="text-xs">
                      v{document.version}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{formatFileSize(document.size)}</span>
                    <span>{document.category}</span>
                    <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                    {document.lastModified && (
                      <span>Modified: {new Date(document.lastModified).toLocaleDateString()}</span>
                    )}
                  </div>
                  {document.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {document.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-transparent hover:bg-gray-100 transition-colors">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent hover:bg-gray-100 transition-colors">
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent hover:bg-gray-100 transition-colors"
                  onClick={() => openEditModal(document)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  onClick={() => handleDeleteDocument(document.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DocumentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        document={editingDocument}
        onSave={handleSaveDocument}
      />
    </div>
  )
}

// Enhanced Submission Card Component
function SubmissionCard({ 
  submission, 
  onDocumentsUpdate,
  onReviewClick
}: { 
  submission: any; 
  onDocumentsUpdate: (submissionId: string, documents: any[]) => void;
  onReviewClick: (submission: any) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
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
                {submission.documents?.length || 0} documents
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {submission.supplier}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent hover:bg-gray-100 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Hide" : "Manage"} Documents
              </Button>
              <Button 
                size="sm" 
                onClick={() => onReviewClick(submission)}
                className="hover:bg-blue-600 transition-colors"
              >
                Review
              </Button>
            </div>
          </div>

          {/* Expandable Document Management Section */}
          {isExpanded && (
            <div className="border-t pt-4 mt-4">
              <DocumentManagementSection 
                submission={submission}
                onDocumentsUpdate={onDocumentsUpdate}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Evaluation Panel Component
function EvaluationPanel({ 
  submission, 
  onEvaluationComplete 
}: { 
  submission: any; 
  onEvaluationComplete: (submissionId: string, score: number, status: string) => void;
}) {
  const [score, setScore] = useState(submission.score || 0)
  const [comments, setComments] = useState("")
  const [status, setStatus] = useState(submission.status || "Under Review")

  const handleSubmitEvaluation = () => {
    onEvaluationComplete(submission.id, score, status)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation Panel - {submission.supplier}</CardTitle>
        <CardDescription>Evaluate this submission and provide feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="score" className="text-sm font-medium">
              Evaluation Score: {score}%
            </Label>
            <Input
              id="score"
              type="range"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <select
              id="status"
              className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Under Review">Under Review</option>
              <option value="Evaluated">Evaluated</option>
              <option value="Recommended">Recommended</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <Label htmlFor="comments" className="text-sm font-medium">
              Evaluation Comments
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide detailed evaluation comments..."
              rows={4}
              className="mt-1"
            />
          </div>

          <Button 
            onClick={handleSubmitEvaluation}
            className="w-full hover:bg-green-600 transition-colors"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Submit Evaluation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Tender Review Component
function TenderReviewComponent({ tenders, onTenderStatusChange }: { tenders: any[], onTenderStatusChange: (tenderId: string, newStatus: string) => void }) {
  const [isApproved, setIsApproved] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const [requestChanges, setRequestChanges] = useState(false)
  const [comment, setComment] = useState("")
  const [selectedTender, setSelectedTender] = useState<any>(null)
  const [showTenderInfo, setShowTenderInfo] = useState(false)

  const handleApprove = () => {
    setIsApproved(true)
    setIsRejected(false)
    setRequestChanges(false)
    if (selectedTender) {
      onTenderStatusChange(selectedTender.id, "Awarded")
    }
  }

  const handleReject = () => {
    setIsRejected(true)
    setIsApproved(false)
    setRequestChanges(false)
    if (selectedTender) {
      onTenderStatusChange(selectedTender.id, "Rejected")
    }
  }

  const handleRequestChanges = () => {
    setRequestChanges(true)
    setIsApproved(false)
    setIsRejected(false)
  }

  const handleSubmitComment = () => {
    if (comment.trim()) {
      console.log("Comment submitted:", comment)
      setComment("")
    }
  }

  const handleReviewClick = (tender: any) => {
    setSelectedTender(tender)
    setShowTenderInfo(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader
        title="Tender Review"
        description="Review and approve tender submissions"
        icon={
          <div className="bg-blue-500 p-2 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
        }
      />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tender Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Checkbox id="dashboard" />
                  <Label htmlFor="dashboard" className="font-medium cursor-pointer">
                    Dashboard
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Checkbox id="tenders" />
                  <Label htmlFor="tenders" className="font-medium cursor-pointer">
                    Tenders
                  </Label>
                </div>
                <div className="text-sm text-muted-foreground pl-6">
                  Supply of Office Furniture
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                  <Checkbox id="reviews" checked readOnly />
                  <Label htmlFor="reviews" className="font-medium cursor-pointer">
                    Reviews
                  </Label>
                </div>
                <div className="text-sm pl-6 space-y-2">
                  <div className="font-medium">Reference</div>
                  <div className="text-muted-foreground">TENDER-2024-001</div>
                  <div className="font-medium">Closing Date</div>
                  <div className="text-muted-foreground">April 30, 2024</div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Checkbox id="settings" />
                  <Label htmlFor="settings" className="font-medium cursor-pointer">
                    Settings
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Tenders List for Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tenders for Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tenders.map((tender) => (
                  <div 
                    key={tender.id} 
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedTender?.id === tender.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedTender(tender)}
                  >
                    <div className="font-medium text-sm">{tender.title}</div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant={
                          tender.status === "Open"
                            ? "default"
                            : tender.status === "Evaluation"
                              ? "secondary"
                              : tender.status === "Awarded"
                                ? "outline"
                                : "destructive"
                        }
                        className="text-xs"
                      >
                        {tender.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReviewClick(tender)
                        }}
                        className="hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Supply of Office Furniture</CardTitle>
                    <CardDescription>
                      TENDER-2024-001 • Closing Date: April 30, 2024
                    </CardDescription>
                  </div>
                  <Badge variant={isApproved ? "default" : isRejected ? "destructive" : "secondary"}>
                    {isApproved ? "Approved" : isRejected ? "Rejected" : "Under Review"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground">
                    We are seeking bids for the supply and installation of office furniture for our new office spaces. 
                    The tender includes desks, chairs, filing cabinets, and other office furniture. Please refer to 
                    the attached documents for detailed specifications and requirements.
                  </p>
                </div>

                <div className="border-t pt-6">
                  {/* Attachments Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox id="specification" />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="specification" className="cursor-pointer">
                          Specification.pdf
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox id="terms" />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="terms" className="cursor-pointer">
                          Terms.pdf
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox id="budget" />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="budget" className="cursor-pointer">
                          Budget.xlsx
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox id="in-review" />
                        <Label htmlFor="in-review" className="cursor-pointer">
                          In Review
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox id="approved" />
                        <Label htmlFor="approved" className="cursor-pointer">
                          Approved
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Review Actions</h3>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        onClick={handleApprove}
                        variant={isApproved ? "default" : "outline"}
                        className={`${isApproved ? "bg-green-600 hover:bg-green-700" : ""} transition-colors`}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant={isRejected ? "destructive" : "outline"}
                        className="transition-colors"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        onClick={handleRequestChanges}
                        variant={requestChanges ? "secondary" : "outline"}
                        className="transition-colors"
                      >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Request Changes
                      </Button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Comments</h3>
                    <div className="space-y-4">
                      <div className="flex space-x-3">
                        <Textarea
                          placeholder="Add a comment..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <Button 
                        onClick={handleSubmitComment} 
                        disabled={!comment.trim()}
                        className="hover:bg-blue-600 transition-colors"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Review Information</CardTitle>
                <CardDescription>
                  This review section is only accessible to project owners and project leads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Reviewer Role:</span>
                      <span>Project Lead</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Review Deadline:</span>
                      <span>May 15, 2024</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Approval Required:</span>
                      <span>Project Owner & Project Lead</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Notifications:</span>
                      <span>Enabled</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Tender Information Popup */}
      <TenderInfoPopup
        isOpen={showTenderInfo}
        onClose={() => setShowTenderInfo(false)}
        tender={selectedTender}
      />
    </div>
  )
}

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
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Tender Information
    tenderTitle: "",
    tenderReference: "",
    category: "",
    tenderDescription: "",
    supportingDocuments: [] as File[],
    
    // Project Details
    location: "",
    estimatedValue: "",
    contractPeriod: "",
    startDate: "",
    endDate: "",
    cidbGrading: "",
    accreditation: "",
    bbbeeLevel: "",
    insuranceRequired: false,
    universityVendorReg: false,
    
    // Submission Information
    openingDate: "",
    closingDate: "",
    closingTime: "",
    submissionMethod: "online",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    clarificationDeadline: "",
    
    // Evaluation & Compliance
    evaluationCriteria: [] as string[],
    mandatoryDocuments: [] as string[],
    complianceAccepted: false,
    
    // Administrative
    tenderStatus: "draft",
    confidentiality: false,
    tenderFee: "",
    feeAmount: ""
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckboxToggle = (field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }))
  }

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files)
    setFormData(prev => ({
      ...prev,
      supportingDocuments: [...prev.supportingDocuments, ...newFiles]
    }))
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index)
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

  const formatBudget = (amount: string) => {
    const numericValue = parseInt(amount.replace(/\D/g, '') || '0')
    return `R ${numericValue.toLocaleString()}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new tender object
    const newTender = {
      id: formData.tenderReference || generateTenderId(),
      title: formData.tenderTitle,
      department: getRandomDepartment(),
      status: formData.tenderStatus === "published" ? "Open" : "Draft",
      deadline: formData.closingDate,
      budget: formatBudget(formData.estimatedValue),
      submissions: 0,
      category: formData.category,
      description: formData.tenderDescription,
      referenceNumber: formData.tenderReference,
      requestedItems: formData.mandatoryDocuments,
      createdDate: new Date().toISOString().split('T')[0],
      location: formData.location,
      contractPeriod: formData.contractPeriod,
      cidbGrading: formData.cidbGrading,
      bbbeeLevel: formData.bbbeeLevel,
      contactPerson: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      submissionMethod: formData.submissionMethod,
      tenderFee: formData.tenderFee ? `R ${formData.feeAmount}` : "No fee",
      advertisementLink: `https://example.gov.za/tenders/${formData.tenderReference || generateTenderId()}`
    }

    // Call the callback to add the new tender
    onTenderCreate(newTender)

    // Reset form
    setFormData({
      tenderTitle: "",
      tenderReference: "",
      category: "",
      tenderDescription: "",
      supportingDocuments: [],
      location: "",
      estimatedValue: "",
      contractPeriod: "",
      startDate: "",
      endDate: "",
      cidbGrading: "",
      accreditation: "",
      bbbeeLevel: "",
      insuranceRequired: false,
      universityVendorReg: false,
      openingDate: "",
      closingDate: "",
      closingTime: "",
      submissionMethod: "online",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      clarificationDeadline: "",
      evaluationCriteria: [],
      mandatoryDocuments: [],
      complianceAccepted: false,
      tenderStatus: "draft",
      confidentiality: false,
      tenderFee: "",
      feeAmount: ""
    })
    
    setCurrentStep(1)
    onClose()
  }

  const handleClose = () => {
    setFormData({
      tenderTitle: "",
      tenderReference: "",
      category: "",
      tenderDescription: "",
      supportingDocuments: [],
      location: "",
      estimatedValue: "",
      contractPeriod: "",
      startDate: "",
      endDate: "",
      cidbGrading: "",
      accreditation: "",
      bbbeeLevel: "",
      insuranceRequired: false,
      universityVendorReg: false,
      openingDate: "",
      closingDate: "",
      closingTime: "",
      submissionMethod: "online",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      clarificationDeadline: "",
      evaluationCriteria: [],
      mandatoryDocuments: [],
      complianceAccepted: false,
      tenderStatus: "draft",
      confidentiality: false,
      tenderFee: "",
      feeAmount: ""
    })
    setCurrentStep(1)
    onClose()
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Create New Tender</h2>
            <p className="text-sm text-muted-foreground">Step {currentStep} of 5</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 mx-1 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Tender Info</span>
            <span>Project Details</span>
            <span>Submission</span>
            <span>Evaluation</span>
            <span>Administrative</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Tender Information */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-6 text-blue-600">Tender Information</h3>
                
                <div className="space-y-6">
                  {/* Tender Title */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="tenderTitle" className="text-sm font-medium">
                        Tender Title <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">e.g., "Plumbing Maintenance – Block A, 2026"</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="tenderTitle"
                        placeholder="Enter tender title"
                        value={formData.tenderTitle}
                        onChange={(e) => handleInputChange("tenderTitle", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Tender Reference */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="tenderReference" className="text-sm font-medium">
                        Tender Reference Number
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">System-generated or manually entered</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="tenderReference"
                        placeholder="Enter reference number or leave blank for auto-generation"
                        value={formData.tenderReference}
                        onChange={(e) => handleInputChange("tenderReference", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category / Service Type <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Select the primary service category</p>
                    </div>
                    <div className="lg:col-span-2">
                      <select
                        id="category"
                        className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1"
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {serviceCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tender Description */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Label htmlFor="tenderDescription" className="text-sm font-medium">
                        Tender Description / Scope of Work <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Clear details of requirements, scope, deliverables</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Textarea
                        id="tenderDescription"
                        placeholder="Provide detailed description of the tender requirements, scope of work, deliverables, and any specific requirements..."
                        rows={8}
                        value={formData.tenderDescription}
                        onChange={(e) => handleInputChange("tenderDescription", e.target.value)}
                        required
                        className="w-full resize-vertical"
                      />
                    </div>
                  </div>

                  {/* Supporting Documents */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Label htmlFor="supportingDocuments" className="text-sm font-medium">
                        Supporting Documents
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">BoQ, drawings, specifications, TOR, RFP docs</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-3">
                          Drag and drop files here or click to browse
                        </p>
                        <Input
                          id="supportingDocuments"
                          type="file"
                          multiple
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                        <Label htmlFor="supportingDocuments">
                          <Button variant="outline" type="button" asChild className="hover:bg-gray-100 transition-colors">
                            <span>Choose Files</span>
                          </Button>
                        </Label>
                      </div>
                      
                      {formData.supportingDocuments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium">Selected Files:</p>
                          {formData.supportingDocuments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="hover:bg-gray-200 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-6 text-blue-600">Project Details</h3>
                
                <div className="space-y-6">
                  {/* Location */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="location" className="text-sm font-medium">
                        Location / Residence Name <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">e.g., Morningside Student Village, Block C</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="location"
                        placeholder="Enter project location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Estimated Value */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="estimatedValue" className="text-sm font-medium">
                        Estimated Project Value <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Budget range for the project</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">R</span>
                        <Input
                          id="estimatedValue"
                          placeholder="Enter budget estimate"
                          className="pl-8 w-full"
                          value={formData.estimatedValue}
                          onChange={(e) => handleInputChange("estimatedValue", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contract Period */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="contractPeriod" className="text-sm font-medium">
                        Duration / Contract Period
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">e.g., 12 months or start date - end date</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="contractPeriod"
                        placeholder="e.g., 12 months"
                        value={formData.contractPeriod}
                        onChange={(e) => handleInputChange("contractPeriod", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* CIDB Grading */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="cidbGrading" className="text-sm font-medium">
                        CIDB Grading Requirement
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Required contractor grading level</p>
                    </div>
                    <div className="lg:col-span-2">
                      <select
                        id="cidbGrading"
                        className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1"
                        value={formData.cidbGrading}
                        onChange={(e) => handleInputChange("cidbGrading", e.target.value)}
                      >
                        <option value="">Select CIDB Grade</option>
                        {cidbGrading.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* B-BBEE Level */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="bbbeeLevel" className="text-sm font-medium">
                        B-BBEE Level Requirement
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Minimum B-BBEE compliance level</p>
                    </div>
                    <div className="lg:col-span-2">
                      <select
                        id="bbbeeLevel"
                        className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1"
                        value={formData.bbbeeLevel}
                        onChange={(e) => handleInputChange("bbbeeLevel", e.target.value)}
                      >
                        <option value="">Select B-BBEE Level</option>
                        {bbbeeLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Label className="text-sm font-medium">
                        Special Requirements
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Additional mandatory requirements</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="insuranceRequired"
                            checked={formData.insuranceRequired}
                            onChange={(e) => handleInputChange("insuranceRequired", e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Label htmlFor="insuranceRequired" className="text-sm font-normal">
                            Insurance Required
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="universityVendorReg"
                            checked={formData.universityVendorReg}
                            onChange={(e) => handleInputChange("universityVendorReg", e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Label htmlFor="universityVendorReg" className="text-sm font-normal">
                            University Vendor Registration Required
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Submission Information */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-6 text-blue-600">Submission Information</h3>
                
                <div className="space-y-6">
                  {/* Opening Date */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="openingDate" className="text-sm font-medium">
                        Tender Opening Date <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">When bidders can start submitting</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="openingDate"
                        type="date"
                        value={formData.openingDate}
                        onChange={(e) => handleInputChange("openingDate", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Closing Date */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="closingDate" className="text-sm font-medium">
                        Tender Closing Date <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Deadline for submissions</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="closingDate"
                        type="date"
                        value={formData.closingDate}
                        onChange={(e) => handleInputChange("closingDate", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Closing Time */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="closingTime" className="text-sm font-medium">
                        Closing Time <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Exact time for submission deadline</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="closingTime"
                        type="time"
                        value={formData.closingTime}
                        onChange={(e) => handleInputChange("closingTime", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Submission Method */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="submissionMethod" className="text-sm font-medium">
                        Submission Method
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">How bidders should submit their proposals</p>
                    </div>
                    <div className="lg:col-span-2">
                      <select
                        id="submissionMethod"
                        className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1"
                        value={formData.submissionMethod}
                        onChange={(e) => handleInputChange("submissionMethod", e.target.value)}
                      >
                        <option value="online">Online Upload Only</option>
                        <option value="email">Email Submission</option>
                        <option value="physical">Physical Delivery</option>
                        <option value="hybrid">Multiple Methods</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="contactName" className="text-sm font-medium">
                        Contact Person Name <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Primary contact for tender queries</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="contactName"
                        placeholder="Full name"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange("contactName", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Contact Email */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="contactEmail" className="text-sm font-medium">
                        Contact Email <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Email address for communications</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Contact Phone */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="contactPhone" className="text-sm font-medium">
                        Contact Phone
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Phone number for urgent queries</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+27 12 345 6789"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Clarification Deadline */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="clarificationDeadline" className="text-sm font-medium">
                        Clarification Period Deadline
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Deadline for bidder questions</p>
                    </div>
                    <div className="lg:col-span-2">
                      <Input
                        id="clarificationDeadline"
                        type="date"
                        value={formData.clarificationDeadline}
                        onChange={(e) => handleInputChange("clarificationDeadline", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Evaluation & Compliance */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-6 text-blue-600">Evaluation & Compliance</h3>
                
                <div className="space-y-8">
                  {/* Evaluation Criteria */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Label className="text-sm font-medium">
                        Evaluation Criteria <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Select criteria for tender evaluation</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 rounded-lg p-6">
                        {evaluationCriteria.map((criterion) => (
                          <div key={criterion} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`eval-${criterion}`}
                              checked={formData.evaluationCriteria.includes(criterion)}
                              onChange={() => handleCheckboxToggle("evaluationCriteria", criterion)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor={`eval-${criterion}`} className="text-sm font-normal cursor-pointer">
                              {criterion}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Documents */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Label className="text-sm font-medium">
                        Mandatory Documents Checklist <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Required documents from bidders</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 rounded-lg p-6">
                        {mandatoryDocuments.map((document) => (
                          <div key={document} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`doc-${document}`}
                              checked={formData.mandatoryDocuments.includes(document)}
                              onChange={() => handleCheckboxToggle("mandatoryDocuments", document)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor={`doc-${document}`} className="text-sm font-normal cursor-pointer">
                              {document}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Compliance Acknowledgement */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label className="text-sm font-medium">
                        Compliance Acknowledgement <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Terms and conditions acceptance</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-blue-50">
                        <input
                          type="checkbox"
                          id="complianceAccepted"
                          checked={formData.complianceAccepted}
                          onChange={(e) => handleInputChange("complianceAccepted", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <Label htmlFor="complianceAccepted" className="text-sm font-normal">
                          I acknowledge that tenderers must accept all rules and terms of this tender
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Administrative */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-6 text-blue-600">Administrative</h3>
                
                <div className="space-y-6">
                  {/* Tender Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="tenderStatus" className="text-sm font-medium">
                        Tender Status
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Current status of the tender</p>
                    </div>
                    <div className="lg:col-span-2">
                      <select
                        id="tenderStatus"
                        className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1"
                        value={formData.tenderStatus}
                        onChange={(e) => handleInputChange("tenderStatus", e.target.value)}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="closed">Closed</option>
                        <option value="awarded">Awarded</option>
                      </select>
                    </div>
                  </div>

                  {/* Tender Fee */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label htmlFor="tenderFee" className="text-sm font-medium">
                        Tender Fees
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Participation fees if applicable</p>
                    </div>
                    <div className="lg:col-span-2">
                      <select
                        id="tenderFee"
                        className="w-full p-3 border border-gray-300 rounded-md bg-white mt-1"
                        value={formData.tenderFee}
                        onChange={(e) => handleInputChange("tenderFee", e.target.value)}
                      >
                        <option value="">No Fee</option>
                        <option value="fixed">Fixed Fee</option>
                        <option value="variable">Variable Fee</option>
                      </select>
                    </div>
                  </div>

                  {/* Fee Amount */}
                  {formData.tenderFee && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                      <div className="lg:col-span-1">
                        <Label htmlFor="feeAmount" className="text-sm font-medium">
                          Fee Amount (ZAR)
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">e.g., R250 non-refundable</p>
                      </div>
                      <div className="lg:col-span-2">
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">R</span>
                          <Input
                            id="feeAmount"
                            placeholder="Enter fee amount"
                            className="pl-8 w-full"
                            value={formData.feeAmount}
                            onChange={(e) => handleInputChange("feeAmount", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confidentiality Clause */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <Label className="text-sm font-medium">
                        Confidentiality Clause
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Include confidentiality requirements</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                        <input
                          type="checkbox"
                          id="confidentiality"
                          checked={formData.confidentiality}
                          onChange={(e) => handleInputChange("confidentiality", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="confidentiality" className="text-sm font-normal">
                          Include Confidentiality Clause in tender documents
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 mt-8 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 hover:bg-gray-100 transition-colors"
            >
              Previous
            </Button>
            
            {currentStep < 5 ? (
              <Button type="button" onClick={nextStep} className="px-6 hover:bg-blue-600 transition-colors">
                Next Step
              </Button>
            ) : (
              <Button type="submit" className="px-6 hover:bg-blue-600 transition-colors">
                <Plus className="mr-2 h-4 w-4" />
                Create Tender
              </Button>
            )}
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
              className={`p-3 border rounded-lg border-l-4 ${getEventColor(event.type)} bg-white hover:bg-gray-50 transition-colors cursor-pointer`}
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
          <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white transition-colors">
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
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="hover:bg-gray-100 transition-colors">
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
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              !notification.read ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => !notification.read && markAsRead(notification.id)}
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
                      className="h-6 text-xs hover:bg-blue-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(notification.id)
                      }}
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
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">System Alert</span>
          </div>
          <p className="text-xs text-red-700 mb-3">
            System failed to auto-update 34 bidder accounts. Click here to review CSD connection details.
          </p>
          <Button size="sm" variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-200 transition-colors">
            Review CSD Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function TenderProcurementDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
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
      documents: [
        {
          id: "doc-1",
          name: "Technical Proposal.pdf",
          type: "PDF",
          category: "Technical",
          description: "Detailed technical proposal outlining the solution approach",
          version: "1.0",
          uploadDate: "2024-01-25T10:30:00Z",
          lastModified: "2024-01-25T10:30:00Z",
          size: 2457600,
          uploadedBy: "TechCorp Solutions"
        },
        {
          id: "doc-2",
          name: "Financial Bid.xlsx",
          type: "Excel Spreadsheet",
          category: "Financial",
          description: "Complete financial breakdown and pricing",
          version: "1.0",
          uploadDate: "2024-01-25T10:32:00Z",
          lastModified: "2024-01-25T10:32:00Z",
          size: 512000,
          uploadedBy: "TechCorp Solutions"
        }
      ],
    },
    {
      id: "SUB-002",
      tenderId: "TND-2024-001",
      supplier: "Digital Dynamics",
      submittedDate: "2024-01-24",
      status: "Evaluated",
      score: "92",
      documents: [
        {
          id: "doc-3",
          name: "Company Profile.pdf",
          type: "PDF",
          category: "Administrative",
          description: "Company overview and credentials",
          version: "1.0",
          uploadDate: "2024-01-24T14:20:00Z",
          lastModified: "2024-01-24T14:20:00Z",
          size: 1536000,
          uploadedBy: "Digital Dynamics"
        }
      ],
    },
    {
      id: "SUB-003",
      tenderId: "TND-2024-002",
      supplier: "Office Plus",
      submittedDate: "2024-01-28",
      status: "Compliant",
      score: "78",
      documents: [],
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTenderInfo, setSelectedTenderInfo] = useState<any>(null)
  const [showTenderInfo, setShowTenderInfo] = useState(false)

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
      documents: [],
    }))
    
    setSubmissions(prev => [...newSubmissions, ...prev])
  }

  const handleDocumentsUpdate = (submissionId: string, updatedDocuments: any[]) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === submissionId
          ? { ...submission, documents: updatedDocuments }
          : submission
      )
    )
  }

  const handleEvaluationComplete = (submissionId: string, score: number, status: string) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === submissionId
          ? { ...submission, score: score.toString(), status }
          : submission
      )
    )
  }

  const handleTenderStatusChange = (tenderId: string, newStatus: string) => {
    setTenders(prev =>
      prev.map(tender =>
        tender.id === tenderId
          ? { ...tender, status: newStatus }
          : tender
      )
    )
  }

  const handleReviewClick = (submission: any) => {
    const tender = tenders.find(t => t.id === submission.tenderId)
    if (tender) {
      setSelectedTenderInfo(tender)
      setShowTenderInfo(true)
    }
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="hover:bg-gray-100 transition-colors">Dashboard</TabsTrigger>
            <TabsTrigger value="tenders" className="hover:bg-gray-100 transition-colors">Tenders</TabsTrigger>
            <TabsTrigger value="submissions" className="hover:bg-gray-100 transition-colors">Submissions</TabsTrigger>
            <TabsTrigger value="evaluation" className="hover:bg-gray-100 transition-colors">Evaluation</TabsTrigger>
            <TabsTrigger value="contracts" className="hover:bg-gray-100 transition-colors">Contracts</TabsTrigger>
            <TabsTrigger value="review" className="hover:bg-gray-100 transition-colors">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
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
                  {/* <Button 
                    size="lg" 
                    onClick={() => setIsRegistrationOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Register New Tender
                  </Button> */}
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
                        <div 
                          key={tender.id} 
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedTenderInfo(tender)
                            setShowTenderInfo(true)
                          }}
                        >
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
                          <Button variant="outline" size="sm" className="bg-transparent hover:bg-gray-100 transition-colors">
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
                        <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent hover:bg-gray-100 transition-colors"
                            onClick={() => handleReviewClick(submission)}
                          >
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

          <TabsContent value="tenders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Tender Management</h2>
                <p className="text-muted-foreground">
                  Manage {tenders.length} tender{tenders.length !== 1 ? 's' : ''} and opportunities
                </p>
              </div>
              <Button onClick={() => setIsRegistrationOpen(true)} className="hover:bg-blue-600 transition-colors">
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
              <Button variant="outline" className="bg-transparent hover:bg-gray-100 transition-colors">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Tenders List */}
            <div className="space-y-4">
              {filteredTenders.map((tender) => (
                <Card key={tender.id} className="hover:shadow-md transition-shadow cursor-pointer">
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
                                  : tender.status === "Awarded"
                                    ? "outline"
                                    : "destructive"
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
                        {tender.advertisementLink && (
                          <div className="flex items-center gap-1">
                            <ExternalLink className="h-4 w-4" />
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 h-auto text-muted-foreground hover:text-blue-600 transition-colors"
                              onClick={() => window.open(tender.advertisementLink, '_blank')}
                            >
                              View Advertisement
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent hover:bg-gray-100 transition-colors"
                          onClick={() => window.open(tender.advertisementLink, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Advertisement
                        </Button>
                        <Button 
                          size="sm" 
                          className="hover:bg-blue-600 transition-colors"
                          onClick={() => {
                            setSelectedTenderInfo(tender)
                            setShowTenderInfo(true)
                          }}
                        >
                          View Details
                        </Button>
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
                <SubmissionCard 
                  key={submission.id} 
                  submission={submission}
                  onDocumentsUpdate={handleDocumentsUpdate}
                  onReviewClick={handleReviewClick}
                />
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Evaluation Criteria Setup */}
              <div className="lg:col-span-2">
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
                    <Button className="hover:bg-blue-600 transition-colors">Save Criteria</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Evaluation Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Evaluation</CardTitle>
                    <CardDescription>Evaluate submissions quickly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {submissions.filter(sub => sub.status === "Under Review").slice(0, 2).map((submission) => (
                      <div key={submission.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-sm">{submission.supplier}</p>
                        <p className="text-xs text-muted-foreground">{submission.tenderId}</p>
                        <Button 
                          size="sm" 
                          className="w-full mt-2 hover:bg-blue-600 transition-colors"
                          onClick={() => handleReviewClick(submission)}
                        >
                          Evaluate Now
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Scoring</CardTitle>
                  <CardDescription>AI-powered initial evaluation results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {submissions.filter(sub => sub.score && parseInt(sub.score) > 80).slice(0, 2).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
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
                      <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-medium">{submission.supplier}</p>
                          <p className="text-sm text-muted-foreground">Pending {submission.tenderId.includes('IT') ? 'technical' : 'financial'} review</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent hover:bg-gray-100 transition-colors"
                          onClick={() => handleReviewClick(submission)}
                        >
                          Review
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Evaluation Panels for each submission */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {submissions.slice(0, 2).map((submission) => (
                <EvaluationPanel
                  key={submission.id}
                  submission={submission}
                  onEvaluationComplete={handleEvaluationComplete}
                />
              ))}
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
                    <div key={tender.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent hover:bg-gray-100 transition-colors"
                          onClick={() => window.open(tender.advertisementLink, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Advertisement
                        </Button>
                        <Button 
                          size="sm" 
                          className="hover:bg-blue-600 transition-colors"
                          onClick={() => {
                            setSelectedTenderInfo(tender)
                            setShowTenderInfo(true)
                          }}
                        >
                          Manage
                        </Button>
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

          <TabsContent value="review" className="space-y-6">
            <TenderReviewComponent 
              tenders={tenders} 
              onTenderStatusChange={handleTenderStatusChange}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Tender Registration Popup */}
      <TenderRegistrationPopup 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)}
        onTenderCreate={handleTenderCreate}
      />

      {/* Tender Information Popup */}
      <TenderInfoPopup
        isOpen={showTenderInfo}
        onClose={() => setShowTenderInfo(false)}
        tender={selectedTenderInfo}
      />
    </div>
  )
}