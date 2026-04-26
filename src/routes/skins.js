// routes/skins.js
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const db = require('../db');

const SKINS = [
  { id: 'default', name: 'Default',  color: '#00ff88', desc: 'Klasická zelená' },
  { id: 'neon',    name: 'Neon',     color: '#ff00ff', desc: 'Fialová + cyan' },
  { id: 'retro',   name: 'Retro',    color: '#ffaa00', desc: 'Oranžová arcade' },
  { id: 'ice',     name: 'Ice',      color: '#88ddff', desc: 'Ledová modrá' },
  { id: 'blood',   name: 'Blood',    color: '#ff2222', desc: 'Červená temná' },
  { id: 'gold',    name: 'Gold',     color: '#ffd700', desc: 'Zlatá pro šampiony' },
];

router.get('/skiny', requireLogin, (req, res) => {
  res.render('skins', {
    username: req.session.username,
    skin: req.session.skin || 'default',
    skinsJson: JSON.stringify(SKINS),
    currentSkin: req.session.skin || 'default',
  });
});

router.post('/skiny', requireLogin, async (req, res) => {
  const { skin } = req.body;
  const valid = SKINS.map(s => s.id);
  if (!valid.includes(skin)) return res.redirect('/skiny');
  await db.updateSkin(req.session.userId, skin);
  req.session.skin = skin;
  res.redirect('/skiny');
});

module.exports = router;
