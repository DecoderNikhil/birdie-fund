import { sql } from '@/lib/db/client'
import { CharityCard } from '@/components/charity/CharityCard'
import { Card, CardContent } from '@/components/ui'

export const dynamic = 'force-dynamic'

export default async function CharitiesPage() {
  const result = await sql`
    SELECT * FROM charities
    WHERE is_active = true
    ORDER BY is_featured DESC, name ASC
  `

  const featured = result.rows.find((c: any) => c.is_featured)
  const others = result.rows.filter((c: any) => !c.is_featured)

  return (
    <main className="gradient-mesh pt-28 pb-20">
      <div className="section-shell space-y-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="eyebrow">Charity directory</span>
            <h1 className="headline-balance mt-5 text-5xl font-bold sm:text-6xl">Support a cause that feels personal, not abstract.</h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[#b8b3c1]">
            The PRD calls for charity search, spotlighting, and selection to feel seamless. This page now leads with
            trust, clarity, and emotional relevance instead of reading like a list of records.
          </p>
        </div>

        {featured && (
          <Card className="glass-strong overflow-hidden">
            <CardContent className="grid gap-8 p-8 md:grid-cols-[160px_1fr] md:p-10">
              {featured.logo_url ? (
                <img src={featured.logo_url} alt={featured.name} className="h-32 w-32 rounded-[1.75rem] object-cover" />
              ) : (
                <div className="h-32 w-32 rounded-[1.75rem] bg-white/10" />
              )}
              <div>
                <span className="eyebrow border-primary/20 bg-primary/10">Featured charity</span>
                <h2 className="mt-5 text-4xl font-display font-bold">{featured.name}</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[#c1bcc9]">{featured.description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(featured ? others : result.rows).map((charity: any) => (
            <CharityCard key={charity.id} charity={charity} />
          ))}
        </div>
      </div>
    </main>
  )
}
