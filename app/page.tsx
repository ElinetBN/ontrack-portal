import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AuthSection } from "@/components/auth-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AuthSection />
      </main>
      <Footer />
    </div>
  )
}
