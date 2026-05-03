require('dotenv').config();
const { pool } = require('./src/db');
async function migrate() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN is_verified TINYINT DEFAULT 0;');
    await pool.query('ALTER TABLE users ADD COLUMN otp_code VARCHAR(10) NULL;');
    await pool.query('ALTER TABLE users ADD COLUMN otp_expiry DATETIME NULL;');
    console.log('Migration successful');
  } catch (err) {
    console.log('Migration error:', err.message);
  }
  process.exit();
}
migrate();
