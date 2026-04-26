const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');

router.get('/napoveda', requireLogin, (req, res) => {
  res.render('help', {
    username: req.session.username,
    skin: req.session.skin || 'default',
  });
});

module.exports = router;
