const postgres = require('postgres')
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
const sql = postgres(DATABASE_URL, { max: 1 })

async function runMigrations() {
  console.log('Running migrations manually...\n')
  
  const migrationsDir = './db/migrations'
  const files = fs.readdirSync(migrationsDir).sort()
  
  for (const file of files) {
    if (!file.endsWith('.sql')) continue
    
    console.log(`Running ${file}...`)
    const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    
    // Split by semicolon and execute raw SQL
    const statements = sqlContent.split(';')
    let success = true
    
    for (const stmt of statements) {
      const trimmed = stmt.trim()
      if (!trimmed || trimmed.startsWith('--')) continue
      
      try {
        await sql.unsafe(trimmed)
      } catch (error) {
        // If it's "already exists" or duplicate key, that's OK
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          continue
        }
        console.log(`  Error: ${error.message}`)
        success = false
        break
      }
    }
    
    console.log(success ? `  ✓ Success` : `  ⚠ Completed with warnings`)
  }
  
  // Verify tables exist
  console.log('\nVerifying tables...')
  const tables = await sql`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `
  
  if (tables.length === 0) {
    console.log('No tables created! Running individually...')
    
    // Create tables one by one manually
    console.log('\n1. Creating users table...')
    await sql.unsafe(`CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      full_name text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )`)
    
    console.log('2. Creating profiles table...')
    await sql.unsafe(`CREATE TABLE IF NOT EXISTS profiles (
      id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      email text NOT NULL,
      full_name text,
      avatar_url text,
      role text NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )`)
    
    console.log('3. Creating subscriptions table...')
    await sql.unsafe(`CREATE TABLE IF NOT EXISTS subscriptions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      stripe_customer_id text UNIQUE,
      stripe_subscription_id text UNIQUE,
      plan text NOT NULL CHECK (plan IN ('monthly', 'yearly')),
      status text NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'lapsed')),
      current_period_start timestamptz,
      current_period_end timestamptz,
      cancel_at_period_end boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )`)
    
    console.log('4. Creating scores table...')
    await sql.unsafe(`CREATE TABLE IF NOT EXISTS scores (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      score integer NOT NULL CHECK (score >= 1 AND score <= 45),
      score_date date NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(user_id, score_date)
    )`)
    
    console.log('5. Creating charities table...')
    await sql.unsafe(`CREATE TABLE IF NOT EXISTS charities (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text UNIQUE NOT NULL,
      description text,
      long_description text,
      logo_url text,
      banner_url text,
      website_url text,
      is_active boolean DEFAULT true,
      is_featured boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )`)
    
    console.log('6. Creating user_charity_selections table...')
    await sql.unsafe(`CREATE TABLE IF NOT EXISTS user_charity_selections (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      charity_id uuid NOT NULL REFERENCES charities(id),
      contribution_percentage integer NOT NULL DEFAULT 10 CHECK (contribution_percentage >= 10 AND contribution_percentage <= 100),
      updated_at timestamptz DEFAULT now()
    )`)
    
    console.log('7. Creating draws table...')
    await sql.unsafe(`CREATE TABLE IF NOT EXISTS draws (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      month integer NOT NULL CHECK (month >= 1 AND month <= 12),
      year integer NOT NULL,
      draw_type text NOT NULL DEFAULT 'random' CHECK (draw_type IN ('random', 'algorithmic')),
      drawn_numbers integer[] DEFAULT '{}',
      status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'simulated', 'published')),
      jackpot_amount numeric(10,2) DEFAULT 0,
      pool_4match numeric(10,2) DEFAULT 0,
      pool_3match numeric(10,2) DEFAULT 0,
      total_subscribers integer DEFAULT 0,
      jackpot_rolled_over boolean DEFAULT false,
      published_at timestamptz,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(month, year)
    )`)
    
    console.log('8. Creating draw_entries table...')
    await sql.unsafe(`CREATE TABLE IF NOT EXISTS draw_entries (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      draw_id uuid NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      scores_snapshot integer[] NOT NULL,
      match_count integer DEFAULT 0,
      is_winner boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      UNIQUE(draw_id, user_id)
    )`)
    
    console.log('9. Creating winners table...')
    await sql.unsafe(`CREATE TABLE IF NOT EXISTS winners (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      draw_id uuid NOT NULL REFERENCES draws(id),
      user_id uuid NOT NULL REFERENCES profiles(id),
      match_type text NOT NULL CHECK (match_type IN ('5-match', '4-match', '3-match')),
      prize_amount numeric(10,2) NOT NULL,
      verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'submitted', 'approved', 'rejected')),
      proof_url text,
      payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
      paid_at timestamptz,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )`)
  }
  
  console.log('\nVerifying tables again...')
  const tables2 = await sql`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `
  
  console.log('\nTables created:')
  tables2.forEach(t => console.log(`  ✓ ${t.table_name}`))
  
  await sql.end()
  console.log('\n✓ All done!')
}

runMigrations().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})