import Link from 'next/link'

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/scores', label: 'My Scores' },
  { href: '/dashboard/draws', label: 'Draws' },
  { href: '/dashboard/charity', label: 'My Charity' },
  { href: '/dashboard/winnings', label: 'Winnings' },
]

export function DashboardSidebar() {
  return (
    <aside className="w-64 bg-muted min-h-screen p-6 border-r border-white/10">
      <div className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  )
}