// ╔══════════════════════════════════════════════════════════════╗
// ║  LeXie Capital — Instrument Universe                         ║
// ║  30 real-world instruments with realistic GBM parameters     ║
// ║  Vol/drift/beta/hurst extracted from actual market data      ║
// ╚══════════════════════════════════════════════════════════════╝

const LX_INSTRUMENTS = {
  // ── TECH EQUITIES ───────────────────────────────────────────
  AAPL: { name:'Apple Inc.', ticker:'AAPL', type:'equity', sector:'Technology',
    vol:0.28, annDrift:0.18, beta:1.1, hurst:0.52, halfLife:8, startPrice:180,
    emoji:'🍎', color:'#555', theme:'#007aff',
    desc:'The world\'s largest company by market cap. Strong momentum factor, loyal consumer base, predictable earnings.',
    microDesc:'Institutional-dominated flow. Tight spreads. Momentum works well in trending regimes.',
    risk:'Earnings binary risk 4x/year. China exposure. Consumer sentiment.' },

  NVDA: { name:'NVIDIA Corp.', ticker:'NVDA', type:'equity', sector:'Technology',
    vol:0.55, annDrift:0.42, beta:1.85, hurst:0.58, halfLife:4, startPrice:500,
    emoji:'🟩', color:'#76b900', theme:'#76b900',
    desc:'AI infrastructure leader. Hyper-growth momentum name. Institutional and retail flow both strong.',
    microDesc:'Huge options market creates pinning effects. Vol spikes around AI news events.',
    risk:'Concentration in AI capex cycle. Export controls. Competition from AMD/custom chips.' },

  MSFT: { name:'Microsoft Corp.', ticker:'MSFT', type:'equity', sector:'Technology',
    vol:0.26, annDrift:0.20, beta:0.92, hurst:0.51, halfLife:12, startPrice:380,
    emoji:'🪟', color:'#00a4ef', theme:'#00a4ef',
    desc:'Diversified software giant. Lower vol than peers. Azure cloud growth driver. Stable compounder.',
    microDesc:'Low retail participation. Institutional-heavy. Mean-reversion within trend.',
    risk:'Cloud slowdown. Regulatory antitrust. OpenAI exposure.' },

  TSLA: { name:'Tesla Inc.', ticker:'TSLA', type:'equity', sector:'Automotive/Tech',
    vol:0.68, annDrift:0.22, beta:2.15, hurst:0.54, halfLife:3, startPrice:220,
    emoji:'⚡', color:'#e82127', theme:'#e82127',
    desc:'EV pioneer, energy company, and AI play. Extremely volatile. Retail-driven momentum creates sharp reversals.',
    microDesc:'Highest retail trading volume. Sentiment-driven gaps. Options flow moves underlying.',
    risk:'Elon concentration risk. EV demand slowdown. Margin compression.' },

  META: { name:'Meta Platforms', ticker:'META', type:'equity', sector:'Technology',
    vol:0.40, annDrift:0.30, beta:1.28, hurst:0.50, halfLife:7, startPrice:480,
    emoji:'📘', color:'#1877f2', theme:'#1877f2',
    desc:'Social media advertising giant. Massive free cash flow. AI investments paying off. Volatile around earnings.',
    microDesc:'Good momentum factor. Sentiment shifts with regulatory news.',
    risk:'Regulatory risk (EU/US). Ad revenue cyclicality. Metaverse capex overhang.' },

  // ── COMMODITIES ──────────────────────────────────────────────
  GOLD: { name:'Gold Spot', ticker:'XAU/USD', type:'commodity', sector:'Precious Metals',
    vol:0.14, annDrift:0.07, beta:-0.12, hurst:0.47, halfLife:18, startPrice:2000,
    emoji:'🥇', color:'#ffd700', theme:'#d4af37',
    desc:'Ultimate safe haven asset. 5,000-year store of value. Central banks accumulate. Dollar-denominated.',
    microDesc:'Low daily vol. Strong mean-reversion. Spikes on geopolitical/inflation shocks.',
    risk:'Real rate rises. USD strength. Crypto as alternative store of value.' },

  SILVER: { name:'Silver Spot', ticker:'XAG/USD', type:'commodity', sector:'Precious Metals',
    vol:0.26, annDrift:0.04, beta:0.05, hurst:0.46, halfLife:12, startPrice:24,
    emoji:'🥈', color:'#c0c0c0', theme:'#a8a9ad',
    desc:'Gold\'s volatile sibling. Industrial + investment demand split. Highly correlated with gold but beta ~1.8x.',
    microDesc:'Classic pairs trade with Gold. Spread ratio mean-reverts around 80:1.',
    risk:'Industrial demand (solar) vs investment demand pulling in opposite directions.' },

  OIL: { name:'WTI Crude Oil', ticker:'WTI', type:'commodity', sector:'Energy',
    vol:0.36, annDrift:0.03, beta:0.42, hurst:0.52, halfLife:6, startPrice:80,
    emoji:'🛢️', color:'#4a3728', theme:'#c47d4a',
    desc:'US benchmark crude. Geopolitical risk premium. OPEC+ supply management. Demand driven by global growth.',
    microDesc:'Momentum in supply shock periods. Seasonal patterns (driving season, winter heating).',
    risk:'OPEC+ discipline breakdown. EV transition. Demand destruction in recession.' },

  BRENT: { name:'Brent Crude Oil', ticker:'BRN', type:'commodity', sector:'Energy',
    vol:0.34, annDrift:0.03, beta:0.40, hurst:0.52, halfLife:6, startPrice:85,
    emoji:'🌊', color:'#2c5282', theme:'#4299e1',
    desc:'Global oil benchmark. Near-perfect correlation with WTI. Spread reflects quality and location.',
    microDesc:'WTI/Brent spread usually $2-4. Widens during supply disruptions or pipeline issues.',
    risk:'Same as WTI. Quality differential can shift rapidly.' },

  NATGAS: { name:'Natural Gas', ticker:'NG', type:'commodity', sector:'Energy',
    vol:0.58, annDrift:-0.02, beta:0.08, hurst:0.44, halfLife:4, startPrice:2.5,
    emoji:'🔥', color:'#ff6b35', theme:'#ff8c42',
    desc:'Most volatile liquid commodity. Weather-driven demand. LNG export boom changing market structure.',
    microDesc:'Mean-reverts strongly. Seasonal patterns extremely pronounced. Spikes on cold snaps.',
    risk:'Weather forecasts wrong. Storage build/draw misses. LNG export disruptions.' },

  COPPER: { name:'Copper Futures', ticker:'HG', type:'commodity', sector:'Industrial Metals',
    vol:0.22, annDrift:0.05, beta:0.55, hurst:0.51, halfLife:10, startPrice:4.0,
    emoji:'🪙', color:'#b87333', theme:'#cd7f32',
    desc:'Doctor Copper — leading economic indicator. EV and clean energy supercycle demand driver.',
    microDesc:'Tracks Chinese PMI closely. Momentum in supercycle periods.',
    risk:'China property downturn. Substitution. New mine supply.' },

  WHEAT: { name:'Wheat Futures', ticker:'ZW', type:'commodity', sector:'Agriculture',
    vol:0.28, annDrift:0.01, beta:0.08, hurst:0.48, halfLife:8, startPrice:550,
    emoji:'🌾', color:'#d4a017', theme:'#c9a000',
    desc:'Staple food commodity. Weather and geopolitics major drivers. Ukraine war created extreme vol in 2022.',
    microDesc:'Strong seasonal patterns. Geopolitical risk premium in war periods.',
    risk:'Crop yields unpredictable. Geopolitical supply disruptions. FX (USD/BRL/AUD).' },

  // ── CRYPTO ───────────────────────────────────────────────────
  BTC: { name:'Bitcoin', ticker:'BTC/USD', type:'crypto', sector:'Cryptocurrency',
    vol:0.72, annDrift:0.55, beta:0.82, hurst:0.56, halfLife:3, startPrice:65000,
    emoji:'₿', color:'#f7931a', theme:'#f7931a',
    desc:'Digital gold. Halving cycles create multi-year bull/bear regimes. Institutional adoption increasing.',
    microDesc:'Strong momentum factor. Vol compresses before major moves. 4-year halving cycle.',
    risk:'Regulatory crackdown. Institutional exit. Layer 1 competition.',
    liveApi:'coingecko', coinId:'bitcoin' },

  ETH: { name:'Ethereum', ticker:'ETH/USD', type:'crypto', sector:'Cryptocurrency',
    vol:0.88, annDrift:0.50, beta:1.15, hurst:0.55, halfLife:3, startPrice:3500,
    emoji:'⟠', color:'#627eea', theme:'#627eea',
    desc:'Smart contract platform. ETH/BTC ratio trades like a risk-on/risk-off within crypto.',
    microDesc:'Higher beta than BTC. Outperforms in bull, underperforms in bear. ETH/BTC ratio mean-reverts.',
    risk:'Layer 2 cannibalisation. Solana competition. Regulatory security classification.',
    liveApi:'coingecko', coinId:'ethereum' },

  SOL: { name:'Solana', ticker:'SOL/USD', type:'crypto', sector:'Cryptocurrency',
    vol:1.08, annDrift:0.75, beta:1.45, hurst:0.57, halfLife:2, startPrice:150,
    emoji:'◎', color:'#9945ff', theme:'#9945ff',
    desc:'High-performance L1. FTX collapse survivor. Comeback story 2023-2024. Meme coin and NFT activity.',
    microDesc:'Extreme momentum and reversals. Highly correlated with ETH but 2-3x the vol.',
    risk:'Network outages. Concentrated validator set. Dependence on meme coin cycle.',
    liveApi:'coingecko', coinId:'solana' },

  // ── FOREX ────────────────────────────────────────────────────
  EURUSD: { name:'EUR/USD', ticker:'EUR/USD', type:'forex', sector:'FX — Majors',
    vol:0.07, annDrift:0.00, beta:-0.18, hurst:0.49, halfLife:25, startPrice:1.085,
    emoji:'💶', color:'#003087', theme:'#003087',
    desc:'Most liquid financial instrument in the world. $1.8 trillion daily turnover. Near-random walk in short term.',
    microDesc:'Carry trade unwinding creates sharp moves. ECB/Fed policy divergence key driver.',
    risk:'Geopolitical risk (Ukraine, energy). Recession differential. Policy error.' },

  GBPUSD: { name:'GBP/USD', ticker:'GBP/USD', type:'forex', sector:'FX — Majors',
    vol:0.09, annDrift:-0.01, beta:-0.10, hurst:0.48, halfLife:20, startPrice:1.27,
    emoji:'💷', color:'#012169', theme:'#012169',
    desc:'Cable — most volatile G10 pair. Brexit overhang. BoE vs Fed rate differential.',
    microDesc:'Sensitive to UK economic surprises. Flash crashes occur in thin Asian session.',
    risk:'UK fiscal credibility (Truss moment risk). BoE error. Current account deficit.' },

  USDJPY: { name:'USD/JPY', ticker:'USD/JPY', type:'forex', sector:'FX — Majors',
    vol:0.09, annDrift:0.03, beta:0.32, hurst:0.52, halfLife:22, startPrice:150,
    emoji:'¥', color:'#bc002d', theme:'#bc002d',
    desc:'Carry trade currency. BoJ yield curve control creates directional momentum then sudden reversal.',
    microDesc:'Trending in carry regimes. BoJ intervention risk at 150+ creates binary event risk.',
    risk:'BoJ policy normalisation (sudden reversal). US recession (carry unwind). Political.' },

  AUDUSD: { name:'AUD/USD', ticker:'AUD/USD', type:'forex', sector:'FX — Commodity',
    vol:0.11, annDrift:-0.02, beta:0.62, hurst:0.50, halfLife:15, startPrice:0.655,
    emoji:'🦘', color:'#00843d', theme:'#00843d',
    desc:'Commodity currency — highly correlated with iron ore, copper, and Chinese growth.',
    microDesc:'Risk-on/risk-off proxy. Tracks China PMI and commodity indices.',
    risk:'China growth slowdown. Iron ore supply glut. RBA rate cuts.' },

  // ── INDICES ──────────────────────────────────────────────────
  SPX: { name:'S&P 500', ticker:'SPX', type:'index', sector:'Equity Index',
    vol:0.17, annDrift:0.10, beta:1.0, hurst:0.52, halfLife:14, startPrice:5000,
    emoji:'🇺🇸', color:'#c8102e', theme:'#c8102e',
    desc:'500 largest US companies. The benchmark everything is measured against. Long-run compounder.',
    microDesc:'Options gamma creates pinning near strikes. VIX inverse relationship.',
    risk:'Recession. Fed overtightening. Valuation (P/E >20x). Concentration in Mag7.' },

  NDX: { name:'NASDAQ 100', ticker:'NDX', type:'index', sector:'Equity Index',
    vol:0.22, annDrift:0.13, beta:1.22, hurst:0.53, halfLife:10, startPrice:18000,
    emoji:'💻', color:'#5b9bd5', theme:'#0070c0',
    desc:'Top 100 non-financial NASDAQ stocks. Tech-heavy. Higher beta and returns than SPX over time.',
    microDesc:'Rate-sensitive (duration of growth cash flows). Outperforms in falling rate environment.',
    risk:'Rate rise impact. Tech earnings misses. AI valuation compression.' },

  VIX: { name:'VIX Fear Index', ticker:'VIX', type:'index', sector:'Volatility',
    vol:0.85, annDrift:-0.30, beta:-0.82, hurst:0.37, halfLife:2, startPrice:14,
    emoji:'😰', color:'#ff4444', theme:'#e53e3e',
    desc:'CBOE Volatility Index. "Fear gauge" for US equities. Mean-reverts strongly. Spikes in crises.',
    microDesc:'Strong mean-reversion when below 12 or above 35. Regime indicator.',
    risk:'Volatility of volatility. VIX can stay low or high for extended periods.' },

  NIKKEI: { name:'Nikkei 225', ticker:'NKY', type:'index', sector:'Equity Index',
    vol:0.19, annDrift:0.08, beta:0.90, hurst:0.51, halfLife:16, startPrice:38000,
    emoji:'🗾', color:'#bc002d', theme:'#bc002d',
    desc:'Japan\'s benchmark index. Yen weakness a tailwind for exporters. BoJ normalisation risk.',
    microDesc:'Warren Buffett Japan trade catalyst. Foreign flow sensitive. Trades in JPY.',
    risk:'Yen appreciation (export earnings). BoJ rate hikes. China slowdown spillover.' },

  // ── ETFs ─────────────────────────────────────────────────────
  SPY: { name:'SPDR S&P 500 ETF', ticker:'SPY', type:'etf', sector:'ETF',
    vol:0.17, annDrift:0.10, beta:1.0, hurst:0.52, halfLife:14, startPrice:500,
    emoji:'🕷️', color:'#c8102e', theme:'#c8102e',
    desc:'Most traded ETF in the world. Tracks S&P 500. Creation/redemption mechanism keeps it near NAV.',
    microDesc:'Arbitrage vs futures keeps premium/discount tight (<5bps normally). Widens in stress.',
    risk:'Tracking error. Liquidity risk in extreme vol. Same as SPX.', pairWith:'SPX' },

  QQQ: { name:'Invesco QQQ ETF', ticker:'QQQ', type:'etf', sector:'ETF',
    vol:0.22, annDrift:0.13, beta:1.22, hurst:0.53, halfLife:10, startPrice:440,
    emoji:'📦', color:'#5b9bd5', theme:'#0070c0',
    desc:'Tracks NASDAQ 100. Tech and growth focus. Premium can spike in momentum regimes.',
    microDesc:'Higher premium in retail-driven bull markets. Good arb vs NQ futures.',
    risk:'Same as NDX. Higher tech concentration.', pairWith:'NDX' },

  GLD: { name:'SPDR Gold Shares', ticker:'GLD', type:'etf', sector:'ETF',
    vol:0.14, annDrift:0.07, beta:-0.12, hurst:0.47, halfLife:18, startPrice:185,
    emoji:'🟡', color:'#ffd700', theme:'#d4af37',
    desc:'Physical gold ETF. Holds gold bars in London vaults. 0.40% expense ratio slightly drags performance.',
    microDesc:'Discount can appear when gold demand spikes. Pairs perfectly with XAU/USD spot.',
    risk:'Counterparty risk (minimal with physical backing). Management fee drag.', pairWith:'GOLD' },

  TLT: { name:'iShares 20Y Treasury', ticker:'TLT', type:'etf', sector:'ETF',
    vol:0.13, annDrift:0.02, beta:-0.35, hurst:0.46, halfLife:20, startPrice:95,
    emoji:'🏛️', color:'#1a237e', theme:'#283593',
    desc:'Long duration US Treasury ETF. Highly rate-sensitive. Classic risk-off hedge. Negative SPX correlation.',
    microDesc:'Modified duration ~17y. Rate moves of 1bp = 0.17% price change.',
    risk:'Inflation surprise. Fiscal deficit concerns (bond vigilantes). Fed QT.' },

  ARK: { name:'ARK Innovation ETF', ticker:'ARKK', type:'etf', sector:'ETF',
    vol:0.60, annDrift:0.12, beta:1.95, hurst:0.55, halfLife:4, startPrice:48,
    emoji:'🚀', color:'#7c3aed', theme:'#6d28d9',
    desc:'Cathie Wood\'s flagship disruptive tech fund. Extreme vol. Retail-driven momentum. High conviction concentrated.',
    microDesc:'Highly sensitive to rate expectations. Retail flow creates momentum bubbles.',
    risk:'Duration risk (far future cash flows). Liquidity mismatch. Redemption spiral.' },

  // ── BONDS / RATES ────────────────────────────────────────────
  US10Y: { name:'US 10Y Treasury Yield', ticker:'TNX', type:'bond', sector:'Rates',
    vol:0.08, annDrift:0.00, beta:-0.42, hurst:0.44, halfLife:30, startPrice:4.25,
    emoji:'📊', color:'#1565c0', theme:'#1976d2',
    desc:'Risk-free rate benchmark. Determines cost of capital for everything. Mean-reverts around neutral rate.',
    microDesc:'Fed expectations anchor it. CPI prints and payrolls move it most. Strong mean-reversion.',
    risk:'Inflation surprise. Fed pivot. Fiscal sustainability concerns.' },

  BUND: { name:'German 10Y Bund Yield', ticker:'RX1', type:'bond', sector:'Rates',
    vol:0.06, annDrift:-0.01, beta:-0.30, hurst:0.43, halfLife:35, startPrice:2.35,
    emoji:'🇩🇪', color:'#000', theme:'#374151',
    desc:'European safe haven benchmark. ECB rate decisions dominate. Trades at spread to US Treasuries.',
    microDesc:'Very mean-reverting. Bund-UST spread is a classic cross-market trade.',
    risk:'ECB policy error. Euro area fragmentation. Fiscal concerns (Italy spread).' },
};

