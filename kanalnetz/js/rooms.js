// Kammer-Seiten: die Minispiele hinter den Spezialbildern (Taschenlampe, Bruchtest, Klang-Melodie, Bau-Spiel, Arcade), der Fernseher, das Zeitreiseportal und der Abspann.

/* ---------- Kammern ---------- */
let current = null, view = null, lastFound = null, light = null, gameStop = null, justWon = null;
// „Noch mal“ erst, wenn das Spiel schon gewonnen war und nicht gerade eben zum ersten Mal
const canReplay = r => wonBefore(r) && justWon !== r.id;
// view: null = Minispiel des Raums, "tv" = Fernseher im Jugendzimmer (Reels)
function openRoom(id, v){
  const r = ROOM[id]; current = id; view = v || null; lastFound = null; flReplay = null; buildReplay = null; flPos = null; justWon = null; clearTimeout(backT);
  $("#room-title").textContent = r.name;
  renderRoom(); show("s-room"); say(view === "tv" ? r.tvIntro : r.intro);
}
$("#room-back").addEventListener("click", () => { stopLight(); if (returnTo3D) World.open(current); else openMap(); });

const GAMES = {
  flashlight: { html: sceneHTML, wire: wireScene },
  break:      { html: breakHTML, wire: wireBreak },
  simon:      { html: simonHTML, wire: wireSimon },
  build:      { html: workshopHTML, wire: wireBuild },
  arcade:     { html: arcadeHTML, wire: wireArcade },
  portal:     { html: portalHTML, wire: wirePortal }
};
function renderRoom(){
  const r = ROOM[current], body = $("#room-body");
  stopLight();
  body.innerHTML = view === "tv" ? cinemaHTML(r) : GAMES[r.game].html(r);
  wireRoom(r);
}

/* Gemeinsame Bausteine der Minispiele */
function tallyHTML(r){
  return `<div class="tally"><span class="eyebrow" style="color:var(--muted)">${L("Fundstücke", "Items")}</span>
    <span class="slots">${roomItems(r).map(h => `<i class="${S.found[h.id] ? "on" : ""}">${S.found[h.id] ? icon(CONTENT.items[h.item].icon) : ""}</i>`).join("")}</span></div>`;
}
function refreshTally(r){ const el = $("#room-body .tally"); if (el) el.outerHTML = tallyHTML(r); }
// Spiel gewonnen: restliche Fundstücke verteilen, Punkte, nächster Raum offen
function finishGame(r, at){
  const first = !wonBefore(r);
  if (first){ S.won[r.id] = r.game; save(); justWon = r.id; }
  roomItems(r).forEach((h, i) => setTimeout(() => { if (grant(h.id, at)) refreshTally(r); }, 300 + i * 450));
  Sound.win(); if (at) FX.burst(at.x, at.y, 50, ["#ceff66", "#ffe14d", "#ffffff", "#8b5fbf"], 8);
  if (first){ addScore(CONTENT.points.solve, at); backToMap(r, LINES.gameWin, 1800); } else { say(LINES.replayWin, 2600); backToMap(r, null, 1800, false); }
  return first;
}
// Nach dem Sieg im Spiel bleiben; nach kurzem Feiern erscheint „Geschafft!“ mit „Zurück ins Kanalnetz“ oder „Hier bleiben“.
// first = erster Sieg in diesem Raum (dann sagt Ujio auf der Karte, dass der nächste Tunnel frei ist)
let backT = 0;
function backToMap(r, line, ms = 1600, first = true){
  clearTimeout(backT);
  backT = setTimeout(() => { if (current === r.id && !$("#s-room").hidden) showWinPop(r, line, first); }, ms);
}
// Portalteil dieses Raums (für das Sieg-Fenster)
function partLine(r, first){
  const pid = r.part ? r.part.id : (r.rewards || []).map(x => x.id).find(id => CONTENT.portalParts.includes(id)); if (!pid || !first) return "";
  const it = CONTENT.items[ALL.find(a => a.id === pid).item], have = CONTENT.portalParts.filter(id => S.found[id] || id === pid).length;
  return `<p class="wp-part">${icon(it.icon)}<span>${L("Portalteil erhalten", "Portal part received")}: <b>${esc(it.name)}</b> (${have}/${CONTENT.portalParts.length})</span></p>`;
}
// Sieg-Fenster: das Spezialbild als Belohnung, dazu „Zurück ins Kanalnetz“ oder „Hier bleiben“
function showWinPop(r, line, first){
    const el = $("#winpop");
    el.innerHTML = `<div class="in card">${r.image ? `<figure class="wp-pic"><img src="${esc(r.image)}" alt="${esc(r.name)}"><figcaption class="pixel">${icon("i-star")}${L("Spezialbild freigeschaltet", "Special picture unlocked")}</figcaption></figure>` : icon("i-check", "wp-ico")}<h2>${L("Geschafft!", "Done!")}</h2>
      ${partLine(r, first)}<p class="lead">${first ? (r.id === "werkstatt" ? L("Hinter dem Labor hat sich ein verborgener Gang geöffnet.", "A hidden passage has opened behind the lab.") : r.id === "kino" ? L("Ab zum Portalraum hinter dem Labor!", "Off to the portal room behind the lab!") : L("Der Tunnel zum nächsten Raum ist jetzt frei.", "The tunnel to the next room is now open.")) : L("Stark, noch mal geschafft!", "Great, you did it again!")}</p>
      <div class="row"><button class="btn" id="wp-map">${icon("i-back")}${L("Zurück ins Kanalnetz", "Back to the sewer network")}</button><button class="btn ghost" id="wp-stay">${L("Hier bleiben", "Stay here")}</button></div></div>`;
    el.hidden = false; $("#wp-map").focus();
    $("#wp-map").addEventListener("click", () => { el.hidden = true; stopLight(); returnTo3D = false; openMap(); if (first && line) say(line, 4200); });
    $("#wp-stay").addEventListener("click", () => { el.hidden = true; });
}
function heroHTML(r, lead){ return `<div class="room-hero"><p class="eyebrow">${L("Kammer", "Chamber")} ${r.no} · ${r.kind}</p><h2>${esc(r.name)}</h2><p class="lead">${lead}</p><div class="row"><button class="btn ghost sm js-enter3d">${icon("i-cube")}${returnTo3D ? L("Zurück in den Raum", "Back to the room") : L("Raum in 3D betreten", "Enter the room in 3D")}</button></div></div>`; }

