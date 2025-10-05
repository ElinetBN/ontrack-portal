import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, ExternalLink, Calendar, Users, MapPin, Clock, FileText } from "lucide-react"
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
    tender.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Open": return "default"
      case "Evaluation": return "secondary"
      case "Awarded": return "outline"
      case "Draft": return "destructive"
      default: return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tender Management</h2>
          <p className="text-muted-foreground">
            Manage {tenders.length} tender{tenders.length !== 1 ? 's' : ''} and opportunities
          </p>
        </div>
        <Button onClick={onTenderCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Tender
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tenders by title, department, category, location, or reference..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {filteredTenders.map((tender) => (
          <Card key={tender.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{tender.title}</CardTitle>
                    <Badge variant={getBadgeVariant(tender.status)}>
                      {tender.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex flex-wrap items-center gap-2">
                    <span>{tender.department}</span>
                    <span>•</span>
                    <span>{tender.category}</span>
                    <span>•</span>
                    <span>ID: {tender.id}</span>
                    {tender.referenceNumber && (
                      <>
                        <span>•</span>
                        <span>Ref: {tender.referenceNumber}</span>
                      </>
                    )}
                  </CardDescription>
                </div>
                <div className="text-right space-y-1 ml-4">
                  <p className="font-semibold">{tender.budget}</p>
                  <p className="text-sm text-muted-foreground">{tender.submissions} submissions</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Deadline: {formatDate(tender.deadline)}</span>
                  </div>
                  
                  {tender.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{tender.location}</span>
                    </div>
                  )}

                  {tender.contractPeriod && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{tender.contractPeriod}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{tender.submissions} submissions</span>
                  </div>

                  {tender.cidbGrading && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>CIDB: {tender.cidbGrading}</span>
                    </div>
                  )}

                  {tender.advertisementLink && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto"
                        onClick={() => window.open(tender.advertisementLink, '_blank')}
                      >
                        View Advertisement
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {tender.advertisementLink && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(tender.advertisementLink, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Advertisement
                    </Button>
                  )}
                  <Button 
                    size="sm"
                    onClick={() => onTenderInfoClick(tender)}
                  >
                    View Details
                  </Button>
                </div>
              </div>

              {(tender.bbbeeLevel || tender.contactPerson || tender.submissionMethod) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6 text-sm">
                    {tender.bbbeeLevel && (
                      <div>
                        <span className="font-medium">B-BBEE: </span>
                        <span className="text-muted-foreground">{tender.bbbeeLevel}</span>
                      </div>
                    )}
                    {tender.contactPerson && (
                      <div>
                        <span className="font-medium">Contact: </span>
                        <span className="text-muted-foreground">{tender.contactPerson}</span>
                      </div>
                    )}
                    {tender.submissionMethod && (
                      <div>
                        <span className="font-medium">Submission: </span>
                        <span className="text-muted-foreground capitalize">{tender.submissionMethod}</span>
                      </div>
                    )}
                    {tender.tenderFee && (
                      <div>
                        <span className="font-medium">Fee: </span>
                        <span className="text-muted-foreground">{tender.tenderFee}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredTenders.length === 0 && tenders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Tenders Created</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first tender to manage procurement opportunities.
              </p>
              <Button onClick={onTenderCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Tender
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredTenders.length === 0 && tenders.length > 0 && (
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