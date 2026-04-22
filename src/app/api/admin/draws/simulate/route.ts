import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/client'
import { verifyToken, getUserById } from '@/lib/auth'
import { runRandomDraw, runAlgorithmicDraw, countMatches, calculatePrizePool } from '@/lib/draw/engine'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const user = await getUserById(decoded.userId)

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { drawId, drawType } = await req.json()

    if (!drawId) {
      return NextResponse.json({ error: 'Draw ID is required' }, { status: 400 })
    }

    const drawResult = await sql`
      SELECT * FROM draws WHERE id = ${drawId}
    `

    if (drawResult.length === 0) {
      return NextResponse.json({ error: 'Draw not found' }, { status: 404 })
    }

    const draw = drawResult[0]

    if (draw.status !== 'pending') {
      return NextResponse.json({ error: 'Draw already simulated or published' }, { status: 400 })
    }

    const subscriberResult = await sql`
      SELECT s.user_id FROM subscriptions s WHERE s.status = 'active'
    `
    const subscriberCount = subscriberResult.length

    const scoresResult = await sql`
      SELECT user_id, array_agg(score ORDER BY score_date DESC) as scores
      FROM scores
      WHERE user_id IN (SELECT user_id FROM subscriptions WHERE status = 'active')
      GROUP BY user_id
      HAVING count(*) >= 3
    `

    let drawnNumbers: number[]
    if (drawType === 'algorithmic') {
      const allScores = await sql`SELECT score FROM scores`
      drawnNumbers = runAlgorithmicDraw(allScores as any)
    } else {
      drawnNumbers = runRandomDraw()
    }

    let match5Count = 0
    let match4Count = 0
    let match3Count = 0

    for (const sub of scoresResult) {
      const userScores = sub.scores.slice(0, 5)
      const matchCount = countMatches(userScores, drawnNumbers)

      if (matchCount >= 5) match5Count++
      else if (matchCount >= 4) match4Count++
      else if (matchCount >= 3) match3Count++
    }

    const pool = calculatePrizePool(subscriberCount, draw.jackpot_rolled_over ? draw.jackpot_amount : 0)

    await sql`
      UPDATE draws SET
        drawn_numbers = ${drawnNumbers},
        draw_type = ${drawType},
        status = 'simulated',
        jackpot_amount = ${pool.jackpot},
        pool_4match = ${pool.match4},
        pool_3match = ${pool.match3},
        total_subscribers = ${subscriberCount},
        updated_at = NOW()
      WHERE id = ${drawId}
    `

    return NextResponse.json({
      drawnNumbers,
      matchCounts: { match5: match5Count, match4: match4Count, match3: match3Count },
      pool,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}