# Gesprächsverlauf: Wie das Kanalnetz entstanden ist

Zusammenfassung des ursprünglichen Chats mit Claude (Oktober 2026), in zeitlicher Reihenfolge.

## 1. Ausgangsfrage
René wollte etwas bauen, das die Toyfotografie-Community besser verbindet als Instagram.

## 2. Ideen, die nicht gepasst haben
- **Community-Plattform** (Challenges, Behind-the-Shot-Rezepte, reisende Figuren, Feedback-Zirkel): „nicht weit genug gedacht“.
- **Reichweite außerhalb Instagram** (AR-Sticker in der Stadt, Browser-Tab-Erweiterung, 3D-Tiefenfotos, Publikum bestimmt die Story): „noch nicht das Richtige“.
- **Richtiges Produkt** (Mini-Me-Figuren als Geschenk, Marktplatz Marken ↔ Fotografen, Bilder-Suchmaschinen-Verteilung): verworfen, weil Verkäufe mit lizenzierten Figuren in DE ohne Hersteller-Kooperation nicht möglich sind.

## 3. Das eigentliche Problem
- Instagram-Reichweite eingebrochen: früher ~10.000 Aufrufe / 500 Likes, heute ~1.000 / unter 100.
- Follower sehen Posts nicht mehr („du postest ja gar nicht mehr“).
- KI-generierte Toy-Fotos überschwemmen die Community.

## 4. Zustell-Schicht für echte Kunst (verworfen)
- Idee: Instagram-Posts automatisch importieren, garantierter Wochen-Digest per Mail, „Handmade“-Siegel, später für alle Künstler.
- Recherche: Instagram-API nur für Creator-/Business-Konten, App-Review + Unternehmensverifizierung nötig; Scraping/inoffizielle Clients führen zu Sperren. Cara (Anti-KI-Plattform) wuchs 2024 schnell, Künstler waren aber erschöpft vom Neuaufbau des Publikums.
- Aus: Viele Toy-Fotografen bleiben wegen Musikrechten auf privaten Konten. Manuelles Teilen per App wäre zu viel Aufwand, und eine neue App hat kein Vertrauen.

## 5. Neuer Ansatz: die eigene Homepage spielerisch machen
- Ausgangspunkt: ujio-turtle-samurai.com (Abstieg in die Kanalisation per Gullydeckel als Intro).
- Prototyp 1: Kanalkarte, Kammern mit versteckten Details, Making-of-Slider, Ränge, Mission der Woche.
- Feedback „zu einfach“ → Prototyp 2 im Design der Homepage (Neon-Lime, Bebas Neue, Skyline, Arcade-Look): Stadt bei Nacht, Spielfigur auf der Karte, Taschenlampen-Suche, Bau-Minispiel, Röhren-TV-Kino, Punkte, Sound, Level-Up.

## 6. 3D-Räume im N64-Stil
- Wunsch: in jedem Raum in First Person herumlaufen, wie in einem N64-Spiel, mit einer Galerie der eigenen Werke an den Wänden (wie die Gemälde in Super Mario 64).
- Umsetzung mit three.js, 240p-Pixel-Look, prozeduralen Texturen. Rätselbild zum Hineinspringen, eigene Fotos testweise einsetzbar.
- Danach thematisch als Versteck in der Kanalisation umgebaut: Geisterbahnhof, Dojo, Teestube, Labor, Jugendzimmer, Schreinhöhle.
- Bewusst ohne Namen, Figuren oder Logos aus der Turtles-Serie (Rechte, öffentliche Seite). Den Bezug bringen Renés eigene Fotos.

## 7. Technik & Veröffentlichung
- Steuerung am Handy: Joystick links, Wischen zum Umsehen, Aktions-Button. Joystick erscheint bei jedem Gerät mit Touchscreen.
- Läuft auf normalem Webhosting. Schriften und three.js lokal eingebunden (keine Google Fonts, keine CDNs → DSGVO).
- Code aufgeteilt in einzelne Dateien für VS Code und GitHub, mit README und CLAUDE.md.

## Offene Punkte
- Echte Fotos einbauen (inkl. Setup-Fotos und Positionen der versteckten Details).
- In jedes Galeriebild hineinspringen können.
- Menü-Link auf der Homepage, Veröffentlichung über GitHub (Pages oder FTP-Deploy).
- Satz zur lokalen Speicherung in der Datenschutzerklärung.
- Später denkbar: Ausbau zur Community-Version (andere Künstler bekommen eigene Räume).
