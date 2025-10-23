import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ExternalLink, 
  Upload, 
  Download, 
  Edit, 
  X, 
  Save, 
  FileText, 
  Calendar, 
  DollarSign, 
  FileCheck,
  Eye,
  Trash2,
  Plus,
  FolderOpen,
  Search,
  Filter
} from "lucide-react"
import { Tender } from "../types"
import { useState, useRef } from "react"

interface ContractsTabProps {
  tenders: Tender[]
  onTenderInfoClick: (tender: Tender) => void
  userRole?: 'admin' | 'super_admin' | 'user'
  onDocumentUpload?: (tenderId: string, file: File) => void
  onDocumentDownload?: (tenderId: string, document?: any) => void
  onDocumentView?: (tenderId: string, document: any) => void
}

interface Document {
  id: string
  file: File
  name: string
  type: string
  size: number
  uploadDate: string
  category: string
  description?: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
}

interface ContractDetails {
  id: string
  contractFile?: File
  contractFileName?: string
  additionalNotes?: string
  startDate?: string
  endDate?: string
  contractValue?: string
  documents: Document[]
}

// Mock contract data for demonstration
const mockContractDocuments: Record<string, ContractDetails> = {
  "1": {
    id: "1",
    contractFileName: "contract-agreement.pdf",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    contractValue: "R1,200,000.00",
    additionalNotes: "Initial contract agreement for office supplies procurement",
    documents: [
      {
        id: "doc1",
        file: new File([""], "contract-agreement.pdf"),
        name: "Contract Agreement.pdf",
        type: "application/pdf",
        size: 2457600,
        uploadDate: "2024-01-10T10:30:00Z",
        category: "Contract",
        description: "Main contract agreement document",
        status: "approved"
      },
      {
        id: "doc2",
        file: new File([""], "technical-specifications.docx"),
        name: "Technical Specifications.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 1843200,
        uploadDate: "2024-01-12T14:20:00Z",
        category: "Technical",
        description: "Detailed technical requirements",
        status: "under_review"
      }
    ]
  },
  "2": {
    id: "2",
    contractFileName: "service-contract.pdf",
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    contractValue: "R850,000.00",
    additionalNotes: "IT services and maintenance contract",
    documents: [
      {
        id: "doc3",
        file: new File([""], "service-level-agreement.pdf"),
        name: "Service Level Agreement.pdf",
        type: "application/pdf",
        size: 1894400,
        uploadDate: "2024-01-28T09:15:00Z",
        category: "SLA",
        description: "Service level agreement terms",
        status: "approved"
      }
    ]
  }
}

