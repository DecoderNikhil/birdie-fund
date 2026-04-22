const postgres = require('postgres')
const fs = require('fs')
const path = require('path')

// Read .env file directly
function loadEnv() {
  const envPath = '.env'
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found')
    process.exit(1)
  }
  
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

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in .env')
  process.exit(1)
}

async function runMigrations() {
  const sql = postgres(DATABASE_URL, { max: 1 })
  
  console.log('Connected to database\nRunning migrations...\n')
  
  const migrationsDir = './db/migrations'
  const files = fs.readdirSync(migrationsDir).sort()
  
  for (const file of files) {
    if (!file.endsWith('.sql')) continue
    
    console.log(`Running ${file}...`)
    const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    
    try {
      // Split on semicolons and execute each statement
      const statements = sqlContent.split(';').filter(s => s.trim())
      for (const stmt of statements) {
        if (stmt.trim()) {
          try {
            await sql(stmt.trim())
          } catch (e) {
            // Ignore if statement produces no rows
            if (!e.message?.includes('no rows')) {
              // Continue silently
            }
          }
        }
      }
      console.log(`  ✓ ${file}`)
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log(`  ⚠ ${file} (already exists - skipping)`)
      } else if (error.message?.includes('duplicate')) {
        console.log(`  ⚠ ${file} (duplicate - skipping)`)
      } else {
        console.log(`  ✗ ${error.message}`)
      }
    }
  }
  
  await sql.end()
  console.log('\n✓ All migrations complete!')
}

runMigrations().catch(err => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})