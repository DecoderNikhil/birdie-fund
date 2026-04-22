const postgres = require('postgres')
const bcrypt = require('bcryptjs')
const fs = require('fs')

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

const args = process.argv.slice(2)
const email = args[0]
const password = args[1] || 'admin123'

if (!email) {
  console.log('Usage: node create-admin.js <email> [password]')
  console.log('Example: node create-admin.js admin@birdiefund.test')
  process.exit(1)
}

async function createAdmin() {
  const sql = postgres(DATABASE_URL, { max: 1 })
  
  const passwordHash = bcrypt.hashSync(password, 12)
  
  console.log(`Creating admin user: ${email}`)
  
  try {
    // Insert user
    const userResult = await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, 'Admin')
      ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}
      RETURNING id
    `
    
    const userId = userResult[0]?.id
    
    if (!userId) {
      // Get existing user id
      const existing = await sql`SELECT id FROM users WHERE email = ${email}`
      userId = existing[0]?.id
    }
    
    // Insert or update profile with admin role
    await sql`
      INSERT INTO profiles (id, email, full_name, role)
      VALUES (${userId}, ${email}, 'Admin', 'admin')
      ON CONFLICT (id) DO UPDATE SET role = 'admin'
    `
    
    console.log(`✓ Admin created: ${email}`)
    console.log(`  Password: ${password}`)
    
  } catch (error) {
    console.error('Error:', error.message)
  }
  
  await sql.end()
}

createAdmin()