# Ujios Kanalnetz – Projektkontext für Claude

## Wer & warum
- Besitzer: René (Instagram & Homepage „Ujio the Turtle Samurai“, ujio-turtle-samurai.com). Toyfotografie, Cosplay, Videos. Antworte auf Deutsch, per du, knapp und konkret.
- Problem dahinter: Instagram-Reichweite ist eingebrochen (früher ~10.000 Aufrufe, jetzt ~1.000), Follower sehen Posts nicht, KI-Bilder fluten die Toy-Community. Die Homepage wird kaum besucht.
- Idee: Die Homepage um ein spielerisches Erlebnis erweitern, das neugierig macht und geteilt wird. Später evtl. Ausbau zur Community-App.

## Bereits verworfen (nicht erneut vorschlagen)
- Neue Plattform / Instagram-Alternative, Newsletter-Digest, Marktplatz, AR-Sticker: zu wenig neu oder Vertrauens-/Mitmach-Problem.
- Alles mit Verkauf: In DE ohne Lizenz-Kooperation mit Herstellern nicht möglich.
- Instagram-API-Import: geht nur mit Creator-/Business-Konten; viele bleiben wegen Musikrechten privat.

## Was gebaut ist
Statisches Browser-Spiel im Ordner `kanalnetz/` (kein Build, kein Server-Code):
1. **Intro**: Stadt bei Nacht (Canvas, Regen, Dampf), Gullydeckel öffnen → Abstieg. Mitte des Deckels: Wasserzeichen-Logo in Neon-Lime (`img/ujio-gulli.png`, eingefärbt aus `../img/ujio_wasserzeichen_white.png`), in `intro.js` leicht vertikal gestreckt wegen der CSS-Kippung.
2. **Kanalkarte** (SVG): Tunnel, Spielfigur (Renés Logo `img/ujio-1p.png`, 90×160, zugeschnitten aus `../img/ujio_logo_insta_fs_2.png`, in `map.js`) läuft zur angetippten Kammer.
3. **Sechs 3D-Räume** im N64-Stil (three.js r128, 240p-Pixel-Rendering, prozedurale Pixel-Texturen):
   Geisterbahnhof (`nord`/`subway`), Dojo (`zisterne`/`dojo`), Teestube (`pumpe`/`tea`), Labor (`werkstatt`/`lab`), Jugendzimmer (`kino`/`teen`), Portalraum (`geheim`/`portal`, Finale; früher Schreinhöhle, `THEMES.cave` ist ungenutzt).
   Die IDs sind historisch; nicht umbenennen, sonst gehen Spielstände/Fotos verloren.
4. **Galerie**: Bilderrahmen an den Wänden mit Renés Fotos, Wellen-Effekt beim Nahekommen, Bildansicht. Kein Hochladen eigener Fotos mehr (alte IndexedDB `ujio-galerie` wird beim Laden gelöscht). 3D-Menü (Würfel-Knopf) = nur noch Retro-Pixel an/aus.
5. **Spielablauf pro Raum**: die 5 Zeitsplitter in den Bildern finden (Pflicht) → verhülltes Spezialbild (`b.puzzle`, `clothCanvas`) freilegen (`S.revealed`, Abzieh-Animation `World.peel`) → hineinspringen → Minispiel (`game` in `content.js`, Code in `rooms.js` `GAMES`) → gewonnen = Fundstücke + nächster Raum offen, Sieg-Fenster mit „Zurück ins Kanalnetz“ (`backToMap`).
   Spiele: Geisterbahnhof `flashlight` (Taschenlampe, Verstecke bei jedem Spielen zufällig: `randomSpots`/`flPos`, `hotspots` liefern nur IDs + Fundstücke), Dojo `break` (Bruchtest: Kraftbalken-Timing, 3 Runden; ersetzt das zu schwere Schiebepuzzle), Teestube `simon` (Klang-Melodie, 3 Runden), Labor `build` (Halten baut sichtbar einen Samurai-Helm in 5 Stufen `helmetSVG`, je Schritt ein echter Foam-Cosplay-Tipp `steps[].tip`), Jugendzimmer `arcade` (Logo antippen, Belohnung Zeitkern `k2`; Fernseher = Reels-Seite). Erster Sieg im aktuellen Spiel eines Raums (`S.won[raumId] = game`, `wonBefore`) → man bleibt im Spiel, nach kurzem Feiern erscheint das Fenster `#winpop` (`showWinPop`: Spezialbild `r.image` als Belohnung, „Geschafft!“ + „Zurück ins Kanalnetz“ / „Hier bleiben“; per Timer `backToMap()`), auch bei Wiederholungen. Labor ohne Timer: nach dem letzten Schritt Knopf „Helm fertig – Belohnung abholen“ (`#build-reward`), damit man den letzten Tipp in Ruhe lesen kann; „Noch mal spielen“ erst beim nächsten Betreten (`canReplay`, `justWon`), dann ohne neue Punkte und ohne Auto-Zurück (`flReplay`/`buildReplay`). Klang-Melodie hat eigenen Sound-an/aus-Knopf `#si-sound`.
   3D-Raum: Zähler `#w-seen` oben (`World.updateSeen`), Lampe über jedem Bild rot → grün nach Ansehen (`paintLamp`). Bildansicht: jede Pfeiltaste/WASD (man läuft gleich los), Esc, Wischen in jede Richtung oder Joystick bewegen = zurücktreten; Blättern nur über die Pfeil-Knöpfe. Joystick liegt bei offener Bildansicht darüber (`#s-3d.lb-open`), auf Touch-Geräten mit Platz unter der Bildansicht. Vollbild (nicht im iframe, `STANDALONE`): Link „Homepage“ auf Startbildschirm, im Dojo und im Abspann (`HOME_URL`).
   Finale Portalraum: Portal ist aus, öffnet sich sichtbar mit dem letzten gefundenen Zeitsplitter (`openK` in `THEMES.portal`; ohne Zeitkern flackert der Wirbel, Hinweis „Finde den Zeitkern im Jugendzimmer“). Durchgehen braucht alle Splitter + alle 5 Portalteile + **Portalcode** `missionCode` = `UJIO-THE-GAME` (steht in der Bildunterschrift des 2. angepinnten Instagram-Beitrags; wird erst auf der Portal-Seite als „letzte Prüfung“ verraten, nicht vorher in der Anleitung; Groß/klein/Bindestriche egal) → Abspann `showEnding()` (Bilderwand, „Danke fürs Spielen“, „René · Ujio the Turtle Samurai“, „To be continued … Back in Time“).
