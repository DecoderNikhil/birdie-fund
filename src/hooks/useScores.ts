import { useEffect, useState, useCallback } from 'react'
import { sql } from '@/lib/db/client'
import type { Score } from '@/types'

interface UseScoresData {
  scores: Score[]
  loading: boolean
  refetch: () => Promise<void>
  addScore: (score: number, scoreDate: string) => Promise<void>
  updateScore: (scoreId: string, score: number, scoreDate: string) => Promise<void>
  deleteScore: (scoreId: string) => Promise<void>
}

export function useScores(userId?: string): UseScoresData {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)

  const fetchScores = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      const result = await sql`
        SELECT id, score, score_date, created_at
        FROM scores
        WHERE user_id = ${userId}
        ORDER BY score_date DESC
        LIMIT 5
      `
      setScores(result as any)
    } catch (error) {
      console.error('Error fetching scores:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchScores()
  }, [fetchScores])

  const addScore = async (score: number, scoreDate: string) => {
    const token = localStorage.getItem('auth-token')
    await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ score, scoreDate }),
    })
    await fetchScores()
  }

  const updateScore = async (scoreId: string, score: number, scoreDate: string) => {
    const token = localStorage.getItem('auth-token')
    await fetch('/api/scores', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ scoreId, score, scoreDate }),
    })
    await fetchScores()
  }

  const deleteScore = async (scoreId: string) => {
    const token = localStorage.getItem('auth-token')
    await fetch(`/api/scores?id=${scoreId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    await fetchScores()
  }

  return {
    scores,
    loading,
    refetch: fetchScores,
    addScore,
    updateScore,
    deleteScore,
  }
}