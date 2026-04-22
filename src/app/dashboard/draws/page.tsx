'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { formatDate, formatCurrency } from '@/lib/utils'

interface DrawEntry {
  draw_id: string
  scores_snapshot: number[]
  match_count: number
  is_winner: boolean
  created_at: string
}

export default function UserDrawsPage() {
  const [entries, setEntries] = useState<DrawEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">My Draws</h1>
        <p className="text-gray-400 mt-2">Your draw history and results</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Draw History</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-gray-400">No draws entered yet</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.draw_id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium">Draw {entry.draw_id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-400">{formatDate(entry.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{entry.match_count} matches</p>
                    {entry.is_winner && <Badge variant="success">Winner!</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}