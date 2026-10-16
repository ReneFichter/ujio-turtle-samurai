// Texte, Räume, Bilder, Codewort – hier pflegst du die Inhalte.
// Jeder Text steht als L("deutsch", "english") – beide Sprachen direkt nebeneinander.

/* =====================================================================
   INHALTE – Bilder & Texte des Spiels.
   image: Rätselbild (Taschenlampen-Suche). setupImage: Foto vom Aufbau – nur wenn gesetzt, gibt es nach dem Lösen ein Making-of (Setup ↔ fertiges Bild, optional facts: [[Titel, Text, Icon], …])
   game: Minispiel hinter dem Spezialbild (flashlight, break, simon, build, arcade; portal = Finale).
   Ablauf: alle Bilder der gallery ansehen -> Spezialbild freilegen -> Minispiel gewinnen = nächster Raum offen.
   hotspots (nur flashlight): x / y in Prozent der Bildbreite / -höhe – dort liegt das versteckte Detail. rewards: Fundstücke der übrigen Spiele.
   ===================================================================== */
function G(p, n){ return Array.from({ length: n }, (_, i) => ({ title: `${p} ${String(i + 1).padStart(2, "0")}`, image: null })); }
// Galerie aus den Fotos der Homepage (../img/ = img-Ordner neben kanalnetz/). Anzahl pro Raum muss gleich bleiben (= Rahmen an der Wand).
function P(list){ return list.map(([file, de, en]) => ({ title: L(de, en), image: "../img/" + file })); }
const GALLERY = {
  nord: P([
    ["toyphotos/toyphoto-gimli-ghosts.jpg", "Geisterheer", "Ghost army"],
    ["toyphotos/toyphoto-the-crow.jpg", "Schwarz-Weiß", "Black & white"],
    ["toyphotos/toyphoto-death.jpg", "Der Tod", "Death"],
    ["toyphotos/toyphoto-alien.jpg", "Aus dem Schacht", "Out of the shaft"],
    ["toyphotos/toyphoto-ryuk.jpg", "Rotes Licht", "Red light"],
    ["toyphotos/toyphoto-roof-ghost.jpg", "Dachgeist", "Roof ghost"],
    ["toyphotos/toyphoto-zobie.jpg", "Prost!", "Cheers!"],
    ["toyphotos/toyphoto-moria.jpg", "Tief in den Minen", "Deep in the mines"],
    ["toyphotos/toyphoto-das-ende.jpg", "Das Ende", "The end"],
    ["toyphotos/toyphoto-devil-knie.jpg", "Auf die Knie", "On your knees"],
    ["toyphotos/toyphoto-gollum.jpg", "Im Dunkeln", "In the dark"]
  ]),
  zisterne: P([
    ["toyphotos/toyphoto-brueder-samurai.jpg", "Brüder", "Brothers"],
    ["toyphotos/toyphoto-leonardo-hooded-sword-portrait.jpg", "Kapuze und Klinge", "Hood and blade"],
    ["toyphotos/toyphoto-sakonji.jpg", "Kirschblüte", "Cherry blossom"],
    ["toyphotos/toyphoto-bruce-lee-vater-und-meister.jpg", "Vater und Meister", "Father and master"],
    ["toyphotos/Raph-Sai.jpg", "Sai", "Sai"],
    ["toyphotos/toyphoto-foot.jpg", "Schattenkrieger", "Shadow warriors"],
    ["toyphotos/toyphoto-leo-is-coming-home.jpg", "Heimkehr", "Homecoming"],
    ["toyphotos/Raphy--bw.jpg", "Grauzone", "Shades of grey"],
    ["toyphotos/New-Turtles.jpg", "Neue Generation", "New generation"],
    ["toyphotos/JoyToy-Team.jpg", "Das Team", "The team"],
    ["toyphotos/JoyToy-Waterjump.jpg", "Sprung ins Wasser", "Water jump"],
    ["toyphotos/Casey_Leo.jpg", "Partner", "Partners"],
    ["toyphotos/toyphoto-krang-fight.jpg", "Der Kampf", "The fight"],
    ["toyphotos/Chrome-Dome.jpg", "Metallkrieger", "Metal warrior"]
  ]),
  pumpe: P([
    ["toyphotos/Buddha-Neu.jpg", "Buddha", "Buddha"],
    ["toyphotos/toyphoto-gandalf.jpg", "Der Wanderer", "The wanderer"],
    ["toyphotos/toyphoto-mud-ducks.jpg", "Entenausflug", "Duck outing"],
    ["toyphotos/toyphoto-monkey.jpg", "Schneeaffe", "Snow monkey"],
    ["toyphotos/toyphoto-spyro.jpg", "Kleiner Drache", "Little dragon"],
    ["toyphotos/toyphoto-adler.jpg", "Der Adler", "The eagle"],
    ["toyphotos/toyphoto-lapras.jpg", "Auf dem Wasser", "On the water"],
    ["toyphotos/toyphoto-fern.jpg", "Stille", "Silence"],
    ["toyphotos/toyphoto-link-reseti.jpg", "Abenteuer", "Adventure"],
    ["toyphotos/toyphoto-steinweg.jpg", "Steinweg", "Stone path"],
    ["toyphotos/Motu-Plant-Neu.jpg", "Grüner Daumen", "Green thumb"]
  ]),
  werkstatt: P([
    ["cosplays/cultist/cultist-cosplay-main.jpg", "Kultist", "Cultist"],
    ["cosplays/zepter/zepter-full.jpg", "Zepter", "Sceptre"],
    ["cosplays/ooze/mutagen-ooze-prop.jpg", "Leuchtschleim", "Glowing goo"],
    ["cosplays/roshi/Muten_front.jpg", "Alter Meister", "Old master"],
    ["cosplays/shredder/Shredder_Con_Sword.jpg", "Rüstung auf der Con", "Armour at the con"],
    ["cosplays/bebop/bebop-future-mutant-samurai-cosplay-artwork.jpg", "Zukunftssamurai", "Future samurai"],
    ["cosplays/bebop/Bebop-am-Stein.jpg", "Am Stein", "On the rock"],
    ["cosplays/bebopwaffe/bebop-waffe.jpg", "Die Waffe", "The weapon"],
    ["cosplays/bebopwaffe/Bebop-Neon.jpg", "Neon", "Neon"],
    ["cosplays/zepter/zepter-closeup.jpg", "Zepter im Detail", "Sceptre close-up"],
    ["cosplays/cultist/cultist-cosplay-mask-detail.jpg", "Die Maske", "The mask"],
    ["Rene-zeichnung.jpg", "Die Skizze", "The sketch"]
  ]),
  kino: P([
    ["toyphotos/toyphoto-kino.jpg", "Filmabend", "Movie night"],
    ["toyphotos/toyphoto-the-claw.jpg", "Greifautomat", "Claw machine"],
    ["toyphotos/toyphoto-superseven.jpg", "Roadtrip", "Road trip"],
    ["toyphotos/toyphoto-blanka-turtles.jpg", "Jahrmarkt", "Funfair"],
    ["toyphotos/toyphoto-spongebob.jpg", "Unter Wasser", "Under the sea"],
    ["toyphotos/toyphoto-anya-deadpool.jpg", "Einhornritt", "Unicorn ride"],
    ["toyphotos/toyphoto-south-park.jpg", "Winterchaos", "Winter chaos"],
    ["toyphotos/toyphoto-leo-funko.jpg", "Kleiner Held", "Little hero"],
    ["toyphotos/Monodo-YOYO.jpg", "Jo-Jo", "Yo-yo"],
    ["toyphotos/Peanuts-Robber.jpg", "Der Räuber", "The robber"],
    ["toyphotos/Ujio-Stand-ComicCon.jpg", "Mein Con-Stand", "My con booth"]
  ]),
  geheim: P([
    ["toyphotos/toyphoto-spawn.jpg", "Höllenfeuer", "Hellfire"],
    ["toyphotos/toyphoto-demonslayer-evil.jpg", "Dämon", "Demon"],
    ["toyphotos/toyphoto-fall.jpg", "Der Fall", "The fall"],
    ["toyphotos/toyphoto-muzan.jpg", "Dunkler Herr", "Dark lord"],
    ["toyphotos/toyphoto-mumakil.jpg", "Kriegselefant", "War elephant"],
    ["toyphotos/toyphoto-labor-2.jpg", "Geheimlabor", "Secret lab"],
    ["cosplays/shredder/Samurai_Shredder.jpg", "Dunkler Samurai", "Dark samurai"],
    ["cosplays/krang/krang-portrait.jpg", "Der Denker", "The thinker"],
    ["cosplays/roshi/Muten_turtle.jpg", "Der Panzer", "The shell"]
  ])
};
const CONTENT = {
  site: "https://ujio-turtle-samurai.com/",
  instagram: "https://www.instagram.com/ujio_the_turtle_samurai/",
  reels: "https://www.instagram.com/ujio_the_turtle_samurai/reels/",
  // Portalcode fürs Zeitreiseportal (steht in der Bildunterschrift des 2. angepinnten Beitrags auf Ujios Instagram-Profil; wird erst am Portal verraten). Groß/klein, Leerzeichen und Bindestriche sind beim Eingeben egal.
  missionCode: "UJIO-THE-GAME",
  points: { find: 100, solve: 250, step: 50, reward: 100, mission: 500, view: 20, reveal: 100, hint: 30 },
  // Geschichte: Namen hier ändern, sie werden überall im Spiel verwendet
  story: {
    friend: "Kazu",
    villain: L("ein unbekannter Entführer", "an unknown kidnapper"),
    pages: [
      { title: L("Alarm im Kanal!", "Trouble in the sewers!"), icon: "i-hourglass",
        text: L("Mein bester Freund Kazu wurde entführt! Ein unbekannter Entführer hat ihn durch ein Zeitportal verschleppt, irgendwohin in Zeit und Raum. Ich habe ein eigenes Portal gebaut, aber seine fünf Teile sind im ganzen Kanalnetz verstreut. Hilf mir, Kazu zu retten!",
                "My best friend Kazu has been kidnapped! An unknown kidnapper dragged him through a time portal, somewhere in time and space. I built a portal of my own, but its five parts are scattered all over the sewer network. Help me rescue Kazu!") },
      { title: L("So findest du die Spur", "How to follow the trail"), icon: "i-frame",
        list: [ L("Betritt die Räume und sieh dir jedes Bild an. Die Lampe darüber wird grün.", "Enter the rooms and look at every picture. The lamp above it turns green."),
                L("In fünf Bildern pro Raum steckt ein leuchtender Zeitsplitter. Schau genau hin und tipp ihn an.", "Five pictures in each room hide a glowing time shard. Look closely and tap it."),
                L("Hast du alle Bilder und Splitter, kannst du das Spezialbild freilegen und hineinspringen.", "Once you have every picture and shard, you can uncover the special picture and jump in.") ] },
      { title: L("Das Ziel", "Your goal"), icon: "i-core",
        list: [ L("Jedes gelöste Minispiel bringt dir ein Teil für das Zeitreiseportal.", "Every mini game you solve gives you a part for the time travel portal."),
                L("Mit allen fünf Teilen öffnet sich das Portal im letzten Raum. Dort wartet noch eine letzte Prüfung auf dich.", "With all five parts the portal in the last room opens. One final test awaits you there."),
                L("Dann reisen wir durch Zeit und Raum und holen Kazu zurück!", "Then we travel through time and space and bring Kazu back!") ] }
    ]
  },
  // Portalteile: je eines pro Minispiel-Raum. Erst mit allen öffnet sich das Portal.
  portalParts: ["pp1", "pp2", "pp3", "pp4", "k2"],
  items: {
    scroll:   { name: L("Schriftrolle", "Scroll"),       icon: "i-scroll" },
    shuriken: { name: "Shuriken",                         icon: "i-shuriken" },
    coin:     { name: L("Kanalmünze", "Sewer coin"),     icon: "i-coin" },
    lantern:  { name: L("Laterne", "Lantern"),           icon: "i-lantern" },
    fan:      { name: L("Kampffächer", "War fan"),       icon: "i-fan" },
    hammer:   { name: L("Werkzeug", "Tool"),             icon: "i-hammer" },
    film:     { name: L("Filmrolle", "Film reel"),       icon: "i-film" },
    core:     { name: L("Zeitkern", "Time core"),        icon: "i-core" },
    gear:     { name: L("Zeitzahnrad", "Time gear"),     icon: "i-gear" },
    crystal:  { name: L("Energiekristall", "Energy crystal"), icon: "i-crystal" },
    lens:     { name: L("Zeitlinse", "Time lens"),       icon: "i-lens" },
    chip:     { name: L("Steuerchip", "Control chip"),   icon: "i-chip" },
    hourglass:{ name: L("Sanduhr", "Hourglass"),         icon: "i-hourglass" }
  },
  start: { x: 180, y: 42 },
  rooms: [
    { id: "nord", no: "01", game: "flashlight", name: L("Geisterbahnhof", "Ghost Station"), kind: "Toyshot", x: 84, y: 158, requires: null,
      walk: L("Willkommen im Geisterbahnhof! Schau dir jedes Bild an den Kacheln an und such in den Bildern nach leuchtenden Zeitsplittern. Hast du alles, kannst du das Spezialbild ganz hinten freilegen.",
              "Welcome to the Ghost Station! Look at every picture on the tiles and search them for glowing time shards. Once you have everything, you can uncover the special picture at the very back."),
      world: { theme: "subway", fog: "#0c1512", near: 3, far: 24, amb: 0x3d4a44, ambI: .8, art: ["#0b2a22", "#1d6b4f", "#ceff66"], seed: 1, spawn: [-2.5, .8, -.32] }, gallery: GALLERY.nord,
      intro: L("Ein vergessener U-Bahnhof tief unter der Stadt. Nimm die Taschenlampe und such drei Dinge, die nicht hierher gehören.",
               "A forgotten subway station deep beneath the city. Grab the flashlight and find three things that don't belong here."),
      look: { wall: "#24323a", water: "#00a676", glow: "#ffd36b", vp: [0.56, 0.44], seed: 3 },
      image: "../img/toyphotos/Out-of-the-sewer.jpg", setupImage: null,
      hotspots: [ { id: "n1", x: 22, y: 70, item: "scroll" }, { id: "n2", x: 76, y: 30, item: "shuriken" }, { id: "n3", x: 58, y: 86, item: "coin" } ],
      part: { id: "pp1", item: "gear" },
      clue: L("Alle Zeitsplitter gefunden! Sie zeigen Spuren: Der unbekannte Entführer hat Kazu hier durch die alten Tunnel geschleppt.", "All time shards found! They show traces: the unknown kidnapper dragged Kazu through the old tunnels here.") },
    { id: "zisterne", no: "02", game: "break", name: L("Das Dojo", "The Dojo"), kind: "Toyshot", x: 276, y: 268, requires: "nord",
      walk: L("Das Dojo. Hier wird jeden Tag trainiert. Schau dir erst alle Bilder an den Wänden an. Hinten zwischen den Bannern wartet das Spezialbild.",
              "The Dojo. Training happens here every day. First look at all the pictures on the walls. The special picture waits at the back between the banners."),
      world: { theme: "dojo", fog: "#1a120c", near: 4, far: 26, amb: 0x6a5a48, ambI: .75, art: ["#2a1a0c", "#7a4a22", "#ffd36b"], seed: 2, spawn: [0, .8, 0] }, gallery: GALLERY.zisterne,
      intro: L("Bruchtest! Schlag zu, wenn der Zeiger im grünen Bereich ist. Drei Runden, immer mehr Bretter.",
               "Board break! Strike when the needle is in the green zone. Three rounds, more boards each time."),
      look: { wall: "#3a2d22", water: "#2bbfa0", glow: "#ffb35a", vp: [0.4, 0.4], seed: 11 },
      image: "../img/toyphotos/toyphoto-blood-ninja.jpg", setupImage: null,
      rewards: [ { id: "z1", item: "lantern" }, { id: "z2", item: "fan" }, { id: "z3", item: "scroll" } ],
      part: { id: "pp2", item: "crystal" },
      clue: L("Alle Zeitsplitter gefunden! Hier gab es einen Kampf. Kazu hat sich gewehrt, aber der Entführer war schneller.", "All time shards found! There was a fight here. Kazu fought back, but the kidnapper was faster.") },
    { id: "pumpe", no: "03", game: "simon", name: L("Die Teestube", "The Tea Room"), kind: "Toyshot", x: 100, y: 384, requires: "zisterne",
      walk: L("Die Teestube des Meisters. Sieh dir in Ruhe alle Bilder an. Links neben der Nische wartet das verhüllte Spezialbild.",
              "The master's tea room. Take your time and look at every picture. The veiled special picture waits to the left of the alcove."),
      world: { theme: "tea", fog: "#1a130c", near: 3, far: 22, amb: 0x6a5a48, ambI: .8, art: ["#2a0f08", "#8a3a1a", "#ff9a5c"], seed: 3, spawn: [0, .8, 0] }, gallery: GALLERY.pumpe,
      intro: L("Die Klangsteine des Meisters spielen eine Melodie. Hör genau hin und spiel sie nach.",
               "The master's sound stones play a melody. Listen closely and play it back."),
      look: { wall: "#3b2622", water: "#ff6b35", glow: "#ff9a5c", vp: [0.62, 0.42], seed: 21 },
      image: "../img/toyphotos/toyphoto-meditation.jpg", setupImage: null,
      rewards: [ { id: "p1", item: "shuriken" }, { id: "p2", item: "coin" }, { id: "p3", item: "lantern" } ],
      part: { id: "pp3", item: "lens" },
      clue: L("Alle Zeitsplitter gefunden! Der Entführer hat hier Rast gemacht und von einem Portal in eine andere Zeit gesprochen.", "All time shards found! The kidnapper rested here and talked about a portal to another time.") },
    { id: "werkstatt", no: "04", game: "build", name: L("Das Labor", "The Lab"), kind: "Cosplay", x: 272, y: 500, requires: "pumpe",
      walk: L("Das Labor! Überall Bildschirme, Kabel und meine Cosplays. Schau dir alle Bilder an, dann wartet unter der Kreidetafel das Spezialbild. Wer hier fertig baut, findet den Weg in den letzten Raum.",
              "The Lab! Screens, cables and my cosplays everywhere. Look at all the pictures, then the special picture waits below the chalkboard. Finish building here and you'll find the way to the last room."),
      world: { theme: "lab", fog: "#0e1614", near: 5, far: 28, amb: 0x6a7a76, ambI: .95, art: ["#141a33", "#3b2a5a", "#ff6b35"], seed: 4, spawn: [0, .8, 0], frame: "metalF" }, gallery: GALLERY.werkstatt,
      intro: L("Mein Labor und meine Werkstatt. Hier entstehen Rüstungen, Requisiten und verrückte Ideen. Halt den Knopf gedrückt und bau mit.",
               "My lab and workshop. Armour, props and crazy ideas are made here. Hold the button and build along."),
      image: "../img/cosplays/krang/krang-wagon-prop.jpg", reward: "w1", rewardItem: "hammer",
      part: { id: "pp4", item: "chip" },
      clue: L("Alle Zeitsplitter gefunden! Meine Baupläne sind durchwühlt. Der Entführer hat mein Portal kopiert, wir brauchen alle Teile, um ihm zu folgen.", "All time shards found! My blueprints have been rummaged through. The kidnapper copied my portal, we need every part to follow him."),
      // Bau-Spiel: Beim Halten entsteht Schritt für Schritt ein Samurai-Helm. tip = echter Tipp zum Foam-Cosplaybau
      steps: [
        { title: L("Idee & Skizze", "Idea & sketch"),
          text: L("Am Anfang stehen eine Zeichnung und jede Menge Referenzbilder.", "It all starts with a drawing and lots of reference pictures."),
          tip: L("Sammle Referenzbilder von vorne, hinten und von der Seite. Zeichne dein Teil dann in Originalgröße auf Papier, so siehst du sofort, ob die Proportionen passen.",
                 "Collect reference pictures from the front, back and side. Then draw your piece at full size on paper, so you can see right away whether the proportions work.") },
        { title: L("Schnittmuster", "Pattern"),
          text: L("Aus der Skizze werden flache Teile, die später zusammengeklebt werden.", "The sketch is turned into flat pieces that get glued together later."),
          tip: L("Klebeband-Trick: Kopf oder Körperteil mit Frischhaltefolie und Kreppband umwickeln, die Nähte aufzeichnen, aufschneiden, fertig ist das Schnittmuster. Erst mal aus Pappe testen!",
                 "Tape trick: wrap your head or body part in cling film and masking tape, draw the seams, cut it open and there's your pattern. Test it in cardboard first!") },
        { title: L("Foam zuschneiden & kleben", "Cut & glue the foam"),
          text: L("Die Teile werden aus EVA-Foam geschnitten und zusammengeklebt.", "The pieces are cut from EVA foam and glued together."),
          tip: L("Scharfes Cuttermesser und die Klinge oft wechseln, stumpfe Klingen reißen den Foam. Kontaktkleber dünn auf beide Seiten, kurz ablüften lassen, dann fest zusammendrücken.",
                 "Use a sharp utility knife and change the blade often, blunt blades tear the foam. Apply contact cement thinly to both sides, let it dry for a moment, then press firmly together.") },
        { title: L("Formen & Details", "Shaping & details"),
          text: L("Der Helm bekommt seine Form, Kanten, Nieten und Hörner.", "The helmet gets its shape, edges, rivets and horns."),
          tip: L("Foam mit dem Heißluftfön erwärmen, dann lässt er sich biegen und behält die Form. Nieten sind kleine Foam-Kreise, Kratzer und Linien machst du mit Lötkolben oder Dremel.",
                 "Warm the foam with a heat gun, then it bends and keeps its shape. Rivets are small foam circles, scratches and lines are made with a soldering iron or rotary tool.") },
        { title: L("Versiegeln & Bemalen", "Seal & paint"),
          text: L("Versiegeln, Farbe, Metallic und Schmutz für den echten Look.", "Sealing, paint, metallic and dirt for the real look."),
          tip: L("Foam immer erst versiegeln (z. B. mit Plasti Dip oder Flexbond), sonst saugt er die Farbe auf. Für den gebrauchten Look dunkle Farbe auftragen und sofort wieder abwischen, sie bleibt nur in den Ritzen.",
                 "Always seal foam first (e.g. with Plasti Dip or Flexbond), otherwise it soaks up the paint. For a worn look, apply dark paint and wipe it off straight away, it only stays in the cracks.") }
      ] },
    { id: "kino", no: "05", game: "arcade", name: L("Das Jugendzimmer", "The Teen Room"), mapName: L("Jugendzimmer", "Teen Room"), kind: "Videos", x: 60, y: 590, requires: "pumpe",
      walk: L("Das Jugendzimmer! Skaterampe, Pizza und ein alter Röhrenfernseher mit meinen Reels. Sieh dir alle Bilder an, dann kannst du das Spezialbild unter dem Basketballkorb freilegen. Dahinter wartet etwas, das du ganz am Ende brauchst.",
              "The Teen Room! Skate ramp, pizza and an old CRT TV with my reels. Look at all the pictures, then you can uncover the special picture below the basketball hoop. Behind it waits something you'll need at the very end."),
      world: { theme: "teen", fog: "#140c14", near: 4, far: 26, amb: 0x5a4a5a, ambI: .8, art: ["#12061a", "#4a1a5a", "#ceff66"], seed: 5, spawn: [0, .8, 0], frame: "frameW" }, gallery: GALLERY.kino,
      intro: L("Arcade-Zeit! Tipp mein Logo an, sobald es auftaucht. Zehn Treffer in 30 Sekunden.",
               "Arcade time! Tap my logo as soon as it pops up. Ten hits in 30 seconds."),
      tvIntro: L("Sofa, Röhrenfernseher und jede Menge Reels. Tipp auf einen Fernseher.",
                 "Sofa, CRT TVs and plenty of reels. Tap a TV."),
      image: "../img/toyphoto-stop-motion.jpg",
      // Der Zeitkern versorgt das Portal im letzten Raum mit Energie
      rewards: [ { id: "k1", item: "film" }, { id: "k2", item: "core" } ],
      clue: L("Alle Zeitsplitter gefunden! Auf dem alten Fernseher flackert eine Nachricht von Kazu: Hilfe, ich stecke in der Vergangenheit fest!", "All time shards found! A message from Kazu flickers on the old TV: Help, I'm stuck in the past!"),
      reels: [ ["CH 1", "Stop-Motion"], ["CH 2", "Behind the Scenes"], ["CH 3", L("Fertige Szene", "Finished scene")] ] },
    { id: "geheim", no: "06", game: "portal", secret: true, name: L("Der Portalraum", "The Portal Room"), mapName: L("Portalraum", "Portal Room"), kind: "Finale", x: 282, y: 640, requires: "werkstatt",
      walk: L("Der Portalraum! Hinten steht mein Zeitreiseportal. Sieh dir alle Bilder an, finde die Zeitsplitter, setz alle fünf Teile ein und knack den Portalcode. Dann retten wir Kazu!",
              "The Portal Room! My time travel portal stands at the back. Look at all the pictures, find the time shards, insert all five parts and crack the portal code. Then we rescue Kazu!"),
      world: { theme: "portal", fog: "#060c14", near: 4, far: 26, amb: 0x4a5a70, ambI: .85, art: ["#071420", "#14405a", "#6af0ff"], seed: 6, spawn: [0, .8, 0], frame: "metalF" }, gallery: GALLERY.geheim,
      intro: L("Das Zeitreiseportal. Es braucht drei Dinge: alle Bilder und Zeitsplitter im Raum, alle fünf Portalteile und den Portalcode.",
               "The time travel portal. It needs three things: every picture and time shard in this room, all five portal parts and the portal code."),
      rewards: [ { id: "t1", item: "hourglass" } ],
      clue: L("Alle Zeitsplitter gefunden! Alle Spuren führen hierher. Kazu wartet auf der anderen Seite des Portals.", "All time shards found! Every trail leads here. Kazu is waiting on the other side of the portal.") }
  ],
  edges: [
    { from: "start",     to: "nord",      d: "M180 42 V100 H84 V158" },
    { from: "nord",      to: "zisterne",  d: "M84 158 V212 H276 V268" },
    { from: "zisterne",  to: "pumpe",     d: "M276 268 V326 H100 V384" },
    { from: "pumpe",     to: "werkstatt", d: "M100 384 V442 H272 V500" },
    { from: "pumpe",     to: "kino",      d: "M100 384 V420 H60 V590" },
    { from: "werkstatt", to: "geheim",    d: "M272 500 V596 H282 V640", secret: true }
  ],
  ranks: [
    { at: 0,  name: L("Novize", "Novice"),                       kanji: "見" },
    { at: 8,  name: L("Kanalläufer", "Sewer Runner"),            kanji: "走" },
    { at: 16, name: "Ronin",                                      kanji: "浪" },
    { at: 26, name: "Samurai",                                    kanji: "侍" },
    { at: 35, name: L("Meister des Kanals", "Master of the Sewers"), kanji: "師" }
  ]
};