// Nochmal spielen: eigene Fundliste bzw. eigener Baufortschritt, ohne neue Fundstücke oder Punkte
let flReplay = null, buildReplay = null, flPos = null;
// Verstecke der Taschenlampe: bei jedem Spielen neu und zufällig verteilt (mit Abstand zueinander, nicht am Rand)
function randomSpots(n){
  const pts = [];
  for (let tries = 0; pts.length < n && tries < 500; tries++){
    const p = { x: 14 + Math.random() * 72, y: 16 + Math.random() * 70 };
    if (pts.every(q => Math.hypot((q.x - p.x) * .8, q.y - p.y) > 26)) pts.push(p);
  }
  while (pts.length < n) pts.push({ x: 20 + pts.length * 30, y: 50 });
  return pts.map(p => ({ x: Math.round(p.x), y: Math.round(p.y) }));
}
function sceneHTML(r){
  const F = flReplay || S.found, done = r.hotspots.every(h => F[h.id]);
  if (!flPos) flPos = randomSpots(r.hotspots.length);
  const hs = r.hotspots.map((h, i) => { const f = F[h.id], it = CONTENT.items[h.item];
    return `<button class="hs${f ? " found" : ""}${h.id === lastFound ? " pop" : ""}" data-hs="${h.id}" style="left:${flPos[i].x}%;top:${flPos[i].y}%" aria-label="${f ? esc(it.name) + " " + L("gefunden", "found") : L("Verstecktes Detail untersuchen", "Inspect hidden detail")}" ${f ? "disabled" : ""}>
      ${f ? `<span class="tok">${icon(it.icon)}</span>` : `<span class="glint"></span>`}</button>`; }).join("");
  const media = r.image ? `<img src="${esc(r.image)}" alt="${esc(r.name)}">` : `<canvas class="dio" data-room="${r.id}"></canvas>`;
  // Making-of (Setup ↔ fertiges Bild) nur, wenn es ein echtes Setup-Foto gibt
  const mk = !!(r.image && r.setupImage) && !flReplay;
  const setup = mk ? `<img src="${esc(r.setupImage)}" alt="Setup" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : "";
  const finalMedia = mk ? `<img src="${esc(r.image)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : "";
  const doneLead = mk ? L("Szene gelöst. Unten siehst du, wie sie entstanden ist.", "Scene solved. Below you can see how it was made.") : L("Szene gelöst. Alle drei Fundstücke gehören dir.", "Scene solved. All three items are yours.");
  return `${heroHTML(r, done ? doneLead : L("Zieh die Taschenlampe über das Bild. Was im Licht aufblitzt, kannst du antippen.", "Drag the flashlight across the picture. Tap whatever flashes in the light."))}
  <div class="room-body">
    <div class="frame${done ? " lit" : ""}" id="frame">
      ${media}${hs}
      <div class="darkness"></div><div class="beam"></div>
      <div class="flash" id="flash"></div><div class="licht" id="licht"><span>${L("Licht an!", "Lights on!")}</span></div>
      <div class="hint">${L("◄ Lampe bewegen ►", "◄ Move the light ►")}</div>
    </div>
    <div class="tally"><span class="eyebrow" style="color:var(--muted)">${L("Fundstücke", "Items")}</span>
      <span class="slots">${r.hotspots.map(h => `<i class="${F[h.id] ? "on" : ""}">${F[h.id] ? icon(CONTENT.items[h.item].icon) : ""}</i>`).join("")}</span></div>
    ${done && canReplay(r) ? `<div class="row"><button class="btn ghost sm js-replay">${icon("i-play")}${L("Noch mal suchen", "Search again")}</button></div>` : ""}
    ${mk ? `<div class="card" id="makingof">
      <p class="eyebrow">Making-of</p>
      <h3>${L("Hinter der Szene", "Behind the scene")}</h3>
      <div class="compare" id="cmp">
        <div class="layer setup mat">${setup}<span class="tag">Setup</span></div>
        <div class="layer final">${finalMedia}<span class="tag">${L("Fertiges Bild", "Final picture")}</span></div>
        ${done ? `<div class="divider"></div><div class="knob">${icon("i-arrows")}</div><input type="range" id="cmp-${r.id}" min="0" max="100" value="50" aria-label="${L("Zwischen Setup und fertigem Bild wechseln", "Switch between setup and final picture")}">`
               : `<div class="veil"><div>${icon("i-lock")}<p>${L("Finde alle drei Fundstücke, dann siehst du, wie diese Szene gebaut wurde.", "Find all three items to see how this scene was built.")}</p></div></div>`}
      </div>
      ${done && r.facts ? `<div class="stats">${r.facts.map(f => `<div class="st">${icon(f[2])}<div><b>${esc(f[0])}</b><span>${esc(f[1])}</span></div></div>`).join("")}</div>` : ""}
    </div>` : ""}
  </div>`;
}
/* Gezeichnete Kanal-Szene (Rätselrahmen im 3D-Raum, Ersatz falls kein Foto): Tunnel mit Fluchtpunkt, Wasser, Licht */
function drawDiorama(cv, look, fw, fh){
  const rect = fw ? { width: fw, height: fh } : cv.getBoundingClientRect(), dpr = fw ? 1 : Math.min(2, devicePixelRatio || 1);
  const W = Math.max(10, rect.width), H = Math.max(10, rect.height);
  cv.width = W * dpr; cv.height = H * dpr; const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const R = rng(look.seed), vx = W * look.vp[0], vy = H * look.vp[1];
  g.fillStyle = "#06090c"; g.fillRect(0, 0, W, H);
  const far = g.createRadialGradient(vx, vy, 2, vx, vy, W * .5); far.addColorStop(0, look.glow); far.addColorStop(.12, look.glow + "88"); far.addColorStop(.5, "rgba(0,0,0,0)");
  for (let i = 9; i >= 0; i--){
    const k = Math.pow(i / 9, 1.35), w = W * (.08 + 1.25 * (1 - k)), h = H * (.07 + 1.1 * (1 - k)), x = vx - w / 2, y = vy - h * .55;
    g.fillStyle = shade(look.wall, -.45 + (1 - k) * .75); g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + w / 2); g.arc(vx, y + w / 2, w / 2, Math.PI, 0); g.lineTo(x + w, y + h); g.closePath(); g.fill();
    g.strokeStyle = "rgba(0,0,0,.55)"; g.lineWidth = 1 + (1 - k) * 6; g.stroke();
    if (i % 3 === 0){ g.strokeStyle = shade(look.wall, .15); g.globalAlpha = .25; g.lineWidth = 1; g.stroke(); g.globalAlpha = 1; }
  }
  g.fillStyle = far; g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1;
  for (let i = 0; i < 26; i++){ const a = (i / 26) * Math.PI * 2; g.beginPath(); g.moveTo(vx, vy); g.lineTo(vx + Math.cos(a) * W * 1.4, vy + Math.sin(a) * H * 1.4); g.globalAlpha = .4; g.stroke(); }
  g.globalAlpha = 1;
  // Ziegel-Textur, zum Rand hin stärker
  const bp = document.createElement("canvas"); bp.width = 28; bp.height = 14; const bg = bp.getContext("2d");
  bg.strokeStyle = "rgba(0,0,0,.55)"; bg.lineWidth = 1.2; bg.beginPath(); bg.moveTo(0, .5); bg.lineTo(28, .5); bg.moveTo(0, 7.5); bg.lineTo(28, 7.5); bg.moveTo(7, 0); bg.lineTo(7, 7); bg.moveTo(21, 7); bg.lineTo(21, 14); bg.stroke();
  bg.strokeStyle = "rgba(255,255,255,.07)"; bg.beginPath(); bg.moveTo(0, 1.8); bg.lineTo(28, 1.8); bg.moveTo(0, 8.8); bg.lineTo(28, 8.8); bg.stroke();
  const brickMask = g.createRadialGradient(vx, vy, W * .12, vx, vy, W * .75); brickMask.addColorStop(0, "rgba(0,0,0,0)"); brickMask.addColorStop(1, "rgba(0,0,0,1)");
  g.save(); g.globalAlpha = .9; g.fillStyle = g.createPattern(bp, "repeat"); g.fillRect(0, 0, W, H * .78); g.restore();
  // Rohr an der linken Wand
  const py = H * .3, pg2 = g.createLinearGradient(0, py - 14, 0, py + 14); pg2.addColorStop(0, "#5a636b"); pg2.addColorStop(.5, "#2b3238"); pg2.addColorStop(1, "#14181c");
  g.fillStyle = pg2; g.beginPath(); g.moveTo(0, py - 16); g.lineTo(vx - W * .04, vy - H * .03); g.lineTo(vx - W * .04, vy - H * .015); g.lineTo(0, py + 16); g.fill();
  for (let i = 1; i < 5; i++){ const t = i / 5, xx = t * (vx - W * .04), y1 = py - 16 + (vy - H * .03 - py + 16) * t, y2 = py + 16 + (vy - H * .015 - py - 16) * t; g.strokeStyle = "rgba(0,0,0,.6)"; g.lineWidth = 3 * (1 - t) + 1; g.beginPath(); g.moveTo(xx, y1); g.lineTo(xx, y2); g.stroke(); }
  // Hängende Laterne
  const lx = W * .78, ly = H * .2; g.strokeStyle = "rgba(0,0,0,.8)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(lx, 0); g.lineTo(lx, ly - 10); g.stroke();
  const lg = g.createRadialGradient(lx, ly, 2, lx, ly, W * .22); lg.addColorStop(0, look.glow); lg.addColorStop(.08, look.glow + "aa"); lg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = lg; g.beginPath(); g.arc(lx, ly, W * .22, 0, 7); g.fill();
  g.fillStyle = "#14100a"; g.fillRect(lx - 6, ly - 10, 12, 3); g.fillRect(lx - 6, ly + 8, 12, 3);
  const wy = H * .74, wg = g.createLinearGradient(0, wy, 0, H); wg.addColorStop(0, look.water + "55"); wg.addColorStop(1, "#020405");
  g.fillStyle = wg; g.beginPath(); g.moveTo(0, H); g.lineTo(0, wy + 30); g.lineTo(vx - 10, vy + H * .06); g.lineTo(vx + 10, vy + H * .06); g.lineTo(W, wy + 30); g.lineTo(W, H); g.fill();
  for (let i = 0; i < 40; i++){ const yy = vy + H * .07 + Math.pow(R(), 1.6) * (H - vy), spread = (yy - vy) * 1.1; g.fillStyle = look.glow; g.globalAlpha = .08 + R() * .18; g.fillRect(vx - spread * R(), yy, 6 + R() * spread * .5, 1.2); }
  g.globalAlpha = 1;
  g.save(); g.shadowColor = look.water; g.shadowBlur = 18; g.strokeStyle = look.water; g.globalAlpha = .65; g.lineCap = "round";
  for (let i = 0; i < 3; i++){ g.lineWidth = 2 + i * 2.5; g.globalAlpha = .5 - i * .14; g.beginPath(); g.moveTo(vx, vy + H * .07); g.quadraticCurveTo(vx + W * .05, vy + (H - vy) * .55, vx - W * .06 + i * 4, H); g.stroke(); }
  g.restore();
  const shaft = g.createLinearGradient(vx, 0, vx, H); shaft.addColorStop(0, look.glow + "44"); shaft.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = shaft; g.beginPath(); g.moveTo(W * .32, 0); g.lineTo(W * .5, 0); g.lineTo(vx + W * .22, H); g.lineTo(vx - W * .12, H); g.fill();
  for (let i = 0; i < 70; i++){ g.fillStyle = "rgba(255,255,240," + (R() * .5) + ")"; g.fillRect(W * (.2 + R() * .6), H * R(), 1.4, 1.4); }
  const vg = g.createRadialGradient(W / 2, H / 2, W * .3, W / 2, H / 2, W * .85); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.7)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
}
function shade(hex, amt){ const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const f = v => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt))); return `rgb(${f(r)},${f(g)},${f(b)})`; }

