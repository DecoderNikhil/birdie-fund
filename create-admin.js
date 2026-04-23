const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function createAdmin() {
  const passwordHash = await bcrypt.hash('Testing@123', 10)
  
  await pool.query(
    'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
    ['admin@test.com', passwordHash, 'Admin User']
  )
  
  const userResult = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@test.com'])
  
  if (userResult.rows.length > 0) {
    const userId = userResult.rows[0].id
    
    await pool.query(
      'INSERT INTO profiles (id, email, full_name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET role = $4',
      [userId, 'admin@test.com', 'Admin User', 'admin']
    )
    
    console.log('Admin created!')
    console.log('Email: admin@test.com')
    console.log('Password: Testing@123')
  }
  
  await pool.end()
}

createAdmin()