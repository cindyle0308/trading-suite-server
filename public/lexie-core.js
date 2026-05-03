/**
 * LeXie Capital — Core Career & Progression System
 * lexie-core.js  v1.1
 *
 * Include AFTER instruments.js on every page.
 * Exposes: LX, lxXP, lxLevel, lxUnlock, lxEvent, lxDailyState, lxTheme
 */

/* ─── THEME SYSTEM — runs immediately so there's no flash ────────── */
(function applyTheme() {
  var saved = localStorage.getItem('lx_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  // Expose globally
  window.lxTheme = {
    get: function() { return localStorage.getItem('lx_theme') || 'dark'; },
    set: function(t) {
      localStorage.setItem('lx_theme', t);
      document.documentElement.setAttribute('data-theme', t);
      var btn = document.getElementById('lx-theme-btn');
      if (btn) btn.textContent = t === 'light' ? '☾' : '☀';
      var btn2 = document.getElementById('lx-theme-btn-2');
      if (btn2) btn2.textContent = t === 'light' ? '☾' : '☀';
    },
    toggle: function() {
      window.lxTheme.set(window.lxTheme.get() === 'dark' ? 'light' : 'dark');
    },
    isDark: function() { return window.lxTheme.get() === 'dark'; }
  };
})();

/* ─── Constants ───────────────────────────────────────────────────── */
const LX_STORAGE_KEY = 'lexie_career_v1';
const LX_SESSION_KEY = 'lexie_session_v1';

const LX_LEVELS = [
  { title:'Intern',            minXP:0,     badge:'🎓', color:'#6c757d', perks:['Terminal access','Basic backtesting'] },
  { title:'Junior Analyst',   minXP:500,   badge:'📊', color:'#17a2b8', perks:['Strategy Library (10 slots)','Pairs Desk access'] },
  { title:'Analyst',          minXP:1500,  badge:'📈', color:'#28a745', perks:['Walk-Forward testing','Trend Desk access','Scenario comparison'] },
  { title:'Senior Analyst',   minXP:3500,  badge:'⚡', color:'#ffc107', perks:['Strategy Library (30 slots)','Regime Attribution','IC at all horizons'] },
  { title:'Associate',        minXP:7000,  badge:'🏆', color:'#fd7e14', perks:['Macro Desk access','Options Pit','Weekly Tournaments'] },
  { title:'VP',               minXP:13000, badge:'💎', color:'#6610f2', perks:['Full firm access','Custom Seasons','Leaderboard featured'] },
  { title:'Managing Director',minXP:25000, badge:'👑', color:'#dc3545', perks:['Mentor mode','API export','White-label dashboard'] },
];

const LX_DESKS = [
  { id:'terminal',        name:'Research Terminal',    icon:'🖥️',  file:'terminal.html',          minLevel:0, desc:'Build and backtest alpha factors in Python-style.' },
  { id:'spread-trader',   name:'Spread Trader',        icon:'⚖️',  file:'spread-trader.html',     minLevel:1, desc:'Code or manually trade co-integrated pairs via z-score mean-reversion.' },
  { id:'momentum-trainer',name:'Momentum Trainer',     icon:'🚀',  file:'momentum-trainer.html',  minLevel:2, desc:'Code or manually ride SMA crossover momentum across instruments.' },
  { id:'regime-rider',    name:'Regime Rider',         icon:'🌐',  file:'regime-rider.html',      minLevel:4, desc:'Navigate rate cycles, inflation regimes and risk-off.' },
  { id:'price-war',       name:'Price War',            icon:'🎯',  file:'price-war.html',         minLevel:2, desc:'Code or manually quote two-sided markets and manage inventory risk.' },
  { id:'algo-blitz',      name:'Algo Blitz',           icon:'💻',  file:'algo-blitz.html',        minLevel:1, desc:'Solve signal and data-structure puzzles under pressure.' },
  { id:'arbitrage-sprint',name:'Arbitrage Sprint',     icon:'🔗',  file:'arbitrage-sprint.html',  minLevel:3, desc:'Exploit mispricings across linked instruments.' },
  { id:'bot-builder',     name:'Bot Builder',          icon:'🤖',  file:'bot-builder.html',       minLevel:2, desc:'Wire up execution logic for your alpha signals.' },
  { id:'cmi-challenge',   name:'CMI Challenge',        icon:'📂',  file:'cmi-challenge.html',     minLevel:3, desc:'Run a multi-asset book with risk limits and drawdown controls.' },
  { id:'quant-relay',     name:'Quant Relay',          icon:'🏃',  file:'quant-relay.html',       minLevel:1, desc:'Time-boxed quant research sprints across factor families.' },
  { id:'alpha-factory',   name:'Alpha Factory',        icon:'🧪',  file:'alpha-factory.html',     minLevel:3, desc:'Mine alternative data signals and measure IC decay.' },
  { id:'basket-blitz',    name:'Basket Blitz',         icon:'🧺',  file:'basket-blitz.html',      minLevel:2, desc:'Decompose factor exposure in baskets and hedge the residual.' },
  { id:'options-outcry',  name:'Options Outcry',       icon:'📣',  file:'options-outcry.html',    minLevel:4, desc:'Price and trade vanilla options with live Greeks.' },
];

const LX_MISSIONS = [
  /* Onboarding */
  { id:'first_run',     title:'First Signal',         desc:'Run your first strategy in the Quant Lab.',     xp:50,  icon:'🚀', desk:'terminal',         check: s => s.terminalRuns >= 1 },
  { id:'first_bt',      title:'First Backtest',       desc:'Run a full 20-market backtest.',                xp:100, icon:'📊', desk:'terminal',         check: s => s.backtests >= 1 },
  { id:'first_pairs',   title:'Pair Identified',      desc:'Complete a pairs research session.',             xp:80,  icon:'⚖️', desk:'spread-trader',    check: s => s.pairsSessions >= 1 },
  /* Skill */
  { id:'sharpe_1',      title:'Sharpe > 1',           desc:'Achieve Sharpe ratio above 1.0 in backtest.',   xp:150, icon:'⚡', desk:'terminal',         check: s => s.bestSharpe >= 1.0 },
  { id:'sharpe_2',      title:'Sharpe > 2',           desc:'Achieve Sharpe ratio above 2.0.',                xp:300, icon:'💫', desk:'terminal',         check: s => s.bestSharpe >= 2.0 },
  { id:'wf_pass',       title:'Walk-Forward Winner',  desc:'Pass a walk-forward validation (OOS>IS*0.5).',  xp:200, icon:'🏅', desk:'terminal',         check: s => s.walkFwdPass >= 1 },
  { id:'ic_pos',        title:'IC Positive',          desc:'Achieve positive IC at 5-bar horizon.',          xp:100, icon:'📡', desk:'terminal',         check: s => s.bestIC5 > 0 },
  { id:'ic_great',      title:'IC > 0.05',            desc:'Achieve IC > 0.05 at 1-bar horizon.',            xp:200, icon:'🎯', desk:'terminal',         check: s => s.bestIC1 > 0.05 },
  /* Breadth */
  { id:'three_desks',   title:'Floor Pass',           desc:'Visit 3 different desks.',                       xp:120, icon:'🗝️', desk:null,              check: s => s.desksVisited.size >= 3 },
  { id:'all_desks',     title:'Full Floor Access',    desc:'Visit every desk.',                              xp:500, icon:'🏛️', desk:null,              check: s => s.desksVisited.size >= LX_DESKS.length },
  { id:'daily_3',       title:'3-Day Streak',         desc:'Complete a daily challenge 3 days in a row.',    xp:150, icon:'🔥', desk:null,              check: s => s.dailyStreak >= 3 },
  { id:'daily_7',       title:'Week Warrior',         desc:'7-day daily challenge streak.',                  xp:400, icon:'🌟', desk:null,              check: s => s.dailyStreak >= 7 },
  /* Volume */
  { id:'runs_25',       title:'25 Runs',              desc:'Run 25 strategies.',                             xp:100, icon:'🔁', desk:'terminal',         check: s => s.terminalRuns >= 25 },
  { id:'runs_100',      title:'100 Runs',             desc:'Run 100 strategies.',                            xp:250, icon:'💯', desk:'terminal',         check: s => s.terminalRuns >= 100 },
  { id:'strategy_5',    title:'Strategy Collector',   desc:'Save 5 strategies to the library.',              xp:100, icon:'📚', desk:'terminal',         check: s => s.strategiesSaved >= 5 },
  { id:'strategy_15',   title:'Research Library',     desc:'Save 15 strategies.',                            xp:200, icon:'🏦', desk:'terminal',         check: s => s.strategiesSaved >= 15 },
  /* Pairs */
  { id:'pairs_10',      title:'Spread Researcher',    desc:'Complete 10 pairs sessions.',                    xp:150, icon:'🔗', desk:'spread-trader',    check: s => s.pairsSessions >= 10 },
  { id:'pairs_sharpe',  title:'Pairs Edge',           desc:'Achieve Sharpe > 1 on a pairs strategy.',        xp:200, icon:'⚖️', desk:'spread-trader',    check: s => s.pairsBestSharpe >= 1.0 },
  /* Momentum */
  { id:'trend_5',       title:'Trend Spotter',        desc:'Complete 5 trend desk sessions.',                xp:100, icon:'🚀', desk:'momentum-trainer', check: s => s.trendSessions >= 5 },
  { id:'trend_sharpe',  title:'Momentum Edge',        desc:'Achieve Sharpe > 1.2 on trend strategy.',        xp:200, icon:'📈', desk:'momentum-trainer', check: s => s.trendBestSharpe >= 1.2 },
];

/* ─── Debounced cloud sync ────────────────────────────────────────── */
var _syncTimer = null;
function _debouncedSync() {
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(function(){ if (window.LX) window.LX.syncProfile(); }, 2000);
}

/* ─── State management ────────────────────────────────────────────── */
function _defaultState() {
  return {
    xp: 0,
    level: 0,
    missionsCompleted: [],
    terminalRuns: 0,
    backtests: 0,
    walkFwdPass: 0,
    bestSharpe: 0,
    bestIC1: 0,
    bestIC5: 0,
    strategiesSaved: 0,
    pairsSessions: 0,
    pairsBestSharpe: 0,
    trendSessions: 0,
    trendBestSharpe: 0,
    desksVisited: [],       // stored as array, converted to Set on load
    dailyStreak: 0,
    lastDailyDate: null,
    totalPnl: 0,
    notifications: [],
    createdAt: Date.now(),
  };
}

function _load() {
  try {
    const raw = localStorage.getItem(LX_STORAGE_KEY);
    if (!raw) return _defaultState();
    const s = JSON.parse(raw);
    s.desksVisited = new Set(s.desksVisited || []);
    return s;
  } catch(e) { return _defaultState(); }
}

function _save(state) {
  try {
    const toSave = Object.assign({}, state);
    toSave.desksVisited = [...state.desksVisited];
    localStorage.setItem(LX_STORAGE_KEY, JSON.stringify(toSave));
  } catch(e) {}
}

/* ─── Public API: LX object ───────────────────────────────────────── */
const LX = (() => {
  let state = _load();

  function levelFor(xp) {
    let lv = 0;
    for (let i = LX_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LX_LEVELS[i].minXP) { lv = i; break; }
    }
    return lv;
  }

  function addXP(amount, reason) {
    state.xp += amount;
    const newLevel = levelFor(state.xp);
    const promoted = newLevel > state.level;
    state.level = newLevel;
    _save(state);

    _notify(`+${amount} XP — ${reason}`, 'xp');

    if (promoted) {
      const lv = LX_LEVELS[newLevel];
      _notify(`Promoted to ${lv.badge} ${lv.title}!`, 'level');
    }

    _checkMissions();
    _renderHUDs();
    _debouncedSync();
    return { xp: state.xp, level: state.level, promoted };
  }

  function _notify(msg, type) {
    state.notifications.unshift({ msg, type, ts: Date.now() });
    if (state.notifications.length > 50) state.notifications.length = 50;
    _save(state);
    _dispatchEvent('lx:notify', { msg, type });
  }

  function _checkMissions() {
    const completed = new Set(state.missionsCompleted);
    LX_MISSIONS.forEach(m => {
      if (completed.has(m.id)) return;
      if (m.check(state)) {
        completed.add(m.id);
        state.missionsCompleted = [...completed];
        state.xp += m.xp;
        _save(state);
        _notify(`Mission complete: ${m.title} +${m.xp} XP`, 'mission');
        _dispatchEvent('lx:mission', m);
      }
    });
  }

  function _dispatchEvent(name, detail) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    }
  }

  function visitDesk(deskId) {
    state.desksVisited.add(deskId);
    _save(state);
    _checkMissions();
  }

  function recordRun(opts = {}) {
    // opts: { sharpe, ic1, ic5, isBacktest, isWalkFwd, wfPassed, desk, pnl }
    state.terminalRuns++;
    if (opts.isBacktest) state.backtests++;
    if (opts.isWalkFwd && opts.wfPassed) state.walkFwdPass++;
    if (opts.sharpe > state.bestSharpe) state.bestSharpe = opts.sharpe;
    if (opts.ic1 > state.bestIC1) state.bestIC1 = opts.ic1;
    if (opts.ic5 > state.bestIC5) state.bestIC5 = opts.ic5;
    if (opts.pnl) state.totalPnl += opts.pnl;

    if (opts.desk === 'spread-trader') {
      state.pairsSessions++;
      if (opts.sharpe > state.pairsBestSharpe) state.pairsBestSharpe = opts.sharpe;
    }
    if (opts.desk === 'momentum-trainer') {
      state.trendSessions++;
      if (opts.sharpe > state.trendBestSharpe) state.trendBestSharpe = opts.sharpe;
    }

    // XP awards
    let xpGained = 5;  // base for any run
    if (opts.isBacktest) xpGained += 15;
    if (opts.isWalkFwd)  xpGained += 25;
    if (opts.sharpe > 1) xpGained += 30;
    if (opts.sharpe > 2) xpGained += 50;
    if (opts.ic1 > 0.05) xpGained += 20;

    _save(state);
    _checkMissions();
    return addXP(xpGained, opts.isBacktest ? 'Backtest run' : 'Strategy run');
  }

  function recordStrategySaved() {
    state.strategiesSaved++;
    _save(state);
    _checkMissions();
    return addXP(10, 'Strategy saved');
  }

  function recordDailyChallenge() {
    const today = new Date().toISOString().slice(0,10);
    if (state.lastDailyDate === today) return; // already done
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
    state.dailyStreak = (state.lastDailyDate === yesterday) ? (state.dailyStreak + 1) : 1;
    state.lastDailyDate = today;
    _save(state);
    _checkMissions();
    return addXP(30 * state.dailyStreak, `Daily challenge (streak ${state.dailyStreak})`);
  }

  function getState() { return state; }

  function getLevelInfo() {
    const lv = LX_LEVELS[state.level];
    const next = LX_LEVELS[state.level + 1];
    const xpInLevel = state.xp - lv.minXP;
    const xpToNext  = next ? (next.minXP - lv.minXP) : 1;
    const pct = next ? Math.min(100, Math.floor(xpInLevel / xpToNext * 100)) : 100;
    return { ...lv, index: state.level, xp: state.xp, xpInLevel, xpToNext, pct, next };
  }

  function canAccess(deskId) {
    const desk = LX_DESKS.find(d => d.id === deskId);
    if (!desk) return true;
    return state.level >= desk.minLevel;
  }

  function getMissions() {
    const done = new Set(state.missionsCompleted);
    return LX_MISSIONS.map(m => ({
      ...m,
      completed: done.has(m.id),
      progress: _missionProgress(m),
    }));
  }

  function _missionProgress(m) {
    // Return [current, max] for progress bar where possible
    const s = state;
    const map = {
      first_run:    [s.terminalRuns, 1],
      first_bt:     [s.backtests, 1],
      first_pairs:  [s.pairsSessions, 1],
      runs_25:      [s.terminalRuns, 25],
      runs_100:     [s.terminalRuns, 100],
      strategy_5:   [s.strategiesSaved, 5],
      strategy_15:  [s.strategiesSaved, 15],
      three_desks:  [s.desksVisited.size, 3],
      all_desks:    [s.desksVisited.size, LX_DESKS.length],
      daily_3:      [s.dailyStreak, 3],
      daily_7:      [s.dailyStreak, 7],
      pairs_10:     [s.pairsSessions, 10],
      trend_5:      [s.trendSessions, 5],
    };
    return map[m.id] || null;
  }

  function _renderHUDs() {
    _dispatchEvent('lx:update', getLevelInfo());
  }

  // Reset (dev only)
  function _reset() {
    localStorage.removeItem(LX_STORAGE_KEY);
    state = _defaultState();
    _save(state);
    location.reload();
  }

  /* ── Cloud sync ─────────────────────────────────────────────── */
  function syncProfile() {
    // Reads active profile ID from localStorage and POSTs career data to server.
    // Falls back silently if server is unavailable.
    try {
      var activeId = localStorage.getItem('lx_active_profile');
      if (!activeId) return;
      var profs = JSON.parse(localStorage.getItem('lx_profiles_v2') || '{}');
      var prof  = profs[activeId];
      if (!prof) return;
      var payload = {
        id:     activeId,
        name:   prof.name,
        color:  prof.color,
        career: localStorage.getItem(LX_STORAGE_KEY) || null
      };
      fetch('/api/profile/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function(){});  // silent fail — localStorage is the source of truth
    } catch(e) {}
  }

  return {
    addXP, visitDesk, recordRun, recordStrategySaved, recordDailyChallenge,
    getState, getLevelInfo, canAccess, getMissions, syncProfile,
    levels: LX_LEVELS, desks: LX_DESKS, missions: LX_MISSIONS,
    _reset,
  };
})();

