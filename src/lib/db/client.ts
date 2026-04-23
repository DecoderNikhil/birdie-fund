import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
})

// Handle tagged template literals - pg doesn't support them, so convert to parameterized query
function sqlTemplate(strings: TemplateStringsArray, ...values: any[]): Promise<pg.QueryResult> {
  const sqlParts: string[] = []
  const params: any[] = []
  let paramIndex = 1
  
  for (let i = 0; i < strings.length; i++) {
    sqlParts.push(strings[i])
    if (i < values.length) {
      const value = values[i]
      if (value !== undefined) {
        params.push(value)
        sqlParts.push(`$${paramIndex}`)
        paramIndex++
      }
    }
  }
  return pool.query(sqlParts.join(''), params)
}

export const sql = sqlTemplate as any

export async function testConnection() {
  try {
    await pool.query('SELECT 1')
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}