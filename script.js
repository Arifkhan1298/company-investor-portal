/**
 * AUREVIA CAPITAL — ULTRA-PREMIUM COMPANY INVESTOR PORTAL
 * Core Client-Side Logic & State Engine
 * Offline-friendly, zero external dependencies, Vanilla JS
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. LOCAL STORAGE KEYS & INITIAL DEFAULT STATE
     ========================================================================== */
  const STORAGE_KEYS = {
    AUTH_STATE: 'aurv_auth_state_v1',
    SETTINGS: 'aurv_settings_v1',
    PROFILE: 'aurv_profile_v1',
    HOLDINGS: 'aurv_holdings_v1',
    WATCHLIST: 'aurv_watchlist_v1',
    NOTES: 'aurv_notes_v1',
    MESSAGES: 'aurv_messages_v1',
    NOTIFICATIONS: 'aurv_notifications_v1',
    DOCUMENTS: 'aurv_documents_v1',
    EVENTS_REGISTRATION: 'aurv_events_reg_v1'
  };

  // Safe LocalStorage Helpers with In-Memory Fallback
  const memoryFallback = {};
  const Storage = {
    get(key, defaultVal) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
      } catch (e) {
        return memoryFallback[key] !== undefined ? memoryFallback[key] : defaultVal;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        memoryFallback[key] = val;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        delete memoryFallback[key];
      }
    }
  };

  /* ==========================================================================
     2. DEFAULT DATASETS (INSTITUTIONAL CORPORATE FINANCE ARCHITECTURE)
     ========================================================================== */
  const DEFAULT_PROFILE = {
    name: 'Alexander Vance',
    email: 'investor@aureviacapital.com',
    role: 'Senior Managing Partner',
    entity: 'Vance Global Capital Partners LLC',
    phone: '+1 (212) 555-0194',
    tier: 'Institutional Tier 1 Partner'
  };

  const DEFAULT_SETTINGS = {
    compactMode: false,
    animations: true,
    autoCollapseSidebar: false,
    notif8k: true,
    notifDividends: true,
    notifEvents: true
  };

  const DEFAULT_HOLDINGS = [
    { id: 'h-1', symbol: 'AURV', name: 'Aurevia Capital Group Inc. (Common Stock)', shares: 8500, avgPrice: 62.40, currentPrice: 84.60, assetClass: 'Public Equity' },
    { id: 'h-2', symbol: 'AVTF', name: 'Aurevia Global Tech Strategies Series B', shares: 3200, avgPrice: 110.00, currentPrice: 148.50, assetClass: 'Private Venture PE' },
    { id: 'h-3', symbol: 'ASIP', name: 'Aurevia Sustainable Infrastructure Fund', shares: 5000, avgPrice: 48.00, currentPrice: 56.20, assetClass: 'Real Assets Debt' },
    { id: 'h-4', symbol: 'AGHY', name: 'Aurevia High-Yield Real Assets Class A', shares: 2000, avgPrice: 94.50, currentPrice: 102.80, assetClass: 'Direct Credit' }
  ];

  const DEFAULT_WATCHLIST = [
    { symbol: 'AURV', name: 'Aurevia Capital Group', cap: '$4.80B', price: 84.60, change: '+2.40%', range: '$58.10 - $89.40', rating: 'Strong Buy', vol: '2.84M' },
    { symbol: 'BX', name: 'Blackstone Inc.', cap: '$178.4B', price: 148.20, change: '+1.15%', range: '$112.0 - $162.5', rating: 'Buy', vol: '3.10M' },
    { symbol: 'KKR', name: 'KKR & Co. Inc.', cap: '$112.5B', price: 126.80, change: '+0.85%', range: '$84.20 - $134.1', rating: 'Hold', vol: '2.45M' },
    { symbol: 'APO', name: 'Apollo Global Management', cap: '$84.2B', price: 139.10, change: '+1.92%', range: '$92.00 - $144.5', rating: 'Buy', vol: '1.98M' },
    { symbol: 'ARES', name: 'Ares Management Corp.', cap: '$52.6B', price: 162.40, change: '-0.42%', range: '$118.0 - $174.0', rating: 'Buy', vol: '1.12M' }
  ];

  const DEFAULT_NOTES = [
    { id: 'n-1', title: 'Q4 Margin Expansion Drivers', tag: 'Profitability', text: 'Proprietary Aurevia Vantage platform software licensing now accounts for 18% of revenue with 88% gross margins. Fee-related earnings (FRE) expanding faster than peer median.', date: 'Feb 12, 2026' },
    { id: 'n-2', title: 'Credit Strategy Launch in Zurich', tag: 'Expansion', text: 'Allocations for the Senior Secured Yield Fund reached EUR 450M in anchor soft commitments. First close slated for early Q2 2026.', date: 'Feb 04, 2026' },
    { id: 'n-3', title: 'Share Buyback Authorization Analysis', tag: 'Capital Return', text: 'Board approved $250M anti-dilutive share repurchase tranche. Current EV/EBITDA multiple of 32.8x offers compelling accretive retirement opportunity.', date: 'Jan 28, 2026' }
  ];

  const DEFAULT_SHAREHOLDERS = [
    { name: 'The Vanguard Group, Inc.', type: 'Institutional', shares: '4,880,240', pct: '8.60%', value: '$412.8M', change: '+2.1%', date: 'Dec 31, 2025' },
    { name: 'BlackRock Institutional Trust Company', type: 'Institutional', shares: '4,425,720', pct: '7.80%', value: '$374.4M', change: '+1.4%', date: 'Dec 31, 2025' },
    { name: 'Elena Rostova Founder Trust', type: 'Insider', shares: '3,972,000', pct: '7.00%', value: '$336.0M', change: '0.0%', date: 'Dec 31, 2025' },
    { name: 'State Street Global Advisors', type: 'Institutional', shares: '3,120,700', pct: '5.50%', value: '$264.0M', change: '+0.8%', date: 'Dec 31, 2025' },
    { name: 'Temasek Holdings Private Ltd', type: 'Sovereign', shares: '2,837,000', pct: '5.00%', value: '$240.0M', change: 'New Entry', date: 'Dec 31, 2025' },
    { name: 'Fidelity Management & Research', type: 'Institutional', shares: '2,496,560', pct: '4.40%', value: '$211.2M', change: '+4.2%', date: 'Dec 31, 2025' },
    { name: 'Marcus Vance Executive Partnership', type: 'Insider', shares: '1,702,200', pct: '3.00%', value: '$144.0M', change: '0.0%', date: 'Dec 31, 2025' }
  ];

  const DEFAULT_DIVIDENDS = [
    { declDate: 'Jan 15, 2026', type: 'Quarterly Cash', amount: '$0.62', exDate: 'Feb 20, 2026', recDate: 'Feb 22, 2026', payDate: 'Mar 15, 2026', status: 'Announced' },
    { declDate: 'Oct 14, 2025', type: 'Quarterly Cash', amount: '$0.59', exDate: 'Nov 12, 2025', recDate: 'Nov 14, 2025', payDate: 'Dec 05, 2025', status: 'Paid' },
    { declDate: 'Jul 18, 2025', type: 'Quarterly Cash', amount: '$0.59', exDate: 'Aug 14, 2025', recDate: 'Aug 16, 2025', payDate: 'Sep 05, 2025', status: 'Paid' },
    { declDate: 'Apr 22, 2025', type: 'Quarterly Cash', amount: '$0.59', exDate: 'May 16, 2025', recDate: 'May 18, 2025', payDate: 'Jun 05, 2025', status: 'Paid' },
    { declDate: 'Jan 20, 2025', type: 'Quarterly Cash', amount: '$0.56', exDate: 'Feb 14, 2025', recDate: 'Feb 16, 2025', payDate: 'Mar 07, 2025', status: 'Paid' }
  ];

  const DEFAULT_REPORTS = [
    { id: 'rep-1', title: '2025 Comprehensive Annual Report (Form 10-K)', category: 'Annual', period: 'FY 2025', date: 'Feb 08, 2026', status: 'Audited (PwC)', pages: 148, size: '4.8 MB' },
    { id: 'rep-2', title: 'Q3 2025 Quarterly Disclosure (Form 10-Q)', category: 'Quarterly', period: 'Q3 2025', date: 'Nov 12, 2025', status: 'SEC Filed', pages: 64, size: '2.4 MB' },
    { id: 'rep-3', title: 'Q4 2025 Institutional Investor Deck & Results Presentation', category: 'Presentation', period: 'Q4 2025', date: 'Feb 14, 2026', status: 'Official Deck', pages: 38, size: '8.1 MB' },
    { id: 'rep-4', title: 'Consolidated Audited Statement of Financial Condition', category: 'Statements', period: 'FY 2025', date: 'Jan 30, 2026', status: 'Certified', pages: 22, size: '1.2 MB' },
    { id: 'rep-5', title: 'Q2 2025 Quarterly Disclosure (Form 10-Q)', category: 'Quarterly', period: 'Q2 2025', date: 'Aug 10, 2025', status: 'SEC Filed', pages: 58, size: '2.1 MB' },
    { id: 'rep-6', title: 'Global ESG & Responsible Investment Sustainability Audit', category: 'Annual', period: '2025', date: 'Dec 18, 2025', status: 'Independent', pages: 44, size: '3.6 MB' },
    { id: 'rep-7', title: 'Form 8-K: Material Acquisition of Valens Tech Analytics', category: 'Statements', period: 'Material Event', date: 'Oct 04, 2025', status: 'SEC Accepted', pages: 14, size: '840 KB' },
    { id: 'rep-8', title: 'Annual Shareholder Proxy Statement (DEF 14A)', category: 'Presentation', period: 'AGM 2026', date: 'Feb 02, 2026', status: 'Notice Sent', pages: 72, size: '3.1 MB' }
  ];

  const DEFAULT_DOCUMENTS = [
    { id: 'doc-1', name: 'Aurevia Corporate Governance Charter & By-laws', category: 'Governance', date: 'Jan 2026', owner: 'Corporate Secretary', ext: 'PDF', size: '1.8 MB', favorite: true },
    { id: 'doc-2', name: 'Institutional Investor Factsheet & Executive Profile', category: 'Presentations', date: 'Feb 2026', owner: 'Investor Relations', ext: 'PDF', size: '920 KB', favorite: true },
    { id: 'doc-3', name: 'SEC Form S-3 Shelf Registration Statement', category: 'Legal', date: 'Nov 2025', owner: 'Chief Legal Officer', ext: 'PDF', size: '3.4 MB', favorite: false },
    { id: 'doc-4', name: 'US GAAP Consolidated Audited Financial Statements (Excel Model)', category: 'Statements', date: 'Feb 2026', owner: 'FP&A Team', ext: 'XLSX', size: '4.2 MB', favorite: true },
    { id: 'doc-5', name: 'Code of Business Conduct & Ethics Circular', category: 'Governance', date: 'Jan 2026', owner: 'Compliance Officer', ext: 'PDF', size: '640 KB', favorite: false },
    { id: 'doc-6', name: 'Form 13F Institutional Equity Holdings Q4 Ledger', category: 'Legal', date: 'Feb 2026', owner: 'SEC Filing Agent', ext: 'PDF', size: '1.1 MB', favorite: false }
  ];

  const DEFAULT_EARNINGS_EVENTS = [
    { id: 'e-1', date: 'Feb 24, 2026', time: '5:00 PM EST', period: 'Q4 2025', title: 'Q4 2025 Financial Results Webcast', dialIn: '+1 (800) 555-AURV | Pin: 8460', status: 'Upcoming' },
    { id: 'e-2', date: 'Apr 28, 2026', time: '8:30 AM EST', period: 'Q1 2026', title: 'Q1 2026 Earnings Release & Analyst Call', dialIn: '+1 (800) 555-AURV | Pin: 9122', status: 'Scheduled' },
    { id: 'e-3', date: 'Jul 28, 2026', time: '8:30 AM EST', period: 'Q2 2026', title: 'Q2 2026 Mid-Year Strategic Results', dialIn: 'Webcast Live Broadcast', status: 'Tentative' },
    { id: 'e-4', date: 'Oct 27, 2026', time: '5:00 PM EST', period: 'Q3 2026', title: 'Q3 2026 Earnings & Capital Deployment', dialIn: '+1 (800) 555-AURV | Pin: 4421', status: 'Tentative' }
  ];

  const DEFAULT_CORPORATE_EVENTS = [
    { id: 'ce-1', title: 'Aurevia Global Institutional Investor Day 2026', date: 'March 18, 2026', time: '9:00 AM - 3:00 PM EST', location: 'The Plaza Hotel, New York / Hybrid Webcast', host: 'Elena Rostova (CEO) & Executive Committee', status: 'Registration Open', attendees: '450 Institutional Allocators' },
    { id: 'ce-2', title: '2026 Annual General Meeting of Shareholders (AGM)', date: 'May 14, 2026', time: '10:00 AM EST', location: '575 Fifth Avenue, New York & Virtual Ballot', host: 'Board of Directors', status: 'Notice Dispatched', attendees: 'Open to All Shareholders of Record' },
    { id: 'ce-3', title: 'Morgan Stanley Global Financials Conference', date: 'June 09, 2026', time: '2:15 PM EST', location: 'Hilton Midtown, New York', host: 'Marcus Vance, Chief Financial Officer', status: 'Keynote Confirmed', attendees: 'Fireside Discussion & Institutional 1x1s' }
  ];

  const DEFAULT_NEWS = [
    { id: 'nw-1', headline: 'Aurevia Capital Announces Record Full-Year 2025 Revenue of $682M, Up 18.7% YoY', summary: 'Robust expansion across mid-market private equity platforms and Aurevia Vantage software adoption powers highest operating margins in firm history.', category: 'Financial', date: 'Feb 12, 2026', author: 'IR Wire Service', views: 3420 },
    { id: 'nw-2', headline: 'Board of Directors Declares Quarterly Cash Dividend of $0.62 Per Share, a 5.1% Increase', summary: 'Reflecting continued high cash generation and fiduciary capital return commitment, dividend payable March 15 to shareholders of record on February 22.', category: 'Corporate', date: 'Jan 22, 2026', author: 'Corporate Secretary', views: 2810 },
    { id: 'nw-3', headline: 'Aurevia Closes Acquisition of European Quantitative Deal Screening Pioneer Valens Tech', summary: 'Strategic consolidation accelerates algorithmic deal origination across DACH and Nordic private markets, bolstering technological competitive moat.', category: 'Acquisitions', date: 'Dec 14, 2025', author: 'Strategy Desk', views: 4150 },
    { id: 'nw-4', headline: 'Aurevia Capital Re-Affirms Investment Grade Credit Stance with Zero Debt Maturing Before 2031', summary: 'Conservative balance sheet posture highlighted in recent rating agency credit update with liquidity facility of $380M completely undrawn.', category: 'Governance', date: 'Nov 28, 2025', author: 'Treasury Desk', views: 1980 }
  ];

  const DEFAULT_UPDATES = [
    { id: 'up-1', title: 'CEO Letter to Shareholders: Precision, Scale, and Fiduciary Conviction', author: 'Elena Rostova', role: 'Founder & Chief Executive Officer', date: 'February 10, 2026', read: false, content: 'Dear Fellow Shareholders and Investment Partners,\n\n2025 marked a transformative epoch for Aurevia Capital. While the broader macroeconomic climate tested disciplined allocators, our dual engine of high-conviction mid-market private equity and recurring enterprise analytics yielded record financial results.\n\nOur consolidated revenues surpassed $682M (+18.7% YoY), while adjusted EBITDA expanded to $146M. Crucially, our fee-related earnings (FRE) margin expanded to 73.0% of topline, reinforcing the high predictability of our cash distributions.\n\nAs we look toward 2026 and our planned European credit strategy launch, our capital position has never been stronger. Thank you for your continued partnership and trust.' },
    { id: 'up-2', title: 'CFO Quarterly Briefing: Free Cash Flow Quality & Balance Sheet Optimization', author: 'Marcus Vance', role: 'Chief Financial Officer', date: 'January 28, 2026', read: true, content: 'Executive Summary:\n\nOur cash conversion ratio achieved 94.8% in Q4, supported by unencumbered management fee collections and strict working capital stewardship. With net debt standing at an industry-leading 1.1x EBITDA, Aurevia preserves complete strategic optionality for accretive tuck-in acquisitions and sustained dividend expansion.' }
  ];

  const DEFAULT_MESSAGES = [
    {
      id: 'thread-1',
      with: 'Sarah Jenkins',
      title: 'VP, Investor Relations',
      avatar: 'SJ',
      unread: true,
      messages: [
        { sender: 'them', text: 'Good morning Alexander, thank you for submitting your proxy authorization for the upcoming AGM. Your votes have been verified.', time: 'Feb 14, 9:20 AM' },
        { sender: 'me', text: 'Thank you Sarah. Could your team also confirm if the Q4 earnings deck will include the regional breakout for the Zurich subsidiary?', time: 'Feb 14, 9:45 AM' },
        { sender: 'them', text: 'Yes, absolutely. Slide 22 specifically breaks down DACH region assets under management and contracted fee schedules.', time: 'Feb 14, 10:05 AM' }
      ]
    },
    {
      id: 'thread-2',
      with: 'Marcus Vance',
      title: 'Chief Financial Officer',
      avatar: 'MV',
      unread: false,
      messages: [
        { sender: 'them', text: 'Alexander, following up on your inquiry regarding the $250M buyback authorization: our execution algorithm is currently active on low-volume dips.', time: 'Feb 11, 2:14 PM' },
        { sender: 'me', text: 'Understood Marcus, appreciate the prompt update on the capital allocation posture.', time: 'Feb 11, 3:00 PM' }
      ]
    }
  ];

  const DEFAULT_NOTIFICATIONS = [
    { id: 'not-1', category: 'reports', title: '2025 10-K Annual Report Published', text: 'Audited consolidated financial statements and footnotes are now available in the Document Center.', time: '2 hours ago', unread: true, targetView: 'reports' },
    { id: 'not-2', category: 'dividends', title: 'Dividend Declaration: $0.62 / Share', text: 'Board approved Q1 dividend payment scheduled for March 15, 2026.', time: '1 day ago', unread: true, targetView: 'dividends' },
    { id: 'not-3', category: 'events', title: 'AGM 2026 Proxy Voting Opened', text: 'Review proposed slate and submit institutional ballots ahead of May session.', time: '2 days ago', unread: true, targetView: 'events' },
    { id: 'not-4', category: 'filings', title: 'SEC Form 13F Ownership Update', text: 'Quarterly institutional disclosures updated across major asset manager filings.', time: '3 days ago', unread: false, targetView: 'shareholders' }
  ];

  /* ==========================================================================
     3. APP STATE INITIALIZATION
     ========================================================================== */
  const AppState = {
    isAuthenticated: Storage.get(STORAGE_KEYS.AUTH_STATE, false),
    activeView: 'overview',
    profile: Storage.get(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE),
    settings: Storage.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
    holdings: Storage.get(STORAGE_KEYS.HOLDINGS, DEFAULT_HOLDINGS),
    watchlist: Storage.get(STORAGE_KEYS.WATCHLIST, DEFAULT_WATCHLIST),
    notes: Storage.get(STORAGE_KEYS.NOTES, DEFAULT_NOTES),
    shareholders: DEFAULT_SHAREHOLDERS,
    dividends: DEFAULT_DIVIDENDS,
    reports: DEFAULT_REPORTS,
    documents: Storage.get(STORAGE_KEYS.DOCUMENTS, DEFAULT_DOCUMENTS),
    earnings: DEFAULT_EARNINGS_EVENTS,
    events: DEFAULT_CORPORATE_EVENTS,
    news: DEFAULT_NEWS,
    updates: Storage.get(STORAGE_KEYS.UPDATES, DEFAULT_UPDATES),
    messages: Storage.get(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES),
    notifications: Storage.get(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS),
    registeredEvents: Storage.get(STORAGE_KEYS.EVENTS_REGISTRATION, ['e-1', 'ce-1']),
    activeThreadId: 'thread-1',
    shareChartType: 'line',
    shareChartTime: '1Y',
    overviewRange: '1Y'
  };

  /* ==========================================================================
     4. LIGHTWEIGHT CANVAS & SVG CHARTING ENGINES (ZERO EXTERNAL LIBRARIES)
     ========================================================================== */

  // Setup HiDPI Canvas
  function setupHiDPICanvas(canvas) {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.width;
    const height = rect.height || canvas.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    return { ctx, width, height };
  }

  // Mini Sparkline Renderer for KPI Cards
  function drawSparkline(canvasId, dataPoints, isPositive = true) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const setup = setupHiDPICanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    ctx.clearRect(0, 0, width, height);

    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints);
    const range = (max - min) || 1;
    const step = width / (dataPoints.length - 1);

    const strokeColor = isPositive ? '#10B981' : '#F43F5E';
    const fillColor = isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';

    ctx.beginPath();
    dataPoints.forEach((val, i) => {
      const x = i * step;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Fill underneath
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  // Main Revenue & EBITDA Trajectory Chart (Area Line)
  function renderOverviewChart(range = '1Y') {
    const canvas = document.getElementById('chart-overview-financials');
    if (!canvas) return;
    const setup = setupHiDPICanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    ctx.clearRect(0, 0, width, height);

    // Dynamic data ranges
    const rangeData = {
      '1M': { labels: ['W1', 'W2', 'W3', 'W4'], rev: [665, 672, 678, 682], ebitda: [141, 143, 144, 146] },
      '3M': { labels: ['Nov', 'Dec', 'Jan', 'Feb'], rev: [630, 650, 668, 682], ebitda: [132, 138, 142, 146] },
      '6M': { labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'], rev: [590, 612, 630, 650, 668, 682], ebitda: [122, 128, 132, 138, 142, 146] },
      '1Y': { labels: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26E'], rev: [574, 610, 648, 682, 715], ebitda: [118, 126, 136, 146, 154] },
      '3Y': { labels: ['2023', '2024', '2025', '2026E'], rev: [440, 574, 682, 810], ebitda: [92, 122, 146, 178] },
      '5Y': { labels: ['2021', '2022', '2023', '2024', '2025'], rev: [290, 365, 440, 574, 682], ebitda: [60, 78, 92, 122, 146] }
    };

    const cur = rangeData[range] || rangeData['1Y'];
    const padding = { top: 20, right: 30, bottom: 35, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = 850;
    const minVal = 0;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Label
      const valLabel = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillStyle = '#64748B';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('$' + valLabel + 'M', padding.left - 8, y + 3);
    }

    const xStep = chartW / (cur.labels.length - 1);

    // Draw X labels
    cur.labels.forEach((lbl, i) => {
      const x = padding.left + i * xStep;
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lbl, x, height - 10);
    });

    // Draw Series 1: Revenue (Blue Area)
    const revGrad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    revGrad.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
    revGrad.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    ctx.beginPath();
    cur.rev.forEach((val, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.lineTo(padding.left + (cur.rev.length - 1) * xStep, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = revGrad;
    ctx.fill();

    // Draw Series 2: EBITDA (Ice Blue line)
    ctx.beginPath();
    cur.ebitda.forEach((val, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dots on EBITDA
    cur.ebitda.forEach((val, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#090D15';
      ctx.fill();
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // Donut Chart Renderer
  function renderDonutChart(canvasId, legendId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const setup = setupHiDPICanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    ctx.clearRect(0, 0, width, height);

    const total = data.reduce((acc, cur) => acc + cur.val, 0);
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY) - 10;
    const innerRadius = outerRadius * 0.65;

    let startAngle = -Math.PI / 2;

    data.forEach((slice) => {
      const sliceAngle = (slice.val / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      // Thin separation border
      ctx.strokeStyle = '#090D15';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Populate Legend
    const legendEl = document.getElementById(legendId);
    if (legendEl) {
      legendEl.innerHTML = data.map(item => `
        <div class="donut-legend-item">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="legend-dot" style="background:${item.color};"></span>
            <span style="color:var(--text-soft-silver);">${item.label}</span>
          </div>
          <span style="font-weight:700; color:var(--text-pure-white);">${item.val}%</span>
        </div>
      `).join('');
    }
  }

  // Interactive Share Price Chart (Line Area & Candlestick Support)
  function renderSharePriceChart() {
    const canvas = document.getElementById('chart-share-price');
    const volCanvas = document.getElementById('chart-share-volume');
    if (!canvas || !volCanvas) return;

    const priceSetup = setupHiDPICanvas(canvas);
    const volSetup = setupHiDPICanvas(volCanvas);
    if (!priceSetup || !volSetup) return;

    const ctx = priceSetup.ctx;
    const w = priceSetup.width;
    const h = priceSetup.height;

    const vCtx = volSetup.ctx;
    const vW = volSetup.width;
    const vH = volSetup.height;

    ctx.clearRect(0, 0, w, h);
    vCtx.clearRect(0, 0, vW, vH);

    // Simulated high quality OHLCV quotes
    const pointsCount = 32;
    const basePrice = 84.60;
    const quotes = [];
    let cur = 72.0;

    for (let i = 0; i < pointsCount; i++) {
      const delta = (Math.sin(i * 0.4) * 2.2) + ((Math.random() - 0.46) * 1.8);
      cur += delta;
      const open = cur;
      const close = cur + (Math.random() - 0.48) * 1.5;
      const high = Math.max(open, close) + Math.random() * 1.2;
      const low = Math.min(open, close) - Math.random() * 1.2;
      const vol = Math.floor(1800000 + Math.random() * 1800000);
      quotes.push({ open, close, high, low, vol });
    }
    // Anchor last price to $84.60
    quotes[quotes.length - 1].close = basePrice;

    const prices = quotes.flatMap(q => [q.high, q.low]);
    const minP = Math.min(...prices) * 0.98;
    const maxP = Math.max(...prices) * 1.02;
    const pRange = maxP - minP;

    const padLeft = 50;
    const padRight = 20;
    const padTop = 15;
    const padBottom = 20;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const step = chartW / (quotes.length - 1);

    // Price Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();

      const labelVal = (maxP - (pRange / 4) * i).toFixed(2);
      ctx.fillStyle = '#64748B';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('$' + labelVal, padLeft - 6, y + 3);
    }

    if (AppState.shareChartType === 'candle') {
      // Draw Candlesticks
      const candleW = Math.max(step * 0.65, 3);
      quotes.forEach((q, i) => {
        const x = padLeft + i * step;
        const yOpen = padTop + chartH - ((q.open - minP) / pRange) * chartH;
        const yClose = padTop + chartH - ((q.close - minP) / pRange) * chartH;
        const yHigh = padTop + chartH - ((q.high - minP) / pRange) * chartH;
        const yLow = padTop + chartH - ((q.low - minP) / pRange) * chartH;

        const isUp = q.close >= q.open;
        const col = isUp ? '#10B981' : '#F43F5E';

        // Wick
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        ctx.fillStyle = col;
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(Math.abs(yOpen - yClose), 2);
        ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyHeight);
      });
    } else {
      // Area Line
      const grad = ctx.createLinearGradient(0, padTop, 0, h - padBottom);
      grad.addColorStop(0, 'rgba(37, 99, 235, 0.4)');
      grad.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

      ctx.beginPath();
      quotes.forEach((q, i) => {
        const x = padLeft + i * step;
        const y = padTop + chartH - ((q.close - minP) / pRange) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      ctx.lineTo(padLeft + (quotes.length - 1) * step, padTop + chartH);
      ctx.lineTo(padLeft, padTop + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Volume Chart
    const maxVol = Math.max(...quotes.map(q => q.vol)) * 1.1;
    const vStep = (vW - padLeft - padRight) / (quotes.length - 1);
    quotes.forEach((q, i) => {
      const x = padLeft + i * vStep;
      const barH = (q.vol / maxVol) * vH;
      vCtx.fillStyle = q.close >= q.open ? 'rgba(16, 185, 129, 0.45)' : 'rgba(244, 63, 94, 0.45)';
      vCtx.fillRect(x - vStep * 0.35, vH - barH, vStep * 0.7, barH);
    });
  }

  // Financial Comparables Chart (Cashflow & Expenses)
  function renderFinancialAuxCharts() {
    const cfCanvas = document.getElementById('chart-cashflow-comparison');
    const expCanvas = document.getElementById('chart-expense-breakdown');
    if (cfCanvas) {
      const setup = setupHiDPICanvas(cfCanvas);
      if (setup) {
        const { ctx, width, height } = setup;
        ctx.clearRect(0, 0, width, height);

        const quarters = ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25'];
        const ocf = [98, 112, 124, 138];
        const ni = [78, 88, 101, 113];

        const barW = 24;
        const step = (width - 80) / quarters.length;

        quarters.forEach((q, i) => {
          const x = 50 + i * step;
          const y1 = height - 30 - (ocf[i] / 160) * (height - 60);
          const y2 = height - 30 - (ni[i] / 160) * (height - 60);

          // OCF bar
          ctx.fillStyle = '#2563EB';
          ctx.fillRect(x, y1, barW, height - 30 - y1);

          // Net income bar
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(x + barW + 4, y2, barW, height - 30 - y2);

          // Label
          ctx.fillStyle = '#94A3B8';
          ctx.font = '11px sans-serif';
          ctx.fillText(q, x + 8, height - 10);
        });
      }
    }

    if (expCanvas) {
      const setup = setupHiDPICanvas(expCanvas);
      if (setup) {
        const { ctx, width, height } = setup;
        ctx.clearRect(0, 0, width, height);

        const items = [
          { name: 'Compensation & Carry', pct: 48, col: '#1D4ED8' },
          { name: 'Tech Infrastructure', pct: 24, col: '#2563EB' },
          { name: 'General & Administrative', pct: 16, col: '#38BDF8' },
          { name: 'Professional Audit / Legal', pct: 12, col: '#64748B' }
        ];

        let curX = 30;
        const totalW = width - 60;
        items.forEach(it => {
          const w = (it.pct / 100) * totalW;
          ctx.fillStyle = it.col;
          ctx.fillRect(curX, height / 2 - 20, w, 40);
          curX += w;
        });

        // Legends under
        ctx.font = '10px sans-serif';
        items.forEach((it, idx) => {
          const ly = height - 15;
          const lx = 30 + idx * (totalW / 4);
          ctx.fillStyle = it.col;
          ctx.fillRect(lx, ly - 8, 8, 8);
          ctx.fillStyle = '#E2E8F0';
          ctx.fillText(it.name + ' (' + it.pct + '%)', lx + 12, ly);
        });
      }
    }
  }

  // Alpha Benchmark & DRIP Projection
  function renderAnalyticsCharts() {
    const alphaCanvas = document.getElementById('chart-benchmark-alpha');
    const dripCanvas = document.getElementById('chart-drip-projection');

    if (alphaCanvas) {
      const setup = setupHiDPICanvas(alphaCanvas);
      if (setup) {
        const { ctx, width, height } = setup;
        ctx.clearRect(0, 0, width, height);

        const years = ['2021', '2022', '2023', '2024', '2025'];
        const aurvReturn = [0, 24, 62, 108, 148];
        const sp500 = [0, -12, 18, 54, 84];

        const step = (width - 80) / (years.length - 1);
        const padL = 45;
        const padT = 20;
        const hSpan = height - 50;

        // Aurevia
        ctx.beginPath();
        aurvReturn.forEach((v, i) => {
          const x = padL + i * step;
          const y = padT + hSpan - (v / 160) * hSpan;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 2.6;
        ctx.stroke();

        // S&P 500
        ctx.beginPath();
        sp500.forEach((v, i) => {
          const x = padL + i * step;
          const y = padT + hSpan - (v / 160) * hSpan;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Years
        years.forEach((yr, i) => {
          ctx.fillStyle = '#94A3B8';
          ctx.font = '10px sans-serif';
          ctx.fillText(yr, padL + i * step - 10, height - 10);
        });
      }
    }

    if (dripCanvas) {
      const setup = setupHiDPICanvas(dripCanvas);
      if (setup) {
        const { ctx, width, height } = setup;
        ctx.clearRect(0, 0, width, height);

        const steps = 10;
        const stepW = (width - 60) / steps;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const x = 40 + i * stepW;
          // Compounding $100k at 12% DRIP
          const compVal = 100 * Math.pow(1.12, i);
          const y = (height - 30) - (compVal / 350) * (height - 60);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.font = '11px sans-serif';
        ctx.fillText('10-Year Compounding: 3.1x Value Growth with Automatic Reinvestment', 40, 24);
      }
    }
  }

  // Initialize all charts
  function refreshAllCharts() {
    // 8 Sparklines
    drawSparkline('spark-valuation', [4.2, 4.3, 4.4, 4.5, 4.6, 4.8], true);
    drawSparkline('spark-revenue', [570, 595, 620, 650, 682], true);
    drawSparkline('spark-growth', [14, 15.2, 16.5, 17.8, 18.7], true);
    drawSparkline('spark-ebitda', [118, 124, 132, 139, 146], true);
    drawSparkline('spark-share-price', [78, 80, 82.5, 81.2, 84.6], true);
    drawSparkline('spark-dividend', [2.1, 2.2, 2.3, 2.36], true);
    drawSparkline('spark-confidence', [88, 90, 92, 94], true);
    drawSparkline('spark-shareholders', [16800, 17200, 17800, 18420], true);

    // Main Charts
    renderOverviewChart(AppState.overviewRange);

    // Donut Allocations
    renderDonutChart('chart-overview-allocation', 'overview-allocation-legend', [
      { label: 'Mid-Market PE Core', val: 44, color: '#1D4ED8' },
      { label: 'Strategic Credit', val: 31, color: '#2563EB' },
      { label: 'Aurevia Vantage Tech', val: 15, color: '#38BDF8' },
      { label: 'Treasury Reserves', val: 10, color: '#64748B' }
    ]);

    renderDonutChart('chart-rev-region', 'legend-rev-region', [
      { label: 'North America (US/CA)', val: 52, color: '#1D4ED8' },
      { label: 'EMEA (UK/Zurich)', val: 28, color: '#2563EB' },
      { label: 'Asia-Pacific (APAC)', val: 16, color: '#38BDF8' },
      { label: 'Latin America', val: 4, color: '#64748B' }
    ]);

    renderDonutChart('chart-rev-product', 'legend-rev-product', [
      { label: 'Management Fees', val: 58, color: '#1D4ED8' },
      { label: 'Performance Carry', val: 24, color: '#2563EB' },
      { label: 'Vantage Platform SaaS', val: 18, color: '#38BDF8' }
    ]);

    renderSharePriceChart();
    renderFinancialAuxCharts();
    renderAnalyticsCharts();
  }

  /* ==========================================================================
     5. DOM RENDERING & VIEW POPULATION
     ========================================================================== */

  // Render Financial Statement Table
  function renderFinancialTable(type = 'income') {
    const table = document.getElementById('financial-statement-table');
    if (!table) return;

    if (type === 'income') {
      table.innerHTML = `
        <thead>
          <tr>
            <th>Line Item ($ in Millions)</th>
            <th>FY 2022</th>
            <th>FY 2023</th>
            <th>FY 2024</th>
            <th>FY 2025 (Audited)</th>
            <th>YoY Growth</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="row-header">Management & Advisory Fees</td>
            <td>$298.0</td><td>$362.4</td><td>$468.2</td><td>$558.0</td>
            <td class="text-success">+19.2%</td>
          </tr>
          <tr>
            <td class="row-header">Vantage™ Platform Software Licensing</td>
            <td>$67.0</td><td>$77.6</td><td>$106.6</td><td>$124.4</td>
            <td class="text-success">+16.7%</td>
          </tr>
          <tr class="total-row">
            <td class="row-header">Total Consolidated Revenue</td>
            <td>$365.0</td><td>$440.0</td><td>$574.8</td><td>$682.4</td>
            <td class="text-success">+18.7%</td>
          </tr>
          <tr>
            <td class="row-header">Cost of Services & Data Operations</td>
            <td>($102.2)</td><td>($121.0)</td><td>($155.2)</td><td>($184.2)</td>
            <td>+18.7%</td>
          </tr>
          <tr>
            <td class="row-header">Gross Profit</td>
            <td>$262.8</td><td>$319.0</td><td>$419.6</td><td>$498.2</td>
            <td class="text-success">+18.7%</td>
          </tr>
          <tr>
            <td class="row-header">Sales, General & Administrative</td>
            <td>($184.8)</td><td>($227.0)</td><td>($268.4)</td><td>($313.6)</td>
            <td>+16.8%</td>
          </tr>
          <tr class="total-row">
            <td class="row-header">Operating EBITDA</td>
            <td>$78.0</td><td>$92.0</td><td>$122.0</td><td>$146.0</td>
            <td class="text-success">+19.7%</td>
          </tr>
          <tr>
            <td class="row-header">Net Income to Common Shareholders</td>
            <td>$58.2</td><td>$71.4</td><td>$94.5</td><td>$112.8</td>
            <td class="text-success">+19.4%</td>
          </tr>
          <tr>
            <td class="row-header">Diluted EPS ($)</td>
            <td>$1.06</td><td>$1.29</td><td>$1.69</td><td>$1.99</td>
            <td class="text-success">+17.8%</td>
          </tr>
        </tbody>
      `;
    } else if (type === 'balance') {
      table.innerHTML = `
        <thead>
          <tr>
            <th>Balance Sheet Classification ($M)</th>
            <th>FY 2023</th>
            <th>FY 2024</th>
            <th>FY 2025 (Audited)</th>
            <th>Liquidity Ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="row-header">Cash & Cash Equivalents</td><td>$94.2</td><td>$118.5</td><td>$142.0</td><td>Immediate</td></tr>
          <tr><td class="row-header">Marketable Securities & Liquid Funds</td><td>$160.0</td><td>$210.0</td><td>$280.0</td><td>T+2 Days</td></tr>
          <tr><td class="row-header">Direct Co-Investment Portfolio</td><td>$2,450.0</td><td>$3,120.0</td><td>$3,840.0</td><td>Level 3 Fair Value</td></tr>
          <tr><td class="row-header">Goodwill & Proprietary Intangibles</td><td>$480.0</td><td>$680.0</td><td>$978.0</td><td>Amortized</td></tr>
          <tr class="total-row"><td class="row-header">Total Consolidated Assets</td><td>$3,184.2</td><td>$4,128.5</td><td>$5,240.0</td><td class="text-success">+26.9%</td></tr>
          <tr><td class="row-header">Senior Long-Term Notes (Due 2031)</td><td>$420.0</td><td>$420.0</td><td>$420.0</td><td>Fixed 4.25%</td></tr>
          <tr><td class="row-header">Accounts Payable & Accruals</td><td>$410.0</td><td>$540.0</td><td>$760.0</td><td>Current</td></tr>
          <tr class="total-row"><td class="row-header">Total Shareholders' Equity</td><td>$2,354.2</td><td>$3,168.5</td><td>$4,060.0</td><td class="text-success">Tier 1 Strong</td></tr>
        </tbody>
      `;
    } else {
      table.innerHTML = `
        <thead>
          <tr>
            <th>Cash Flow Vector ($ in Millions)</th>
            <th>FY 2023</th>
            <th>FY 2024</th>
            <th>FY 2025</th>
            <th>Conversion %</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="row-header">Net Income Cash Generation</td><td>$71.4</td><td>$94.5</td><td>$112.8</td><td>100%</td></tr>
          <tr><td class="row-header">Depreciation & Non-Cash Amortization</td><td>$16.2</td><td>$20.4</td><td>$24.2</td><td>Non-Cash</td></tr>
          <tr class="total-row"><td class="row-header">Net Cash from Operating Activities</td><td>$84.5</td><td>$114.2</td><td>$138.5</td><td class="text-success">94.8% FCF</td></tr>
          <tr><td class="row-header">Capital Expenditures & Platform Dev</td><td>($22.0)</td><td>($28.5)</td><td>($34.0)</td><td>Growth Reinvestment</td></tr>
          <tr><td class="row-header">Dividends Paid to Shareholders</td><td>($31.2)</td><td>($44.5)</td><td>($56.2)</td><td>Capital Return</td></tr>
          <tr class="total-row"><td class="row-header">Ending Cash Balance</td><td>$94.2</td><td>$118.5</td><td>$142.0</td><td class="text-success">+$23.5M Net</td></tr>
        </tbody>
      `;
    }
  }

  // Render Shareholders
  function renderShareholdersTable() {
    const tbody = document.getElementById('shareholders-table-body');
    if (!tbody) return;
    tbody.innerHTML = AppState.shareholders.map((sh, idx) => `
      <tr>
        <td style="font-weight:600; color:var(--text-pure-white);">${sh.name}</td>
        <td><span class="badge-tag">${sh.type}</span></td>
        <td>${sh.shares}</td>
        <td style="font-weight:700; color:var(--color-ice-blue);">${sh.pct}</td>
        <td>${sh.value}</td>
        <td class="${sh.change.startsWith('+') ? 'text-success' : ''}">${sh.change}</td>
        <td>${sh.date}</td>
        <td>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.previewShareholder('${sh.name}')">View 13F</button>
        </td>
      </tr>
    `).join('');
  }

  // Render Dividends
  function renderDividendsTable() {
    const tbody = document.getElementById('dividend-table-body');
    if (!tbody) return;
    tbody.innerHTML = AppState.dividends.map((d, i) => `
      <tr>
        <td>${d.declDate}</td>
        <td>${d.type}</td>
        <td style="font-weight:700; color:var(--text-pure-white);">${d.amount}</td>
        <td>${d.exDate}</td>
        <td>${d.recDate}</td>
        <td>${d.payDate}</td>
        <td><span class="badge-tag ${d.status === 'Paid' ? 'success' : 'accent'}">${d.status}</span></td>
        <td>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.downloadDividendReceipt('${d.payDate}', '${d.amount}')">Receipt</button>
        </td>
      </tr>
    `).join('');
  }

  // Render Reports
  function renderReports(filterCategory = 'all') {
    const container = document.getElementById('reports-cards-grid');
    if (!container) return;

    const filtered = filterCategory === 'all'
      ? AppState.reports
      : AppState.reports.filter(r => r.category.toLowerCase() === filterCategory.toLowerCase());

    container.innerHTML = filtered.map(r => `
      <div class="report-card">
        <div>
          <div class="report-header">
            <div class="report-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div class="report-title-row">
              <span class="report-period">${r.period} • ${r.category}</span>
              <h4 class="report-title">${r.title}</h4>
            </div>
          </div>
          <div class="report-meta-list">
            <div>Published: <strong>${r.date}</strong></div>
            <div>Status: <span class="text-success">${r.status}</span> • ${r.pages} Pages (${r.size})</div>
          </div>
        </div>
        <div class="report-actions">
          <button type="button" class="btn btn-primary btn-sm" onclick="window.PortalEngine.previewDocument('${r.id}', 'report')">Preview</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.downloadFile('${r.title}.pdf', 'report')">Download</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.openShareModal('${r.title}')">Share</button>
        </div>
      </div>
    `).join('');
  }

  // Render Documents
  function renderDocuments(filterCat = 'all') {
    const tbody = document.getElementById('docs-table-body');
    if (!tbody) return;

    let list = AppState.documents;
    if (filterCat === 'Favorites') {
      list = list.filter(d => d.favorite);
    } else if (filterCat !== 'all') {
      list = list.filter(d => d.category.toLowerCase() === filterCat.toLowerCase());
    }

    tbody.innerHTML = list.map(d => `
      <tr>
        <td>
          <button type="button" class="icon-btn-ghost" onclick="window.PortalEngine.toggleDocFavorite('${d.id}')" title="Toggle Favorite">
            <span style="color:${d.favorite ? '#F59E0B' : '#64748B'}; font-size:1.1rem;">${d.favorite ? '★' : '☆'}</span>
          </button>
        </td>
        <td style="font-weight:600; color:var(--text-pure-white);">${d.name}</td>
        <td><span class="badge-tag">${d.category}</span></td>
        <td>${d.date}</td>
        <td>${d.owner}</td>
        <td><span class="badge-tag accent">${d.ext}</span></td>
        <td>${d.size}</td>
        <td><span class="text-success">Verified</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.previewDocument('${d.id}', 'doc')">View</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.downloadFile('${d.name}.${d.ext.toLowerCase()}', 'doc')">Download</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Render Earnings Calendar
  function renderEarningsCalendar() {
    const tbody = document.getElementById('earnings-table-body');
    if (!tbody) return;
    tbody.innerHTML = AppState.earnings.map(ev => `
      <tr>
        <td style="font-weight:600; color:var(--text-pure-white);">${ev.date}<br><small style="color:var(--text-cool-gray);">${ev.time}</small></td>
        <td><span class="badge-tag accent">${ev.period}</span></td>
        <td>${ev.title}</td>
        <td style="font-family:var(--font-mono); font-size:0.8rem;">${ev.dialIn}</td>
        <td><span class="badge-tag ${ev.status === 'Upcoming' ? 'highlight' : ''}">${ev.status}</span></td>
        <td>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.addEventReminder('${ev.id}', '${ev.title}')">Add Reminder</button>
        </td>
      </tr>
    `).join('');
  }

  // Render Corporate Events
  function renderCorporateEvents() {
    const grid = document.getElementById('corporate-events-grid');
    if (!grid) return;
    grid.innerHTML = AppState.events.map(ev => {
      const isReg = AppState.registeredEvents.includes(ev.id);
      return `
        <div class="event-item-card">
          <div>
            <span class="event-status-pill ${isReg ? 'registered' : 'upcoming'}">
              ${isReg ? '✓ Registered Participant' : ev.status}
            </span>
            <h4 class="event-title">${ev.title}</h4>
            <div class="event-details">
              <div><strong>Date & Time:</strong> ${ev.date} • ${ev.time}</div>
              <div><strong>Location:</strong> ${ev.location}</div>
              <div><strong>Host / Chair:</strong> ${ev.host}</div>
              <div><strong>Expected Delegation:</strong> ${ev.attendees}</div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn ${isReg ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="window.PortalEngine.toggleEventRegistration('${ev.id}')">
              ${isReg ? 'Cancel Registration' : 'Register Seat'}
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.addEventReminder('${ev.id}', '${ev.title}')">Add to Calendar</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render News
  function renderNews(filterCat = 'all') {
    const grid = document.getElementById('news-articles-grid');
    if (!grid) return;

    const filtered = filterCat === 'all'
      ? AppState.news
      : AppState.news.filter(n => n.category.toLowerCase() === filterCat.toLowerCase());

    grid.innerHTML = filtered.map(n => `
      <div class="news-card">
        <div>
          <div class="news-category-badge">${n.category} Disclosures</div>
          <h4 class="news-headline">${n.headline}</h4>
          <p class="news-summary">${n.summary}</p>
        </div>
        <div class="news-footer-meta">
          <span>${n.date} • ${n.author}</span>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-text-sm" onclick="window.PortalEngine.readArticle('${n.id}')">Read Story &rarr;</button>
            <button type="button" class="btn-text-sm" onclick="window.PortalEngine.openShareModal('${n.headline}')">Share</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render CEO Updates
  function renderUpdates() {
    const stream = document.getElementById('updates-stream-container');
    if (!stream) return;
    stream.innerHTML = AppState.updates.map(u => `
      <div class="update-card ${u.read ? '' : 'unread'}">
        <div class="update-header-row">
          <div class="update-author-info">
            <div class="author-avatar">${u.author.split(' ').map(s=>s[0]).join('')}</div>
            <div>
              <div class="author-name">${u.author}</div>
              <div class="author-role">${u.role}</div>
            </div>
          </div>
          <span style="font-size:0.78rem; color:var(--text-cool-gray);">${u.date}</span>
        </div>
        <h3 style="color:var(--text-pure-white); font-size:1.15rem; margin-bottom:12px;">${u.title}</h3>
        <div class="update-content" style="white-space: pre-line;">${u.content}</div>
        <div class="update-actions-row">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.toggleUpdateRead('${u.id}')">
            ${u.read ? 'Mark as Unread' : 'Mark as Read'}
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.downloadFile('${u.title}.txt', 'update')">Download Transcript</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.openShareModal('${u.title}')">Share Executive Update</button>
        </div>
      </div>
    `).join('');
  }

  // Render Portfolio Holdings
  function renderHoldingsTable() {
    const tbody = document.getElementById('holdings-table-body');
    if (!tbody) return;

    let totalVal = 0;
    let totalCost = 0;

    tbody.innerHTML = AppState.holdings.map(h => {
      const val = h.shares * h.currentPrice;
      const cost = h.shares * h.avgPrice;
      const gain = val - cost;
      const gainPct = ((gain / cost) * 100).toFixed(1);
      totalVal += val;
      totalCost += cost;

      return `
        <tr>
          <td>
            <strong style="color:var(--text-pure-white);">${h.symbol}</strong><br>
            <small style="color:var(--text-cool-gray);">${h.name}</small>
          </td>
          <td><span class="badge-tag">${h.assetClass}</span></td>
          <td>${h.shares.toLocaleString()}</td>
          <td>$${h.avgPrice.toFixed(2)}</td>
          <td style="font-weight:700; color:var(--text-pure-white);">$${h.currentPrice.toFixed(2)}</td>
          <td style="font-weight:700; color:var(--color-ice-blue);">$${val.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
          <td class="${gain >= 0 ? 'text-success' : 'text-danger'}">
            ${gain >= 0 ? '▲ +' : '▼ -'}$${Math.abs(gain).toLocaleString(undefined, {minimumFractionDigits: 2})} (${gainPct}%)
          </td>
          <td>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.editHolding('${h.id}')">Edit</button>
              <button type="button" class="btn btn-danger-ghost btn-sm" onclick="window.PortalEngine.deleteHolding('${h.id}')">Remove</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Update Totals
    const totGain = totalVal - totalCost;
    const totGainPct = totalCost > 0 ? ((totGain / totalCost) * 100).toFixed(1) : '0.0';

    const valEl = document.getElementById('port-total-val');
    const gainEl = document.getElementById('port-total-gain');
    const gainPctEl = document.getElementById('port-total-gain-pct');

    if (valEl) valEl.textContent = '$' + totalVal.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (gainEl) gainEl.textContent = (totGain >= 0 ? '+$' : '-$') + Math.abs(totGain).toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (gainPctEl) gainPctEl.textContent = (totGain >= 0 ? '+' : '-') + totGainPct + '% Cumulative Return';
  }

  // Render Watchlist
  function renderWatchlist() {
    const tbody = document.getElementById('watchlist-table-body');
    if (!tbody) return;
    tbody.innerHTML = AppState.watchlist.map((w, idx) => `
      <tr>
        <td>
          <strong style="color:var(--text-pure-white);">${w.symbol}</strong> &bull; ${w.name}
        </td>
        <td>${w.cap}</td>
        <td style="font-weight:700; color:var(--text-pure-white);">$${w.price.toFixed(2)}</td>
        <td class="${w.change.startsWith('+') ? 'text-success' : 'text-danger'}">${w.change}</td>
        <td>${w.range}</td>
        <td><span class="badge-tag highlight">${w.rating}</span></td>
        <td>${w.vol}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.viewWatchlistCompany('${w.symbol}')">Inspect</button>
            <button type="button" class="btn btn-danger-ghost btn-sm" onclick="window.PortalEngine.removeFromWatchlist('${w.symbol}')">Remove</button>
          </div>
        </td>
      </tr>
    `).join('');

    const badge = document.getElementById('sidebar-watchlist-count');
    if (badge) badge.textContent = AppState.watchlist.length;
  }

  // Render Investment Notes
  function renderNotes() {
    const grid = document.getElementById('investment-notes-list');
    if (!grid) return;
    grid.innerHTML = AppState.notes.map(n => `
      <div class="note-item">
        <div>
          <div class="note-header">
            <h4 class="note-title">${n.title}</h4>
            <span class="note-tag">${n.tag}</span>
          </div>
          <p class="note-text">${n.text}</p>
        </div>
        <div class="note-footer">
          <span>Saved: ${n.date}</span>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-text-sm" onclick="window.PortalEngine.editNote('${n.id}')">Edit</button>
            <button type="button" class="btn-text-sm text-danger" onclick="window.PortalEngine.deleteNote('${n.id}')">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render 5x5 Risk Heat Matrix & Action Plan
  function renderRiskMatrix() {
    const grid = document.getElementById('risk-matrix-grid');
    if (!grid) return;

    // 5x5 Matrix cells (Impact 5 down to 1, Probability 1 up to 5)
    const riskPoints = [
      { row: 1, col: 4, name: 'Regulatory SEC Mandates', tag: 'R-REG' },
      { row: 2, col: 2, name: 'Market Beta Volatility', tag: 'R-MKT' },
      { row: 2, col: 5, name: 'Talent Sourcing Scale', tag: 'R-OPS' },
      { row: 4, col: 2, name: 'Liquidity / Debt Maturation', tag: 'R-LIQ' },
      { row: 3, col: 3, name: 'Proprietary Tech Infringement', tag: 'R-CYB' }
    ];

    let html = '';
    for (let r = 5; r >= 1; r--) {
      for (let c = 1; c <= 5; c++) {
        // Color gradient based on r * c
        const severity = r * c;
        let bg = 'rgba(16, 185, 129, 0.15)';
        if (severity >= 15) bg = 'rgba(244, 63, 94, 0.35)';
        else if (severity >= 8) bg = 'rgba(245, 158, 11, 0.25)';

        const point = riskPoints.find(p => p.row === r && p.col === c);

        html += `
          <div class="matrix-cell" style="background:${bg}; border:1px solid rgba(255,255,255,0.06);" title="Impact: ${r} / Prob: ${c}">
            ${point ? `<span class="cell-risk-tag">${point.tag}</span>` : ''}
          </div>
        `;
      }
    }
    grid.innerHTML = html;

    const actionList = document.getElementById('risk-action-list');
    if (actionList) {
      actionList.innerHTML = `
        <div class="preview-row">
          <div>
            <strong style="color:var(--text-pure-white);">PwC Independent Audit Committee</strong>
            <p style="font-size:0.75rem; color:var(--text-cool-gray);">Semi-annual stress testing against liquidity and credit spreads.</p>
          </div>
          <span class="badge-tag success">Compliant</span>
        </div>
        <div class="preview-row">
          <div>
            <strong style="color:var(--text-pure-white);">SOC 2 Type II Cloud Protocol</strong>
            <p style="font-size:0.75rem; color:var(--text-cool-gray);">Biometric and HSM-encrypted vaults protecting investor communications.</p>
          </div>
          <span class="badge-tag success">Active</span>
        </div>
        <div class="preview-row">
          <div>
            <strong style="color:var(--text-pure-white);">Anti-Dilutive Hedging Facilities</strong>
            <p style="font-size:0.75rem; color:var(--text-cool-gray);">$250M authorized equity buyback cushion.</p>
          </div>
          <span class="badge-tag accent">Funded</span>
        </div>
      `;
    }
  }

  // Render Messaging Threads & Active Chat
  function renderMessages() {
    const listEl = document.getElementById('threads-list');
    if (!listEl) return;

    listEl.innerHTML = AppState.messages.map(t => {
      const lastMsg = t.messages[t.messages.length - 1];
      const isActive = t.id === AppState.activeThreadId;
      return `
        <div class="thread-item ${isActive ? 'active' : ''}" onclick="window.PortalEngine.switchThread('${t.id}')">
          <div class="thread-avatar">${t.avatar}</div>
          <div class="thread-info">
            <div class="thread-name-row">
              <span class="thread-name">${t.with}</span>
              <span class="thread-time">${lastMsg ? lastMsg.time.split(',')[1] || '' : ''}</span>
            </div>
            <div class="thread-snippet">${lastMsg ? lastMsg.text : 'No messages'}</div>
          </div>
        </div>
      `;
    }).join('');

    // Active Thread Header & Messages
    const active = AppState.messages.find(t => t.id === AppState.activeThreadId);
    if (!active) return;

    const nameEl = document.getElementById('th-name');
    const titleEl = document.getElementById('th-title');
    const avEl = document.getElementById('th-avatar');
    const scrollEl = document.getElementById('thread-messages-scroll');

    if (nameEl) nameEl.textContent = active.with;
    if (titleEl) titleEl.textContent = active.title;
    if (avEl) avEl.textContent = active.avatar;

    if (scrollEl) {
      scrollEl.innerHTML = active.messages.map(m => `
        <div class="message-bubble ${m.sender === 'me' ? 'outgoing' : 'incoming'}">
          <div>${m.text}</div>
          <span class="msg-time">${m.time}</span>
        </div>
      `).join('');
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  }

  // Render Notifications (Header Dropdown & Full Center)
  function renderNotifications() {
    const unreadCount = AppState.notifications.filter(n => n.unread).length;

    // Badges
    const badgeTop = document.getElementById('header-notif-badge');
    const badgeSide = document.getElementById('sidebar-notif-count');
    if (badgeTop) badgeTop.textContent = unreadCount;
    if (badgeSide) badgeSide.textContent = unreadCount;

    // Dropdown list
    const dropList = document.getElementById('dropdown-notif-items');
    if (dropList) {
      dropList.innerHTML = AppState.notifications.slice(0, 4).map(n => `
        <div class="notif-dropdown-item ${n.unread ? 'unread' : ''}" onclick="window.PortalEngine.openNotification('${n.id}')">
          <div class="notif-row-top">
            <span class="notif-title">${n.title}</span>
            <span class="notif-time">${n.time}</span>
          </div>
          <div class="notif-text">${n.text}</div>
        </div>
      `).join('');
    }

    // Full Center List
    const fullList = document.getElementById('notifications-full-list');
    if (fullList) {
      fullList.innerHTML = AppState.notifications.map(n => `
        <div class="card glass-card mb-2 ${n.unread ? 'unread-border' : ''}" style="margin-bottom:10px;">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="badge-tag ${n.unread ? 'highlight' : ''}">${n.category}</span>
                <strong style="color:var(--text-pure-white);">${n.title}</strong>
              </div>
              <p style="color:var(--text-cool-gray); font-size:0.84rem; margin-top:4px;">${n.text}</p>
              <small style="color:var(--text-dark-muted);">${n.time}</small>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.openNotification('${n.id}')">View</button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.PortalEngine.toggleNotifRead('${n.id}')">
                ${n.unread ? 'Mark Read' : 'Unread'}
              </button>
              <button type="button" class="btn btn-danger-ghost btn-sm" onclick="window.PortalEngine.deleteNotif('${n.id}')">&times;</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Overview Recent Highlights
  function renderOverviewHighlights() {
    const filingsEl = document.getElementById('overview-recent-filings');
    const eventsEl = document.getElementById('overview-upcoming-events');

    if (filingsEl) {
      filingsEl.innerHTML = AppState.reports.slice(0, 3).map(r => `
        <div class="preview-row" onclick="window.PortalEngine.previewDocument('${r.id}', 'report')" style="cursor:pointer;">
          <div>
            <strong style="color:var(--text-pure-white); font-size:0.84rem;">${r.title}</strong>
            <div style="font-size:0.72rem; color:var(--text-dark-muted);">${r.date} • ${r.status}</div>
          </div>
          <span class="btn-text-sm">View &rarr;</span>
        </div>
      `).join('');
    }

    if (eventsEl) {
      eventsEl.innerHTML = AppState.earnings.slice(0, 3).map(e => `
        <div class="preview-row" onclick="window.PortalEngine.switchView('earnings')" style="cursor:pointer;">
          <div>
            <strong style="color:var(--text-pure-white); font-size:0.84rem;">${e.title}</strong>
            <div style="font-size:0.72rem; color:var(--text-dark-muted);">${e.date} • ${e.time}</div>
          </div>
          <span class="badge-tag accent">${e.status}</span>
        </div>
      `).join('');
    }
  }

  // Render Leadership Grid
  function renderLeadership() {
    const grid = document.getElementById('leadership-grid');
    if (!grid) return;
    const leaders = [
      { name: 'Elena Rostova', role: 'Founder & Chief Executive Officer', bio: 'Former Senior Managing Director at Carlyle; Harvard MBA. 22 years steering private equity buyouts and quantitative capital allocation.' },
      { name: 'Marcus Vance', role: 'Chief Financial Officer', bio: 'Ex-Morgan Stanley Investment Banking Managing Director. Oversees treasury balance sheet health, capital returns and SEC compliance.' },
      { name: 'Dr. Alistair Chen', role: 'Chief Technology Officer', bio: 'PhD in Algorithmic Computing from MIT. Architect of the proprietary Aurevia Vantage™ private deal screening analytics suite.' },
      { name: 'Julianne Thorne', role: 'Managing Director, Head of Private Credit', bio: 'Former Head of Direct Lending at Apollo. Manages EUR 1.8B in bespoke corporate yield solutions and senior secured facilities.' }
    ];

    grid.innerHTML = leaders.map(l => `
      <div class="leader-card">
        <div class="leader-avatar">${l.name.split(' ').map(s=>s[0]).join('')}</div>
        <h4 class="leader-name">${l.name}</h4>
        <div class="leader-role">${l.role}</div>
        <p class="leader-bio">${l.bio}</p>
      </div>
    `).join('');
  }

  /* ==========================================================================
     6. TOAST NOTIFICATION ENGINE
     ========================================================================== */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success' 
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease-out';
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }

  /* ==========================================================================
     7. GLOBAL MODAL CONTROLLER & DIALOGS
     ========================================================================== */
  const Modals = {
    open(modalId) {
      const el = document.getElementById(modalId);
      if (el) {
        el.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    },
    close(modalId) {
      const el = document.getElementById(modalId);
      if (el) {
        el.classList.add('hidden');
        document.body.style.overflow = '';
      }
    },
    closeAll() {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
      document.body.style.overflow = '';
    }
  };

  /* ==========================================================================
     8. PUBLIC ENGINE INTERFACE (ATTACHED TO WINDOW FOR ACTIONS)
     ========================================================================== */
  window.PortalEngine = {
    // Navigation
    switchView(viewName) {
      AppState.activeView = viewName;
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewName);
      });
      document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `view-${viewName}`);
      });

      // Close mobile sidebar if open
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Refresh layout-specific canvas
      setTimeout(() => {
        if (viewName === 'overview') {
          renderOverviewChart(AppState.overviewRange);
        } else if (viewName === 'shares') {
          renderSharePriceChart();
        } else if (viewName === 'financials') {
          renderFinancialAuxCharts();
        } else if (viewName === 'analytics') {
          renderAnalyticsCharts();
        }
      }, 50);
    },

    // Holdings CRUD
    openAddHolding() {
      const title = document.getElementById('action-modal-title');
      const body = document.getElementById('action-modal-body');
      const submit = document.getElementById('btn-action-submit');

      title.textContent = 'Add Security / Co-Investment Holding';
      body.innerHTML = `
        <form id="form-holding-modal">
          <div class="form-group mb-2">
            <label>Security Symbol / Ticker</label>
            <input type="text" id="m-hold-symbol" class="form-input" placeholder="e.g. AURV, AVTF" required>
          </div>
          <div class="form-group mb-2">
            <label>Asset Description</label>
            <input type="text" id="m-hold-name" class="form-input" placeholder="e.g. Aurevia Tech Fund Series C" required>
          </div>
          <div class="form-group mb-2">
            <label>Asset Class</label>
            <select id="m-hold-class" class="form-select">
              <option value="Public Equity">Public Equity</option>
              <option value="Private Venture PE">Private Venture PE</option>
              <option value="Real Assets Debt">Real Assets Debt</option>
              <option value="Direct Credit">Direct Credit</option>
            </select>
          </div>
          <div class="grid-two-col mb-2">
            <div>
              <label>Shares / Units Held</label>
              <input type="number" id="m-hold-shares" class="form-input" placeholder="1000" min="1" required>
            </div>
            <div>
              <label>Average Cost Basis ($)</label>
              <input type="number" id="m-hold-cost" class="form-input" placeholder="50.00" step="0.01" required>
            </div>
          </div>
          <div class="form-group">
            <label>Current Price ($)</label>
            <input type="number" id="m-hold-price" class="form-input" placeholder="84.60" step="0.01" required>
          </div>
        </form>
      `;

      submit.onclick = () => {
        const symbol = document.getElementById('m-hold-symbol').value.trim().toUpperCase();
        const name = document.getElementById('m-hold-name').value.trim();
        const cls = document.getElementById('m-hold-class').value;
        const shares = parseFloat(document.getElementById('m-hold-shares').value);
        const cost = parseFloat(document.getElementById('m-hold-cost').value);
        const price = parseFloat(document.getElementById('m-hold-price').value);

        if (!symbol || !name || isNaN(shares) || isNaN(cost) || isNaN(price)) {
          showToast('Please fill out all required holding details with valid numbers.', 'danger');
          return;
        }

        AppState.holdings.unshift({
          id: 'h-' + Date.now(),
          symbol,
          name,
          assetClass: cls,
          shares,
          avgPrice: cost,
          currentPrice: price
        });
        Storage.set(STORAGE_KEYS.HOLDINGS, AppState.holdings);
        renderHoldingsTable();
        Modals.close('action-modal');
        showToast(`Holding for ${symbol} successfully registered in portfolio.`);
      };

      Modals.open('action-modal');
    },

    editHolding(id) {
      const h = AppState.holdings.find(x => x.id === id);
      if (!h) return;

      const title = document.getElementById('action-modal-title');
      const body = document.getElementById('action-modal-body');
      const submit = document.getElementById('btn-action-submit');

      title.textContent = `Edit Holding: ${h.symbol}`;
      body.innerHTML = `
        <form id="form-holding-modal">
          <div class="form-group mb-2">
            <label>Asset Description</label>
            <input type="text" id="m-hold-name" class="form-input" value="${h.name}" required>
          </div>
          <div class="grid-two-col mb-2">
            <div>
              <label>Shares / Units Held</label>
              <input type="number" id="m-hold-shares" class="form-input" value="${h.shares}" min="1" required>
            </div>
            <div>
              <label>Average Cost Basis ($)</label>
              <input type="number" id="m-hold-cost" class="form-input" value="${h.avgPrice}" step="0.01" required>
            </div>
          </div>
          <div class="form-group">
            <label>Current Price ($)</label>
            <input type="number" id="m-hold-price" class="form-input" value="${h.currentPrice}" step="0.01" required>
          </div>
        </form>
      `;

      submit.onclick = () => {
        h.name = document.getElementById('m-hold-name').value.trim();
        h.shares = parseFloat(document.getElementById('m-hold-shares').value);
        h.avgPrice = parseFloat(document.getElementById('m-hold-cost').value);
        h.currentPrice = parseFloat(document.getElementById('m-hold-price').value);

        Storage.set(STORAGE_KEYS.HOLDINGS, AppState.holdings);
        renderHoldingsTable();
        Modals.close('action-modal');
        showToast(`Holding for ${h.symbol} updated.`);
      };

      Modals.open('action-modal');
    },

    deleteHolding(id) {
      const h = AppState.holdings.find(x => x.id === id);
      if (!h) return;

      this.confirmDialog(`Are you sure you wish to remove holding ${h.symbol} (${h.shares} shares) from your active portfolio ledger?`, () => {
        AppState.holdings = AppState.holdings.filter(x => x.id !== id);
        Storage.set(STORAGE_KEYS.HOLDINGS, AppState.holdings);
        renderHoldingsTable();
        showToast(`Holding ${h.symbol} removed.`);
      });
    },

    // Watchlist CRUD
    openAddWatchlist() {
      const title = document.getElementById('action-modal-title');
      const body = document.getElementById('action-modal-body');
      const submit = document.getElementById('btn-action-submit');

      title.textContent = 'Add Symbol to Watchlist';
      body.innerHTML = `
        <form>
          <div class="form-group mb-2">
            <label>Ticker Symbol</label>
            <input type="text" id="w-symbol" class="form-input" placeholder="e.g. MSFT, CG" required>
          </div>
          <div class="form-group mb-2">
            <label>Company / Vehicle Name</label>
            <input type="text" id="w-name" class="form-input" placeholder="e.g. Carlyle Group Inc." required>
          </div>
          <div class="grid-two-col mb-2">
            <div>
              <label>Current Price ($)</label>
              <input type="number" id="w-price" class="form-input" placeholder="42.50" step="0.01" required>
            </div>
            <div>
              <label>Market Capitalization</label>
              <input type="text" id="w-cap" class="form-input" placeholder="$15.4B" required>
            </div>
          </div>
        </form>
      `;

      submit.onclick = () => {
        const symbol = document.getElementById('w-symbol').value.trim().toUpperCase();
        const name = document.getElementById('w-name').value.trim();
        const price = parseFloat(document.getElementById('w-price').value);
        const cap = document.getElementById('w-cap').value.trim();

        if (!symbol || !name || isNaN(price)) {
          showToast('Please enter valid watchlist details.', 'danger');
          return;
        }

        AppState.watchlist.push({
          symbol,
          name,
          price,
          cap: cap || '$10.0B',
          change: '+0.50%',
          range: `$${(price*0.8).toFixed(1)} - $${(price*1.2).toFixed(1)}`,
          rating: 'Buy',
          vol: '1.50M'
        });
        Storage.set(STORAGE_KEYS.WATCHLIST, AppState.watchlist);
        renderWatchlist();
        Modals.close('action-modal');
        showToast(`Added ${symbol} to watchlist.`);
      };

      Modals.open('action-modal');
    },

    removeFromWatchlist(symbol) {
      AppState.watchlist = AppState.watchlist.filter(w => w.symbol !== symbol);
      Storage.set(STORAGE_KEYS.WATCHLIST, AppState.watchlist);
      renderWatchlist();
      showToast(`${symbol} removed from watchlist.`);
    },

    viewWatchlistCompany(symbol) {
      showToast(`Loading comprehensive research brief for ${symbol}...`);
      this.switchView('shares');
    },

    // Investment Notes CRUD
    openAddNote() {
      const title = document.getElementById('action-modal-title');
      const body = document.getElementById('action-modal-body');
      const submit = document.getElementById('btn-action-submit');

      title.textContent = 'Add Investment Thesis Note';
      body.innerHTML = `
        <form>
          <div class="form-group mb-2">
            <label>Note Title / Topic</label>
            <input type="text" id="nt-title" class="form-input" placeholder="e.g. Valuation Multiples Post-Q4" required>
          </div>
          <div class="form-group mb-2">
            <label>Category Tag</label>
            <input type="text" id="nt-tag" class="form-input" placeholder="e.g. Profitability, M&A, Credit" required>
          </div>
          <div class="form-group">
            <label>Confidential Analysis Text</label>
            <textarea id="nt-text" class="form-input" rows="4" placeholder="Type detailed thesis notes here..." required></textarea>
          </div>
        </form>
      `;

      submit.onclick = () => {
        const titleVal = document.getElementById('nt-title').value.trim();
        const tag = document.getElementById('nt-tag').value.trim();
        const text = document.getElementById('nt-text').value.trim();

        if (!titleVal || !text) {
          showToast('Please provide a title and note body.', 'danger');
          return;
        }

        AppState.notes.unshift({
          id: 'n-' + Date.now(),
          title: titleVal,
          tag: tag || 'General',
          text,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        });
        Storage.set(STORAGE_KEYS.NOTES, AppState.notes);
        renderNotes();
        Modals.close('action-modal');
        showToast('Investment note saved successfully.');
      };

      Modals.open('action-modal');
    },

    deleteNote(id) {
      AppState.notes = AppState.notes.filter(n => n.id !== id);
      Storage.set(STORAGE_KEYS.NOTES, AppState.notes);
      renderNotes();
      showToast('Note deleted.');
    },

    // Event Registration & Reminders
    toggleEventRegistration(id) {
      if (AppState.registeredEvents.includes(id)) {
        AppState.registeredEvents = AppState.registeredEvents.filter(x => x !== id);
        showToast('Event registration cancelled.');
      } else {
        AppState.registeredEvents.push(id);
        showToast('Seat successfully registered for event! Verification confirmation dispatched to your email.');
      }
      Storage.set(STORAGE_KEYS.EVENTS_REGISTRATION, AppState.registeredEvents);
      renderCorporateEvents();
    },

    addEventReminder(id, title) {
      showToast(`Reminder set for: ${title}. Added to calendar.`);
    },

    // Document & Report Previews
    previewDocument(id, type) {
      const modal = document.getElementById('preview-modal');
      const titleEl = document.getElementById('preview-title');
      const badgeEl = document.getElementById('preview-badge');
      const bodyEl = document.getElementById('preview-body');

      let title = 'Official Regulatory Document';
      let content = '';

      if (type === 'report') {
        const r = AppState.reports.find(x => x.id === id) || AppState.reports[0];
        title = r.title;
        badgeEl.textContent = `${r.category} • ${r.status}`;
        content = `
          <div style="font-family: serif; color: var(--text-platinum); line-height: 1.7;">
            <div style="text-align:center; border-bottom:2px solid var(--color-sapphire-600); padding-bottom:14px; margin-bottom:18px;">
              <h2 style="font-size:1.4rem; letter-spacing:0.1em; color:var(--text-pure-white);">UNITED STATES SECURITIES AND EXCHANGE COMMISSION</h2>
              <div style="font-size:0.85rem; color:var(--text-cool-gray);">Washington, D.C. 20549 • FORM ${r.category.toUpperCase()}</div>
              <h3 style="font-size:1.2rem; color:var(--color-ice-blue); margin-top:8px;">AUREVIA CAPITAL GROUP INC.</h3>
              <div style="font-size:0.8rem; color:var(--text-dark-muted);">Commission File Number: 001-39482 • CUSIP: 05284B104</div>
            </div>
            <p><strong>Item 1. Financial Statements.</strong></p>
            <p>For the fiscal period ended December 31, 2025, Aurevia Capital Group Inc. recorded consolidated net revenues of $682.4 million compared to $574.8 million in the corresponding prior-year timeframe. Operating EBITDA increased 19.7% to $146.0 million.</p>
            <p><strong>Capital Resources and Liquidity:</strong></p>
            <p>The Registrant maintained $142.0 million in cash and cash equivalents, along with $380.0 million in undrawn revolving credit facility capacity. No long-term institutional notes mature prior to Q3 2031.</p>
          </div>
        `;
      } else {
        const d = AppState.documents.find(x => x.id === id) || AppState.documents[0];
        title = d.name;
        badgeEl.textContent = `${d.category} • ${d.ext}`;
        content = `
          <div style="color:var(--text-soft-silver); line-height:1.6;">
            <h3 style="color:var(--text-pure-white); margin-bottom:12px;">${d.name}</h3>
            <p><strong>Publisher:</strong> ${d.owner} | <strong>Filing Date:</strong> ${d.date} | <strong>Format:</strong> ${d.ext} (${d.size})</p>
            <hr style="border:none; border-top:1px solid var(--border-subtle); margin:14px 0;">
            <p>This verified institutional artifact is governed under the Aurevia Capital Corporate Governance and Investor Relations mandate. Authorized for accredited investors, financial analysts and board members.</p>
            <p>All exhibits, governance charters and financial schedules herein have been cross-checked by internal compliance counsel and validated with SEC EDGAR repository synchronization.</p>
          </div>
        `;
      }

      titleEl.textContent = title;
      bodyEl.innerHTML = content;
      Modals.open('preview-modal');
    },

    previewShareholder(name) {
      const sh = AppState.shareholders.find(x => x.name === name);
      if (!sh) return;
      this.previewDocument('sh', 'doc');
      document.getElementById('preview-title').textContent = `Form 13F Filing: ${sh.name}`;
      document.getElementById('preview-body').innerHTML = `
        <div style="line-height:1.6;">
          <h3 style="color:var(--text-pure-white);">${sh.name}</h3>
          <p><strong>Ownership Interest:</strong> ${sh.pct} (${sh.shares} common shares)</p>
          <p><strong>Portfolio Position Value:</strong> ${sh.value}</p>
          <p><strong>Quarterly Movement:</strong> ${sh.change}</p>
          <p><strong>Reporting Cycle:</strong> Trailing quarter ended ${sh.date}</p>
        </div>
      `;
    },

    toggleDocFavorite(id) {
      const d = AppState.documents.find(x => x.id === id);
      if (d) {
        d.favorite = !d.favorite;
        Storage.set(STORAGE_KEYS.DOCUMENTS, AppState.documents);
        renderDocuments();
        showToast(d.favorite ? `Added ${d.name} to favorites.` : `Removed from favorites.`);
      }
    },

    readArticle(id) {
      const n = AppState.news.find(x => x.id === id);
      if (!n) return;
      n.views++;
      const modal = document.getElementById('preview-modal');
      document.getElementById('preview-title').textContent = n.headline;
      document.getElementById('preview-badge').textContent = `Wire Release • ${n.category}`;
      document.getElementById('preview-body').innerHTML = `
        <div style="line-height:1.7;">
          <div style="color:var(--text-cool-gray); font-size:0.8rem; margin-bottom:14px;">Published ${n.date} by ${n.author} &bull; ${n.views} Views</div>
          <p style="font-size:1.05rem; font-weight:600; color:var(--text-pure-white);">${n.summary}</p>
          <p class="mt-3">NEW YORK &mdash; Aurevia Capital Group Inc. (NYSE: AURV), a preeminent alternative asset manager and financial technology innovator, today officially disclosed detailed developments regarding its capital markets progress.</p>
          <p class="mt-2">Managing Principal Elena Rostova commented: "Our continued strategic execution underscores the resilience of our platform across varied rate environments. We remain resolute in delivering compounded value for our institutional partners."</p>
        </div>
      `;
      Modals.open('preview-modal');
    },

    toggleUpdateRead(id) {
      const u = AppState.updates.find(x => x.id === id);
      if (u) {
        u.read = !u.read;
        Storage.set(STORAGE_KEYS.UPDATES, AppState.updates);
        renderUpdates();
        showToast(u.read ? 'Marked as read.' : 'Marked as unread.');
      }
    },

    // Instant Client-Side File Downloads
    downloadFile(filename, type = 'doc') {
      const content = `AUREVIA CAPITAL — OFFICIAL INVESTOR ARCHIVE
Document: ${filename}
Generated for Authorized Investor: ${AppState.profile.name} (${AppState.profile.email})
Entity: ${AppState.profile.entity}
Timestamp: ${new Date().toISOString()}
Security Hash: SHA-256 Verified Institutional Grade
----------------------------------------------------------------------
FINANCIAL DISCLOSURE & CORPORATE GOVERNANCE SUMMARY
NYSE: AURV | Market Price: $84.60 | Enterprise Valuation: $4.8B
Audited Revenue (FY 2025): $682,400,000 | EBITDA: $146,000,000
Dividend Yield: 2.8% ($2.36/share) | Investor Confidence: 94%

CONFIDENTIAL NOTICE:
This archive contains proprietary investor relations data transmitted under fiduciary privilege.
© 2026 AUREVIA CAPITAL. All rights reserved.
`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Document "${filename}" downloaded successfully.`);
    },

    downloadDividendReceipt(date, amount) {
      this.downloadFile(`Aurevia_Dividend_Receipt_${date.replace(/\s+/g, '_')}.txt`, 'dividend');
    },

    // Report Generator Execution
    executeGenerateReport() {
      const type = document.getElementById('gen-report-type').value;
      const horizon = document.getElementById('gen-report-horizon').value;
      const format = document.getElementById('gen-report-format').value;

      const filename = `Aurevia_${type}_report_${horizon}.${format}`;
      let data = '';

      if (format === 'csv') {
        data = `Metric,Value,Period,Status\nRevenue,$682.4M,FY 2025,Audited\nEBITDA,$146.0M,FY 2025,Audited\nNet Income,$112.8M,FY 2025,Audited\nShare Price,$84.60,Current,NYSE:AURV\nValuation,$4.80B,Current,Market Cap\n`;
      } else {
        data = `<!DOCTYPE html><html><head><title>Aurevia Capital - ${type}</title><style>body{font-family:sans-serif;padding:30px;background:#05070C;color:#fff;}h1{color:#38BDF8;}</style></head><body><h1>AUREVIA CAPITAL</h1><h2>${type.toUpperCase()} REPORT (${horizon})</h2><p>Prepared for: ${AppState.profile.name} (${AppState.profile.entity})</p><hr><p>Consolidated Net Revenue: $682.4M</p><p>Operating EBITDA: $146.0M</p><p>Dividend Yield: 2.8%</p></body></html>`;
      }

      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Modals.close('generator-modal');
      showToast(`Report generated and downloaded: ${filename}`);
    },

    // Share Modal
    openShareModal(title = 'Aurevia Capital Briefing') {
      const input = document.getElementById('share-link-input');
      if (input) {
        input.value = `https://portal.aureviacapital.com/investor/briefing?ref=${encodeURIComponent(title.slice(0, 20))}`;
      }
      Modals.open('share-modal');
    },

    // Confirmation Modal
    confirmDialog(message, onConfirm) {
      const desc = document.getElementById('confirm-modal-desc');
      const proc = document.getElementById('btn-confirm-proceed');
      desc.textContent = message;
      proc.onclick = () => {
        Modals.close('confirm-modal');
        if (typeof onConfirm === 'function') onConfirm();
      };
      Modals.open('confirm-modal');
    },

    // Messaging
    switchThread(threadId) {
      AppState.activeThreadId = threadId;
      const thread = AppState.messages.find(t => t.id === threadId);
      if (thread) thread.unread = false;
      Storage.set(STORAGE_KEYS.MESSAGES, AppState.messages);
      renderMessages();
    },

    sendChatMessage(text) {
      if (!text || !text.trim()) return;
      const thread = AppState.messages.find(t => t.id === AppState.activeThreadId);
      if (!thread) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      thread.messages.push({
        sender: 'me',
        text: text.trim(),
        time: timeStr
      });

      // Automated Realistic Institutional Auto-Reply
      setTimeout(() => {
        thread.messages.push({
          sender: 'them',
          text: `Thank you Alexander. Your inquiry regarding "${text.slice(0, 30)}..." has been logged with the IR Compliance officer. We will review and attach the audited memo shortly.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        Storage.set(STORAGE_KEYS.MESSAGES, AppState.messages);
        renderMessages();
        showToast('New response received from Investor Relations desk.', 'info');
      }, 900);

      Storage.set(STORAGE_KEYS.MESSAGES, AppState.messages);
      renderMessages();
    },

    // Notification Actions
    openNotification(id) {
      const n = AppState.notifications.find(x => x.id === id);
      if (n) {
        n.unread = false;
        Storage.set(STORAGE_KEYS.NOTIFICATIONS, AppState.notifications);
        renderNotifications();
        if (n.targetView) this.switchView(n.targetView);
        document.getElementById('header-notif-dropdown').classList.add('hidden');
      }
    },

    toggleNotifRead(id) {
      const n = AppState.notifications.find(x => x.id === id);
      if (n) {
        n.unread = !n.unread;
        Storage.set(STORAGE_KEYS.NOTIFICATIONS, AppState.notifications);
        renderNotifications();
      }
    },

    deleteNotif(id) {
      AppState.notifications = AppState.notifications.filter(x => x.id !== id);
      Storage.set(STORAGE_KEYS.NOTIFICATIONS, AppState.notifications);
      renderNotifications();
      showToast('Notification cleared.');
    },

    // Auth Controller
    login(email, password) {
      AppState.isAuthenticated = true;
      Storage.set(STORAGE_KEYS.AUTH_STATE, true);
      document.getElementById('auth-view').classList.add('hidden');
      document.getElementById('portal-view').classList.remove('hidden');
      refreshAllCharts();
      showToast(`Welcome back, ${AppState.profile.name}. Institutional workspace authenticated.`);
    },

    logout() {
      AppState.isAuthenticated = false;
      Storage.set(STORAGE_KEYS.AUTH_STATE, false);
      document.getElementById('portal-view').classList.add('hidden');
      document.getElementById('auth-view').classList.remove('hidden');
      showToast('You have securely signed out of the Aurevia portal.');
    },

    // Global Search Engine
    performGlobalSearch(query) {
      const container = document.getElementById('search-results-container');
      if (!container) return;

      if (!query || query.trim().length === 0) {
        container.innerHTML = `
          <div style="padding:20px; text-align:center; color:var(--text-dark-muted);">
            Type to search across SEC filings, financial metrics, news, documents, shareholders and events.
          </div>
        `;
        return;
      }

      const q = query.toLowerCase();
      const results = [];

      // Search Reports
      AppState.reports.forEach(r => {
        if (r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)) {
          results.push({ title: r.title, sub: `Financial Report • ${r.period}`, tag: 'Report', action: () => { Modals.close('search-modal'); window.PortalEngine.switchView('reports'); window.PortalEngine.previewDocument(r.id, 'report'); } });
        }
      });

      // Search News
      AppState.news.forEach(n => {
        if (n.headline.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)) {
          results.push({ title: n.headline, sub: `Investor News • ${n.date}`, tag: 'News', action: () => { Modals.close('search-modal'); window.PortalEngine.switchView('news'); window.PortalEngine.readArticle(n.id); } });
        }
      });

      // Search Documents
      AppState.documents.forEach(d => {
        if (d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)) {
          results.push({ title: d.name, sub: `Document Center • ${d.owner}`, tag: 'Document', action: () => { Modals.close('search-modal'); window.PortalEngine.switchView('documents'); window.PortalEngine.previewDocument(d.id, 'doc'); } });
        }
      });

      // Search Shareholders
      AppState.shareholders.forEach(s => {
        if (s.name.toLowerCase().includes(q)) {
          results.push({ title: s.name, sub: `Shareholder • ${s.pct} Ownership`, tag: 'CapTable', action: () => { Modals.close('search-modal'); window.PortalEngine.switchView('shareholders'); } });
        }
      });

      // Search Holdings
      AppState.holdings.forEach(h => {
        if (h.symbol.toLowerCase().includes(q) || h.name.toLowerCase().includes(q)) {
          results.push({ title: `${h.symbol} - ${h.name}`, sub: `Holding • ${h.shares} Shares`, tag: 'Portfolio', action: () => { Modals.close('search-modal'); window.PortalEngine.switchView('portfolio'); } });
        }
      });

      if (results.length === 0) {
        container.innerHTML = `<div style="padding:24px; text-align:center; color:var(--text-dark-muted);">No records found matching "${query}".</div>`;
        return;
      }

      container.innerHTML = results.map((res, i) => `
        <div class="search-result-item" data-res-index="${i}">
          <div>
            <div class="sr-main">${res.title}</div>
            <div class="sr-sub">${res.sub}</div>
          </div>
          <span class="sr-tag">${res.tag}</span>
        </div>
      `).join('');

      // Attach click events
      container.querySelectorAll('.search-result-item').forEach((item, idx) => {
        item.addEventListener('click', () => results[idx].action());
      });
    }
  };

  /* ==========================================================================
     9. EVENT LISTENERS & APP BOOTSTRAP
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {

    // Initial state check
    if (AppState.isAuthenticated) {
      document.getElementById('auth-view').classList.add('hidden');
      document.getElementById('portal-view').classList.remove('hidden');
    } else {
      document.getElementById('auth-view').classList.remove('hidden');
      document.getElementById('portal-view').classList.add('hidden');
    }

    // Apply Settings
    if (AppState.settings.compactMode) document.body.classList.add('compact-mode');
    if (!AppState.settings.animations) document.body.classList.add('no-animations');
    if (AppState.settings.autoCollapseSidebar) document.getElementById('sidebar')?.classList.add('collapsed');

    // Populate UI
    renderFinancialTable('income');
    renderShareholdersTable();
    renderDividendsTable();
    renderReports();
    renderDocuments();
    renderEarningsCalendar();
    renderCorporateEvents();
    renderNews();
    renderUpdates();
    renderHoldingsTable();
    renderWatchlist();
    renderNotes();
    renderRiskMatrix();
    renderMessages();
    renderNotifications();
    renderOverviewHighlights();
    renderLeadership();

    // Attach Charts on initial load
    setTimeout(refreshAllCharts, 100);
    window.addEventListener('resize', () => {
      clearTimeout(window._resizeTimer);
      window._resizeTimer = setTimeout(refreshAllCharts, 150);
    });

    // --- Authentication Listeners ---
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      window.PortalEngine.login(email, pass);
    });

    document.getElementById('btn-demo-login')?.addEventListener('click', () => {
      window.PortalEngine.login('investor@aureviacapital.com', 'demo');
    });

    document.getElementById('btn-forgot-password')?.addEventListener('click', () => {
      showToast('Encrypted authorization reset token sent to your institutional email.', 'info');
    });

    document.getElementById('btn-quick-logout')?.addEventListener('click', () => window.PortalEngine.logout());
    document.getElementById('btn-dropdown-logout')?.addEventListener('click', () => window.PortalEngine.logout());

    // --- Sidebar Navigation Items ---
    document.getElementById('sidebar-nav')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-item');
      if (btn && btn.dataset.view) {
        window.PortalEngine.switchView(btn.dataset.view);
      }
    });

    document.getElementById('sidebar-collapse-btn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('collapsed');
    });

    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('open');
      document.getElementById('sidebar-overlay')?.classList.toggle('active');
    });

    document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.remove('open');
      document.getElementById('sidebar-overlay')?.classList.remove('active');
    });

    // --- Top Navigation Dropdowns ---
    const toggleMenu = (btnId, menuId) => {
      const btn = document.getElementById(btnId);
      const menu = document.getElementById(menuId);
      if (!btn || !menu) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menu.classList.contains('hidden');
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
        if (isHidden) menu.classList.remove('hidden');
      });
    };

    toggleMenu('btn-quick-action', 'quick-action-menu');
    toggleMenu('header-notif-btn', 'header-notif-dropdown');
    toggleMenu('top-profile-btn', 'top-profile-dropdown');

    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
    });

    // Quick Action Menu Clicks
    document.getElementById('quick-action-menu')?.addEventListener('click', (e) => {
      const item = e.target.closest('.menu-item');
      if (!item) return;
      const action = item.dataset.action;
      if (action === 'quick-holding') window.PortalEngine.openAddHolding();
      else if (action === 'quick-watchlist') window.PortalEngine.openAddWatchlist();
      else if (action === 'quick-report') { window.PortalEngine.switchView('reports'); window.PortalEngine.previewDocument('rep-2', 'report'); }
      else if (action === 'quick-register-event') { window.PortalEngine.toggleEventRegistration('ce-2'); }
      else if (action === 'quick-generate-report') { Modals.open('generator-modal'); }
      else if (action === 'quick-send-msg') { window.PortalEngine.switchView('messages'); }
      else if (action === 'quick-note') { window.PortalEngine.openAddNote(); }
      document.getElementById('quick-action-menu')?.classList.add('hidden');
    });

    // Profile Dropdown target clicks
    document.querySelectorAll('[data-view-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.PortalEngine.switchView(btn.dataset.viewTarget);
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
      });
    });

    document.getElementById('btn-export-briefing')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Capital_Executive_Briefing_Q4.pdf', 'report');
    });

    // --- Global Search Listeners ---
    const searchTrigger = document.getElementById('top-search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('global-search-input');

    const openSearch = () => {
      Modals.open('search-modal');
      setTimeout(() => searchInput?.focus(), 50);
      window.PortalEngine.performGlobalSearch('');
    };

    searchTrigger?.addEventListener('click', openSearch);
    document.getElementById('btn-close-search')?.addEventListener('click', () => Modals.close('search-modal'));

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      } else if (e.key === 'Escape') {
        Modals.closeAll();
      }
    });

    searchInput?.addEventListener('input', (e) => {
      window.PortalEngine.performGlobalSearch(e.target.value);
    });

    // --- Overview Actions ---
    document.getElementById('btn-refresh-overview')?.addEventListener('click', () => {
      showToast('Live NYSE market feed refreshed. Quote $84.60 synced.');
      refreshAllCharts();
    });
    document.getElementById('btn-print-summary')?.addEventListener('click', () => window.print());
    document.getElementById('btn-download-one-pager')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Capital_Institutional_OnePager.pdf', 'report');
    });

    // Overview Time Filters
    document.getElementById('overview-time-filters')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      document.querySelectorAll('#overview-time-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.overviewRange = btn.dataset.range;
      renderOverviewChart(AppState.overviewRange);
    });

    // --- Investment View Actions ---
    document.getElementById('btn-export-thesis')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Investment_Thesis_Dossier.pdf', 'report');
    });
    document.getElementById('btn-add-investment-note')?.addEventListener('click', () => window.PortalEngine.openAddNote());
    document.getElementById('btn-quick-new-note')?.addEventListener('click', () => window.PortalEngine.openAddNote());

    // --- Company Profile Actions ---
    document.getElementById('btn-edit-company-details')?.addEventListener('click', () => {
      const title = document.getElementById('action-modal-title');
      const body = document.getElementById('action-modal-body');
      const submit = document.getElementById('btn-action-submit');

      title.textContent = 'Edit Executive Corporate Profile';
      body.innerHTML = `
        <form>
          <div class="form-group mb-2">
            <label>Corporate Entity Name</label>
            <input type="text" id="ed-cp-name" class="form-input" value="${document.getElementById('cp-name').textContent}">
          </div>
          <div class="form-group mb-2">
            <label>Global Headquarters</label>
            <input type="text" id="ed-cp-hq" class="form-input" value="${document.getElementById('cp-hq').textContent}">
          </div>
          <div class="form-group">
            <label>Corporate Mission Mandate</label>
            <textarea id="ed-cp-mission" class="form-input" rows="3">${document.getElementById('cp-mission').textContent.replace(/"/g, '')}</textarea>
          </div>
        </form>
      `;

      submit.onclick = () => {
        document.getElementById('cp-name').textContent = document.getElementById('ed-cp-name').value;
        document.getElementById('cp-hq').textContent = document.getElementById('ed-cp-hq').value;
        document.getElementById('cp-mission').textContent = `"${document.getElementById('ed-cp-mission').value}"`;
        Modals.close('action-modal');
        showToast('Corporate profile updated.');
      };

      Modals.open('action-modal');
    });

    document.getElementById('btn-share-company')?.addEventListener('click', () => {
      window.PortalEngine.openShareModal('Aurevia Capital Corporate Profile');
    });

    document.getElementById('btn-download-factsheet')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Capital_Factsheet_2026.pdf', 'doc');
    });

    // --- Financials View Actions ---
    document.getElementById('financial-statement-select')?.addEventListener('change', (e) => {
      renderFinancialTable(e.target.value);
    });

    document.getElementById('btn-export-financials-csv')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Financial_Statements_GAAP.csv', 'report');
    });

    document.getElementById('btn-download-audit-pdf')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Audited_Financial_Statements_PwC.pdf', 'report');
    });

    // --- Valuation View Actions ---
    document.getElementById('btn-download-valuation-deck')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Valuation_Model_DCF_Multiples.pdf', 'report');
    });

    // --- Shares View Actions ---
    document.getElementById('btn-chart-line')?.addEventListener('click', (e) => {
      document.getElementById('btn-chart-line').classList.add('active');
      document.getElementById('btn-chart-candle').classList.remove('active');
      AppState.shareChartType = 'line';
      renderSharePriceChart();
    });

    document.getElementById('btn-chart-candle')?.addEventListener('click', (e) => {
      document.getElementById('btn-chart-candle').classList.add('active');
      document.getElementById('btn-chart-line').classList.remove('active');
      AppState.shareChartType = 'candle';
      renderSharePriceChart();
    });

    document.getElementById('share-chart-filters')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      document.querySelectorAll('#share-chart-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.shareChartTime = btn.dataset.time;
      renderSharePriceChart();
      showToast(`Share price timescale adjusted to ${btn.dataset.time}.`);
    });

    // --- Shareholder View Actions ---
    document.getElementById('btn-export-shareholders')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Shareholder_Registry_13F.csv', 'doc');
    });

    document.getElementById('btn-add-shareholder')?.addEventListener('click', () => {
      const title = document.getElementById('action-modal-title');
      const body = document.getElementById('action-modal-body');
      const submit = document.getElementById('btn-action-submit');

      title.textContent = 'Add Registered Shareholder';
      body.innerHTML = `
        <form>
          <div class="form-group mb-2">
            <label>Shareholder Legal Entity</label>
            <input type="text" id="sh-name" class="form-input" placeholder="e.g. Morgan Stanley Wealth Trust" required>
          </div>
          <div class="grid-two-col mb-2">
            <div>
              <label>Classification</label>
              <select id="sh-type" class="form-select">
                <option value="Institutional">Institutional</option>
                <option value="Sovereign">Sovereign</option>
                <option value="Insider">Insider</option>
              </select>
            </div>
            <div>
              <label>Ownership %</label>
              <input type="text" id="sh-pct" class="form-input" placeholder="3.50%" required>
            </div>
          </div>
          <div class="form-group">
            <label>Shares Held</label>
            <input type="text" id="sh-shares" class="form-input" placeholder="1,980,000" required>
          </div>
        </form>
      `;

      submit.onclick = () => {
        const name = document.getElementById('sh-name').value.trim();
        const type = document.getElementById('sh-type').value;
        const pct = document.getElementById('sh-pct').value.trim();
        const shares = document.getElementById('sh-shares').value.trim();

        if (!name || !shares) {
          showToast('Please fill required shareholder details.', 'danger');
          return;
        }

        AppState.shareholders.unshift({
          name,
          type,
          pct,
          shares,
          value: '$168.0M',
          change: 'New Entry',
          date: 'Feb 2026'
        });
        renderShareholdersTable();
        Modals.close('action-modal');
        showToast(`Shareholder entry for ${name} added.`);
      };

      Modals.open('action-modal');
    });

    // --- Dividends Actions ---
    document.getElementById('btn-export-dividends-csv')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Dividend_Tax_Ledger_2024_2026.csv', 'dividend');
    });
    document.getElementById('btn-dividend-reinvestment')?.addEventListener('click', () => {
      window.PortalEngine.switchView('analytics');
      showToast('Navigated to Dividend Compounding DRIP model in Analytics.');
    });

    // --- Reports Actions ---
    document.getElementById('reports-category-filters')?.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      document.querySelectorAll('#reports-category-filters .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderReports(pill.dataset.cat);
    });

    document.getElementById('search-reports-input')?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('#reports-cards-grid .report-card');
      cards.forEach(c => {
        c.style.display = c.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
      });
    });

    document.getElementById('btn-open-report-generator')?.addEventListener('click', () => {
      Modals.open('generator-modal');
    });

    document.getElementById('btn-download-all-filings')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Q4_2025_Disclosures_Package.zip', 'report');
    });

    // --- Documents Actions ---
    document.getElementById('docs-category-filters')?.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      document.querySelectorAll('#docs-category-filters .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderDocuments(pill.dataset.cat);
    });

    document.getElementById('btn-upload-doc-modal')?.addEventListener('click', () => {
      const title = document.getElementById('action-modal-title');
      const body = document.getElementById('action-modal-body');
      const submit = document.getElementById('btn-action-submit');

      title.textContent = 'Upload Institutional File';
      body.innerHTML = `
        <form>
          <div class="form-group mb-2">
            <label>Document Name</label>
            <input type="text" id="up-doc-name" class="form-input" placeholder="e.g. Audit Letter 2026" required>
          </div>
          <div class="grid-two-col mb-2">
            <div>
              <label>Classification</label>
              <select id="up-doc-cat" class="form-select">
                <option value="Governance">Governance</option>
                <option value="Presentations">Presentations</option>
                <option value="Legal">Legal</option>
                <option value="Statements">Statements</option>
              </select>
            </div>
            <div>
              <label>File Format</label>
              <select id="up-doc-ext" class="form-select">
                <option value="PDF">PDF</option>
                <option value="XLSX">XLSX</option>
                <option value="DOCX">DOCX</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Select Local File</label>
            <input type="file" id="up-doc-file" class="form-input">
          </div>
        </form>
      `;

      submit.onclick = () => {
        const name = document.getElementById('up-doc-name').value.trim();
        const cat = document.getElementById('up-doc-cat').value;
        const ext = document.getElementById('up-doc-ext').value;

        if (!name) {
          showToast('Please provide a document title.', 'danger');
          return;
        }

        AppState.documents.unshift({
          id: 'doc-' + Date.now(),
          name,
          category: cat,
          date: 'Feb 2026',
          owner: AppState.profile.name,
          ext,
          size: '1.4 MB',
          favorite: false
        });
        Storage.set(STORAGE_KEYS.DOCUMENTS, AppState.documents);
        renderDocuments();
        Modals.close('action-modal');
        showToast(`Document "${name}" added to vault.`);
      };

      Modals.open('action-modal');
    });

    // --- Earnings & Calendar Actions ---
    document.getElementById('btn-banner-reminder')?.addEventListener('click', () => {
      window.PortalEngine.addEventReminder('e-q4', 'Q4 2025 Financial Results & FY 2026 Guidance');
    });

    document.getElementById('btn-sync-calendar')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_IR_Calendar_2026.ics', 'event');
    });

    document.getElementById('btn-add-event-custom')?.addEventListener('click', () => {
      const title = document.getElementById('action-modal-title');
      const body = document.getElementById('action-modal-body');
      const submit = document.getElementById('btn-action-submit');

      title.textContent = 'Propose Executive Meeting / Briefing';
      body.innerHTML = `
        <form>
          <div class="form-group mb-2">
            <label>Briefing Title</label>
            <input type="text" id="ev-title" class="form-input" placeholder="e.g. Private Infrastructure Co-Investment 1x1" required>
          </div>
          <div class="grid-two-col mb-2">
            <div>
              <label>Preferred Date</label>
              <input type="date" id="ev-date" class="form-input" required>
            </div>
            <div>
              <label>Time Window</label>
              <input type="text" id="ev-time" class="form-input" placeholder="2:00 PM EST" required>
            </div>
          </div>
        </form>
      `;

      submit.onclick = () => {
        const titleVal = document.getElementById('ev-title').value.trim();
        const dateVal = document.getElementById('ev-date').value;
        const timeVal = document.getElementById('ev-time').value.trim();

        if (!titleVal) {
          showToast('Please specify a title.', 'danger');
          return;
        }

        AppState.events.unshift({
          id: 'ce-' + Date.now(),
          title: titleVal,
          date: dateVal || 'TBD 2026',
          time: timeVal || 'Flexible',
          location: 'Virtual Institutional Room',
          host: 'Alexander Vance & IR Desk',
          status: 'Confirmed',
          attendees: 'Executive Committee'
        });
        renderCorporateEvents();
        Modals.close('action-modal');
        showToast('Meeting request submitted to Executive Office.');
      };

      Modals.open('action-modal');
    });

    // --- News Actions ---
    document.getElementById('news-category-filters')?.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      document.querySelectorAll('#news-category-filters .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderNews(pill.dataset.cat);
    });

    document.getElementById('btn-subscribe-rss')?.addEventListener('click', () => {
      showToast('Subscribed to Aurevia SEC News Wire RSS feed.', 'info');
    });

    // --- Portfolio Actions ---
    document.getElementById('btn-add-holding')?.addEventListener('click', () => window.PortalEngine.openAddHolding());
    document.getElementById('btn-export-portfolio')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Portfolio_Tax_Ledger_2026.csv', 'report');
    });

    // --- Watchlist Actions ---
    document.getElementById('btn-add-watchlist-modal')?.addEventListener('click', () => window.PortalEngine.openAddWatchlist());

    // --- Risk View Actions ---
    document.getElementById('btn-export-risk-dossier')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile('Aurevia_Enterprise_Risk_Governance_Dossier.pdf', 'report');
    });

    // --- Chat Composer Form ---
    document.getElementById('thread-composer-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('message-reply-input');
      if (input) {
        window.PortalEngine.sendChatMessage(input.value);
        input.value = '';
      }
    });

    document.getElementById('btn-compose-message')?.addEventListener('click', () => {
      const title = document.getElementById('action-modal-title');
      const body = document.getElementById('action-modal-body');
      const submit = document.getElementById('btn-action-submit');

      title.textContent = 'New Inquiry to Investor Relations Desk';
      body.innerHTML = `
        <form>
          <div class="form-group mb-2">
            <label>Recipient Department</label>
            <select id="msg-recip" class="form-select">
              <option value="Sarah Jenkins">Sarah Jenkins (VP, Investor Relations)</option>
              <option value="Marcus Vance">Marcus Vance (Chief Financial Officer)</option>
              <option value="Elena Rostova">Elena Rostova (Executive Office)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Inquiry Body</label>
            <textarea id="msg-text" class="form-input" rows="4" placeholder="Type message..." required></textarea>
          </div>
        </form>
      `;

      submit.onclick = () => {
        const text = document.getElementById('msg-text').value.trim();
        if (!text) return;
        window.PortalEngine.sendChatMessage(text);
        Modals.close('action-modal');
      };

      Modals.open('action-modal');
    });

    // --- Notifications Actions ---
    document.getElementById('btn-center-mark-all-read')?.addEventListener('click', () => {
      AppState.notifications.forEach(n => n.unread = false);
      Storage.set(STORAGE_KEYS.NOTIFICATIONS, AppState.notifications);
      renderNotifications();
      showToast('All notifications marked as read.');
    });

    document.getElementById('btn-center-clear-all')?.addEventListener('click', () => {
      AppState.notifications = [];
      Storage.set(STORAGE_KEYS.NOTIFICATIONS, AppState.notifications);
      renderNotifications();
      showToast('Notification center cleared.');
    });

    document.getElementById('btn-dropdown-mark-read')?.addEventListener('click', () => {
      AppState.notifications.forEach(n => n.unread = false);
      Storage.set(STORAGE_KEYS.NOTIFICATIONS, AppState.notifications);
      renderNotifications();
      showToast('All notifications marked as read.');
    });

    document.getElementById('btn-see-all-notifs')?.addEventListener('click', () => {
      window.PortalEngine.switchView('notifications');
      document.getElementById('header-notif-dropdown')?.classList.add('hidden');
    });

    // --- Settings Listeners ---
    document.getElementById('btn-save-all-settings')?.addEventListener('click', () => {
      AppState.profile.name = document.getElementById('set-name').value.trim();
      AppState.profile.email = document.getElementById('set-email').value.trim();
      AppState.profile.role = document.getElementById('set-role').value.trim();
      AppState.profile.entity = document.getElementById('set-entity').value.trim();

      AppState.settings.compactMode = document.getElementById('set-compact-mode').checked;
      AppState.settings.animations = document.getElementById('set-animations-enabled').checked;
      AppState.settings.autoCollapseSidebar = document.getElementById('set-autocollapse-sidebar').checked;

      document.body.classList.toggle('compact-mode', AppState.settings.compactMode);
      document.body.classList.toggle('no-animations', !AppState.settings.animations);

      Storage.set(STORAGE_KEYS.PROFILE, AppState.profile);
      Storage.set(STORAGE_KEYS.SETTINGS, AppState.settings);

      // Update sidebar avatar details
      const avSide = document.getElementById('sidebar-user-avatar');
      const nameSide = document.getElementById('sidebar-user-name');
      const roleSide = document.getElementById('sidebar-user-role');
      if (avSide) avSide.textContent = AppState.profile.name.split(' ').map(s=>s[0]).join('');
      if (nameSide) nameSide.textContent = AppState.profile.name;
      if (roleSide) roleSide.textContent = AppState.profile.role;

      showToast('Workspace settings saved successfully.');
    });

    document.getElementById('btn-export-backup-json')?.addEventListener('click', () => {
      const backup = {
        profile: AppState.profile,
        holdings: AppState.holdings,
        watchlist: AppState.watchlist,
        notes: AppState.notes,
        settings: AppState.settings,
        exportDate: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Aurevia_Workspace_Backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Complete localized workspace exported to JSON.');
    });

    document.getElementById('btn-reset-demo-data')?.addEventListener('click', () => {
      window.PortalEngine.confirmDialog('Are you sure you want to reset all portfolio holdings, thesis notes, and settings back to factory demo defaults?', () => {
        Object.values(STORAGE_KEYS).forEach(k => Storage.remove(k));
        window.location.reload();
      });
    });

    // --- Report Generator Dialog ---
    document.getElementById('btn-execute-generate')?.addEventListener('click', () => {
      window.PortalEngine.executeGenerateReport();
    });
    document.getElementById('btn-cancel-generator')?.addEventListener('click', () => Modals.close('generator-modal'));
    document.getElementById('btn-close-generator')?.addEventListener('click', () => Modals.close('generator-modal'));

    // --- Generic Modals Close Handlers ---
    document.getElementById('btn-close-action-modal')?.addEventListener('click', () => Modals.close('action-modal'));
    document.getElementById('btn-action-cancel')?.addEventListener('click', () => Modals.close('action-modal'));

    document.getElementById('btn-close-preview')?.addEventListener('click', () => Modals.close('preview-modal'));
    document.getElementById('btn-preview-copy')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(document.getElementById('preview-body').innerText);
      showToast('Document text copied to clipboard.');
    });
    document.getElementById('btn-preview-print')?.addEventListener('click', () => window.print());
    document.getElementById('btn-preview-download')?.addEventListener('click', () => {
      window.PortalEngine.downloadFile(document.getElementById('preview-title').textContent + '.pdf', 'doc');
    });

    document.getElementById('btn-close-share')?.addEventListener('click', () => Modals.close('share-modal'));
    document.getElementById('btn-close-share-btn')?.addEventListener('click', () => Modals.close('share-modal'));
    document.getElementById('btn-copy-share-link')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(document.getElementById('share-link-input').value);
      showToast('Encrypted link copied to clipboard.');
    });

    document.getElementById('btn-close-confirm')?.addEventListener('click', () => Modals.close('confirm-modal'));
    document.getElementById('btn-confirm-cancel')?.addEventListener('click', () => Modals.close('confirm-modal'));

    // Portal Help button
    document.getElementById('btn-portal-help')?.addEventListener('click', () => {
      showToast('Investor Help: Need assistance? Reach our desk at ir@aureviacapital.com or call +1 (800) 555-AURV.', 'info');
    });

    // Company Selector change
    document.getElementById('company-select')?.addEventListener('change', (e) => {
      showToast(`Switched active entity perspective to: ${e.target.selectedOptions[0].text}`);
      refreshAllCharts();
    });

    // Footer Links
    document.querySelectorAll('.f-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showToast(`${link.textContent} documentation page loaded.`);
      });
    });

  });
})();
