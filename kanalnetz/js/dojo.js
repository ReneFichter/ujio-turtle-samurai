// Dojo: Rang, Inventar, Story-Karte, Einstellungen.

/* ---------- Dojo ---------- */
let confirmReset = false;
function openDojo(){ if (walking) return; stopLight(); confirmReset = false; renderDojo(); show("s-dojo"); }
$("#dojo-back").addEventListener("click", openMap);

function renderDojo(){
  const n = total(), i = rankIdx(n), r = CONTENT.ranks[i], nx = CONTENT.ranks[i + 1];
  const pct = nx ? ((n - r.at) / (nx.at - r.at)) * 100 : 100;
  $("#dojo-body").innerHTML = `
  <div class="dojo">
    <div class="player">${hexBadge(i)}
      <div class="info"><p class="eyebrow">${L("Spieler 1 · Rang", "Player 1 · Rank")}</p><div class="rname">${esc(r.name)}</div>
        <div class="score-big">${pad6(S.score)}</div></div>
    </div>
    <div class="card">
      <div class="meta"><span>${nx ? L("Nächster Rang: ", "Next rank: ") + esc(nx.name) : L("Höchster Rang erreicht", "Highest rank reached")}</span><span>${n}/${PROGRESS_MAX}</span></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="ladder">${CONTENT.ranks.map((k, j) => `<div class="${j <= i ? "got" : ""}"><i>${j + 1}</i>${esc(k.name)}</div>`).join("")}</div>
    </div>
    <div class="card">
      <p class="eyebrow">${L("Portalteile", "Portal parts")} · ${partsFound()} ${L("von", "of")} ${CONTENT.portalParts.length}</p>
      <div class="plist">${CONTENT.portalParts.map(id => { const a = ALL.find(x => x.id === id), got = S.found[id], it = CONTENT.items[a.item], where = ROOM[a.room].mapName || ROOM[a.room].name;
        return `<div class="prow${got ? " got" : ""}"><i>${got ? icon(it.icon) : "?"}</i><span><b>${got ? esc(it.name) : "???"}</b><small>${esc(where)}</small></span>${got ? icon("i-check", "ok") : ""}</div>`; }).join("")}</div>
      <p class="eyebrow" style="margin-top:16px">${L("Zeitsplitter", "Time shards")} · ${shardsFound()} ${L("von", "of")} ${SHARD_MAX}</p>
      <div class="shards">${CONTENT.rooms.filter(rm => isOpen(rm) || hintCount(rm)).map(rm => `<div class="srow"><span>${esc(rm.mapName || rm.name)}</span><span class="sl">${Object.keys(HINTS[rm.id]).map(i => `<i class="${S.hints[`${rm.id}:${i}`] ? "on" : ""}">${icon("i-crystal")}</i>`).join("")}</span></div>`).join("")}
        ${CONTENT.rooms.some(rm => !isOpen(rm) && !hintCount(rm)) ? `<p class="small" style="margin:6px 0 0">${L("Weitere Räume warten noch im Kanalnetz …", "More rooms are still waiting in the sewers …")}</p>` : ""}</div>
    </div>
    <div>
      <p class="eyebrow" style="margin-bottom:10px">${L("Für deine Story", "For your story")}</p>
      <div class="share"><canvas id="mini-city" aria-hidden="true"></canvas>
        <div class="sbody"><span class="pixel" style="color:var(--yellow)">LV ${i + 1} · ${pad6(S.score)} ${L("Punkte", "points")}</span>
          <div class="sbig">${L(`Ich bin ${esc(r.name)} in Ujios Kanalnetz`, `I'm a ${esc(r.name)} in Ujio's Sewer Network`)}</div>
          <span class="small">${L(`${shardsFound()} von ${SHARD_MAX} Zeitsplittern · ${partsFound()}/${CONTENT.portalParts.length} Portalteile`, `${shardsFound()} of ${SHARD_MAX} time shards · ${partsFound()}/${CONTENT.portalParts.length} portal parts`)}</span>
          <span class="url">ujio-turtle-samurai.com</span></div></div>
      <p class="small" style="margin:10px 0">${L("Mach einen Screenshot von dieser Karte und teile ihn in deiner Instagram-Story.", "Take a screenshot of this card and share it in your Instagram story.")}</p>
      <div class="row"><button class="btn ghost sm" id="copy-link">${L("Link kopieren", "Copy link")}</button><span class="small" id="copy-msg"></span></div>
    </div>
    <div class="card">
      <p class="eyebrow">${L("Einstellungen", "Settings")}</p>
      <div class="row"><button class="btn ghost sm js-sound2">${icon(S.sound ? "i-sound" : "i-mute")}Sound ${S.sound ? L("aus", "off") : L("an", "on")}</button>
        <button class="btn ghost sm" id="story-again">${icon("i-hourglass")}${L("Geschichte & Anleitung", "Story & how to play")}</button>
        ${STANDALONE ? `<a class="btn ghost sm" href="${HOME_URL}">${icon("i-back")}${L("Zur Homepage", "To the homepage")}</a>` : ""}
        <button class="btn ghost sm js-music2">${icon(S.music ? "i-music" : "i-music-off")}${S.music ? L("Musik aus", "Music off") : L("Musik an", "Music on")}</button></div>
      <label class="vol">${icon("i-music")}<span>${L("Lautstärke", "Volume")}</span><input type="range" class="js-vol" min="0" max="100" step="1" value="${S.vol}" aria-label="${L("Lautstärke der Musik", "Music volume")}"></label>
      ${confirmReset ? `<div class="confirm"><p>${L("Alle Fundstücke, Punkte und dein Rang gehen auf diesem Gerät verloren.", "All items, points and your rank will be lost on this device.")}</p>
          <div class="row"><button class="btn danger sm" id="reset-yes">${L("Ja, zurücksetzen", "Yes, reset")}</button><button class="btn ghost sm" id="reset-no">${L("Abbrechen", "Cancel")}</button></div></div>`
        : `<p class="small" style="margin:0">${L("Dein Fortschritt bleibt nur auf diesem Gerät. Kein Konto, keine Daten.", "Your progress stays on this device only. No account, no data.")}</p>
           <div class="row"><button class="btn ghost sm" id="reset">${L("Fortschritt zurücksetzen", "Reset progress")}</button></div>`}
    </div>
  </div>`;
  wireDojo();
}
function wireDojo(){
  const cv = $("#mini-city");
  if (cv) requestAnimationFrame(() => { const b = cv.getBoundingClientRect(); if (!b.width || !b.height) return; const dpr = Math.min(2, devicePixelRatio || 1); cv.width = b.width * dpr; cv.height = b.height * dpr;
    const built = drawSkyline(b.width, b.height, dpr, .82, 7); const g = cv.getContext("2d"); g.drawImage(built.off, 0, 0); });
  $("#copy-link")?.addEventListener("click", () => {
    const m = $("#copy-msg"), p = navigator.clipboard?.writeText(CONTENT.site);
    if (p) p.then(() => m.textContent = L("Link kopiert.", "Link copied.")).catch(() => m.textContent = CONTENT.site); else m.textContent = CONTENT.site;
  });
  $("#story-again")?.addEventListener("click", () => showStory());
  $(".js-sound2")?.addEventListener("click", () => { Sound.set(!S.sound); renderDojo(); });
  $(".js-music2")?.addEventListener("click", () => { Music.set(!S.music); renderDojo(); });
  $("#dojo-body .js-vol")?.addEventListener("input", e => Music.setVol(e.target.value));
  $("#reset")?.addEventListener("click", () => { confirmReset = true; renderDojo(); });
  $("#reset-no")?.addEventListener("click", () => { confirmReset = false; renderDojo(); });
  $("#reset-yes")?.addEventListener("click", () => { const snd = S.sound, mus = S.music; S = blank(); S.sound = snd; S.music = mus; save(); confirmReset = false; updateStats(); show("s-intro"); });
}
