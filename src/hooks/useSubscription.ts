import { useEffect, useState } from 'react'
import { sql } from '@/lib/db/client'
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
      setLoading(false)
      return
    }

    const fetchSubscription = async () => {
      try {
        const result = await sql`
          SELECT * FROM subscriptions WHERE user_id = ${userId}
        `
        setSubscription(result[0] || null)
      } catch (error) {
        console.error('Error fetching subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [userId])

  return {
    subscription,
    loading,
    isActive: subscription?.status === 'active',
  }
}