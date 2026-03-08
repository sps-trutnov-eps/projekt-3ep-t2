const express = require('express');
const router = express.Router();
const { createUser, verifyUser } = require('../db');

// GET /login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/menu');
  res.render('login.html', { error: '', mode: 'login' });
});

// GET /register
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/menu');
  res.render('register.html', { error: '' });
});

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const ok = await verifyUser(username, password);
  if (!ok) {
    return res.render('login.html', { error: 'Špatné jméno nebo heslo' });
  }
  req.session.user = { username };
  res.redirect('/menu');
});

// POST /register
router.post('/register', async (req, res) => {
  const { username, password, password2 } = req.body;
  if (password !== password2) {
    return res.render('register.html', { error: 'Hesla se neshodují' });
  }
  const result = await createUser(username, password);
  if (result.error) {
    return res.render('register.html', { error: result.error });
  }
  req.session.user = { username };
  res.redirect('/menu');
});

// POST /logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// GET / → přesměrování
router.get('/', (req, res) => {
  res.redirect(req.session.user ? '/menu' : '/login');
});

module.exports = router;
