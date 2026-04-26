// routes/auth.js – přihlášení, registrace, odhlášení
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db');

// GET /
router.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/menu');
  res.redirect('/login');
});

// GET /login
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/menu');
  res.render('login', { error: '' });
});

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.render('login', { error: 'Vyplň všechna pole.' });

  const user = await db.findUser(username.trim());
  if (!user) return res.render('login', { error: 'Nesprávné jméno nebo heslo.' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.render('login', { error: 'Nesprávné jméno nebo heslo.' });

  req.session.userId   = user.id;
  req.session.username = user.username;
  req.session.role     = user.role;
  req.session.skin     = user.skin || 'default';
  res.redirect('/menu');
});

// GET /register
router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/menu');
  res.render('register', { error: '' });
});

// POST /register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const u = (username || '').trim();
  const p = (password || '');

  if (u.length < 2) return res.render('register', { error: 'Jméno musí mít alespoň 2 znaky.' });
  if (p.length < 4) return res.render('register', { error: 'Heslo musí mít alespoň 4 znaky.' });

  const existing = await db.findUser(u);
  if (existing) return res.render('register', { error: 'Toto jméno je již obsazeno.' });

  const hash = await bcrypt.hash(p, 10);
  const result = await db.createUser(u, hash);
  if (result.error) return res.render('register', { error: result.error });

  // Automaticky přihlásit po registraci
  req.session.userId   = result.user.id;
  req.session.username = result.user.username;
  req.session.role     = result.user.role;
  req.session.skin     = 'default';
  res.redirect('/menu');
});

// POST /logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