/* Taschenlampe */
// Beim Verlassen einer Kammer: Taschenlampe und laufende Minispiele (Timer) anhalten
function stopLight(){ if (light){ cancelAnimationFrame(light.raf); light = null; } if (gameStop){ gameStop(); gameStop = null; } }
function startLight(r){
  const fr = $("#frame"); if (!fr || fr.classList.contains("lit")) return;
  const st = { x: .5, y: .45, tx: .5, ty: .45, idle: true, raf: 0, r: 0 };
  light = st;
  const rect = () => fr.getBoundingClientRect();
  const set = (cx, cy) => { const b = rect(); st.tx = (cx - b.left) / b.width; st.ty = (cy - b.top) / b.height; };
  fr.addEventListener("pointerdown", e => { st.idle = false; fr.classList.add("touched"); set(e.clientX, e.clientY); });
  fr.addEventListener("pointermove", e => { if (e.pointerType === "mouse" || e.buttons){ st.idle = false; fr.classList.add("touched"); set(e.clientX, e.clientY); } });
  const loop = t => {
    if (light !== st) return;
    const b = rect(); st.r = Math.max(95, b.width * .33);
    if (st.idle){ st.tx = .5 + Math.sin(t / 1300) * .3; st.ty = .5 + Math.sin(t / 900) * .28; }
    st.x += (st.tx - st.x) * .2; st.y += (st.ty - st.y) * .2;
    fr.style.setProperty("--mx", (st.x * 100) + "%"); fr.style.setProperty("--my", (st.y * 100) + "%"); fr.style.setProperty("--r", st.r + "px");
    $$(".hs:not(.found)", fr).forEach(h => { const hx = parseFloat(h.style.left) / 100, hy = parseFloat(h.style.top) / 100;
      const d = Math.hypot((hx - st.x) * b.width, (hy - st.y) * b.height), v = Math.max(0, 1 - d / (st.r * .75));
      h.dataset.lit = v > .15 ? "1" : ""; h.querySelector(".glint").style.opacity = v.toFixed(2); });
    st.raf = requestAnimationFrame(loop);
  };
  st.raf = requestAnimationFrame(loop);
}

