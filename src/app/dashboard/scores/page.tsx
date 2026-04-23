'use client'

import { useCallback, useEffect, useState } from 'react'
import { ScoreEntryForm } from '@/components/scores/ScoreEntryForm'
import { ScoreHistory } from '@/components/scores/ScoreHistory'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

interface Score {
  id: string
  score: number
  score_date: string
  created_at: string
}

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)

  const fetchScores = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth-token')

      if (!token) {
        setScores([])
        return
      }

      const res = await fetch('/api/scores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (res.ok) {
        setScores(data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchScores()
  }, [fetchScores])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">My Scores</h1>
        <p className="text-gray-400 mt-2">Track your golf scores for the monthly draw</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enter Score</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreEntryForm onSuccess={fetchScores} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreHistory scores={scores} onRefetch={fetchScores} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