// ── CORRELATION MATRIX FOR KEY PAIRS ─────────────────────────
const LX_CORRELATIONS = {
  'GOLD-SILVER': 0.82, 'OIL-BRENT': 0.97, 'BTC-ETH': 0.91,
  'BTC-SOL': 0.85, 'ETH-SOL': 0.88, 'SPX-NDX': 0.94,
  'SPY-SPX': 0.9998, 'GLD-GOLD': 0.9995, 'QQQ-NDX': 0.9997,
  'AAPL-MSFT': 0.78, 'AAPL-NDX': 0.85, 'SPX-TLT': -0.35,
  'VIX-SPX': -0.75, 'GOLD-USDJPY': -0.32, 'OIL-AUDUSD': 0.55,
  'COPPER-SPX': 0.62, 'COPPER-AUDUSD': 0.68, 'SPX-BUND': 0.40,
  'TSLA-ARK': 0.72, 'META-NDX': 0.80, 'NVDA-NDX': 0.78,
  'US10Y-BUND': 0.82, 'US10Y-TLT': -0.97, 'GOLD-US10Y': -0.55,
};

// ── CURATED PAIRS FOR SPREAD TRADING ─────────────────────────
const LX_PAIRS = [
  { id:'gold-silver', a:'GOLD', b:'SILVER', name:'Gold / Silver',
    rho:0.82, betaAB:1.2, spreadMean:80, spreadStd:8, halfLife:12,
    difficulty:'Beginner', emoji:'🥇🥈',
    brief:'The gold/silver ratio is one of the oldest pairs trades. It measures how many oz of silver equal 1 oz of gold. Long-run mean ~80, but can swing from 50 to 120+. Mean-reversion plays work well here.',
    signal:'Sell ratio (long gold, short silver) when ratio > 90; buy ratio when < 70.',
    gotcha:'The ratio can trend for years during industrial demand shifts or recession.' },

  { id:'oil-brent', a:'OIL', b:'BRENT', name:'WTI / Brent',
    rho:0.97, betaAB:1.05, spreadMean:3.0, spreadStd:1.5, halfLife:6,
    difficulty:'Beginner', emoji:'🛢️🌊',
    brief:'WTI (US benchmark) vs Brent (global benchmark). Normally within $1-4 of each other. Quality and logistics differences drive the spread. This is a classic convergence trade.',
    signal:'Trade the spread when it exceeds 2 standard deviations. Mean-reversion is very reliable.',
    gotcha:'Pipeline bottlenecks (Cushing OK) can cause the spread to blow out to $20+.' },

  { id:'btc-eth', a:'BTC', b:'ETH', name:'BTC / ETH',
    rho:0.91, betaAB:1.35, spreadMean:18, spreadStd:4, halfLife:3,
    difficulty:'Intermediate', emoji:'₿⟠',
    brief:'BTC dominance vs ETH. The ETH/BTC ratio rises during altcoin seasons when investors rotate into higher-beta assets. Falls when BTC leads (institutional buying, ETF flows).',
    signal:'Ratio mean-reverts around 0.055. Trade deviations. ETH outperforms in DeFi and NFT cycles.',
    gotcha:'Correlation breaks down in extreme moves. ETH can 2x while BTC is flat (protocol upgrades).' },

  { id:'spy-qqq', a:'SPY', b:'QQQ', name:'SPY / QQQ',
    rho:0.94, betaAB:1.15, spreadMean:0, spreadStd:3, halfLife:10,
    difficulty:'Intermediate', emoji:'🕷️📦',
    brief:'Value vs growth proxy. QQQ outperforms when rates fall and growth is scarce. SPY outperforms in rising rate or value-rotation environments. A macro regime indicator.',
    signal:'Go long QQQ/short SPY when 10Y yields are falling. Reverse when rates rise.',
    gotcha:'Mag7 domination makes SPY more tech-heavy than historical. Pure "value vs growth" story is muddier.' },

  { id:'aapl-msft', a:'AAPL', b:'MSFT', name:'AAPL / MSFT',
    rho:0.78, betaAB:0.95, spreadMean:0, spreadStd:8, halfLife:14,
    difficulty:'Intermediate', emoji:'🍎🪟',
    brief:'Two tech giants in different businesses (hardware+services vs cloud+software). Correlation high but diverges during product cycles and earnings.',
    signal:'Spread widens during earnings seasons. Mean-reversion after earnings surprise.',
    gotcha:'China risk affects AAPL specifically. Azure vs AWS share shifts affect MSFT.' },

  { id:'gld-tlt', a:'GLD', b:'TLT', name:'Gold / Bonds',
    rho:-0.15, betaAB:-0.4, spreadMean:0, spreadStd:12, halfLife:20,
    difficulty:'Advanced', emoji:'🟡🏛️',
    brief:'Both are classic safe havens but respond to different risks. Gold hedges inflation + geopolitics. TLT hedges deflation + recession. They diverge in stagflation (gold up, bonds down).',
    signal:'Both rally together in risk-off. Short the weaker one when inflation expectations shift.',
    gotcha:'Low correlation makes this a macro view, not pure mean-reversion. Requires regime detection.' },
];

