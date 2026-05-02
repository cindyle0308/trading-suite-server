/**
 * LeXie Capital — Core Career & Progression System
 * lexie-core.js  v1.0
 *
 * Include AFTER instruments.js on every page.
 * Exposes: LX, lxXP, lxLevel, lxUnlock, lxEvent, lxDailyState
 */

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
  { id:'terminal',        name:'Quant Research Lab',   icon:'🖥️',  file:'terminal.html',       minLevel:0, desc:'Build and backtest alpha factors in Python-style.' },
  { id:'spread-trader',   name:'Pairs Research Desk',  icon:'⚖️',  file:'spread-trader.html',  minLevel:1, desc:'Research co-integrated pairs and trade mean-reversion.' },
  { id:'momentum-trainer',name:'Trend & Momentum Desk',icon:'🚀',  file:'momentum-trainer.html',minLevel:2,desc:'Ride multi-timeframe momentum across 30 instruments.' },
  { id:'regime-rider',    name:'Macro Strategy Desk',  icon:'🌐',  file:'regime-rider.html',   minLevel:4, desc:'Navigate rate cycles, inflation regimes and risk-off.' },
  { id:'price-war',       name:'Market Making Desk',   icon:'🎯',  file:'price-war.html',      minLevel:2, desc:'Quote two-sided markets and manage inventory risk.' },
  { id:'algo-blitz',      name:'Quant Tech Interview', icon:'💻',  file:'algo-blitz.html',     minLevel:1, desc:'Solve signal and data-structure puzzles under pressure.' },
  { id:'arbitrage-sprint',name:'Arb & Relative Value', icon:'🔗',  file:'arbitrage-sprint.html',minLevel:3,desc:'Exploit mispricings across linked instruments.' },
  { id:'bot-builder',     name:'Algorithm Lab',        icon:'🤖',  file:'bot-builder.html',    minLevel:2, desc:'Wire up execution logic for your alpha signals.' },
  { id:'cmi-challenge',   name:'Portfolio Manager Desk',icon:'📂', file:'cmi-challenge.html',  minLevel:3, desc:'Run a multi-asset book with risk limits and drawdown controls.' },
  { id:'quant-relay',     name:'Research Sprint Desk', icon:'🏃',  file:'quant-relay.html',    minLevel:1, desc:'Time-boxed quant research sprints across factor families.' },
  { id:'alpha-factory',   name:'Alt Data Lab',         icon:'🧪',  file:'alpha-factory.html',  minLevel:3, desc:'Mine alternative data signals and measure IC decay.' },
  { id:'basket-blitz',    name:'ETF & Index Desk',     icon:'🧺',  file:'basket-blitz.html',   minLevel:2, desc:'Decompose factor exposure in baskets and hedge the residual.' },
  { id:'options-outcry',  name:'Options Pit',          icon:'📣',  file:'options-outcry.html', minLevel:4, desc:'Price and trade vanilla options with live Greeks.' },
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

  return {
    addXP, visitDesk, recordRun, recordStrategySaved, recordDailyChallenge,
    getState, getLevelInfo, canAccess, getMissions,
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
    const info = LX.getLevelInfo();

    const hud = document.createElement('div');
    hud.id = 'lx-hud';
    hud.style.cssText = `
      position:fixed; bottom:16px; right:16px; z-index:9999;
      background:rgba(15,15,20,0.92); border:1px solid rgba(255,255,255,0.08);
      border-radius:12px; padding:10px 14px; min-width:200px;
      font-family:'Inter',sans-serif; font-size:12px; color:#c0cfe0;
      backdrop-filter:blur(8px); box-shadow:0 4px 24px rgba(0,0,0,0.5);
      cursor:pointer; transition:all .2s;
    `;
    hud.title = 'LeXie Career Progress';
    hud.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span id="lx-hud-badge" style="font-size:18px">${info.badge}</span>
        <div>
          <div style="font-weight:700;color:#e8f0fe;font-size:11px" id="lx-hud-title">${info.title}</div>
          <div style="color:#667eea;font-size:10px" id="lx-hud-xp">${info.xp.toLocaleString()} XP</div>
        </div>
        <a href="index.html" style="margin-left:auto;font-size:11px;color:#667eea;text-decoration:none" title="Lobby">🏦</a>
      </div>
      <div style="background:rgba(255,255,255,0.08);border-radius:4px;height:4px;overflow:hidden">
        <div id="lx-hud-bar" style="background:linear-gradient(90deg,#667eea,#764ba2);height:100%;width:${info.pct}%;transition:width .4s"></div>
      </div>
      <div style="margin-top:4px;color:#667eea;font-size:10px" id="lx-hud-next">${info.next ? `${info.xpInLevel}/${info.xpToNext} to ${info.next.title}` : 'MAX LEVEL'}</div>
    `;

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
    const color = type === 'xp' ? '#667eea' : type === 'level' ? '#ffd700' : '#28a745';
    const t = document.createElement('div');
    t.style.cssText = `
      background:rgba(15,15,20,0.95); border-left:3px solid ${color};
      color:#e8f0fe; padding:8px 14px; border-radius:8px; font-size:12px;
      font-family:'Inter',sans-serif; box-shadow:0 2px 12px rgba(0,0,0,0.4);
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
      background:linear-gradient(135deg,rgba(40,60,30,0.97),rgba(20,40,15,0.97));
      border:1px solid #28a745; border-radius:10px; padding:12px 16px;
      font-family:'Inter',sans-serif; color:#e8f0fe;
      box-shadow:0 4px 20px rgba(40,167,69,0.3);
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
