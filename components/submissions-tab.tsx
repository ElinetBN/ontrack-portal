import { Submission, Tender } from "../types"
import { SubmissionCard } from "./submission-card"

interface SubmissionsTabProps {
  submissions: Submission[]
  tenders: Tender[]
  onDocumentsUpdate: (submissionId: string, documents: any[]) => void
  onReviewClick: (submission: Submission) => void
}

export function SubmissionsTab({ submissions, onDocumentsUpdate, onReviewClick }: SubmissionsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Submission Management</h2>
        <p className="text-muted-foreground">
          Review and manage {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <SubmissionCard 
            key={submission.id} 
            submission={submission}
            onDocumentsUpdate={onDocumentsUpdate}
            onReviewClick={onReviewClick}
          />
        ))}
      </div>
    </div>
  )
}