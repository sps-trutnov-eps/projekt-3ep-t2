require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const authRoutes        = require('./routes/auth');
const menuRoutes        = require('./routes/menu');
const gameRoutes        = require('./routes/games');
const leaderboardRoutes = require('./routes/leaderboard');
const skinsRoutes       = require('./routes/skins');
const powerupsRoutes    = require('./routes/powerups');
const helpRoutes        = require('./routes/help');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'arcade-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 4 }
}));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', (filePath, options, callback) => {
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) return callback(err);
    const rendered = content.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const val = options[key];
      return val === undefined ? '' : val;
    });
    callback(null, rendered);
  });
});

app.use('/', authRoutes);
app.use('/', menuRoutes);
app.use('/', gameRoutes);
app.use('/', leaderboardRoutes);
app.use('/', skinsRoutes);
app.use('/', powerupsRoutes);
app.use('/', helpRoutes);

app.use((req, res) => {
  res.status(404).send('<h2>404 – stránka nenalezena</h2><a href="/menu">← Zpět do menu</a>');
});

app.listen(PORT, () => {
  console.log(`✅ Server běží na http://localhost:${PORT}`);
});
