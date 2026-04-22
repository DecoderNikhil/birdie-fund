import { sql } from '@/lib/db/client'
import { verifyToken } from '@/lib/auth'
import { ScoreEntryForm } from '@/components/scores/ScoreEntryForm'
import { ScoreHistory } from '@/components/scores/ScoreHistory'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

async function getScores(token: string) {
  try {
    const decoded = verifyToken(token)
    const result = await sql`
      SELECT id, score, score_date, created_at
      FROM scores
      WHERE user_id = ${decoded.userId}
      ORDER BY score_date DESC
      LIMIT 5
    `
    return result
  } catch {
    return []
  }
}

export default async function ScoresPage() {
  const token = ''
  const scores = await getScores(token)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">My Scores</h1>
        <p className="text-gray-400 mt-2">Track your golf scores for the monthly draw</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter Score</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreEntryForm onSuccess={async () => {}} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreHistory 
              scores={scores as any} 
              onRefetch={async () => {}} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}