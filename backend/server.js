const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const protect = require('./middleware/protect');
app.get('/api/dashboard', protect, (req, res) => {
    res.json({ message: `Bienvenue ${req.user.username}`, user: req.user });
});

// Route setup pour creer l'admin (utiliser une seule fois)
app.get('/setup', async (req, res) => {
    const pool = require('./db');
    try {
          await pool.query(`CREATE TABLE IF NOT EXISTS utilisateurs (id SERIAL PRIMARY KEY, username VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(50) DEFAULT 'admin', created_at TIMESTAMP DEFAULT NOW())`);
          const hash = await bcrypt.hash('Admin1234!', 10);
          await pool.query('INSERT INTO utilisateurs (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING', ['admin', hash, 'admin']);
          res.json({ success: true, message: 'Admin cree! Login: admin / Admin1234!' });
    } catch (err) {
          res.status(500).json({ error: err.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lance sur http://localhost:${PORT}`);
});
