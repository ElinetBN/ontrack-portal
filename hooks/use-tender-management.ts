import { useState } from "react"
import { Tender, Submission } from "../types"

export function useTenderManagement(initialTenders: Tender[], initialSubmissions: Submission[]) {
  const [tenders, setTenders] = useState<Tender[]>(initialTenders)
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)

  const handleTenderCreate = (newTender: Tender) => {
    setTenders(prev => [newTender, ...prev])
    
    const supplierNames = ["Global Solutions Inc", "Innovate Partners", "Prime Contractors", "Elite Services Co", "Advanced Systems Ltd"]
    const newSubmissions: Submission[] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, index) => ({
      id: `SUB-${Date.now()}-${index}`,
      tenderId: newTender.id,
      supplier: supplierNames[Math.floor(Math.random() * supplierNames.length)],
      submittedDate: new Date().toISOString().split('T')[0],
      status: "Under Review",
      score: (Math.floor(Math.random() * 20) + 70).toString(),
      documents: [],
    }))
    
    setSubmissions(prev => [...newSubmissions, ...prev])
  }

  const handleDocumentsUpdate = (submissionId: string, updatedDocuments: any[]) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === submissionId
          ? { ...submission, documents: updatedDocuments }
          : submission
      )
    )
  }

  const handleEvaluationComplete = (submissionId: string, score: number, status: string) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === submissionId
          ? { ...submission, score: score.toString(), status }
          : submission
      )
    )
  }

  const handleTenderStatusChange = (tenderId: string, newStatus: string) => {
    setTenders(prev =>
      prev.map(tender =>
        tender.id === tenderId
          ? { ...tender, status: newStatus }
          : tender
      )
    )
  }

  return {
    tenders,
    submissions,
    handleTenderCreate,
    handleDocumentsUpdate,
    handleEvaluationComplete,
    handleTenderStatusChange
  }
}