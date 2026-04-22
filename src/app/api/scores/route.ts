import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/client'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)

    const result = await sql`
      SELECT id, score, score_date, created_at
      FROM scores
      WHERE user_id = ${decoded.userId}
      ORDER BY score_date DESC
      LIMIT 5
    `

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const { score, scoreDate } = await req.json()

    if (!score || score < 1 || score > 45) {
      return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
    }

    if (!scoreDate) {
      return NextResponse.json({ error: 'Score date is required' }, { status: 400 })
    }

    const existing = await sql`
      SELECT id FROM scores
      WHERE user_id = ${decoded.userId} AND score_date = ${scoreDate}
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: 'A score for this date already exists' }, { status: 409 })
    }

    const result = await sql`
      INSERT INTO scores (user_id, score, score_date)
      VALUES (${decoded.userId}, ${score}, ${scoreDate})
      RETURNING id, score, score_date, created_at
    `

    const scores = await sql`
      SELECT id, score, score_date, created_at
      FROM scores
      WHERE user_id = ${decoded.userId}
      ORDER BY score_date DESC
      LIMIT 5
    `

    return NextResponse.json(scores)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const { scoreId, score, scoreDate } = await req.json()

    const existing = await sql`
      SELECT id FROM scores
      WHERE id = ${scoreId} AND user_id = ${decoded.userId}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Score not found' }, { status: 404 })
    }

    if (scoreDate) {
      const duplicate = await sql`
        SELECT id FROM scores
        WHERE user_id = ${decoded.userId} AND score_date = ${scoreDate} AND id != ${scoreId}
      `

      if (duplicate.length > 0) {
        return NextResponse.json({ error: 'A score for this date already exists' }, { status: 409 })
      }
    }

    await sql`
      UPDATE scores
      SET score = ${score}, score_date = ${scoreDate}, updated_at = NOW()
      WHERE id = ${scoreId}
    `

    const scores = await sql`
      SELECT id, score, score_date, created_at
      FROM scores
      WHERE user_id = ${decoded.userId}
      ORDER BY score_date DESC
      LIMIT 5
    `

    return NextResponse.json(scores)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const { searchParams } = new URL(req.url)
    const scoreId = searchParams.get('id')

    if (!scoreId) {
      return NextResponse.json({ error: 'Score ID is required' }, { status: 400 })
    }

    const existing = await sql`
      SELECT id FROM scores
      WHERE id = ${scoreId} AND user_id = ${decoded.userId}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Score not found' }, { status: 404 })
    }

    await sql`DELETE FROM scores WHERE id = ${scoreId}`

    const scores = await sql`
      SELECT id, score, score_date, created_at
      FROM scores
      WHERE user_id = ${decoded.userId}
      ORDER BY score_date DESC
      LIMIT 5
    `

    return NextResponse.json(scores)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}