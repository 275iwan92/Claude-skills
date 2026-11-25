// UI lint: run in the page (browser javascript tool / Playwright evaluate). Returns {summary, issues[]}.
// Catches what Jo keeps seeing: text overflowing or clipped by its box, overlapping text, wrapped short labels,
// tiny text, low contrast, tiny click targets, page-level horizontal scroll.
window.uiLint = () => {
  const issues = [], seen = new Set();
  const path = el => { const p = []; while (el && el.nodeType === 1 && p.length < 4) { p.unshift(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : '')); el = el.parentElement; } return p.join(' > '); };
  const add = (type, el, info) => { const k = type + path(el); if (seen.has(k) || issues.length >= 60) return; seen.add(k); issues.push({ type, at: path(el), ...info }); };
  const visible = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const rgba = s => { const m = s.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 1]; };
  const bgOf = el => { while (el) { const c = rgba(getComputedStyle(el).backgroundColor); if ((c[3] === undefined ? 1 : c[3]) > 0.9) return c.slice(0, 3); el = el.parentElement; } return [255, 255, 255]; };

  // text boxes
  const boxes = [], walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim(); if (!t) continue;
    const el = n.parentElement; if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName) || !visible(el)) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    const rects = [...range.getClientRects()].filter(r => r.width > 1 && r.height > 1); if (!rects.length) continue;
    const tr = range.getBoundingClientRect(), er = el.getBoundingClientRect(), s = getComputedStyle(el), fs = parseFloat(s.fontSize);
    boxes.push({ el, t, tr, fs });
    // 1 text sticks out of its own box (overflow visible) or is clipped by it
    const out = Math.max(er.left - tr.left, tr.right - er.right, er.top - tr.top, tr.bottom - er.bottom);
    if (out > 1.5 && s.display !== 'inline') add('text-overflows-box', el, { text: t.slice(0, 40), px: Math.round(out) });
    if (el.scrollWidth > el.clientWidth + 1 && s.overflow !== 'visible' && s.textOverflow !== 'ellipsis' && el.clientWidth > 0) add('text-clipped', el, { text: t.slice(0, 40) });
    // 2 short label wrapped onto several lines
    const lh = parseFloat(s.lineHeight) || fs * 1.25;
    if (t.length <= 14 && rects.length > 1 && tr.height > lh * 1.6) add('short-label-wraps', el, { text: t, lines: Math.round(tr.height / lh) });
    // 3 tiny text
    if (fs < 11) add('tiny-text', el, { text: t.slice(0, 30), fontSize: fs });
    // 4 contrast
    const fg = rgba(s.color), bg = bgOf(el), L1 = lum(fg.slice(0, 3)), L2 = lum(bg), cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    if (cr < 4.5 && fs < 24) add('low-contrast', el, { text: t.slice(0, 30), ratio: +cr.toFixed(2) });
  }
  // overlapping text between different elements
  const B = boxes.slice(0, 700);
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
    const a = B[i], b = B[j]; if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const w = Math.min(a.tr.right, b.tr.right) - Math.max(a.tr.left, b.tr.left), h = Math.min(a.tr.bottom, b.tr.bottom) - Math.max(a.tr.top, b.tr.top);
    if (w > 2 && h > 2 && (w * h) / Math.min(a.tr.width * a.tr.height, b.tr.width * b.tr.height) > 0.2) add('text-overlap', a.el, { text: a.t.slice(0, 25), with: b.t.slice(0, 25) });
  }
  // small click targets
  document.querySelectorAll('a,button,[role=button],input,select').forEach(el => { if (!visible(el)) return; const r = el.getBoundingClientRect(); if ((r.width < 24 || r.height < 24) && el.type !== 'hidden') add('small-target', el, { w: Math.round(r.width), h: Math.round(r.height) }); });
  // page-level horizontal scroll
  if (document.documentElement.scrollWidth > innerWidth + 1) issues.push({ type: 'page-h-scroll', at: 'document', scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth });
  const summary = {}; issues.forEach(i => summary[i.type] = (summary[i.type] || 0) + 1);
  return { viewport: innerWidth + 'x' + innerHeight, total: issues.length, summary, issues: issues.slice(0, 40) };
};
window.uiLint();
