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
    <aside className="hidden w-72 border-r border-white/10 bg-black/20 p-6 xl:block">
      <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-[#908b99]">Member area</div>
        <div className="mt-2 font-display text-2xl font-bold">Your dashboard</div>
        <div className="mt-2 text-sm leading-6 text-[#a9a4b1]">Track scores, rewards, charity contribution, and upcoming monthly draw activity.</div>
      </div>
      <div className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl px-4 py-3 text-sm font-medium text-[#cbc7d4] transition-colors hover:bg-white/10 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
