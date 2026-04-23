import { useEffect, useState } from 'react'
import type { Subscription } from '@/types'

interface UseSubscriptionData {
  subscription: Subscription | null
  loading: boolean
  isActive: boolean
}

export function useSubscription(userId?: string): UseSubscriptionData {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setSubscription(null)
      setLoading(false)
      return
    }

    setLoading(false)
  }, [userId])

  return {
    subscription,
    loading,
    isActive: subscription?.status === 'active',
  }
}
