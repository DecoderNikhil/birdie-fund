'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center gradient-mesh relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-display font-bold animate-fade-up">
          Play Golf.{' '}
          <span className="text-primary">Change Lives.</span>{' '}
          Win Big.
        </h1>
        
        <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
          The monthly golf lottery that makes a difference. 
          Track your scores, win prizes, and support charities — all in one place.
        </p>

        <div className="flex gap-4 justify-center mt-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Link href="/signup">
            <Button size="lg">Subscribe Now</Button>
          </Link>
          <Link href="/how-it-works">
            <Button size="lg" variant="ghost">See How It Works</Button>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    { number: 1, title: 'Subscribe', description: 'Choose a monthly or yearly plan' },
    { number: 2, title: 'Enter Scores', description: 'Log your golf scores each month' },
    { number: 3, title: 'Win & Give', description: 'Get in the monthly draw and support charity' },
  ]

  return (
    <section className="py-24 bg-muted">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-display font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-primary text-background text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-display font-bold mt-4">{step.title}</h3>
              <p className="text-gray-400 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CharitySpotlight() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="border border-primary/30 rounded-xl p-8 md:p-12">
          <span className="text-sm text-primary font-medium">Featured Charity</span>
          <h2 className="text-3xl font-display font-bold mt-2">Make a Difference</h2>
          <p className="text-gray-300 mt-4 max-w-xl">
            Every month, a portion of your winnings goes to a charity of your choice. 
            Pick from our curated list of verified charities and track your impact.
          </p>
          <Link href="/charities">
            <Button className="mt-6">View All Charities</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function PrizeTiers() {
  return (
    <section className="py-24 bg-muted">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-display font-bold text-center mb-12">Prize Tiers</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl bg-background">
            <div className="text-primary text-4xl font-display font-bold">5-Match</div>
            <p className="text-gray-400 mt-2">Jackpot</p>
            <p className="text-2xl font-bold mt-4">40%</p>
            <p className="text-sm text-gray-500">of prize pool</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-background">
            <div className="text-secondary text-4xl font-display font-bold">4-Match</div>
            <p className="text-gray-400 mt-2">Pool</p>
            <p className="text-2xl font-bold mt-4">35%</p>
            <p className="text-sm text-gray-500">of prize pool</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-background">
            <div className="text-gray-300 text-4xl font-display font-bold">3-Match</div>
            <p className="text-gray-400 mt-2">Pool</p>
            <p className="text-2xl font-bold mt-4">25%</p>
            <p className="text-sm text-gray-500">of prize pool</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DrawCountdown() {
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const daysLeft = Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-display font-bold">Next Draw</h2>
        <div className="text-6xl font-display font-bold text-primary mt-6">{daysLeft}</div>
        <p className="text-xl text-gray-400 mt-2">days until {endOfMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        <p className="text-gray-400 mt-4">Enter your scores before the draw to be in with a chance!</p>
      </div>
    </section>
  )
}

export function FinalCTA() {
  return (
    <section className="py-24 bg-primary/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-display font-bold">Ready to play your part?</h2>
        <Link href="/signup">
          <Button size="lg" className="mt-6">Subscribe Now</Button>
        </Link>
      </div>
    </section>
  )
}