/* Bau-Spiel: Samurai-Helm in fünf Stufen (Skizze, Schnittmuster, Foam, Details, Farbe) */
function helmetSVG(){
  const dome = "M52 112 Q50 48 100 42 Q150 48 148 112 Z", brim = "M30 112 H170 L180 146 H20 Z";
  const hornL = "M90 66 C78 46 66 28 54 8", hornR = "M110 66 C122 46 134 28 146 8";
  const flapL = "M30 112 L12 96 L22 132 Z", flapR = "M170 112 L188 96 L178 132 Z";
  const rivets = [60, 74, 88, 100, 112, 126, 140].map(x => `<circle cx="${x}" cy="104" r="2.6"/>`).join("") + [36, 56, 76, 96, 116, 136, 156].map(x => `<circle cx="${x + 4}" cy="128" r="2.4"/>`).join("");
  return `<svg class="helm" id="helm" viewBox="0 0 200 160" aria-hidden="true">
    <g class="hl" data-i="0" fill="none" stroke="#a9b7c9" stroke-width="1.6" stroke-dasharray="5 4">
      <path d="${dome}"/><path d="${brim}"/><path d="${hornL}"/><path d="${hornR}"/><path d="${flapL}"/><path d="${flapR}"/>
      <path d="M20 154 H180 M20 150 V158 M180 150 V158" stroke-dasharray="none" stroke="#6af0ff"/></g>
    <g class="hl" data-i="1" fill="#e9dcc0" stroke="#b8a882" stroke-width="1.2">
      <path d="M54 110 Q52 52 82 46 L86 110 Z" transform="translate(-8 -4)"/><path d="M90 110 L86 44 Q100 42 114 44 L110 110 Z"/><path d="M146 110 Q148 52 118 46 L114 110 Z" transform="translate(8 -4)"/>
      <path d="M30 116 H98 L96 148 H20 Z" transform="translate(-4 4)"/><path d="M102 116 H170 L180 148 H104 Z" transform="translate(4 4)"/></g>
    <g class="hl" data-i="2" fill="#3c434b" stroke="#22272c" stroke-width="2">
      <path d="${dome}"/><path d="${brim}"/><path d="${flapL}"/><path d="${flapR}"/>
      <path d="M100 42 V112 M76 46 Q70 80 72 112 M124 46 Q130 80 128 112 M25 129 H175" fill="none" stroke="#2a2f35"/></g>
    <g class="hl" data-i="3">
      <path d="${hornL}" fill="none" stroke="#4a525a" stroke-width="7" stroke-linecap="round"/><path d="${hornR}" fill="none" stroke="#4a525a" stroke-width="7" stroke-linecap="round"/>
      <path d="M50 104 Q100 98 150 104 V114 Q100 108 50 114 Z" fill="#525a62"/><circle cx="100" cy="72" r="9" fill="#525a62" stroke="#2a2f35" stroke-width="2"/>
      <g fill="#7a848c">${rivets}</g></g>
    <g class="hl" data-i="4">
      <path d="${dome}" fill="#8a1f24"/><path d="M58 60 Q84 46 100 46" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="4" stroke-linecap="round"/>
      <path d="${brim}" fill="#1c1517"/><path d="${flapL}" fill="#c9a043"/><path d="${flapR}" fill="#c9a043"/>
      <path d="M24 122 H176 M22 134 H178" fill="none" stroke="#c9a043" stroke-width="2.4"/>
      <path d="${hornL}" fill="none" stroke="#d9b24a" stroke-width="7" stroke-linecap="round"/><path d="${hornR}" fill="none" stroke="#d9b24a" stroke-width="7" stroke-linecap="round"/>
      <path d="M50 104 Q100 98 150 104 V114 Q100 108 50 114 Z" fill="#c9a043"/><circle cx="100" cy="72" r="9" fill="#d9b24a" stroke="#6a4a10" stroke-width="2"/>
      <g fill="#f2d27a">${rivets}</g>
      <path d="${dome}" fill="url(#weather)"/></g>
    <defs><linearGradient id="weather" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(20,10,5,.45)"/></linearGradient></defs>
  </svg>`;
}
// Sichtbarkeit der Helm-Stufen: k = fertige Schritte, p = Fortschritt des aktuellen Schritts (0–1)
function helmetStage(k, p){
  $$("#helm .hl").forEach(g => { const i = +g.dataset.i; let o = i < k ? 1 : i === k ? p : 0; if (i <= 1 && k >= 3) o = 0; g.style.opacity = o; });
}
function workshopHTML(r){
  const k = buildReplay ?? S.workshopStep, n = r.steps.length, done = k >= n;
  const C = 2 * Math.PI * 58, tipStep = r.steps[Math.min(Math.max(k - 1, 0), n - 1)];
  const steps = r.steps.map((s, i) => {
    const cls = i < k ? "done" : i === k ? "" : "todo";
    return `<li class="step ${cls}"><span class="n">${i < k ? icon("i-check") : String(i + 1).padStart(2, "0")}</span>
      <div class="b"><h3>${esc(s.title)}</h3>
      ${i < k ? `<p class="lead">${esc(s.text)}</p><p class="tip"><b>${L("Profi-Tipp", "Pro tip")}:</b> ${esc(s.tip)}</p>`
              : i === k ? `<p class="lead">${L("Jetzt dran. Halt den Hammer gedrückt.", "Up next. Hold the hammer.")}</p>` : `<p class="small">${L("Noch nicht gebaut.", "Not built yet.")}</p>`}</div></li>`;
  }).join("");
  return `${heroHTML(r, L("Bau mit mir einen Samurai-Helm aus EVA-Foam. Halt den Hammer gedrückt, dann siehst du jeden Bauschritt entstehen.", "Build a samurai helmet from EVA foam with me. Hold the hammer and watch each build step take shape."))}
  <div class="room-body">
    <div class="card bp">
      <div class="meta"><span>${L("Bauplan: Samurai-Helm", "Blueprint: samurai helmet")}</span><span>${Math.min(k, n)}/${n} ${L("gebaut", "built")}</span></div>
      <div class="bar"><i style="width:${Math.min(k, n) / n * 100}%"></i></div>
      <div class="helm-wrap${done ? " done" : ""}">${helmetSVG()}<span class="helm-stage pixel">${done ? L("Fertig!", "Done!") : `${L("Schritt", "Step")} ${k + 1}: ${esc(r.steps[k].title)}`}</span></div>
      ${done ? `<p class="lead">${L("Fertig gebaut! Vom Papier bis zur Farbe, bereit für die Con.", "All built! From paper to paint, ready for the con.")}</p>
        ${canReplay(r) ? `<div class="row"><button class="btn ghost sm js-replay">${icon("i-hammer")}${L("Noch mal bauen", "Build again")}</button></div>` : ""}` : `
      <div class="hold-wrap">
        <button class="hold" id="hold" aria-label="${L(`Gedrückt halten, um Schritt ${k + 1} zu bauen`, `Hold to build step ${k + 1}`)}">
          <svg class="ring" viewBox="0 0 132 132" aria-hidden="true"><circle cx="66" cy="66" r="58" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="8"/>
            <circle id="hold-fg" cx="66" cy="66" r="58" fill="none" stroke="#ceff66" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" style="filter:drop-shadow(0 0 6px #89f240)"/></svg>
          <span class="lbl">${icon("i-hammer")}${L("Halten", "Hold")}</span>
        </button>
      </div>`}
    </div>
    ${k > 0 ? `<div class="card tipcard"><p class="eyebrow">${L("Profi-Tipp", "Pro tip")} · ${esc(tipStep.title)}</p><p class="lead" style="margin:0">${esc(tipStep.tip)}</p></div>` : ""}
    ${done ? `<button class="btn reward-btn" id="build-reward">${icon("i-star")}${L("Helm fertig – Belohnung abholen", "Helmet done – collect your reward")}</button>` : ""}
    <ol class="steps">${steps}</ol>
  </div>`;
}
function cinemaHTML(r){
  const tv = (rl, wide) => `<a class="tv${wide ? " wide" : ""}" href="${CONTENT.reels}" target="_blank" rel="noopener" aria-label="${esc(rl[1])} ${L("auf Instagram ansehen", "on Instagram")}">
      <div class="box"><div class="scr"><span class="ch">${rl[0]}</span>${icon("i-play")}</div></div><span class="cap">${esc(rl[1])}</span></a>`;
  return `${heroHTML(r, L("Kurze Filme aus dem Kanal: Stop-Motion, Making-ofs und fertige Szenen. Tipp auf einen Fernseher.", "Short films from the sewers: stop motion, making-ofs and finished scenes. Tap a TV."))}
  <div class="room-body">
    <div class="tvs">${tv(r.reels[0], true)}${tv(r.reels[1])}${tv(r.reels[2])}</div>
    <div class="row"><a class="btn" href="${CONTENT.reels}" target="_blank" rel="noopener">${icon("i-play")}${L("Alle Reels auf Instagram", "All reels on Instagram")}</a></div>
  </div>`;
}

function wireRoom(r){
  const body = $("#room-body");
  $$(".js-enter3d", body).forEach(bt => bt.addEventListener("click", () => { stopLight(); World.open(r.id); }));
  $$("canvas.dio", body).forEach(cv => requestAnimationFrame(() => drawDiorama(cv, ROOM[cv.dataset.room].look)));
  if (view !== "tv") GAMES[r.game].wire(r);
}

/* ---------- Spiel: Taschenlampe ---------- */
function wireScene(r){
  const body = $("#room-body");
  startLight(r);
  $(".js-replay", body)?.addEventListener("click", () => { flReplay = {}; flPos = null; lastFound = null; renderRoom(); say(LINES.dark, 2600); });
  $$(".hs:not(.found)", body).forEach(b => b.addEventListener("click", () => {
    if (!b.dataset.lit){ Sound.deny(); say(LINES.dark, 2200); return; }
    const id = b.dataset.hs, at = appXY(b);
    if (flReplay){ if (flReplay[id]) return; flReplay[id] = true; FX.burst(at.x, at.y); Sound.find(); }
    else if (!grant(id, at)) return;
    lastFound = id;
    const F = flReplay || S.found;
    if (r.hotspots.every(h => F[h.id])){
      const replay = !!flReplay;
      if (!replay){ S.won[r.id] = r.game; save(); justWon = r.id; }
      renderRoom(); const fr = $("#frame"); fr.classList.remove("lit"); void fr.offsetWidth;
      setTimeout(() => { fr.classList.add("lit"); $("#flash").classList.add("go"); $("#licht").classList.add("go"); Sound.win(); const c = appXY(fr); FX.burst(c.x, c.y, 50, ["#ceff66", "#ffe14d", "#ffffff"], 8); if (!replay) addScore(CONTENT.points.solve, c); }, 60);
      if (replay){ say(LINES.replayWin); flReplay = null; backToMap(r, null, 3000, false); }
      else { if (r.part) setTimeout(() => grant(r.part.id, appXY($("#frame"))), 900); say(LINES.solved); backToMap(r, LINES.solved, 3000); }
      if ($("#makingof")) setTimeout(() => $("#makingof")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }), 1900);
    } else {
      b.classList.add("found", "pop"); b.disabled = true; b.innerHTML = `<span class="tok">${icon(CONTENT.items[r.hotspots.find(h => h.id === id).item].icon)}</span>`;
      $$(".slots i", body).forEach((s, i) => { const h = r.hotspots[i]; if (F[h.id] && !s.classList.contains("on")){ s.classList.add("on"); s.innerHTML = icon(CONTENT.items[h.item].icon); } });
      say(LINES.found[Math.floor(Math.random() * LINES.found.length)], 2400);
    }
  }));
  const range = $('.compare input[type="range"]', body);
  if (range){ let last = 50; range.addEventListener("input", () => { $("#cmp").style.setProperty("--pos", range.value + "%"); if (Math.abs(range.value - last) > 6){ Sound.blip(); last = +range.value; } }); }
}

