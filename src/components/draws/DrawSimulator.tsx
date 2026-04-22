'use client'

import { useState } from 'react'
import { Button, Badge } from '@/components/ui'

interface DrawSimulatorProps {
  drawId: string
  onSimulate: (drawType: 'random' | 'algorithmic') => Promise<void>
}

export function DrawSimulator({ drawId, onSimulate }: DrawSimulatorProps) {
  const [drawType, setDrawType] = useState<'random' | 'algorithmic'>('random')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSimulate = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('auth-token')
      const res = await fetch('/api/admin/draws/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ drawId, drawType }),
      })

      const data = await res.json()
      if (res.ok) {
        setResult(data)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={drawType === 'random' ? 'primary' : 'outline'}
          onClick={() => setDrawType('random')}
        >
          Random Draw
        </Button>
        <Button
          variant={drawType === 'algorithmic' ? 'primary' : 'outline'}
          onClick={() => setDrawType('algorithmic')}
        >
          Algorithmic Draw
        </Button>
      </div>

      <Button onClick={handleSimulate} disabled={loading} className="w-full">
        {loading ? 'Running Simulation...' : 'Run Simulation'}
      </Button>

      {result && (
        <div className="space-y-4 p-4 rounded-lg bg-muted">
          <div className="flex gap-2">
            {result.drawnNumbers.map((n: number) => (
              <div key={n} className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-background font-bold">
                {n}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Badge variant="success">{result.matchCounts.match5}</Badge>
              <p className="text-sm text-gray-400 mt-1">5-match</p>
            </div>
            <div>
              <Badge variant="warning">{result.matchCounts.match4}</Badge>
              <p className="text-sm text-gray-400 mt-1">4-match</p>
            </div>
            <div>
              <Badge>{result.matchCounts.match3}</Badge>
              <p className="text-sm text-gray-400 mt-1">3-match</p>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <p>Jackpot: £{result.pool.jackpot}</p>
            <p>4-match pool: £{result.pool.match4}</p>
            <p>3-match pool: £{result.pool.match3}</p>
          </div>
        </div>
      )}
    </div>
  )
}