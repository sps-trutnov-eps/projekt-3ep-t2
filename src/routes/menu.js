// routes/menu.js – hlavní menu
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');

router.get('/menu', requireLogin, (req, res) => {
  res.render('menu', {
    username: req.session.username,
    skin: req.session.skin || 'default'
  });
});

module.exports = router;
