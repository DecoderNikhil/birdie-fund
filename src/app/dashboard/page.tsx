'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, CardDescription } from '@/components/ui'

interface DashboardStats {
  subscription?: { plan: string; status: string; current_period_end: string | null }
  scores: { score: number; score_date: string }[]
  charity?: { name: string; contribution_percentage: number }
  winnings?: { prize_amount: number; verification_status: string }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats] = useState<DashboardStats>({ scores: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    const userData = localStorage.getItem('user')

    if (!token) {
      router.push('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  const totalWinnings = (stats.winnings || []).reduce((sum, w) => sum + w.prize_amount, 0)

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass-strong overflow-hidden">
          <CardContent className="space-y-6 p-8">
            <span className="eyebrow">Member overview</span>
            <div className="space-y-3">
              <h1 className="headline-balance text-4xl font-bold sm:text-5xl">
                Welcome back{user?.fullName ? `, ${user.fullName}` : ''}.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#b8b3c1]">
                This dashboard should feel like a calm control room: what to do next, what you have entered, and how
                your membership is performing this month.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/scores">
                <Button>Enter Scores</Button>
              </Link>
              <Link href="/dashboard/charity">
                <Button variant="outline">Update Charity</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Membership status</CardTitle>
            <CardDescription>Visible renewal and subscription state belongs in the first screen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.subscription ? (
              <>
                <Badge variant={stats.subscription.status === 'active' ? 'success' : 'warning'}>
                  {stats.subscription.status}
                </Badge>
                <div className="text-2xl font-display font-bold capitalize">{stats.subscription.plan} plan</div>
              </>
            ) : (
              <>
                <div className="text-lg text-[#cec9d6]">No active subscription</div>
                <Link href="/subscribe">
                  <Button>Choose Membership</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { href: '/dashboard/scores', value: String(stats.scores.length), label: 'Scores entered', tone: 'text-primary' },
          { href: '/dashboard/charity', value: stats.charity?.name || 'Choose one', label: 'Selected charity', tone: 'text-foreground' },
          { href: '/dashboard/draws', value: `${new Date().toLocaleString('en-GB', { month: 'short' })} ${new Date().getFullYear()}`, label: 'Current draw window', tone: 'text-secondary' },
          { href: '/dashboard/winnings', value: `£${totalWinnings.toFixed(2)}`, label: 'Total winnings', tone: 'text-foreground' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition-colors hover:border-primary/30">
              <CardContent className="space-y-3 p-6">
                <div className={`text-2xl font-display font-bold ${item.tone}`}>{item.value}</div>
                <div className="text-sm text-[#a7a2af]">{item.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent scores</CardTitle>
            <CardDescription>Reverse chronological and easy to scan, as required by the PRD.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.scores.length > 0 ? (
              <div className="space-y-3">
                {stats.scores.slice(0, 3).map((score, index) => (
                  <div key={index} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <Badge>{String(score.score)}</Badge>
                    <span className="text-sm text-[#b3afbc]">{score.score_date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#aaa5b2]">No scores entered yet. Add your latest round to stay ready for the next draw.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What to do next</CardTitle>
            <CardDescription>Reduce friction by surfacing the next useful actions instead of only stats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Add or update your latest five scores',
              'Review your chosen charity and contribution percentage',
              'Check draw participation and winning status',
            ].map((task) => (
              <div key={task} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#c9c5d0]">
                {task}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
