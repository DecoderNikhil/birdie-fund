'use client'

import { useState } from 'react'
import { Button, Input, Badge } from '@/components/ui'
import { formatDate, getDaysAgo } from '@/lib/utils'

interface Score {
  id: string
  score: number
  score_date: string
  created_at: string
}

interface ScoreHistoryProps {
  scores: Score[]
  onRefetch: () => void
}

export function ScoreHistory({ scores, onRefetch }: ScoreHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editScore, setEditScore] = useState('')
  const [editDate, setEditDate] = useState('')

  const handleEdit = (score: Score) => {
    setEditingId(score.id)
    setEditScore(score.score.toString())
    setEditDate(score.score_date)
  }

  const handleSave = async (id: string) => {
    const token = localStorage.getItem('auth-token')
    await fetch('/api/scores', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        scoreId: id,
        score: parseInt(editScore),
        scoreDate: editDate,
      }),
    })
    setEditingId(null)
    onRefetch()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score?')) return
    
    const token = localStorage.getItem('auth-token')
    await fetch(`/api/scores?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    onRefetch()
  }

  if (scores.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No scores yet</p>
        <p className="text-sm mt-2">Enter your first score to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-400 mb-4">{scores.length} of 5 scores entered</p>
      {scores.map((score) => (
        <div
          key={score.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted"
        >
          {editingId === score.id ? (
            <div className="flex gap-2 w-full">
              <Input
                type="number"
                min="1"
                max="45"
                value={editScore}
                onChange={(e) => setEditScore(e.target.value)}
                className="w-20"
              />
              <Input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
              <Button onClick={() => handleSave(score.id)} size="sm">Save</Button>
              <Button onClick={() => setEditingId(null)} size="sm" variant="ghost">Cancel</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Badge>{score.score}</Badge>
                <span className="text-sm text-gray-300">
                  {formatDate(score.score_date)}
                </span>
                <span className="text-xs text-gray-500">
                  {getDaysAgo(score.created_at)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(score)} size="sm" variant="ghost">Edit</Button>
                <Button onClick={() => handleDelete(score.id)} size="sm" variant="ghost">Delete</Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}