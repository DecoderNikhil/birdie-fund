import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/client'
import { verifyToken } from '@/lib/auth'

function getBearerToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  return authHeader?.replace('Bearer ', '') || req.cookies.get('auth-token')?.value
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const selected = searchParams.get('selected')

    if (selected === 'mine') {
      const token = getBearerToken(req)

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const decoded = verifyToken(token)
      const result = await sql`
        SELECT
          ucs.id,
          ucs.user_id,
          ucs.charity_id,
          ucs.contribution_percentage,
          ucs.updated_at,
          c.name,
          c.logo_url
        FROM user_charity_selections ucs
        JOIN charities c ON c.id = ucs.charity_id
        WHERE ucs.user_id = ${decoded.userId}
      `

      return NextResponse.json(result.rows[0] || null)
    }

    const activeOnly = searchParams.get('active') !== 'false'
    const result = activeOnly
      ? await sql`
          SELECT *
          FROM charities
          WHERE is_active = true
          ORDER BY is_featured DESC, name ASC
        `
      : await sql`
          SELECT *
          FROM charities
          ORDER BY is_featured DESC, name ASC
        `

    return NextResponse.json(result.rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getBearerToken(req)

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const { charityId, contributionPercentage } = await req.json()

    if (!charityId) {
      return NextResponse.json({ error: 'Charity ID is required' }, { status: 400 })
    }

    const percentage = Number(contributionPercentage ?? 10)

    if (!Number.isInteger(percentage) || percentage < 10 || percentage > 100) {
      return NextResponse.json(
        { error: 'Contribution percentage must be between 10 and 100' },
        { status: 400 }
      )
    }

    const charityResult = await sql`
      SELECT id, name, logo_url
      FROM charities
      WHERE id = ${charityId} AND is_active = true
    `

    if (charityResult.rows.length === 0) {
      return NextResponse.json({ error: 'Charity not found' }, { status: 404 })
    }

    await sql`
      INSERT INTO user_charity_selections (user_id, charity_id, contribution_percentage)
      VALUES (${decoded.userId}, ${charityId}, ${percentage})
      ON CONFLICT (user_id) DO UPDATE SET
        charity_id = EXCLUDED.charity_id,
        contribution_percentage = EXCLUDED.contribution_percentage,
        updated_at = NOW()
    `

    const selectionResult = await sql`
      SELECT
        ucs.id,
        ucs.user_id,
        ucs.charity_id,
        ucs.contribution_percentage,
        ucs.updated_at,
        c.name,
        c.logo_url
      FROM user_charity_selections ucs
      JOIN charities c ON c.id = ucs.charity_id
      WHERE ucs.user_id = ${decoded.userId}
    `

    return NextResponse.json(selectionResult.rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
