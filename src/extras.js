const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// ---- Mock data (nahraď Supabase) ----

const SKINS = [
  { id: 'default',  name: 'Default',    desc: 'Klasický vzhled',       locked: false },
  { id: 'neon',     name: 'Neon',       desc: 'Žluto-zelená záře',     locked: false },
  { id: 'blood',    name: 'Blood',      desc: 'Červené peklo',         locked: false },
  { id: 'ice',      name: 'Ice',        desc: 'Ledový modrý chlad',    locked: false },
  { id: 'gold',     name: 'Gold',       desc: 'VIP zlatý skin',        locked: true  },
  { id: 'void',     name: 'Void',       desc: 'Temná prázdnota',       locked: true  },
];

// Simulovaná DB uložišť (dokud není Supabase)
const userSkins    = {}; // username → skinId
const userStats    = {}; // username → { snake, memory, reaction, gamesPlayed }
const leaderboard  = [
  { username: 'admin',  snake: 42, memory: 14, reaction: 187 },
  { username: 'prokop', snake: 38, memory: 18, reaction: 201 },
  { username: 'jana',   snake: 55, memory: 11, reaction: 224 },
  { username: 'tomas',  snake: 29, memory: 22, reaction: 178 },
  { username: 'lucie',  snake: 61, memory: 9,  reaction: 195 },
];

function getUserSkin(username) {
  return userSkins[username] || 'default';
}
function getUserStats(username) {
  return userStats[username] || { snake: 0, memory: 0, reaction: 0, gamesPlayed: 0 };
}

// ---- Routes ----

// GET /skiny
router.get('/skiny', requireAuth, (req, res) => {
  const username  = req.session.user.username;
  const activeSkin = getUserSkin(username);
  const skinJson  = JSON.stringify(SKINS);
  res.render('skiny.html', { username, activeSkin, skinJson });
});

// POST /skiny – uložení skinu
router.post('/skiny', requireAuth, (req, res) => {
  const username = req.session.user.username;
  const { skinId } = req.body;
  const skin = SKINS.find(s => s.id === skinId && !s.locked);
  if (skin) {
    userSkins[username] = skinId;
    req.session.user.skin = skinId;
  }
  res.redirect('/skiny');
});

// GET /statistiky
router.get('/statistiky', requireAuth, (req, res) => {
  const username = req.session.user.username;
  const stats    = getUserStats(username);
  const skin     = getUserSkin(username);
  res.render('statistiky.html', { username, skin, ...stats });
});

// GET /leaderboard
router.get('/leaderboard', requireAuth, (req, res) => {
  const username = req.session.user.username;
  const skin     = getUserSkin(username);

  // Seřaď podle snake skóre (výchozí)
  const bySnake    = [...leaderboard].sort((a,b) => b.snake - a.snake);
  const byMemory   = [...leaderboard].sort((a,b) => a.memory - b.memory);
  const byReaction = [...leaderboard].sort((a,b) => a.reaction - b.reaction);

  const dataJson = JSON.stringify({ bySnake, byMemory, byReaction });
  res.render('leaderboard.html', { username, skin, dataJson });
});

module.exports = router;
