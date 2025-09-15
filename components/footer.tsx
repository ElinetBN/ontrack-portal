import { Building2, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold">OnTrack</h3>
                <p className="text-sm text-muted-foreground">Portal System</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional government portal system for procurement and supplier management excellence.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Portals</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/portals/tender-procurement" className="hover:text-primary transition-colors">
                  Tender & Procurement
                </Link>
              </li>
              <li>
                <Link href="/portals/supplier-management" className="hover:text-primary transition-colors">
                  Supplier Management
                </Link>
              </li>
              <li>
                <Link href="/portals/project-management" className="hover:text-primary transition-colors">
                  Project Management
                </Link>
              </li>
              <li>
                <Link href="/portals/budget-inclusion" className="hover:text-primary transition-colors">
                  Budget & Inclusion
                </Link>
              </li>
              <li>
                <Link href="/portals/analytics-reporting" className="hover:text-primary transition-colors">
                  Analytics & Reporting
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/support/documentation" className="hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support/training" className="hover:text-primary transition-colors">
                  Training
                </Link>
              </li>
              <li>
                <Link href="/support/help" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/support/status" className="hover:text-primary transition-colors">
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@ontrack.gov.za
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +27 12 345 6789
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Government District, Pretoria
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 OnTrack Portal System. All rights reserved. | Developed for Government Excellence</p>
        </div>
      </div>
    </footer>
  )
}
