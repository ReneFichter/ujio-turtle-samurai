// Grundgerüst: Speicherstand, Sound, Effekte, Ujios Sprechblase, Punkte & Bildschirmwechsel.

/* ---------- Zustand (nur auf diesem Gerät) ---------- */
const KEY = "ujio-kanalnetz-v2";
const blank = () => ({ introDone: false, found: {}, workshopStep: 0, mission: false, score: 0, pos: "start", sound: true, music: true, vol: 50, seen: {}, revealed: {}, won: {}, hints: {} });
let S = load();
if (!S.soundV2){ S.sound = true; S.soundV2 = true; save(); }  // Sound ist jetzt von Anfang an an – auch für ältere Spielstände einmalig
// Ältere Spielstände: Räume, die schon gelöst waren, bekommen ihr neues Portalteil einmalig dazu
CONTENT.rooms.forEach(r => { if (r.part && !S.found[r.part.id]){ const base = r.hotspots || r.rewards || [{ id: r.reward }]; if (base.every(h => S.found[h.id])) S.found[r.part.id] = true; } });
function load(){ try { const r = localStorage.getItem(KEY); if (r) return Object.assign(blank(), JSON.parse(r)); } catch(e){} return blank(); }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }

// Spiel direkt im Vollbild geöffnet (nicht eingebettet auf spiel.html)? Dann gibt es einen Weg zurück zur Homepage.
const STANDALONE = (() => { try { return window.top === window.self; } catch(e){ return false; } })();
const HOME_URL = LANG === "en" ? "../index_en.html" : "../index.html";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $("#app");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ROOM = Object.fromEntries(CONTENT.rooms.map(r => [r.id, r]));
const EDGE = Object.fromEntries(CONTENT.edges.map(e => [e.to, e]));
const ALL = [];
// Fundstücke eines Raums: Taschenlampen-Verstecke, Belohnungen der Minispiele oder eine einzelne Belohnung – plus das Portalteil
const roomItems = r => [...(r.hotspots || r.rewards || [{ id: r.reward, item: r.rewardItem }]), ...(r.part ? [r.part] : [])];
CONTENT.rooms.forEach(r => roomItems(r).forEach(h => ALL.push({ id: h.id, item: h.item, room: r.id })));
const icon = (id, cls = "") => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const pad6 = n => String(n).padStart(6, "0");
const total = () => progress();  // (hoisting: progress ist weiter unten definiert, wird aber erst beim Aufruf gebraucht)
const rankIdx = n => { let i = 0; CONTENT.ranks.forEach((r, k) => { if (n >= r.at) i = k; }); return i; };
const solved = r => roomItems(r).every(h => S.found[h.id]);
// Wurde das aktuelle Minispiel dieses Raums schon einmal gewonnen? Erst dann gibt es „Noch mal spielen“.
// (Ältere Spielstände: Taschenlampe und Bau-Spiel gab es schon, die zählen über die Fundstücke.)
const wonBefore = r => (S.won || {})[r.id] === r.game || ((r.game === "flashlight" || r.game === "build") && solved(r));
// Bilder ansehen: freiwillig, bringt Punkte (+ Galerie-Bonus, wenn alle Bilder eines Raums gesehen sind)
const seenCount = r => r.gallery.filter((_, i) => S.seen[`${r.id}:${i}`]).length;
const allSeen = r => seenCount(r) >= r.gallery.length;
// Zeitsplitter: in 5 Bildern pro Raum steckt einer. Welche Bilder und wo im Bild ist pro Raum fest (aus der Raum-ID berechnet).
const HINTS = Object.fromEntries(CONTENT.rooms.map(r => {
  const R = rng([...r.id].reduce((a, c) => a + c.charCodeAt(0), 0) * 7 + 3), idx = r.gallery.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--){ const j = Math.floor(R() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return [r.id, Object.fromEntries(idx.slice(0, Math.min(5, idx.length)).map(i => [i, { x: .14 + R() * .72, y: .14 + R() * .68 }]))];
}));
const hintTotal = r => Object.keys(HINTS[r.id]).length;
const hintCount = r => Object.keys(HINTS[r.id]).filter(i => S.hints[`${r.id}:${i}`]).length;
const allHints = r => hintCount(r) >= hintTotal(r);
// Spezialbild (bzw. Portal) erst, wenn alle 5 Zeitsplitter des Raums gefunden sind
const unlockReady = r => allHints(r);
// Portalteile: welche fehlen noch (als Raumnamen)?
const missingParts = () => CONTENT.portalParts.filter(id => !S.found[id]).map(id => ALL.find(a => a.id === id)).filter(Boolean).map(a => ROOM[a.room].mapName || ROOM[a.room].name);
const allParts = () => missingParts().length === 0;
// Sammel-Fortschritt fürs Inventar, die Ränge und die Anzeigen: Zeitsplitter + Portalteile
const SHARD_MAX = CONTENT.rooms.reduce((a, r) => a + hintTotal(r), 0);
const shardsFound = () => CONTENT.rooms.reduce((a, r) => a + hintCount(r), 0);
const partsFound = () => CONTENT.portalParts.filter(id => S.found[id]).length;
const PROGRESS_MAX = SHARD_MAX + CONTENT.portalParts.length;
const progress = () => shardsFound() + partsFound();
const partsMissing = n => n === 1 ? L("1 Teil fehlt", "1 part missing") : L(`${n} Teile fehlen`, `${n} parts missing`);
function isOpen(r){ if (!r.requires) return true; if (r.requires === "mission") return S.mission; return solved(ROOM[r.requires]); }
function rng(seed){ let s = seed * 9301 + 49297; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
function appXY(el){ const a = app.getBoundingClientRect(), b = el.getBoundingClientRect(); return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 }; }

/* ---------- Sound (WebAudio, alles synthetisch) ---------- */
const Sound = {
  ctx: null, out: null, amb: null,
  init(){
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    this.ctx = new AC(); this.out = this.ctx.createGain(); this.out.gain.value = .5; this.out.connect(this.ctx.destination);
  },
  set(on){
    S.sound = on; save();
    if (on){ this.init(); this.ctx?.resume?.(); this.ambStart(); this.chime(); } else this.ambStop();
    $$(".js-sound").forEach(b => { b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); const u = b.querySelector("use"); if (u) u.setAttribute("href", on ? "#i-sound" : "#i-mute"); });
  },
  tone(f, d = .12, type = "square", v = .1, slide = 0, when = 0){
    if (!S.sound || !this.ctx) return;
    const t = this.ctx.currentTime + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(this.out); o.start(t); o.stop(t + d + .03);
  },
  noise(d = .25, v = .2, freq = 900, when = 0){
    if (!S.sound || !this.ctx) return;
    const t = this.ctx.currentTime + when, len = Math.floor(this.ctx.sampleRate * d), buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
    f.type = "bandpass"; f.frequency.value = freq; g.gain.value = v; src.buffer = buf;
    src.connect(f); f.connect(g); g.connect(this.out); src.start(t);
  },
  ambStart(){
    if (!this.ctx || this.amb) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = "sine"; o.frequency.value = 52; g.gain.value = .035; o.connect(g); g.connect(this.out); o.start();
    const drip = () => { this.tone(900 + Math.random() * 900, .16, "sine", .05, .45); };
    this.amb = { o, timer: setInterval(() => { if (Math.random() < .6) drip(); }, 1400) };
  },
  ambStop(){ if (!this.amb) return; try { this.amb.o.stop(); } catch(e){} clearInterval(this.amb.timer); this.amb = null; },
  blip(){ this.tone(520 + Math.random() * 120, .025, "square", .025); },
  find(){ this.tone(880, .08, "square", .09); this.tone(1320, .14, "square", .09, 0, .07); },
  chime(){ [660, 990].forEach((f, i) => this.tone(f, .12, "triangle", .08, 0, i * .08)); },
  clang(){ this.noise(.4, .35, 600); this.tone(180, .5, "triangle", .12, .6); },
  step(){ this.tone(140 + Math.random() * 30, .05, "square", .04); },
  hit(){ this.noise(.06, .25, 2400); },
  deny(){ this.tone(220, .18, "square", .08, .7); this.tone(160, .22, "square", .08, .7, .1); },
  win(){ [523, 659, 784, 1047].forEach((f, i) => this.tone(f, .16, "square", .08, 0, i * .09)); },
  levelup(){ [392, 523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, .14, "square", .08, 0, i * .07)); this.noise(.6, .12, 3000, .4); }
};
$$(".js-sound").forEach(b => b.addEventListener("click", () => Sound.set(!S.sound)));