/* ---------- Spiel: Bau-Spiel (Labor) ---------- */
function wireBuild(r){
  const k = buildReplay ?? S.workshopStep; helmetStage(k, 0);
  $(".js-replay")?.addEventListener("click", () => { buildReplay = 0; renderRoom(); say(LINES.step, 1600); });
  // Erster Sieg (gerade eben) → Text auf der Karte; sonst Wiederholung
  $("#build-reward")?.addEventListener("click", () => showWinPop(r, LINES.workshopDone, justWon === r.id));
  const h = $("#hold"); if (h) wireHold(h, r, k);
}
function wireHold(btn, r, k){
  const fg = $("#hold-fg"), helm = $("#helm"), C = 2 * Math.PI * 58; let p = 0, holding = false, last = 0, raf = 0, lastHit = 0;
  const tick = t => {
    const dt = last ? (t - last) / 1000 : 0; last = t;
    p += holding ? dt / 1.6 : -dt / .8; p = Math.max(0, Math.min(1, p));
    fg.setAttribute("stroke-dashoffset", (C * (1 - p)).toFixed(1)); helmetStage(k, p);
    if (holding && t - lastHit > 170){
      Sound.hit(); lastHit = t; helm.classList.remove("knock"); void helm.getBBox(); helm.classList.add("knock");
      const c = appXY(helm); FX.burst(c.x + (Math.random() - .5) * 90, c.y + (Math.random() - .5) * 60, 6, ["#ffe14d", "#ff6b35", "#ffffff"], 3);
    }
    if (p >= 1){ holding = false; btn.classList.remove("active"); complete(); return; }
    if (holding || p > 0) raf = requestAnimationFrame(tick); else last = 0;
  };
  const start = () => { if (holding) return; holding = true; btn.classList.add("active"); last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
  const stop = () => { holding = false; btn.classList.remove("active"); };
  gameStop = () => { holding = false; cancelAnimationFrame(raf); };
  const complete = () => {
    const at = appXY(helm), n = r.steps.length;
    FX.burst(at.x, at.y, 40, ["#ceff66", "#89f240", "#ffe14d", "#8b5fbf"], 6); Sound.win();
    if (buildReplay !== null){
      buildReplay++; if (buildReplay >= n) say(LINES.replayWin); else say(LINES.step, 2000);
    } else {
      S.workshopStep++; save(); addScore(CONTENT.points.step, at);
      if (S.workshopStep >= n){ grant(r.reward, at); if (r.part) setTimeout(() => grant(r.part.id, at), 700); S.won[r.id] = r.game; save(); justWon = r.id; say(LINES.workshopDone); } else say(LINES.step, 2000);
    }
    renderRoom();
  };
  btn.addEventListener("pointerdown", e => { e.preventDefault(); try { btn.setPointerCapture(e.pointerId); } catch(_){} start(); });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(ev => btn.addEventListener(ev, stop));
  btn.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter"){ e.preventDefault(); start(); } });
  btn.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") stop(); });
  btn.addEventListener("contextmenu", e => e.preventDefault());
}

/* ---------- Spiel: Bruchtest (Dojo) ---------- */
const BREAK_ROUNDS = [{ boards: 1, zone: .3, speed: .55 }, { boards: 2, zone: .24, speed: .75 }, { boards: 3, zone: .2, speed: .95 }];
function breakHTML(r){
  return `${heroHTML(r, canReplay(r) ? L("Alle Bretter zerschlagen. Lust auf noch einen Bruchtest?", "All boards broken. Fancy another board break?") : L("Ein Kraftbalken pendelt hin und her. Schlag zu, wenn der Zeiger im grünen Bereich ist. Drei Runden, jedes Mal ein Brett mehr.", "A power bar swings back and forth. Strike when the needle is in the green zone. Three rounds, one more board each time."))}
  <div class="room-body">
    <div class="brk" id="brk">
      <div class="brk-stage"><div class="brk-boards" id="brk-boards"></div><div class="brk-blocks"><i></i><i></i></div></div>
      <div class="brk-meter"><div class="brk-zone" id="brk-zone"></div><div class="brk-needle" id="brk-needle"></div></div>
      <button class="btn brk-hit" id="brk-hit">${L("Schlag!", "Strike!")}</button>
      <div class="g-over" id="brk-over"><button class="btn" id="brk-start">${icon("i-play")}Start</button></div>
    </div>
    <div class="g-bar"><span class="pixel" id="brk-info">${L("Runde", "Round")} 1/3</span><span class="small" style="color:var(--muted)">${L("Tipp: Leertaste geht auch.", "Tip: the space bar works too.")}</span></div>
  </div>`;
}
function wireBreak(r){
  const needle = $("#brk-needle"), zone = $("#brk-zone"), boards = $("#brk-boards"), box = $("#brk");
  let st = null, raf = 0, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const onKey = e => { if (e.key === " " && st && !$("#s-room").hidden){ e.preventDefault(); hit(); } };
  addEventListener("keydown", onKey);
  gameStop = () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); removeEventListener("keydown", onKey); st = null; };
  function setup(){
    const R = BREAK_ROUNDS[st.round];
    st.zc = .3 + Math.random() * .4; st.zw = R.zone; st.lock = false; st.t0 = performance.now();
    zone.style.left = ((st.zc - st.zw / 2) * 100) + "%"; zone.style.width = (st.zw * 100) + "%";
    boards.innerHTML = Array.from({ length: R.boards }, () => `<div class="board"><i></i><i></i></div>`).join("");
    $("#brk-info").textContent = `${L("Runde", "Round")} ${st.round + 1}/${BREAK_ROUNDS.length} · ${R.boards} ${R.boards === 1 ? L("Brett", "board") : L("Bretter", "boards")}`;
  }
  function start(){ $("#brk-over").hidden = true; st = { round: 0 }; setup(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }
  function loop(t){
    if (!st) return;
    const R = BREAK_ROUNDS[st.round], ph = ((t - st.t0) / 1000 * R.speed) % 2;
    st.pos = ph < 1 ? ph : 2 - ph; st.dir = ph < 1 ? 1 : -1;
    needle.style.left = (st.pos * 100) + "%";
    raf = requestAnimationFrame(loop);
  }
  function hit(){
    if (!st || st.lock) return;
    const a = st.zc - st.zw / 2, b = st.zc + st.zw / 2, at = appXY(boards);
    if (st.pos >= a && st.pos <= b){
      st.lock = true; boards.classList.add("broken"); Sound.clang(); Sound.hit(); FX.burst(at.x, at.y, 34, ["#c69a62", "#ffe14d", "#ffffff"], 6);
      say(LINES.breakHit[Math.floor(Math.random() * LINES.breakHit.length)], 1600);
      const its = roomItems(r);
      if (st.round < BREAK_ROUNDS.length - 1){
        if (grant(its[st.round].id, at)) refreshTally(r);
        st.round++; later(() => { if (!st) return; boards.classList.remove("broken"); setup(); }, 1300);
      } else {
        later(() => { cancelAnimationFrame(raf); st = null; const first = finishGame(r, at); $("#brk-over").hidden = false; $("#brk-start").disabled = first; $("#brk-start").innerHTML = first ? `${icon("i-check")}${L("Geschafft!", "Done!")}` : `${icon("i-play")}${L("Noch mal", "Play again")}`; }, 700);
      }
    } else {
      st.lock = true; Sound.deny(); box.classList.remove("bad"); void box.offsetWidth; box.classList.add("bad");
      const early = st.dir > 0 ? st.pos < a : st.pos > b; say(LINES.breakMiss(early), 1800);
      later(() => { if (st) st.lock = false; }, 600);
    }
  }
  $("#brk-hit").addEventListener("click", hit);
  $("#brk-start").addEventListener("click", start);
}
/* ---------- Spiel: Arcade „Schnappschuss" (Jugendzimmer) ---------- */
function arcadeHTML(r){
  return `${heroHTML(r, canReplay(r) ? L("Highscore geknackt! Willst du noch mal?", "High score cracked! Want another go?") : L("Tipp mein Logo an, sobald es auf einem Bildschirm auftaucht. Die anderen Bilder lieber nicht, das kostet Zeit!", "Tap my logo as soon as it pops up on a screen. Better leave the other pictures alone, they cost time!"))}
  <div class="room-body">
    <div class="arcade" id="arcade">
      ${Array.from({ length: 9 }, (_, i) => `<button class="scr" data-i="${i}" aria-label="${L("Bildschirm", "Screen")} ${i + 1}"><span class="pop"></span></button>`).join("")}
      <div class="g-over" id="ar-over"><button class="btn" id="ar-start">${icon("i-play")}Start</button></div>
    </div>
    <div class="g-bar"><span class="pixel" id="ar-hits">0/10 ${L("Treffer", "hits")}</span><div class="bar g-time"><i id="ar-time" style="width:100%"></i></div></div>
  </div>`;
}
function wireArcade(r){
  const box = $("#arcade"), cells = $$(".scr", box), GOAL = 10, TIME = 30000, pics = r.gallery.map(g => g.image);
  let st = null;
  const clearCells = () => cells.forEach(c => { clearTimeout(c._t); c.classList.remove("on"); c.dataset.logo = ""; });
  const halt = () => { if (st){ st.over = true; clearTimeout(st.t); cancelAnimationFrame(st.raf); } clearCells(); };
  gameStop = halt;
  const upd = () => $("#ar-hits").textContent = `${st.hits}/${GOAL} ${L("Treffer", "hits")}`;
  function start(){
    halt(); $("#ar-over").hidden = true;
    st = { hits: 0, t0: performance.now(), t: 0, raf: 0, over: false };
    upd(); spawn(); tick();
  }
  function spawn(){
    if (!st || st.over) return;
    const k = Math.min(1, (performance.now() - st.t0) / TIME), free = cells.filter(c => !c.classList.contains("on"));
    if (free.length){
      const c = free[Math.floor(Math.random() * free.length)], logo = Math.random() < .42;
      c.querySelector(".pop").style.backgroundImage = `url("${logo ? "img/ujio-1p.png" : pics[Math.floor(Math.random() * pics.length)]}")`;
      c.dataset.logo = logo ? "1" : ""; c.classList.toggle("is-logo", logo); c.classList.add("on");
      c._t = setTimeout(() => c.classList.remove("on"), 1150 - k * 450);
    }
    st.t = setTimeout(spawn, 640 - k * 260);
  }
  function tick(){
    if (!st || st.over) return;
    const left = Math.max(0, TIME - (performance.now() - st.t0));
    $("#ar-time").style.width = (left / TIME * 100) + "%";
    if (left <= 0){ end(false); return; }
    st.raf = requestAnimationFrame(tick);
  }
  cells.forEach(c => c.addEventListener("click", () => {
    if (!st || st.over || !c.classList.contains("on")) return;
    clearTimeout(c._t); c.classList.remove("on"); const at = appXY(c);
    if (c.dataset.logo){ st.hits++; Sound.hit(); FX.burst(at.x, at.y, 14, ["#ceff66", "#89f240", "#ffffff"], 4); FX.float("+1", at.x, at.y); upd(); if (st.hits >= GOAL) end(true); }
    else { Sound.deny(); st.t0 -= 2000; FX.float("-2s", at.x, at.y); say(LINES.arcadeMiss, 1400); }
  }));
  function end(win){
    halt(); $("#ar-over").hidden = false;
    const first = win && finishGame(r, appXY(box)); $("#ar-start").disabled = first;
    $("#ar-start").innerHTML = first ? `${icon("i-check")}${L("Geschafft!", "Done!")}` : `${icon("i-play")}${L("Noch mal", "Play again")}`;
    if (!win){ Sound.deny(); say(LINES.arcadeFail, 3000); }
  }
  $("#ar-start").addEventListener("click", start);
}
/* ---------- Spiel: Klang-Melodie (Teestube) ---------- */
const CRYSTALS = [
  { col: "#b07aff", f: 392, name: L("Violetter Klangstein", "Violet sound stone") },
  { col: "#6af0ff", f: 494, name: L("Türkiser Klangstein", "Turquoise sound stone") },
  { col: "#ceff66", f: 587, name: L("Grüner Klangstein", "Green sound stone") },
  { col: "#ff9a5c", f: 659, name: L("Oranger Klangstein", "Orange sound stone") }
];
function simonHTML(r){
  return `${heroHTML(r, canReplay(r) ? L("Die Klangsteine schweigen zufrieden. Noch eine Melodie?", "The sound stones fall silent, satisfied. Another melody?") : L("Schau zu, welche Klangsteine aufleuchten, und tipp sie danach in derselben Reihenfolge an. Drei Runden.", "Watch which sound stones light up, then tap them in the same order. Three rounds."))}
  <div class="room-body">
    <div class="simon" id="simon">
      ${CRYSTALS.map((c, i) => `<button class="cry" data-i="${i}" style="--c:${c.col}" aria-label="${c.name}"><svg viewBox="0 0 60 80" aria-hidden="true"><path d="M30 3 L55 30 L30 77 L5 30 Z"/><path class="ln" d="M30 3 V77 M5 30 H55 M17 30 L30 3 L43 30"/></svg></button>`).join("")}
      <div class="g-over" id="si-over"><button class="btn" id="si-start">${icon("i-play")}Start</button></div>
    </div>
    <div class="g-bar"><span class="pixel" id="si-info">${L("Runde", "Round")} 1/3</span><button class="btn ghost sm" id="si-sound"></button></div>
  </div>`;
}
function wireSimon(r){
  const box = $("#simon"), btns = $$(".cry", box), ROUNDS = [3, 4, 5];
  let st = null, alive = true, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(() => { if (alive) fn(); }, ms));
  gameStop = () => { alive = false; timers.forEach(clearTimeout); };
  const flash = (i, ms = 420) => { btns[i].classList.add("lit"); Sound.tone(CRYSTALS[i].f, ms / 1000, "triangle", .12); later(() => btns[i].classList.remove("lit"), ms); };
  const info = () => $("#si-info").textContent = `${L("Runde", "Round")} ${st.round + 1}/${ROUNDS.length} · ${ROUNDS[st.round]} ${L("Töne", "notes")}`;
  function start(){
    $("#si-over").hidden = true; timers.forEach(clearTimeout); timers = [];
    st = { seq: Array.from({ length: ROUNDS[ROUNDS.length - 1] }, () => Math.floor(Math.random() * 4)), round: 0, input: [], busy: true };
    play();
  }
  function play(){
    st.busy = true; st.input = []; info(); box.classList.add("watch");
    const n = ROUNDS[st.round];
    for (let k = 0; k < n; k++) later(() => flash(st.seq[k]), 700 + k * 650);
    later(() => { st.busy = false; box.classList.remove("watch"); }, 700 + n * 650);
  }
  btns.forEach((b, i) => b.addEventListener("click", () => {
    if (!st || st.busy) return;
    flash(i, 260); const k = st.input.length; st.input.push(i);
    if (st.seq[k] !== i){
      st.busy = true; Sound.deny(); box.classList.remove("bad"); void box.offsetWidth; box.classList.add("bad");
      say(LINES.simonBad, 2200); later(play, 1400); return;
    }
    if (st.input.length < ROUNDS[st.round]) return;
    st.busy = true; const at = appXY(box), its = roomItems(r);
    if (st.round < ROUNDS.length - 1){
      if (grant(its[st.round].id, at)) refreshTally(r); else Sound.find();
      say(LINES.simonRound, 1800);
      st.round++; later(play, 1200);
    } else later(() => { const first = finishGame(r, at); $("#si-over").hidden = false; $("#si-start").disabled = first; $("#si-start").innerHTML = first ? `${icon("i-check")}${L("Geschafft!", "Done!")}` : `${icon("i-play")}${L("Noch mal", "Play again")}`; }, 450);
  }));
  // Ohne Ton ist die Melodie schwer: Sound-Effekte hier direkt an/aus
  const sndBtn = $("#si-sound"), sndLabel = () => { sndBtn.innerHTML = `${icon(S.sound ? "i-sound" : "i-mute")}${S.sound ? L("Sound an", "Sound on") : L("Sound einschalten", "Turn sound on")}`; sndBtn.classList.toggle("on", S.sound); };
  sndBtn.addEventListener("click", () => { Sound.set(!S.sound); sndLabel(); }); sndLabel();
  $("#si-start").addEventListener("click", start);
}

