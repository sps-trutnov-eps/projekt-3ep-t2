// Jednoduchá in-memory databáze uživatelů
// Pro produkci vyměň za skutečnou DB (SQLite, MongoDB, atd.)

const bcrypt = require('bcryptjs');

const users = {};

// Výchozí admin účet
(async () => {
  users['admin'] = {
    username: 'admin',
    password: await bcrypt.hash('1234', 10),
    role: 'admin',
    createdAt: new Date().toISOString()
  };
})();

function findUser(username) {
  return users[username] || null;
}

async function createUser(username, password) {
  if (users[username]) return { error: 'Uživatel již existuje' };
  if (username.length < 2) return { error: 'Jméno musí mít alespoň 2 znaky' };
  if (password.length < 4) return { error: 'Heslo musí mít alespoň 4 znaky' };

  const hashed = await bcrypt.hash(password, 10);
  users[username] = {
    username,
    password: hashed,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  return { success: true };
}

async function verifyUser(username, password) {
  const user = findUser(username);
  if (!user) return false;
  return await bcrypt.compare(password, user.password);
}

module.exports = { findUser, createUser, verifyUser };
