// components/tender-application-form.tsx
"use client"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Calendar,
  DollarSign,
  Users,
  Mail,
  User,
  Clock,
  AlertCircle,
  Building2,
  FileUp,
  X,
  Phone,
  Upload,
  Plus,
  Trash2,
  Eye,
  FileCheck,
  Shield,
  Target,
  Banknote,
  Loader2,
  CheckCircle,
} from "lucide-react"

// API Client for tender applications with enhanced error handling
class TenderApplicationAPI {
  private static baseURL = '/api/tender-applications';

  static async getTenderById(tenderId: string) {
    const response = await fetch(`/api/tenders/${tenderId}`);
    if (!response.ok) throw new Error('Failed to fetch tender');
    return response.json();
  }

  static async submitApplication(applicationData: any) {
    console.log('Submitting application to API:', applicationData);
    
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      // Create enhanced error with validation details
      const error = new Error(responseData.message || `Failed to submit application: ${response.status}`);
      (error as any).response = responseData;
      (error as any).status = response.status;
      (error as any).validationErrors = responseData.errors;
      throw error;
    }

    return responseData;
  }

  static async uploadDocument(file: File, tenderId: string, applicationId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenderId', tenderId);
    formData.append('applicationId', applicationId);

    const response = await fetch(`${this.baseURL}/documents`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    return response.json();
  }
}

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
  referenceNumber?: string
  department?: string
  closingDate?: string
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
  tenderId?: string
  tender?: Tender
  onApply: (applicationData: any) => Promise<void>
}

