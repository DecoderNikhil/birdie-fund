const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function seed() {
  console.log('Seeding charities...')
  
  const charities = [
    {
      name: 'Cancer Research UK',
      slug: 'cancer-research-uk',
      description: 'The world\'s leading cancer charity dedicated to saving lives through research.',
      long_description: 'We are the world\'s leading cancer charity dedicated to saving lives through research, influence, and information. Our vision is to bring forward the day when all cancers are cured.',
      logo_url: 'https://images.unsplash.com/photo-1559599238-308793637427?w=200',
      banner_url: 'https://images.unsplash.com/photo-1559599238-308793637427?w=800',
      website_url: 'https://www.cancerresearchuk.org',
      is_active: true,
      is_featured: true
    },
    {
      name: 'British Heart Foundation',
      slug: 'british-heart-foundation',
      description: 'Pioneering heart research and supporting those affected by heart disease.',
      long_description: 'The British Heart Foundation is the UK\'s number one heart charity. We fund research to find cures for heart and circulatory diseases.',
      logo_url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=200',
      banner_url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800',
      website_url: 'https://www.bhf.org.uk',
      is_active: true,
      is_featured: true
    },
    {
      name: 'Mind Mental Health',
      slug: 'mind-mental-health',
      description: 'Providing advice and support to anyone experiencing a mental health problem.',
      long_description: 'We provide advice and support to empower anyone experiencing a mental health problem. We campaign to improve services, raise awareness and promote understanding.',
      logo_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=200',
      banner_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800',
      website_url: 'https://www.mind.org.uk',
      is_active: true,
      is_featured: false
    },
    {
      name: 'RSPCA',
      slug: 'rspca',
      description: 'The Royal Society for the Prevention of Cruelty to Animals.',
      long_description: 'We\'re the RSPCA, and it\'s our mission to ensure all animals are treated with respect and compassion.',
      logo_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200',
      banner_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
      website_url: 'https://www.rspca.org.uk',
      is_active: true,
      is_featured: false
    },
    {
      name: 'World Wildlife Fund',
      slug: 'world-wildlife-fund',
      description: 'Protecting nature and wildlife around the globe.',
      long_description: 'WWF works to help local communities conserve the natural resources they depend upon, protect species, and change policies to prevent climate change.',
      logo_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200',
      banner_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800',
      website_url: 'https://www.wwf.org.uk',
      is_active: true,
      is_featured: false
    }
  ]

  for (const c of charities) {
    try {
      await pool.query(
        `INSERT INTO charities (name, slug, description, long_description, logo_url, banner_url, website_url, is_active, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO NOTHING`,
        [c.name, c.slug, c.description, c.long_description, c.logo_url, c.banner_url, c.website_url, c.is_active, c.is_featured]
      )
      console.log(`✓ Added: ${c.name}`)
    } catch (e) {
      console.error(`Error adding ${c.name}:`, e.message)
    }
  }

  console.log('\n✅ Seeding complete!')
  await pool.end()
}

seed()