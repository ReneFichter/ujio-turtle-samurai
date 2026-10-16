// Kanalkarte mit Spielfigur.

/* ---------- Kanalkarte ---------- */
function openMap(){ renderMap(); show("s-map"); }
function renderMap(){
  $("#map-bar").style.width = (total() / PROGRESS_MAX * 100) + "%";
  $("#map-found").textContent = `${shardsFound()}/${SHARD_MAX} ${L("Zeitsplitter", "time shards")} · ${partsFound()}/${CONTENT.portalParts.length} ${L("Portalteile", "portal parts")}`;
  $("#map-open").textContent = `${CONTENT.rooms.filter(isOpen).length}/${CONTENT.rooms.length} ${L("Kammern offen", "chambers open")}`;
  let s = `<defs>
    <pattern id="brick" width="20" height="12" patternUnits="userSpaceOnUse"><rect width="20" height="12" fill="#2a3440"/><path d="M0 .5H20M0 6.5H20M5 0V6M15 6V12" stroke="#151b22" stroke-width="1.2"/></pattern>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="pool"><stop offset="0" stop-color="#89f240" stop-opacity=".35"/><stop offset="1" stop-color="#89f240" stop-opacity="0"/></radialGradient>
  </defs>`;
  CONTENT.edges.forEach(e => { s += `<path d="${e.d}" fill="none" stroke="#05080b" stroke-width="38" stroke-linejoin="round" stroke-linecap="round" ${e.secret && !isOpen(ROOM[e.to]) ? 'opacity=".5"' : ""}/>`; });
  CONTENT.edges.forEach(e => { if (e.secret && !isOpen(ROOM[e.to])) return; s += `<path d="${e.d}" fill="none" stroke="url(#brick)" stroke-width="32" stroke-linejoin="round" stroke-linecap="round"/>`; });
  CONTENT.edges.forEach(e => { s += `<path d="${e.d}" fill="none" stroke="#0a1015" stroke-width="${e.secret && !isOpen(ROOM[e.to]) ? 14 : 22}" stroke-linejoin="round" stroke-linecap="round"/>`; });
  CONTENT.edges.forEach(e => {
    const on = isOpen(ROOM[e.to]);
    if (on) s += `<path id="tun-${e.to}" d="${e.d}" fill="none" stroke="#00a676" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" filter="url(#glow)"/>
                  <path d="${e.d}" class="t-shimmer" fill="none" stroke="#ceff66" stroke-opacity=".8" stroke-width="2" stroke-dasharray="6 18" stroke-linecap="round"/>`;
    else s += `<path id="tun-${e.to}" d="${e.d}" fill="none" stroke="${e.secret ? "#8b5fbf" : "#3a434d"}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" ${e.secret ? 'filter="url(#glow)"' : ""}/>`;
  });
  // Tropfen
  const R = rng(5);
  CONTENT.edges.forEach((e, k) => { if (!isOpen(ROOM[e.to])) return; const m = e.d.match(/H(\d+)/), y = +e.d.match(/V(\d+)/)[1]; const x0 = Math.min(+m[1], +e.d.split(" ")[0].slice(1)), x1 = Math.max(+m[1], +e.d.split(" ")[0].slice(1));
    for (let i = 0; i < 2; i++) s += `<circle class="drip" cx="${(x0 + 20 + R() * Math.max(10, x1 - x0 - 40)).toFixed(0)}" cy="${y - 13}" r="2" fill="#ceff66" style="animation-delay:${(R() * 2.8).toFixed(2)}s"/>`; });
  // Einstieg
  const st = CONTENT.start;
  s += `<g transform="translate(${st.x} ${st.y})"><ellipse rx="26" ry="11" fill="#0b1410" stroke="#89f240" stroke-width="2" filter="url(#glow)"/><path d="M-16 -3H16M-18 2H18" stroke="#3c4a3c" stroke-width="2"/></g>
        <text x="${st.x + 36}" y="${st.y + 4}" font-family="Silkscreen, monospace" font-size="9" fill="#a9b7c9">${L("EINSTIEG", "ENTRANCE")}</text>`;
  // Kammern
  const kindIcon = { Toyshot: "i-camera", Cosplay: "i-hammer", Videos: "i-film", Finale: "i-hourglass" };
  CONTENT.rooms.forEach(r => {
    const o = isOpen(r), d = solved(r), secretHidden = r.secret && !o;
    const cls = d ? "solved" : o ? "open" : "locked";
    const col = d ? "#00a676" : o ? "#ceff66" : secretHidden ? "#8b5fbf" : "#ff6b35";
    const status = d ? L("Gelöst", "Solved") : o ? (unlockReady(r) ? (r.game === "portal" ? "Portal!" : L("Spezialbild!", "Special picture!")) : `${seenCount(r)}/${r.gallery.length} ${L("Bilder", "pics")} · ${hintCount(r)}/${hintTotal(r)} ${L("Splitter", "shards")}`) : secretHidden ? L("Versiegelt", "Sealed") : L("Verschüttet", "Blocked");
    const g = d ? "i-check" : o ? kindIcon[r.kind] : "i-lock";
    const right = r.x < 180, lx = right ? r.x + 40 : r.x - 40, anchor = right ? "start" : "end";
    const name = secretHidden ? "???" : (r.mapName || r.name);
    s += `<g class="node ${cls}" data-room="${r.id}" tabindex="0" role="button" aria-label="${esc(name)}, ${r.kind}, ${status}">
      <g transform="translate(${r.x} ${r.y})">
        <circle class="halo" r="46" fill="url(#pool)"/>
        <path d="M-27 24 V-4 A27 27 0 0 1 27 -4 V24 Z" fill="url(#brick)" stroke="#05080b" stroke-width="3"/>
        <path class="door-in" d="M-19 24 V-2 A19 19 0 0 1 19 -2 V24 Z" fill="#05090c"/>
        <path class="door-line" d="M-19 24 V-2 A19 19 0 0 1 19 -2 V24" fill="none" stroke="${col}" stroke-width="2.4" filter="url(#glow)" ${secretHidden ? 'stroke-dasharray="4 4"' : ""}/>
        ${!o && !secretHidden ? `<path d="M-12 24V0M-4 24V-6M4 24V-6M12 24V0" stroke="#ff6b35" stroke-opacity=".5" stroke-width="1.5"/>` : ""}
        <svg x="-10" y="-6" width="20" height="20" style="color:${col}"><use href="#${secretHidden ? "i-lock" : g}"/></svg>
        <path d="M-30 24 H30" stroke="#05080b" stroke-width="4"/>
      </g>
      <text x="${lx}" y="${r.y - 2}" text-anchor="${anchor}" font-family="Bebas Neue, sans-serif" font-size="23" fill="${o ? "#f4f7f8" : "#7d8896"}" letter-spacing=".5">${esc(name)}</text>
      <text x="${lx}" y="${r.y + 14}" text-anchor="${anchor}" font-family="Silkscreen, monospace" font-size="8.5" fill="${col}">${secretHidden ? "???" : r.kind} · ${status}</text>
    </g>`;
  });
  const p = posOf(S.pos);
  s += `<g id="player" transform="translate(${p.x} ${p.y})" pointer-events="none"><g transform="translate(0 -30)"><g class="hexp">
      <ellipse cx="0" cy="-8" rx="18" ry="28" fill="#ceff66" opacity=".3" filter="url(#glow)"/>
      <image href="img/ujio-1p.png" x="-15.5" y="-36" width="31" height="55"/>
      <path d="M-4 20 L0 25 L4 20 Z" fill="#ceff66"/></g></g></g>`;
  $("#map").innerHTML = s;
  // Glühwürmchen
  $$(".mote", $("#map-wrap")).forEach(m => m.remove());
  if (!reduced) for (let i = 0; i < 12; i++){ const m = document.createElement("span"); m.className = "mote"; m.style.left = (5 + Math.random() * 90) + "%"; m.style.top = (20 + Math.random() * 75) + "%"; m.style.animationDelay = (Math.random() * 9).toFixed(1) + "s"; $("#map-wrap").appendChild(m); }
}
function posOf(id){ return id === "start" ? CONTENT.start : ROOM[id]; }
function chain(id){ const out = [id]; while (id !== "start"){ id = EDGE[id].from; out.push(id); } return out; }
let walking = false;
function walkTo(target, done){
  if (S.pos === target || reduced){ S.pos = target; save(); done(); return; }
  const up = chain(S.pos), down = chain(target), lca = up.find(n => down.includes(n));
  const segs = [];
  for (const n of up){ if (n === lca) break; segs.push({ id: n, rev: true }); }
  const downPart = []; for (const n of down){ if (n === lca) break; downPart.push({ id: n, rev: false }); }
  segs.push(...downPart.reverse());
  const pl = $("#player"); walking = true;
  const lens = segs.map(s => $("#tun-" + s.id).getTotalLength()), totalLen = lens.reduce((a, b) => a + b, 0);
  const dur = Math.min(1700, Math.max(500, totalLen * 2.6)); let t0 = null, lastStep = 0;
  const tick = t => {
    if (!t0) t0 = t; const k = Math.min(1, (t - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    let d = e * totalLen, i = 0; while (i < segs.length - 1 && d > lens[i]){ d -= lens[i]; i++; }
    const path = $("#tun-" + segs[i].id), L = lens[i], pt = path.getPointAtLength(segs[i].rev ? L - d : d);
    pl.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    if (t - lastStep > 140){ Sound.step(); lastStep = t; }
    if (k < 1) requestAnimationFrame(tick); else { walking = false; S.pos = target; save(); setTimeout(done, 120); }
  };
  requestAnimationFrame(tick);
}
function onNode(e){
  const g = e.target.closest(".node"); if (!g || walking) return;
  const r = ROOM[g.dataset.room];
  if (!isOpen(r)){
    Sound.deny(); g.classList.remove("shake"); void g.getBBox(); g.classList.add("shake");
    say(r.secret ? LINES.lockedSecret : LINES.locked(ROOM[r.requires].name)); return;
  }
  walkTo(r.id, () => World.open(r.id));
}
$("#map").addEventListener("click", onNode);
$("#map").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); onNode(e); } });