/* ─── Daily state (seeded per calendar date) ─────────────────────── */
function lxDailyState() {
  const dateNum = parseInt(new Date().toISOString().slice(0,10).replace(/-/g,''));
  return getLXDailyInstruments ? getLXDailyInstruments(dateNum) : null;
}

/* ─── HUD widget injected into every page ────────────────────────── */
(function injectHUD() {
  if (typeof document === 'undefined') return;

  document.addEventListener('DOMContentLoaded', () => {
    // Skip HUD on the lobby — the sidebar renders career info there instead
    if (document.body.dataset.noHud === 'true') return;

    const info = LX.getLevelInfo();

    const hud = document.createElement('div');
    hud.id = 'lx-hud';
    // Use CSS vars from lx-design.css so it respects dark/light theme
    hud.style.cssText = `
      position:fixed; bottom:16px; right:16px; z-index:9999;
      background:var(--bg-elevated,#282420); border:1.5px solid var(--border-dim,#332e28);
      border-radius:14px; padding:10px 14px; min-width:210px;
      font-family:'Sora','Inter',sans-serif; font-size:12px; color:var(--fg-secondary,#b8b0a8);
      box-shadow:var(--shadow-card,0 4px 24px rgba(0,0,0,0.4));
      user-select:none;
    `;
    hud.title = 'LeXie Career Progress — click to go to Lobby';
    const themeIcon = window.lxTheme.isDark() ? '☀' : '☾';
    hud.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span id="lx-hud-badge" style="font-size:18px;line-height:1">${info.badge}</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;color:var(--fg-bright,#f0ebe4);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" id="lx-hud-title">${info.title}</div>
          <div style="color:var(--green,#4dba88);font-size:10px;font-family:'DM Mono',monospace" id="lx-hud-xp">${info.xp.toLocaleString()} XP</div>
        </div>
        <button id="lx-theme-btn" title="Toggle light/dark mode" style="background:none;border:1px solid var(--border-mid,#484038);border-radius:6px;color:var(--fg-subtle,#6a6058);font-size:12px;cursor:pointer;padding:2px 6px;line-height:1.4;flex-shrink:0">${themeIcon}</button>
        <a href="index.html" style="flex-shrink:0;font-size:14px;color:var(--fg-subtle,#6a6058);text-decoration:none;line-height:1" title="Lobby">⌂</a>
      </div>
      <div style="background:var(--bg-overlay,#302b26);border-radius:var(--r-pill,999px);height:4px;overflow:hidden">
        <div id="lx-hud-bar" style="background:linear-gradient(90deg,var(--green,#4dba88),var(--coral,#d4728a));height:100%;width:${info.pct}%;transition:width .4s ease"></div>
      </div>
      <div style="margin-top:4px;color:var(--fg-subtle,#6a6058);font-size:10px;font-family:'DM Mono',monospace" id="lx-hud-next">${info.next ? `${info.xpInLevel}/${info.xpToNext} → ${info.next.title}` : '✦ MAX LEVEL'}</div>
    `;

    // Theme toggle — stop propagation so it doesn't navigate to lobby
    hud.querySelector('#lx-theme-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      window.lxTheme.toggle();
    });
    // Click elsewhere on HUD navigates to lobby
    hud.addEventListener('click', () => { window.location.href = 'index.html'; });

    document.body.appendChild(hud);

    // Notification toast area
    const toastArea = document.createElement('div');
    toastArea.id = 'lx-toasts';
    toastArea.style.cssText = `
      position:fixed; bottom:90px; right:16px; z-index:10000;
      display:flex; flex-direction:column-reverse; gap:8px;
      pointer-events:none;
    `;
    document.body.appendChild(toastArea);

    // Listen for updates
    window.addEventListener('lx:update', e => {
      const d = e.detail;
      document.getElementById('lx-hud-badge').textContent = d.badge;
      document.getElementById('lx-hud-title').textContent = d.title;
      document.getElementById('lx-hud-xp').textContent    = d.xp.toLocaleString() + ' XP';
      document.getElementById('lx-hud-bar').style.width   = d.pct + '%';
      document.getElementById('lx-hud-next').textContent  = d.next
        ? `${d.xpInLevel}/${d.xpToNext} to ${d.next.title}` : 'MAX LEVEL';
    });

    window.addEventListener('lx:notify', e => {
      _showToast(e.detail.msg, e.detail.type);
    });

    window.addEventListener('lx:mission', e => {
      _showMissionBanner(e.detail);
    });

    // Mark desk visit
    const page = document.body.dataset.desk || location.pathname.split('/').pop().replace('.html','');
    if (page) LX.visitDesk(page);
  });

  function _showToast(msg, type) {
    const area = document.getElementById('lx-toasts');
    if (!area) return;
    const color = type === 'xp' ? 'var(--green,#4dba88)' : type === 'level' ? 'var(--amber,#cc9438)' : 'var(--green,#4dba88)';
    const t = document.createElement('div');
    t.style.cssText = `
      background:var(--bg-elevated,#282420); border-left:3px solid ${color};
      border:1.5px solid var(--border-mid,#484038); border-left:3px solid ${color};
      color:var(--fg-primary,#d4cdc6); padding:8px 14px; border-radius:8px; font-size:12px;
      font-family:'Sora','Inter',sans-serif; box-shadow:var(--shadow-card,0 2px 12px rgba(0,0,0,0.4));
      opacity:0; transform:translateX(20px); transition:all .3s;
      pointer-events:none; white-space:nowrap;
    `;
    t.textContent = msg;
    area.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity='1'; t.style.transform='translateX(0)'; });
    setTimeout(() => { t.style.opacity='0'; setTimeout(() => t.remove(), 400); }, 3000);
  }

  function _showMissionBanner(mission) {
    const area = document.getElementById('lx-toasts');
    if (!area) return;
    const t = document.createElement('div');
    t.style.cssText = `
      background:var(--bg-elevated,#282420);
      border:1.5px solid var(--green,#4dba88); border-radius:10px; padding:12px 16px;
      font-family:'Sora','Inter',sans-serif; color:var(--fg-primary,#d4cdc6);
      box-shadow:0 4px 20px rgba(77,186,136,0.2);
      opacity:0; transform:translateX(20px); transition:all .3s;
      pointer-events:none; max-width:260px;
    `;
    t.innerHTML = `
      <div style="font-size:18px;margin-bottom:2px">${mission.icon} Mission Complete!</div>
      <div style="font-weight:700;font-size:12px;color:#5ced73">${mission.title}</div>
      <div style="font-size:11px;color:#adb5bd;margin-top:2px">+${mission.xp} XP</div>
    `;
    area.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity='1'; t.style.transform='translateX(0)'; });
    setTimeout(() => { t.style.opacity='0'; setTimeout(() => t.remove(), 400); }, 5000);
  }
})();

/* ─── Expose globals ─────────────────────────────────────────────── */
window.LX          = LX;
window.LX_LEVELS   = LX_LEVELS;
window.LX_DESKS    = LX_DESKS;
window.LX_MISSIONS = LX_MISSIONS;
window.lxDailyState = lxDailyState;
