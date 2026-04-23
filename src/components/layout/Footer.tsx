import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 py-16">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <div className="font-display text-2xl font-bold text-primary">Birdie Fund</div>
            <p className="mt-4 text-sm leading-7 text-[#a8a4b1]">
              A modern member experience that combines score tracking, monthly rewards, and meaningful charitable impact
              without falling into golf cliches.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-[#8d8897]">Explore</div>
            <div className="mt-5 space-y-3">
              <Link href="/charities" className="block text-sm text-[#cbc7d4] hover:text-white">Charities</Link>
              <Link href="/how-it-works" className="block text-sm text-[#cbc7d4] hover:text-white">How It Works</Link>
              <Link href="/subscribe" className="block text-sm text-[#cbc7d4] hover:text-white">Membership</Link>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-[#8d8897]">Product promises</div>
            <div className="mt-5 space-y-3 text-sm text-[#cbc7d4]">
              <p>Responsive across desktop and mobile</p>
              <p>Charity-first storytelling</p>
              <p>Clear subscription and reward flow</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-[#8d8897]">
          © {new Date().getFullYear()} Birdie Fund. Designed to feel generous, clear, and modern.
        </div>
      </div>
    </footer>
  )
}
