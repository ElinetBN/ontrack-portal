import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { Tender } from "../types"

interface ContractsTabProps {
  tenders: Tender[]
  onTenderInfoClick: (tender: Tender) => void
}

export function ContractsTab({ tenders, onTenderInfoClick }: ContractsTabProps) {
  const awardedTenders = tenders.filter(tender => tender.status === "Awarded")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contract Management</h2>
        <p className="text-muted-foreground">
          Manage awarded contracts from {awardedTenders.length} tender{awardedTenders.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Contracts</CardTitle>
          <CardDescription>Currently active procurement contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {awardedTenders.map((tender) => (
              <div key={tender.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="space-y-1">
                  <p className="font-medium">{tender.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {tender.department} • {tender.budget}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Active</Badge>
                    <span className="text-xs text-muted-foreground">Expires: {tender.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-transparent hover:bg-gray-100 transition-colors"
                    onClick={() => window.open(tender.advertisementLink, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Advertisement
                  </Button>
                  <Button 
                    size="sm" 
                    className="hover:bg-blue-600 transition-colors"
                    onClick={() => onTenderInfoClick(tender)}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
            {awardedTenders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No awarded contracts yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}