import { Tender, Submission, CalendarEvent, Notification } from "../types"

export const initialTenders: Tender[] = [
  {
    id: "TND-2024-001",
    title: "IT Infrastructure Upgrade Project",
    department: "Information Technology",
    status: "Open",
    deadline: "2024-02-15",
    budget: "R 2,500,000",
    submissions: 12,
    category: "Technology",
    description: "Upgrade of entire IT infrastructure including servers, networking equipment, and workstations.",
    referenceNumber: "REF-IT-001",
    requestedItems: ["Technical Specifications", "Financial Proposal", "Project Timeline"],
    advertisementLink: "https://example.gov.za/tenders/TND-2024-001",
    evaluationScore: 85,
    contactPerson: "John Smith",
    contactEmail: "john.smith@company.com",
    contactPhone: "+27 11 123 4567",
    location: "Johannesburg, Gauteng",
    createdDate: "2024-01-10"
  },
  {
    id: "TND-2024-002",
    title: "Office Furniture Supply Contract",
    department: "Facilities Management",
    status: "Evaluation",
    deadline: "2024-01-30",
    budget: "R 850,000",
    submissions: 8,
    category: "Supplies",
    description: "Supply and installation of modern office furniture for the new headquarters building.",
    referenceNumber: "REF-FM-002",
    requestedItems: ["Company Registration Documents", "Tax Compliance Certificate", "BEE Certificate"],
    advertisementLink: "https://example.gov.za/tenders/TND-2024-002",
    evaluationScore: 92,
    contactPerson: "Sarah Johnson",
    contactEmail: "sarah.j@company.com",
    contactPhone: "+27 11 234 5678",
    location: "Cape Town, Western Cape",
    createdDate: "2024-01-05"
  },
  {
    id: "TND-2024-003",
    title: "Security Services Contract",
    department: "Security",
    status: "Awarded",
    deadline: "2024-01-20",
    budget: "R 1,200,000",
    submissions: 15,
    category: "Services",
    description: "24/7 security services for corporate headquarters and satellite offices.",
    referenceNumber: "REF-SEC-003",
    requestedItems: ["Methodology Statement", "Health and Safety Policy", "Team CVs"],
    advertisementLink: "https://example.gov.za/tenders/TND-2024-003",
    evaluationScore: 78,
    contactPerson: "Mike Brown",
    contactEmail: "mike.brown@company.com",
    contactPhone: "+27 11 345 6789",
    location: "Durban, KwaZulu-Natal",
    createdDate: "2024-01-02"
  },
]

export const initialSubmissions: Submission[] = [
  {
    id: "SUB-001",
    tenderId: "TND-2024-001",
    supplier: "TechCorp Solutions",
    submittedDate: "2024-01-25",
    status: "Under Review",
    score: "85",
    documents: [
      {
        id: "doc-1",
        name: "Technical Proposal.pdf",
        type: "PDF",
        category: "Technical",
        description: "Detailed technical proposal outlining the solution approach",
        version: "1.0",
        uploadDate: "2024-01-25T10:30:00Z",
        lastModified: "2024-01-25T10:30:00Z",
        size: 2457600,
        uploadedBy: "TechCorp Solutions"
      },
      {
        id: "doc-2",
        name: "Financial Bid.xlsx",
        type: "Excel Spreadsheet",
        category: "Financial",
        description: "Complete financial breakdown and pricing",
        version: "1.0",
        uploadDate: "2024-01-25T10:32:00Z",
        lastModified: "2024-01-25T10:32:00Z",
        size: 512000,
        uploadedBy: "TechCorp Solutions"
      }
    ],
  },
  {
    id: "SUB-002",
    tenderId: "TND-2024-001",
    supplier: "Digital Dynamics",
    submittedDate: "2024-01-24",
    status: "Evaluated",
    score: "92",
    documents: [
      {
        id: "doc-3",
        name: "Company Profile.pdf",
        type: "PDF",
        category: "Administrative",
        description: "Company overview and credentials",
        version: "1.0",
        uploadDate: "2024-01-24T14:20:00Z",
        lastModified: "2024-01-24T14:20:00Z",
        size: 1536000,
        uploadedBy: "Digital Dynamics"
      }
    ],
  },
  {
    id: "SUB-003",
    tenderId: "TND-2024-002",
    supplier: "Office Plus",
    submittedDate: "2024-01-28",
    status: "Compliant",
    score: "78",
    documents: [],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    date: "2024-06-01",
    time: "2:00pm",
    title: "Bid specification - Appointment of a consultant to formulate a strategy for Microsoft BI stack",
    type: "specification"
  },
  {
    id: 2,
    date: "2024-06-13",
    time: "8:00am",
    title: "Advert issue - Appointment of a consultant to formulate a strategy for Microsoft BI stack",
    type: "advert"
  },
  {
    id: 3,
    date: "2024-06-16",
    time: "10:00am",
    title: "Bid submission deadline - Office Furniture Supply",
    type: "deadline"
  },
  {
    id: 4,
    date: "2024-06-20",
    time: "3:00pm",
    title: "Evaluation committee meeting",
    type: "meeting"
  }
]

export const notifications: Notification[] = [
  {
    id: 1,
    title: "Document Approval Required",
    message: "SBD form document has been uploaded by Basic Moderna. Document needs Business Unit, SCM Manager, CEO & Support's approval.",
    date: "Apr 2024",
    type: "approval",
    urgent: true,
    read: false
  },
  {
    id: 2,
    title: "Document Approval Required",
    message: "SBD form document has been uploaded by Nails Moderna. Document needs Business Unit, SCM Manager, CEO & Support's approval.",
    date: "Apr 2024",
    type: "approval",
    urgent: true,
    read: false
  },
  {
    id: 3,
    title: "System Alert",
    message: "System failed to auto-update 34 bidder accounts. Click here to review CSD connection details.",
    date: "Jun 2024",
    type: "alert",
    urgent: true,
    read: true
  },
  {
    id: 4,
    title: "Bid Portal Reminder",
    message: "Open bid submission portal for list month submissions.",
    date: "Jun 2024",
    type: "reminder",
    urgent: false,
    read: true
  }
]

export const serviceCategories = [
  "Plumbing", "Electrical", "Cleaning", "Catering", "Security", "Construction",
  "IT Services", "Facilities Management", "Landscaping", "Maintenance", "Consulting", "Transportation"
]

export const cidbGrading = ["1GB", "2GB", "3GB", "4GB", "5GB", "6GB", "7GB", "8GB", "9GB"]

export const bbbeeLevels = [
  "Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Non-Compliant"
]

export const evaluationCriteria = [
  "Price Competitiveness", "Technical Experience", "B-BBEE Status", "Safety Compliance", "Quality Assurance",
  "Project Methodology", "Team Experience", "Financial Stability", "References", "Innovation"
]

export const mandatoryDocuments = [
  "CIPC Registration Documents", "Tax Clearance Certificate", "B-BBEE Certificate", "CIDB Certificate",
  "Company Profile", "Reference Letters", "Insurance Certificates", "Health and Safety Policy",
  "CVs of Key Personnel", "Quality Management System"
]