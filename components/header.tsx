import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white border-b border-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-serif text-foreground">
              <span className="italic">OnTrack</span>
              <span className="block text-sm md:text-base font-sans font-bold uppercase tracking-wider text-muted-foreground">
                PORTAL SYSTEM
              </span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/auth/register"
              className="text-muted-foreground hover:text-primary transition-colors font-medium uppercase tracking-wide text-sm"
            >
              SIGN UP
            </Link>
            <Link
              href="/auth/signin"
              className="text-muted-foreground hover:text-primary transition-colors font-medium uppercase tracking-wide text-sm"
            >
              LOGIN
            </Link>
            <Link
              href="#contact"
              className="text-muted-foreground hover:text-primary transition-colors font-medium uppercase tracking-wide text-sm"
            >
              CONTACT US
            </Link>
          </nav>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden bg-transparent">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[280px] sm:w-[350px]">
              <div className="flex items-center mb-8">
                <h2 className="text-xl font-serif text-foreground">
                  <span className="italic">OnTrack</span>
                  <span className="block text-sm font-sans font-bold uppercase tracking-wider text-muted-foreground">
                    PORTAL SYSTEM
                  </span>
                </h2>
              </div>

              <nav className="flex flex-col gap-4">
                <Link
                  href="/auth/register"
                  className="text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-accent font-medium uppercase tracking-wide"
                >
                  SIGN UP
                </Link>
                <Link
                  href="/auth/signin"
                  className="text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-accent font-medium uppercase tracking-wide"
                >
                  LOGIN
                </Link>
                <Link
                  href="#contact"
                  className="text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-accent font-medium uppercase tracking-wide"
                >
                  CONTACT US
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
