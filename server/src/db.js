const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               process.env.DB_PORT     || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'okirudrink',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
})

/**
 * Quick health-check – called once on startup.
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection()
    console.log('✅ MySQL connected to database:', process.env.DB_NAME || 'okirudrink')
    
    // Auto-migration for OTP columns
    try {
      await conn.query('ALTER TABLE users ADD COLUMN is_verified TINYINT DEFAULT 0')
      console.log('✅ Added is_verified column')
    } catch(e) { /* Ignore if exists */ }
    
    try {
      await conn.query('ALTER TABLE users ADD COLUMN otp_code VARCHAR(10) NULL')
      console.log('✅ Added otp_code column')
    } catch(e) { /* Ignore if exists */ }
    
    try {
      await conn.query('ALTER TABLE users ADD COLUMN otp_expiry DATETIME NULL')
      console.log('✅ Added otp_expiry column')
    } catch(e) { /* Ignore if exists */ }

    // Seed products if empty
    try {
      const [prows] = await conn.query('SELECT COUNT(*) as count FROM products')
      if (prows[0].count === 0) {
        console.log('🌱 Seeding default products...')
        const dummyProducts = [
          { name: 'Torbangun Original', price: 15000, category: 'teh-herbal', badge: 'TERLARIS', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400', description: 'Ekstrak murni Torbangun.' },
          { name: 'Torbangun Honey', price: 18000, category: 'teh-herbal', badge: 'PROMO', image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?auto=format&fit=crop&q=80&w=400', description: 'Torbangun dengan madu alami.' },
          { name: 'Jintan Hitam Tea', price: 16000, category: 'teh-jintan', badge: 'BARU', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400', description: 'Teh herbal dari Habbatussauda.' },
          { name: 'Okiru Wellness Bundle', price: 45000, category: 'bundle', badge: 'PROMO', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&q=80&w=400', description: 'Paket lengkap 3 varian.' }
        ]
        for (const p of dummyProducts) {
          await conn.query(
            'INSERT INTO products (name, description, price, category, image, badge) VALUES (?, ?, ?, ?, ?, ?)',
            [p.name, p.description, p.price, p.category, p.image, p.badge]
          )
        }
      }
    } catch(e) { console.error('Seed error:', e.message) }

    conn.release()
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message)
    process.exit(1)
  }
}

module.exports = { pool, testConnection }
