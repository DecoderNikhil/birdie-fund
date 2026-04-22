'use client'

import { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'
import { CharitySelector } from '@/components/charity/CharitySelector'
import { formatCurrency } from '@/lib/utils'

interface SelectedCharity {
  id: string
  charity_id: string
  contribution_percentage: number
  name: string
  logo_url: string | null
}

export default function CharityPage() {
  const [selected, setSelected] = useState<SelectedCharity | null>(null)
  const [percentage, setPercentage] = useState(10)
  const [showSelector, setShowSelector] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSelect = async (charityId: string) => {
    setSaving(true)
    try {
      const token = localStorage.getItem('auth-token')
      const res = await fetch('/api/charities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ charityId, contributionPercentage: percentage }),
      })

      if (res.ok) {
        setShowSelector(false)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">My Charity</h1>
        <p className="text-gray-400 mt-2">Choose a charity to support</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Supported Charity</CardTitle>
        </CardHeader>
        <CardContent>
          {selected ? (
            <div className="flex items-center gap-4">
              {selected.logo_url && (
                <img src={selected.logo_url} alt={selected.name} className="w-16 h-16 rounded-lg" />
              )}
              <div>
                <h3 className="font-display font-bold text-lg">{selected.name}</h3>
                <p className="text-gray-400">{selected.contribution_percentage}% of winnings</p>
              </div>
            </div>
          ) : showSelector ? (
            <CharitySelector onSelect={handleSelect} />
          ) : (
            <p className="text-gray-400">No charity selected yet</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => setShowSelector(!showSelector)}>
            {selected ? 'Change Charity' : 'Select a Charity'}
          </Button>
        </CardFooter>
      </Card>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>Contribution Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>10%</span>
              <span className="text-primary font-bold">{percentage}%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}