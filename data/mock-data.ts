import { Tender, Submission, CalendarEvent, Notification } from "../types"

export const initialTenders: Tender[] = []

export const initialSubmissions: Submission[] = []
  
export const calendarEvents: CalendarEvent[] = []
 

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