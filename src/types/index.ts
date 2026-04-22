export type UserRole = 'subscriber' | 'admin'
export type SubscriptionPlan = 'monthly' | 'yearly'
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'lapsed'
export type DrawType = 'random' | 'algorithmic'
export type DrawStatus = 'pending' | 'simulated' | 'published'
export type MatchType = '5-match' | '4-match' | '3-match'
export type VerificationStatus = 'pending' | 'submitted' | 'approved' | 'rejected'
export type PaymentStatus = 'pending' | 'paid'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: Date
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface Score {
  id: string
  user_id: string
  score: number
  score_date: string
  created_at: string
  updated_at: string
}

export interface Charity {
  id: string
  name: string
  slug: string
  description: string | null
  long_description: string | null
  logo_url: string | null
  banner_url: string | null
  website_url: string | null
  is_active: boolean
  is_featured: boolean
  events?: CharityEvent[]
  created_at: string
  updated_at: string
}

export interface CharityEvent {
  id: string
  charity_id: string
  title: string
  event_date: string
  description: string | null
  created_at: string
}

export interface UserCharitySelection {
  id: string
  user_id: string
  charity_id: string
  contribution_percentage: number
  charity?: Charity
  updated_at: string
}

export interface Draw {
  id: string
  month: number
  year: number
  draw_type: DrawType
  drawn_numbers: number[]
  status: DrawStatus
  jackpot_amount: number
  pool_4match: number
  pool_3match: number
  total_subscribers: number
  jackpot_rolled_over: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface DrawEntry {
  id: string
  draw_id: string
  user_id: string
  scores_snapshot: number[]
  match_count: number
  is_winner: boolean
  created_at: string
}

export interface Winner {
  id: string
  draw_id: string
  user_id: string
  match_type: MatchType
  prize_amount: number
  verification_status: VerificationStatus
  proof_url: string | null
  payment_status: PaymentStatus
  paid_at: string | null
  created_at: string
  updated_at: string
  profile?: Profile
  draw?: Draw
}

export interface PrizePoolBreakdown {
  jackpot: number
  match4: number
  match3: number
  totalPool: number
}