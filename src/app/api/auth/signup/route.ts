import { NextRequest, NextResponse } from 'next/server'
import { createUser, generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const user = await createUser(email, password, fullName)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    })

    response.cookies.set('auth-token', token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
