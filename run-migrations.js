const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Read .env file directly
function loadEnv() {
  const envPath = '.env'
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    }
  })
}

loadEnv()

const DATABASE_URL = process.env.DATABASE_URL

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function runMigrations() {
  console.log('Running migrations manually...\n')
  
  try {
    await client.connect()
    console.log('Connected to database\n')
  } catch (err) {
    console.error('Connection error:', err.message)
    process.exit(1)
  }
  
  const migrationsDir = './db/migrations'
  const files = fs.readdirSync(migrationsDir).sort()
  
  for (const file of files) {
    if (!file.endsWith('.sql')) continue
    
    console.log(`Running ${file}...`)
    const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    
    try {
      await client.query(sqlContent)
      console.log(`  ✓ Success`)
    } catch (error) {
      // Skip "already exists" and duplicate errors
      if (error.message?.includes('already exists') || error.message?.includes('duplicate key') || error.code === '42P07' || error.code === '42710') {
        console.log(`  ✓ Already exists`)
        continue
      }
      // Log but continue for other errors (e.g., function already exists)
      if (error.code === '42883' || error.code === '42P07') {
        console.log(`  ⚠ ${error.message}`)
        continue
      }
      console.log(`  Error: ${error.message} (${error.code})`)
    }
  }
  
  // Verify tables exist
  console.log('\nVerifying tables...')
  const result = await client.query(`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `)
  
  if (result.rows.length === 0) {
    console.log('No tables created!')
  } else {
    console.log('\nTables created:')
    result.rows.forEach(t => console.log(`  ✓ ${t.table_name}`))
  }
  
  await client.end()
  console.log('\n✓ All done!')
}

runMigrations().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})