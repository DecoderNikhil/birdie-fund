'use client'

import { useEffect, useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'
import { CharitySelector } from '@/components/charity/CharitySelector'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSelection = async () => {
      try {
        const token = localStorage.getItem('auth-token')

        if (!token) {
          setLoading(false)
          return
        }

        const res = await fetch('/api/charities?selected=mine', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (res.ok && data) {
          setSelected(data)
          setPercentage(data.contribution_percentage)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load charity selection')
      } finally {
        setLoading(false)
      }
    }

    loadSelection()
  }, [])

  const handleSelect = async (charityId: string) => {
    setSaving(true)
    setError('')

    try {
      const token = localStorage.getItem('auth-token')
      const res = await fetch('/api/charities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ charityId, contributionPercentage: percentage }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save charity selection')
      }

      setSelected(data)
      setPercentage(data.contribution_percentage)
      setShowSelector(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save charity selection')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">My Charity</h1>
        <p className="text-gray-400 mt-2">Choose a charity to support</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Supported Charity</CardTitle>
        </CardHeader>
        <CardContent>
          {selected ? (
            <div className="flex items-center gap-4">
              {selected.logo_url && (
                <img src={selected.logo_url} alt={selected.name} className="h-16 w-16 rounded-lg" />
              )}
              <div>
                <h3 className="text-lg font-display font-bold">{selected.name}</h3>
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
          <Button onClick={() => setShowSelector(!showSelector)} disabled={saving}>
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
              onChange={(e) => setPercentage(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-400">
              <span>10%</span>
              <span className="font-bold text-primary">{percentage}%</span>
              <span>100%</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSelect(selected.charity_id)} disabled={saving}>
              {saving ? 'Saving...' : 'Save Percentage'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
