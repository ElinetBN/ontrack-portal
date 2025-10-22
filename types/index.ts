// types.ts
export interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadedAt: string
  size?: string
  status?: 'uploaded' | 'missing' | 'rejected' | 'approved'
  reviewedAt?: string
  notes?: string
}

export interface Tender {
  id: string
  title: string
  description: string
  status: 'draft' | 'published' | 'open' | 'under_review' | 'awarded' | 'closed' | 'cancelled'
  category: string
  deadline: string
  estimatedBudget: string
  createdBy: string
  createdDate: string
  requiresApproval?: boolean
  documents?: Document[]
  evaluationCriteria?: string
  contractType?: string
  bidOpeningDate?: string
  location?: string
  tenderNumber?: string
  publishedDate?: string
  bidderApplicationLink?: string
}

export interface Submission {
  id: string
  tenderId: string
  tenderTitle: string
  companyName: string
  applicationNumber?: string
  submissionDate: string
  lastUpdated: string
  status: 'submitted' | 'under_review' | 'evaluated' | 'awarded' | 'rejected'
  bidAmount: string
  documents?: Document[]
  
  // Submitter/applicant details
  submitter?: {
    name: string
    email: string
    phone?: string
    position?: string
    department?: string
  }
  
  // Company details
  companyDetails?: {
    name: string
    registrationNumber?: string
    address?: string
    contactPerson: string
    contactEmail: string
    contactPhone?: string
    taxNumber?: string
    yearsInBusiness?: number
  }
  
  // Additional fields from existing interface
  supplier?: string
  company?: string
  proposal?: string
  amount?: number
  score?: number
  submittedAt?: string
  evaluation?: any
  submittedDate?: string
  notes?: string
  contactPerson?: string
  contactEmail?: string
  contactPhone?: string
  companyRegistration?: string
  taxNumber?: string
  bbbeeStatus?: string
  bbbeeLevel?: string
  complianceStatus?: string
}

export interface Evaluation {
  id: string
  submissionId: string
  evaluator: string
  score: number
  comments: string
  criteria: EvaluationCriteria[]
  submittedAt: string
}

export interface EvaluationCriteria {
  id: string
  name: string
  score: number
  maxScore: number
  comments: string
  weight: number
}

export interface Contract {
  id: string
  tenderId: string
  submissionId: string
  title: string
  status: 'draft' | 'active' | 'completed' | 'terminated'
  startDate: string
  endDate: string
  value: string
  contractor: string
  createdBy: string
  documents?: Document[]
}

// types/index.ts
export interface NotificationResult {
  submissionId: string
  email: string
  status: 'sent' | 'failed'
  messageId?: string
  error?: string
}

export interface NotificationRequest {
  submissions: Submission[]
  messageType: 'application_received' | 'missing_documents' | 'under_review' | 'awarded' | 'rejected' | 'custom'
  customMessage?: string
  tenderDetails?: {
    title: string
    id?: string
  }
}