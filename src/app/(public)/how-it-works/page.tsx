import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui'

export default function HowItWorksPage() {
  const steps = [
    {
      title: 'Choose your membership',
      description: 'Subscribe monthly or yearly, then move straight into a member experience that stays focused and uncluttered.',
    },
    {
      title: 'Set your charity preference',
      description: 'Choose the cause you care about and define the contribution baseline that turns every month into visible impact.',
    },
    {
      title: 'Log your latest five scores',
      description: 'The score flow stays lightweight, mobile-friendly, and structured around the PRD rule set.',
    },
    {
      title: 'Follow the monthly draw',
      description: 'Track simulation, published outcomes, prize tiers, and eligibility without having to decode the mechanics yourself.',
    },
    {
      title: 'Claim winnings when eligible',
      description: 'If you win, the verification and payout states should feel transparent rather than intimidating.',
    },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="gradient-mesh pt-28 pb-20">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Product flow</span>
            <h1 className="headline-balance mt-5 text-5xl font-bold sm:text-6xl">Five clear steps, one generous experience.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#b8b3c1]">
              This page now explains the platform in the order the PRD expects: what users do, how rewards work, and
              where the charitable value appears.
            </p>
          </div>

          <div className="mt-14 space-y-5">
            {steps.map((step, index) => (
              <Card key={step.title} glass className="overflow-hidden">
                <CardContent className="grid gap-6 p-6 md:grid-cols-[80px_1fr] md:p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-primary text-lg font-display font-bold text-background">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">{step.title}</h2>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-[#bbb5c3]">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
