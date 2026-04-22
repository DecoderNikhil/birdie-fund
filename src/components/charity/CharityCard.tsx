'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Card, CardContent } from '@/components/ui'

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
      className={`cursor-pointer transition-all hover:border-primary/50 ${selected ? 'border-primary' : ''}`}
      onClick={() => onSelect?.(charity.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {charity.logo_url && (
            <img src={charity.logo_url} alt={charity.name} className="w-12 h-12 rounded-lg object-cover" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold">{charity.name}</h3>
              {charity.is_featured && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                  Featured
                </span>
              )}
            </div>
            {charity.description && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{charity.description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}