'use client'

import { Card, CardContent, Button } from '@/components/ui'

interface Charity {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  is_featured: boolean
}

interface CharityCardProps {
  charity: Charity
  onSelect?: (id: string) => void
  selected?: boolean
}

export function CharityCard({ charity, onSelect, selected }: CharityCardProps) {
  return (
    <Card
      className={`group overflow-hidden ${selected ? 'border-primary/40 bg-primary/10' : 'glass'} cursor-pointer`}
      onClick={() => onSelect?.(charity.id)}
    >
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {charity.logo_url ? (
              <img src={charity.logo_url} alt={charity.name} className="h-14 w-14 rounded-2xl object-cover" />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-white/10" />
            )}
            <div>
              <h3 className="text-xl font-display font-bold">{charity.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9994a4]">{charity.slug}</p>
            </div>
          </div>
          {charity.is_featured && (
            <span className="rounded-full border border-secondary/20 bg-secondary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
              Featured
            </span>
          )}
        </div>

        <p className="text-sm leading-7 text-[#b8b3c1]">
          {charity.description || 'Support this organisation through your membership and make your monthly routine count for more.'}
        </p>

        {onSelect && (
          <Button variant={selected ? 'secondary' : 'outline'} className="w-full">
            {selected ? 'Selected' : 'Support This Charity'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
