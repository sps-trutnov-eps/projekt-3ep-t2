// routes/games.js – stránky her + API pro ukládání skóre
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const db = require('../db');

// ── Herní stránky ─────────────────────────────────────────

router.get('/snake',       requireLogin, (req, res) =>
  res.render('snake',       { username: req.session.username, skin: req.session.skin }));

router.get('/dropper',     requireLogin, (req, res) =>
  res.render('dropper',     { username: req.session.username, skin: req.session.skin }));

router.get('/minesweeper', requireLogin, (req, res) =>
  res.render('minesweeper', { username: req.session.username, skin: req.session.skin }));

// ── API: uložit skóre ─────────────────────────────────────
// POST /api/score  { game: 'snake'|'dropper'|'minesweeper', score: Number }
router.post('/api/score', requireLogin, async (req, res) => {
  const { game, score } = req.body;
  const validGames = ['snake', 'dropper', 'minesweeper'];

  if (!validGames.includes(game)) return res.json({ ok: false, error: 'Neplatná hra.' });
  if (typeof score !== 'number' || isNaN(score)) return res.json({ ok: false, error: 'Neplatné skóre.' });

  const saved = await db.saveScore(req.session.userId, game, score);
  res.json({ ok: saved });
});

module.exports = router;
