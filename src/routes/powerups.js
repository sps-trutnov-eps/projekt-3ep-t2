// routes/powerups.js – API pro power-upy
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const db = require('../db');

// GET /api/powerups – vrátí aktuální power-upy hráče
router.get('/api/powerups', requireLogin, async (req, res) => {
  const pups = await db.getPowerUps(req.session.userId);
  res.json(pups);
});

// POST /api/powerups/use – spotřebuje 1 power-up
// body: { type: 'slow'|'double'|'shield'|... }
router.post('/api/powerups/use', requireLogin, async (req, res) => {
  const { type } = req.body;
  const pups = await db.getPowerUps(req.session.userId);
  const pup = pups.find(p => p.type === type);
  if (!pup || pup.amount < 1) return res.json({ ok: false, error: 'Nemáš tento power-up.' });

  await db.usePowerUp(req.session.userId, type);
  res.json({ ok: true });
});

// POST /api/powerups/earn – přidá power-up za výkon ve hře
// body: { type, amount }
router.post('/api/powerups/earn', requireLogin, async (req, res) => {
  const { type, amount = 1 } = req.body;
  await db.addPowerUp(req.session.userId, type, amount);
  res.json({ ok: true });
});

module.exports = router;