export function TenderApplicationForm({
  isOpen,
  onClose,
  tenderId,
  tender: propTender,
  onApply,
}: TenderApplicationFormProps) {
  const [activeTab, setActiveTab] = useState("company")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tender, setTender] = useState<Tender | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
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

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
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
      setActiveTab("company")
      setSubmitSuccess(false)
      setApplicationNumber("")
      setFieldErrors({})
    }
  }, [isOpen])

  // Fetch tender data when component opens
  useEffect(() => {
    const fetchTenderData = async () => {
      if (isOpen && tenderId && !propTender) {
        setLoading(true)
        try {
          const response = await TenderApplicationAPI.getTenderById(tenderId)
          if (response.success) {
            setTender(response.data)
          } else {
            console.error('Failed to fetch tender data')
          }
        } catch (error) {
          console.error('Error fetching tender:', error)
        } finally {
          setLoading(false)
        }
      } else if (propTender) {
        // If tender is provided directly, use it
        setTender(propTender)
        setLoading(false)
      }
    }

    fetchTenderData()
  }, [isOpen, tenderId, propTender])

  const handleInputChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }))
    }
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

  const removeUploadedDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedDocuments: prev.uploadedDocuments.filter((_, i) => i !== index)
    }))
  }

  // Debug function to check form data before submission
  const debugFormData = () => {
    const requiredFields = [
      'companyName', 'registrationNumber', 'taxNumber', 'companyType',
      'yearEstablished', 'numberOfEmployees', 'contactPerson', 'contactEmail',
      'contactPhone', 'physicalAddress', 'city', 'province', 'postalCode',
      'proposalTitle', 'executiveSummary', 'methodology', 'workPlan',
      'teamComposition', 'totalBidAmount', 'paymentTerms', 'bbbeeStatus',
      'bbbeeLevel', 'termsAccepted', 'informationAccurate', 'nonCollusion'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof ApplicationFormData];
      return value === undefined || value === null || value === '' || (typeof value === 'boolean' && !value);
    });

    const formDataWithIssues = requiredFields.map(field => ({
      field,
      value: formData[field as keyof ApplicationFormData],
      isEmpty: !formData[field as keyof ApplicationFormData],
      isBoolean: typeof formData[field as keyof ApplicationFormData] === 'boolean',
      isFalseBoolean: typeof formData[field as keyof ApplicationFormData] === 'boolean' && !formData[field as keyof ApplicationFormData]
    }));

    console.log('🔍 FORM DATA DEBUG:', {
      missingFields,
      formDataWithIssues,
      allData: formData
    });

    return missingFields;
  };

  const validateForm = (): boolean => {
    const newFieldErrors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = [
      'companyName', 'registrationNumber', 'taxNumber', 'companyType',
      'yearEstablished', 'numberOfEmployees', 'contactPerson', 'contactEmail',
      'contactPhone', 'physicalAddress', 'city', 'province', 'postalCode',
      'proposalTitle', 'executiveSummary', 'methodology', 'workPlan',
      'teamComposition', 'paymentTerms', 'bbbeeStatus', 'bbbeeLevel'
    ];

    requiredFields.forEach(field => {
      const value = formData[field as keyof ApplicationFormData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newFieldErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });

    // Financial validation
    if (!formData.totalBidAmount || formData.totalBidAmount <= 0) {
      newFieldErrors.totalBidAmount = 'Valid bid amount is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newFieldErrors.contactEmail = 'Please enter a valid email address';
    }

    // Declaration validation
    if (!formData.termsAccepted) {
      newFieldErrors.termsAccepted = 'You must accept the terms and conditions';
    }
    if (!formData.informationAccurate) {
      newFieldErrors.informationAccurate = 'You must declare information accuracy';
    }
    if (!formData.nonCollusion) {
      newFieldErrors.nonCollusion = 'You must accept the non-collusion declaration';
    }

    setFieldErrors(newFieldErrors);
    return Object.keys(newFieldErrors).length === 0;
  };

  // components/tender-application-form.tsx - Updated handleSubmit function
const handleSubmit = async () => {
  // First, run debug to see what's missing
  const missingFields = debugFormData();
  
  if (!validateForm()) {
    const errorMessage = Object.values(fieldErrors).join('\n');
    alert(`Please fix the following errors:\n\n${errorMessage}`);
    return;
  }

  setIsSubmitting(true);
  setFieldErrors({});

  try {
    // Prepare application data for API submission with proper data types
    // FIX: Ensure technicalProposal is always included
    const applicationData = {
      // Required fields for API
      tenderId: tender?.id,
      companyName: formData.companyName.trim(),
      registrationNumber: formData.registrationNumber.trim(),
      taxNumber: formData.taxNumber.trim(),
      companyType: formData.companyType,
      yearEstablished: formData.yearEstablished,
      numberOfEmployees: formData.numberOfEmployees,
      contactPerson: formData.contactPerson.trim(),
      contactEmail: formData.contactEmail.trim(),
      contactPhone: formData.contactPhone.trim(),
      alternativeContact: formData.alternativeContact.trim(),
      physicalAddress: formData.physicalAddress.trim(),
      postalAddress: formData.postalAddress.trim() || formData.physicalAddress.trim(),
      city: formData.city.trim(),
      province: formData.province,
      postalCode: formData.postalCode.trim(),
      proposalTitle: formData.proposalTitle.trim(),
      executiveSummary: formData.executiveSummary.trim(),
      technicalProposal: formData.technicalProposal.trim() || formData.methodology.trim() || 'Technical proposal', // FIX: Always provide technicalProposal
      methodology: formData.methodology.trim(),
      workPlan: formData.workPlan.trim(),
      teamComposition: formData.teamComposition.trim(),
      totalBidAmount: getTotalBidAmount() || formData.totalBidAmount,
      breakdown: formData.breakdown,
      paymentTerms: formData.paymentTerms.trim(),
      validityPeriod: formData.validityPeriod,
      bbbeeStatus: formData.bbbeeStatus,
      bbbeeLevel: formData.bbbeeLevel,
      taxCompliance: Boolean(formData.taxCompliance),
      cidbRegistration: formData.cidbRegistration?.trim() || '',
      cidbGrade: formData.cidbGrade?.trim() || '',
      termsAccepted: Boolean(formData.termsAccepted),
      informationAccurate: Boolean(formData.informationAccurate),
      nonCollusion: Boolean(formData.nonCollusion),
      
      // Additional data
      uploadedDocuments: formData.uploadedDocuments.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }))
    };

    console.log('✅ Submitting application data:', {
      ...applicationData,
      technicalProposalLength: applicationData.technicalProposal.length
    });

    // Submit to API
    const response = await TenderApplicationAPI.submitApplication(applicationData);
    
    if (response.success) {
      setApplicationNumber(response.data.applicationNumber);
      setSubmitSuccess(true);
      
      // Upload documents if application was created successfully
      if (response.data.id) {
        const applicationId = response.data.id;
        
        try {
          // Upload main documents
          for (const file of formData.uploadedDocuments) {
            await TenderApplicationAPI.uploadDocument(file, tender!.id, applicationId);
          }
          
          // Upload supporting documents
          for (const doc of formData.supportingDocuments) {
            await TenderApplicationAPI.uploadDocument(doc.file, tender!.id, applicationId);
          }
        } catch (uploadError) {
          console.warn('Document upload failed, but application was submitted:', uploadError);
        }
      }

      // Call the onApply callback with the response data
      await onApply({
        ...applicationData,
        id: response.data.id,
        applicationNumber: response.data.applicationNumber
      });

    } else {
      throw new Error(response.message || 'Failed to submit application');
    }
  } catch (error: any) {
    console.error('❌ Error submitting application:', error);
    
    // Handle validation errors from API
    if (error.validationErrors) {
      const validationErrorMessages = error.validationErrors
        .map((err: any) => `• ${err.field}: ${err.message}`)
        .join('\n');
      
      alert(`Validation Errors:\n\n${validationErrorMessages}`);
    } else if (error.message.includes('Missing or invalid required fields')) {
      // Show which fields are missing
      const missingFields = debugFormData();
      alert(`Please fill in all required fields:\n\n• ${missingFields.join('\n• ')}`);
    } else {
      alert(error.message || 'Failed to submit application. Please check all required fields and try again.');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getTotalBidAmount = () => {
    return formData.breakdown.reduce((total, item) => total + item.total, 0);
  };

  // Helper to extract contact information
  const getContactPerson = () => {
    if (!tender) return { name: '', email: '', phone: '' };
    
    if (typeof tender.contactPerson === 'string') {
      return {
        name: tender.contactPerson,
        email: tender.contactEmail || '',
        phone: ''
      };
    }
    return tender.contactPerson;
  };

  const contactPerson = getContactPerson();
  const isExpired = tender ? new Date(tender.deadline) < new Date() : false;

  if (!tender) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tender Application</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading tender information...</p>
              </div>
            ) : (
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p>Tender information not found.</p>
                <Button onClick={onClose} className="mt-4">
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // components/tender-application-form.tsx - Updated success section
// Add this to the success state in your form component:

if (submitSuccess) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Application Submitted & Saved
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Successfully Submitted!</h3>
            <p className="text-muted-foreground mt-2">
              Your application for <strong>{tender.title}</strong> has been submitted successfully <strong>and saved to the database</strong>.
            </p>
            {applicationNumber && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm font-medium text-green-800">
                  Application Number:
                </p>
                <p className="text-lg font-bold text-green-900">{applicationNumber}</p>
                <p className="text-xs text-green-600 mt-1">
                  ✅ Successfully stored in database
                </p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('Application submitted:', {
                  applicationNumber,
                  tender: tender.title,
                  company: formData.companyName,
                  timestamp: new Date().toISOString()
                })
                alert('Check browser console for submission details')
              }}
              className="w-full"
            >
              View Submission Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <DialogTitle className="text-xl font-bold">Apply for Tender</DialogTitle>
              <p className="text-sm text-muted-foreground">{tender.title}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tender Summary */}
          <div className="p-6 border-b bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Reference:</span> {tender.referenceNumber || tender.id}
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
            </div>
            {isExpired && (
              <Alert className="mt-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  This tender has expired and is no longer accepting applications.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
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
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-blue-600">Company Information</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name *</Label>
                            <Input
                              id="companyName"
                              value={formData.companyName}
                              onChange={(e) => handleInputChange('companyName', e.target.value)}
                              placeholder="Enter company legal name"
                              className={fieldErrors.companyName ? "border-red-500" : ""}
                            />
                            {fieldErrors.companyName && (
                              <p className="text-red-500 text-sm">{fieldErrors.companyName}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="registrationNumber">Registration Number *</Label>
                            <Input
                              id="registrationNumber"
                              value={formData.registrationNumber}
                              onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                              placeholder="CK/CIPC number"
                              className={fieldErrors.registrationNumber ? "border-red-500" : ""}
                            />
                            {fieldErrors.registrationNumber && (
                              <p className="text-red-500 text-sm">{fieldErrors.registrationNumber}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="taxNumber">Tax Number *</Label>
                            <Input
                              id="taxNumber"
                              value={formData.taxNumber}
                              onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                              placeholder="Income Tax / VAT number"
                              className={fieldErrors.taxNumber ? "border-red-500" : ""}
                            />
                            {fieldErrors.taxNumber && (
                              <p className="text-red-500 text-sm">{fieldErrors.taxNumber}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="companyType">Company Type *</Label>
                            <Select 
                              value={formData.companyType} 
                              onValueChange={(value) => handleInputChange('companyType', value)}
                            >
                              <SelectTrigger className={fieldErrors.companyType ? "border-red-500" : ""}>
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
                            {fieldErrors.companyType && (
                              <p className="text-red-500 text-sm">{fieldErrors.companyType}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="yearEstablished">Year Established *</Label>
                            <Input
                              id="yearEstablished"
                              type="number"
                              value={formData.yearEstablished}
                              onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                              placeholder="e.g., 2010"
                              min="1900"
                              max={new Date().getFullYear()}
                              className={fieldErrors.yearEstablished ? "border-red-500" : ""}
                            />
                            {fieldErrors.yearEstablished && (
                              <p className="text-red-500 text-sm">{fieldErrors.yearEstablished}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
                            <Select 
                              value={formData.numberOfEmployees} 
                              onValueChange={(value) => handleInputChange('numberOfEmployees', value)}
                            >
                              <SelectTrigger className={fieldErrors.numberOfEmployees ? "border-red-500" : ""}>
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
                            {fieldErrors.numberOfEmployees && (
                              <p className="text-red-500 text-sm">{fieldErrors.numberOfEmployees}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-blue-600">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contactPerson">Contact Person *</Label>
                            <Input
                              id="contactPerson"
                              value={formData.contactPerson}
                              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                              placeholder="Full name"
                              className={fieldErrors.contactPerson ? "border-red-500" : ""}
                            />
                            {fieldErrors.contactPerson && (
                              <p className="text-red-500 text-sm">{fieldErrors.contactPerson}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactEmail">Email Address *</Label>
                            <Input
                              id="contactEmail"
                              type="email"
                              value={formData.contactEmail}
                              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                              placeholder="email@company.com"
                              className={fieldErrors.contactEmail ? "border-red-500" : ""}
                            />
                            {fieldErrors.contactEmail && (
                              <p className="text-red-500 text-sm">{fieldErrors.contactEmail}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactPhone">Phone Number *</Label>
                            <Input
                              id="contactPhone"
                              value={formData.contactPhone}
                              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                              placeholder="+27 XXX XXX XXXX"
                              className={fieldErrors.contactPhone ? "border-red-500" : ""}
                            />
                            {fieldErrors.contactPhone && (
                              <p className="text-red-500 text-sm">{fieldErrors.contactPhone}</p>
                            )}
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
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-blue-600">Address Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="physicalAddress">Physical Address *</Label>
                          <Textarea
                            id="physicalAddress"
                            value={formData.physicalAddress}
                            onChange={(e) => handleInputChange('physicalAddress', e.target.value)}
                            placeholder="Street address, building name, etc."
                            rows={3}
                            className={fieldErrors.physicalAddress ? "border-red-500" : ""}
                          />
                          {fieldErrors.physicalAddress && (
                            <p className="text-red-500 text-sm">{fieldErrors.physicalAddress}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="City"
                              className={fieldErrors.city ? "border-red-500" : ""}
                            />
                            {fieldErrors.city && (
                              <p className="text-red-500 text-sm">{fieldErrors.city}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="province">Province *</Label>
                            <Select 
                              value={formData.province} 
                              onValueChange={(value) => handleInputChange('province', value)}
                            >
                              <SelectTrigger className={fieldErrors.province ? "border-red-500" : ""}>
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
                            {fieldErrors.province && (
                              <p className="text-red-500 text-sm">{fieldErrors.province}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code *</Label>
                            <Input
                              id="postalCode"
                              value={formData.postalCode}
                              onChange={(e) => handleInputChange('postalCode', e.target.value)}
                              placeholder="Postal code"
                              className={fieldErrors.postalCode ? "border-red-500" : ""}
                            />
                            {fieldErrors.postalCode && (
                              <p className="text-red-500 text-sm">{fieldErrors.postalCode}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Proposal Tab */}
                <TabsContent value="proposal" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Technical Proposal</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="proposalTitle">Proposal Title *</Label>
                        <Input
                          id="proposalTitle"
                          value={formData.proposalTitle}
                          onChange={(e) => handleInputChange('proposalTitle', e.target.value)}
                          placeholder="Title of your proposal"
                          className={fieldErrors.proposalTitle ? "border-red-500" : ""}
                        />
                        {fieldErrors.proposalTitle && (
                          <p className="text-red-500 text-sm">{fieldErrors.proposalTitle}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="executiveSummary">Executive Summary *</Label>
                        <Textarea
                          id="executiveSummary"
                          value={formData.executiveSummary}
                          onChange={(e) => handleInputChange('executiveSummary', e.target.value)}
                          placeholder="Brief overview of your proposal..."
                          rows={4}
                          className={fieldErrors.executiveSummary ? "border-red-500" : ""}
                        />
                        {fieldErrors.executiveSummary && (
                          <p className="text-red-500 text-sm">{fieldErrors.executiveSummary}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="methodology">Methodology & Approach *</Label>
                        <Textarea
                          id="methodology"
                          value={formData.methodology}
                          onChange={(e) => handleInputChange('methodology', e.target.value)}
                          placeholder="Describe your methodology and approach..."
                          rows={6}
                          className={fieldErrors.methodology ? "border-red-500" : ""}
                        />
                        {fieldErrors.methodology && (
                          <p className="text-red-500 text-sm">{fieldErrors.methodology}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workPlan">Work Plan & Timeline *</Label>
                        <Textarea
                          id="workPlan"
                          value={formData.workPlan}
                          onChange={(e) => handleInputChange('workPlan', e.target.value)}
                          placeholder="Detail your work plan, phases, and timeline..."
                          rows={6}
                          className={fieldErrors.workPlan ? "border-red-500" : ""}
                        />
                        {fieldErrors.workPlan && (
                          <p className="text-red-500 text-sm">{fieldErrors.workPlan}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teamComposition">Team Composition *</Label>
                        <Textarea
                          id="teamComposition"
                          value={formData.teamComposition}
                          onChange={(e) => handleInputChange('teamComposition', e.target.value)}
                          placeholder="Describe your team structure, key personnel, and their roles..."
                          rows={4}
                          className={fieldErrors.teamComposition ? "border-red-500" : ""}
                        />
                        {fieldErrors.teamComposition && (
                          <p className="text-red-500 text-sm">{fieldErrors.teamComposition}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Financial Tab */}
                <TabsContent value="financial" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Financial Proposal</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="totalBidAmount">Total Bid Amount (ZAR) *</Label>
                          <Input
                            id="totalBidAmount"
                            type="number"
                            value={formData.totalBidAmount}
                            onChange={(e) => handleInputChange('totalBidAmount', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className={fieldErrors.totalBidAmount ? "border-red-500" : ""}
                          />
                          {fieldErrors.totalBidAmount && (
                            <p className="text-red-500 text-sm">{fieldErrors.totalBidAmount}</p>
                          )}
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

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Cost Breakdown</Label>
                          <Button variant="outline" onClick={addBreakdownItem} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {formData.breakdown.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end p-2 border rounded">
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
                                  min="1"
                                />
                              </div>
                              <div className="col-span-2">
                                <Label className="text-xs">Unit Price</Label>
                                <Input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => handleBreakdownChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <div className="col-span-1 flex items-center justify-between">
                                <span className="font-medium text-sm">{formatCurrency(item.total)}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeBreakdownItem(index)}
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
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
                          className={fieldErrors.paymentTerms ? "border-red-500" : ""}
                        />
                        {fieldErrors.paymentTerms && (
                          <p className="text-red-500 text-sm">{fieldErrors.paymentTerms}</p>
                        )}
                      </div>

                      <div className="p-4 bg-muted rounded">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Bid Amount:</span>
                          <span className="text-xl font-bold text-primary">
                            {formatCurrency(getTotalBidAmount() || formData.totalBidAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Required Documents</h3>
                    <div className="space-y-6">
                      {/* B-BBEE Certificate */}
                      <div className="space-y-3">
                        <Label>B-BBEE Certificate *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Select 
                              value={formData.bbbeeStatus} 
                              onValueChange={(value) => handleInputChange('bbbeeStatus', value)}
                            >
                              <SelectTrigger className={fieldErrors.bbbeeStatus ? "border-red-500" : ""}>
                                <SelectValue placeholder="B-BBEE Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="exempt">Exempt Micro Enterprise</SelectItem>
                                <SelectItem value="qse">Qualifying Small Enterprise</SelectItem>
                                <SelectItem value="large">Large Enterprise</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldErrors.bbbeeStatus && (
                              <p className="text-red-500 text-sm">{fieldErrors.bbbeeStatus}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Select 
                              value={formData.bbbeeLevel} 
                              onValueChange={(value) => handleInputChange('bbbeeLevel', value)}
                            >
                              <SelectTrigger className={fieldErrors.bbbeeLevel ? "border-red-500" : ""}>
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
                            {fieldErrors.bbbeeLevel && (
                              <p className="text-red-500 text-sm">{fieldErrors.bbbeeLevel}</p>
                            )}
                          </div>
                        </div>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
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
                          <Label htmlFor="taxCompliance">Tax Compliance Status</Label>
                        </div>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          <FileCheck className="h-6 w-6 mx-auto text-muted-foreground" />
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

                      {/* CIDB Registration */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cidbRegistration">CIDB Registration Number</Label>
                            <Input
                              id="cidbRegistration"
                              value={formData.cidbRegistration}
                              onChange={(e) => handleInputChange('cidbRegistration', e.target.value)}
                              placeholder="CIDB registration number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cidbGrade">CIDB Grade</Label>
                            <Input
                              id="cidbGrade"
                              value={formData.cidbGrade}
                              onChange={(e) => handleInputChange('cidbGrade', e.target.value)}
                              placeholder="e.g., 7CE"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Documents */}
                      <div className="space-y-3">
                        <Label>Additional Supporting Documents</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          <FileUp className="h-6 w-6 mx-auto text-muted-foreground" />
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
                              <div key={index} className="flex items-center justify-between p-2 border rounded">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeUploadedDocument(index)}
                                    className="h-8 w-8"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Declaration Tab */}
                <TabsContent value="declaration" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Declaration</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="termsAccepted"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                          className={fieldErrors.termsAccepted ? "border-red-500" : ""}
                        />
                        <div className="space-y-1">
                          <Label htmlFor="termsAccepted" className="font-semibold">
                            Terms and Conditions Acceptance *
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            I have read and understood the tender terms and conditions, 
                            and I accept all requirements and specifications as outlined 
                            in the tender document.
                          </p>
                          {fieldErrors.termsAccepted && (
                            <p className="text-red-500 text-sm">{fieldErrors.termsAccepted}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="informationAccurate"
                          checked={formData.informationAccurate}
                          onCheckedChange={(checked) => handleInputChange('informationAccurate', checked)}
                          className={fieldErrors.informationAccurate ? "border-red-500" : ""}
                        />
                        <div className="space-y-1">
                          <Label htmlFor="informationAccurate" className="font-semibold">
                            Accuracy of Information *
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            I declare that all information provided in this application 
                            is true, accurate, and complete to the best of my knowledge.
                          </p>
                          {fieldErrors.informationAccurate && (
                            <p className="text-red-500 text-sm">{fieldErrors.informationAccurate}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="nonCollusion"
                          checked={formData.nonCollusion}
                          onCheckedChange={(checked) => handleInputChange('nonCollusion', checked)}
                          className={fieldErrors.nonCollusion ? "border-red-500" : ""}
                        />
                        <div className="space-y-1">
                          <Label htmlFor="nonCollusion" className="font-semibold">
                            Non-Collusion Declaration *
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            I declare that this tender is made in good faith, without 
                            collusion, and that we have not communicated our bid to any 
                            other bidder or engaged in any anti-competitive practices.
                          </p>
                          {fieldErrors.nonCollusion && (
                            <p className="text-red-500 text-sm">{fieldErrors.nonCollusion}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Final Review */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                      <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4" />
                        Final Review
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Tender Reference:</span>
                          <span className="font-medium">{tender.referenceNumber || tender.id}</span>
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
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            {/* Navigation and Submit Buttons */}
            <div className="flex justify-between items-center pt-6 border-t mt-6">
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
                  disabled={isSubmitting || isExpired}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}