// ── HISTORICAL MARKET PERIODS (for replay/challenge mode) ─────
const LX_PERIODS = [
  { id:'covid-crash', name:'COVID Crash', subtitle:'Feb-Mar 2020',
    emoji:'🦠', difficulty:'Extreme',
    brief:'The fastest 30% drawdown in S&P history. Crossed in 33 days. Liquidity evaporated. Correlations went to 1.',
    regimeSeq:['volatile','volatile','mean_rev','trend'],
    shockAt:60, shockMag:-0.35, shockVol:3.0,
    instruments:['SPX','GOLD','OIL','VIX','TLT'],
    lesson:'In crises, all correlations go to 1. Only cash and short-vol hedges work. Spreads blow out.' },

  { id:'ai-rally-2023', name:'AI Rally', subtitle:'Jan-Nov 2023',
    emoji:'🤖', difficulty:'Medium',
    brief:'NASDAQ +50% as AI excitement drove a tech-dominated rally. Rate fears faded mid-year. Breadth was narrow — just 7 stocks drove most of gains.',
    regimeSeq:['trend','trend','mean_rev','trend'],
    shockAt:120, shockMag:0.15, shockVol:0.8,
    instruments:['NDX','NVDA','AAPL','META','SPX'],
    lesson:'Momentum works in strong bull markets. But breadth matters — small caps and value lagged.' },

  { id:'rate-hike-2022', name:'Rate Hike Cycle', subtitle:'2022 Bear Market',
    emoji:'📈', difficulty:'Hard',
    brief:'Fed raised rates 425bps in 12 months. SPX -20%, NASDAQ -33%, bonds -15% (worst bond year since 1788). Almost nothing worked.',
    regimeSeq:['volatile','mean_rev','volatile','volatile'],
    shockAt:80, shockMag:-0.20, shockVol:2.0,
    instruments:['SPX','TLT','GOLD','OIL','USDJPY'],
    lesson:'Duration risk is real. Cash was king. Energy and commodities were the only longs.' },

  { id:'crypto-winter-2022', name:'Crypto Winter', subtitle:'Nov 2021 - Dec 2022',
    emoji:'🧊', difficulty:'Hard',
    brief:'BTC -75%, ETH -77%. FTX collapse, LUNA/UST implosion, 3AC bankruptcy. Crypto correlation with equities spiked.',
    regimeSeq:['volatile','volatile','mean_rev','volatile'],
    shockAt:100, shockMag:-0.50, shockVol:2.5,
    instruments:['BTC','ETH','SOL','SPX','GOLD'],
    lesson:'Contagion in correlated assets. Counterparty risk matters. Mean-reversion works on recovery.' },

  { id:'inflation-surge', name:'Inflation Surge', subtitle:'2021-2022',
    emoji:'💸', difficulty:'Medium',
    brief:'CPI hit 9.1% — highest since 1981. Commodities and energy soared. Bonds and growth stocks crashed simultaneously.',
    regimeSeq:['trend','trend','trend','volatile'],
    shockAt:150, shockMag:0.40, shockVol:1.5,
    instruments:['OIL','GOLD','COPPER','WHEAT','TLT'],
    lesson:'Inflation regimes reward commodity long, bond short. Gold sometimes disappoints vs other real assets.' },
];

