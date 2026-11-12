/* UI guide shell: topic loading, routing, stage, rail, search, dialogs.
   Plain global script. Depends on kit.js (UIKit) and topics/_manifest.js (UIGuideManifest).
   Topic files call UIGuide.registerTopic({...}); see AUTHORING.md. */
(function (w, d) {
  'use strict';
  const M = w.UIGuideManifest, K = w.UIKit;
  const topics = M.topics;
  const byTopic = Object.fromEntries(topics.map(t => [t.id, t]));
  const defs = {}, failed = {}, loading = {};
  const warn = (...a) => { if (w.console) w.console.warn('[UIGuide]', ...a); };
  const escT = s => String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  // Korean particle: 과 after a final consonant, 와 otherwise (non-Hangul endings default to 와).
  const wa = s => { const c = String(s || '').trim().slice(-1).charCodeAt(0); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 ? '과' : '와'; };
  const codeify = s => escT(s).replace(/((?:aria-[a-z]+|role)(?:="[a-z]+")?)/g, '<code>$1</code>');

  /* ---------- registration ---------- */
  function registerTopic(def) {
    const t = def && byTopic[def.id];
    if (!t) { warn('unknown topic id', def && def.id); return; }
    const els = Array.isArray(def.elements) ? def.elements : [];
    const ids = t.elements.map(e => e[0]);
    if (els.length) {
      if (els.length !== ids.length) warn(`${t.id}: ${els.length} elements, manifest has ${ids.length}`);
      els.forEach((e, i) => {
        const where = `${t.id}/${e.id || '#' + i}`;
        if (e.id !== ids[i]) warn(`${where}: id should be "${ids[i]}" (manifest order)`);
        ['ko', 'en', 'when', 'avoid'].forEach(k => { if (!e[k]) warn(`${where}: missing ${k}`); });
        if (!Array.isArray(e.notes) || e.notes.length < 2 || e.notes.length > 4) warn(`${where}: notes must have 2-4 items`);
        if (!e.vs || !e.vs.text) warn(`${where}: missing vs.text`);
        const dm = e.demo || {};
        if (!dm.html) warn(`${where}: missing demo.html`);
        if (!dm.alt) warn(`${where}: missing demo.alt`);
        if (!(dm.cycle >= 3000 && dm.cycle <= 6000)) warn(`${where}: demo.cycle should be 3000-6000 ms`);
        if (dm.still == null || dm.still < 0 || dm.still > dm.cycle) warn(`${where}: demo.still must be within the cycle`);
        if (['phone', 'browser', 'compare', 'bare', undefined].indexOf(dm.frame) < 0) warn(`${where}: unknown frame ${dm.frame}`);
      });
    }
    defs[t.id] = Object.assign({}, def, { elements: els });
    try {
      const css = typeof def.css === 'function' ? def.css(K) : (def.css || '');
      if (css) {
        let st = d.getElementById('topic-css-' + t.id);
        if (!st) { st = d.createElement('style'); st.id = 'topic-css-' + t.id; d.head.appendChild(st); }
        st.textContent = css;
      }
    } catch (err) { warn(`${t.id}: css failed`, err); }
  }
  w.UIGuide = { registerTopic, manifest: M, version: '1' };

  function ensure(t) {
    if (defs[t.id] || failed[t.id]) return Promise.resolve();
    if (loading[t.id]) return loading[t.id];
    loading[t.id] = new Promise(res => {
      const s = d.createElement('script');
      s.src = 'topics/' + t.file;
      s.onload = () => { if (!defs[t.id]) failed[t.id] = true; res(); };
      s.onerror = () => { failed[t.id] = true; res(); };
      d.body.appendChild(s);
    });
    return loading[t.id];
  }
  const ready = t => { const df = defs[t.id]; return df && df.elements.length ? df : null; };

  /* ---------- dom refs ---------- */
  const $ = s => d.querySelector(s);
  d.querySelectorAll('[data-i]').forEach(n => { n.outerHTML = K.icon(n.dataset.i); });
  const stage = $('#stage'), rail = $('#rail'), program = $('#program'), msheet = $('#msheet');
  const q = $('#q'), results = $('#results'), top = $('#top');
  let cur = { t: null, idx: 0 }, tab = 'notes', first = true, token = 0;

  function setHash(h) { if (location.hash.slice(1) !== h) history.replaceState(null, '', '#' + h); }
  function parse() {
    const h = decodeURIComponent((location.hash || '').slice(1));
    for (const t of topics) {
      if (h === t.id) return { t, el: null };
      if (h.indexOf(t.id + '-') === 0) { const r = h.slice(t.id.length + 1); if (t.elements.some(e => e[0] === r)) return { t, el: r }; }
    }
    return { t: byTopic.feedback, el: null };
  }

  /* ---------- rendering ---------- */
  function vsInfo(t, e) {
    const v = e.vs || {};
    if (v.topic && v.topic !== t.id) {
      const ot = byTopic[v.topic], oe = ot && ot.elements.find(x => x[0] === v.id);
      return { name: v.name || (oe ? oe[1] : ''), href: `#${v.topic}${v.id ? '-' + v.id : ''}`, label: oe ? `${oe[1]} 보기` : (ot ? `${ot.ko} 보기` : '') };
    }
    const df = ready(t), oe = v.id && df ? df.elements.find(x => x.id === v.id) : null;
    return { name: v.name || (oe ? oe.ko : ''), go: oe ? oe.id : null, label: oe ? `${oe.ko} 무대로` : '' };
  }
  const notesHtml = e => `<ul>${(e.notes || []).map(x => `<li>${codeify(x)}</li>`).join('')}</ul>`;
  function vsHtml(t, e) {
    const v = vsInfo(t, e);
    const link = v.go ? `<button class="jump" type="button" data-go="${v.go}">${v.label} ${K.icon('arrowR')}</button>`
      : v.href ? `<a class="jump" href="${v.href}">${escT(v.label)} ${K.icon('arrowR')}</a>` : '';
    return `<p>${escT(e.vs ? e.vs.text : '')}</p>${link}`;
  }

  function renderRail() {
    const t = cur.t, df = ready(t);
    if (!df) {
      rail.innerHTML = `<span class="lbl">준비 중</span>${t.elements.map(([id, ko]) => `<span class="chip off"${id === cur.pendingEl ? ' aria-current="true"' : ''}>${escT(ko)}</span>`).join('')}`;
    } else {
      rail.innerHTML = `<span class="lbl">출연 순서</span>` + df.elements.map((e, i) =>
        `<button class="chip" type="button" data-go="${e.id}" style="--cyc:${(e.demo && e.demo.cycle) || 5000}ms" aria-current="${i === cur.idx}">${escT(e.ko)}</button>`).join('');
    }
    const a = rail.querySelector('[aria-current="true"]');
    rail.scrollLeft = a ? a.offsetLeft - rail.clientWidth / 2 + a.offsetWidth / 2 : 0;
  }

  function renderStage(dir) {
    const t = cur.t, n = topics.indexOf(t) + 1, df = ready(t);
    $('#tName').textContent = t.ko; $('#tCount').textContent = `${n} / ${topics.length}`;
    if (!df) {
      const pe = cur.pendingEl && t.elements.find(x => x[0] === cur.pendingEl);
      stage.innerHTML = `<div class="pit" data-frame="phone"><div class="frame"><div class="empty-scr"><span>시연 준비 중</span></div></div></div>
        <section class="info"><p class="pos">주제 <b>${n}</b> / ${topics.length}</p><h1 class="nm">${escT(t.ko)}</h1><p class="en">${escT(t.en)}</p>
        <div class="ww"><div class="w"><p>${pe ? `‘${escT(pe[1])}’을 포함해 ` : ''}이 주제의 시연은 아직 준비 중이에요. 무대에 오를 요소 ${t.elements.length}개를 먼저 적어 두었어요.</p></div></div>
        <ul class="soonlist">${t.elements.map(([id, ko, en]) => `<li${id === cur.pendingEl ? ' class="hl"' : ''}>${escT(ko)}<small>${escT(en)}</small></li>`).join('')}</ul>
        <a class="cta" href="#feedback">알림·피드백 무대 보기 ${K.icon('arrowR')}</a></section>`;
      d.title = `${t.ko} | UI 요소 가이드`;
      setHash(cur.pendingEl ? `${t.id}-${cur.pendingEl}` : t.id);
      renderRail(); first = false; return;
    }
    const els = df.elements, e = els[cur.idx], prev = els[(cur.idx + els.length - 1) % els.length], next = els[(cur.idx + 1) % els.length];
    const frame = (e.demo && e.demo.frame) || 'phone', v = vsInfo(t, e);
    stage.innerHTML = `<div class="pit" data-frame="${frame}"><div class="frame">${K.render(t.id, e, { timeline: true })}</div></div>
      <section class="info" aria-live="polite">
        <p class="pos"><b>${cur.idx + 1}</b> / ${els.length}<span class="tp">${escT(t.ko)}</span></p>
        <h1 class="nm">${escT(e.ko)}</h1><p class="en">${escT(e.en)}</p>
        <div class="ww"><div class="w"><h2>${K.icon('checkCircle')}언제</h2><p>${escT(e.when)}</p></div><div class="w no"><h2>${K.icon('xCircle')}피할 때</h2><p>${escT(e.avoid)}</p></div></div>
        <div class="tabs"><div class="tablist" role="tablist" aria-label="${escT(e.ko)} 자세히">
          <button role="tab" id="t-notes" type="button" aria-controls="p-notes" aria-selected="${tab === 'notes'}" tabindex="${tab === 'notes' ? 0 : -1}">구현할 때</button>
          <button role="tab" id="t-vs" type="button" aria-controls="p-vs" aria-selected="${tab === 'vs'}" tabindex="${tab === 'vs' ? 0 : -1}">${escT(v.name || '비슷한 것')}${wa(v.name || '비슷한 것')} 차이</button></div>
          <div class="panel" role="tabpanel" id="p-notes" aria-labelledby="t-notes"${tab === 'notes' ? '' : ' hidden'}>${notesHtml(e)}</div>
          <div class="panel" role="tabpanel" id="p-vs" aria-labelledby="t-vs"${tab === 'vs' ? '' : ' hidden'}>${vsHtml(t, e)}</div></div>
        <button class="sbtn morem" type="button" id="moreM">구현 메모와 차이 보기</button>
        <div class="step"><button class="sbtn" type="button" data-step="-1">${K.icon('chevL')}${escT(prev.ko)} <kbd>←</kbd></button><button class="sbtn" type="button" data-step="1">${escT(next.ko)}${K.icon('chevR')} <kbd>→</kbd></button></div>
      </section>`;
    K.observe(stage);
    d.title = `${e.ko} | UI 요소 가이드`;
    setHash(`${t.id}-${e.id}`);
    renderRail();
    if (!first && !K.motion.isStill() && stage.animate) {
      const ease = 'cubic-bezier(.2,.8,.2,1)';
      stage.querySelector('.frame').animate([{ opacity: 0, transform: `translateX(${dir * 28}px) scale(.97)` }, { opacity: 1, transform: 'none' }], { duration: 420, easing: ease });
      Array.prototype.forEach.call(stage.querySelectorAll('.info > *'), (n2, i) => n2.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 40 * i, easing: ease, fill: 'backwards' }));
    }
    first = false;
  }

  function show(t, elId, dir = 1) {
    const my = ++token;
    cur.t = t;
    return ensure(t).then(() => {
      if (my !== token) return;
      const df = ready(t);
      cur.pendingEl = df ? null : elId;
      cur.idx = df && elId ? Math.max(0, df.elements.findIndex(e => e.id === elId)) : 0;
      renderStage(dir);
    });
  }
  function step(delta) {
    const df = ready(cur.t); if (!df) return;
    cur.idx = (cur.idx + delta + df.elements.length) % df.elements.length;
    renderStage(delta < 0 ? -1 : 1);
  }
  function goEl(id) {
    const df = ready(cur.t); if (!df) return;
    const i = df.elements.findIndex(e => e.id === id); if (i < 0) return;
    const dir = i >= cur.idx ? 1 : -1; cur.idx = i; renderStage(dir);
  }

  /* ---------- events ---------- */
  d.addEventListener('click', ev => {
    const g = ev.target.closest('[data-go]');
    if (g) { if (msheet.open) msheet.close(); goEl(g.dataset.go); return; }
    const s = ev.target.closest('[data-step]'); if (s) { step(Number(s.dataset.step)); return; }
    const tb = ev.target.closest('[role="tab"]'); if (tb) { tab = tb.id === 't-vs' ? 'vs' : 'notes'; selectTab(true); return; }
    if (ev.target.closest('#moreM')) { openSheet(); return; }
    const c = ev.target.closest('[data-close]'); if (c) { c.closest('dialog').close(); return; }
    if (!ev.target.closest('.sbox')) closeResults();
  });
  function selectTab(focus) {
    stage.querySelectorAll('[role="tab"]').forEach(b => { const on = (b.id === 't-vs') === (tab === 'vs'); b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    const pn = $('#p-notes'), pv = $('#p-vs'); if (pn) pn.hidden = tab !== 'notes'; if (pv) pv.hidden = tab !== 'vs';
  }
  stage.addEventListener('keydown', ev => {
    if (ev.target.getAttribute('role') === 'tab' && (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight')) { ev.preventDefault(); ev.stopPropagation(); tab = tab === 'notes' ? 'vs' : 'notes'; selectTab(true); }
  });
  function openSheet() {
    const t = cur.t, df = ready(t); if (!df) return;
    const e = df.elements[cur.idx], v = vsInfo(t, e);
    $('#mBody').innerHTML = `<h2 id="mTitle">${escT(e.ko)}</h2><p class="en">${escT(e.en)}</p><h3>구현할 때</h3><div class="panel">${notesHtml(e)}</div><h3>${escT(v.name || '비슷한 것')}${wa(v.name || '비슷한 것')} 차이</h3><div class="panel">${vsHtml(t, e)}</div>`;
    msheet.showModal();
  }
  [program, msheet].forEach(dl => dl.addEventListener('click', ev => { if (ev.target === dl) dl.close(); }));
  msheet.addEventListener('click', ev => { if (ev.target.closest('a.jump')) msheet.close(); });

  d.addEventListener('keydown', ev => {
    if (program.open || msheet.open) return;
    const tg = ev.target;
    if (/input|textarea|select/i.test(tg.tagName) || tg.getAttribute('role') === 'tab') return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); step(1); }
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); step(-1); }
  });
  let sx = null, sy = null;
  stage.addEventListener('pointerdown', ev => { if (ev.target.closest('.pit')) { sx = ev.clientX; sy = ev.clientY; } });
  stage.addEventListener('pointerup', ev => {
    if (sx == null) return; const dx = ev.clientX - sx, dy = ev.clientY - sy; sx = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  });

  /* topic switching */
  const tStep = dl => { const i = (topics.indexOf(cur.t) + dl + topics.length) % topics.length; location.hash = topics[i].id; };
  $('#tPrev').addEventListener('click', () => tStep(-1));
  $('#tNext').addEventListener('click', () => tStep(1));
  $('#tOpen').addEventListener('click', () => {
    let html = '';
    topics.forEach(t => {
      const df = defs[t.id], st = df && df.elements.length ? `시연 ${df.elements.length}종` : `${t.elements.length}종${df ? ', 준비 중' : ''}`;
      html += `<li><a href="#${t.id}" aria-current="${t === cur.t}"><span>${escT(t.ko)}</span><small>${st}</small></a></li>`;
    });
    $('#plist').innerHTML = html;
    program.showModal();
    const a = $('#plist [aria-current="true"]'); if (a) a.focus();
  });
  $('#plist').addEventListener('click', ev => { if (ev.target.closest('a')) program.close(); });

  /* ---------- global search over all topics ---------- */
  const norm = s => String(s || '').toLowerCase().replace(/[\s·]+/g, '');
  function searchIndex() {
    const out = [];
    topics.forEach(t => {
      out.push({ kind: 'topic', t, ko: t.ko, en: t.en, hash: t.id, keys: [t.ko, t.en, t.id] });
      const df = defs[t.id];
      t.elements.forEach(([id, ko, en]) => {
        const e = df && df.elements.find(x => x.id === id);
        out.push({ kind: 'el', t, ko, en, hash: `${t.id}-${id}`, keys: [ko, en, id].concat(e && e.aka ? e.aka : []) });
      });
    });
    return out;
  }
  let hits = [], active = -1;
  function runSearch() {
    const v = norm(q.value);
    if (!v) { closeResults(); return; }
    hits = searchIndex().filter(x => x.keys.some(k => norm(k).indexOf(v) >= 0));
    hits.sort((a, b) => (norm(a.ko).indexOf(v) === 0 ? 0 : 1) - (norm(b.ko).indexOf(v) === 0 ? 0 : 1));
    hits = hits.slice(0, 40); active = hits.length ? 0 : -1;
    results.innerHTML = hits.length ? hits.map((x, i) => `<li role="option" id="sr-${i}" data-hash="${x.hash}" aria-selected="${i === active}">
        <span class="r1"><b>${escT(x.ko)}</b><span>${escT(x.en)}</span></span><small>${x.kind === 'topic' ? `주제, 요소 ${x.t.elements.length}개` : escT(x.t.ko)}${x.kind === 'el' && defs[x.t.id] && !ready(x.t) ? ', 준비 중' : ''}</small></li>`).join('')
      : `<li class="none" role="presentation">‘${escT(q.value.trim())}’에 맞는 요소가 없어요. 한글이나 영어 이름으로 찾아보세요.</li>`;
    results.hidden = false; q.setAttribute('aria-expanded', 'true');
    q.setAttribute('aria-activedescendant', active >= 0 ? 'sr-0' : '');
  }
  function closeResults() { results.hidden = true; q.setAttribute('aria-expanded', 'false'); q.removeAttribute('aria-activedescendant'); }
  function pick(i) {
    const x = hits[i]; if (!x) return;
    closeResults(); q.value = ''; top.classList.remove('qopen'); $('#qBtn').setAttribute('aria-expanded', 'false');
    if (location.hash.slice(1) === x.hash) route(); else location.hash = x.hash;
  }
  function moveActive(dl) {
    if (!hits.length) return;
    active = (active + dl + hits.length) % hits.length;
    results.querySelectorAll('[role="option"]').forEach((li, i) => li.setAttribute('aria-selected', i === active));
    q.setAttribute('aria-activedescendant', 'sr-' + active);
    const li = $('#sr-' + active); if (li) li.scrollIntoView({ block: 'nearest' });
  }
  q.addEventListener('input', runSearch);
  q.addEventListener('focus', () => { if (q.value) runSearch(); });
  q.addEventListener('keydown', ev => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); moveActive(1); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); moveActive(-1); }
    else if (ev.key === 'Enter') { ev.preventDefault(); pick(active); }
    else if (ev.key === 'Escape') { closeResults(); if (top.classList.contains('qopen')) { top.classList.remove('qopen'); $('#qBtn').setAttribute('aria-expanded', 'false'); $('#qBtn').focus(); } }
  });
  results.addEventListener('click', ev => { const li = ev.target.closest('[role="option"]'); if (li) pick(Number(li.id.slice(3))); });
  $('#qBtn').addEventListener('click', () => {
    const o = !top.classList.contains('qopen'); top.classList.toggle('qopen', o); $('#qBtn').setAttribute('aria-expanded', o);
    if (o) q.focus(); else closeResults();
  });

  /* ---------- motion toggle + boot ---------- */
  const mb = $('#motionBtn');
  K.motion.onchange = still => { mb.innerHTML = K.icon(still ? 'play' : 'pause'); mb.setAttribute('aria-label', still ? '시연 재생' : '시연 멈춤'); mb.setAttribute('aria-pressed', String(still)); };
  mb.addEventListener('click', K.motion.toggle);
  K.motion.apply();

  function route() {
    const r = parse();
    const same = r.t === cur.t && ready(r.t);
    if (same && r.el) { goEl(r.el); return; }
    if (same && !r.el) return;
    show(r.t, r.el).then(() => { if (!first) w.scrollTo(0, 0); });
  }
  w.addEventListener('hashchange', route);
  route();
})(window, document);
