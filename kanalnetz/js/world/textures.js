// 3D: Alle Pixel-Texturen im N64-Stil und die Bilder für die Rahmen.

/* =====================================================================
   3D-RÄUME im N64-Stil – three.js wird erst beim ersten Betreten geladen
   ===================================================================== */
const THREE_URL = "lib/three.min.js";
let returnTo3D = false;

// Früher konnten Besucher eigene Fotos einsetzen (IndexedDB "ujio-galerie"). Gibt es nicht mehr – alte Reste aufräumen.
try { indexedDB.deleteDatabase("ujio-galerie"); } catch(e){}

/* ---------- Pixel-Texturen (prozedural, 16–64 px) ---------- */
const hn = (x, y, s = 0) => { let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041)) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); n ^= n >>> 16; return (n >>> 0) / 4294967296; };
const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const addc = (c, v) => c.map(x => Math.max(0, Math.min(255, x + v)));
function pcan(w, h){ const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; }
function ptex(w, h, fn){ const [c, g] = pcan(w, h), img = g.createImageData(w, h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){ const col = fn(x, y), i = (y * w + x) * 4; img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = 255; } g.putImageData(img, 0, 0); return c; }
const brickFn = (a, b, m, s) => (x, y) => {
  const row = Math.floor(y / 8), off = (row % 2) * 8, bx = Math.floor((x + off) / 16), mx = (x + off) % 16, my = y % 8;
  if (my === 7 || mx === 15) return addc(m, (hn(x, y, s) - .5) * 14);
  let c = mixc(a, b, hn(bx, row, s + 1)); if (my === 0) c = addc(c, 16); if (mx === 0) c = addc(c, 8); if (my === 6) c = addc(c, -14);
  return addc(c, (hn(x, y, s + 2) - .5) * 22);
};
const blockFn = (a, b, s) => (x, y) => { const bx = x >> 4, by = y >> 4, mx = x & 15, my = y & 15; let c = mixc(a, b, hn(bx, by, s)); if (mx === 0 || my === 0) c = addc(c, -30); else if (mx === 1 || my === 1) c = addc(c, 14); return addc(c, (hn(x, y, s + 1) - .5) * 20); };
const PX = {
  cache: {},
  get(k){ return this.cache[k] || (this.cache[k] = this.make[k]()); },
  make: {
    brickG: () => ptex(64, 32, brickFn(rgb("#3f544d"), rgb("#2b3a36"), rgb("#121918"), 1)),
    brickW: () => ptex(64, 32, brickFn(rgb("#7a5536"), rgb("#563a26"), rgb("#1e140d"), 2)),
    stone: () => ptex(32, 32, blockFn(rgb("#3b4241"), rgb("#2a302f"), 3)),
    stoneW: () => ptex(32, 32, blockFn(rgb("#6b5640"), rgb("#4f3f2e"), 4)),
    water: () => ptex(32, 32, (x, y) => { const w = Math.sin((x + Math.sin(y * .45) * 3) * .55) * .5 + .5; let c = mixc(rgb("#0a4a38"), rgb("#1fa070"), w * .65); if (((x * 3 + y * 5) % 19) === 0) c = addc(c, 70); return addc(c, (hn(x, y, 5) - .5) * 14); }),
    waterW: () => ptex(32, 32, (x, y) => { const w = Math.sin((y + Math.sin(x * .4) * 3) * .5) * .5 + .5; let c = mixc(rgb("#1d4a44"), rgb("#4aa08a"), w * .6); if (((x * 7 + y * 3) % 23) === 0) c = addc(c, 80); return addc(c, (hn(x, y, 6) - .5) * 14); }),
    rust: () => ptex(32, 32, (x, y) => { let c = mixc(rgb("#5a3a2a"), rgb("#7c4c2c"), hn(x >> 2, y >> 2, 7)); if (hn(x >> 1, y >> 1, 8) > .82) c = rgb("#a8582a"); if (x % 16 === 0 || y % 16 === 0) c = addc(c, -32); if ((x % 16 === 2 || x % 16 === 13) && (y % 16 === 2 || y % 16 === 13)) c = rgb("#c9b7a0"); return addc(c, (hn(x, y, 9) - .5) * 16); }),
    metal: () => ptex(32, 32, (x, y) => { let c = mixc(rgb("#4a5257"), rgb("#3a4146"), hn(x >> 3, y >> 3, 10)); if (y % 16 === 0) c = addc(c, -28); if (y % 16 === 1) c = addc(c, 18); return addc(c, (hn(x, y, 11) - .5) * 12); }),
    concrete: () => ptex(32, 32, (x, y) => addc(mixc(rgb("#6f7375"), rgb("#585c5e"), hn(x >> 2, y >> 2, 12)), (hn(x, y, 13) - .5) * 24)),
    concreteD: () => ptex(32, 32, (x, y) => { let c = mixc(rgb("#3e3c3a"), rgb("#2c2a28"), hn(x >> 2, y >> 2, 14)); if (hn(x >> 3, y >> 3, 15) > .75) c = addc(c, -18); if (x % 32 === 0 || y % 32 === 0) c = addc(c, -20); return addc(c, (hn(x, y, 16) - .5) * 18); }),
    hazard: () => ptex(32, 8, (x, y) => (((x + y) >> 2) % 2) ? rgb("#1a1a1a") : rgb("#f2c230")),
    wood: () => ptex(64, 64, (x, y) => { const p = x >> 4, mx = x & 15; let c = mixc(rgb("#86592f"), rgb("#64411f"), hn(p, 0, 17)); c = addc(c, Math.sin((y + hn(p, 1, 18) * 40) * .35 + mx * .25) * 10); if (mx === 0) c = addc(c, -42); if (((y + p * 23) % 64) === 0) c = addc(c, -36); return addc(c, (hn(x, y, 19) - .5) * 12); }),
    woodD: () => ptex(64, 64, (x, y) => { const p = x >> 4, mx = x & 15; let c = mixc(rgb("#4a2f1c"), rgb("#36210f"), hn(p, 0, 20)); c = addc(c, Math.sin((y + hn(p, 1, 21) * 40) * .3) * 8); if (mx === 0) c = addc(c, -30); return addc(c, (hn(x, y, 22) - .5) * 10); }),
    peg: () => ptex(32, 32, (x, y) => { const hx = x & 7, hy = y & 7; let c = rgb("#b48c5a"); if ((hx === 3 || hx === 4) && (hy === 3 || hy === 4)) c = rgb("#3a2a1a"); return addc(c, (hn(x, y, 23) - .5) * 14); }),
    carpet: () => ptex(32, 32, (x, y) => { let c = rgb("#5a1424"); const d = Math.abs((x & 15) - 8) + Math.abs((y & 15) - 8); if (d === 6) c = rgb("#b8892a"); if (d < 2) c = rgb("#8a2a3a"); return addc(c, (hn(x, y, 24) - .5) * 14); }),
    fabric: () => ptex(32, 32, (x, y) => addc(mixc(rgb("#2a1530"), rgb("#42234c"), (Math.sin(x * .8) + 1) / 2), (hn(x, y, 25) - .5) * 10)),
    curtain: () => ptex(32, 32, (x, y) => addc(mixc(rgb("#5c0f1a"), rgb("#ad2a40"), (Math.sin(x * .55) + 1) / 2), (hn(x, y, 26) - .5) * 10)),
    tatami: () => ptex(64, 64, (x, y) => { if (x < 3 || x > 60) return addc(rgb("#2b2440"), (hn(x, y, 27) - .5) * 10); return addc(mixc(rgb("#b0aa6e"), rgb("#958f5a"), y & 1), (hn(x >> 3, y, 28) - .5) * 14); }),
    shoji: () => ptex(64, 64, (x, y) => { if ((x & 15) < 2 || y % 21 < 2) return rgb("#3a2418"); return addc(rgb("#ece4f7"), (hn(x, y, 29) - .5) * 10); }),
    mat: () => ptex(32, 32, (x, y) => { let c = rgb("#1f6b4f"); if ((x & 7) === 0 || (y & 7) === 0) c = rgb("#5fa58a"); if ((x & 31) === 0 || (y & 31) === 0) c = rgb("#a8e0c8"); return c; }),
    gold: () => ptex(16, 16, (x, y) => { let c = mixc(rgb("#7a5418"), rgb("#e2b54a"), (Math.sin((x + y) * .7) + 1) / 2); if (x === 0 || y === 0) c = rgb("#f7da7e"); if (x === 15 || y === 15) c = rgb("#3e2a0c"); return c; }),
    frameW: () => ptex(16, 16, (x, y) => { let c = mixc(rgb("#3a2414"), rgb("#5a3a1e"), (Math.sin(x * .9) + 1) / 2); if (x === 0 || y === 0) c = rgb("#7a5230"); return c; }),
    seat: () => ptex(16, 16, (x, y) => { let c = rgb("#7e1628"); if ((y & 7) === 0) c = rgb("#4a0a16"); return addc(c, (hn(x, y, 30) - .5) * 14); }),
    grate: () => ptex(32, 32, (x, y) => (x % 6 < 2 || y % 6 < 2) ? rgb("#1a1d1f") : rgb("#f1dca0")),
    lacquer: () => ptex(16, 16, (x, y) => addc(rgb("#6e1f42"), (hn(x, y, 31) - .5) * 16)),
    gauge: () => { const [c, g] = pcan(32, 32); g.fillStyle = "#2a2f33"; g.fillRect(0, 0, 32, 32); g.fillStyle = "#e9e4d4"; g.beginPath(); g.arc(16, 16, 13, 0, 7); g.fill(); g.strokeStyle = "#1a1a1a"; g.lineWidth = 1; for (let i = 0; i < 9; i++){ const a = Math.PI * .75 + i * Math.PI * 1.5 / 8; g.beginPath(); g.moveTo(16 + Math.cos(a) * 10, 16 + Math.sin(a) * 10); g.lineTo(16 + Math.cos(a) * 13, 16 + Math.sin(a) * 13); g.stroke(); } g.strokeStyle = "#d22"; g.lineWidth = 2; g.beginPath(); g.moveTo(16, 16); g.lineTo(24, 9); g.stroke(); return c; },
    glow: () => { const [c, g] = pcan(64, 64); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(.25, "rgba(255,255,255,.55)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return c; }
  }
};

/* Gemaltes Bild, solange das Foto des Rahmens noch lädt */
function artCanvas(room, i, title){
  const [c, g] = pcan(256, 320), R = rng(room.world.seed * 17 + i * 5 + 3), pal = room.world.art;
  const sky = g.createLinearGradient(0, 0, 0, 320); sky.addColorStop(0, pal[0]); sky.addColorStop(1, pal[1]); g.fillStyle = sky; g.fillRect(0, 0, 256, 320);
  const sx = 40 + R() * 176, sy = 50 + R() * 80; const sun = g.createRadialGradient(sx, sy, 2, sx, sy, 70); sun.addColorStop(0, pal[2]); sun.addColorStop(.25, pal[2] + "99"); sun.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sun; g.fillRect(0, 0, 256, 320);
  const hz = 190 + R() * 40; g.fillStyle = "rgba(0,0,0,.55)";
  let x = 0; while (x < 256){ const w = 14 + R() * 30, h = 20 + R() * 90; g.fillRect(x, hz - h, w, h + 2); x += w + 2; }
  g.fillStyle = "rgba(0,0,0,.75)"; g.fillRect(0, hz, 256, 320 - hz);
  const fx = 70 + R() * 110, fy = hz + 30; g.fillStyle = pal[2];
  g.fillRect(fx - 7, fy - 52, 14, 14); g.fillRect(fx - 10, fy - 37, 20, 26); g.fillRect(fx - 10, fy - 11, 8, 20); g.fillRect(fx + 2, fy - 11, 8, 20); g.fillRect(fx + 10, fy - 36, 22, 5);
  g.globalAlpha = .18; g.fillRect(fx - 14, fy + 12, 28, 60); g.globalAlpha = 1;
  g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(0, 262, 256, 58);
  g.fillStyle = "#f4f7f8"; g.font = '30px "Bebas Neue", Impact, "Arial Narrow", sans-serif'; g.fillText(title.toUpperCase(), 14, 296);
  g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 2; g.strokeRect(6, 6, 244, 308);
  return c;
}
/* Spezialbild: erst verhüllt (Tuch mit Zähler), nach dem Freilegen das Foto des Minispiels */
const GAME_NAME = { flashlight: L("Taschenlampen-Suche", "Flashlight search"), break: L("Bruchtest", "Board break"), simon: L("Klang-Melodie", "Sound melody"), build: L("Bau-Spiel", "Build game"), arcade: "Arcade" };
const DEF_LOOK = { wall: "#24323a", water: "#00a676", glow: "#ceff66", vp: [0.5, 0.45], seed: 7 };
function clothCanvas(room){
  const [c, g] = pcan(256, 320), n = seenCount(room), t = room.gallery.length, hn2 = hintCount(room), ht = hintTotal(room), ready = unlockReady(room);
  const bg = g.createLinearGradient(0, 0, 256, 320); bg.addColorStop(0, "#2c2638"); bg.addColorStop(1, "#13101b"); g.fillStyle = bg; g.fillRect(0, 0, 256, 320);
  for (let i = 0; i < 9; i++){ const x = 14 + i * 28 + Math.sin(i * 1.7) * 6, fg = g.createLinearGradient(x - 14, 0, x + 14, 0); fg.addColorStop(0, "rgba(0,0,0,0)"); fg.addColorStop(.5, "rgba(255,255,255,.07)"); fg.addColorStop(1, "rgba(0,0,0,.2)"); g.fillStyle = fg; g.fillRect(x - 14, 0, 28, 320); }
  g.strokeStyle = ready ? "#ceff66" : "#8a8098"; g.setLineDash([6, 5]); g.lineWidth = 2; g.strokeRect(12, 12, 232, 296); g.setLineDash([]);
  g.textAlign = "center"; g.fillStyle = ready ? "#ceff66" : "#d8d2e4"; if (ready){ g.shadowColor = "#89f240"; g.shadowBlur = 18; }
  g.font = '46px "Bebas Neue", Impact, sans-serif'; g.fillText(ready ? L("FREILEGEN!", "UNCOVER!") : L("VERHÜLLT", "VEILED"), 128, 150); g.shadowBlur = 0;
  g.font = '12px "Silkscreen", "Courier New", monospace'; g.fillStyle = "#a9b7c9";
  g.fillText(`${n}/${t} ${L("BILDER", "PICTURES")}`, 128, 182); g.fillText(`${hn2}/${ht} ${L("SPLITTER", "SHARDS")}`, 128, 222);
  g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(48, 192, 160, 6); g.fillRect(48, 232, 160, 6);
  g.fillStyle = n >= t ? "#ceff66" : "#8b5fbf"; g.fillRect(48, 192, 160 * Math.min(1, n / t), 6); g.fillStyle = hn2 >= ht ? "#ceff66" : "#6af0ff"; g.fillRect(48, 232, 160 * Math.min(1, hn2 / ht), 6);
  return c;
}
function revealCanvas(room, img){
  const [c, g] = pcan(256, 320);
  if (img && img.naturalWidth){ const s = Math.max(256 / img.naturalWidth, 320 / img.naturalHeight), w = img.naturalWidth * s, h = img.naturalHeight * s; g.drawImage(img, (256 - w) / 2, (320 - h) / 2, w, h); }
  else { const tmp = document.createElement("canvas"); drawDiorama(tmp, room.look || DEF_LOOK, 256, 320); g.drawImage(tmp, 0, 0, 256, 320); }
  const sh = g.createLinearGradient(0, 170, 0, 320); sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,.88)"); g.fillStyle = sh; g.fillRect(0, 170, 256, 150);
  g.textAlign = "center"; g.fillStyle = "#ceff66"; g.shadowColor = "#89f240"; g.shadowBlur = 16;
  g.font = '38px "Bebas Neue", Impact, sans-serif'; g.fillText(wonBefore(room) ? L("NOCH MAL?", "PLAY AGAIN?") : L("SPRING REIN!", "JUMP IN!"), 128, 280); g.shadowBlur = 0;
  g.font = '11px "Silkscreen", "Courier New", monospace'; g.fillStyle = "#e2e8f0"; g.fillText(GAME_NAME[room.game].toUpperCase(), 128, 302);
  return c;
}
async function coverCanvas(src){
  const img = new Image(); img.src = src; await img.decode();
  const [c, g] = pcan(512, 640), s = Math.max(512 / img.naturalWidth, 640 / img.naturalHeight), w = img.naturalWidth * s, h = img.naturalHeight * s;
  g.drawImage(img, (512 - w) / 2, (640 - h) / 2, w, h); return c;
}

/* ---------- Zusätzliche Texturen fürs Versteck ---------- */
function ctex(w, h, draw){ const [c, g] = pcan(w, h); draw(g, w, h); return c; }
Object.assign(PX.make, {
  platform: () => ptex(32, 32, (x, y) => { let c = mixc(rgb("#5c5e5a"), rgb("#4a4c48"), hn(x >> 4, y >> 4, 40)); if ((x & 15) === 0 || (y & 15) === 0) c = addc(c, -22); if (hn(x >> 1, y >> 1, 41) > .94) c = rgb("#2a2a28"); return addc(c, (hn(x, y, 42) - .5) * 16); }),
  safety: () => ptex(8, 8, (x, y) => ((x >> 1) + (y >> 1)) % 2 ? rgb("#c9a21c") : rgb("#f4d040")),
  ballast: () => ptex(32, 32, (x, y) => addc(mixc(rgb("#4a443c"), rgb("#2b2722"), hn(x >> 1, y >> 1, 43)), (hn(x, y, 44) - .5) * 30)),
  train: () => ptex(64, 32, (x, y) => { let c = mixc(rgb("#a3acb4"), rgb("#7a838b"), y / 32); if (x % 16 === 0) c = addc(c, -32); if (y === 4 || y === 27) c = addc(c, -26); if (x % 16 === 3 && y % 8 === 2) c = rgb("#dde2e7"); if (hn(x >> 2, y >> 2, 45) > .86) c = addc(c, -36); return addc(c, (hn(x, y, 46) - .5) * 10); }),
  tileW: () => ptex(32, 32, (x, y) => { const row = y >> 2, off = (row % 2) * 4, mx = (x + off) & 7, my = y & 3; let c = mixc(rgb("#dcd8c8"), rgb("#bdb9a4"), hn((x + off) >> 3, row, 47)); if (mx === 7 || my === 3) c = rgb("#6a6a58"); if (hn(x >> 2, y >> 2, 48) > .84) c = addc(c, -42); return addc(c, (hn(x, y, 49) - .5) * 10); }),
  tileG: () => ptex(16, 8, (x, y) => { let c = rgb("#1f6b52"); if ((x & 3) === 3 || y === 7) c = rgb("#0e3a2c"); return addc(c, (hn(x, y, 50) - .5) * 14); }),
  woodL: () => ptex(64, 64, (x, y) => { const p = x >> 4, mx = x & 15; let c = mixc(rgb("#c69a62"), rgb("#a87c48"), hn(p, 0, 58)); c = addc(c, Math.sin((y + hn(p, 1, 59) * 40) * .35 + mx * .25) * 9); if (mx === 0) c = addc(c, -40); if (((y + p * 23) % 64) === 0) c = addc(c, -30); return addc(c, (hn(x, y, 60) - .5) * 10); }),
  matB: () => ptex(16, 16, (x, y) => { let c = rgb("#2a4a8a"); if (x === 0 || y === 0) c = rgb("#14244a"); return addc(c, (hn(x, y, 51) - .5) * 12); }),
  matR: () => ptex(16, 16, (x, y) => { let c = rgb("#8a2a2a"); if (x === 0 || y === 0) c = rgb("#4a1414"); return addc(c, (hn(x, y, 61) - .5) * 12); }),
  leather: () => ptex(16, 16, (x, y) => { let c = mixc(rgb("#6a3a1e"), rgb("#4a2814"), hn(x >> 1, y >> 1, 52)); if (y % 8 === 0) c = addc(c, -25); return addc(c, (hn(x, y, 53) - .5) * 16); }),
  brickR: () => ptex(64, 32, brickFn(rgb("#8c3c2c"), rgb("#6a2a1e"), rgb("#2a1a14"), 54)),
  rug: () => ptex(32, 32, (x, y) => { const d = Math.max(Math.abs(x - 15.5), Math.abs(y - 15.5)); const c = d > 13 ? rgb("#1a1a2a") : d > 10 ? rgb("#ff6b35") : d > 7 ? rgb("#2a3a6a") : ((x + y) & 4 ? rgb("#89f240") : rgb("#5ab030")); return addc(c, (hn(x, y, 55) - .5) * 14); }),
  stoneCave: () => ptex(32, 32, (x, y) => { const v = Math.sin(x * .4 + Math.sin(y * .3) * 2) * .5 + .5; let c = mixc(rgb("#3c3248"), rgb("#272132"), v); if (hn(x >> 2, y >> 2, 56) > .8) c = addc(c, -18); return addc(c, (hn(x, y, 57) - .5) * 20); }),
  metalF: () => ptex(16, 16, (x, y) => { let c = mixc(rgb("#5a6268"), rgb("#8a949a"), (Math.sin((x + y) * .6) + 1) / 2); if (x === 0 || y === 0) c = rgb("#b8c2c8"); if (x === 15 || y === 15) c = rgb("#2a3034"); return c; }),
  sign: () => ctex(128, 32, (g, w, h) => { g.fillStyle = "#0e3a2c"; g.fillRect(0, 0, w, h); g.strokeStyle = "#e8e4d4"; g.lineWidth = 2; g.strokeRect(2, 2, w - 4, h - 4); g.fillStyle = "#89f240"; g.beginPath(); g.arc(17, 16, 9, 0, 7); g.fill(); g.fillStyle = "#02120b"; g.font = "bold 12px sans-serif"; g.textAlign = "center"; g.fillText("U", 17, 20); g.fillStyle = "#e8e4d4"; g.font = "bold 16px sans-serif"; g.textAlign = "left"; g.fillText("UJIO STR.", 32, 22); }),
  pizza: () => ctex(64, 64, (g) => { g.fillStyle = "#eadcbc"; g.fillRect(0, 0, 64, 64); g.strokeStyle = "#b8a882"; g.lineWidth = 2; g.strokeRect(1, 1, 62, 62); g.fillStyle = "#c8302a"; g.beginPath(); g.arc(32, 26, 15, 0, 7); g.fill(); g.fillStyle = "#eadcbc"; g.beginPath(); g.arc(32, 26, 10, 0, 7); g.fill(); g.fillStyle = "#c8302a"; g.font = "bold 13px sans-serif"; g.textAlign = "center"; g.fillText("PIZZA", 32, 56); }),
  scroll: () => ctex(32, 64, (g) => { g.fillStyle = "#efe6cf"; g.fillRect(0, 0, 32, 64); g.fillStyle = "#5a2234"; g.fillRect(0, 0, 32, 7); g.fillRect(0, 57, 32, 7); g.strokeStyle = "#1a1a1a"; g.lineWidth = 2.5; g.beginPath(); g.arc(16, 26, 9, .4, Math.PI * 1.9); g.stroke(); g.lineWidth = 1; g.beginPath(); g.moveTo(5, 46); g.lineTo(11, 40); g.lineTo(15, 44); g.lineTo(21, 37); g.lineTo(27, 46); g.stroke(); g.fillStyle = "#c8302a"; g.fillRect(22, 49, 5, 5); }),
  chalk: () => ctex(128, 64, (g) => { g.fillStyle = "#1f2c26"; g.fillRect(0, 0, 128, 64); g.strokeStyle = "#6a4a2a"; g.lineWidth = 4; g.strokeRect(0, 0, 128, 64); g.fillStyle = "#e6efe8"; g.font = "9px monospace"; ["F = m · a", "Σ x² + 2y", "v2.0 ?!", "λ ≈ 0,42"].forEach((t, i) => g.fillText(t, 8, 15 + i * 12)); g.strokeStyle = "#e6efe8"; g.lineWidth = 1; g.beginPath(); g.arc(96, 26, 13, 0, 7); g.stroke(); for (let i = 0; i < 8; i++){ const a = i * Math.PI / 4; g.beginPath(); g.moveTo(96 + Math.cos(a) * 13, 26 + Math.sin(a) * 13); g.lineTo(96 + Math.cos(a) * 17, 26 + Math.sin(a) * 17); g.stroke(); } g.beginPath(); g.moveTo(80, 52); g.lineTo(118, 52); g.moveTo(112, 48); g.lineTo(118, 52); g.lineTo(112, 56); g.stroke(); }),
  graffiti: () => ctex(256, 96, (g) => { g.lineJoin = "round"; g.font = '72px "Bebas Neue", Impact, sans-serif'; g.textAlign = "center";
    const splash = (x, y, r, c) => { g.fillStyle = c; g.globalAlpha = .7; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.globalAlpha = 1; };
    splash(40, 30, 26, "#8b5fbf"); splash(220, 64, 30, "#ff6b35"); splash(140, 20, 16, "#00a676");
    g.lineWidth = 12; g.strokeStyle = "#02120b"; g.strokeText("UJIO", 128, 74); g.fillStyle = "#ceff66"; g.fillText("UJIO", 128, 74);
    g.fillStyle = "#89f240"; for (const x of [96, 118, 150, 170]){ g.fillRect(x, 74, 4, 10 + (x % 13)); }
    g.lineWidth = 3; g.strokeStyle = "#ffe14d"; g.beginPath(); g.moveTo(20, 86); g.quadraticCurveTo(128, 60, 236, 86); g.stroke(); })
});
function bannerCanvas(ch){ return ctex(32, 64, g => { g.fillStyle = "#7a1418"; g.fillRect(0, 0, 32, 64); g.fillStyle = "#c9a043"; g.fillRect(0, 0, 32, 3); g.fillRect(0, 61, 32, 3); g.fillRect(2, 0, 2, 64); g.fillRect(28, 0, 2, 64); g.fillStyle = "#0b0b0b"; g.font = 'bold 22px "Noto Serif JP", "Yu Mincho", serif'; g.textAlign = "center"; g.fillText(ch, 16, 40); }); }