6. **Dojo-Seite**: 5 Ränge, Punkte, Inventar = Portalteile (Liste) + Zeitsplitter pro Raum, Story-Karte zum Screenshotten, Einstellungen. Fortschritt/Ränge zählen nur Zeitsplitter (30) + Portalteile (5) = 35 (`progress()`, `PROGRESS_MAX`; Ränge 0/8/16/26/35). Die alten Gegenstände (Schriftrolle, Laterne …) sind nur noch interne Marker fürs gelöste Minispiel, ohne Meldung und ohne Inventar.
7. Sound-Effekte komplett synthetisch (WebAudio), standardmäßig an (ältere Spielstände einmalig per `S.soundV2` umgestellt; AudioContext startet bei der ersten Berührung). Hintergrundmusik: `Music` in `core.js` spielt `../sound/Partywagon durch New York.mp3` in Schleife, standardmäßig an (`S.music`), startet bei der ersten Berührung/Taste (Autoplay-Sperre der Browser), Noten-Knopf `.js-music-pop` in jeder Kopfleiste öffnet das Musik-Menü `#vol-pop` (an/aus + Regler). Lautstärke-Regler `.js-vol` (Startbildschirm, Musik-Menü, Dojo). Der Startbildschirm kommt bei jedem Öffnen (Wiederkehrer: `LINES.back`), `S.vol` 0–100, Start 50 → Lautstärke `.4 * (vol/100)²` = 10 %.

8. **Geschichte**: Ujios Freund Kazu wurde von einem unbekannten Entführer durch die Zeit verschleppt (bewusst kein Name) (`CONTENT.story`, Namen dort änderbar). Beim ersten Einsteigen 3 Story-Karten (`showStory()` in `rooms.js`, später im Dojo „Geschichte & Anleitung“). Jedes Minispiel bringt ein **Portalteil** (`part` pro Raum bzw. `k2` im Jugendzimmer, Liste `CONTENT.portalParts`, 5 Stück); erst mit allen ist das Portal stabil. Abspann bewusst offen: „Du hast Kazu erfolgreich durchs Portal verfolgt. Wird es dir auch gelingen, ihn zu retten? To be continued … Back in Time“ (Fortsetzung möglich).
9. **Zeitsplitter (Hinweise)**: in 5 Bildern pro Raum (`HINTS` in `core.js`, Auswahl + Position fest aus der Raum-ID berechnet), wird in der Bildansicht direkt ins Foto gezeichnet (`drawShard` + `Lightbox.shardStart`, 8 vorberechnete Leucht-Stufen = Pulsieren), Antippen der Stelle (`Lightbox.tryShard`) = `markHint` (+30 Punkte). Bewusst kein HTML-Knopf mehr (sah bei veraltetem CSS kaputt aus). Alle Splitter eines Raums → Ujio erzählt eine Spur (`clue`). Spezialbild/Portal erst bei `unlockReady` = alle 5 Splitter des Raums. Bilder ansehen ist freiwillig und bringt nur Punkte: +20 je Bild (`points.view`), +150 Galerie-Bonus wenn alle Bilder eines Raums gesehen (`points.gallery`, Meldung `LINES.galleryDone`); Dojo zeigt pro Raum „x/y Bilder“. Blättern in der Bildansicht weiterhin erst, wenn alle Bilder selbst angelaufen wurden. Zwei Zähler oben im Raum (`#w-seen`: Bilder, Zeitsplitter).

