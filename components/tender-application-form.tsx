// components/tender-application-form.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  Users,
  Mail,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Building2,
  FileUp,
  ArrowRight,
  X,
  Phone,
  Upload,
  Plus,
  Trash2,
  Eye,
  FileCheck,
  Shield,
  Target,
  Award,
  Briefcase,
  Banknote,
  FileSearch,
} from "lucide-react"

interface Tender {
  id: string
  title: string
  description: string
  status: string
  budget: number
  deadline: string
  submissions: number
  category: string
  publishedDate: string
  requirements: string[]
  contactPerson: {
    name: string
    email: string
    phone: string
    department?: string
  } | string
  contactEmail: string
  documents: string[]
  evaluationCriteria?: string[]
  termsAndConditions?: string[]
  scopeOfWork?: string
  bidBondRequired?: boolean
  bidBondAmount?: number
  preBidMeeting?: string
  siteVisitRequired?: boolean
  siteVisitDate?: string
}

interface ApplicationFormData {
  // Company Information
  companyName: string
  registrationNumber: string
  taxNumber: string
  companyType: string
  yearEstablished: string
  numberOfEmployees: string
  
  // Contact Information
  contactPerson: string
  contactEmail: string
  contactPhone: string
  alternativeContact: string
  
  // Address
  physicalAddress: string
  postalAddress: string
  city: string
  province: string
  postalCode: string
  
  // Proposal Details
  proposalTitle: string
  executiveSummary: string
  technicalProposal: string
  methodology: string
  workPlan: string
  teamComposition: string
  
