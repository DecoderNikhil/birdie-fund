'use client'

import Link from 'next/link'
import { Button, Card, CardContent } from '@/components/ui'

export function HeroSection() {
  return (
    <section className="gradient-mesh editorial-grid relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24">
      <div className="section-shell relative z-10">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <span className="eyebrow">Charity-first reward platform</span>
            <div className="space-y-6">
              <h1 className="headline-balance max-w-4xl text-5xl font-bold leading-[0.92] sm:text-6xl lg:text-7xl">
                Enter your latest scores.
                <span className="block text-primary">Fund real causes.</span>
                Win the monthly draw.
              </h1>
              <p className="body-balance max-w-2xl text-lg leading-8 text-[#beb9c7] sm:text-xl">
                Digital Heroes is a subscription-led experience that turns golf performance into a modern giving ritual:
                elegant score tracking, monthly prize momentum, and visible charitable impact.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg">Start Your Membership</Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">See The Journey</Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['2 plans', 'monthly or yearly access'],
                ['5 scores', 'rolling record retained'],
                ['10% minimum', 'contribution to a chosen charity'],
              ].map(([value, label]) => (
                <div key={value} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-2xl font-display font-bold text-foreground">{value}</div>
                  <div className="mt-1 text-sm text-[#a3a1b2]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <Card glass className="overflow-hidden rounded-[2rem] p-0">
            <CardContent className="space-y-8 p-8">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.18em] text-[#a3a1b2]">
                <span>Member flow</span>
                <span>March cycle</span>
              </div>

              <div className="space-y-5">
                {[
                  ['01', 'Choose a plan', 'Unlock score entry, draw access, and a charity contribution.'],
                  ['02', 'Log your latest five', 'Keep your performance history current with a fast, clean scoring flow.'],
                  ['03', 'Track draw outcomes', 'See prize tiers, participation, and charitable contribution in one view.'],
                ].map(([index, title, copy]) => (
                  <div key={index} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-secondary">{index}</div>
                    <h3 className="mt-2 text-xl font-display font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#b7b2c1]">{copy}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.75rem] border border-primary/20 bg-primary/10 p-6">
                <div className="text-sm uppercase tracking-[0.2em] text-primary">Impact-led promise</div>
                <p className="mt-3 text-lg leading-8 text-[#f0eee9]">
                  The product leads with what matters: how members participate, how winners are rewarded, and how
                  every month contributes to meaningful causes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    ['Subscribe', 'Choose monthly or yearly access and activate your member dashboard.'],
    ['Select a charity', 'Set the cause you want to support from day one.'],
    ['Enter scores', 'Keep your latest five scores current in a quick mobile-friendly flow.'],
    ['Watch the draw', 'Each month ends with prize tiers, results, and a charity impact story.'],
  ]

  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="eyebrow">How it works</span>
            <h2 className="headline-balance max-w-2xl text-4xl font-bold sm:text-5xl">
              A simple member ritual, built to feel premium.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#a9a5b2]">
            The PRD asks for a clean, emotionally engaging journey. This flow keeps the mechanics clear without feeling
            like a spreadsheet or a sports admin tool.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {steps.map(([title, description], index) => (
            <Card key={title} glass className="relative overflow-hidden">
              <CardContent className="space-y-4 p-6">
                <div className="text-xs uppercase tracking-[0.22em] text-primary">Step {index + 1}</div>
                <h3 className="text-2xl font-display font-bold">{title}</h3>
                <p className="text-sm leading-6 text-[#b6b1bf]">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CharitySpotlight() {
  return (
    <section className="py-10">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="glass-strong overflow-hidden bg-primary/10">
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow border-primary/20 bg-primary/10">Charity spotlight</span>
              <h2 className="text-3xl font-display font-bold sm:text-4xl">Giving is not an afterthought here.</h2>
              <p className="text-base leading-7 text-[#dbf8ee]">
                Members choose a charity and can increase their contribution percentage over time. The product story is
                built around impact first, sport second.
              </p>
              <Link href="/charities">
                <Button variant="secondary">Explore The Directory</Button>
              </Link>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['Featured profiles', 'Give every cause room to feel editorial, not generic.'],
              ['Search & selection', 'Make discovery feel light, clear, and intentional.'],
              ['Contribution control', 'Let members dial up impact without friction.'],
            ].map(([title, copy]) => (
              <Card key={title} className="h-full">
                <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/15" />
                  <div>
                    <h3 className="text-xl font-display font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#aca7b6]">{copy}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function PrizeTiers() {
  const tiers = [
    ['5 match', '40%', 'Jackpot with rollover if unclaimed', 'text-primary'],
    ['4 match', '35%', 'Automatically split across qualified winners', 'text-secondary'],
    ['3 match', '25%', 'Keeps the system exciting for more members', 'text-foreground'],
  ]

  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="mb-12 space-y-4">
          <span className="eyebrow">Prize logic</span>
          <h2 className="headline-balance max-w-2xl text-4xl font-bold sm:text-5xl">
            The reward model is transparent, deliberate, and easy to trust.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map(([label, share, description, tone]) => (
            <Card key={label} glass className="group overflow-hidden">
              <CardContent className="space-y-8 p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[#9e99aa]">{label}</div>
                    <div className={`mt-3 text-6xl font-display font-bold ${tone}`}>{share}</div>
                  </div>
                  <div className="h-16 w-16 rounded-full border border-white/10 bg-white/[0.04] transition-transform duration-300 group-hover:scale-110" />
                </div>
                <p className="text-sm leading-7 text-[#b3afbc]">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function DrawCountdown() {
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const daysLeft = Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <section className="py-24">
      <div className="section-shell">
        <Card className="glass-strong overflow-hidden">
          <CardContent className="grid gap-10 p-8 md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div className="space-y-4">
              <span className="eyebrow">Next draw</span>
              <h2 className="text-4xl font-display font-bold sm:text-5xl">{daysLeft} days remaining</h2>
              <p className="max-w-lg text-base leading-7 text-[#b7b2c1]">
                Enter scores before the end of {endOfMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                {' '}to stay eligible for the next published result.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Input', 'Your latest score window stays current.'],
                ['Simulate', 'Admins can preview outcomes before publish.'],
                ['Publish', 'Results and winner workflows update cleanly.'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg font-display font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#afaab8]">{copy}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export function FinalCTA() {
  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_30px_90px_-40px_rgba(0,0,0,0.6)] sm:p-12">
          <span className="eyebrow">Ready to join</span>
          <h2 className="headline-balance mx-auto mt-5 max-w-3xl text-4xl font-bold sm:text-5xl">
            Make the product feel generous before a user ever reaches checkout.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#a9a5b2]">
            Subscribe, enter scores, choose a cause, and turn a monthly routine into something that feels rewarding in
            more than one way.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">Create Account</Button>
            </Link>
            <Link href="/subscribe">
              <Button size="lg" variant="outline">View Plans</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
