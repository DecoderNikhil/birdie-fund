import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-muted py-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold text-primary">Birdie Fund</h3>
            <p className="text-gray-400 mt-2">
              Play golf. Change lives. Win big.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/charities" className="block text-gray-400 hover:text-white">Charities</Link>
              <Link href="/how-it-works" className="block text-gray-400 hover:text-white">How It Works</Link>
              <Link href="/subscribe" className="block text-gray-400 hover:text-white">Subscribe</Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="block text-gray-400 hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Birdie Fund. All rights reserved.
        </div>
      </div>
    </footer>
  )
}