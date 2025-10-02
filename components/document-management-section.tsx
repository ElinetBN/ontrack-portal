import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, Upload, Eye, Download, Edit, Trash2, X } from "lucide-react"
import { DocumentModal } from "./document-modal"
import { Submission, Document } from "../types"

interface DocumentManagementSectionProps {
  submission: Submission
  onDocumentsUpdate: (submissionId: string, documents: Document[]) => void
}

export function DocumentManagementSection({ submission, onDocumentsUpdate }: DocumentManagementSectionProps) {
  const [documents, setDocuments] = useState<Document[]>(submission.documents || [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)

  const handleAddDocument = (newDocument: Document) => {
    const updatedDocuments = [...documents, newDocument]
    setDocuments(updatedDocuments)
    onDocumentsUpdate(submission.id, updatedDocuments)
  }

  const handleEditDocument = (updatedDocument: Document) => {
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

  const openEditModal = (document: Document) => {
    setEditingDocument(document)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingDocument(null)
  }

  const handleSaveDocument = (document: Document) => {
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
          {documents.map((document) => (
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