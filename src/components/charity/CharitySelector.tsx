'use client'

import { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { CharityCard } from './CharityCard'

interface Charity {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
}

interface CharitySelectorProps {
  onSelect: (charityId: string) => void
}

export function CharitySelector({ onSelect }: CharitySelectorProps) {
  const [charities, setCharities] = useState<Charity[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/charities')
      .then(res => res.json())
      .then(data => setCharities(data))
      .finally(() => setLoading(false))
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