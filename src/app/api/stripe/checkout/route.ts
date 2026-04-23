import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/client'
import { verifyToken, getUserById } from '@/lib/auth'
import { createCustomer, createCheckoutSession } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const user = await getUserById(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { plan } = await req.json()

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const subResult = await sql`
      SELECT stripe_customer_id FROM subscriptions WHERE user_id = ${decodeURIComponent(decoded.userId)}
    `
    let customerId = subResult.rows[0]?.stripe_customer_id

    if (!customerId) {
      const customer = await createCustomer(user.email, decoded.userId)
      customerId = customer.id
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await createCheckoutSession(
      customerId,
      plan,
      decoded.userId,
      `${appUrl}/dashboard?subscribed=true`,
      `${appUrl}/subscribe`
    )

    return NextResponse.json({ sessionUrl: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}