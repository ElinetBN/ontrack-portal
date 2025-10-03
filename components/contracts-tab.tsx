import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ExternalLink, Upload, Download, Edit, X, Save, FileText, Calendar, DollarSign, FileCheck } from "lucide-react"
import { Tender } from "../types"
import { useState } from "react"

interface ContractsTabProps {
  tenders: Tender[]
  onTenderInfoClick: (tender: Tender) => void
}

interface ContractDetails {
  id: string
  contractFile?: File
  contractFileName?: string
  additionalNotes?: string
  startDate?: string
  endDate?: string
  contractValue?: string
}

export function ContractsTab({ tenders, onTenderInfoClick }: ContractsTabProps) {
  const awardedTenders = tenders.filter(tender => tender.status === "Awarded")
  const [contractDetails, setContractDetails] = useState<Record<string, ContractDetails>>({})
  const [editingContract, setEditingContract] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<ContractDetails>>({})

  const handleFileUpload = (tenderId: string, file: File) => {
    setContractDetails(prev => ({
      ...prev,
      [tenderId]: {
        ...prev[tenderId],
        id: tenderId,
        contractFile: file,
        contractFileName: file.name
      }
    }))
  }

  const handleDownload = (tenderId: string) => {
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
    }
  }

  const startEditing = (tenderId: string) => {
    const currentDetails = contractDetails[tenderId] || { id: tenderId }
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
        id: tenderId
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contract Management</h2>
        <p className="text-muted-foreground">
          Manage awarded contracts from {awardedTenders.length} tender{awardedTenders.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Contracts</CardTitle>
          <CardDescription>Currently active procurement contracts with upload, edit, and download capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {awardedTenders.map((tender) => {
              const contract = contractDetails[tender.id]
              const isEditing = editingContract === tender.id

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
                        <Badge variant="default">Active</Badge>
                        <span className="text-xs text-muted-foreground">Expires: {tender.deadline}</span>
                        {contract?.contractFileName && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <FileCheck className="h-3 w-3" />
                            Contract Uploaded
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
                  <div className="p-4 space-y-4">
                    {/* File Upload Section */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Contract Document
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="flex-1 w-full">
                          <div className="relative">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
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
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditing(tender.id)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
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
            
            {awardedTenders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                No awarded contracts yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}