import Link from 'next/link'

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/draws', label: 'Draws' },
  { href: '/admin/charities', label: 'Charities' },
  { href: '/admin/winners', label: 'Winners' },
  { href: '/admin/reports', label: 'Reports' },
]

export function AdminSidebar() {
  return (
    <aside className="hidden w-72 border-r border-white/10 bg-black/20 p-6 xl:block">
      <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-[#908b99]">Control centre</div>
        <div className="mt-2 font-display text-2xl font-bold">Admin tools</div>
        <div className="mt-2 text-sm leading-6 text-[#a9a4b1]">Review users, publish draws, manage charities, and oversee winner operations from one shell.</div>
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
