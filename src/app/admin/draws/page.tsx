import { sql } from '@/lib/db/client'
import { DrawSimulator } from '@/components/draws/DrawSimulator'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'

export const dynamic = 'force-dynamic'

export default async function AdminDrawsPage() {
  const result = await sql`
    SELECT * FROM draws
    ORDER BY year DESC, month DESC
  `
  const draws = result.rows

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const currentDraw = draws.find((d: any) => d.month === currentMonth && d.year === currentYear)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Draw Management</h1>
        <p className="text-gray-400 mt-2">Manage monthly draws and prize distribution</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Draw ({currentMonth}/{currentYear})</CardTitle>
          </CardHeader>
          <CardContent>
            {currentDraw ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    currentDraw.status === 'published' ? 'bg-primary/20 text-primary' :
                    currentDraw.status === 'simulated' ? 'bg-secondary/20 text-secondary' :
                    'bg-white/10 text-gray-300'
                  }`}>
                    {currentDraw.status}
                  </span>
                </div>

                {currentDraw.drawn_numbers?.length > 0 && (
                  <div className="flex gap-2">
                    {currentDraw.drawn_numbers.map((n: number) => (
                      <div key={n} className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-background font-bold">
                        {n}
                      </div>
                    ))}
                  </div>
                )}

                {currentDraw.status === 'pending' && (
                  <DrawSimulator drawId={currentDraw.id} onSimulate={async () => {}} />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400">No draw exists for this month</p>
                <Button>Create Draw</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Draw History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {draws.filter((d: any) => d.id !== currentDraw?.id).map((draw: any) => (
                <div key={draw.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <span className="font-medium">{draw.month}/{draw.year}</span>
                    <span className={`ml-2 text-sm ${
                      draw.status === 'published' ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {draw.status}
                    </span>
                  </div>
                  {draw.status === 'simulated' && (
                    <Button size="sm">Publish</Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}