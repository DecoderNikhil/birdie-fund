'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui'
import { CharityCard } from './CharityCard'

interface Charity {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  is_featured: boolean
}

interface CharitySelectorProps {
  onSelect: (charityId: string) => void
}

export function CharitySelector({ onSelect }: CharitySelectorProps) {
  const [charities, setCharities] = useState<Charity[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCharities = async () => {
      try {
        setError('')

        const res = await fetch('/api/charities')
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load charities')
        }

        if (!Array.isArray(data)) {
          throw new Error('Invalid charities response')
        }

        setCharities(data)
      } catch (err: any) {
        setCharities([])
        setError(err.message || 'Failed to load charities')
      } finally {
        setLoading(false)
      }
    }

    loadCharities()
  }, [])

  const filtered = charities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search charities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No charities found</p>
        ) : (
          filtered.map(charity => (
            <CharityCard
              key={charity.id}
              charity={charity}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  )
}
