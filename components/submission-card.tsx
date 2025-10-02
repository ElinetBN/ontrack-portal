import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, Eye, Calendar, Upload, Edit, Trash2, Plus, X } from "lucide-react"
import { Submission, Document } from "../types"
import { useState } from "react"

interface SubmissionCardProps {
  submission: Submission
  onDocumentsUpdate: (submissionId: string, documents: Document[]) => void
  onReviewClick: (submission: Submission) => void
}

export function SubmissionCard({ submission, onDocumentsUpdate, onReviewClick }: SubmissionCardProps) {
  const [isManageDocumentsOpen, setIsManageDocumentsOpen] = useState(false)
  const [documents, setDocuments] = useState<Document[]>(submission.documents || [])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Submitted": return "secondary"
      case "Under Review": return "default"
      case "Approved": return "default"
      case "Rejected": return "destructive"
      case "Needs Revision": return "outline"
      default: return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newDocuments: Document[] = Array.from(files).map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString()
    }))

    const updatedDocuments = [...documents, ...newDocuments]
    setDocuments(updatedDocuments)
    onDocumentsUpdate(submission.id, updatedDocuments)
    event.target.value = '' // Reset input
  }

  const handleDownload = (document: Document) => {
    const link = document.createElement('a')
    link.href = document.url
    link.download = document.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId)
    setDocuments(updatedDocuments)
    onDocumentsUpdate(submission.id, updatedDocuments)
  }

  const startEditing = (document: Document) => {
    setIsEditing(document.id)
    setEditName(document.name)
  }

  const saveEdit = (documentId: string) => {
    const updatedDocuments = documents.map(doc =>
      doc.id === documentId ? { ...doc, name: editName } : doc
    )
    setDocuments(updatedDocuments)
    onDocumentsUpdate(submission.id, updatedDocuments)
    setIsEditing(null)
    setEditName("")
  }

  const cancelEdit = () => {
    setIsEditing(null)
    setEditName("")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{submission.tenderTitle}</CardTitle>
              <CardDescription>
                Submitted by {submission.companyName}
              </CardDescription>
            </div>
            <Badge variant={getStatusVariant(submission.status)}>
              {submission.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Submitted: {formatDate(submission.submissionDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Documents: {submission.documents?.length || 0}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Bid Amount: {submission.bidAmount}
            </div>
          </div>

          {submission.notes && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                <strong>Notes:</strong> {submission.notes}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {submission.documents?.map((doc, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md text-sm">
                <FileText className="h-3 w-3" />
                <span>{doc.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                  onClick={() => handleDownload(doc)}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Last updated: {formatDate(submission.lastUpdated)}</span>
            </div>
            <div className="flex gap-2">
              <Dialog open={isManageDocumentsOpen} onOpenChange={setIsManageDocumentsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Documents
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Manage Documents</DialogTitle>
                    <DialogDescription>
                      Upload, edit, and manage documents for {submission.tenderTitle}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Upload Documents</p>
                          <p className="text-xs text-gray-500">
                            PDF, DOC, DOCX, XLS, XLSX up to 10MB
                          </p>
                        </div>
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <Button asChild variant="outline">
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              Select Files
                            </div>
                          </Button>
                          <Input
                            id="file-upload"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </Label>
                      </div>
                    </div>

                    {/* Documents List */}
                    <div className="space-y-3">
                      <h3 className="font-medium">Documents ({documents.length})</h3>
                      {documents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>No documents uploaded yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {documents.map((document) => (
                            <div
                              key={document.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  {isEditing === document.id ? (
                                    <Input
                                      value={editName}
                                      onChange={(e) => setEditName(e.target.value)}
                                      className="h-8"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEdit(document.id)
                                        if (e.key === 'Escape') cancelEdit()
                                      }}
                                    />
                                  ) : (
                                    <div className="space-y-1">
                                      <p className="font-medium text-sm truncate">{document.name}</p>
                                      <p className="text-xs text-gray-500">
                                        {formatFileSize(document.size || 0)} • {formatDate(document.uploadDate)}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {isEditing === document.id ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => saveEdit(document.id)}
                                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <span className="sr-only">Save</span>
                                      ✓
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={cancelEdit}
                                      className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                    >
                                      <span className="sr-only">Cancel</span>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => startEditing(document)}
                                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownload(document)}
                                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDelete(document.id)}
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsManageDocumentsOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => setIsManageDocumentsOpen(false)}
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                size="sm"
                onClick={() => onReviewClick(submission)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}