// routes/leaderboard.js – žebříček pro všechny 3 hry
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const db = require('../db');

router.get('/leaderboard', requireLogin, async (req, res) => {
  const [snake, dropper, minesweeper] = await Promise.all([
    db.getLeaderboard('snake', 10),
    db.getLeaderboard('dropper', 10),
    db.getLeaderboard('minesweeper', 10),
  ]);

  const dataJson = JSON.stringify({ snake, dropper, minesweeper });

  res.render('leaderboard', {
    username: req.session.username,
    skin: req.session.skin || 'default',
    dataJson
  });
});

module.exports = router;
