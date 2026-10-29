# Ujios Kanalnetz

Ein kleines Browser-Spiel für **ujio-turtle-samurai.com**: Besucher steigen durch einen Gullydeckel in Ujios Versteck, laufen in 3D (N64-Look) durch sechs Räume, schauen sich die Bilder an den Wänden an, lösen Rätsel und sammeln Punkte.

Reines HTML, CSS und JavaScript. Kein Build-Schritt, kein Server-Code, keine Datenbank.

## Ordnerstruktur

```
kanalnetz/
├── index.html            Grundgerüst (Bildschirme, Knöpfe, Icons)
├── css/style.css         Alle Styles (Farben & Schriften wie auf der Homepage)
├── js/
│   ├── i18n.js           Sprache: Deutsch oder Englisch (index.html?lang=en)
│   ├── content.js        ★ Inhalte: Räume, Texte, Bilder, Codewort
│   ├── core.js           Speicherstand, Sound, Effekte, Sprechblase, Punkte
│   ├── intro.js          Startbildschirm (Stadt bei Nacht, Gullydeckel)
│   ├── map.js            Kanalkarte mit Spielfigur
│   ├── rooms.js          Kammer-Seiten (Taschenlampen-Rätsel, Making-of, Bau-Spiel, TV)
│   ├── dojo.js           Rang, Inventar, Mission der Woche, Einstellungen
│   ├── world/
│   │   ├── textures.js   Pixel-Texturen & Bilder für die Rahmen
│   │   ├── engine.js     3D-Kamera, Steuerung, Kollision, Bildansicht
│   │   └── rooms3d.js    ★ Die sechs 3D-Räume (je eine Funktion)
│   └── main.js           Startet die App
├── img/                  Hier kommen deine Fotos hin
├── fonts/                Schriften, lokal eingebunden (keine Verbindung zu Google)
└── lib/three.min.js      3D-Bibliothek three.js r128
```

Die Skripte werden in `index.html` in genau dieser Reihenfolge geladen. Wenn du eine neue Datei anlegst, binde sie dort mit `<script src="…" defer></script>` an der passenden Stelle ein.

## Lokal testen in VS Code

1. Ordner in VS Code öffnen.
2. Erweiterung **Live Server** installieren (VS Code schlägt sie automatisch vor).
3. Rechtsklick auf `kanalnetz/index.html` → **Open with Live Server**.

Jede gespeicherte Änderung lädt die Seite im Browser neu.

## Inhalte ändern

Fast alles steht in **`js/content.js`**:

- `rooms` – Name, Texte (`intro`, `walk`) und Galerie jedes Raums
- `gallery` – Titel und Bildpfad jedes Rahmens, z. B. `{ title: "Kanal-Patrouille", image: "img/toyshot-01.webp" }`
- `image` – Foto für das Taschenlampen-Rätsel, `setupImage` – Foto vom Aufbau (nur dann gibt es ein Making-of)
- `hotspots` – Position der versteckten Details in Prozent
- `missionCode` – das Codewort der Woche für die Geheimkammer
- `instagram` / `reels` – deine Links

Fotos am besten im Hochformat 4:5 als WebP in `img/` ablegen.

## 3D-Räume anpassen

In **`js/world/rooms3d.js`** ist jeder Raum eine Funktion (`subway`, `dojo`, `tea`, `lab`, `teen`, `cave`). Die wichtigsten Bausteine:

| Baustein | Macht |
|---|---|
| `b.box(breite, höhe, tiefe, material, x, y, z, solid)` | Kiste/Möbel, `solid` = man kann nicht durchlaufen |
| `b.cyl(...)`, `b.plane(...)` | Zylinder, Fläche |
| `b.glow(x, y, z, farbe, größe)` | Leuchtpunkt (Lampen, Kerzen) |
| `b.light(farbe, stärke, reichweite, x, y, z)` | Echte Lichtquelle (max. 3–4 pro Raum) |
| `b.gallery([[x, y, z, drehung], …])` | Bilderrahmen an die Wand |
| `b.puzzle(x, y, z, drehung)` | Leuchtendes Rätselbild zum Hineinspringen |

Koordinaten in Metern: x = links/rechts, y = Höhe, z = nach vorn ist negativ.

## In die Homepage einbauen

1. Den Ordner `kanalnetz/` in das Hauptverzeichnis deines Homepage-Repos kopieren (neben `index.html`, `toys.html` …).
2. Im Menü verlinken, z. B.:

```html
<a class="nav-link" href="kanalnetz/">Kanalnetz</a>
```

Danach ist das Spiel unter `https://ujio-turtle-samurai.com/kanalnetz/` erreichbar.

## Veröffentlichen über GitHub

```bash
git add kanalnetz
git commit -m "Kanalnetz-Spiel hinzugefügt"
git push
```

- **GitHub Pages:** Nach dem Push ist es nach ein, zwei Minuten online.
- **Eigenes Webhosting:** Entweder wie gewohnt per FTP hochladen oder per GitHub Action automatisch deployen lassen (z. B. mit einer FTP-Deploy-Action; Zugangsdaten gehören dann in die Repository-Secrets, nie in den Code).

## Datenschutz

- Alle Dateien kommen von deiner eigenen Domain. Es gibt keine Verbindung zu Google, CDNs oder Tracking-Diensten.
- Fortschritt, Punkte und Einstellungen speichert das Spiel nur im Browser der Besucher (localStorage). Nichts davon wird übertragen.

## Lizenzen von Drittanbietern

- three.js r128 – MIT-Lizenz (`lib/three-LICENSE.txt`)
- Bebas Neue, Silkscreen, Source Sans 3 – SIL Open Font License (`fonts/OFL-*.txt`)
