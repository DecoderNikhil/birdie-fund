'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Winner {
  id: string
  match_type: string
  prize_amount: number
  verification_status: string
  payment_status: string
  created_at: string
}

export default function WinningsPage() {
  const [winnings, setWinnings] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleUploadProof = async (winnerId: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      console.log('Upload proof for', winnerId, file)
    }
    input.click()
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">My Winnings</h1>
        <p className="text-gray-400 mt-2">Track your prize claims</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Winnings History</CardTitle>
        </CardHeader>
        <CardContent>
          {winnings.length === 0 ? (
            <p className="text-gray-400">No winnings yet</p>
          ) : (
            <div className="space-y-4">
              {winnings.map((win) => (
                <div key={win.id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium capitalize">{win.match_type}</p>
                    <p className="text-sm text-gray-400">{formatDate(win.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatCurrency(win.prize_amount)}</p>
                    <div className="flex gap-2 mt-2 justify-end">
                      <Badge variant={
                        win.verification_status === 'approved' ? 'success' :
                        win.verification_status === 'rejected' ? 'error' :
                        win.verification_status === 'submitted' ? 'warning' :
                        'default'
                      }>
                        {win.verification_status}
                      </Badge>
                      <Badge variant={win.payment_status === 'paid' ? 'success' : 'default'}>
                        {win.payment_status}
                      </Badge>
                    </div>
                    {win.verification_status === 'pending' && (
                      <Button size="sm" className="mt-2" onClick={() => handleUploadProof(win.id)}>
                        Upload Proof
                      </Button>
                    )}
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