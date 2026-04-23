import Link from 'next/link'
import { Button } from '@/components/ui'

interface NavbarProps {
  user?: { email: string; role: string } | null
}

export function Navbar({ user }: NavbarProps) {
  const publicLinks = [
    { href: '/charities', label: 'Charities' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/subscribe', label: 'Pricing' },
  ]

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-2xl">
      <div className="section-shell flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-background">
            BF
          </div>
          <div>
            <div className="font-display text-lg font-bold">Birdie Fund</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#8d8897]">Play. Impact. Reward.</div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {(user
            ? [
                { href: '/dashboard', label: 'Dashboard' },
                ...(user.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
              ]
            : publicLinks
          ).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#b5b0be] transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Button
              onClick={() => {
                localStorage.removeItem('auth-token')
                localStorage.removeItem('user')
                document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                window.location.href = '/login'
              }}
              variant="ghost"
              size="sm"
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button size="sm" variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Join Now</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
