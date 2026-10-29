// Startbildschirm: Stadt bei Nacht und Gullydeckel.

/* ---------- Intro: Stadt bei Nacht ---------- */
const City = {
  c: $("#city"), x: null, W: 0, H: 0, dpr: 1, off: null, drops: [], steam: [], blinks: [], wins: [], raf: 0, on: false,
  resize(){
    const r = this.c.getBoundingClientRect(); if (!r.width) return;
    this.dpr = Math.min(2, devicePixelRatio || 1); this.W = r.width; this.H = r.height;
    this.c.width = this.W * this.dpr; this.c.height = this.H * this.dpr; this.x = this.c.getContext("2d"); this.x.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const built = drawSkyline(this.W, this.H, this.dpr, .58, 7); this.off = built.off; this.blinks = built.blinks; this.wins = built.wins;
    this.drops = Array.from({ length: 110 }, () => ({ x: Math.random() * this.W, y: Math.random() * this.H, l: 8 + Math.random() * 14, v: 6 + Math.random() * 6 }));
    if (!this.on) this.frame(performance.now());
  },
  start(){ if (this.on) return; this.on = true; if (!this.off) this.resize(); const loop = t => { if (!this.on) return; this.frame(t); this.raf = requestAnimationFrame(loop); }; if (reduced) this.frame(0); else this.raf = requestAnimationFrame(loop); },
  stop(){ this.on = false; cancelAnimationFrame(this.raf); },
  frame(t){
    const x = this.x, W = this.W, H = this.H; if (!x || !this.off) return;
    x.drawImage(this.off, 0, 0, W, H);
    this.blinks.forEach((b, i) => { const a = (Math.sin(t / 500 + i * 1.7) + 1) / 2; x.fillStyle = `rgba(255,70,60,${.25 + a * .75})`; x.beginPath(); x.arc(b.x, b.y, 1.8, 0, 7); x.fill(); });
    if (Math.random() < .08 && this.wins.length){ const w = this.wins[Math.floor(Math.random() * this.wins.length)]; w.on = !w.on; }
    this.wins.forEach(w => { if (!w.on){ x.fillStyle = "#0b0f1e"; x.fillRect(w.x, w.y, w.w, w.h); } });
    const m = $("#manhole").getBoundingClientRect(), cr = this.c.getBoundingClientRect();
    const mx = m.left - cr.left + m.width / 2, my = m.top - cr.top + m.height / 2;
    const pulse = .55 + Math.sin(t / 700) * .15;
    const gl = x.createRadialGradient(mx, my, 4, mx, my, m.width * .9); gl.addColorStop(0, `rgba(137,242,64,${.35 * pulse})`); gl.addColorStop(1, "rgba(137,242,64,0)");
    x.fillStyle = gl; x.fillRect(mx - m.width, my - m.width, m.width * 2, m.width * 2);
    if (Math.random() < .5) this.steam.push({ x: mx + (Math.random() - .5) * m.width * .5, y: my, r: 6 + Math.random() * 8, vy: -(.5 + Math.random() * .7), vx: (Math.random() - .5) * .4, a: .0, life: 0 });
    this.steam = this.steam.filter(s => s.life < 160);
    this.steam.forEach(s => { s.life++; s.x += s.vx; s.y += s.vy; s.r += .35; const a = Math.min(1, s.life / 30) * (1 - s.life / 160) * .16;
      x.fillStyle = `rgba(190,255,200,${a})`; x.beginPath(); x.arc(s.x, s.y, s.r, 0, 7); x.fill(); });
    x.strokeStyle = "rgba(170,200,255,.28)"; x.lineWidth = 1; x.beginPath();
    this.drops.forEach(d => { d.y += d.v; d.x -= d.v * .18; if (d.y > H){ d.y = -20; d.x = Math.random() * W * 1.2; } x.moveTo(d.x, d.y); x.lineTo(d.x + d.l * .18, d.y - d.l); });
    x.stroke();
  }
};
function drawSkyline(W, H, dpr, horizonAt, seed){
  const R = rng(seed), off = document.createElement("canvas"); off.width = W * dpr; off.height = H * dpr;
  const g = off.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const hz = H * horizonAt, blinks = [], wins = [];
  const sky = g.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, "#05071a"); sky.addColorStop(.6, "#171340"); sky.addColorStop(1, "#3b2160");
  g.fillStyle = sky; g.fillRect(0, 0, W, hz);
  for (let i = 0; i < W * .25; i++){ g.fillStyle = `rgba(255,255,255,${R() * .7})`; g.fillRect(R() * W, R() * hz * .75, 1, 1); }
  const mX = W * .9, mY = hz * .42; const moon = g.createRadialGradient(mX, mY, 2, mX, mY, 34); moon.addColorStop(0, "rgba(240,236,214,.95)"); moon.addColorStop(.32, "rgba(240,236,214,.9)"); moon.addColorStop(.36, "rgba(200,190,255,.18)"); moon.addColorStop(1, "rgba(200,190,255,0)");
  g.fillStyle = moon; g.fillRect(mX - 36, mY - 36, 72, 72);
  const layer = (col, hMin, hMax, wMin, wMax, lit) => {
    let x = -10;
    while (x < W + 10){
      const w = wMin + R() * (wMax - wMin), h = hz * (hMin + R() * (hMax - hMin)), top = hz - h;
      g.fillStyle = col; g.fillRect(x, top, w, h + 1);
      if (R() < .35){ g.fillRect(x + w * .3, top - 6, w * .4, 6); }
      if (R() < .25){ const ax = x + w * (.3 + R() * .4); g.fillRect(ax, top - 22, 1.5, 22); blinks.push({ x: ax + .7, y: top - 22 }); }
      if (lit && R() < .22 && w > 22){ const tx = x + w * .2, tw = Math.min(14, w * .45); g.fillStyle = "#1a1530"; g.fillRect(tx, top - 12, tw, 9); g.fillRect(tx + 2, top - 3, 1.5, 3); g.fillRect(tx + tw - 3, top - 3, 1.5, 3); g.beginPath(); g.moveTo(tx - 1, top - 12); g.lineTo(tx + tw / 2, top - 17); g.lineTo(tx + tw + 1, top - 12); g.fill(); g.fillStyle = col; }
      if (lit){
        for (let wy = top + 6; wy < hz - 6; wy += 8) for (let wx = x + 4; wx < x + w - 5; wx += 6){
          if (R() < .3){ const c = ["#ffd36b", "#ffe9a8", "#8ff0ff", "#c8ff8a"][Math.floor(R() * 4)]; g.fillStyle = c; g.globalAlpha = .55 + R() * .45; g.fillRect(wx, wy, 3, 4); g.globalAlpha = 1;
            if (R() < .12) wins.push({ x: wx, y: wy, w: 3, h: 4, on: true });
            g.fillStyle = c; g.globalAlpha = .08; g.fillRect(wx - 1, hz + (hz - wy) * .35, 4, 10 + R() * 18); g.globalAlpha = 1; } }
        g.fillStyle = col;
      }
      x += w + (R() < .2 ? 3 : 0);
    }
  };
  layer("#1a1838", .22, .42, 18, 40, false);
  layer("#0b0f1e", .14, .5, 16, 44, true);
  const st = g.createLinearGradient(0, hz, 0, H); st.addColorStop(0, "rgba(14,18,28,.9)"); st.addColorStop(1, "#05070a");
  g.fillStyle = st; g.fillRect(0, hz, W, H - hz);
  g.fillStyle = "rgba(137,242,64,.35)"; g.fillRect(0, hz, W, 1.5);
  g.strokeStyle = "rgba(255,255,255,.06)"; g.lineWidth = 1;
  for (let i = 1; i < 6; i++){ const y = hz + (H - hz) * Math.pow(i / 6, 1.6); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.strokeStyle = "rgba(255,225,77,.25)"; g.setLineDash([14, 18]); g.beginPath(); g.moveTo(W / 2, hz + 4); g.lineTo(W / 2, H); g.stroke(); g.setLineDash([]);
  return { off, blinks, wins };
}
function drawLid(){
  const hex = (cx, cy, r = 9) => { const p = []; for (let k = 0; k < 6; k++){ const a = Math.PI / 180 * (60 * k - 90); p.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`); } return `M${p.join("L")}Z`; };
  const tile = [hex(0, 0), hex(15.59, 0), hex(7.79, 13.5), hex(0, 27), hex(15.59, 27)].join("");
  $("#lid").innerHTML = `<defs>
      <radialGradient id="iron" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#4a5560"/><stop offset=".6" stop-color="#262d35"/><stop offset="1" stop-color="#12161b"/></radialGradient>
      <pattern id="hexp" width="15.59" height="27" patternUnits="userSpaceOnUse"><path d="${tile}" fill="none" stroke="#0c1014" stroke-width="2.2"/></pattern>
      <path id="ring" d="M120 120 m-90 0 a90 90 0 1 1 180 0 a90 90 0 1 1 -180 0"/></defs>
    <circle cx="120" cy="120" r="114" fill="url(#iron)" stroke="#05080b" stroke-width="3"/>
    <circle cx="120" cy="120" r="104" fill="none" stroke="#89f240" stroke-opacity=".55" stroke-width="2"/>
    <circle cx="120" cy="120" r="76" fill="url(#hexp)"/>
    <circle cx="120" cy="120" r="76" fill="none" stroke="#5c6772" stroke-width="1.5"/>
    <text font-family="Silkscreen, monospace" font-size="12" letter-spacing="2.6" fill="#ceff66" fill-opacity=".85"><textPath href="#ring">${L("UJIO · KANALNETZ · ENTER THE SEWER · UJIO · KANALNETZ ·", "UJIO · SEWER NETWORK · ENTER THE SEWER · UJIO · SEWER NETWORK ·")}</textPath></text>
    <circle cx="120" cy="120" r="51" fill="#0b1410" stroke="#89f240" stroke-width="2.5"/>
    <filter id="lidglow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.4"/><feFlood flood-color="#89f240" flood-opacity=".75"/><feComposite operator="in" in2="SourceAlpha"/><feGaussianBlur stdDeviation="2.4"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <!-- Wasserzeichen-Logo in Neon-Lime (img/ujio-gulli.png), leicht in die Höhe gestreckt, weil der Deckel per CSS stark nach hinten gekippt ist -->
    <image href="img/ujio-gulli.png" x="100" y="75" width="40" height="90" preserveAspectRatio="none" filter="url(#lidglow)"/>`;
}
let entering = false;
function enter(){
  if (entering) return; entering = true;
  Sound.clang(); $("#s-intro").classList.add("open");
  const m = appXY($("#manhole")); setTimeout(() => FX.burst(m.x, m.y, 40, ["#ceff66", "#89f240", "#ffffff"], 6), 250);
  setTimeout(() => { $("#descent").classList.add("go"); Sound.noise(1.1, .12, 400); }, 650);
  setTimeout(() => { const back = S.introDone; S.introDone = true; save(); openMap(); back ? say(LINES.back, 3200) : showStory(() => say(LINES.welcome)); }, 1500);
  setTimeout(() => { $("#descent").classList.remove("go"); $("#s-intro").classList.remove("open"); entering = false; }, 2000);
}
$("#manhole").addEventListener("click", enter);
$("#enter").addEventListener("click", enter);
