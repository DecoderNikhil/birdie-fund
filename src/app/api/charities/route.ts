import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('active') !== 'false'
    
    const result = await sql`
      SELECT * FROM charities
      WHERE ${activeOnly ? sql`is_active = true` : sql`1=1`}
      ORDER BY is_featured DESC, name ASC
    `

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}