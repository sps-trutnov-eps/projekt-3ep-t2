const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// GET /menu
router.get('/menu', requireAuth, (req, res) => {
  res.render('menu.html', { username: req.session.user.username });
});

// Příklad chráněných podstránek
router.get('/profil', requireAuth, (req, res) => {
  res.render('profil.html', { username: req.session.user.username });
});

router.get('/nastaveni', requireAuth, (req, res) => {
  res.render('nastaveni.html', { username: req.session.user.username });
});

module.exports = router;
