const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'arcade-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hodina
}));

// View engine
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', (filePath, options, callback) => {
  const fs = require('fs');
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) return callback(err);
    // Jednoduchý templating: nahrad {{ proměnné }}
    const rendered = content.replace(/\{\{(\w+)\}\}/g, (_, key) => options[key] ?? '');
    callback(null, rendered);
  });
});

// Routes
app.use('/', authRoutes);
app.use('/', menuRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server běží na http://localhost:${PORT}`);
});
