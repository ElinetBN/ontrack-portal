import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, ExternalLink, Calendar, Users } from "lucide-react"
import { Tender } from "../types"

interface TendersTabProps {
  tenders: Tender[]
  onTenderCreate: () => void
  onTenderInfoClick: (tender: Tender) => void
}

export function TendersTab({ tenders, onTenderCreate, onTenderInfoClick }: TendersTabProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTenders = tenders.filter(tender =>
    tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tender Management</h2>
          <p className="text-muted-foreground">
            Manage {tenders.length} tender{tenders.length !== 1 ? 's' : ''} and opportunities
          </p>
        </div>
        <Button onClick={onTenderCreate} className="hover:bg-blue-600 transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          Create Tender
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tenders..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-transparent hover:bg-gray-100 transition-colors">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Tenders List */}
      <div className="space-y-4">
        {filteredTenders.map((tender) => (
          <Card key={tender.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{tender.title}</CardTitle>
                    <Badge
                      variant={
                        tender.status === "Open"
                          ? "default"
                          : tender.status === "Evaluation"
                            ? "secondary"
                            : tender.status === "Awarded"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {tender.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {tender.department} • {tender.category} • ID: {tender.id}
                    {tender.referenceNumber && ` • Ref: ${tender.referenceNumber}`}
                  </CardDescription>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold">{tender.budget}</p>
                  <p className="text-sm text-muted-foreground">{tender.submissions} submissions</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Deadline: {tender.deadline}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {tender.submissions} submissions
                  </div>
                  {tender.advertisementLink && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto text-muted-foreground hover:text-blue-600 transition-colors"
                        onClick={() => window.open(tender.advertisementLink, '_blank')}
                      >
                        View Advertisement
                      </Button>
                    </div>
                  )}
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
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredTenders.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No tenders found matching your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}