import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, FolderKanban, PieChart, BarChart3, ArrowRight } from "lucide-react"
import Link from "next/link"

const portals = [
  {
    id: "tender-procurement",
    title: "Tender & Procurement Portal",
    description: "Manage tender publication, electronic submission, automated evaluation, and contract management.",
    icon: FileText,
    features: ["E-submission", "Automated Scoring", "Document Management", "Notifications"],
    href: "/portals/tender-procurement",
  },
  {
    id: "supplier-management",
    title: "Supplier Management & Development Portal",
    description: "Handle supplier onboarding, performance monitoring, and development planning.",
    icon: Users,
    features: ["KPI Tracking", "Gap Analysis", "Training Programs", "Performance Reports"],
    href: "/portals/supplier-management",
  },
  {
    id: "project-management",
    title: "Project Management Portal",
    description: "Embedded project management for tenders and contracts with comprehensive tracking.",
    icon: FolderKanban,
    features: ["Task Management", "Timeline Tracking", "Resource Management", "Issue Logging"],
    href: "/portals/project-management",
  },
  {
    id: "budget-inclusion",
    title: "Budget & Inclusion Portal",
    description: "Track inclusive budget allocation and spending across sectors and demographics.",
    icon: PieChart,
    features: ["Budget Dashboards", "Variance Alerts", "Allocation Analytics", "Inclusion Metrics"],
    href: "/portals/budget-inclusion",
  },
  {
    id: "analytics-reporting",
    title: "Analytics & Reporting Portal",
    description: "Consolidated dashboards and reporting across all procurement and supplier activities.",
    icon: BarChart3,
    features: ["Real-time KPIs", "Custom Reports", "Trend Analysis", "Compliance Tracking"],
    href: "/portals/analytics-reporting",
  },
]

export function PortalCards() {
  return (
    <section id="portals" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Five Specialized Portals</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Each portal is designed for specific user roles and functions, providing targeted tools and insights.
          </p>
        </div>

        <div className="flex flex-row gap-6 overflow-x-auto pb-4">
          {portals.map((portal) => {
            const IconComponent = portal.icon
            return (
              <Card key={portal.id} className="min-w-[280px] flex-shrink-0 h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-primary/10 p-3 rounded-lg w-fit mb-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{portal.title}</CardTitle>
                  <CardDescription className="text-sm">{portal.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {portal.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                    <Link href={portal.href}>
                      Access Portal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}