/* ---------- Musik (MP3 aus dem sound-Ordner der Homepage, läuft in Schleife) ---------- */
const Music = {
  src: "../sound/Partywagon%20durch%20New%20York.mp3", el: null,
  set(on){
    S.music = on; save();
    if (on) this.play(); else this.el?.pause();
    $$(".js-music, .js-music-pop").forEach(b => { if (b.matches(".js-music")) b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); const u = b.querySelector("use"); if (u) u.setAttribute("href", on ? "#i-music" : "#i-music-off"); });
  },
  // Kurz anhalten (z. B. während der Klang-Melodie), ohne die Einstellung „Musik an/aus“ zu ändern.
  // Danach läuft sie nur weiter, wenn sie vorher an war (S.music).
  held: false,
  hold(on){ this.held = on; if (on) this.el?.pause(); else this.play(); },
  play(){
    if (!S.music || document.hidden || this.held) return;
    if (!this.el){ this.el = new Audio(this.src); this.el.loop = true; this.setVol(S.vol); }
    if (this.el.paused) this.el.play().catch(() => {});
  },
  // Regler 0–100, Startwert 50. Kurve fürs Ohr: Hälfte = leise (10 %), ganz rechts = 40 %
  setVol(v){
    S.vol = Math.max(0, Math.min(100, Math.round(+v))); save();
    if (this.el) this.el.volume = .4 * (S.vol / 100) ** 2;
    $$(".js-vol").forEach(r => { if (+r.value !== S.vol) r.value = S.vol; });
  }
};
$$(".js-music").forEach(b => b.addEventListener("click", () => Music.set(!S.music)));
$$(".js-vol").forEach(r => r.addEventListener("input", () => Music.setVol(r.value)));
// Musik-Menü: Noten-Knopf in der Kopfleiste öffnet es direkt darunter, Klick daneben oder Esc schließt es
const volPop = $("#vol-pop");
function closeVolPop(){ volPop.hidden = true; $$(".js-music-pop").forEach(b => b.setAttribute("aria-expanded", "false")); }
$$(".js-music-pop").forEach(b => b.addEventListener("click", e => {
  e.stopPropagation();
  if (!volPop.hidden){ closeVolPop(); return; }
  volPop.hidden = false; b.setAttribute("aria-expanded", "true");
  const a = app.getBoundingClientRect(), r = b.getBoundingClientRect(), w = volPop.offsetWidth;
  volPop.style.top = (r.bottom - a.top + 8) + "px";
  volPop.style.left = Math.max(8, Math.min(a.width - w - 8, r.left - a.left + r.width / 2 - w / 2)) + "px";
}));
document.addEventListener("click", e => { if (!volPop.hidden && !volPop.contains(e.target)) closeVolPop(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !volPop.hidden) closeVolPop(); });
// Browser spielen Ton erst nach der ersten Berührung oder Taste ab – darum startet die Musik dort (falls sie an ist)
["pointerup", "touchend", "keydown"].forEach(t => addEventListener(t, () => { Music.play(); if (S.sound){ Sound.init(); if (Sound.ctx && Sound.ctx.state !== "running") Sound.ctx.resume(); } }, true));
document.addEventListener("visibilitychange", () => document.hidden ? Music.el?.pause() : Music.play());

