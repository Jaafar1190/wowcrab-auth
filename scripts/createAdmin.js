const bcrypt = require('bcrypt');
  const { Pool } = require('pg');
    require('dotenv').config();

      const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
          });

      async function createAdmin() {
          try {
          await pool.query(`CREATE TABLE IF NOT EXISTS utilisateurs (id SERIAL PRIMARY KEY, username VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(50) DEFAULT 'admin', created_at TIMESTAMP DEFAULT NOW())`);
          const hash = await bcrypt.hash('Admin1234!', 10);
          await pool.query('INSERT INTO utilisateurs (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING', ['admin', hash, 'admin']);
              console.log('Admin cree: admin / Admin1234!');
                process.exit(0);
                } catch (err) {
                  console.error('Erreur:', err);
                  process.exit(1);
                }
              }

                createAdmin();
