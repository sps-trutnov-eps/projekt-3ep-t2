// middleware/auth.js – ochrana stránek vyžadujících přihlášení

function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.role === 'admin') {
    return next();
  }
  res.status(403).send('Přístup odepřen.');
}

module.exports = { requireLogin, requireAdmin };