/* ---------- FX: Partikel, Punkte, fliegende Fundstücke ---------- */
const FX = {
  c: $("#fx"), x: null, parts: [], running: false, dpr: 1,
  resize(){ const r = app.getBoundingClientRect(); this.dpr = Math.min(2, devicePixelRatio || 1); this.c.width = r.width * this.dpr; this.c.height = r.height * this.dpr; this.x = this.c.getContext("2d"); this.x.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); },
  burst(x, y, n = 26, colors = ["#ceff66", "#89f240", "#ffe14d", "#ffffff"], power = 5){
    if (reduced) return;
    for (let i = 0; i < n; i++){ const a = Math.random() * Math.PI * 2, s = (.4 + Math.random()) * power;
      this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5, life: 0, max: 40 + Math.random() * 30, c: colors[i % colors.length], r: 1.5 + Math.random() * 2.5, sq: Math.random() < .5 }); }
    this.run();
  },
  confetti(){ const r = app.getBoundingClientRect(); for (let k = 0; k < 5; k++) setTimeout(() => this.burst(r.width * (.15 + Math.random() * .7), r.height * (.25 + Math.random() * .3), 34, ["#ceff66", "#ff6b35", "#8b5fbf", "#ffe14d", "#00a676"], 7), k * 140); },
  run(){
    if (this.running) return; this.running = true;
    const tick = () => {
      const r = app.getBoundingClientRect(); this.x.clearRect(0, 0, r.width, r.height);
      this.parts = this.parts.filter(p => p.life < p.max);
      this.parts.forEach(p => { p.life++; p.vy += .12; p.vx *= .985; p.x += p.vx; p.y += p.vy;
        this.x.globalAlpha = 1 - p.life / p.max; this.x.fillStyle = p.c;
        if (p.sq) this.x.fillRect(p.x, p.y, p.r * 2, p.r * 2); else { this.x.beginPath(); this.x.arc(p.x, p.y, p.r, 0, 7); this.x.fill(); } });
      this.x.globalAlpha = 1;
      if (this.parts.length) requestAnimationFrame(tick); else this.running = false;
    };
    requestAnimationFrame(tick);
  },
  float(text, x, y){ const f = document.createElement("div"); f.className = "floater"; f.textContent = text; f.style.left = x + "px"; f.style.top = y + "px"; app.appendChild(f); setTimeout(() => f.remove(), 1100); },
  fly(iconId, from){
    const target = $$(".js-stat").find(s => s.offsetParent); if (!target || reduced) return bumpStat();
    const to = appXY(target), el = document.createElement("div");
    el.className = "flyer"; el.innerHTML = icon(iconId); el.style.left = from.x + "px"; el.style.top = from.y + "px"; app.appendChild(el);
    const a = el.animate([{ transform: "translate(0,0) scale(1)" }, { transform: `translate(${(to.x - from.x) * .5}px,${(to.y - from.y) * .5 - 60}px) scale(1.3)` }, { transform: `translate(${to.x - from.x}px,${to.y - from.y}px) scale(.5)`, opacity: .4 }], { duration: 750, easing: "cubic-bezier(.5,0,.6,1)" });
    a.onfinish = () => { el.remove(); bumpStat(); };
  }
};
function bumpStat(){ $$(".js-stat").forEach(s => { s.classList.remove("bump"); void s.offsetWidth; s.classList.add("bump"); }); }
addEventListener("resize", () => { FX.resize(); City.resize(); });

