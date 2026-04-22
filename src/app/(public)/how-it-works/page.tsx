import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui'

export default function HowItWorksPage() {
  const steps = [
    {
      title: 'Subscribe',
      description: 'Choose a monthly (£9.99) or yearly (£89.99) plan. Your subscription enters you into the monthly draw.',
    },
    {
      title: 'Enter Scores',
      description: 'Log up to 5 golf scores per month using the Stableford scoring system (1-45 points). Your latest 5 scores count.',
    },
    {
      title: 'Monthly Draw',
      description: 'At the end of each month, 5 random numbers are drawn. Match 3+ numbers to win a prize!',
    },
    {
      title: 'Win Prizes',
      description: 'Jackpot (5-match) wins 40% of the pool, 4-match wins 35%, and 3-match wins 25%. Unclaimed jackpots roll over!',
    },
    {
      title: 'Support Charity',
      description: 'Choose a charity to support. Decide what percentage of your winnings go to your chosen cause.',
    },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-center">How It Works</h1>
          <p className="text-gray-400 text-center mt-2">Get started in 5 simple steps</p>

          <div className="mt-12 space-y-6">
            {steps.map((step, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-background font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold">{step.title}</h2>
                      <p className="text-gray-400 mt-1">{step.description}</p>
                    </div>
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