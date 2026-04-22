'use client'

import { useState } from 'react'
import { Button, Input, Label } from '@/components/ui'

interface ScoreEntryFormProps {
  onSuccess: () => void
}

export function ScoreEntryForm({ onSuccess }: ScoreEntryFormProps) {
  const [score, setScore] = useState('')
  const [scoreDate, setScoreDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!score || parseInt(score) < 1 || parseInt(score) > 45) {
      setError('Score must be between 1 and 45')
      return
    }

    if (!scoreDate) {
      setError('Date is required')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('auth-token')
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: parseInt(score),
          scoreDate,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add score')
      }

      setScore('')
      setScoreDate('')
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}
      <div>
        <Label htmlFor="score">Score (1-45)</Label>
        <Input
          id="score"
          type="number"
          min="1"
          max="45"
          placeholder="Enter your score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="scoreDate">Date</Label>
        <Input
          id="scoreDate"
          type="date"
          max={today}
          value={scoreDate}
          onChange={(e) => setScoreDate(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding...' : 'Add Score'}
      </Button>
    </form>
  )
}