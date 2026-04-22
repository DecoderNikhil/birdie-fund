import { sql } from '@/lib/db/client'
import { Button, Badge } from '@/components/ui'

export default async function AdminWinnersPage() {
  const winners = await sql`
    SELECT w.*, p.email, p.full_name, d.month, d.year
    FROM winners w
    JOIN profiles p ON w.user_id = p.id
    JOIN draws d ON w.draw_id = d.id
    ORDER BY w.created_at DESC
  `

  const handleVerify = async (winnerId: string, status: 'approved' | 'rejected') => {
    'use server'
    await sql`
      UPDATE winners
      SET verification_status = ${status}, updated_at = NOW()
      WHERE id = ${winnerId}
    `
  }

  const handlePay = async (winnerId: string) => {
    'use server'
    await sql`
      UPDATE winners
      SET payment_status = 'paid', paid_at = NOW(), updated_at = NOW()
      WHERE id = ${winnerId}
    `
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Winners</h1>
        <p className="text-gray-400 mt-2">Verify and pay winners</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-gray-400">User</th>
              <th className="text-left py-3 px-4 text-gray-400">Draw</th>
              <th className="text-left py-3 px-4 text-gray-400">Prize</th>
              <th className="text-left py-3 px-4 text-gray-400">Verification</th>
              <th className="text-left py-3 px-4 text-gray-400">Payment</th>
              <th className="text-left py-3 px-4 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((win: any) => (
              <tr key={win.id} className="border-b border-white/5">
                <td className="py-3 px-4">
                  <p className="font-medium">{win.full_name || '-'}</p>
                  <p className="text-sm text-gray-400">{win.email}</p>
                </td>
                <td className="py-3 px-4">{win.month}/{win.year}</td>
                <td className="py-3 px-4">£{win.prize_amount}</td>
                <td className="py-3 px-4">
                  <Badge variant={
                    win.verification_status === 'approved' ? 'success' :
                    win.verification_status === 'rejected' ? 'error' : 'warning'
                  }>
                    {win.verification_status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={win.payment_status === 'paid' ? 'success' : 'default'}>
                    {win.payment_status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {win.verification_status === 'submitted' && (
                      <>
                        <Button size="sm" onClick={() => handleVerify(win.id, 'approved')}>Approve</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleVerify(win.id, 'rejected')}>Reject</Button>
                      </>
                    )}
                    {win.verification_status === 'approved' && win.payment_status === 'pending' && (
                      <Button size="sm" onClick={() => handlePay(win.id)}>Pay</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}