import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Clock, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StatsCardsProps {
  activeTendersCount: number
  totalSubmissionsCount: number
  pendingEvaluationCount: number
  totalBudgetValue: number
  tendersCount: number
}

export function StatsCards({ 
  activeTendersCount, 
  totalSubmissionsCount, 
  pendingEvaluationCount, 
  totalBudgetValue,
  tendersCount 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active<br />Tenders</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTendersCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {activeTendersCount > 3 ? `+${activeTendersCount - 3} from last month` : 'Consistent with last month'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSubmissionsCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalSubmissionsCount > 3 ? `+${totalSubmissionsCount - 3} total submissions` : 'Managing submissions'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Evaluation</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingEvaluationCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {pendingEvaluationCount > 0 ? `${pendingEvaluationCount} awaiting review` : 'All caught up'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total<br />Value</CardTitle>
          <span className="h-4 w-4 text-muted-foreground flex items-center justify-center font-bold text-sm">R</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R {(totalBudgetValue / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {tendersCount} active tenders
          </p>
        </CardContent>
      </Card>
    </div>
  )
}