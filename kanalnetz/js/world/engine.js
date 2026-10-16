// 3D: Kamera, Steuerung, Kollision, Bildansicht und Bau-Helfer für die Räume.

/* ---------- Welt ---------- */
const World = {
  r: null, scene: null, cam: null, roomId: null, raf: 0, last: 0, active: false, locked: false, lowres: true,
  pos: { x: 0, z: 0 }, yaw: 0, pitch: 0, keys: {}, joy: { x: 0, y: 0 }, solids: [], inter: [], anims: [], focus: null, bobT: 0, stepT: 0, backTo: null,

  ensure(){
    if (window.THREE) return Promise.resolve(true);
    return new Promise(res => {
      const s = document.createElement("script"); s.src = THREE_URL; s.async = true;
      const to = setTimeout(() => res(false), 15000);
      s.onload = () => { clearTimeout(to); res(!!window.THREE); }; s.onerror = () => { clearTimeout(to); res(false); };
      document.head.appendChild(s);
    });
  },
  init(){
    const T = THREE;
    this.r = new T.WebGLRenderer({ canvas: $("#gl"), antialias: false, powerPreference: "low-power" });
    this.cam = new T.PerspectiveCamera(72, 1, .05, 80); this.cam.rotation.order = "YXZ";
    this.bind();
    addEventListener("resize", () => this.resize());
  },
  async open(id){
    const room = ROOM[id]; stopLight(); returnTo3D = false;
    $("#w-title").textContent = room.name; $("#w-kind").textContent = `${L("Kammer", "Chamber")} ${room.no} · ${room.kind}`;
    $("#lightbox").hidden = true; $("#w-panel").hidden = true; $("#w-prompt").hidden = true;
    show("s-3d");
    if (!window.THREE){ $("#w-loading").hidden = false; const ok = await this.ensure(); $("#w-loading").hidden = true; if (!ok){ toast(L("3D konnte nicht geladen werden", "3D could not be loaded")); openRoom(id); return; } }
    try { if (!this.r) this.init(); } catch(e){ toast(L("3D wird hier nicht unterstützt", "3D is not supported here")); openRoom(id); return; }
    const fromJump = !!this.backTo && this.roomId === id;
    if (this.roomId !== id || !this.scene){ this.build(room); this.roomId = id; this.loadPhotos(room); }
    else if (fromJump){ Object.assign(this.pos, { x: this.backTo.x, z: this.backTo.z }); this.yaw = this.backTo.yaw; this.pitch = 0; }
    // Begrüßung beim Betreten (nicht beim Zurückkommen aus einem Bild); gelöste Räume erinnern ans Nochmal-Spielen
    if (this.special) this.paintSpecial(room);
    if (!fromJump) say(wonBefore(room) && room.game !== "portal" ? LINES.replay : (room.walk || room.intro));
    this.backTo = null; this.locked = false;
    this.inter.forEach(it => { it.amp = 0; it.jump = false; });
    this.resize(); this.start(); this.updateSeen();
  },
  start(){ if (this.active) return; this.active = true; this.last = 0; this.keys = {}; this.raf = requestAnimationFrame(t => this.loop(t)); },
  pause(){ this.active = false; cancelAnimationFrame(this.raf); this.keys = {}; this.joy = { x: 0, y: 0 }; const k = $("#joy .knob"); if (k) k.style.transform = ""; },
  resize(){
    if (!this.r) return; const v = $("#view").getBoundingClientRect(); if (!v.width || !v.height) return;
    const H = this.lowres ? 240 : Math.round(v.height * Math.min(2, devicePixelRatio || 1)), W = Math.round(v.width * H / v.height);
    this.r.setPixelRatio(1); this.r.setSize(W, H, false); this.cam.aspect = v.width / v.height; this.cam.updateProjectionMatrix();
    $("#gl").classList.toggle("px", this.lowres);
  },
  clear(){
    if (!this.scene) return;
    this.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material){ (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); } });
    this.scene = null;
  },
  build(room){
    this.clear();
    const T = THREE, w = room.world, sc = new T.Scene(); this.scene = sc;
    sc.background = new T.Color(w.fog); sc.fog = new T.Fog(w.fog, w.near || 2, w.far || 22);
    sc.add(new T.AmbientLight(w.amb, w.ambI || .6));
    this.solids = []; this.inter = []; this.anims = []; this.focus = null; this.special = null;
    const b = makeBuilder(this, sc, room);
    THEMES[w.theme](b, room);
    this.pos = { x: w.spawn[0], z: w.spawn[1] }; this.yaw = w.spawn[2] || 0; this.pitch = 0;
  },
  blocked(x, z){ const r = .32; for (const s of this.solids) if (x + r > s.minX && x - r < s.maxX && z + r > s.minZ && z - r < s.maxZ) return true; return false; },
  loop(t){
    if (!this.active) return;
    this.raf = requestAnimationFrame(tt => this.loop(tt));
    const dt = this.last ? Math.min(.05, (t - this.last) / 1000) : .016; this.last = t; const time = t / 1000;
    const k = this.keys;
    if (!this.locked){
      let f = ((k.w || k.arrowup) ? 1 : 0) - ((k.s || k.arrowdown) ? 1 : 0) + this.joy.y;
      let s = (k.d ? 1 : 0) - (k.a ? 1 : 0) + this.joy.x;
      if (k.arrowleft) this.yaw += dt * 2.2; if (k.arrowright) this.yaw -= dt * 2.2;
      const m = Math.hypot(f, s); if (m > 1){ f /= m; s /= m; }
      if (m > .08){
        const run = k.shift || Math.hypot(this.joy.x, this.joy.y) > .95, sp = (run ? 5 : 3) * dt, sy = Math.sin(this.yaw), cy = Math.cos(this.yaw);
        const dx = (-sy * f + cy * s) * sp, dz = (-cy * f - sy * s) * sp;
        if (!this.blocked(this.pos.x + dx, this.pos.z)) this.pos.x += dx;
        if (!this.blocked(this.pos.x, this.pos.z + dz)) this.pos.z += dz;
        this.bobT += dt * (run ? 13 : 9); this.stepT += dt; if (this.stepT > (run ? .3 : .42)){ this.stepT = 0; Sound.step(); }
      }
    }
    this.cam.position.set(this.pos.x, 1.6 + Math.sin(this.bobT) * .035, this.pos.z);
    this.cam.rotation.x = this.pitch; this.cam.rotation.y = this.yaw;
    for (const a of this.anims) a(time, dt);
    // Fokus: was liegt vor mir?
    if (!this.locked){
      let best = null, bd = 99; const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
      for (const it of this.inter){
        const dx = it.x - this.pos.x, dz = it.z - this.pos.z, d = Math.hypot(dx, dz) || .001;
        if (d > (it.reach || 2.9)) continue;
        if (-dx * it.nx - dz * it.nz < .15) continue;
        if ((dx * fx + dz * fz) / d < (it.cone || .62)) continue;
        if (d < bd){ bd = d; best = it; }
      }
      if (best !== this.focus){ this.focus = best; this.updatePrompt(); }
    }
    // Wellen auf den Bildern (wie beim Berühren eines Gemäldes)
    for (const it of this.inter){
      if (!it.geo) continue;
      const target = it.jump ? .14 : it === this.focus ? .018 : 0; it.amp += (target - it.amp) * Math.min(1, dt * (it.jump ? 3 : 5));
      if (it.amp < .0005 && !it.dirty) continue;
      const a = it.geo.attributes.position.array, base = it.base;
      for (let i = 0; i < a.length; i += 3){ const ux = base[i] / it.w, uy = base[i + 1] / it.h, d = Math.hypot(ux, uy); a[i + 2] = it.amp * (.5 + .5 * Math.sin(d * 20 - time * 9)) * Math.max(0, 1 - d * 1.3); }
      it.geo.attributes.position.needsUpdate = true; it.dirty = it.amp >= .0005;
    }
    this.r.render(this.scene, this.cam);
  },
  updatePrompt(){
    const f = this.focus, p = $("#w-prompt");
    $("#cross").classList.toggle("hot", !!f);
    if (!f){ p.hidden = true; return; }
    let label = { art: L("Bild ansehen", "View picture"), puzzle: L("Ins Bild springen", "Jump into the picture"), cinema: L("Film ab!", "Roll film!"), door: L("Zurück ins Kanalnetz", "Back to the sewer network") }[f.kind];
    if (f.kind === "portal"){
      const r = ROOM[this.roomId], s = portalReady(r), left = (r.gallery.length - seenCount(r)) + (hintTotal(r) - hintCount(r));
      label = !s.seen ? L(`Portal aus · noch ${LINES.missing(r.gallery.length - seenCount(r), hintTotal(r) - hintCount(r))}`, `Portal off · ${LINES.missing(r.gallery.length - seenCount(r), hintTotal(r) - hintCount(r))} to go`)
        : !s.parts ? `Portal · ${partsMissing(missingParts().length)}` : !s.pw ? L("Portal · Portalcode eingeben", "Portal · enter portal code") : L("Durchs Portal gehen", "Step through the portal");
    }
    if (f.kind === "puzzle"){
      const r = ROOM[this.roomId], left = r.gallery.length - seenCount(r);
      label = S.revealed[r.id] ? (wonBefore(r) ? L("Noch mal spielen", "Play again") : L("Ins Bild springen", "Jump into the picture"))
        : unlockReady(r) ? L("Spezialbild freilegen", "Uncover the special picture") : L(`Verhüllt · noch ${LINES.missing(r.gallery.length - seenCount(r), hintTotal(r) - hintCount(r))}`, `Veiled · ${LINES.missing(r.gallery.length - seenCount(r), hintTotal(r) - hintCount(r))} to go`);
    }
    $("#w-act").textContent = f.title && f.kind === "art" ? `${label}: ${f.title}` : label;
    p.hidden = false; p.style.animation = "none"; void p.offsetWidth; p.style.animation = "";
  },
  act(){
    const f = this.focus; if (!f || this.locked || !this.active) return;
    if (f.kind === "art"){ Sound.chime(); Lightbox.open(f); return; }
    if (f.kind === "door"){ // durch die Tür zurück zur Karte
      this.locked = true; $("#w-prompt").hidden = true; Sound.noise(.5, .2, 500); Sound.tone(260, .4, "sine", .06, .5);
      $("#jumpflash").classList.add("go"); setTimeout(() => { $("#jumpflash").classList.remove("go"); this.locked = false; exit3D(); }, reduced ? 10 : 420); return;
    }
    if (f.kind === "puzzle" && !S.revealed[this.roomId]){
      const r = ROOM[this.roomId];
      if (unlockReady(r)) this.peel(f); else { Sound.deny(); say(LINES.covered(r.gallery.length - seenCount(r), hintTotal(r) - hintCount(r)), 3600); }
      return;
    }
    if (f.kind === "portal"){
      const r = ROOM[this.roomId], s = portalReady(r);
      if (!s.seen){ Sound.deny(); say(LINES.portalPics(r.gallery.length - seenCount(r), hintTotal(r) - hintCount(r)), 3600); return; }
      if (!s.parts){ Sound.deny(); say(LINES.noParts(missingParts().join(", ")), 4200); return; }
    }
    this.jump(f);
  },
  // Lampe über dem Bild: rot = noch nicht angesehen, grün = angesehen
  paintLamp(it, room = ROOM[this.roomId]){ if (it.lamp) it.lamp.material.color.setHex(S.seen[`${room.id}:${it.slot}`] ? 0x5aff6a : 0xff3b30); },
  // Zähler oben im Raum: Bilder angesehen + Zeitsplitter gefunden (zwei Anzeigen), darunter was als Nächstes kommt
  updateSeen(){
    const r = ROOM[this.roomId], el = $("#w-seen"); if (!r || !el) return;
    const n = seenCount(r), t = r.gallery.length, h = hintCount(r), ht = hintTotal(r), ready = unlockReady(r);
    const next = !ready ? "" : r.game === "portal" ? (allParts() ? L("Portal offen!", "Portal open!") : `${L("Portal offen", "Portal open")} · ${partsMissing(missingParts().length)}`)
      : S.revealed[r.id] ? L("Spezialbild offen", "Special picture open") : L("Spezialbild freilegen!", "Uncover the special picture!");
    el.innerHTML = `<span class="c${n >= t ? " ok" : ""}">${icon("i-frame")}<b>${n}/${t}</b> ${L("Bilder", "pictures")}</span><span class="c${h >= ht ? " ok" : ""}">${icon("i-crystal")}<b>${h}/${ht}</b> ${L("Zeitsplitter", "time shards")}</span>${next ? `<span class="nx">${next}</span>` : ""}`;
  },
  // Spezialbild: Foto vorladen, Rahmen/Tuch passend zum Fortschritt zeichnen
  loadSpecial(room){
    const it = this.special; if (!it || !room.image) return;
    const img = new Image(); img.onload = () => { it.img = img; if (this.special === it && S.revealed[room.id]) this.paintSpecial(room); }; img.src = room.image;
  },
  paintSpecial(room = ROOM[this.roomId]){
    const it = this.special; if (!it) return;
    const rev = S.revealed[room.id], ready = rev || unlockReady(room);
    it.canvas = rev ? revealCanvas(room, it.img) : clothCanvas(room); it.tex.image = it.canvas; it.tex.needsUpdate = true;
    it.fm.color.setHex(ready ? 0x89f240 : 0x5a5466); it.fm.emissive.setHex(ready ? 0x2a7a10 : 0x120f18); it.gs.visible = ready;
  },
  // Tuch diagonal abziehen, darunter erscheint das Foto
  peel(it){
    this.locked = true; $("#w-prompt").hidden = true;
    const room = ROOM[this.roomId], cloth = clothCanvas(room), [c, g] = pcan(256, 320);
    const under = revealCanvas(room, it.img);
    it.canvas = c; it.tex.image = c; it.jump = true; Sound.noise(1.3, .14, 2600); Sound.tone(220, 1.2, "sine", .06, 3);
    const t0 = performance.now(), D = reduced ? 10 : 1500;
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / D), e = k * k * (3 - 2 * k), d = -20 + e * 552;
      g.clearRect(0, 0, 256, 320); g.drawImage(under, 0, 0);
      if (k < 1){
        g.save(); g.beginPath(); g.moveTo(d, 0); g.lineTo(900, 0); g.lineTo(900, 320); g.lineTo(d - 256, 320); g.closePath(); g.clip(); g.drawImage(cloth, 0, 0); g.restore();
        g.save(); g.strokeStyle = "rgba(206,255,102,.95)"; g.lineWidth = 3; g.shadowColor = "#89f240"; g.shadowBlur = 14; g.beginPath(); g.moveTo(d, 0); g.lineTo(d - 256, 320); g.stroke(); g.restore();
        it.tex.needsUpdate = true; requestAnimationFrame(step); return;
      }
      it.jump = false; S.revealed[room.id] = true; save(); this.paintSpecial(room);
      const at = appXY($("#view")); addScore(CONTENT.points.reveal, at); FX.burst(at.x, at.y, 40, ["#ceff66", "#89f240", "#ffffff"], 6); Sound.win();
      say(LINES.revealed, 3600); this.locked = false; this.focus = null; this.updatePrompt(); this.updateSeen();
    };
    requestAnimationFrame(step);
  },
  jump(f){
    this.locked = true; $("#w-prompt").hidden = true; Sound.noise(.8, .16, 1400); Sound.tone(300, .7, "sine", .08, 3.2);
    const sx = this.pos.x, sz = this.pos.z, ex = f.x + f.nx * .35, ez = f.z + f.nz * .35, sy = this.yaw, ey = Math.atan2(f.nx, f.nz), sp = this.pitch;
    let dy = ey - sy; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
    this.backTo = { x: f.x + f.nx * 2.3, z: f.z + f.nz * 2.3, yaw: ey };
    if (f.geo) f.jump = true;
    const t0 = performance.now(), D = reduced ? 10 : 950;
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / D), e = k * k * (3 - 2 * k);
      this.pos.x = sx + (ex - sx) * e; this.pos.z = sz + (ez - sz) * e; this.yaw = sy + dy * e; this.pitch = sp * (1 - e) + Math.atan2((f.y || 1.6) - 1.6, 1) * e;
      if (k > .55 && !$("#jumpflash").classList.contains("go")) $("#jumpflash").classList.add("go");
      if (k < 1) requestAnimationFrame(step);
      else setTimeout(() => { this.pause(); returnTo3D = true; openRoom(this.roomId, f.kind === "cinema" ? "tv" : null); $("#jumpflash").classList.remove("go");
        // Portal mit allem Nötigen: direkt durch in den Abspann
        if (f.kind === "portal" && portalReady(ROOM[this.roomId]).pw) enterPortal(ROOM[this.roomId]); else if (f.kind === "portal") say(LINES.coreIn, 3600); }, 260);
    };
    requestAnimationFrame(step);
  },
  async applyPhoto(it, src){
    try {
      const c = await coverCanvas(src);
      it.canvas = c; it.url = src; it.own = true; it.tex.image = c; it.tex.needsUpdate = true;
      return true;
    } catch(e){ return false; }
  },
  async loadPhotos(room){
    const arts = this.inter.filter(i => i.kind === "art"), id = room.id;
    // alle Rahmen gleichzeitig laden (bei 10+ Bildern pro Raum spürbar schneller als nacheinander)
    await Promise.all(arts.map(async it => {
      const g = room.gallery[it.slot];
      if (this.roomId === id && g && g.image) await this.applyPhoto(it, g.image);
    }));
  },
  bind(){
    const view = $("#view"); let look = null;
    view.addEventListener("pointerdown", e => { if (this.locked) return; look = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 }; try { view.setPointerCapture(e.pointerId); } catch(_){} });
    view.addEventListener("pointermove", e => {
      if (!look || e.pointerId !== look.id || this.locked) return;
      const dx = e.clientX - look.x, dy = e.clientY - look.y; look.x = e.clientX; look.y = e.clientY; look.moved += Math.abs(dx) + Math.abs(dy);
      this.yaw -= dx * .006; this.pitch = Math.max(-1.1, Math.min(1.1, this.pitch - dy * .0045));
    });
    view.addEventListener("pointerup", e => { if (look && e.pointerId === look.id){ if (look.moved < 8) this.act(); look = null; } });
    view.addEventListener("pointercancel", () => look = null);
    const joy = $("#joy"), knob = $(".knob", joy); let jid = null;
    const upd = e => { const r = joy.getBoundingClientRect(); let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); const m = Math.hypot(dx, dy), R = 46; if (m > R){ dx *= R / m; dy *= R / m; } knob.style.transform = `translate(${dx}px,${dy}px)`; this.joy = { x: dx / R, y: -dy / R }; };
    joy.addEventListener("pointerdown", e => { e.preventDefault(); jid = e.pointerId; try { joy.setPointerCapture(e.pointerId); } catch(_){} upd(e); });
    joy.addEventListener("pointermove", e => { if (e.pointerId !== jid) return; upd(e); if (!$("#lightbox").hidden && Math.hypot(this.joy.x, this.joy.y) > .35) Lightbox.close(); });
    const jend = e => { if (e.pointerId === jid){ jid = null; this.joy = { x: 0, y: 0 }; knob.style.transform = ""; } };
    joy.addEventListener("pointerup", jend); joy.addEventListener("pointercancel", jend);
    addEventListener("keydown", e => {
      if (!this.active || !$("#lightbox").hidden) return;
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift"].includes(k)){ this.keys[k] = true; e.preventDefault(); }
      if ((k === "e" || k === "enter" || k === " ") && !e.target.closest?.("button,input,a")){ e.preventDefault(); this.act(); }
      if (k === "escape"){ if (!$("#w-panel").hidden) $("#w-panel").hidden = true; else exit3D(); }
    });
    addEventListener("keyup", e => { this.keys[e.key.toLowerCase()] = false; });
    addEventListener("blur", () => this.keys = {});
    $("#w-prompt").addEventListener("click", () => this.act());
    $("#w-exit").addEventListener("click", exit3D);
    $("#w-menu").addEventListener("click", () => { $("#guide").hidden = true; $("#w-panel").hidden = !$("#w-panel").hidden; });
    $("#w-panel-x").addEventListener("click", () => $("#w-panel").hidden = true);
    $("#w-res").addEventListener("click", () => { this.lowres = !this.lowres; $("#w-res").textContent = `${L("Retro-Pixel", "Retro pixels")}: ${this.lowres ? L("an", "on") : L("aus", "off")}`; this.resize(); });
  }
};
function exit3D(){ World.pause(); Lightbox.close(true); openMap(); }