/* ---------- Ujio spricht (Schreibmaschine) ---------- */
let typeT, hideT, typing = false, full = "";
function say(text, ms){
  const g = $("#guide"), p = $("#guide-text"); full = text; g.hidden = false;
  g.style.animation = "none"; void g.offsetWidth; g.style.animation = "";
  clearInterval(typeT); clearTimeout(hideT);
  const done = () => { typing = false; p.textContent = full; $("#guide-more").hidden = false; hideT = setTimeout(() => g.hidden = true, ms || Math.max(3800, full.length * 60)); };
  if (reduced){ done(); return; }
  typing = true; $("#guide-more").hidden = true; let i = 0; p.textContent = "";
  typeT = setInterval(() => { i++; p.textContent = full.slice(0, i); if (i % 3 === 0) Sound.blip(); if (i >= full.length){ clearInterval(typeT); done(); } }, 22);
}
$("#guide").addEventListener("click", () => { if (typing){ clearInterval(typeT); typing = false; $("#guide-text").textContent = full; $("#guide-more").hidden = false; clearTimeout(hideT); hideT = setTimeout(() => $("#guide").hidden = true, 4000); } else $("#guide").hidden = true; });

let toastT;
function toast(html){ const t = $("#toast"); t.innerHTML = html; t.hidden = false; t.style.animation = "none"; void t.offsetWidth; t.style.animation = ""; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2000); }

