import Link from 'next/link'
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'

interface NavbarProps {
  user?: { email: string; role: string } | null
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-display font-bold text-primary">
          Birdie Fund
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-gray-300 hover:text-white">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/charities" className="text-gray-300 hover:text-white">
                Charities
              </Link>
              <Link href="/subscribe" className="text-gray-300 hover:text-white">
                Subscribe
              </Link>
            </>
          )}
          {user ? (
            <Button onClick={() => {
              localStorage.removeItem('auth-token')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }} variant="ghost" size="sm">
              Sign Out
            </Button>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}