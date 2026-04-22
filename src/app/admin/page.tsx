import { sql } from '@/lib/db/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default async function AdminDashboardPage() {
  const [userCount, subCount, charityCount, pendingWinners] = await Promise.all([
    sql`SELECT count(*) as cnt FROM profiles`,
    sql`SELECT count(*) as cnt FROM subscriptions WHERE status = 'active'`,
    sql`SELECT count(*) as cnt FROM charities WHERE is_active = true`,
    sql`SELECT count(*) as cnt FROM winners WHERE verification_status = 'pending'`,
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Overview and statistics</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-display font-bold text-primary">
              {userCount[0]?.cnt || 0}
            </div>
            <p className="text-gray-400 mt-1">Total Users</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-display font-bold text-primary">
              {subCount[0]?.cnt || 0}
            </div>
            <p className="text-gray-400 mt-1">Active Subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-display font-bold text-secondary">
              {charityCount[0]?.cnt || 0}
            </div>
            <p className="text-gray-400 mt-1">Active Charities</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-display font-bold text-secondary">
              {pendingWinners[0]?.cnt || 0}
            </div>
            <p className="text-gray-400 mt-1">Pending Verifications</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}