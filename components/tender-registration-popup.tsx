"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, FileUp, FileText } from "lucide-react"
import { TenderData, TenderUtils } from "@/lib/api/tender"
import { 
  serviceCategories, 
  cidbGrading, 
  bbbeeLevels, 
  evaluationCriteria, 
  mandatoryDocuments 
} from "../data/mock-data"

interface TenderRegistrationPopupProps {
  isOpen: boolean
  onClose: () => void
  onTenderCreate: (tenderData: TenderData) => Promise<any>
}

interface FormErrors {
  tenderTitle?: string
  category?: string
  tenderDescription?: string
  location?: string
  estimatedValue?: string
  openingDate?: string
  closingDate?: string
  closingTime?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  evaluationCriteria?: string
  mandatoryDocuments?: string
  complianceAccepted?: string
}

export function TenderRegistrationPopup({ isOpen, onClose, onTenderCreate }: TenderRegistrationPopupProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  
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

  // Validation functions
  const isValidEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const isValidSouthAfricanPhone = (phone: string): boolean => {
    // South African phone number validation
    const saPhoneRegex = /^(\+27|0)[\s-]?[1-9][\d\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{3,4}$/
    return saPhoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {}

    switch (currentStep) {
      case 1:
        if (!formData.tenderTitle.trim()) {
          newErrors.tenderTitle = "Tender title is required"
        }
        if (!formData.category) {
          newErrors.category = "Category is required"
        }
        if (!formData.tenderDescription.trim()) {
          newErrors.tenderDescription = "Tender description is required"
        }
        break

      case 2:
        if (!formData.location.trim()) {
          newErrors.location = "Location is required"
        }
        if (!formData.estimatedValue.trim()) {
          newErrors.estimatedValue = "Estimated value is required"
        }
        break

      case 3:
        if (!formData.openingDate) {
          newErrors.openingDate = "Opening date is required"
        }
        if (!formData.closingDate) {
          newErrors.closingDate = "Closing date is required"
        }
        if (!formData.closingTime) {
          newErrors.closingTime = "Closing time is required"
        }
        if (!formData.contactName.trim()) {
          newErrors.contactName = "Contact name is required"
        }
        if (!formData.contactEmail.trim()) {
          newErrors.contactEmail = "Contact email is required"
        } else if (!isValidEmail(formData.contactEmail)) {
          newErrors.contactEmail = "Please enter a valid email address"
        }
        if (formData.contactPhone && !isValidSouthAfricanPhone(formData.contactPhone)) {
          newErrors.contactPhone = "Please enter a valid South African phone number (e.g., +27 12 345 6789 or 012 345 6789)"
        }
        
        // Validate dates
        if (formData.openingDate && formData.closingDate) {
          const opening = new Date(formData.openingDate)
          const closing = new Date(formData.closingDate)
          if (closing <= opening) {
            newErrors.closingDate = "Closing date must be after opening date"
          }
        }
        break

      case 4:
        if (formData.evaluationCriteria.length === 0) {
          newErrors.evaluationCriteria = "At least one evaluation criteria must be selected"
        }
        if (formData.mandatoryDocuments.length === 0) {
          newErrors.mandatoryDocuments = "At least one mandatory document must be selected"
        }
        if (!formData.complianceAccepted) {
          newErrors.complianceAccepted = "You must acknowledge the compliance requirements"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null)
    }
  }

  const handleCheckboxToggle = (field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }))
    
    // Clear error when user selects an option
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
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

  const generateTenderNumber = () => {
    return TenderUtils.generateTenderNumber(formData.organization)
  }

  const formatBudget = (amount: string) => {
    const numericValue = parseInt(amount.replace(/\D/g, '') || '0')
    return numericValue
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    
    // Validate all steps before submission
    let allStepsValid = true;
    
    // Validate step 1
    setCurrentStep(1);
    if (!validateCurrentStep()) allStepsValid = false;
    
    // Validate step 2
    setCurrentStep(2);
    if (!validateCurrentStep()) allStepsValid = false;
    
    // Validate step 3
    setCurrentStep(3);
    if (!validateCurrentStep()) allStepsValid = false;
    
    // Validate step 4
    setCurrentStep(4);
    if (!validateCurrentStep()) allStepsValid = false;
    
    // If any step has errors, go to the first step with errors
    if (!allStepsValid) {
      // Find the first step with errors
      for (let step = 1; step <= 4; step++) {
        setCurrentStep(step);
        const tempErrors: FormErrors = {};
        
        // Simulate validation for each step
        switch (step) {
          case 1:
            if (!formData.tenderTitle.trim() || !formData.category || !formData.tenderDescription.trim()) {
              setCurrentStep(1);
              return;
            }
            break;
          case 2:
            if (!formData.location.trim() || !formData.estimatedValue.trim()) {
              setCurrentStep(2);
              return;
            }
            break;
          case 3:
            if (!formData.openingDate || !formData.closingDate || !formData.closingTime || 
                !formData.contactName.trim() || !formData.contactEmail.trim() || 
                !isValidEmail(formData.contactEmail)) {
              setCurrentStep(3);
              return;
            }
            break;
          case 4:
            if (formData.evaluationCriteria.length === 0 || formData.mandatoryDocuments.length === 0 || 
                !formData.complianceAccepted) {
              setCurrentStep(4);
              return;
            }
            break;
        }
      }
      return;
    }

    try {
      setLoading(true)

      // Prepare tender data for API
      const tenderData: TenderData = {
        tenderNumber: formData.tenderReference || generateTenderNumber(),
        title: formData.tenderTitle,
        description: formData.tenderDescription,
        organization: "University Procurement", // You can make this dynamic
        category: formData.category,
        value: formatBudget(formData.estimatedValue),
        currency: 'ZAR',
        status: formData.tenderStatus === "published" ? "open" : "pending",
        publishDate: formData.openingDate ? new Date(formData.openingDate) : new Date(),
        closingDate: new Date(formData.closingDate),
        location: formData.location,
        contactPerson: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone
        },
        requirements: formData.mandatoryDocuments,
        tags: formData.evaluationCriteria,
        metadata: {
          source: 'web-portal',
          externalId: formData.tenderReference || generateTenderNumber(),
          lastUpdated: new Date(),
          createdBy: 'system-user' // You can get this from auth context
        }
      }

      // Validate tender data
      const validation = TenderUtils.validateTenderData(tenderData)
      if (!validation.isValid) {
        setApiError(validation.errors.join(', '))
        return
      }

      // Call the API through the hook
      await onTenderCreate(tenderData)

      // Reset form and close
      resetForm()
      onClose()

    } catch (error: any) {
      console.error('Error creating tender:', error)
      setApiError(error.message || 'Failed to create tender. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
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
    setErrors({})
    setCurrentStep(1)
    setApiError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    } else {
      // Scroll to the first error on the current page
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.border-red-500, .text-red-500')
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }, 100)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    // Clear errors when going back
    setErrors({})
    setApiError(null)
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClose} 
            className="hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* API Error Display */}
        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            <p className="text-sm font-medium">Error: {apiError}</p>
          </div>
        )}

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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                        className={`w-full ${errors.tenderTitle ? 'border-red-500' : ''}`}
                        disabled={loading}
                      />
                      {errors.tenderTitle && (
                        <p className="text-red-500 text-xs mt-1">{errors.tenderTitle}</p>
                      )}
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
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-1">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category / Service Type <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Select the primary service category</p>
                    </div>
                    <div className="lg:col-span-2">
                      <select
                        id="category"
                        className={`w-full p-3 border rounded-md bg-white mt-1 ${errors.category ? 'border-red-500' : 'border-gray-300'} ${loading ? 'opacity-50' : ''}`}
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select Category</option>
                        {serviceCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                      )}
                    </div>
                  </div>

                  {/* Tender Description */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                        className={`w-full resize-vertical ${errors.tenderDescription ? 'border-red-500' : ''} ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                      />
                      {errors.tenderDescription && (
                        <p className="text-red-500 text-xs mt-1">{errors.tenderDescription}</p>
                      )}
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
                      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${loading ? 'opacity-50' : ''}`}>
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
                          disabled={loading}
                        />
                        <Label htmlFor="supportingDocuments">
                          <Button 
                            variant="outline" 
                            type="button" 
                            asChild 
                            className="hover:bg-gray-100 transition-colors"
                            disabled={loading}
                          >
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
                                disabled={loading}
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                        className={`w-full ${errors.location ? 'border-red-500' : ''} ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                      />
                      {errors.location && (
                        <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                      )}
                    </div>
                  </div>

                  {/* Estimated Value */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                          className={`pl-8 w-full ${errors.estimatedValue ? 'border-red-500' : ''} ${loading ? 'opacity-50' : ''}`}
                          value={formData.estimatedValue}
                          onChange={(e) => handleInputChange("estimatedValue", e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      {errors.estimatedValue && (
                        <p className="text-red-500 text-xs mt-1">{errors.estimatedValue}</p>
                      )}
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
                        className={`w-full ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
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
                        className={`w-full p-3 border border-gray-300 rounded-md bg-white mt-1 ${loading ? 'opacity-50' : ''}`}
                        value={formData.cidbGrading}
                        onChange={(e) => handleInputChange("cidbGrading", e.target.value)}
                        disabled={loading}
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
                        className={`w-full p-3 border border-gray-300 rounded-md bg-white mt-1 ${loading ? 'opacity-50' : ''}`}
                        value={formData.bbbeeLevel}
                        onChange={(e) => handleInputChange("bbbeeLevel", e.target.value)}
                        disabled={loading}
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
                      <div className={`space-y-4 p-4 border border-gray-200 rounded-lg ${loading ? 'opacity-50' : ''}`}>
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="insuranceRequired"
                            checked={formData.insuranceRequired}
                            onChange={(e) => handleInputChange("insuranceRequired", e.target.checked)}
                            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${loading ? 'opacity-50' : ''}`}
                            disabled={loading}
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
                            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${loading ? 'opacity-50' : ''}`}
                            disabled={loading}
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                        className={`w-full ${errors.openingDate ? 'border-red-500' : ''} ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                      />
                      {errors.openingDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.openingDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Closing Date */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                        className={`w-full ${errors.closingDate ? 'border-red-500' : ''} ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                      />
                      {errors.closingDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.closingDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Closing Time */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                        className={`w-full ${errors.closingTime ? 'border-red-500' : ''} ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                      />
                      {errors.closingTime && (
                        <p className="text-red-500 text-xs mt-1">{errors.closingTime}</p>
                      )}
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
                        className={`w-full p-3 border border-gray-300 rounded-md bg-white mt-1 ${loading ? 'opacity-50' : ''}`}
                        value={formData.submissionMethod}
                        onChange={(e) => handleInputChange("submissionMethod", e.target.value)}
                        disabled={loading}
                      >
                        <option value="online">Online Upload Only</option>
                        <option value="email">Email Submission</option>
                        <option value="physical">Physical Delivery</option>
                        <option value="hybrid">Multiple Methods</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                        className={`w-full ${errors.contactName ? 'border-red-500' : ''} ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                      />
                      {errors.contactName && (
                        <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Email */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                        className={`w-full ${errors.contactEmail ? 'border-red-500' : ''} ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                      />
                      {errors.contactEmail && (
                        <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Phone */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                        className={`w-full ${errors.contactPhone ? 'border-red-500' : ''} ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                      />
                      {errors.contactPhone && (
                        <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>
                      )}
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
                        className={`w-full ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-1">
                      <Label className="text-sm font-medium">
                        Evaluation Criteria <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Select criteria for tender evaluation</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-6 ${errors.evaluationCriteria ? 'border-red-500' : 'border-gray-200'} ${loading ? 'opacity-50' : ''}`}>
                        {evaluationCriteria.map((criterion) => (
                          <div key={criterion} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`eval-${criterion}`}
                              checked={formData.evaluationCriteria.includes(criterion)}
                              onChange={() => handleCheckboxToggle("evaluationCriteria", criterion)}
                              className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${loading ? 'opacity-50' : ''}`}
                              disabled={loading}
                            />
                            <Label htmlFor={`eval-${criterion}`} className="text-sm font-normal cursor-pointer">
                              {criterion}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.evaluationCriteria && (
                        <p className="text-red-500 text-xs mt-1">{errors.evaluationCriteria}</p>
                      )}
                    </div>
                  </div>

                  {/* Mandatory Documents */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-1">
                      <Label className="text-sm font-medium">
                        Mandatory Documents Checklist <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Required documents from bidders</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-6 ${errors.mandatoryDocuments ? 'border-red-500' : 'border-gray-200'} ${loading ? 'opacity-50' : ''}`}>
                        {mandatoryDocuments.map((document) => (
                          <div key={document} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`doc-${document}`}
                              checked={formData.mandatoryDocuments.includes(document)}
                              onChange={() => handleCheckboxToggle("mandatoryDocuments", document)}
                              className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${loading ? 'opacity-50' : ''}`}
                              disabled={loading}
                            />
                            <Label htmlFor={`doc-${document}`} className="text-sm font-normal cursor-pointer">
                              {document}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.mandatoryDocuments && (
                        <p className="text-red-500 text-xs mt-1">{errors.mandatoryDocuments}</p>
                      )}
                    </div>
                  </div>

                  {/* Compliance Acknowledgement */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-1">
                      <Label className="text-sm font-medium">
                        Compliance Acknowledgement <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Terms and conditions acceptance</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className={`flex items-center space-x-3 p-4 border rounded-lg ${errors.complianceAccepted ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-blue-50'} ${loading ? 'opacity-50' : ''}`}>
                        <input
                          type="checkbox"
                          id="complianceAccepted"
                          checked={formData.complianceAccepted}
                          onChange={(e) => handleInputChange("complianceAccepted", e.target.checked)}
                          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${loading ? 'opacity-50' : ''}`}
                          disabled={loading}
                        />
                        <Label htmlFor="complianceAccepted" className="text-sm font-normal">
                          I acknowledge that tenderers must accept all rules and terms of this tender
                        </Label>
                      </div>
                      {errors.complianceAccepted && (
                        <p className="text-red-500 text-xs mt-1">{errors.complianceAccepted}</p>
                      )}
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
                        className={`w-full p-3 border border-gray-300 rounded-md bg-white mt-1 ${loading ? 'opacity-50' : ''}`}
                        value={formData.tenderStatus}
                        onChange={(e) => handleInputChange("tenderStatus", e.target.value)}
                        disabled={loading}
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
                        className={`w-full p-3 border border-gray-300 rounded-md bg-white mt-1 ${loading ? 'opacity-50' : ''}`}
                        value={formData.tenderFee}
                        onChange={(e) => handleInputChange("tenderFee", e.target.value)}
                        disabled={loading}
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
                            className={`pl-8 w-full ${loading ? 'opacity-50' : ''}`}
                            value={formData.feeAmount}
                            onChange={(e) => handleInputChange("feeAmount", e.target.value)}
                            disabled={loading}
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
                      <div className={`flex items-center space-x-3 p-4 border border-gray-200 rounded-lg ${loading ? 'opacity-50' : ''}`}>
                        <input
                          type="checkbox"
                          id="confidentiality"
                          checked={formData.confidentiality}
                          onChange={(e) => handleInputChange("confidentiality", e.target.checked)}
                          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${loading ? 'opacity-50' : ''}`}
                          disabled={loading}
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
              disabled={currentStep === 1 || loading}
              className="px-6 hover:bg-gray-100 transition-colors"
            >
              Previous
            </Button>
            
            {currentStep < 5 ? (
              <Button 
                type="button" 
                onClick={nextStep} 
                className="px-6 hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                Next Step
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="px-6 hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Tender
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}