const LINES = {
  welcome: L("Los geht's! Tipp auf eine Kammer, dann laufe ich hin. Wir fangen im Geisterbahnhof an. Halte durch, Kazu!",
             "Let's go! Tap a chamber and I'll walk there. We'll start at the Ghost Station. Hold on, Kazu!"),
  back: L("Da bist du ja wieder. Der Kanal hat auf dich gewartet.", "There you are again. The sewers have been waiting for you."),
  found: L(["Gutes Auge!", "Das hätte ich fast selbst übersehen.", "So spricht ein echter Kanalläufer.", "Weiter so, da ist noch mehr."],
           ["Good eye!", "I almost missed that one myself.", "Spoken like a true sewer runner.", "Keep going, there's more."]),
  dark: L("Zu dunkel. Leuchte erst mit der Lampe drauf.", "Too dark. Shine the flashlight on it first."),
  solved: L("Licht an! Szene gelöst. Der Tunnel zum nächsten Raum ist frei.", "Lights on! Scene solved. The tunnel to the next room is open."),
  seenAll: L("Alle Bilder und Zeitsplitter gefunden! Jetzt kannst du das Spezialbild freilegen.", "Every picture and time shard found! Now you can uncover the special picture."),
  // Was fehlt noch? (Bilder und/oder Zeitsplitter)
  missing: (pics, shards) => [pics ? L(`${pics} ${pics === 1 ? "Bild" : "Bilder"}`, `${pics} ${pics === 1 ? "picture" : "pictures"}`) : "", shards ? L(`${shards} ${shards === 1 ? "Zeitsplitter" : "Zeitsplitter"}`, `${shards} time ${shards === 1 ? "shard" : "shards"}`) : ""].filter(Boolean).join(L(" und ", " and ")),
  covered: (pics, shards) => L(`Das Spezialbild ist noch verhüllt. Es fehlen noch ${LINES.missing(pics, shards)}.`, `The special picture is still veiled. Still missing: ${LINES.missing(pics, shards)}.`),
  shard: (n, t) => L(`Zeitsplitter gefunden! (${n}/${t})`, `Time shard found! (${n}/${t})`),
  revealed: L("Freigelegt! Spring hinein, dahinter wartet ein Minispiel.", "Uncovered! Jump in, a mini game is waiting behind it."),
  gameWin: L("Geschafft! Der Tunnel zum nächsten Raum ist frei.", "Done! The tunnel to the next room is open."),
  gameWinLast: L("Geschafft! Du hast das letzte Geheimnis des Kanals gelüftet.", "Done! You've uncovered the last secret of the sewers."),
  breakHit: L(["Krach! Sauber durch.", "Hai! Perfekter Schlag.", "Das Holz hatte keine Chance."], ["Crack! Clean through.", "Hai! Perfect strike.", "The wood didn't stand a chance."]),
  breakMiss: (early) => early ? L("Zu früh! Warte, bis der Zeiger im grünen Bereich ist.", "Too early! Wait until the needle is in the green zone.") : L("Zu spät! Der Zeiger war schon drüber.", "Too late! The needle had already passed."),
  replay: L("Diesen Raum hast du schon gelöst. Am Spezialbild kannst du das Minispiel jederzeit noch mal spielen.", "You've already solved this room. At the special picture you can play the mini game again any time."),
  replayWin: L("Stark, noch mal geschafft!", "Great, you did it again!"),
  arcadeFail: L("Zeit um! Knapp daneben. Noch mal?", "Time's up! So close. Again?"),
  arcadeMiss: L("Das war nicht mein Logo!", "That wasn't my logo!"),
  simonBad: L("Falscher Klangstein. Hör noch mal genau hin.", "Wrong sound stone. Listen closely again."),
  simonRound: L("Richtig! Die Melodie wird länger.", "Correct! The melody gets longer."),
  locked: (req) => L(`Dieser Tunnel ist noch verschüttet. Löse zuerst: ${req}.`, `This tunnel is still blocked. Solve this first: ${req}.`),
  lockedSecret: L("Hinter dem Labor liegt ein verborgener Raum. Bau im Labor alles fertig, dann öffnet sich der Gang.", "A hidden room lies behind the lab. Finish building in the lab and the passage opens."),
  portalPics: (pics, shards) => L(`Das Portal ist noch aus. Es fehlen noch ${LINES.missing(pics, shards)} in diesem Raum.`, `The portal is still off. Still missing in this room: ${LINES.missing(pics, shards)}.`),
  noParts: (rooms) => L(`Dem Portal fehlen noch Teile. Löse die Minispiele in: ${rooms}.`, `The portal is still missing parts. Solve the mini games in: ${rooms}.`),
  portalOpen: L("Das Portal hat sich geöffnet! Alle Teile sind drin. Geh hin und gib den Portalcode ein.", "The portal has opened! Every part is in place. Walk up to it and enter the portal code."),
  portalOpenNoParts: (rooms) => L(`Das Portal flackert, aber ihm fehlen noch Teile. Löse die Minispiele in: ${rooms}.`, `The portal flickers, but it's still missing parts. Solve the mini games in: ${rooms}.`),
  coreIn: L("Alle fünf Portalteile sind eingesetzt! Jetzt fehlt nur noch der Portalcode.", "All five portal parts are in place! Now only the portal code is missing."),
  missionOk: L("Zugang gewährt! Das Portal ist bereit. Tritt ein!", "Access granted! The portal is ready. Step inside!"),
  missionBad: L("Falscher Portalcode. Schau in die Bildunterschrift meines 2. angepinnten Instagram-Beitrags.", "Wrong portal code. Check the caption of my 2nd pinned Instagram post."),
  step: L("Sauber gebaut! Weiter geht's.", "Nicely built! On to the next one."),
  workshopDone: L("Der Helm ist fertig, von der Skizze bis zur Farbe! Nimm dieses Werkzeug mit, du hast es dir verdient.", "The helmet is done, from sketch to paint! Take this tool with you, you've earned it.")
};