/* ---------- Zeitreiseportal (Portalraum) ---------- */
const pwNorm = s => String(s).toUpperCase().replace(/[^A-Z0-9]/g, "");
const portalReady = r => ({ seen: unlockReady(r), parts: allParts(), pw: !!S.mission });
function portalHTML(r){
  const s = portalReady(r), canPw = s.seen && s.parts, miss = missingParts(), have = CONTENT.portalParts.length - miss.length;
  const row = (ok, txt) => `<li class="${ok ? "ok" : ""}">${icon(ok ? "i-check" : "i-lock")}<span>${txt}</span></li>`;
  return `${heroHTML(r, L("Das Zeitreiseportal summt. Sind alle drei Bedingungen erfüllt, kannst du hindurchgehen.", "The time travel portal hums. Once all three conditions are met, you can step through."))}
  <div class="room-body">
    <div class="card portal-card">
      <p class="eyebrow">${L("Portal-Status", "Portal status")}</p>
      <ul class="checks">
        ${row(s.seen, L(`Alle Bilder (${seenCount(r)}/${r.gallery.length}) und Zeitsplitter (${hintCount(r)}/${hintTotal(r)}) im Portalraum`, `All pictures (${seenCount(r)}/${r.gallery.length}) and time shards (${hintCount(r)}/${hintTotal(r)}) in the portal room`))}
        ${row(s.parts, s.parts ? L(`Alle ${have} Portalteile eingesetzt`, `All ${have} portal parts inserted`) : L(`Portalteile ${have}/${CONTENT.portalParts.length} – es fehlen: ${esc(miss.join(", "))}`, `Portal parts ${have}/${CONTENT.portalParts.length} – missing: ${esc(miss.join(", "))}`))}
        ${row(s.pw, L("Portalcode eingegeben", "Portal code entered"))}
      </ul>
      ${s.pw ? "" : `<form id="pw-form" class="pw" autocomplete="off">
        <label class="eyebrow" for="pw-in">${L("Portalcode", "Portal code")}</label>
        <p class="small pw-hint" style="margin:0">${L("Die letzte Prüfung: Den Portalcode findest du in der Bildunterschrift des 2. angepinnten Beitrags auf meinem Instagram-Profil.", "The final test: you'll find the portal code in the caption of the 2nd pinned post on my Instagram profile.")}</p>
        <div class="row"><input id="pw-in" class="pw-in" spellcheck="false" autocapitalize="characters" autocomplete="off" ${canPw ? "" : "disabled"}><button class="btn" type="submit" ${canPw ? "" : "disabled"}>${L("Eingeben", "Enter")}</button></div>
        <p class="small" style="margin:0"><a class="pw-link" href="${CONTENT.instagram}" target="_blank" rel="noopener">${icon("i-play")}${L("Zu meinem Instagram-Profil", "To my Instagram profile")}</a></p>
        <p class="msg bad" role="status" id="pw-msg"></p>
      </form>`}
      <div class="row"><button class="btn" id="go-portal" ${s.seen && s.parts && s.pw ? "" : "disabled"}>${icon("i-hourglass")}${L("Durchs Portal gehen", "Step through the portal")}</button></div>
    </div>
  </div>`;
}
function wirePortal(r){
  const f = $("#pw-form");
  if (f) f.addEventListener("submit", e => {
    e.preventDefault(); const inp = $("#pw-in");
    if (pwNorm(inp.value) === pwNorm(CONTENT.missionCode)){
      S.mission = true; save(); const at = appXY(inp);
      FX.burst(at.x, at.y, 50, ["#6af0ff", "#b07aff", "#ceff66", "#ffffff"], 7); Sound.win(); addScore(CONTENT.points.mission, at);
      renderRoom(); say(LINES.missionOk);
    } else {
      Sound.deny(); $("#pw-msg").textContent = L("Falscher Portalcode.", "Wrong portal code.");
      inp.classList.remove("bad"); void inp.offsetWidth; inp.classList.add("bad"); say(LINES.missionBad, 3600);
    }
  });
  $("#go-portal")?.addEventListener("click", () => enterPortal(r));
}
function enterPortal(r){
  const s = portalReady(r); if (!(s.seen && s.parts && s.pw)) return;
  const first = !solved(r); grant(roomItems(r)[0].id); if (first) addScore(CONTENT.points.solve);
  Sound.noise(1.4, .16, 1800); Sound.tone(180, 1.4, "sine", .08, 4);
  showEnding();
}

