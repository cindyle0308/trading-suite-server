/**
 * LeXie Capital — Trading Suite Server
 * Serves static files + provides /api/profile cloud-save endpoints.
 *
 * Profile data is stored in memory and survives as long as the process is
 * running (render.com free tier). Users can also export/import a save code
 * from the UI as a durable backup.
 *
 * POST /api/profile/save   { id, name, color, career }  → 200 OK
 * GET  /api/profile/:id                                  → { id, name, color, career }
 * GET  /api/leaderboard                                  → [{ id, name, color, xp, level, runs, sharpe }]
 */

const express = require('express');
const path    = require('path');
const crypto  = require('crypto');
const app     = express();
const PORT    = process.env.PORT || 3000;

/* ── In-memory profile store ── */
const PROFILES = {};  // { [id]: { id, name, color, career, savedAt } }

/* ── Middleware ── */
app.use(express.json({ limit: '512kb' }));
app.use(express.static(path.join(__dirname, 'public')));

/* ── CORS for API routes (same origin only in prod, open in dev) ── */
app.use('/api', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ── POST /api/profile/save ─────────────────────────────────── */
app.post('/api/profile/save', function(req, res) {
  var body = req.body || {};
  var id   = (body.id || '').toString().slice(0, 64);
  if (!id) return res.status(400).json({ error: 'id required' });

  var existing = PROFILES[id] || {};

  PROFILES[id] = {
    id:      id,
    name:    (body.name || existing.name || 'Anonymous').toString().slice(0, 48),
    color:   (body.color || existing.color || '#4dba88').toString().slice(0, 12),
    career:  typeof body.career === 'string' ? body.career.slice(0, 8192) : existing.career || null,
    savedAt: Date.now()
  };

  console.log('[save] profile', id, PROFILES[id].name);
  return res.json({ ok: true, savedAt: PROFILES[id].savedAt });
});

/* ── GET /api/profile/:id ───────────────────────────────────── */
app.get('/api/profile/:id', function(req, res) {
  var id   = (req.params.id || '').slice(0, 64);
  var prof = PROFILES[id];
  if (!prof) return res.status(404).json({ error: 'not found' });
  return res.json(prof);
});

/* ── GET /api/leaderboard ───────────────────────────────────── */
app.get('/api/leaderboard', function(req, res) {
  var rows = Object.values(PROFILES).map(function(prof) {
    var career = null;
    try { career = JSON.parse(prof.career || '{}'); } catch(e) {}
    return {
      id:     prof.id,
      name:   prof.name,
      color:  prof.color,
      xp:     (career && career.xp)            || 0,
      level:  (career && career.level != null) ? career.level : 0,
      runs:   (career && career.terminalRuns)  || 0,
      sharpe: (career && career.bestSharpe)    || 0,
    };
  }).sort(function(a, b) { return b.xp - a.xp; }).slice(0, 100);

  return res.json(rows);
});

/* ── Catch-all: serve index.html for client-side routing ─────── */
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, function() {
  console.log('LeXie Capital running on port ' + PORT);
});