/* ---------- Punkte, Fundstücke, Ränge ---------- */
function addScore(n, at){ S.score += n; save(); updateStats(); if (at) FX.float("+" + n, at.x, at.y - 10); }
function grant(id, at){
  if (S.found[id]) return false;
  const before = rankIdx(total());
  S.found[id] = true;
  const it = CONTENT.items[ALL.find(a => a.id === id).item];
  addScore(CONTENT.points.find, at);
  if (CONTENT.portalParts.includes(id)){
    toast(`${icon(it.icon)} ${L("Portalteil", "Portal part")}: ${esc(it.name)} (${partsFound()}/${CONTENT.portalParts.length})`);
    if (at){ FX.burst(at.x, at.y); FX.fly(it.icon, at); } else bumpStat();
  } else if (at) FX.burst(at.x, at.y);
  Sound.find();
  const after = rankIdx(total());
  if (after > before) setTimeout(() => levelUp(after), 1300);
  return true;
}
// Raum komplett (Bilder + Splitter): Spezialbild freilegbar bzw. Portal öffnet sich
function announceReady(r){
  Sound.win();
  const line = r.game === "portal" ? (allParts() ? LINES.portalOpen : LINES.portalOpenNoParts(missingParts().join(", "))) : LINES.seenAll;
  setTimeout(() => say(line, 5200), 700);
}
// Zeitsplitter im Bild angetippt
function markHint(r, slot, at){
  const k = `${r.id}:${slot}`; if (S.hints[k]) return false;
  const before = rankIdx(total()); S.hints[k] = true; addScore(CONTENT.points.hint, at);
  const after = rankIdx(total()); if (after > before) setTimeout(() => levelUp(after), 1300);
  const n = hintCount(r), t = hintTotal(r);
  toast(`${icon("i-crystal")} ${LINES.shard(n, t)} · +${CONTENT.points.hint}`); Sound.find();
  if (at) FX.burst(at.x, at.y, 24, ["#6af0ff", "#b07aff", "#ffffff"], 5);
  if (n >= t && r.clue) setTimeout(() => say(r.clue, 6500), 500);
  if (unlockReady(r) && !S.revealed[r.id]) setTimeout(() => announceReady(r), n >= t ? 7000 : 600);
  return true;
}
function markSeen(r, slot){
  const k = `${r.id}:${slot}`; if (S.seen[k]) return false;
  S.seen[k] = true; addScore(CONTENT.points.view);
  const n = seenCount(r), t = r.gallery.length;
  if (n >= t){
    // Galerie komplett: Bonus-Punkte für diesen Raum
    addScore(CONTENT.points.gallery);
    toast(`${icon("i-frame")} ${LINES.galleryDone} +${CONTENT.points.view + CONTENT.points.gallery}`); Sound.win();
  } else { toast(`${icon("i-frame")} ${n}/${t} ${L("Bilder angesehen", "pictures viewed")} · +${CONTENT.points.view}`); Sound.find(); }
  return true;
}
function hexBadge(i, big){
  const r = CONTENT.ranks[i];
  return `<div class="hexb"><svg viewBox="0 0 92 104" aria-hidden="true"><defs><linearGradient id="hg${big ? "b" : ""}${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ceff66"/><stop offset="1" stop-color="#89f240"/></linearGradient></defs>
    <path d="M46 3 L88 27 V77 L46 101 L4 77 V27 Z" fill="url(#hg${big ? "b" : ""}${i})" stroke="#02120b" stroke-width="3"/>
    <path d="M46 12 L80 31 V73 L46 92 L12 73 V31 Z" fill="none" stroke="#02120b" stroke-opacity=".25" stroke-width="2"/></svg>
    <div class="lv"><b>LV ${i + 1}</b><span>${r.kanji}</span></div></div>`;
}
function levelUp(i){
  const r = CONTENT.ranks[i], el = $("#levelup");
  el.innerHTML = `<div class="in"><div class="lu">Level up!</div>${hexBadge(i, true)}<p class="eyebrow">${L("Neuer Rang", "New rank")}</p><h2>${esc(r.name)}</h2><p class="small">${L("Tippe, um weiterzuspielen.", "Tap to keep playing.")}</p></div>`;
  el.hidden = false; Sound.levelup(); setTimeout(() => FX.confetti(), 250);
}
$("#levelup").addEventListener("click", () => $("#levelup").hidden = true);
function updateStats(){
  $$(".js-stat").forEach(s => s.innerHTML = `<span class="sc">${pad6(S.score)}</span><span class="it">${icon("i-crystal")}${shardsFound()}/${SHARD_MAX}</span>`);
}
$$(".js-stat").forEach(s => s.addEventListener("click", () => openDojo()));

/* ---------- Bildschirme ---------- */
const SCREENS = ["s-intro", "s-map", "s-room", "s-dojo", "s-3d"];
function show(id){ $("#guide").hidden = true; $("#winpop").hidden = true; clearInterval(typeT); clearTimeout(hideT); SCREENS.forEach(s => { const el = document.getElementById(s); el.hidden = s !== id; if (s === id) el.scrollTop = 0; }); if (id === "s-intro") City.start(); else City.stop(); $("#guide").classList.toggle("top", id === "s-3d"); if (id !== "s-3d" && typeof World !== "undefined") World.pause(); }