/* ---------- Abspann ---------- */
function showEnding(){
  stopLight(); clearTimeout(backT);
  const pics = CONTENT.rooms.flatMap(r => r.gallery.map(g => g.image)).filter(Boolean);
  for (let i = pics.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [pics[i], pics[j]] = [pics[j], pics[i]]; }
  const per = 6, col = k => { const list = Array.from({ length: per }, (_, i) => pics[(k * per + i) % pics.length]);
    return `<div class="end-col${k % 2 ? " rev" : ""}" style="animation-duration:${70 + k * 11}s">${list.concat(list).map(src => `<img src="${esc(src)}" alt="">`).join("")}</div>`; };
  const el = $("#ending");
  el.innerHTML = `
    <div class="end-wall" aria-hidden="true">${[0, 1, 2, 3].map(col).join("")}</div>
    <div class="end-shade" aria-hidden="true"></div>
    <div class="end-text">
      <p class="el pixel" style="--d:.3s">${L("Zeitsprung abgeschlossen", "Time jump complete")}</p>
      <h2 class="el end-big" style="--d:1.1s">${L("Herzlichen Glückwunsch!", "Congratulations!")}</h2>
      <p class="el" style="--d:2.2s">${L(`Du hast ${esc(CONTENT.story.friend)} erfolgreich durchs Portal verfolgt. Wird es dir auch gelingen, ihn zu retten?`, `You successfully followed ${esc(CONTENT.story.friend)} through the portal. Will you also manage to rescue him?`)}</p>
      <p class="el end-thanks" style="--d:3s">${L("Danke fürs Spielen!", "Thanks for playing!")}</p>
      <div class="el end-credit" style="--d:4s"><span class="eyebrow">${L("Ein Spiel von", "A game by")}</span><b>René · Ujio the Turtle Samurai</b></div>
      <div class="el end-credit" style="--d:4.9s"><span class="eyebrow">${L("Fotos, Cosplays & Ideen", "Photos, cosplays & ideas")}</span><b>Ujio the Turtle Samurai</b></div>
      <p class="el pixel end-score" style="--d:5.8s">${L("Deine Punkte", "Your score")}: ${pad6(S.score)}</p>
      <p class="el end-tbc" style="--d:7.1s">To be continued …</p>
      <p class="el end-bit" style="--d:8.2s">Back in Time</p>
      <div class="el row end-btns" style="--d:9.3s"><button class="btn" id="end-map">${L("Zurück zur Karte", "Back to the map")}</button><a class="btn ghost" href="${CONTENT.instagram}" target="_blank" rel="noopener">Instagram</a>${STANDALONE ? `<a class="btn ghost" href="${HOME_URL}">${L("Zur Homepage", "Homepage")}</a>` : ""}</div>
    </div>`;
  el.hidden = false; $("#guide").hidden = true; Sound.levelup();
  $("#end-map").addEventListener("click", () => { el.hidden = true; el.innerHTML = ""; returnTo3D = false; openMap(); });
}

