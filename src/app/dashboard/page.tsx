'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'

interface DashboardStats {
  subscription?: { plan: string; status: string; current_period_end: string | null }
  scores: { score: number; score_date: string }[]
  charity?: { name: string; contribution_percentage: number }
  winnings?: { prize_amount: number; verification_status: string }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({ scores: [] })
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

  const handleSignOut = () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div className="min-h-screen gradient-mesh p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Welcome{user?.fullName ? `, ${user.fullName}` : ''}!
            </h1>
            <p className="text-gray-400 mt-1">Here's your dashboard</p>
          </div>
          <Button onClick={handleSignOut} variant="ghost">Sign Out</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/scores">
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="text-3xl font-display font-bold text-primary">
                  {stats.scores.length}
                </div>
                <p className="text-gray-400 mt-1">Scores Entered</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/charity">
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="text-xl font-display font-bold">
                  {stats.charity?.name || 'Select a Charity'}
                </div>
                <p className="text-gray-400 mt-1">
                  {stats.charity?.contribution_percentage || 10}% contribution
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/draws">
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="text-3xl font-display font-bold text-secondary">
                  {new Date().getMonth() + 1}/{new Date().getFullYear()}
                </div>
                <p className="text-gray-400 mt-1">Next Draw</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/winnings">
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="text-3xl font-display font-bold">
                  £{(stats.winnings || []).reduce((sum, w) => sum + w.prize_amount, 0).toFixed(2)}
                </div>
                <p className="text-gray-400 mt-1">Total Winnings</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.subscription ? (
                <div>
                  <Badge variant={stats.subscription.status === 'active' ? 'success' : 'warning'}>
                    {stats.subscription.status}
                  </Badge>
                  <p className="text-gray-400 mt-2 capitalize">{stats.subscription.plan} plan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400">No active subscription</p>
                  <Link href="/subscribe">
                    <Button>Subscribe Now</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Scores</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.scores.length > 0 ? (
                <div className="space-y-2">
                  {stats.scores.slice(0, 3).map((s: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <Badge>{s.score}</Badge>
                      <span className="text-sm text-gray-400">{s.score_date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No scores yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}