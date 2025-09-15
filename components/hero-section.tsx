import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section id="home" className="relative">
      <div className="relative bg-primary/90 rounded-3xl mx-4 mt-8 overflow-hidden min-h-[500px] md:min-h-[600px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: `url('/modern-office-warehouse-business-people-working-wi.jpg')`,
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex items-center min-h-[500px] md:min-h-[600px]">
          <div className="container mx-auto px-8 py-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-shadow mb-8 leading-tight">
                WITH US, PROCUREMENT
                <br />
                FOR YOUR ORGANIZATION HAS
                <br />
                <span className="text-white/90">NEVER BEEN THIS EASY!</span>
              </h1>

              <Button
                variant="outline"
                size="lg"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm text-lg px-8 py-6 rounded-xl font-medium"
              >
                READ MORE ABOUT OUR JOURNEY...
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
