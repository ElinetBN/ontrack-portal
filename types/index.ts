export interface Tender {
    id: string
    title: string
    department: string
    status: "Open" | "Evaluation" | "Awarded" | "Draft" | "Rejected" | "Closed"
    deadline: string
    budget: string
    submissions: number
    category: string
    description: string
    referenceNumber: string
    requestedItems: string[]
    advertisementLink: string
    evaluationScore?: number
    contactPerson?: string
    contactEmail?: string
    contactPhone?: string
    location?: string
    createdDate?: string
    contractPeriod?: string
    cidbGrading?: string
    bbbeeLevel?: string
    submissionMethod?: string
    tenderFee?: string
  }
  
  export interface Submission {
    id: string
    tenderId: string
    supplier: string
    tenderTitle: string
    companyName: string
    submissionDate: string
    lastUpdated: string
    status: string
    bidAmount: string
    documents?: Document[]
    notes?: string
    submittedDate: string
    score?: string
    
  }
  
  export interface Document {
    id: string
    name: string
    url: string
    type: string
    category: string
    description: string
    version: string
    uploadDate: string
    lastModified: string
    size: number
    uploadedBy: string
  }
  
  export interface CalendarEvent {
    id: number
    date: string
    time: string
    title: string
    type: string
  }
  
  export interface Notification {
    id: number
    title: string
    message: string
    date: string
    type: string
    urgent: boolean
    read: boolean
  }



 
  
  