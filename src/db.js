// db.js – Supabase klient
// Tabulky v Supabase:
//   users       (id, username, password_hash, role, skin, created_at)
//   scores      (id, user_id, game, score, created_at)
//   power_ups   (id, user_id, type, amount)

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ── UŽIVATELÉ ──────────────────────────────────────────────

async function findUser(username) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  if (error) return null;
  return data;
}

async function findUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

async function createUser(username, passwordHash) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password_hash: passwordHash, role: 'user', skin: 'default' }])
    .select()
    .single();
  if (error) return { error: error.message };
  return { success: true, user: data };
}

async function updateSkin(userId, skin) {
  const { error } = await supabase
    .from('users')
    .update({ skin })
    .eq('id', userId);
  return !error;
}

// ── SKÓRE ──────────────────────────────────────────────────

// Uloží skóre (vždy nový záznam – žebříček bere MAX za hráče)
async function saveScore(userId, game, score) {
  const { error } = await supabase
    .from('scores')
    .insert([{ user_id: userId, game, score }]);
  return !error;
}

// Žebříček pro danou hru – top N hráčů, každý jen jeho nejlepší výsledek
async function getLeaderboard(game, limit = 10) {
  // Supabase nepodporuje GROUP BY přímo přes JS SDK,
  // proto použijeme RPC funkci definovanou v SQL (viz README/supabase-setup.sql)
  const { data, error } = await supabase
    .rpc('get_leaderboard', { p_game: game, p_limit: limit });
  if (error) return [];
  return data; // [{ username, best_score, rank }]
}

// Nejlepší skóre konkrétního hráče pro danou hru
async function getUserBest(userId, game) {
  const { data, error } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', userId)
    .eq('game', game)
    .order('score', { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  return data.score;
}

// ── POWER-UPY ──────────────────────────────────────────────

async function getPowerUps(userId) {
  const { data, error } = await supabase
    .from('power_ups')
    .select('*')
    .eq('user_id', userId);
  if (error) return [];
  return data;
}

async function addPowerUp(userId, type, amount = 1) {
  // Upsert – pokud už existuje, přičti
  const { data: existing } = await supabase
    .from('power_ups')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .single();

  if (existing) {
    await supabase
      .from('power_ups')
      .update({ amount: existing.amount + amount })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('power_ups')
      .insert([{ user_id: userId, type, amount }]);
  }
}

async function usePowerUp(userId, type) {
  const { data: existing } = await supabase
    .from('power_ups')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .single();
  if (!existing || existing.amount < 1) return false;
  if (existing.amount === 1) {
    await supabase.from('power_ups').delete().eq('id', existing.id);
  } else {
    await supabase.from('power_ups').update({ amount: existing.amount - 1 }).eq('id', existing.id);
  }
  return true;
}

module.exports = {
  findUser, findUserById, createUser, updateSkin,
  saveScore, getLeaderboard, getUserBest,
  getPowerUps, addPowerUp, usePowerUp
};