  // Financial Proposal
  totalBidAmount: number
  breakdown: {
    item: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  paymentTerms: string
  validityPeriod: string
  
  // Documents
  uploadedDocuments: File[]
  supportingDocuments: {
    type: string
    file: File
    description: string
  }[]
  
  // Compliance
  bbbeeStatus: string
  bbbeeLevel: string
  taxCompliance: boolean
  cidbRegistration?: string
  cidbGrade?: string
  
  // Declaration
  termsAccepted: boolean
  informationAccurate: boolean
  nonCollusion: boolean
}

interface TenderApplicationFormProps {
  isOpen: boolean
  onClose: () => void
  tender: Tender | null
  onApply: (applicationData: ApplicationFormData) => Promise<void>
}

export function TenderApplicationForm({
  isOpen,
  onClose,
  tender,
  onApply,
}: TenderApplicationFormProps) {
  const [activeTab, setActiveTab] = useState("company")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ApplicationFormData>({
    companyName: "",
    registrationNumber: "",
    taxNumber: "",
    companyType: "",
    yearEstablished: "",
    numberOfEmployees: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    alternativeContact: "",
    physicalAddress: "",
    postalAddress: "",
    city: "",
    province: "",
    postalCode: "",
    proposalTitle: "",
    executiveSummary: "",
    technicalProposal: "",
    methodology: "",
    workPlan: "",
    teamComposition: "",
    totalBidAmount: 0,
    breakdown: [],
    paymentTerms: "",
    validityPeriod: "90",
    uploadedDocuments: [],
    supportingDocuments: [],
    bbbeeStatus: "",
    bbbeeLevel: "",
    taxCompliance: false,
    termsAccepted: false,
    informationAccurate: false,
    nonCollusion: false,
  })

  if (!tender) return null

  const isExpired = new Date(tender.deadline) < new Date()

  const handleInputChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBreakdownChange = (index: number, field: string, value: any) => {
    const updatedBreakdown = [...formData.breakdown]
    updatedBreakdown[index] = { ...updatedBreakdown[index], [field]: value }
    
    // Recalculate total
    if (field === 'quantity' || field === 'unitPrice') {
      updatedBreakdown[index].total = updatedBreakdown[index].quantity * updatedBreakdown[index].unitPrice
    }
    
    setFormData(prev => ({ ...prev, breakdown: updatedBreakdown }))
  }

  const addBreakdownItem = () => {
    setFormData(prev => ({
      ...prev,
      breakdown: [
        ...prev.breakdown,
        { item: "", description: "", quantity: 1, unitPrice: 0, total: 0 }
      ]
    }))
  }

  const removeBreakdownItem = (index: number) => {
    const updatedBreakdown = formData.breakdown.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, breakdown: updatedBreakdown }))
  }

  const handleFileUpload = (files: FileList, type: 'documents' | 'supporting') => {
    const fileArray = Array.from(files)
    if (type === 'documents') {
      setFormData(prev => ({ 
        ...prev, 
        uploadedDocuments: [...prev.uploadedDocuments, ...fileArray] 
      }))
    }
  }

  const handleSupportingDocument = (file: File, type: string, description: string) => {
    setFormData(prev => ({
      ...prev,
      supportingDocuments: [
        ...prev.supportingDocuments,
        { type, file, description }
      ]
    }))
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      await onApply(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateForm = (): boolean => {
    // Basic validation - expand as needed
    if (!formData.companyName || !formData.contactPerson || !formData.contactEmail) {
      alert('Please fill in all required fields')
      return false
    }
    
    if (!formData.termsAccepted || !formData.informationAccurate || !formData.nonCollusion) {
      alert('Please accept all declarations')
      return false
    }
    
    return true
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getTotalBidAmount = () => {
    return formData.breakdown.reduce((total, item) => total + item.total, 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <FileUp className="h-6 w-6 text-primary" />
                Apply for Tender
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {tender.title}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Tender Summary */}
          <Card className="mt-4 bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Reference:</span> {tender.id}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {tender.category}
                </div>
                <div>
                  <span className="font-medium">Budget:</span> {formatCurrency(tender.budget)}
                </div>
                <div>
                  <span className="font-medium">Deadline:</span>{" "}
                  <span className={isExpired ? "text-red-600 font-semibold" : ""}>
                    {new Date(tender.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge variant={isExpired ? "outline" : "default"}>
                    {isExpired ? "Expired" : "Open"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="company" className="text-xs">
              <Building2 className="h-4 w-4 mr-2" />
              Company
            </TabsTrigger>
            <TabsTrigger value="proposal" className="text-xs">
              <FileText className="h-4 w-4 mr-2" />
              Proposal
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-xs">
              <Banknote className="h-4 w-4 mr-2" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">
              <FileCheck className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="declaration" className="text-xs">
              <Shield className="h-4 w-4 mr-2" />
              Declaration
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] pr-4">
            {/* Company Information Tab */}
            <TabsContent value="company" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                  <CardDescription>
                    Provide your company's legal and registration details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Enter company legal name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number *</Label>
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                        placeholder="CK/CIPC number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">Tax Number *</Label>
                      <Input
                        id="taxNumber"
                        value={formData.taxNumber}
                        onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                        placeholder="Income Tax / VAT number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyType">Company Type *</Label>
                      <Select value={formData.companyType} onValueChange={(value) => handleInputChange('companyType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pty">Private Company (Pty) Ltd</SelectItem>
                          <SelectItem value="cc">Close Corporation</SelectItem>
                          <SelectItem value="sole">Sole Proprietor</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearEstablished">Year Established *</Label>
                      <Input
                        id="yearEstablished"
                        type="number"
                        value={formData.yearEstablished}
                        onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                        placeholder="e.g., 2010"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
                      <Select value={formData.numberOfEmployees} onValueChange={(value) => handleInputChange('numberOfEmployees', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 Employees</SelectItem>
                          <SelectItem value="11-50">11-50 Employees</SelectItem>
                          <SelectItem value="51-200">51-200 Employees</SelectItem>
                          <SelectItem value="201-500">201-500 Employees</SelectItem>
                          <SelectItem value="500+">500+ Employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Primary contact person for this tender application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email Address *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="email@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number *</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="+27 XXX XXX XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alternativeContact">Alternative Contact</Label>
                      <Input
                        id="alternativeContact"
                        value={formData.alternativeContact}
                        onChange={(e) => handleInputChange('alternativeContact', e.target.value)}
                        placeholder="Backup contact number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>
                    Company physical and postal address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="physicalAddress">Physical Address *</Label>
                      <Textarea
                        id="physicalAddress"
                        value={formData.physicalAddress}
                        onChange={(e) => handleInputChange('physicalAddress', e.target.value)}
                        placeholder="Street address, building name, etc."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province">Province *</Label>
                        <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gauteng">Gauteng</SelectItem>
                            <SelectItem value="western-cape">Western Cape</SelectItem>
                            <SelectItem value="kzn">KwaZulu-Natal</SelectItem>
                            <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                            <SelectItem value="free-state">Free State</SelectItem>
                            <SelectItem value="limpopo">Limpopo</SelectItem>
                            <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                            <SelectItem value="north-west">North West</SelectItem>
                            <SelectItem value="northern-cape">Northern Cape</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          placeholder="Postal code"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Proposal Tab */}
            <TabsContent value="proposal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Proposal</CardTitle>
                  <CardDescription>
                    Describe your approach and methodology for this tender
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="proposalTitle">Proposal Title *</Label>
                    <Input
                      id="proposalTitle"
                      value={formData.proposalTitle}
                      onChange={(e) => handleInputChange('proposalTitle', e.target.value)}
                      placeholder="Title of your proposal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executiveSummary">Executive Summary *</Label>
                    <Textarea
                      id="executiveSummary"
                      value={formData.executiveSummary}
                      onChange={(e) => handleInputChange('executiveSummary', e.target.value)}
                      placeholder="Brief overview of your proposal..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="methodology">Methodology & Approach *</Label>
                    <Textarea
                      id="methodology"
                      value={formData.methodology}
                      onChange={(e) => handleInputChange('methodology', e.target.value)}
                      placeholder="Describe your methodology and approach..."
                      rows={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workPlan">Work Plan & Timeline *</Label>
                    <Textarea
                      id="workPlan"
                      value={formData.workPlan}
                      onChange={(e) => handleInputChange('workPlan', e.target.value)}
                      placeholder="Detail your work plan, phases, and timeline..."
                      rows={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamComposition">Team Composition *</Label>
                    <Textarea
                      id="teamComposition"
                      value={formData.teamComposition}
                      onChange={(e) => handleInputChange('teamComposition', e.target.value)}
                      placeholder="Describe your team structure, key personnel, and their roles..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="h-5 w-5" />
                    Financial Proposal
                  </CardTitle>
                  <CardDescription>
                    Provide detailed cost breakdown for the tender
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalBidAmount">Total Bid Amount (ZAR) *</Label>
                      <Input
                        id="totalBidAmount"
                        type="number"
                        value={formData.totalBidAmount}
                        onChange={(e) => handleInputChange('totalBidAmount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validityPeriod">Proposal Validity Period (Days) *</Label>
                      <Select value={formData.validityPeriod} onValueChange={(value) => handleInputChange('validityPeriod', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select validity period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 Days</SelectItem>
                          <SelectItem value="60">60 Days</SelectItem>
                          <SelectItem value="90">90 Days</SelectItem>
                          <SelectItem value="120">120 Days</SelectItem>
                          <SelectItem value="180">180 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Cost Breakdown</Label>
                    <div className="space-y-3">
                      {formData.breakdown.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
                          <div className="col-span-3">
                            <Label className="text-xs">Item</Label>
                            <Input
                              value={item.item}
                              onChange={(e) => handleBreakdownChange(index, 'item', e.target.value)}
                              placeholder="Item name"
                            />
                          </div>
                          <div className="col-span-4">
                            <Label className="text-xs">Description</Label>
                            <Input
                              value={item.description}
                              onChange={(e) => handleBreakdownChange(index, 'description', e.target.value)}
                              placeholder="Item description"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Qty</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleBreakdownChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Unit Price</Label>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleBreakdownChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-1 flex items-center justify-between">
                            <span className="font-medium">{formatCurrency(item.total)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBreakdownItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addBreakdownItem} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms *</Label>
                    <Textarea
                      id="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                      placeholder="Describe your payment terms and schedule..."
                      rows={3}
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Bid Amount:</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(getTotalBidAmount() || formData.totalBidAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                  <CardDescription>
                    Upload all required supporting documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* B-BBEE Certificate */}
                  <div className="space-y-3">
                    <Label>B-BBEE Certificate</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Select value={formData.bbbeeStatus} onValueChange={(value) => handleInputChange('bbbeeStatus', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="B-BBEE Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exempt">Exempt Micro Enterprise</SelectItem>
                            <SelectItem value="qse">Qualifying Small Enterprise</SelectItem>
                            <SelectItem value="large">Large Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Select value={formData.bbbeeLevel} onValueChange={(value) => handleInputChange('bbbeeLevel', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="B-BBEE Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Level 1</SelectItem>
                            <SelectItem value="2">Level 2</SelectItem>
                            <SelectItem value="3">Level 3</SelectItem>
                            <SelectItem value="4">Level 4</SelectItem>
                            <SelectItem value="5">Level 5</SelectItem>
                            <SelectItem value="6">Level 6</SelectItem>
                            <SelectItem value="7">Level 7</SelectItem>
                            <SelectItem value="8">Level 8</SelectItem>
                            <SelectItem value="non">Non-Compliant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload B-BBEE Certificate (PDF, max 10MB)
                      </p>
                      <Input
                        type="file"
                        accept=".pdf"
                        className="mt-2"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'documents')}
                      />
                    </div>
                  </div>

                  {/* Tax Compliance */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="taxCompliance"
                        checked={formData.taxCompliance}
                        onCheckedChange={(checked) => handleInputChange('taxCompliance', checked)}
                      />
                      <Label htmlFor="taxCompliance">
                        Tax Compliance Status
                      </Label>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <FileCheck className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload Tax Compliance Certificate (PDF, max 10MB)
                      </p>
                      <Input
                        type="file"
                        accept=".pdf"
                        className="mt-2"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'documents')}
                      />
                    </div>
                  </div>

                  {/* Additional Documents */}
                  <div className="space-y-3">
                    <Label>Additional Supporting Documents</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <FileUp className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload company profile, CVs, certificates, etc. (PDF, DOC, DOCX, max 10MB each)
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        className="mt-2"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'documents')}
                      />
                    </div>
                  </div>

                  {/* Uploaded Documents List */}
                  {formData.uploadedDocuments.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Documents</Label>
                      <div className="space-y-2">
                        {formData.uploadedDocuments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <Badge variant="outline">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Declaration Tab */}
            <TabsContent value="declaration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Declaration</CardTitle>
                  <CardDescription>
                    Please read and accept the following declarations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="termsAccepted"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="termsAccepted" className="font-semibold">
                          Terms and Conditions Acceptance
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          I have read and understood the tender terms and conditions, 
                          and I accept all requirements and specifications as outlined 
                          in the tender document.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="informationAccurate"
                        checked={formData.informationAccurate}
                        onCheckedChange={(checked) => handleInputChange('informationAccurate', checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="informationAccurate" className="font-semibold">
                          Accuracy of Information
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          I declare that all information provided in this application 
                          is true, accurate, and complete to the best of my knowledge.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="nonCollusion"
                        checked={formData.nonCollusion}
                        onCheckedChange={(checked) => handleInputChange('nonCollusion', checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="nonCollusion" className="font-semibold">
                          Non-Collusion Declaration
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          I declare that this tender is made in good faith, without 
                          collusion, and that we have not communicated our bid to any 
                          other bidder or engaged in any anti-competitive practices.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Final Review */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-900 flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Final Review
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Tender Reference:</span>
                          <span className="font-medium">{tender.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tender Title:</span>
                          <span className="font-medium">{tender.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Company Name:</span>
                          <span className="font-medium">{formData.companyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Bid Amount:</span>
                          <span className="font-medium text-primary">
                            {formatCurrency(getTotalBidAmount() || formData.totalBidAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Submission Deadline:</span>
                          <span className="font-medium">
                            {new Date(tender.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Navigation and Submit Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const tabs = ["company", "proposal", "financial", "documents", "declaration"]
                const currentIndex = tabs.indexOf(activeTab)
                if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1])
              }}
              disabled={activeTab === "company"}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const tabs = ["company", "proposal", "financial", "documents", "declaration"]
                const currentIndex = tabs.indexOf(activeTab)
                if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1])
              }}
              disabled={activeTab === "declaration"}
            >
              Next
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isExpired || !formData.termsAccepted}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileUp className="h-4 w-4 mr-2" />
                  {isExpired ? "Tender Expired" : "Submit Application"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}