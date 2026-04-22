import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/client'
import { verifyToken, getUserById } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('active') !== 'false'
    
    let query = sql`
      SELECT * FROM charities
    `
    
    if (activeOnly) {
      query = sql`
        SELECT * FROM charities WHERE is_active = true ORDER BY is_featured DESC, name ASC
      `
    }

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

    const { name, slug, description, longDescription, logoUrl, bannerUrl, websiteUrl } = await req.json()

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO charities (name, slug, description, long_description, logo_url, banner_url, website_url)
      VALUES (${name}, ${slug}, ${description}, ${longDescription}, ${logoUrl}, ${bannerUrl}, ${websiteUrl})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Charity with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}