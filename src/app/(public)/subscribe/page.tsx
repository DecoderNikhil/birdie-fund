'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'

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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error: any) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-mesh pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-display font-bold text-center">Subscribe</h1>
        <p className="text-gray-400 text-center mt-2">Choose your plan and start playing</p>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold">£9.99<span className="text-lg font-normal text-gray-400">/month</span></div>
              <ul className="mt-4 space-y-2 text-gray-400">
                <li>✓ Enter scores monthly</li>
                <li>✓ Monthly draw entries</li>
                <li>✓ Win cash prizes</li>
                <li>✓ Support charity</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubscribe('monthly')} disabled={loading} className="w-full">
                {selectedPlan === 'monthly' && loading ? 'Processing...' : 'Subscribe Monthly'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yearly</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold">£89.99<span className="text-lg font-normal text-gray-400">/year</span></div>
              <p className="text-sm text-primary mt-1">Save 25%</p>
              <ul className="mt-4 space-y-2 text-gray-400">
                <li>✓ All monthly benefits</li>
                <li>✓ Priority entries</li>
                <li>✓ Exclusive yearly prize pool</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubscribe('yearly')} disabled={loading} className="w-full">
                {selectedPlan === 'yearly' && loading ? 'Processing...' : 'Subscribe Yearly'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}