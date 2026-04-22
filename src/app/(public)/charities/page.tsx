import { sql } from '@/lib/db/client'
import { CharityCard } from '@/components/charity/CharityCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default async function CharitiesPage() {
  const result = await sql`
    SELECT * FROM charities
    WHERE is_active = true
    ORDER BY is_featured DESC, name ASC
  `

  const featured = result.find((c: any) => c.is_featured)
  const others = result.filter((c: any) => !c.is_featured)

  return (
    <div className="min-h-screen gradient-mesh p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold">Charities</h1>
          <p className="text-gray-400 mt-2">Support a cause that matters to you</p>
        </div>

        {featured && (
          <Card className="border-primary/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                {featured.logo_url && (
                  <img src={featured.logo_url} alt={featured.name} className="w-24 h-24 rounded-xl object-cover" />
                )}
                <div className="flex-1">
                  <span className="text-sm text-primary font-medium">Featured Charity</span>
                  <h2 className="text-2xl font-display font-bold mt-1">{featured.name}</h2>
                  <p className="text-gray-300 mt-2">{featured.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {others.map((charity: any) => (
            <CharityCard key={charity.id} charity={charity} />
          ))}
        </div>
      </div>
    </div>
  )
}