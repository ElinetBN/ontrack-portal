import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, X } from "lucide-react"
import { Document } from "../types"

interface DocumentModalProps {
  isOpen: boolean
  onClose: () => void
  document?: Document | null
  onSave: (document: Document) => void
}

export function DocumentModal({ isOpen, onClose, document, onSave }: DocumentModalProps) {
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
    const documentData: Document = {
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
    "Technical", "Financial", "Legal", "Compliance", "Administrative", "Other"
  ]

  const documentTypes = [
    "PDF", "Word Document", "Excel Spreadsheet", "PowerPoint", "Image", "Other"
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