export function ContractsTab({ tenders, onTenderInfoClick, userRole = 'user', onDocumentUpload, onDocumentDownload, onDocumentView }: ContractsTabProps) {
  // Show all tenders, not just awarded ones
  const contractTenders = tenders.filter(tender => 
    tender.status === "Awarded" || tender.status === "Completed" || tender.status === "Contract Signed"
  )
  
  const [contractDetails, setContractDetails] = useState<Record<string, ContractDetails>>(mockContractDocuments)
  const [editingContract, setEditingContract] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<ContractDetails>>({})
  const [selectedDocument, setSelectedDocument] = useState<{tenderId: string, document: Document} | null>(null)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const documentInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleFileUpload = (tenderId: string, file: File) => {
    setContractDetails(prev => ({
      ...prev,
      [tenderId]: {
        ...prev[tenderId],
        id: tenderId,
        contractFile: file,
        contractFileName: file.name,
        documents: prev[tenderId]?.documents || []
      }
    }))
    
    // Call the parent handler if provided
    if (onDocumentUpload) {
      onDocumentUpload(tenderId, file)
    }
  }

  const handleMultipleDocumentsUpload = (tenderId: string, files: FileList) => {
    const newDocuments: Document[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      category: getFileCategory(file.type),
      description: '',
      status: 'pending'
    }))

    setContractDetails(prev => ({
      ...prev,
      [tenderId]: {
        ...prev[tenderId],
        id: tenderId,
        documents: [...(prev[tenderId]?.documents || []), ...newDocuments]
      }
    }))
  }

  const getFileCategory = (fileType: string): string => {
    if (fileType.includes('pdf')) return 'Document'
    if (fileType.includes('image')) return 'Image'
    if (fileType.includes('word') || fileType.includes('document')) return 'Word Document'
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'Spreadsheet'
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'Presentation'
    return 'Other'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = (tenderId: string, document?: Document) => {
    if (document) {
      // Download specific document
      const url = URL.createObjectURL(document.file)
      const a = document.createElement('a')
      a.href = url
      a.download = document.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Call the parent handler if provided
      if (onDocumentDownload) {
        onDocumentDownload(tenderId, document)
      }
    } else {
      // Download main contract file
      const contract = contractDetails[tenderId]
      if (contract?.contractFile) {
        const url = URL.createObjectURL(contract.contractFile)
        const a = document.createElement('a')
        a.href = url
        a.download = contract.contractFileName || 'contract.pdf'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        // Call the parent handler if provided
        if (onDocumentDownload) {
          onDocumentDownload(tenderId)
        }
      }
    }
  }

  const handleViewDocument = (tenderId: string, document: Document) => {
    setSelectedDocument({ tenderId, document })
    setShowDocumentViewer(true)
    
    // Call the parent handler if provided
    if (onDocumentView) {
      onDocumentView(tenderId, document)
    }
  }

  const handleDeleteDocument = (tenderId: string, documentId: string) => {
    setContractDetails(prev => ({
      ...prev,
      [tenderId]: {
        ...prev[tenderId],
        documents: prev[tenderId]?.documents.filter(doc => doc.id !== documentId) || []
      }
    }))
  }

  const handleUpdateDocumentDescription = (tenderId: string, documentId: string, description: string) => {
    setContractDetails(prev => ({
      ...prev,
      [tenderId]: {
        ...prev[tenderId],
        documents: prev[tenderId]?.documents.map(doc => 
          doc.id === documentId ? { ...doc, description } : doc
        ) || []
      }
    }))
  }

  const handleUpdateDocumentStatus = (tenderId: string, documentId: string, status: Document['status']) => {
    setContractDetails(prev => ({
      ...prev,
      [tenderId]: {
        ...prev[tenderId],
        documents: prev[tenderId]?.documents.map(doc => 
          doc.id === documentId ? { ...doc, status } : doc
        ) || []
      }
    }))
  }

  const startEditing = (tenderId: string) => {
    const currentDetails = contractDetails[tenderId] || { id: tenderId, documents: [] }
    setEditingContract(tenderId)
    setEditFormData(currentDetails)
  }

  const cancelEditing = () => {
    setEditingContract(null)
    setEditFormData({})
  }

  const saveEditing = (tenderId: string) => {
    setContractDetails(prev => ({
      ...prev,
      [tenderId]: {
        ...prev[tenderId],
        ...editFormData,
        id: tenderId,
        documents: prev[tenderId]?.documents || []
      }
    }))
    setEditingContract(null)
    setEditFormData({})
  }

  const handleEditFormChange = (field: keyof ContractDetails, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const triggerFileInput = (tenderId: string) => {
    documentInputRefs.current[tenderId]?.click()
  }

  const getStatusBadge = (status: Document['status']) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      under_review: { color: "bg-blue-100 text-blue-800", label: "Under Review" }
    }
    
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={`text-xs ${config.color}`}>
        {config.label}
      </Badge>
    )
  }

  // Filter documents based on search and status
  const filteredTenders = contractTenders.filter(tender => {
    const contract = contractDetails[tender.id]
    if (!contract) return true
    
    const hasMatchingDocuments = contract.documents.some(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const hasMatchingStatus = statusFilter === "all" || 
      contract.documents.some(doc => doc.status === statusFilter)
    
    return hasMatchingDocuments || hasMatchingStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Contract Management</h2>
          <p className="text-muted-foreground">
            Manage contracts and related documents for {filteredTenders.length} tender{filteredTenders.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Documents</CardTitle>
          <CardDescription>
            Upload, review, and manage contract documents and related files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredTenders.map((tender) => {
              const contract = contractDetails[tender.id]
              const isEditing = editingContract === tender.id
              const documents = contract?.documents || []

              return (
                <div key={tender.id} className="border rounded-lg overflow-hidden">
                  {/* Contract Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="space-y-2 flex-1">
                      <p className="font-medium text-lg">{tender.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {tender.department} • {tender.budget}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default">{tender.status}</Badge>
                        <span className="text-xs text-muted-foreground">Deadline: {tender.deadline}</span>
                        {contract?.contractFileName && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <FileCheck className="h-3 w-3" />
                            Contract Uploaded
                          </Badge>
                        )}
                        {documents.length > 0 && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <FolderOpen className="h-3 w-3" />
                            {documents.length} document{documents.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-transparent hover:bg-gray-200 transition-colors"
                        onClick={() => window.open(tender.advertisementLink, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        className="hover:bg-blue-600 transition-colors"
                        onClick={() => onTenderInfoClick(tender)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Contract Management Section */}
                  <div className="p-4 space-y-6">
                    {/* Main Contract File Upload Section */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Main Contract Document
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="flex-1 w-full">
                          <div className="relative">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.pptx,.ppt"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleFileUpload(tender.id, file)
                                }
                              }}
                              className="w-full"
                              disabled={isEditing}
                            />
                            <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        {contract?.contractFileName && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(tender.id)}
                              disabled={isEditing}
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditing(tender.id)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Edit Details
                            </Button>
                          </div>
                        )}
                      </div>
                      {contract?.contractFileName && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileCheck className="h-3 w-3" />
                          Current file: {contract.contractFileName}
                        </p>
                      )}
                    </div>

                    {/* Additional Documents Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <FolderOpen className="h-4 w-4" />
                          Additional Documents
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => triggerFileInput(tender.id)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Documents
                        </Button>
                      </div>
                      
                      <input
                        type="file"
                        ref={el => documentInputRefs.current[tender.id] = el}
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.pptx,.ppt,.jpg,.jpeg,.png,.gif"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleMultipleDocumentsUpload(tender.id, e.target.files)
                            e.target.value = '' // Reset input
                          }
                        }}
                        className="hidden"
                      />

                      {documents.length > 0 ? (
                        <div className="space-y-2">
                          {documents.map((document) => (
                            <div
                              key={document.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium truncate">{document.name}</p>
                                    {getStatusBadge(document.status)}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{document.category}</span>
                                    <span>•</span>
                                    <span>{formatFileSize(document.size)}</span>
                                    <span>•</span>
                                    <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                                  </div>
                                  {document.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{document.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDocument(tender.id, document)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(tender.id, document)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                {userRole !== 'user' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteDocument(tender.id, document.id)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed rounded-lg">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">No additional documents uploaded</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload supporting documents, amendments, or related files
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Edit Form */}
                    {isEditing && (
                      <div className="border-t pt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Start Date
                            </label>
                            <Input
                              type="date"
                              value={editFormData.startDate || ''}
                              onChange={(e) => handleEditFormChange('startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              End Date
                            </label>
                            <Input
                              type="date"
                              value={editFormData.endDate || ''}
                              onChange={(e) => handleEditFormChange('endDate', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Contract Value
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter contract value"
                            value={editFormData.contractValue || ''}
                            onChange={(e) => handleEditFormChange('contractValue', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Additional Notes
                          </label>
                          <Textarea
                            placeholder="Enter any additional contract notes..."
                            value={editFormData.additionalNotes || ''}
                            onChange={(e) => handleEditFormChange('additionalNotes', e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEditing}
                            className="flex items-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveEditing(tender.id)}
                            className="flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Display Contract Details */}
                    {!isEditing && contract && (
                      <div className="border-t pt-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {contract.startDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="font-medium">Start Date: </span>
                                {contract.startDate}
                              </div>
                            </div>
                          )}
                          {contract.endDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="font-medium">End Date: </span>
                                {contract.endDate}
                              </div>
                            </div>
                          )}
                          {contract.contractValue && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="font-medium">Value: </span>
                                {contract.contractValue}
                              </div>
                            </div>
                          )}
                        </div>
                        {contract.additionalNotes && (
                          <div className="text-sm flex items-start gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="font-medium">Notes: </span>
                              {contract.additionalNotes}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            
            {filteredTenders.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No contracts found</h3>
                <p className="text-sm max-w-md mx-auto">
                  {contractTenders.length === 0 
                    ? "No awarded or completed tenders available. Contracts will appear here once tenders are awarded."
                    : "No documents match your search criteria. Try adjusting your filters."
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedDocument.document.name}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(selectedDocument.tenderId, selectedDocument.document)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDocumentViewer(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 max-h-[calc(90vh-80px)] overflow-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">File Name: </span>
                    {selectedDocument.document.name}
                  </div>
                  <div>
                    <span className="font-medium">Type: </span>
                    {selectedDocument.document.category}
                  </div>
                  <div>
                    <span className="font-medium">Size: </span>
                    {formatFileSize(selectedDocument.document.size)}
                  </div>
                  <div>
                    <span className="font-medium">Uploaded: </span>
                    {new Date(selectedDocument.document.uploadDate).toLocaleString()}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Status: </span>
                    {getStatusBadge(selectedDocument.document.status)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={selectedDocument.document.description || ''}
                    onChange={(e) => handleUpdateDocumentDescription(
                      selectedDocument.tenderId,
                      selectedDocument.document.id,
                      e.target.value
                    )}
                    placeholder="Add a description for this document..."
                    rows={3}
                  />
                </div>

                {userRole !== 'user' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Document Status</label>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedDocument.document.status === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateDocumentStatus(selectedDocument.tenderId, selectedDocument.document.id, 'pending')}
                      >
                        Pending
                      </Button>
                      <Button
                        variant={selectedDocument.document.status === 'under_review' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateDocumentStatus(selectedDocument.tenderId, selectedDocument.document.id, 'under_review')}
                      >
                        Under Review
                      </Button>
                      <Button
                        variant={selectedDocument.document.status === 'approved' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateDocumentStatus(selectedDocument.tenderId, selectedDocument.document.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant={selectedDocument.document.status === 'rejected' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateDocumentStatus(selectedDocument.tenderId, selectedDocument.document.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                {/* Document Preview Area */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-muted-foreground mb-4">
                    Document preview would be displayed here. In a real application, 
                    this would show PDF viewers, image previews, or other document viewers.
                  </p>
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Preview for {selectedDocument.document.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Use the download button to get the complete file.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}