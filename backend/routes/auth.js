const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
          return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
        }
    try {
          const result = await pool.query('SELECT * FROM utilisateurs WHERE username = $1', [username]);
          const user = result.rows[0];
          if (!user) {
                  return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
                }
          const passwordValid = await bcrypt.compare(password, user.password);
          if (!passwordValid) {
                  return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
                }
          const token = jwt.sign(
                  { id: user.id, username: user.username, role: user.role },
                  process.env.JWT_SECRET,
                  { expiresIn: '8h' }
                );
          res.json({ success: true, token, username: user.username, role: user.role });
        } catch (err) {
          console.error('Erreur login:', err);
          res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
  });

router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Deconnecte.' });
  });

router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ valid: false });
    try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          res.json({ valid: true, user: decoded });
        } catch {
          res.status(401).json({ valid: false });
        }
  });

module.exports = router;