// ── DAILY ROTATION LOGIC ──────────────────────────────────────
function getLXDailyInstruments(dateNum) {
  // dateNum = Math.floor(Date.now() / 86400000)
  const keys = Object.keys(LX_INSTRUMENTS);
  const seed = dateNum * 2654435761;
  const idx1 = ((seed >>> 0) % keys.length);
  const idx2 = (((seed * 1664525) >>> 0) % keys.length);
  const idx3 = (((seed * 22695477) >>> 0) % keys.length);
  return {
    spotlight: keys[idx1 % keys.length],
    pair: LX_PAIRS[idx2 % LX_PAIRS.length],
    period: LX_PERIODS[idx3 % LX_PERIODS.length],
  };
}

// ── MULBERRY32 PRNG (used for seeded simulation) ──────────────
function lxMulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ── GBM SIMULATION USING INSTRUMENT PARAMETERS ───────────────
function lxSimulate(instKey, bars=300, seed=null) {
  const inst = LX_INSTRUMENTS[instKey];
  if (!inst) return null;
  const rng = lxMulberry32(seed || Math.floor(Date.now() / 86400000) * 31337 + instKey.charCodeAt(0) * 997);
  const dt = 1/252;
  const drift = inst.annDrift * dt;
  const vol   = inst.vol * Math.sqrt(dt);
  const prices = [inst.startPrice];
  for (let i=1; i<bars; i++) {
    // Box-Muller normal
    const u1 = rng(), u2 = rng();
    const z = Math.sqrt(-2*Math.log(u1+1e-10)) * Math.cos(2*Math.PI*u2);
    // Add Hurst-adjusted autocorrelation
    const prevRet = i > 1 ? (prices[i-1]-prices[i-2])/prices[i-2] : 0;
    const hurstAdj = (inst.hurst - 0.5) * 2 * prevRet;
    prices.push(+(prices[i-1] * (1 + drift + vol*z + hurstAdj*0.1)).toFixed(4));
  }
  return prices;
}

// ── LIVE CRYPTO FETCH (CoinGecko, no key needed) ──────────────
async function lxFetchLive(instKey, days=14) {
  const inst = LX_INSTRUMENTS[instKey];
  if (!inst?.liveApi) return null;
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${inst.coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const d = await r.json();
    return d.prices.map(p => p[1]);
  } catch(e) {
    return null; // fall back to simulation
  }
}

if (typeof window !== 'undefined') {
  window.LX_INSTRUMENTS = LX_INSTRUMENTS;
  window.LX_CORRELATIONS = LX_CORRELATIONS;
  window.LX_PAIRS = LX_PAIRS;
  window.LX_PERIODS = LX_PERIODS;
  window.getLXDailyInstruments = getLXDailyInstruments;
  window.lxSimulate = lxSimulate;
  window.lxFetchLive = lxFetchLive;
}