## Architektur
- Klassische Skripte mit `defer`, gemeinsamer globaler Scope, **Reihenfolge in `index.html` zählt**:
  `i18n → content → core → intro → map → rooms → dojo → world/textures → world/engine → world/rooms3d → main`.
- **Zweisprachig (DE/EN)**: `index.html?lang=en` schaltet auf Englisch (`spiel_en.html` der Homepage bettet so ein). Jeder sichtbare Text in JS als `L("deutsch", "english")`, feste Texte in `index.html` per `data-en` / `data-en-html` / `data-en-aria`. Neue Texte immer in beiden Sprachen anlegen.
- Funktionen aus späteren Dateien nur **lazy** aufrufen (z. B. `() => openDojo()`), nie direkt als Referenz beim Laden übergeben.
- Inhalte nur in `js/content.js` (Räume, Texte, `gallery`, `hotspots`, `missionCode`, Links).
- 3D-Räume in `js/world/rooms3d.js`: je Raum eine Funktion in `THEMES`, Bausteine aus `makeBuilder` (`box`, `cyl`, `plane`, `glow`, `light`, `gallery`, `puzzle`, `spot`, `door`, `solid`). Jeder Raum hat eine Ausgangstür `b.door(x, z, ry)` an der Wand hinter dem Startpunkt (Schild „Zum Kanalnetz“, führt per `exit3D()` zur Karte; Zurück-Pfeil oben bleibt). Max. 3–4 `light()` pro Raum. Koordinaten in Metern, nach vorn = −z.
- Speicherstand: `localStorage` Key `ujio-kanalnetz-v2`. Sonst wird nichts gespeichert.
- Bildschirme: `show(id)` mit `s-intro`, `s-map`, `s-room`, `s-dojo`, `s-3d`.

## Design (von der Homepage übernommen)
- Farben: `--dark #0f1419`, `--surface #1a202c`, `--green #00a676`, Lime-CTA `#ceff66 → #89f240` mit Neon-Glow, `--orange #ff6b35`, `--purple #8b5fbf`, Text `#e2e8f0`, Radius 18px.
- Schriften: Bebas Neue (Überschriften), Source Sans 3 (Text), Silkscreen (Arcade-Labels).
- Desktop: App im Neon-Handyrahmen (wie Hero der Homepage). Nur dunkles Theme.

## Regeln
- **Keine externen Requests**: Schriften und three.js liegen lokal (`fonts/`, `lib/`). Keine Google Fonts, kein CDN, kein Tracking (DSGVO, Homepage wirbt mit „keine Tracking-Cookies“).
- **Rechte**: Keine Figuren, Logos oder Namen aus TMNT oder anderen Marken zeichnen/verwenden (keine Turtles, kein „Donnie“, „Splinter“ usw.). Räume bleiben allgemein („Labor“, „Teestube“). Den Bezug liefern Renés eigene Fotos.
- Mobile zuerst: Joystick links, Wischen zum Umsehen, Aktions-Button. Desktop: WASD, Maus ziehen, E.
- `prefers-reduced-motion` respektieren.

## Testen
- `index.html` hängt `?v=…` an CSS/JS (Cache-Busting). **Bei jedem Update die Versionsnummer hochzählen**, sonst mischen Browser alte und neue Dateien.
- VS Code + Live Server: `kanalnetz/index.html` → „Open with Live Server“.
- Nach Änderungen alle Räume einmal betreten (Konsole muss fehlerfrei sein).

## Offene nächste Schritte
- Galerien sind mit Fotos der Homepage gefüllt (`GALLERY` in `content.js`, Pfade `../img/…`, Anzahl pro Raum = Rahmen an der Wand: 11/14/11/12/11/9). Neue Rahmen in `rooms3d.js` immer hinten an `b.gallery([...])` anhängen. 3D-Test headless geht mit `--use-angle=swiftshader --enable-unsafe-swiftshader`; unter `--virtual-time-budget` laufen `requestAnimationFrame` und CSS-Animationen nicht weiter → im Test rAF per `setTimeout` ersetzen. Offen: echte Setup-Fotos (`setupImage`) für Making-ofs, ggf. Fotos der Bauschritte im Labor und Reel-Vorschauen im Jugendzimmer. Keine Platzhalter-/Test-Texte im Spiel zeigen – es soll fertig wirken.
- In jedes Galeriebild hineinspringen können (wie bei Mario 64), nicht nur ins Rätselbild.
- Link im Menü der Homepage; Veröffentlichung über GitHub (Pages oder FTP-Deploy per Action, Zugangsdaten nur in Secrets).


Ausführlicher Verlauf, wie es zu diesen Entscheidungen kam: `docs/gespraechsverlauf.md` (nur bei Bedarf lesen).
