// Start der App.

/* ---------- Start ---------- */
FX.resize(); drawLid(); updateStats();
Sound.set(S.sound); Music.set(S.music); Music.setVol(S.vol);
if (STANDALONE){ const h = $("#home-link"); h.href = HOME_URL; h.hidden = false; }
show("s-intro"); // Startbildschirm immer zeigen – Wiederkehrer begrüßt enter() mit LINES.back
