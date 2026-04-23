import { NextRequest, NextResponse } from 'next/server'

interface TokenPayload {
  userId: string
  email: string
  role: string
  exp?: number
}

const JWT_SECRET = process.env.JWT_SECRET

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return atob(padded)
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = ''

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function verifyJwt(token: string): Promise<TokenPayload | null> {
  if (!JWT_SECRET) {
    return null
  }

  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.')

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null
  }

  try {
    const header = JSON.parse(decodeBase64Url(encodedHeader)) as { alg?: string; typ?: string }
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as TokenPayload

    if (header.alg !== 'HS256' || !payload.userId || !payload.role) {
      return null
    }

    if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
    )

    const expectedSignature = encodeBase64Url(new Uint8Array(signature))

    if (expectedSignature !== encodedSignature) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/dashboard') && !pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const payload = await verifyJwt(token)

  if (!payload) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('auth-token')
    return response
  }

  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.userId)
  requestHeaders.set('x-user-role', payload.role)
  requestHeaders.set('x-user-email', payload.email)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
