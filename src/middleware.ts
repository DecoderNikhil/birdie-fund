import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const decoded = verifyToken(token)
      const user = await getUserById(decoded.userId)

      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (pathname.startsWith('/admin') && user.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', user.id)
      requestHeaders.set('x-user-role', user.role)
      requestHeaders.set('x-user-email', user.email)

      return NextResponse.next({
        request: { headers: requestHeaders },
      })
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}