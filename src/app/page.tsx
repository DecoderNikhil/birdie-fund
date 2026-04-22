import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection, HowItWorks, CharitySpotlight, PrizeTiers, DrawCountdown, FinalCTA } from '@/components/home/HeroSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <CharitySpotlight />
      <PrizeTiers />
      <DrawCountdown />
      <FinalCTA />
      <Footer />
    </div>
  )
}