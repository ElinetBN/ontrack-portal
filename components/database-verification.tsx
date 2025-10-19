// components/database-verification.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  RefreshCw,
  FileText,
  Building2,
  User
} from "lucide-react"

export function DatabaseVerification() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchId, setSearchId] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)

  const fetchAllApplications = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/tender-applications?limit=100')
      const result = await response.json()
      
      if (result.success) {
        setApplications(result.data)
        console.log('📊 Applications from database:', result.data)
      } else {
        console.error('Failed to fetch applications:', result.message)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchApplication = async () => {
    if (!searchId.trim()) return
    
    setLoading(true)
    try {
      // Search by application number or ID
      const response = await fetch(`/api/tender-applications?limit=100`)
      const result = await response.json()
      
      if (result.success) {
        const found = result.data.find((app: any) => 
          app.applicationNumber === searchId || 
          app._id === searchId ||
          app.id === searchId
        )
        setSearchResult(found || null)
      }
    } catch (error) {
      console.error('Error searching application:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Verification Tool
        </CardTitle>
        <CardDescription>
          Verify that applications are being saved to the database correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Application by ID or Number</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="search"
                  placeholder="Enter application number or ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <Button onClick={searchApplication} disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchAllApplications} disabled={loading} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All
              </Button>
            </div>
          </div>

          {searchResult && (
            <Alert className="bg-blue-50 border-blue-200">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Application Number:</strong> {searchResult.applicationNumber}</p>
                    <p><strong>Company:</strong> {searchResult.company?.name}</p>
                    <p><strong>Status:</strong> <Badge variant="secondary">{searchResult.status}</Badge></p>
                  </div>
                  <div>
                    <p><strong>Submitted:</strong> {formatDate(searchResult.submittedAt)}</p>
                    <p><strong>Bid Amount:</strong> {formatCurrency(searchResult.financial?.totalBidAmount)}</p>
                    <p><strong>Database ID:</strong> <code className="text-xs">{searchResult._id}</code></p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Applications in Database ({applications.length})</h3>
            <Badge variant={applications.length > 0 ? "default" : "secondary"}>
              {applications.length} records
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading applications from database...</p>
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {applications.map((app) => (
                <Card key={app._id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{app.applicationNumber}</span>
                      </div>
                      <Badge variant="outline">{app.status}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-green-500" />
                        <span>{app.company?.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {app.company?.registrationNumber}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-500" />
                        <span>{app.contact?.person}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {app.contact?.email}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {formatCurrency(app.financial?.totalBidAmount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(app.submittedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <strong>Database ID:</strong> <code>{app._id}</code>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No applications found in database. Submit a test application to see data here.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Database Status */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{applications.length}</div>
            <div className="text-muted-foreground">Total Applications</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter(app => app.status === 'submitted').length}
            </div>
            <div className="text-muted-foreground">Submitted</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {applications.filter(app => app.status === 'under_review').length}
            </div>
            <div className="text-muted-foreground">Under Review</div>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}