/* ---------- Bildansicht ---------- */
const Lightbox = {
  list: [], k: 0,
  open(it){ $("#guide").hidden = true; $("#s-3d").classList.add("lb-open"); this.list = World.inter.filter(i => i.kind === "art"); this.k = Math.max(0, this.list.indexOf(it)); World.locked = true; $("#w-prompt").hidden = true; this.render(); $("#lightbox").hidden = false; },
  close(silent){ this.shardStop(); $("#lightbox").hidden = true; $("#s-3d").classList.remove("lb-open"); World.locked = false; World.focus = null; if (!silent) World.updatePrompt(); },
  render(){
    const it = this.list[this.k], room = ROOM[World.roomId];
    $("#lb-title").textContent = it.title; $("#lb-kind").textContent = room.name;
    $("#lb-count").textContent = `${this.k + 1}/${this.list.length}`;
    $("#lb-img").src = it.own && it.url ? it.url : it.canvas.toDataURL("image/jpeg", .9);
    $("#lb-img").alt = it.title;
    // Jedes Bild zählt einmal; mit dem letzten wird das Spezialbild freilegbar
    const r = ROOM[World.roomId]; if (markSeen(r, it.slot)){ World.paintLamp(it, r); World.updateSeen(); if (unlockReady(r)) World.paintSpecial(r); }
    // Zeitsplitter: wird direkt ins Foto gezeichnet und pulsiert; Antippen der Stelle sammelt ihn ein
    const hint = HINTS[r.id][it.slot]; this.hint = hint && !S.hints[`${r.id}:${it.slot}`] ? hint : null; this.slot = it.slot;
    this.shardStop(); if (this.hint) this.shardStart(it.own && it.url ? it.url : it.canvas);
    // Blättern erst, wenn man jedes Bild im Raum selbst angelaufen hat
    const nav = allSeen(r); $("#lb-prev").hidden = !nav; $("#lb-next").hidden = !nav; $("#lb-count").hidden = !nav;
  },
  shardStop(){ clearInterval(this.shardT); this.shardT = 0; this.shardTok = (this.shardTok || 0) + 1; },
  // Pulsierenden Splitter ins Foto malen: ein paar Leucht-Stufen vorberechnen und reihum anzeigen
  async shardStart(src){
    const tok = this.shardTok, h = this.hint; let base = src;
    try {
      if (typeof src === "string"){ base = new Image(); base.src = src; await base.decode(); }
      if (tok !== this.shardTok) return;
      const bw = base.naturalWidth || base.width, bh = base.naturalHeight || base.height, s = Math.min(1, 900 / Math.max(bw, bh)), W = Math.round(bw * s), H = Math.round(bh * s);
      const frames = (reduced ? [.8] : [0, .25, .55, .85, 1, .85, .55, .25]).map(k => { const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d"); g.drawImage(base, 0, 0, W, H); drawShard(g, h.x * W, h.y * H, Math.max(W, H) * .03, k); return c.toDataURL("image/jpeg", .88); });
      if (tok !== this.shardTok) return;
      let i = 0; const img = $("#lb-img"); img.src = frames[0];
      if (frames.length > 1) this.shardT = setInterval(() => { i = (i + 1) % frames.length; img.src = frames[i]; }, 150);
    } catch(e){ /* Bild nicht lesbar (z. B. direkt per file:// geöffnet) – dann ohne Splitter-Zeichnung */ }
  },
  // Antippen im Foto: fx/fy = Position relativ zum Bild (0–1)
  tryShard(fx, fy, at){
    const h = this.hint; if (!h) return false;
    const b = $("#lb-img").getBoundingClientRect(), dist = Math.hypot((fx - h.x) * b.width, (fy - h.y) * b.height);
    if (dist > Math.max(34, b.width * .09)) return false;
    const r = ROOM[World.roomId], it = this.list[this.k];
    if (!markHint(r, this.slot, at)) return false;
    this.hint = null; this.shardStop(); $("#lb-img").src = it.own && it.url ? it.url : it.canvas.toDataURL("image/jpeg", .9);
    World.updateSeen(); if (unlockReady(r)) World.paintSpecial(r);
    return true;
  },
  go(d){ if (!allSeen(ROOM[World.roomId])) return; this.k = (this.k + d + this.list.length) % this.list.length; Sound.blip(); this.render(); }
};
$("#lb-close").addEventListener("click", () => Lightbox.close());
$("#lb-img").addEventListener("click", e => {
  const b = e.currentTarget.getBoundingClientRect(), a = app.getBoundingClientRect();
  Lightbox.tryShard((e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height, { x: e.clientX - a.left, y: e.clientY - a.top });
});
// Zeitsplitter: leuchtender Kristall mit Lichtschein und Funkeln, k = Pulsstärke 0–1
function drawShard(g, x, y, s, k){
  const rg = g.createRadialGradient(x, y, 0, x, y, s * 3.4); rg.addColorStop(0, `rgba(180,250,255,${.35 + .4 * k})`); rg.addColorStop(1, "rgba(106,240,255,0)");
  g.fillStyle = rg; g.beginPath(); g.arc(x, y, s * 3.4, 0, 7); g.fill();
  g.save(); g.translate(x, y); g.globalAlpha = .6 + .4 * k;
  const cg = g.createLinearGradient(0, -s * 1.6, 0, s * 1.6); cg.addColorStop(0, "#ffffff"); cg.addColorStop(.45, "#9af6ff"); cg.addColorStop(1, "#7a7aff");
  g.fillStyle = cg; g.beginPath(); g.moveTo(0, -s * 1.6); g.lineTo(s * .8, -s * .3); g.lineTo(0, s * 1.6); g.lineTo(-s * .8, -s * .3); g.closePath(); g.fill();
  g.lineWidth = Math.max(1, s * .12); g.strokeStyle = "rgba(255,255,255,.95)"; g.stroke();
  g.beginPath(); g.moveTo(-s * .8, -s * .3); g.lineTo(s * .8, -s * .3); g.moveTo(0, -s * 1.6); g.lineTo(0, s * 1.6); g.strokeStyle = "rgba(255,255,255,.45)"; g.stroke();
  const sl = s * (.8 + 1.2 * k); g.strokeStyle = `rgba(255,255,255,${.3 + .7 * k})`; g.lineWidth = Math.max(1, s * .1);
  g.beginPath(); g.moveTo(s * 1.5 - sl / 2, -s * 1.4); g.lineTo(s * 1.5 + sl / 2, -s * 1.4); g.moveTo(s * 1.5, -s * 1.4 - sl / 2); g.lineTo(s * 1.5, -s * 1.4 + sl / 2); g.stroke();
  g.restore();
}

$("#lb-prev").addEventListener("click", () => Lightbox.go(-1));
$("#lb-next").addEventListener("click", () => Lightbox.go(1));
// Aus dem Bild heraustreten: jede Pfeiltaste oder W/A/S/D (man läuft gleich in die Richtung los), Esc schließt nur.
// Geblättert wird über die Pfeil-Knöpfe auf dem Bildschirm.
addEventListener("keydown", e => {
  if ($("#lightbox").hidden) return; const k = e.key.toLowerCase();
  if (k === "escape"){ e.preventDefault(); e.stopImmediatePropagation(); Lightbox.close(); }
  else if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(k)){ e.preventDefault(); Lightbox.close(); }
}, true);
{ let sy = null; const lb = $("#lightbox");
  let sx = null;
  lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", e => { if (sy !== null && Math.hypot(e.changedTouches[0].clientX - sx, e.changedTouches[0].clientY - sy) > 70) Lightbox.close(); sx = sy = null; }); }

/* ---------- Bau-Helfer ---------- */
function makeBuilder(W, sc, room){
  const T = THREE, glowT = new T.CanvasTexture(PX.get("glow"));
  const tex = (key, rx = 1, ry = 1) => { const t = new T.CanvasTexture(PX.get(key)); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); t.magFilter = T.NearestFilter; t.minFilter = T.NearestFilter; t.generateMipmaps = false; return t; };
  const lam = (key, rx, ry, o = {}) => new T.MeshLambertMaterial(Object.assign(key ? { map: tex(key, rx, ry) } : {}, o));
  const col = (c, o = {}) => new T.MeshLambertMaterial(Object.assign({ color: c }, o));
  const add = m => { sc.add(m); return m; };
  const solid = (x0, x1, z0, z1) => W.solids.push({ minX: Math.min(x0, x1), maxX: Math.max(x0, x1), minZ: Math.min(z0, z1), maxZ: Math.max(z0, z1) });
  const box = (w, h, d, mat, x, y, z, sol) => { const m = add(new T.Mesh(new T.BoxGeometry(w, h, d), mat)); m.position.set(x, y, z); if (sol) solid(x - w / 2, x + w / 2, z - d / 2, z + d / 2); return m; };
  const plane = (w, h, mat, x, y, z, rx = 0, ry = 0) => { const m = add(new T.Mesh(new T.PlaneGeometry(w, h), mat)); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); return m; };
  const cyl = (rt, rb, h, seg, mat, x, y, z, sol) => { const m = add(new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), mat)); m.position.set(x, y, z); if (sol) solid(x - sol, x + sol, z - sol, z + sol); return m; };
  const glow = (x, y, z, c, size, flick) => { const s = new T.Sprite(new T.SpriteMaterial({ map: glowT, color: c, blending: T.AdditiveBlending, transparent: true, depthWrite: false })); s.position.set(x, y, z); s.scale.set(size, size, 1); add(s); if (flick) W.anims.push(t => { s.material.opacity = .78 + Math.sin(t * flick + x * 3) * .14 + Math.random() * .08; }); return s; };
  const light = (c, i, dist, x, y, z) => { const l = new T.PointLight(c, i, dist, 1.6); l.position.set(x, y, z); return add(l); };
  const shell = (x0, x1, z0, z1, h, fk, wk, ck, o = {}) => {
    const w = x1 - x0, d = z0 - z1, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, fs = o.fs || 2, ws = o.ws || 2, cs = o.cs || 2;
    const wm = (a, b) => o.wallBasic ? new T.MeshBasicMaterial({ map: tex(wk, a, b), color: o.wallBasic }) : lam(wk, a, b);
    plane(w, d, lam(fk, w / fs, d / fs), cx, 0, cz, -Math.PI / 2, 0);
    if (ck) plane(w, d, lam(ck, w / cs, d / cs), cx, h, cz, Math.PI / 2, 0);
    plane(d, h, wm(d / ws, h / ws), x0, h / 2, cz, 0, Math.PI / 2);
    plane(d, h, wm(d / ws, h / ws), x1, h / 2, cz, 0, -Math.PI / 2);
    plane(w, h, wm(w / ws, h / ws), cx, h / 2, z1, 0, 0);
    plane(w, h, wm(w / ws, h / ws), cx, h / 2, z0, 0, Math.PI);
    solid(x0 - 1, x0, z1 - 1, z0 + 1); solid(x1, x1 + 1, z1 - 1, z0 + 1); solid(x0 - 1, x1 + 1, z1 - 1, z1); solid(x0 - 1, x1 + 1, z0, z0 + 1);
  };
  const frameOn = (x, y, z, ry, w, h, canvas, o) => {
    const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry; add(g);
    const fm = o.puzzle ? new T.MeshLambertMaterial({ color: 0x89f240, emissive: 0x2a7a10 }) : lam(o.frame || "gold", 1, 1);
    const fr = new T.Mesh(new T.BoxGeometry(w + .2, h + .2, .08), fm); fr.position.z = -.01; g.add(fr);
    const geo = new T.PlaneGeometry(w, h, 10, 12), base = Float32Array.from(geo.attributes.position.array);
    const tx = new T.CanvasTexture(canvas); tx.minFilter = T.LinearFilter; tx.magFilter = T.LinearFilter; tx.generateMipmaps = false;
    const pl = new T.Mesh(geo, new T.MeshBasicMaterial({ map: tx, color: o.puzzle ? 0xffffff : 0xe6e6e6 })); pl.position.z = .04; g.add(pl);
    const lamp = new T.Mesh(new T.BoxGeometry(.5, .05, .12), col(0x222222)); lamp.position.set(0, h / 2 + .2, .08); g.add(lamp);
    const it = { kind: o.kind, x, y, z, nx: Math.sin(ry), nz: Math.cos(ry), w, h, geo, base, amp: 0, tex: tx, canvas, slot: o.slot, title: o.title, own: false, url: null };
    if (o.puzzle){ it.reach = 3.8; it.fm = fm; it.gs = glow(x + it.nx * .25, y, z + it.nz * .25, 0x89f240, 3.4); } else it.lamp = glow(x + it.nx * .12, y + h / 2 + .32, z + it.nz * .12, 0xffe2a0, .7);
    if (o.puzzle) W.anims.push(t => { fm.emissiveIntensity = .7 + Math.sin(t * 3) * .35; });
    W.inter.push(it); return it;
  };
  const gallery = slots => slots.forEach((s, i) => { const g = room.gallery[i]; if (!g) return; const it = frameOn(s[0], s[1], s[2], s[3], .92, 1.15, artCanvas(room, i, g.title), { kind: "art", slot: i, title: g.title, frame: room.world.frame }); W.paintLamp(it, room); });
  const puzzle = (x, y, z, ry) => { const it = frameOn(x, y, z, ry, 1.3, 1.62, clothCanvas(room), { kind: "puzzle", puzzle: true, title: L("Spezialbild", "Special picture") }); W.special = it; W.paintSpecial(room); W.loadSpecial(room); return it; };
  const spot = (kind, x, y, z, nx, nz, o = {}) => { const it = Object.assign({ kind, x, y, z, nx, nz }, o); W.inter.push(it); return it; };
  // Ausgangstür zurück ins Kanalnetz (zur Karte): grüne Metalltür mit Bullauge, leuchtendes Schild darüber
  const door = (x, z, ry) => {
    const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; add(g);
    const [dc, dg] = pcan(64, 128);
    dg.fillStyle = "#1d4a3c"; dg.fillRect(0, 0, 64, 128); dg.fillStyle = "#163a2f"; dg.fillRect(4, 4, 56, 120);
    dg.strokeStyle = "#0b2219"; dg.lineWidth = 2; dg.strokeRect(6, 62, 52, 58);
    dg.fillStyle = "#9fb8ac"; for (const [rx, ry2] of [[8, 8], [56, 8], [8, 120], [56, 120], [8, 64], [56, 64]]) dg.fillRect(rx - 1, ry2 - 1, 3, 3);
    dg.fillStyle = "#0b2219"; dg.beginPath(); dg.arc(32, 34, 15, 0, 7); dg.fill(); dg.fillStyle = "#6af0ff"; dg.globalAlpha = .55; dg.beginPath(); dg.arc(32, 34, 11, 0, 7); dg.fill(); dg.globalAlpha = 1;
    dg.fillStyle = "#ceff66"; dg.fillRect(4, 84, 56, 5); dg.fillStyle = "#c9a043"; dg.fillRect(48, 70, 7, 3);
    const dt = new T.CanvasTexture(dc); dt.magFilter = T.NearestFilter; dt.minFilter = T.NearestFilter; dt.generateMipmaps = false;
    const fr = new T.Mesh(new T.BoxGeometry(1.42, 2.42, .1), col(0x2a3034)); fr.position.set(0, 1.21, 0); g.add(fr);
    const pn = new T.Mesh(new T.PlaneGeometry(1.16, 2.2), new T.MeshLambertMaterial({ map: dt })); pn.position.set(0, 1.12, .06); g.add(pn);
    const [sc, sg] = pcan(256, 48); sg.fillStyle = "#05120c"; sg.fillRect(0, 0, 256, 48); sg.strokeStyle = "#89f240"; sg.lineWidth = 3; sg.strokeRect(3, 3, 250, 42);
    sg.fillStyle = "#ceff66"; sg.font = '30px "Bebas Neue", Impact, sans-serif'; sg.textAlign = "center"; sg.shadowColor = "#89f240"; sg.shadowBlur = 10; sg.fillText(L("◄ ZUM KANALNETZ", "◄ TO THE SEWERS"), 128, 34);
    const sn = new T.Mesh(new T.PlaneGeometry(1.5, .28), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sc) })); sn.position.set(0, 2.62, .07); g.add(sn);
    const nx = Math.sin(ry), nz = Math.cos(ry);
    glow(x + nx * .3, 2.62, z + nz * .3, 0x89f240, 1.3);
    W.inter.push({ kind: "door", x: x + nx * .1, y: 1.3, z: z + nz * .1, nx, nz, reach: 2.6, cone: .5, title: L("Ausgang", "Exit") });
  };
  const drips = (n, x0, x1, z0, z1, top, c) => { for (let i = 0; i < n; i++){ const s = glow(0, 0, 0, c, .18); const d = { x: x0 + Math.random() * (x1 - x0), z: z0 + Math.random() * (z1 - z0), y: Math.random() * top, v: 0 }; W.anims.push((t, dt) => { d.v += dt * 9; d.y -= d.v * dt; if (d.y < 0){ d.y = top; d.v = 0; d.x = x0 + Math.random() * (x1 - x0); d.z = z0 + Math.random() * (z1 - z0); } s.position.set(d.x, d.y, d.z); }); } };
  const motes = (n, x0, x1, y0, y1, z0, z1, c, size = .08, speed = .15) => { for (let i = 0; i < n; i++){ const s = glow(0, 0, 0, c, size); const p = { x: x0 + Math.random() * (x1 - x0), y: y0 + Math.random() * (y1 - y0), z: z0 + Math.random() * (z1 - z0), ph: Math.random() * 7 }; W.anims.push((t, dt) => { p.y += dt * speed; if (p.y > y1) p.y = y0; s.position.set(p.x + Math.sin(t * .7 + p.ph) * .3, p.y, p.z + Math.cos(t * .5 + p.ph) * .3); }); } };
  return { T, tex, lam, col, add, solid, box, plane, cyl, glow, light, shell, gallery, puzzle, spot, door, drips, motes, anims: W.anims };
}
