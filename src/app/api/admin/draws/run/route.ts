import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/client'
import { verifyToken, getUserById } from '@/lib/auth'
import { countMatches, getMatchType, calculatePrizePerWinner } from '@/lib/draw/engine'
import { sendEmail, getWinnerEmailHtml } from '@/lib/email'

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

    const { drawId } = await req.json()

    if (!drawId) {
      return NextResponse.json({ error: 'Draw ID is required' }, { status: 400 })
    }

    const drawResult = await sql`SELECT * FROM draws WHERE id = ${drawId}`
    
    if (drawResult.length === 0) {
      return NextResponse.json({ error: 'Draw not found' }, { status: 404 })
    }

    const draw = drawResult[0]

    if (draw.status !== 'simulated') {
      return NextResponse.json({ error: 'Draw must be simulated before publishing' }, { status: 400 })
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

    const winners: any[] = []

    for (const sub of scoresResult) {
      const userScores = sub.scores.slice(0, 5)
      const matchCount = countMatches(userScores, draw.drawn_numbers)
      const isWinner = matchCount >= 3

      await sql`
        INSERT INTO draw_entries (draw_id, user_id, scores_snapshot, match_count, is_winner)
        VALUES (${drawId}, ${sub.user_id}, ${userScores}, ${matchCount}, ${isWinner})
        ON CONFLICT (draw_id, user_id) DO UPDATE SET
          match_count = ${matchCount},
          is_winner = ${isWinner}
      `

      if (isWinner) {
        const matchType = getMatchType(matchCount)
        const poolAmount = matchType === '5-match' ? draw.jackpot_amount 
          : matchType === '4-match' ? draw.pool_4match 
          : draw.pool_3match

        let prizeAmount = 0
        if (matchType === '5-match') {
          prizeAmount = poolAmount
        } else {
          const winnersInTier = await sql`
            SELECT count(*) as cnt FROM draw_entries de
            JOIN scores s ON de.user_id = s.user_id
            WHERE de.draw_id = ${drawId} AND ${matchType === '4-match' ? sql`de.match_count = 4` : sql`de.match_count = 3`}
          `
          prizeAmount = calculatePrizePerWinner(poolAmount, winnersInTier[0]?.cnt || 1)
        }

        await sql`
          INSERT INTO winners (draw_id, user_id, match_type, prize_amount)
          VALUES (${drawId}, ${sub.user_id}, ${matchType}, ${prizeAmount})
        `

        winners.push({ userId: sub.user_id, matchType, prizeAmount })
      }
    }

    const hasJackpotWinner = winners.some(w => w.matchType === '5-match')

    await sql`
      UPDATE draws SET
        status = 'published',
        jackpot_rolled_over = ${!hasJackpotWinner},
        published_at = NOW(),
        updated_at = NOW()
      WHERE id = ${drawId}
    `

    for (const winner of winners) {
      const userResult = await sql`SELECT email, full_name FROM profiles WHERE id = ${winner.userId}`
      if (userResult.length > 0) {
        const u = userResult[0]
        try {
          await sendEmail({
            to: u.email,
            subject: '🎉 Congratulations! You won!',
            html: getWinnerEmailHtml(u.full_name || 'Player', winner.prizeAmount, winner.matchType),
          })
        } catch (e) {
          console.error('Failed to send winner email:', e)
        }
      }
    }

    return NextResponse.json({ success: true, winnerCount: winners.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}