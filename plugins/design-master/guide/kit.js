/* UIKit: shared demo toolkit for the UI guide.
   Plain global script (no modules) so the guide opens from file://.
   Topic files must use these helpers instead of editing this file. */
(function (w) {
  'use strict';

  /* ---------- icons: 24px grid, stroke only, one weight ---------- */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    chevL: '<path d="M15 5l-7 7 7 7"/>',
    chevR: '<path d="M9 5l7 7-7 7"/>',
    chevD: '<path d="M5 9l7 7 7-7"/>',
    chevU: '<path d="M5 15l7-7 7 7"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    share: '<path d="M12 3v12M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>',
    shareAndroid: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/>',
    more: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3.2"/>',
    moreV: '<path d="M12 5h.01M12 12h.01M12 19h.01" stroke-width="3.2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
    sort: '<path d="M4 7h16M7 12h10M10 17h4"/>',
    filter: '<path d="M4 5h16l-6 8v5l-4 2v-7z"/>',
    wifiOff: '<path d="M3 3l18 18M8.5 16.4a5 5 0 017 0M5 12.8a10 10 0 015.2-2.7M19 12.8a10 10 0 00-3-2M2 9.2a15 15 0 014.3-2.6M22 9.2A15 15 0 0011.4 5M12 20h.01"/>',
    wifi: '<path d="M8.5 16.4a5 5 0 017 0M5 12.8a10 10 0 0114 0M2 9.2a15 15 0 0120 0M12 20h.01"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5M12 16.2h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0M16 5.2a3.5 3.5 0 010 6.6M18 14.5a6.5 6.5 0 013.5 5.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0115 0"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    home: '<path d="M4 11l8-6.5 8 6.5V20h-5v-5.5H9V20H4z"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20.5a2 2 0 004 0"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.4 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z"/>',
    star: '<path d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>',
    bookmark: '<path d="M6.5 4h11v16.5l-5.5-4-5.5 4z"/>',
    image: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4"/>',
    camera: '<path d="M4 8h3.5l1.8-2.5h5.4L16.5 8H20v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    send: '<path d="M20.5 3.5L10 14M20.5 3.5l-6.5 17-4-6.5-6.5-4z"/>',
    link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 00-1.5-1.5H6A1.5 1.5 0 004.5 6v8A1.5 1.5 0 006 15.5h2.5"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 11-2.2-5.3M19.5 4.5v4.2h-4.2"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V7.5a3.5 3.5 0 017 0v3"/>',
    edit: '<path d="M4.5 19.5l1-4.5L16 4.5l3.5 3.5L9 18.5zM13.5 7l3.5 3.5"/>',
    paperclip: '<path d="M19 11.5l-7.4 7.4a4.6 4.6 0 01-6.5-6.5l7.8-7.8a3 3 0 014.3 4.3l-7.7 7.7a1.5 1.5 0 01-2.1-2.1l6.8-6.8"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3"/>',
    thumbUp: '<path d="M7.5 10.5V20H4.5v-9.5zM7.5 10.5l3.5-7a2.2 2.2 0 012.5 2.6l-.7 3.9h5.5a2 2 0 012 2.4l-1.4 6A2 2 0 0117 20H7.5"/>',
    thumbDown: '<path d="M7.5 13.5V4H4.5v9.5zM7.5 13.5l3.5 7a2.2 2.2 0 002.5-2.6l-.7-3.9h5.5a2 2 0 002-2.4l-1.4-6A2 2 0 0017 4H7.5"/>',
    qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5zM14 19h1M19 14h1"/>',
    repost: '<path d="M7 4.5L4 7.5l3 3M4 7.5h11a4 4 0 014 4M17 19.5l3-3-3-3M20 16.5H9a4 4 0 01-4-4"/>',
    forward: '<path d="M14 5l6 6-6 6M20 11H10a6 6 0 00-6 6v1.5"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>',
    note: '<path d="M6 3.5h8.5L19 8v12.5H6zM14 3.5V8.5h5M9 12.5h7M9 16h5"/>',
    sparkle: '<path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16.2 9.5"/>',
    xCircle: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    cursor: '<path d="M5 3l13.5 7.6-6 1.6-3.2 5.6z" fill="#fff" stroke="#1d1e20" stroke-width="1.6"/>'
  };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const icon = (name, cls) => `<svg class="k-i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;
  const at = (x, y) => `left:${x}em;top:${y}em`;

  /* ---------- the fictional grocery-list app ---------- */
  const ITEMS = [['우유 2L', '1개'], ['달걀 10구', '1판'], ['두부', '2모'], ['대파', '1단'], ['사과', '4개'], ['참기름', '1병'], ['양파', '3개'], ['김', '1봉']];
  const TABS = [['list', '목록'], ['users', '가족'], ['sliders', '설정']];
  const app = {
    items: ITEMS,
    /* status bar, 1.3em tall */
    status: () => '<div class="k-sb"><span>9:41</span><span class="k-bat"></span></div>',
    /* app bar, 2.4em tall. icons: names from ICONS. back: true adds a back chevron. */
    bar(title = '이번 주 장보기', icons = ['share', 'more'], opt = {}) {
      const lead = opt.back ? `<span class="k-ib k-ib-back">${icon('chevL')}</span>` : '';
      return `<div class="k-ab${opt.cls ? ' ' + opt.cls : ''}">${lead}<b>${esc(title)}</b>${icons.map(n => `<span class="k-ib k-ib-${n}">${icon(n)}</span>`).join('')}</div>`;
    },
    /* one list row, 2.3em tall. classes: k-r k-r<n> (1-based), parts k-cb > k-ck, k-n, k-q */
    row(i, opt = {}) {
      const [n, q] = opt.item || ITEMS[i % ITEMS.length];
      return `<div class="k-r k-r${i + 1}${opt.checked ? ' k-on' : ''}${opt.cls ? ' ' + opt.cls : ''}"><span class="k-cb"><span class="k-ck">${icon('check')}</span></span><span class="k-n">${esc(n)}</span><span class="k-q">${esc(q)}</span></div>`;
    },
    rows(from = 0, to = 5, opt = {}) { let s = ''; for (let i = from; i < to; i++) s += app.row(i, { checked: (opt.checked || []).includes(i) }); return s; },
    /* list container (.k-ls) starting right under the app bar (top 3.7em) */
    list(from = 0, to = 5, opt = {}) { return `<div class="k-ls${opt.cls ? ' ' + opt.cls : ''}">${opt.before || ''}${app.rows(from, to, opt)}${opt.after || ''}</div>`; },
    /* status + bar + list in one call */
    screen(opt = {}) { return app.status() + app.bar(opt.title, opt.icons, opt) + app.list(0, opt.rows == null ? 5 : opt.rows, opt); },
    /* bottom tab bar, 2.9em tall. extras: {index: html} injected next to that tab's icon (badges) */
    tabs(active = 0, extras = {}, opt = {}) {
      return `<div class="k-tb${opt.cls ? ' ' + opt.cls : ''}">${TABS.map(([ic, label], i) => `<span class="k-tab k-tab-${i}${i === active ? ' k-on' : ''}"><span class="k-ti">${icon(ic)}${extras[i] || ''}</span><em>${label}</em></span>`).join('')}</div>`;
    },
    /* floating add button, 2.6em, bottom-right 1.1em */
    fab(cls) { return `<span class="k-fab${cls ? ' ' + cls : ''}">${icon('plus')}</span>`; },
    /* buttons and fields for forms. kind: primary | ghost | danger */
    button(label, kind = 'primary', cls) { return `<span class="k-btn k-btn-${kind}${cls ? ' ' + cls : ''}">${esc(label)}</span>`; },
    field(label, value, cls) { return `<span class="k-field${cls ? ' ' + cls : ''}"><em>${esc(label)}</em><span>${esc(value)}</span></span>`; }
  };

  /* ---------- overlays ---------- */
  /* tap ring at (x,y) in screen em. Animate it with kf.tap(name, atPct). */
  const tap = (x, y, cls = '') => `<i class="k-tap ${cls}" style="${at(x, y)}"></i>`;
  /* fingertip for gestures. Starts hidden; animate with kf.path / kf.press. */
  const finger = (x, y, cls = '') => `<i class="k-finger ${cls}" style="${at(x, y)}"></i>`;
  /* mouse pointer whose tip sits at its box origin. Animate with kf.path. */
  const cursor = (x, y, cls = '') => `<span class="k-cursor ${cls}" style="${at(x, y)}">${icon('cursor')}</span>`;
  /* gaze/focus marker for layout reading order. Animate with kf.path. */
  const dot = (x, y, cls = '') => `<i class="k-dot ${cls}" style="${at(x, y)}"></i>`;
  const scrim = (cls = '') => `<i class="k-scrim ${cls}"></i>`;

  /* ---------- wireframe blocks for browser / bare frames ---------- */
  /* kind: block | img | text | title | nav | btn | line */
  const wf = (kind, x, y, w2, h, cls = '') => `<span class="k-wf k-wf-${kind} ${cls}" style="${at(x, y)};width:${w2}em;height:${h}em"></span>`;

  /* ---------- dimension line ---------- */
  /* dir 'h': from (x,y) to (x+len,y). dir 'v': from (x,y) to (x,y+len). label sits outside on the given side. */
  function dim({ x, y, len, dir = 'h', label = '', side, cls = '' }) {
    const s = side || (dir === 'h' ? 'top' : 'right');
    const box = dir === 'h' ? `left:${x}em;top:${y}em;width:${len}em` : `left:${x}em;top:${y}em;height:${len}em`;
    return `<span class="k-dim k-dim-${dir} k-dim-${s} ${cls}" style="${box}"><em>${esc(label)}</em></span>`;
  }
  /* device px to screen em on a 16em-wide screen representing `base` px (360 for phones, 1280 for desktop). */
  const px = (n, base = 360) => +(n * 16 / base).toFixed(3);

  /* ---------- keyframe generators (return CSS text) ---------- */
  const kf = {
    /* ring appears at `a`%, presses, fades by a+6% */
    tap(name, a) { return `@keyframes ${name}{0%,${a - 4}%{opacity:0;transform:scale(1.5)}${a}%{opacity:1;transform:scale(1)}${a + 2}%{opacity:1;transform:scale(.78)}${a + 6}%,100%{opacity:0;transform:scale(.78)}}`; },
    /* finger lands at a%, moves by (dx,dy) em until b%, lifts at b+3% */
    drag(name, a, b, dx, dy) { return `@keyframes ${name}{0%,${a - 3}%{opacity:0;transform:translate(0,0) scale(1.3)}${a}%{opacity:1;transform:translate(0,0) scale(1)}${b}%{opacity:1;transform:translate(${dx}em,${dy}em) scale(1)}${b + 3}%,100%{opacity:0;transform:translate(${dx}em,${dy}em) scale(1.2)}}`; },
    /* finger holds down from a% to b% (long press) */
    press(name, a, b) { return `@keyframes ${name}{0%,${a - 3}%{opacity:0;transform:scale(1.3)}${a}%,${b}%{opacity:1;transform:scale(.9)}${b + 3}%,100%{opacity:0;transform:scale(1.2)}}`; },
    /* translate along points [[pct, x, y], ...] (em, relative to the element's start position) */
    path(name, pts) { return `@keyframes ${name}{${pts.map(([p, x, y]) => `${p}%{transform:translate(${x}em,${y}em)}`).join('')}}`; },
    /* opacity windows [[inStart, inEnd, outStart, outEnd], ...]; optional rise (em) slides in from below */
    fade(name, wins, rise = 0) {
      const off = `opacity:0;transform:translateY(${rise}em)`, on = 'opacity:1;transform:none';
      const fr = ['0%{' + off + '}'];
      wins.forEach(([a, b, c, d]) => { fr.push(`${a}%{${off}}`, `${b}%{${on}}`, `${c}%{${on}}`, `${d}%{${off}}`); });
      fr.push('100%{' + off + '}');
      return `@keyframes ${name}{${fr.join('')}}`;
    }
  };

  /* ---------- timeline under a demo ---------- */
  const fmt = ms => (ms / 1000).toFixed(1) + '초';
  function timeline(d) {
    if (!d.phases || !d.phases.length) return '';
    const segs = d.phases.map(([t, a, b]) => {
      const kind = /유지|갱신|머묾/.test(t) ? 'hold' : /지연|대기/.test(t) ? 'wait' : 'move';
      return `<span class="k-tl-seg k-tl-${kind}" style="left:${(a / d.cycle * 100).toFixed(2)}%;width:${((b - a) / d.cycle * 100).toFixed(2)}%"><em>${esc(t)}</em></span>`;
    }).join('');
    return `<div class="k-tl" aria-hidden="true"><div class="k-tl-track">${segs}<i class="k-tl-run"></i></div><div class="k-tl-scale"><span>0</span><span>${fmt(d.cycle)}</span></div></div>`;
  }

  /* ---------- render one element's demo ---------- */
  function render(topicId, el, opt = {}) {
    const d = el.demo || {}, frame = d.frame || 'phone';
    const html = typeof d.html === 'function' ? d.html(K) : d.html;
    const scr = (inner, cls = '') => `<div class="k-sw"><div class="k-scr${cls}">${inner || ''}</div></div>`;
    let body;
    if (frame === 'browser') {
      body = `<div class="k-dev"><div class="k-chrome"><i></i><i></i><i></i><span class="k-url">${esc(d.url || 'jangbom.example/list')}</span></div>${scr(html)}</div>`;
    } else if (frame === 'compare') {
      const [a, b] = Array.isArray(html) ? html : [html, ''];
      const [la, lb] = d.labels || ['', ''];
      body = `<div class="k-dev"><div class="k-pane k-pane-a"><p class="k-plabel">${esc(la)}</p>${scr(a)}</div><div class="k-pane k-pane-b"><p class="k-plabel">${esc(lb)}</p>${scr(b)}</div></div>`;
    } else {
      body = `<div class="k-dev">${scr(html)}</div>`;
    }
    const cyc = Math.max(1000, d.cycle || 5000), still = d.still == null ? Math.round(cyc / 2) : d.still;
    return `<div class="k-demo k-f-${frame} t-${topicId}-${el.id}" style="--cyc:${cyc}ms;--still:${still}ms" role="img" aria-label="${esc(d.alt || el.ko)}">${body}${opt.timeline ? timeline(Object.assign({ cycle: cyc }, d)) : ''}</div>`;
  }

  /* ---------- runtime: off-screen pause, reduced motion, storage ---------- */
  const store = {
    get(k) { try { return w.localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { if (v == null) w.localStorage.removeItem(k); else w.localStorage.setItem(k, v); } catch (_) { /* storage blocked */ } }
  };
  let io = null;
  function observe(root) {
    const list = (root || document).querySelectorAll('.k-demo');
    if (!('IntersectionObserver' in w)) { list.forEach(n => n.classList.add('run')); return; }
    if (!io) io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('run', e.isIntersecting)), { threshold: 0.1 });
    list.forEach(n => io.observe(n));
  }
  const mq = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const motion = {
    isStill() { const p = store.get('uiguide-motion'); return p ? p === 'still' : !!mq.matches; },
    apply() { document.documentElement.classList.toggle('still', motion.isStill()); if (motion.onchange) motion.onchange(motion.isStill()); },
    toggle() { store.set('uiguide-motion', motion.isStill() ? 'play' : 'still'); motion.apply(); },
    onchange: null
  };
  if (mq.addEventListener) mq.addEventListener('change', () => motion.apply());

  const K = { icon, icons: Object.keys(ICONS), esc, app, tap, finger, cursor, dot, scrim, wf, dim, px, kf, timeline, render, observe, motion, store, fmt };
  w.UIKit = K;
})(window);
