import { sql } from '@/lib/db/client'
import { Badge } from '@/components/ui'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const usersResult = await sql`
    SELECT p.id, p.email, p.full_name, p.role, p.created_at, s.status as sub_status
    FROM profiles p
    LEFT JOIN subscriptions s ON p.id = s.user_id
    ORDER BY p.created_at DESC
  `
  const users = usersResult.rows

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Users</h1>
        <p className="text-gray-400 mt-2">Manage users and subscriptions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-gray-400">Name</th>
              <th className="text-left py-3 px-4 text-gray-400">Email</th>
              <th className="text-left py-3 px-4 text-gray-400">Role</th>
              <th className="text-left py-3 px-4 text-gray-400">Status</th>
              <th className="text-left py-3 px-4 text-gray-400">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b border-white/5">
                <td className="py-3 px-4">{user.full_name || '-'}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <Badge variant={user.role === 'admin' ? 'warning' : 'default'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={user.sub_status === 'active' ? 'success' : 'default'}>
                    {user.sub_status || 'inactive'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}