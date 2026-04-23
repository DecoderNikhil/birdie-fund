'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/components/ui'

export default function SubscribePage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan)
    setLoading(true)

    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/login?redirect=/subscribe')
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const plans = [
    {
      id: 'monthly' as const,
      name: 'Monthly',
      price: '£9.99',
      cadence: '/month',
      badge: 'Flexible',
      points: [
        'Enter your latest scores each month',
        'Join the monthly draw automatically',
        'Support a charity from the moment you subscribe',
      ],
    },
    {
      id: 'yearly' as const,
      name: 'Yearly',
      price: '£89.99',
      cadence: '/year',
      badge: 'Best value',
      points: [
        'All monthly benefits included',
        'Lower annual cost with stronger retention',
        'A cleaner path for committed members',
      ],
    },
  ]

  return (
    <main className="gradient-mesh pt-28 pb-20">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Membership</span>
          <h1 className="headline-balance mt-5 text-5xl font-bold sm:text-6xl">Choose the membership rhythm that fits you.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#b8b3c1]">
            The subscription flow should feel persuasive and calm: clear value, visible impact, and a smooth next step
            into the product.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                glass
                className={`relative overflow-hidden ${plan.id === 'yearly' ? 'border-secondary/30' : 'border-primary/20'}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-3xl">{plan.name}</CardTitle>
                    <Badge variant={plan.id === 'yearly' ? 'warning' : 'success'}>{plan.badge}</Badge>
                  </div>
                  <CardDescription>Built for members who want a clear, recurring rhythm.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-5xl font-display font-bold">
                    {plan.price}
                    <span className="ml-2 text-base font-body font-medium text-[#9f99ab]">{plan.cadence}</span>
                  </div>

                  <div className="space-y-3">
                    {plan.points.map((point) => (
                      <div key={point} className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-[#c7c2cf]">
                        {point}
                      </div>
                    ))}
                  </div>

                  <Button onClick={() => handleSubscribe(plan.id)} disabled={loading} className="w-full" size="lg">
                    {selectedPlan === plan.id && loading ? 'Preparing checkout...' : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-strong h-fit">
            <CardHeader>
              <span className="eyebrow">What happens next</span>
              <CardTitle className="mt-3 text-3xl">A smoother onboarding path</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm leading-7 text-[#b9b4c1]">
              <p>1. Create or access your account.</p>
              <p>2. Complete secure checkout.</p>
              <p>3. Pick the charity you want to support.</p>
              <p>4. Start logging your latest five scores.</p>
              <p>5. Track upcoming draws, rewards, and impact from one dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