/* ---------- Geschichte & Anleitung (beim ersten Einsteigen, später im Dojo) ---------- */
function showStory(onDone){
  const el = $("#story"), pages = CONTENT.story.pages; let k = 0;
  const render = () => {
    const p = pages[k], last = k === pages.length - 1;
    el.innerHTML = `<div class="in card">
      <div class="st-dots">${pages.map((_, i) => `<i class="${i === k ? "on" : ""}"></i>`).join("")}</div>
      ${icon(p.icon, "st-ico")}<h2>${esc(p.title)}</h2>
      ${p.text ? `<p class="lead">${esc(p.text)}</p>` : ""}
      ${p.list ? `<ol class="st-list">${p.list.map(s => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}
      <div class="row">${k ? `<button class="btn ghost" id="st-back">${icon("i-back")}${L("Zurück", "Back")}</button>` : ""}<button class="btn" id="st-next">${last ? L("Los geht's!", "Let's go!") : L("Weiter", "Next")}</button></div></div>`;
    $("#st-next").focus();
    $("#st-next").addEventListener("click", () => { Sound.blip(); if (last){ el.hidden = true; el.innerHTML = ""; if (onDone) onDone(); } else { k++; render(); } });
    $("#st-back")?.addEventListener("click", () => { Sound.blip(); k--; render(); });
  };
  $("#guide").hidden = true; el.hidden = false; render();
}