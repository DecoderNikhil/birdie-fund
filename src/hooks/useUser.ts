import { useEffect, useState } from 'react'
import type { Profile } from '@/types'

interface UserData {
  user: Profile | null
  loading: boolean
}

export function useUser(): UserData {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      setLoading(false)
      return
    }

    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    setLoading(false)
  }, [])

  return { user, loading }
}
