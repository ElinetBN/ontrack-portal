// hooks/use-tender-management.ts
import { useState, useCallback } from "react"
import { Tender, Submission } from "../types"

export function useTenderManagement(initialTenders: Tender[], initialSubmissions: Submission[]) {
  const [tenders, setTenders] = useState<Tender[]>(() => {
    // Ensure initial tenders are unique
    const seen = new Set()
    return initialTenders.filter(tender => {
      if (seen.has(tender.id)) return false
      seen.add(tender.id)
      return true
    })
  })

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    // Ensure initial submissions are unique
    const seen = new Set()
    return initialSubmissions.filter(submission => {
      if (seen.has(submission.id)) return false
      seen.add(submission.id)
      return true
    })
  })

  const handleTenderCreate = useCallback((newTender: Tender) => {
    setTenders(prev => {
      const exists = prev.find(t => t.id === newTender.id)
      if (exists) {
        console.warn('Tender already exists:', newTender.id)
        return prev
      }
      console.log('Adding new tender:', newTender.id)
      return [...prev, newTender]
    })
  }, [])

  const handleDocumentsUpdate = useCallback((submissionId: string, documents: any[]) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, documents } 
          : sub
      )
    )
  }, [])

  const handleEvaluationComplete = useCallback((submissionId: string, score: number, status: string) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, score, status } 
          : sub
      )
    )
  }, [])

  const handleTenderStatusChange = useCallback((tenderId: string, status: string) => {
    setTenders(prev => 
      prev.map(tender => 
        tender.id === tenderId 
          ? { ...tender, status } 
          : tender
      )
    )
  }, [])

  // Debug logging
  console.log('Current state - Tenders:', tenders.length, 'Submissions:', submissions.length)

  return {
    tenders,
    submissions,
    handleTenderCreate,
    handleDocumentsUpdate,
    handleEvaluationComplete,
    handleTenderStatusChange
  }
}