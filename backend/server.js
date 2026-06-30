const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const protect = require('./middleware/protect');
app.get('/api/dashboard', protect, (req, res) => {
  res.json({ message: `Bienvenue ${req.user.username} !`, user: req.user });
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Serveur lance sur http://localhost:${PORT}`);
      });
