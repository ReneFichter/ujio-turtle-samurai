// 3D: Die sechs Räume des Verstecks. Jeder Raum ist eine Funktion in THEMES.

/* ---------- Die Räume des Verstecks ---------- */
// b.gallery: Reihenfolge = Bild-Nr. in CONTENT.rooms[].gallery. Neue Rahmen immer hinten anhängen, sonst rutschen eigene Fotos der Besucher (IndexedDB "raumId:nr") an andere Stellen.
const PI = Math.PI, HP = Math.PI / 2;
const THEMES = {
  /* 01 · Geisterbahnhof: verlassene U-Bahn-Station in der Kanalisation */
  subway(b){
    const T = b.T, h = 5, x0 = -7, x1 = 7, z0 = 2, z1 = -20, L = 22, cz = -9;
    b.plane(8, L, b.lam("platform", 4, 11), -3, 0, cz, -HP, 0);
    b.plane(.3, L, b.lam("safety", 1, 44), .82, .006, cz, -HP, 0);
    b.plane(6, L, b.lam("ballast", 3, 11), 4, -1, cz, -HP, 0);
    b.plane(L, 1, b.lam("concreteD", 11, .5), 1, -.5, cz, 0, HP);
    for (const x of [3.1, 4.5]) b.box(.08, .12, L, b.col(0x9aa0a6), x, -.94, cz);
    for (let z = z0 - .4; z > z1; z -= .8) b.box(2.2, .06, .22, b.col(0x3a2a1e), 3.8, -.97, z);
    b.solid(1, 8, z1 - 1, z0 + 1);
    b.plane(L, h, b.lam("tileW", L / 1.2, h / 1.2), x0, h / 2, cz, 0, HP);
    b.plane(L, .4, b.lam("tileG", L / 1.2, .5), x0 + .01, 2.55, cz, 0, HP);
    b.plane(L, h + 1, b.lam("brickG", L / 2, 3), x1, (h - 1) / 2, cz, 0, -HP);
    const black = new T.MeshBasicMaterial({ color: 0x020303 });
    for (const [z, ry, dz] of [[z1, 0, .02], [z0, PI, -.02]]){
      b.plane(8, h, b.lam("tileW", 8 / 1.2, h / 1.2), -3, h / 2, z, 0, ry);
      b.plane(6, h + 1, b.lam("brickG", 3, 3), 4, (h - 1) / 2, z, 0, ry);
      const arch = b.add(new T.Mesh(new T.CircleGeometry(2.3, 12, 0, PI), black)); arch.position.set(4, 1.2, z + dz); arch.rotation.y = ry;
      b.plane(4.6, 2.2, black, 4, .1, z + dz, 0, ry);
    }
    b.plane(14, L, b.lam("concrete", 7, 11), 0, h, cz, HP, 0);
    b.solid(x0 - 1, x0, z1 - 1, z0 + 1); b.solid(x0 - 1, x1 + 1, z1 - 1, z1); b.solid(x0 - 1, x1 + 1, z0, z0 + 1);
    for (const z of [-1.5, -6.5, -11.5, -16.5]){ b.box(.34, h, .34, b.col(0x1f5a52), .2, h / 2, z, true); b.box(.5, .2, .5, b.col(0x174a42), .2, h - .1, z); b.box(.5, .15, .5, b.col(0x174a42), .2, .07, z); }
    for (const z of [-4.25, -14]) b.plane(2.4, .6, b.lam("sign", 1, 1), x0 + .02, 3.35, z, 0, HP);
    for (const [i, z] of [-2, -7, -12, -17].entries()){
      const tube = b.box(.16, .07, 1.5, new T.MeshBasicMaterial({ color: 0xe8fff0 }), -3, h - .12, z);
      const gl = b.glow(-3, h - .3, z, 0xd8ffe8, 2.2);
      if (i === 2) b.anims.push(t => { const on = Math.sin(t * 13) + Math.sin(t * 3.1) > -.2; gl.visible = on; tube.material.color.setHex(on ? 0xe8fff0 : 0x404844); });
    }
    b.light(0xd8ffe8, 1.1, 13, -3, 4.3, -4); b.light(0xd8ffe8, .9, 13, -3, 4.3, -15);
    // Der abgestellte Zug
    b.box(3.4, 3.2, 12, b.lam("train", 6, 1.6), 4.1, .7, -9.5);
    b.box(3.2, .16, 12, b.col(0x5a6066), 4.1, 2.38, -9.5);
    const win = new T.MeshBasicMaterial({ color: 0xf0dc90 });
    for (let z = -4.3; z > -15; z -= 1.45){ if (Math.abs(z + 9.5) < .8) continue; b.plane(.9, .7, win, 2.39, 1.35, z, 0, -HP); }
    for (const z of [-6.6, -12.4]) b.plane(1.1, 2, b.col(0x4a5258), 2.385, .45, z, 0, -HP);
    const gr = new T.CanvasTexture(PX.get("graffiti")); b.plane(5.2, 1.6, new T.MeshBasicMaterial({ map: gr, transparent: true, alphaTest: .1 }), 2.37, .3, -9.5, 0, -HP);
    // Bänke
    for (const z of [-4.25, -14]){ b.box(1.8, .08, .5, b.lam("woodD", 1, 1), -6.35, .48, z, true); b.box(1.8, .5, .06, b.lam("woodD", 1, 1), -6.62, .78, z); for (const dz of [-.75, .75]) b.box(.06, .48, .45, b.col(0x2a2a2a), -6.35, .24, z + dz); }
    // Feuer in der Tonne
    b.cyl(.32, .32, .9, 8, b.lam("rust", 1, 1), -4.6, .45, -9.5, .38);
    b.glow(-4.6, 1.05, -9.5, 0xff8a2a, 1.6, 9); b.glow(-4.6, 1.3, -9.5, 0xffd04a, .9, 13);
    b.light(0xff8a3a, 1.2, 9, -4.6, 1.4, -9.5);
    b.motes(14, -4.8, -4.4, 1, 3.2, -9.7, -9.3, 0xffa040, .06, .9);
    for (const [x, z, s] of [[-2.2, -3.4, 1.4], [-1.2, -12.5, 1.8], [-5.2, -17.8, 1.2]]) b.plane(s, s * .6, new T.MeshBasicMaterial({ map: b.tex("water", 1, 1), color: 0x88aa99, transparent: true, opacity: .55 }), x, .01, z, -HP, 0);
    for (const x of [-6.2, -5.4]) { b.box(.3, 1, .5, b.col(0x7a8288), x, .5, -.4, true); b.box(.5, .05, .05, b.col(0xb0b8bc), x + .35, .85, -.4); }
    b.drips(7, -6, 0, -19, 1, h - .1, 0xbfffd8);
    b.gallery([[x0 + .07, 1.6, -2, HP], [x0 + .07, 1.6, -6.4, HP], [x0 + .07, 1.6, -11.6, HP], [x0 + .07, 1.6, -16.4, HP], [-5.3, 1.6, z1 + .07, 0],
      [x0 + .07, 1.6, .8, HP], [x0 + .07, 1.6, -9, HP], [x0 + .07, 1.6, -18.6, HP], [-.2, 1.6, z1 + .07, 0], [-5.3, 1.6, z0 - .07, PI], [-2.2, 1.6, z0 - .07, PI]]);
    b.puzzle(-2.2, 1.7, z1 + .1, 0);
    b.door(-.4, z0 - .06, PI);
  },

  /* 02 · Dojo */
  dojo(b){
    const T = b.T, h = 4.6;
    b.shell(-6, 6, 2, -14, h, "woodL", "brickG", "woodD", { fs: 2, ws: 2, cs: 2 });
    const wp = b.lam("woodD", 8, .6);
    b.box(.08, 1.1, 16, wp, -5.96, .55, -6); b.box(.08, 1.1, 16, wp, 5.96, .55, -6); b.box(12, 1.1, .08, b.lam("woodD", 6, .6), 0, .55, -13.96); b.box(12, 1.1, .08, b.lam("woodD", 6, .6), 0, .55, 1.96);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) b.plane(1.96, 1.96, b.lam((i + j) % 2 ? "matR" : "matB", 1, 1), -3 + i * 2, .012, -4 + -j * 2, -HP, 0);
    for (const z of [-1, -5, -9, -13]) b.box(12, .26, .3, b.lam("woodD", 6, .2), 0, h - .15, z);
    const pipe = b.add(new T.Mesh(new T.CylinderGeometry(.18, .18, 12, 6), b.lam("metal", 6, 1))); pipe.rotation.z = HP; pipe.position.set(0, h - .55, -3);
    for (const [x, ch] of [[-3.4, "心"], [3.4, "体"]]){ const bt = new T.CanvasTexture(bannerCanvas(ch)); bt.magFilter = T.NearestFilter; bt.minFilter = T.NearestFilter; b.plane(1, 2.1, new T.MeshLambertMaterial({ map: bt }), x, 2.75, -13.9, 0, 0); }
    // Waffenständer
    for (const z of [-3.6, -10.4]){
      b.box(.12, 1.7, 2.4, b.lam("woodD", 1, 1), -5.82, 1.5, z);
      for (let i = 0; i < 5; i++){ const st = b.cyl(.025, .025, 1.9, 5, b.col(z > -5 ? 0x8a5a2a : 0x6a4020), -5.68, 1.2, z - .9 + i * .45); st.rotation.z = .08; }
    }
    // Sandsäcke
    for (const [x, z] of [[3.6, -5], [3.6, -9.5]]){
      const g = new T.Group(); g.position.set(x, h, z); b.add(g);
      const ch = new T.Mesh(new T.CylinderGeometry(.02, .02, h - 1.9, 4), b.col(0x333333)); ch.position.y = -(h - 1.9) / 2; g.add(ch);
      const bag = new T.Mesh(new T.CylinderGeometry(.28, .28, 1.1, 8), b.lam("leather", 2, 2)); bag.position.y = -(h - 1.35); g.add(bag);
      b.solid(x - .3, x + .3, z - .3, z + .3); const ph = x * z; b.anims.push(t => { g.rotation.z = Math.sin(t * 1.3 + ph) * .04; g.rotation.x = Math.cos(t * 1.1 + ph) * .03; });
    }
    // Holzpuppe
    b.cyl(.17, .17, 1.6, 8, b.lam("woodD", 1, 1), -3.4, .85, -11.6, .3);
    for (const [y, ry] of [[1.35, .4], [1.2, -.4], [1.0, 0]]){ const a = b.box(.05, .05, .45, b.lam("woodD", 1, 1), -3.4, y, -11.35); a.rotation.y = ry; }
    b.box(.5, .08, .5, b.lam("woodD", 1, 1), -3.4, .04, -11.6);
    // Gong
    for (const x of [2.85, 4.35]) b.box(.1, 2.3, .1, b.lam("woodD", 1, 1), x, 1.15, -12.6);
    b.box(1.7, .12, .12, b.lam("woodD", 1, 1), 3.6, 2.3, -12.6);
    const gong = b.add(new T.Mesh(new T.CylinderGeometry(.62, .62, .05, 14), b.col(0xc9a043, { emissive: 0x2a1a04 }))); gong.rotation.x = HP; gong.position.set(3.6, 1.45, -12.6);
    b.solid(2.7, 4.5, -12.8, -12.4);
    for (let i = 0; i < 7; i++){ const x = -1.5 + i * .5; b.cyl(.04, .04, .14 + (i % 3) * .06, 6, b.col(0xf2ead6), x, .08, -13.4); b.glow(x, .24 + (i % 3) * .06, -13.4, 0xffb24a, .35, 11 + i); }
    b.light(0xffd9a0, 1.2, 15, 0, 4, -4); b.light(0xffb070, 1.0, 10, 0, 1.2, -12.6);
    b.motes(14, -5, 5, .3, 3.5, -13, 1, 0xfff0d0, .04, .06);
    b.gallery([[5.88, 1.75, -2.5, -HP], [5.88, 1.75, -7.2, -HP], [5.88, 1.75, -11.8, -HP], [-5.88, 1.75, -7, HP], [-3.5, 1.75, 1.88, PI], [3.5, 1.75, 1.88, PI],
      [5.88, 1.75, 0, -HP], [5.88, 1.75, -4.85, -HP], [5.88, 1.75, -9.5, -HP], [-5.88, 1.75, -.5, HP], [-5.88, 1.75, -12.8, HP], [-5.1, 1.75, -13.88, 0], [5.1, 1.75, -13.88, 0], [0, 1.75, 1.88, PI]]);
    b.puzzle(0, 1.85, -13.88, 0);
    b.door(1.75, 1.9, PI);
  },

  /* 03 · Teestube des Meisters */
  tea(b){
    const T = b.T, h = 3.6;
    b.shell(-5, 5, 2, -12, h, "tatami", "shoji", "woodD", { fs: 2, ws: 2, cs: 2, wallBasic: 0xf0d8b4 });
    const dw = b.lam("woodD", 1, 3);
    for (const z of [1, -2, -5, -8, -11]) for (const x of [-4.86, 4.86]) b.box(.26, h, .26, dw, x, h / 2, z);
    for (const z of [-2, -5, -8, -11]) b.box(10, .2, .26, b.lam("woodD", 4, 1), 0, h - .1, z);
    // Kanalwasser fließt quer durch den Raum
    const wt = b.tex("water", 5, 1); b.plane(10, 1.2, new T.MeshBasicMaterial({ map: wt, color: 0xb0ffe0, transparent: true, opacity: .9 }), 0, .02, -3.2, -HP, 0);
    b.anims.push(t => { wt.offset.x = (t * .12) % 1; });
    for (const z of [-2.55, -3.85]) b.box(10, .14, .16, b.lam("stone", 5, .2), 0, .07, z);
    b.solid(-5, -.8, -3.95, -2.45); b.solid(.8, 5, -3.95, -2.45);
    const br = b.box(1.5, .12, 1.9, b.lam("wood", 1, 1), 0, .18, -3.2); br.rotation.x = 0;
    for (const x of [-.72, .72]){ b.box(.06, .45, 1.9, b.lam("lacquer", 1, 1), x, .45, -3.2); b.box(.08, .08, 1.95, b.lam("lacquer", 1, 1), x, .68, -3.2); }
    for (let i = 0; i < 3; i++){ const k = b.glow(0, .05, -3.2, i === 1 ? 0xffffff : 0xff7a2a, .3); const p = { ph: i * 2.1 }; b.anims.push(t => { k.position.set(Math.sin(t * .4 + p.ph) * 4.2, .05, -3.2 + Math.sin(t * 1.3 + p.ph) * .3); }); }
    // Nische mit Rollbild, Bonsai und Räucherstäbchen
    b.box(3, .25, 1, b.lam("woodD", 2, 1), 0, .125, -11.5, true);
    b.plane(.8, 1.8, b.lam("scroll", 1, 1), 0, 2.05, -11.92, 0, 0);
    b.box(.42, .16, .3, b.col(0x2a2a3a), 1, .33, -11.5);
    b.cyl(.04, .06, .4, 5, b.col(0x4a3020), 1, .6, -11.5);
    for (const [dx, dy, s] of [[-.12, .82, .26], [.16, .9, .22], [0, 1.02, .2]]){ const f = b.add(new T.Mesh(new T.IcosahedronGeometry(s, 0), b.col(0x4a7a3a))); f.position.set(1 + dx, dy, -11.5); f.scale.y = .7; }
    b.cyl(.01, .01, .3, 4, b.col(0x6a3a2a), -1, .4, -11.5);
    for (let i = 0; i < 6; i++){ const s = b.glow(-1, .6, -11.5, 0xe8e0f0, .2); const p = { y: .55 + i * .25 }; b.anims.push((t, dt) => { p.y += dt * .25; if (p.y > 2) p.y = .55; s.position.set(-1 + Math.sin(t * 1.5 + p.y * 3) * .08, p.y, -11.5); s.material.opacity = .5 * (1 - (p.y - .55) / 1.45); s.scale.set(.15 + (p.y - .55) * .2, .15 + (p.y - .55) * .2, 1); }); }
    // Teetisch
    b.box(1.4, .08, .9, b.lam("woodD", 1, 1), 0, .35, -7, true);
    for (const [dx, dz] of [[-.6, -.35], [.6, -.35], [-.6, .35], [.6, .35]]) b.box(.06, .32, .06, dw, dx, .16, -7 + dz);
    const pot = b.add(new T.Mesh(new T.SphereGeometry(.12, 8, 6), b.col(0x3a4a3a))); pot.position.set(.25, .5, -7);
    const sp = b.cyl(.015, .025, .14, 5, b.col(0x3a4a3a), .38, .52, -7); sp.rotation.z = -1;
    for (const [x, z] of [[-.3, -7.2], [-.1, -6.8], [-.4, -6.85]]) b.cyl(.045, .04, .07, 8, b.col(0xf0ece0), x, .425, z);
    for (let i = 0; i < 4; i++){ const s = b.glow(.25, .65, -7, 0xffffff, .15); const p = { y: .62 + i * .15 }; b.anims.push((t, dt) => { p.y += dt * .2; if (p.y > 1.3) p.y = .62; s.position.set(.25 + Math.sin(t * 2 + p.y * 5) * .05, p.y, -7); s.material.opacity = .35 * (1 - (p.y - .62) / .68); }); }
    for (const [x, z] of [[0, -6], [0, -8], [-1.1, -7], [1.1, -7]]) b.box(.6, .1, .6, b.col(0x6a2a3a), x, .05, z);
    for (const [x, z] of [[-4, -1], [4, -1], [-4, -10], [4, -10]]){ b.box(.36, .7, .36, new T.MeshBasicMaterial({ color: 0xffe4b8 }), x, .35, z, true); b.box(.4, .04, .4, dw, x, .72, z); b.glow(x, .45, z, 0xffc070, 1.5, 4); }
    b.light(0xffd9a0, 1.1, 12, 0, 3, -3); b.light(0xffc890, 1.0, 10, 0, 2.5, -10);
    b.gallery([[-4.93, 1.6, -3.5, HP], [-4.93, 1.6, -6.5, HP], [-4.93, 1.6, -9.5, HP], [4.93, 1.6, -6.5, -HP], [4.93, 1.6, -9.5, -HP],
      [-4.93, 1.6, -.5, HP], [4.93, 1.6, -.5, -HP], [4.93, 1.6, -3.5, -HP], [3.1, 1.65, -11.93, 0], [-2.5, 1.6, 1.93, PI], [2.5, 1.6, 1.93, PI]]);
    b.puzzle(-3.1, 1.65, -11.9, 0);
    b.door(0, 1.9, PI);
  },

  /* 04 · Labor & Werkstatt */
  lab(b){
    const T = b.T, h = 4.2;
    b.shell(-6, 6, 2, -13, h, "concreteD", "brickG", "metal", { fs: 2, ws: 2, cs: 3 });
    const [cc, cg] = pcan(64, 48), code = new T.CanvasTexture(cc); code.magFilter = T.NearestFilter; code.minFilter = T.NearestFilter; code.generateMipmaps = false;
    const lines = Array.from({ length: 12 }, () => ({ x: Math.floor(Math.random() * 6) * 4, w: 8 + Math.floor(Math.random() * 40) }));
    let fr = 0; b.anims.push(() => { if (fr++ % 6) return; lines.shift(); lines.push({ x: Math.floor(Math.random() * 6) * 4, w: 8 + Math.floor(Math.random() * 40) }); cg.fillStyle = "#031a0c"; cg.fillRect(0, 0, 64, 48);
      lines.forEach((l, i) => { cg.fillStyle = i === lines.length - 1 ? "#ceff66" : "#2fd06a"; for (let x = 0; x < l.w; x += 3) if (Math.random() > .15) cg.fillRect(4 + l.x + x, 3 + i * 4, 2, 2); }); code.needsUpdate = true; });
    const scr = new T.MeshBasicMaterial({ map: code });
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++){
      const x = -2.25 + i * 1.5, y = 1.25 + j * .78; b.box(1.3, .72, .6, b.col(0x2a2e32), x, y, -12.6);
      b.plane(1.08, .54, scr, x, y, -12.29, 0, 0);
    }
    b.solid(-3.1, 3.1, -13, -12.3);
    b.box(5.4, .08, 1.1, b.lam("metal", 3, 1), 0, .85, -11.5, true);
    for (const x of [-2.6, 2.6]) b.box(.08, .82, 1, b.col(0x2a2a2a), x, .42, -11.5);
    for (const x of [-1.5, 0, 1.5]) b.box(.5, .03, .18, b.col(0x1a1a1a), x, .9, -11.3);
    const lava = b.cyl(.08, .12, .4, 8, new T.MeshBasicMaterial({ color: 0xff6b35, transparent: true, opacity: .8 }), 2.3, 1.09, -11.6);
    const blob = b.glow(2.3, 1, -11.6, 0xffb060, .25); b.anims.push(t => { blob.position.y = 1 + (Math.sin(t * .8) + 1) * .14; });
    b.cyl(.28, .3, .5, 8, b.col(0x1a1a1a), .4, .25, -10.2); b.box(.5, .08, .5, b.col(0x222222), .4, .55, -10.2);
    // Werkbank (Bau-Minispiel)
    b.box(1.2, .1, 2.8, b.lam("woodD", 1, 2), -5.2, .95, -5, true);
    for (const dz of [-1.3, 1.3]) b.box(1.1, .9, .08, b.col(0x2a2a2a), -5.2, .45, -5 + dz);
    b.plane(.9, 1.4, b.lam("mat", 1.4, 2), -5.2, 1.01, -5, -HP, 0);
    b.box(.3, .3, .3, b.col(0x89f240), -5.3, 1.15, -4.4); b.box(.4, .12, .2, b.col(0xff6b35), -5.1, 1.06, -5.4);
    b.cyl(.06, .06, .5, 6, b.col(0x8b5fbf), -5.4, 1.25, -5.9);
    const arm = b.box(.06, .7, .06, b.col(0x555555), -5.6, 1.35, -5); arm.rotation.z = -.5;
    b.glow(-5.0, 1.55, -5, 0xfff0c0, 1.6); b.light(0xffe6b0, .9, 7, -4.6, 2.2, -5);

    // Teslaspule
    b.cyl(.35, .45, .3, 8, b.col(0x2a2a2a), -3, .15, -9.2, .5); b.cyl(.12, .12, 1.8, 8, b.col(0xb87333), -3, 1.2, -9.2);
    const tor = b.add(new T.Mesh(new T.TorusGeometry(.32, .1, 6, 10), b.lam("metal", 1, 1))); tor.rotation.x = HP; tor.position.set(-3, 2.2, -9.2);
    const tl = b.light(0x9ab8ff, .8, 8, -3, 2.4, -9.2);
    const sparks = [0, 1, 2].map(() => b.glow(-3, 2.3, -9.2, 0xbfd8ff, .4));
    b.anims.push(t => { const on = Math.random() > .55; tl.intensity = on ? 1.4 : .3; sparks.forEach(s => { s.visible = on; const a = Math.random() * 7; s.position.set(-3 + Math.cos(a) * (.35 + Math.random() * .4), 2.2 + (Math.random() - .3) * .5, -9.2 + Math.sin(a) * (.35 + Math.random() * .4)); }); });
    // Kreidetafel, Regal mit leuchtenden Gläsern
    b.plane(3, 1.2, b.lam("chalk", 1, 1), -5.93, 3.35, -10.5, 0, HP);
    for (const y of [.8, 1.6, 2.4]) b.box(.4, .05, 2.4, b.lam("woodD", 1, 1), 5.78, y, -4.5);
    for (let i = 0; i < 9; i++){ const y = [.8, 1.6, 2.4][i % 3] + .15, z = -5.4 + (i % 4) * .6, c = [0x6aff9a, 0xceff66, 0x8b5fbf][i % 3]; b.cyl(.08, .08, .25, 6, new T.MeshBasicMaterial({ color: c, transparent: true, opacity: .85 }), 5.75, y, z); b.glow(5.72, y, z, c, .35); }
    b.solid(5.55, 6, -5.8, -3.2);
    for (const [x, z, l] of [[-1, -3, 1.2], [1.5, -6, 1.6], [-2, -8, 1]]){ const c = b.cyl(.02, .02, l, 4, b.col(0x111111), x, h - l / 2, z); c.rotation.z = .25; }
    const p = b.add(new T.Mesh(new T.CylinderGeometry(.2, .2, 15, 6), b.lam("metal", 6, 1))); p.rotation.x = HP; p.position.set(4.8, h - .5, -5.5);
    b.light(0x6aff9a, 1.4, 13, 0, 2.2, -10.8); b.light(0xd8e8ff, 1.1, 16, 0, 3.8, -3);
    b.puzzle(-5.88, 1.65, -10.5, HP);
    b.door(-1.75, 1.9, PI);
    b.gallery([[5.93, 1.6, -8, -HP], [5.93, 1.6, -11, -HP], [-4.7, 1.6, -12.93, 0], [4.7, 1.6, -12.93, 0], [-3.5, 1.6, 1.93, PI],
      [5.93, 1.6, -1.5, -HP], [5.93, 1.6, .6, -HP], [-5.93, 1.6, -1.5, HP], [-5.93, 1.6, .6, HP], [-5.93, 1.6, -7.7, HP], [0, 1.6, 1.93, PI], [3.5, 1.6, 1.93, PI]]);
  },

  /* 05 · Jugendzimmer */
  teen(b){
    const T = b.T, h = 4;
    b.shell(-6, 6, 2, -12, h, "concrete", "brickR", "concrete", { fs: 2, ws: 2, cs: 2 });
    b.plane(4.2, 3.2, b.lam("rug", 1, 1), -1.5, .012, -6.2, -HP, 0);
    const gr = new T.CanvasTexture(PX.get("graffiti")); b.plane(6, 2.25, new T.MeshBasicMaterial({ map: gr, transparent: true, alphaTest: .1 }), -5.93, 2.5, -6, 0, HP);
    // Sofa + Röhrenfernseher
    const sofa = b.col(0x7a3a2c);
    b.box(2.4, .45, .9, sofa, -1.5, .3, -4.2, true); b.box(2.4, .8, .25, sofa, -1.5, .75, -3.78); for (const dx of [-1.3, 1.3]) b.box(.25, .6, .9, sofa, -1.5 + dx, .45, -4.2);
    b.box(1.2, .6, .8, b.lam("woodD", 1, 1), -1.5, .3, -8.6, true);
    b.box(1.1, .86, .8, b.col(0x2a2a2e), -1.5, 1.03, -8.6);
    const [tc, tg] = pcan(48, 36), tvt = new T.CanvasTexture(tc); tvt.magFilter = T.NearestFilter; tvt.minFilter = T.NearestFilter; tvt.generateMipmaps = false;
    let fr = 0; b.anims.push(() => { if (fr++ % 3) return; const img = tg.createImageData(48, 36); for (let i = 0; i < img.data.length; i += 4){ const v = 30 + Math.random() * 120; img.data[i] = v * .8; img.data[i + 1] = v; img.data[i + 2] = v * .9; img.data[i + 3] = 255; } tg.putImageData(img, 0, 0); tg.fillStyle = "#ceff66"; tg.beginPath(); tg.moveTo(19, 10); tg.lineTo(19, 26); tg.lineTo(31, 18); tg.fill(); tvt.needsUpdate = true; });
    b.plane(.9, .66, new T.MeshBasicMaterial({ map: tvt }), -1.5, 1.05, -8.19, 0, 0);
    b.glow(-1.5, 1.05, -8.05, 0xbfe8ff, 1.6);
    b.box(.4, .08, .3, b.col(0x8a8a90), -.6, .64, -8.5); for (const x of [-1.9, -1.1]) b.box(.16, .04, .1, b.col(0x2a2a2a), x, .02, -6.8);
    b.spot("cinema", -1.5, 1.05, -8.18, 0, 1, { reach: 6.5, cone: .8, title: "Fernseher" });
    // Arcade-Automat
    const [ac, ag] = pcan(40, 30), at = new T.CanvasTexture(ac); at.magFilter = T.NearestFilter; at.minFilter = T.NearestFilter; at.generateMipmaps = false;
    let af = 0; b.anims.push(t => { if (af++ % 4) return; ag.fillStyle = "#04020c"; ag.fillRect(0, 0, 40, 30); ag.fillStyle = "#ffffff"; for (let i = 0; i < 14; i++) ag.fillRect((i * 7 + af) % 40, (i * 11 + af * .5) % 30, 1, 1);
      ag.fillStyle = "#8b5fbf"; const ox = Math.round(Math.sin(t) * 4); for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) ag.fillRect(8 + c * 5 + ox, 4 + r * 4, 3, 2); ag.fillStyle = "#ceff66"; const px = 20 + Math.round(Math.sin(t * 1.7) * 12); ag.fillRect(px - 2, 25, 5, 2); ag.fillRect(px, 23, 1, 2); at.needsUpdate = true; });
    b.box(.9, 1.9, .8, b.col(0x2a1a4a), 4.9, .95, -10.9, true);
    const sc = b.plane(.7, .52, new T.MeshBasicMaterial({ map: at }), 4.9, 1.35, -10.49, -.25, 0);
    b.box(.92, .3, .3, new T.MeshBasicMaterial({ color: 0xff6b35 }), 4.9, 1.95, -10.6); b.glow(4.9, 1.95, -10.4, 0xff9a5a, 1.2, 5);
    b.box(.8, .08, .3, b.col(0x1a1a1a), 4.9, 1.0, -10.4);
    // Skaterampe + Bretter
    const ramp = b.box(2.6, .12, 2.4, b.lam("woodL", 2, 2), 4.7, .6, -4.5); ramp.rotation.z = .5;
    b.box(.1, 1.25, 2.4, b.lam("woodD", 1, 1), 5.9, .62, -4.5); b.solid(3.4, 6, -5.7, -3.3);
    for (const [z, c] of [[-1.2, 0x89f240], [-1.6, 0xff6b35]]){ const d = b.box(.22, .03, .8, b.col(c), 5.8, .45, z); d.rotation.z = 1.25; }
    // Pizza-Kartons, Sitzsäcke, Comics
    for (let i = 0; i < 6; i++){ const p = b.box(.5, .06, .5, b.lam("pizza", 1, 1), 2.2, .03 + i * .065, -1.2); p.rotation.y = (i * .37) % .5 - .2; } b.solid(1.9, 2.5, -1.5, -.9);
    for (const [x, z, c] of [[1.4, -6.6, 0x89f240], [.3, -7.4, 0x8b5fbf]]){ const bb = b.add(new T.Mesh(new T.SphereGeometry(.48, 8, 6), b.col(c))); bb.position.set(x, .26, z); bb.scale.y = .55; }
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4 + i; j++) b.box(.32, .02, .24, b.col([0xe8d84a, 0xd84a4a, 0x4a8ad8, 0xffffff][(i + j) % 4]), -4.6 + i * .5, .01 + j * .022, -10.8);
    // Basketballkorb
    b.plane(1.1, .75, b.col(0xf2f2f2), 1.5, 2.9, -11.94, 0, 0);
    const ring = b.add(new T.Mesh(new T.TorusGeometry(.22, .025, 4, 10), b.col(0xff6b35))); ring.rotation.x = HP; ring.position.set(1.5, 2.6, -11.7);
    // Lichterkette
    const cols = [0xff6b35, 0x89f240, 0x8b5fbf, 0xffe14d, 0x00a676];
    const bulbs = [];
    for (let i = 0; i < 26; i++){ const k = i / 25, z = 1.4 - k * 13, y = h - .25 - Math.sin(k * PI * 4) ** 2 * .45; bulbs.push(b.glow(-5.8, y, z, cols[i % 5], .35)); }
    for (let i = 0; i < 18; i++){ const k = i / 17, x = -5.5 + k * 11, y = h - .25 - Math.sin(k * PI * 3) ** 2 * .4; bulbs.push(b.glow(x, y, -11.85, cols[(i + 2) % 5], .35)); }
    b.anims.push(t => bulbs.forEach((s, i) => { s.material.opacity = .55 + .45 * (Math.sin(t * 3 + i) > 0 ? 1 : .3); }));
    b.light(0xff9ad0, .9, 12, -3, 3.5, -4); b.light(0x9ad0ff, .9, 12, 3, 3.5, -9); b.light(0xffe0a0, .7, 10, 0, 3.5, 0);
    b.puzzle(1.5, 1.45, -11.88, 0);
    b.door(-1.75, 1.9, PI);
    b.gallery([[-4.2, 1.7, -11.93, 0], [-1.6, 1.85, -11.93, 0], [5.93, 1.7, -8, -HP], [3.5, 1.7, 1.93, PI], [-3.5, 1.7, 1.93, PI],
      [-5.93, 1.7, .3, HP], [-5.93, 1.7, -10.6, HP], [5.93, 1.7, -1.4, -HP], [5.93, 1.7, -6.4, -HP], [3.2, 1.7, -11.93, 0], [0, 1.7, 1.93, PI]]);
  },

  /* 06 · Portalraum: technischer Raum mit Zeitreiseportal (Finale) */
  portal(b, room){
    const T = b.T, h = 5;
    b.shell(-6, 6, 2, -14, h, "platform", "metal", "metal", { fs: 2, ws: 2, cs: 2 });
    // Leuchtstreifen im Boden führen zum Portal
    const strip = new T.MeshBasicMaterial({ color: 0x2fd0ff });
    for (const x of [-2.6, 2.6]) b.plane(.1, 14.5, strip, x, .012, -5.5, -HP, 0);
    for (let z = .5; z > -10; z -= 1.5) b.plane(5.2, .06, new T.MeshBasicMaterial({ color: 0x14405a }), 0, .011, z, -HP, 0);
    // Rohre und Kabel an der Decke
    for (const x of [-4.6, 4.6]){ const p = b.add(new T.Mesh(new T.CylinderGeometry(.2, .2, 16, 6), b.lam("metal", 6, 1))); p.rotation.x = HP; p.position.set(x, h - .45, -6); }
    for (const [x, z, l] of [[-1.5, -3, 1.4], [1.8, -6, 1.8], [-.6, -8.5, 1.1]]){ const c = b.cyl(.025, .025, l, 4, b.col(0x111418), x, h - l / 2, z); c.rotation.z = .2; }
    // Steuerpulte mit flimmernden Bildschirmen
    const [sc, sg] = pcan(48, 32), stx = new T.CanvasTexture(sc); stx.magFilter = T.NearestFilter; stx.minFilter = T.NearestFilter; stx.generateMipmaps = false;
    let fr = 0; b.anims.push(t => { if (fr++ % 5) return; sg.fillStyle = "#03101a"; sg.fillRect(0, 0, 48, 32); sg.strokeStyle = "#6af0ff"; sg.lineWidth = 1; sg.beginPath(); for (let x = 0; x < 48; x++){ const y = 16 + Math.sin(x * .4 + t * 4) * 6 * Math.sin(t * .7); x ? sg.lineTo(x, y) : sg.moveTo(x, y); } sg.stroke(); sg.fillStyle = "#ceff66"; sg.fillRect(2, 2, 6 + (fr % 30), 2); stx.needsUpdate = true; });
    for (const x of [-4.2, 4.2]){
      b.box(1.6, 1, .8, b.col(0x2a3036), x, .5, -9.6, true);
      const top = b.box(1.6, .08, .9, b.col(0x3a4248), x, 1.05, -9.55); top.rotation.x = -.35;
      const s = b.plane(1.2, .7, new T.MeshBasicMaterial({ map: stx }), x, 1.55, -9.95, 0, 0); s.rotation.x = -.15;
      b.box(1.3, .8, .1, b.col(0x1a1e22), x, 1.55, -10.02);
      for (let i = 0; i < 5; i++) b.glow(x - .5 + i * .25, 1.12, -9.25, [0xff6b35, 0xceff66, 0x6af0ff][i % 3], .14, 6 + i);
    }
    // Plattform und Ring
    const cz = -11.6, cy = 2.15;
    b.cyl(2.4, 2.6, .3, 18, b.lam("metal", 2, 1), 0, .15, cz, 2.3);
    for (const x of [-2.25, 2.25]){ b.box(.4, 3.9, .5, b.col(0x2a3036), x, 1.95, cz, true); b.glow(x, 3.6, cz + .3, 0x6af0ff, .4, 4); }
    const ringM = new T.MeshLambertMaterial({ color: 0x5a6672, emissive: 0x0a3a50 });
    const ring = b.add(new T.Mesh(new T.TorusGeometry(1.75, .2, 8, 28), ringM)); ring.position.set(0, cy, cz);
    for (let i = 0; i < 12; i++){ const a = i / 12 * PI * 2; const n = b.box(.16, .16, .3, b.col(0x8a96a0), Math.cos(a) * 1.75, cy + Math.sin(a) * 1.75, cz); n.rotation.z = a; }
    // Wirbel: Spiralen auf einer gedrehten Scheibe
    const [vc, vg] = pcan(128, 128); const vg2 = vg.createRadialGradient(64, 64, 4, 64, 64, 64); vg2.addColorStop(0, "#ffffff"); vg2.addColorStop(.25, "#6af0ff"); vg2.addColorStop(.6, "#5a2a9a"); vg2.addColorStop(1, "#05070a"); vg.fillStyle = vg2; vg.fillRect(0, 0, 128, 128);
    vg.lineWidth = 3; for (let k = 0; k < 5; k++){ vg.strokeStyle = ["#ceff66", "#b07aff", "#6af0ff", "#ffffff", "#2fd0ff"][k]; vg.globalAlpha = .55; vg.beginPath(); for (let s = 0; s < 60; s++){ const a = k * 1.256 + s * .12, rr = s * 1.05; const x = 64 + Math.cos(a) * rr, y = 64 + Math.sin(a) * rr; s ? vg.lineTo(x, y) : vg.moveTo(x, y); } vg.stroke(); }
    const vtx = new T.CanvasTexture(vc);
    const disc = b.add(new T.Mesh(new T.CircleGeometry(1.58, 32), new T.MeshBasicMaterial({ map: vtx, transparent: true, opacity: .4 }))); disc.position.set(0, cy, cz + .02);
    const halo = b.glow(0, cy, cz + .3, 0x6af0ff, 5.5);
    const pl = b.light(0x6af0ff, 1.2, 12, 0, cy, cz + 1.5);
    b.motes(24, -2, 2, .3, 4, cz - .5, cz + 2, 0x6af0ff, .06, .25);
    // Portal ist aus, bis alle Zeitsplitter im Raum gefunden sind – dann wächst der Wirbel aus der Mitte auf.
    // Fehlen noch Portalteile, flackert er unruhig; mit allen fünf Teilen läuft er stabil und hell.
    let openK = unlockReady(room) ? 1 : 0;
    b.anims.push((t, dt) => {
      if (unlockReady(room) && openK < 1) openK = Math.min(1, openK + dt / 1.8);
      const e = openK * openK * (3 - 2 * openK), core = allParts(), flick = core ? 1 : .55 + .45 * Math.abs(Math.sin(t * 9) * Math.sin(t * 2.3));
      disc.visible = e > .01; disc.scale.setScalar(Math.max(.01, e)); disc.rotation.z -= dt * (core ? 2.4 : 1.1);
      disc.material.opacity = (core ? .95 : .75) * e * flick;
      ringM.emissive.setHex(e < .05 ? 0x05080c : core ? 0x1a7a9a : 0x10506a); ringM.emissiveIntensity = .3 + .7 * e;
      halo.visible = e > .01; halo.material.opacity = .85 * e * flick * (.85 + Math.sin(t * 3) * .15);
      pl.intensity = .15 + 1.25 * e * flick;
    });
    b.spot("portal", 0, cy, cz + .2, 0, 1, { reach: 4.6, cone: .55, title: "Portal" });
    b.door(2.6, 1.9, PI);
    b.solid(-2.6, 2.6, cz - .6, cz + .4);
    b.light(0xd8e8ff, 1.0, 16, 0, 4.4, -3); b.light(0xb0d0ff, .7, 12, 0, 4.4, -8);
    b.gallery([[-5.93, 1.7, -1.5, HP], [-5.93, 1.7, -4.5, HP], [-5.93, 1.7, -7.5, HP], [5.93, 1.7, -1.5, -HP], [5.93, 1.7, -4.5, -HP], [5.93, 1.7, -7.5, -HP],
      [-4.4, 1.8, -13.93, 0], [4.4, 1.8, -13.93, 0], [0, 1.7, 1.93, PI]]);
  },

  /* ?? · Schreinhöhle (aktuell ungenutzt, der Raum "geheim" ist jetzt der Portalraum) */
  cave(b){
    const T = b.T, h = 6, R = rng(77);
    b.shell(-6, 6, 2, -14, h, "stoneCave", "stoneCave", "stoneCave", { fs: 2, ws: 2, cs: 2 });
    const rm = b.lam("stoneCave", 1, 1);
    const rock = (x, y, z, s, sol) => { const m = b.add(new T.Mesh(new T.IcosahedronGeometry(s, 0), rm)); m.position.set(x, y, z); m.rotation.set(R() * 3, R() * 3, 0); m.scale.y = .7 + R() * .5; if (sol) b.solid(x - s * .8, x + s * .8, z - s * .8, z + s * .8); return m; };
    for (const [x, z] of [[-5.7, .5], [-5.6, -5], [-5.8, -9.5], [5.7, .3], [5.6, -5.1], [5.8, -9.8], [5.5, -13.2]]) rock(x, .3, z, .8 + R() * .5, true);
    for (let i = 0; i < 10; i++) rock(-6 + R() * 12, h - .2, -13 + R() * 14, .6 + R() * .8);
    for (let i = 0; i < 16; i++){ const s = .12 + R() * .2, l = .6 + R() * 1.3, c = b.add(new T.Mesh(new T.ConeGeometry(s, l, 5), rm)); c.rotation.x = PI; c.position.set(-5.5 + R() * 11, h - l / 2, -13 + R() * 14); }
    const crystal = (x, y, z, s, c) => { for (let i = 0; i < 3; i++){ const m = b.add(new T.Mesh(new T.OctahedronGeometry(s * (1 - i * .25), 0), new T.MeshBasicMaterial({ color: c }))); m.position.set(x + (i - 1) * s * .7, y + s * 1.1, z + (i % 2) * s * .4); m.scale.y = 2.2; m.rotation.z = (i - 1) * .35; } const g = b.glow(x, y + s * 1.3, z, c, s * 7, 2); return g; };
    for (const [x, z, s, c] of [[-4.6, -5, .22, 0xb07aff], [4.5, -5, .18, 0x6af0ff], [-4.8, -11, .26, 0x6af0ff], [4.7, -11.2, .24, 0xb07aff], [2.2, -13.3, .2, 0xb07aff], [-1.8, -13.4, .16, 0x6af0ff]]) crystal(x, 0, z, s, c);
    // Wasserfall + Becken
    const wt = b.tex("waterW", 1, 4); b.plane(1.4, h, new T.MeshBasicMaterial({ map: wt, color: 0x9ad8ff, transparent: true, opacity: .85 }), -4.4, h / 2, -13.92, 0, 0);
    const pt = b.tex("waterW", 2, 2); b.plane(3, 2.4, new T.MeshBasicMaterial({ map: pt, color: 0x9ad8ff, transparent: true, opacity: .7 }), -4.4, .03, -12.6, -HP, 0);
    b.anims.push(t => { wt.offset.y = (t * .8) % 1; pt.offset.x = (t * .05) % 1; });
    b.solid(-6, -2.9, -14, -11.4);
    for (let i = 0; i < 8; i++){ const s = b.glow(-4.4, .3, -13.4, 0xe0f4ff, .6); const p = { ph: i * .8 }; b.anims.push(t => { const k = ((t * .5 + p.ph) % 1); s.position.set(-4.4 + Math.sin(p.ph * 3) * .6, .2 + k * 1.2, -13.3 + k * .6); s.material.opacity = .4 * (1 - k); s.scale.set(.5 + k, .5 + k, 1); }); }
    for (const [x, z] of [[-2.9, -12.2], [-3.2, -11.3], [-5.7, -11.4]]) rock(x, .15, z, .4, false);
    // Tor + Steinlaternen
    const lq = b.lam("lacquer", 1, 4);
    for (const x of [-1.7, 1.7]) b.cyl(.15, .17, 3.4, 8, lq, x, 1.7, -9.4, .22);
    b.box(4.9, .22, .32, lq, 0, 3.45, -9.4); b.box(4, .15, .2, lq, 0, 2.9, -9.4);
    for (const x of [-2.7, 2.7]){
      b.box(.45, .2, .45, b.lam("stone", 1, 1), x, .1, -10.2, true); b.cyl(.1, .1, .6, 6, b.lam("stone", 1, 1), x, .5, -10.2);
      b.box(.36, .3, .36, new T.MeshBasicMaterial({ color: 0xffd28a }), x, .95, -10.2);
      const roof = b.add(new T.Mesh(new T.ConeGeometry(.42, .3, 4), b.lam("stone", 1, 1))); roof.position.set(x, 1.25, -10.2); roof.rotation.y = PI / 4;
      b.glow(x, .95, -10.2, 0xffb060, 1.3, 5);
    }
    // Kleiner Schrein
    b.box(2, .4, 1.5, b.lam("stone", 2, 1), 3.4, .2, -12.9, true);
    b.box(1.4, 1.1, 1, b.lam("woodD", 1, 1), 3.4, .95, -12.9);
    const sr = b.add(new T.Mesh(new T.ConeGeometry(1.25, .8, 4), lq)); sr.position.set(3.4, 1.9, -12.9); sr.rotation.y = PI / 4;
    b.glow(3.4, 1, -12.35, 0xffc070, 1.2, 3);
    for (let i = 0; i < 5; i++){ const x = -.8 + i * .4; b.cyl(.04, .04, .16, 6, b.col(0xf2ead6), x, .08, -13.5); b.glow(x, .24, -13.5, 0xffb24a, .32, 10 + i); }
    b.motes(30, -5, 5, .3, 4.5, -13, 1, 0xceff66, .07, .1);
    b.light(0x9a6aff, 1.1, 14, -3, 3, -6); b.light(0x6af0ff, .8, 12, 3, 2, -6); b.light(0xffc070, .9, 9, 0, 1.6, -12);
    b.gallery([[-5.93, 1.7, -2.6, HP], [-5.93, 1.7, -7.4, HP], [5.93, 1.7, -2.6, -HP], [5.93, 1.7, -7.4, -HP],
      [-3, 1.7, 1.93, PI], [0, 1.7, 1.93, PI], [3, 1.7, 1.93, PI], [-2.1, 1.75, -13.93, 0], [5.93, 1.7, -11.5, -HP]]);
    b.puzzle(0, 1.75, -13.9, 0);
  }
};
