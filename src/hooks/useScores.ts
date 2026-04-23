import { useEffect, useState, useCallback } from 'react'
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
      setScores([])
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('auth-token')
      const res = await fetch('/api/scores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch scores')
      }

      setScores(data)
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
    const res = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ score, scoreDate }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to add score')
    }

    await fetchScores()
  }

  const updateScore = async (scoreId: string, score: number, scoreDate: string) => {
    const token = localStorage.getItem('auth-token')
    const res = await fetch('/api/scores', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ scoreId, score, scoreDate }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to update score')
    }

    await fetchScores()
  }

  const deleteScore = async (scoreId: string) => {
    const token = localStorage.getItem('auth-token')
    const res = await fetch(`/api/scores?id=${scoreId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to delete score')
    }

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
