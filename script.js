// Panel auch per X-Button und Klick außerhalb schließen
const APP_CONFIG = {
  sharedPartTimeoutMs: 5000,
  portfolioPages: new Set([
    'toys.html',
    'cosplay.html',
    'videos.html',
    'toys_en.html',
    'cosplay_en.html',
    'videos_en.html'
  ])
};

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function isEnglishPage() {
  return getCurrentPage().toLowerCase().endsWith('_en.html');
}

function getCurrentLocale() {
  return isEnglishPage() ? 'en' : 'de';
}

function getLanguageTargets(page = getCurrentPage()) {
  const normalizedPage = page.toLowerCase();
  const basePage = normalizedPage.endsWith('_en.html')
    ? normalizedPage.replace('_en.html', '.html')
    : normalizedPage;

  return {
    de: basePage || 'index.html',
    en: normalizedPage.endsWith('_en.html')
      ? page
      : (basePage === 'index.html' ? 'index_en.html' : basePage.replace('.html', '_en.html'))
  };
}

const TOY_GALLERY_IMAGES = [
  { file: 'toyphoto-adler.jpg', copyKey: 'Adler.jpg', orientation: 'tall' },
  { file: 'toyphoto-alien.jpg', copyKey: 'Alien.jpg', orientation: 'tall' },
  { file: 'toyphoto-anya-deadpool.jpg', copyKey: 'Anya_Deadpool.jpg', orientation: 'tall' },
  { file: 'toyphoto-ash.jpg', copyKey: 'Ash.jpg', orientation: 'wide' },
  { file: 'toyphoto-badehaus.jpg', copyKey: 'Badehaus.jpg', orientation: 'wide' },
  { file: 'toyphoto-blanka-turtles.jpg', copyKey: 'Blanka_Turtles.jpg', orientation: 'tall' },
  { file: 'toyphoto-blood-ninja.jpg', copyKey: 'Blood_Ninja.jpg', orientation: 'wide' },
  { file: 'toyphoto-brueder-samurai.jpg', copyKey: 'Brueder_Samurai.jpg', orientation: 'tall' },
  { file: 'toyphoto-das-ende.jpg', copyKey: 'Das_Ende.jpg', orientation: 'tall' },
  { file: 'toyphoto-death.jpg', copyKey: 'Death.jpg', orientation: 'tall' },
  { file: 'toyphoto-demonslayer-evil.jpg', copyKey: 'Demonslayer_Evil.jpg', orientation: 'tall' },
  { file: 'toyphoto-dino.jpg', copyKey: 'Dino.jpg', orientation: 'wide' },
  { file: 'toyphoto-donatello.jpg', copyKey: 'Donatello.jpg', orientation: 'wide' },
  { file: 'toyphoto-du-kannst-nicht-vorbei.jpg', copyKey: 'Du_kannst_nicht_vorbei.jpg', orientation: 'wide' },
  { file: 'toyphoto-fall.jpg', copyKey: 'Fall.jpg', orientation: 'tall' },
  { file: 'toyphoto-fernseher.jpg', copyKey: 'Fernseher.jpg', orientation: 'wide' },
  { file: 'toyphoto-fight.jpg', copyKey: 'Fight.jpg', orientation: 'wide' },
  { file: 'toyphoto-gandalf.jpg', copyKey: 'Gandalf.jpg', orientation: 'tall' },
  { file: 'toyphoto-gimli-ghosts.jpg', copyKey: 'Gimli_Ghosts.jpg', orientation: 'tall' },
  { file: 'toyphoto-gollum-hellboy.jpg', copyKey: 'Gollum_Hellboy.jpg', orientation: 'wide' },
  { file: 'toyphoto-jack.jpg', copyKey: 'Jack.jpg', orientation: 'wide' },
  { file: 'toyphoto-kino.jpg', copyKey: 'Kino.jpg', orientation: 'tall' },
  { file: 'toyphoto-last-fight.jpg', copyKey: 'Last_fight.jpg', orientation: 'wide' },
  { file: 'toyphoto-leo.jpg', copyKey: 'Leo.jpg', orientation: 'wide' },
  { file: 'toyphoto-leonardo-stitch-art-studio.jpg', copyKey: 'Leonardo.jpg', orientation: 'wide' },
  { file: 'toyphoto-leo-funko.jpg', copyKey: 'Leo_Funko.jpg', orientation: 'tall' },
  { file: 'toyphoto-leo-gurke.jpg', copyKey: 'Leo_Gurke.jpg', orientation: 'wide' },
  { file: 'toyphoto-link-reseti.jpg', copyKey: 'Link_Reseti.jpg', orientation: 'tall' },
  { file: 'toyphoto-lurtz-2.jpg', copyKey: 'Lurtz-2.jpg', orientation: 'tall' },
  { file: 'toyphoto-metalhead.jpg', copyKey: 'Metalhead.jpg', orientation: 'wide' },
  { file: 'toyphoto-monkey.jpg', copyKey: 'Monkey.jpg', orientation: 'tall' },
  { file: 'toyphoto-mud-ducks.jpg', copyKey: 'Mud_Ducks.jpg', orientation: 'tall' },
  { file: 'toyphoto-mumakil.jpg', copyKey: 'Mumakil.jpg', orientation: 'tall' },
  { file: 'toyphoto-leonardo-hooded-sword-portrait.jpg', copyKey: 'Out_of_the_dark.jpg', orientation: 'tall' },
  { file: 'toyphoto-pingu.jpg', copyKey: 'Pingu.jpg', orientation: 'wide' },
  { file: 'toyphoto-pizzanaut-space-delivery-scene.jpg', copyKey: 'Pizzanaut.jpg', orientation: 'wide' },
  { file: 'toyphoto-red.jpg', copyKey: 'Red.jpg', orientation: 'wide' },
  { file: 'toyphoto-red-one.jpg', copyKey: 'Red_One.jpg', orientation: 'wide' },
  { file: 'toyphoto-ryuk.jpg', copyKey: 'Ryuk.jpg', orientation: 'tall' },
  { file: 'toyphoto-sakonji.jpg', copyKey: 'Sakonji.jpg', orientation: 'tall' },
  { file: 'toyphoto-sam.jpg', copyKey: 'Sam.jpg', orientation: 'tall' },
  { file: 'toyphoto-sandeln.jpg', copyKey: 'Sandeln.jpg', orientation: 'wide' },
  { file: 'toyphoto-sauron-alien.jpg', copyKey: 'Sauron_Alien.jpg', orientation: 'wide' },
  { file: 'toyphoto-schlittenfahrt.jpg', copyKey: 'Schlittenfahrt.jpg', orientation: 'wide' },
  { file: 'toyphoto-schnecken.jpg', copyKey: 'Schnecken.jpg', orientation: 'wide' },
  { file: 'toyphoto-schokiiiii.jpg', copyKey: 'Schokiiiii.jpg', orientation: 'wide' },
  { file: 'toyphoto-shredder-dual-katana-closeup.jpg', copyKey: 'Shredder_Katana.jpg', orientation: 'wide' },
  { file: 'toyphoto-south-park.jpg', copyKey: 'SouthPark.jpg', orientation: 'tall' },
  { file: 'toyphoto-spawn.jpg', copyKey: 'Spawn.jpg', orientation: 'tall' },
  { file: 'toyphoto-spyro.jpg', copyKey: 'Spyro.jpg', orientation: 'tall' },
  { file: 'toyphoto-steinweg.jpg', copyKey: 'Steinweg.jpg', orientation: 'tall' },
  { file: 'toyphoto-superseven.jpg', copyKey: 'Superseven.jpg', orientation: 'tall' },
  { file: 'toyphoto-the-claw.jpg', copyKey: 'TheClaw.jpg', orientation: 'tall' },
  { file: 'toyphoto-the-crow.jpg', copyKey: 'TheCrow.jpg', orientation: 'tall' },
  { file: 'toyphoto-ultraman.jpg', copyKey: 'Ultraman.jpg', orientation: 'wide' },
  { file: 'toyphoto-usagi.jpg', copyKey: 'Usagi.jpg', orientation: 'wide' },
  { file: 'toyphoto-usagi-donnie.jpg', copyKey: 'UsagiDonnie.jpg', orientation: 'wide' },
  { file: 'toyphoto-wilson.jpg', copyKey: 'Wilson.jpg', orientation: 'wide' },
  { file: 'toyphoto-witchking.jpg', copyKey: 'Witchking.jpg', orientation: 'wide' },
  { file: 'toyphoto-zobie.jpg', copyKey: 'Zobie.jpg', orientation: 'tall' },
  { file: 'toyphoto-zodd-mando.jpg', copyKey: 'ZoddMando.jpg', orientation: 'wide' },
  { file: 'toyphoto-balrog.jpg', copyKey: 'Balrog.jpg', orientation: 'wide' },
  { file: 'toyphoto-baumbart-brennt.jpg', copyKey: 'Baumbart_Brennt.jpg', orientation: 'wide' },
  { file: 'toyphoto-buddha.jpg', copyKey: 'Buddha.jpg', orientation: 'wide' },
  { file: 'toyphoto-devil-knie.jpg', copyKey: 'Devil_Knie.jpg', orientation: 'tall' },
  { file: 'toyphoto-fern.jpg', copyKey: 'Fern.jpg', orientation: 'tall' },
  { file: 'toyphoto-fight-foot.jpg', copyKey: 'Fight_Foot.jpg', orientation: 'wide' },
  { file: 'toyphoto-foot.jpg', copyKey: 'Foot.jpg', orientation: 'tall' },
  { file: 'toyphoto-ghostrider.jpg', copyKey: 'Ghostrider.jpg', orientation: 'wide' },
  { file: 'toyphoto-gollum.jpg', copyKey: 'Gollum.jpg', orientation: 'tall' },
  { file: 'toyphoto-happa-happa.jpg', copyKey: 'Happa_Happa.jpg', orientation: 'wide' },
  { file: 'toyphoto-krang-fight.jpg', copyKey: 'Krang_Fight.jpg', orientation: 'tall' },
  { file: 'toyphoto-labor-2.jpg', copyKey: 'Labor_2.jpg', orientation: 'tall' },
  { file: 'toyphoto-lapras.jpg', copyKey: 'Lapras.jpg', orientation: 'tall' },
  { file: 'toyphoto-leo-is-coming-home.jpg', copyKey: 'Leo_Is_Coming_Home.jpg', orientation: 'tall' },
  { file: 'toyphoto-man-ray.jpg', copyKey: 'Man_Ray.jpg', orientation: 'wide' },
  { file: 'toyphoto-meditation.jpg', copyKey: 'Meditation.jpg', orientation: 'wide' },
  { file: 'toyphoto-moria.jpg', copyKey: 'Moria.jpg', orientation: 'tall' },
  { file: 'toyphoto-mummy-dust.jpg', copyKey: 'Mummy_Dust.jpg', orientation: 'wide' },
  { file: 'toyphoto-mushrooms.jpg', copyKey: 'Mushrooms.jpg', orientation: 'wide' },
  { file: 'toyphoto-muzan.jpg', copyKey: 'Muzan.jpg', orientation: 'tall' },
  { file: 'toyphoto-roof-ghost.jpg', copyKey: 'Roof_Ghost.jpg', orientation: 'tall' },
  { file: 'toyphoto-spongebob.jpg', copyKey: 'Spongebob.jpg', orientation: 'tall' },
  { file: 'toyphoto-stitch-in-space.jpg', copyKey: 'Stitch_In_Space.jpg', orientation: 'wide' },
  { file: 'toyphoto-turtles-breath.jpg', copyKey: 'Turtles_Breath.jpg', orientation: 'wide' },
  { file: 'toyphoto-undercover.jpg', copyKey: 'Undercover.jpg', orientation: 'wide' },
  { file: 'toyphoto-bruce-lee-vater-und-meister.jpg', copyKey: 'Bruce_Lee_Vater_und_Meister.jpg', orientation: 'tall' }
];

// ------------------------------------------------------
// Toy gallery text config
// Edit texts here without touching the gallery logic.
// ------------------------------------------------------
const TOY_GALLERY_COPY = {
  'Adler.jpg': {
    de: {
      title: 'Majestätischer Fischfang',
      description: 'Atmosphärischer Shot mit kaltem Licht und ruhiger Stimmung.'
    },
    en: {
      title: 'Majestic Fishing Catch',
      description: 'Atmospheric shot with cold lighting and a calm mood.'
    }
  },
  'Alien.jpg': {
    de: {
      title: 'Alien Begegnung',
      description: 'Düstere Szene mit starker Silhoütte und sci-fi Vibe.'
    },
    en: {
      title: 'Alien Encounter',
      description: 'Moody scene with strong silhouette and sci-fi vibe.'
    }
  },
  'Anya_Deadpool.jpg': {
    de: {
      title: 'Crossover Chaos',
      description: 'Verspielter Crossover-Moment mit kontrastreichem Licht.'
    },
    en: {
      title: 'Crossover Chaos',
      description: 'Playful crossover moment with high-contrast lighting.'
    }
  },
  'Ash.jpg': {
    de: {
      title: 'Ash der Untote',
      description: 'Querformat mit urbaner Spannung, verdeckter Pose und starkem Story-Vibe.'
    },
    en: {
      title: 'Ash the Undead',
      description: 'Cinematic perspective focused on expression and pose.'
    }
  },
  'Badehaus.jpg': {
    de: {
      title: 'Zeit die Ratte zu waschen',
      description: 'Warme Farben und dichter Bildaufbau für eine intime Szene.'
    },
    en: {
      title: 'Time to wash the rat',
      description: 'Warm colors and dense composition for an intimate scene.'
    }
  },
  'Blanka_Turtles.jpg': {
    de: {
      title: 'Onkel Blanka on Tour',
      description: 'Actionreicher Moment mit Dynamik und comicartigem Timing.'
    },
    en: {
      title: 'Uncle Blanka on Tour',
      description: 'Action-heavy moment with dynamic motion and comic timing.'
    }
  },
  'Blood_Ninja.jpg': {
    de: {
      title: 'Blood Ninja',
      description: 'Raür Look mit starken Schatten und dramatischer Spannung.'
    },
    en: {
      title: 'Blood Ninja',
      description: 'Raw look with deep shadows and dramatic tension.'
    }
  },
  'Brueder_Samurai.jpg': {
    de: {
      title: 'Samurai Brüder',
      description: 'Zwei Charaktere in ruhiger, epischer Komposition.'
    },
    en: {
      title: 'Samurai Brothers',
      description: 'Two characters in a calm, epic composition.'
    }
  },
  'Das_Ende.jpg': {
    de: {
      title: 'Das Ende',
      description: 'Finaler Moment mit melancholischer Atmosphäre.'
    },
    en: {
      title: 'The End',
      description: 'Final moment with a melancholic atmosphere.'
    }
  },
  'Death.jpg': {
    de: {
      title: 'Death',
      description: 'Dunkle Inszenierung mit Fokus auf Form und Kontrast.'
    },
    en: {
      title: 'Death',
      description: 'Dark staging focused on shape and contrast.'
    }
  },
  'Demonslayer_Evil.jpg': {
    de: {
      title: 'Gyokko',
      description: 'Leuchtende Farben und nebliges Licht geben der Szene einen unheimlichen Märchenlook.'
    },
    en: {
      title: 'Gyokko',
      description: 'Glowing colors and hazy light give the scene an eerie fairytale feel.'
    }
  },
  'Dino.jpg': {
    de: {
      title: 'Hand in Hand durchs Dinoland',
      description: 'Minimalistische Szene mit zwei kleinen Figuren, weichem Licht und stiller Nähe.'
    },
    en: {
      title: 'Hand in Hand through Dino Land',
      description: 'Minimal scene with two small figures, soft light and a quiet sense of closeness.'
    }
  },
  'Donatello.jpg': {
    de: {
      title: 'Donatello der Bildhauer',
      description: 'Verspieltes Studio-Setup mit Werkzeug, Skizzen und warmem Werkstattlicht.'
    },
    en: {
      title: 'Donatello the Sculptor',
      description: 'Playful studio setup with tools, sketches and warm workshop lighting.'
    }
  },
  'Du_kannst_nicht_vorbei.jpg': {
    de: {
      title: 'Du kannst nicht vorbei',
      description: 'Dichter Neon-Nebel und eine blockierte Passage machen die Szene spürbar angespannt.'
    },
    en: {
      title: 'You shall not pass',
      description: 'Dense neon haze and a blocked path make the tension feel immediate.'
    }
  },
  'Fall.jpg': {
    de: {
      title: 'Flieht ihr Narren',
      description: 'Glühende Farben, Funkenregen und Halloween-Requisiten sorgen für pure Herbststimmung.'
    },
    en: {
      title: 'Fly, you fools',
      description: 'Glowing colors, flying sparks and Halloween props create pure fall atmosphere.'
    }
  },
  'Fernseher.jpg': {
    de: {
      title: 'Mikeys Kochstudio',
      description: 'Nostalgische Schwarzweiss-Szene mit Miniaturen und ruhigem Wohnzimmerchaos.'
    },
    en: {
      title: 'Mikeys Cooking Studio',
      description: 'Nostalgic black-and-white scene with miniatures and calm living-room chaos.'
    }
  },
  'Fight.jpg': {
    de: {
      title: 'Sprung in den Kampf',
      description: 'Dynamischer Outdoor-Shot mit eingefrorener Bewegung und klarer Action-Lesbarkeit.'
    },
    en: {
      title: 'Leaping into Battle',
      description: 'Dynamic outdoor shot with frozen motion and clear action readability.'
    }
  },
  'Gandalf.jpg': {
    de: {
      title: 'Der weisse Reiter',
      description: 'Weiches Gegenlicht, Regen und die Silhoütte auf dem Pferd erzeugen eine epische Ankunft.'
    },
    en: {
      title: 'The White Rider',
      description: 'Soft backlight, rain and the mounted silhouette create an epic arrival.'
    }
  },
  'Gimli_Ghosts.jpg': {
    de: {
      title: 'Pfad der Toten',
      description: 'Kaltes Blau und geisterhafte Figuren verleihen dem Bild eine mythische Bedrohung.'
    },
    en: {
      title: 'Path of the Dead',
      description: 'Cold blue lighting and ghostly figures give the image a mythic threat.'
    }
  },
  'Gollum_Hellboy.jpg': {
    de: {
      title: 'Hellboy im Rohrlabyrinth',
      description: 'Skurrile Rohrkulisse und warmes Licht machen den Shot zugleich dreckig und verspielt.'
    },
    en: {
      title: 'Hellboy in the Pipe Maze',
      description: 'The quirky pipe setting and warm light make the shot feel gritty and playful at once.'
    }
  },
  'Jack.jpg': {
    de: {
      title: 'Jack',
      description: 'Starke Silhoütte vor dem Mond mit klassischer Stop-Motion-Märchenstimmung.'
    },
    en: {
      title: 'Jack',
      description: 'Strong silhouette against the moon with classic stop-motion fairytale mood.'
    }
  },
  'Kino.jpg': {
    de: {
      title: 'Filmeabend',
      description: 'Bunte Kinolichter und der überqüllende Popcorn-Eimer geben der Szene Humor und Charakter.'
    },
    en: {
      title: 'Movie Night',
      description: 'Colorful cinema lights and the overflowing popcorn bucket add humor and character.'
    }
  },
  'Last_fight.jpg': {
    de: {
      title: 'Im freien Fall',
      description: 'Niedrige Perspektive, Nebel und kaltes Licht machen den Zweikampf besonders intensiv.'
    },
    en: {
      title: 'In Free Fall',
      description: 'Low angle, mist and cold lighting make the duel feel especially intense.'
    }
  },
  'Leo.jpg': {
    de: {
      title: 'Leonardo im Schneesturm',
      description: 'Kalter Boden, feiner Nebel und die gezogene Klinge verleihen dem Shot Samurai-Energie.'
    },
    en: {
      title: 'Leonardo in the Snowstorm',
      description: 'Cold ground, drifting mist and the drawn blade give the shot true samurai energy.'
    }
  },
  'Leonardo.jpg': {
    de: {
      title: 'Leonardo da Künstler',
      description: 'Detailreiche Atelier-Szene mit Leonardo, Stitch, Pizza und leuchtenden Kunstrequisiten.'
    },
    en: {
      title: 'Leonardo da Artist',
      description: 'Detailed studio scene with Leonardo, Stitch, pizza props and vibrant art direction.'
    }
  },
  'Leo_Funko.jpg': {
    de: {
      title: 'Raus aus der Kanalisation',
      description: 'Die kleine Figur wirkt zwischen Knochen und Moos wie ein stiller Entdecker.'
    },
    en: {
      title: 'Out of the Sewers',
      description: 'The small figure feels like a quiet explorer among bones and moss.'
    }
  },
  'Leo_Gurke.jpg': {
    de: {
      title: 'Leo und die Gurke',
      description: 'Humorvoller Charaktershot mit warmem Bokeh und einem herrlich absurden Detail.'
    },
    en: {
      title: 'Leo and the Pickle',
      description: 'Humorous character shot with warm bokeh and a wonderfully absurd detail.'
    }
  },
  'Link_Reseti.jpg': {
    de: {
      title: 'Nicht vergessen zu speichern Link',
      description: 'Ruhige Makro-Szene, in der Fantasy-Abenteür und Nintendo-Charme aufeinandertreffen.'
    },
    en: {
      title: 'Dont forget to save, Link',
      description: 'Quiet macro scene where fantasy adventure meets Nintendo charm.'
    }
  },
  'Lurtz-2.jpg': {
    de: {
      title: 'Lurtz auf der Jagd',
      description: 'Die kompakte Komposition setzt den Krieger roh, direkt und bedrohlich in Szene.'
    },
    en: {
      title: 'Lurtz on the Hunt',
      description: 'The tight composition presents the warrior as raw, direct and threatening.'
    }
  },
  'Metalhead.jpg': {
    de: {
      title: 'Neonstart',
      description: 'Spielzeugauto, reflektierende Flächen und knallige Farben geben dem Bild Arcade-Energie.'
    },
    en: {
      title: 'Neon Launch',
      description: 'Toy car, reflective surfaces and punchy colors give the image arcade energy.'
    }
  },
  'Monkey.jpg': {
    de: {
      title: 'Monkey',
      description: 'Das Porträt lebt von Textur, Schnee und dem leicht schräg-verschmitzten Ausdruck der Figur.'
    },
    en: {
      title: 'Monkey',
      description: 'The portrait thrives on texture, snow and the figures slightly offbeat expression.'
    }
  },
  'Mud_Ducks.jpg': {
    de: {
      title: 'Entengrütze',
      description: 'Locker inszenierter Gruppenmoment mit viel Charakter, Spritzwasser und Humor.'
    },
    en: {
      title: 'Duck Mash',
      description: 'Loosely staged group moment full of character, splashes and humor.'
    }
  },
  'Mumakil.jpg': {
    de: {
      title: 'In die Schlacht',
      description: 'Der Miniaturaufbau wirkt durch die Perspektive wie ein gewaltiger Marsch durch den Wald.'
    },
    en: {
      title: 'Into Battle',
      description: 'The miniature setup feels like a massive march through the forest thanks to the perspective.'
    }
  },
  'Out_of_the_dark.jpg': {
    de: {
      title: 'The Last Ronin',
      description: 'Dunkles Porträt von Leonardo mit Kapuze, Schwert und hart gesetztem Licht.'
    },
    en: {
      title: 'The Last Ronin',
      description: 'Dark portrait of Leonardo with hood, sword and sharply focused dramatic lighting.'
    }
  },
  'Pingu.jpg': {
    de: {
      title: 'Pingu auf der Piste',
      description: 'Schnee, Bewegung und kleine Winterdetails machen die Szene lebendig und charmant.'
    },
    en: {
      title: 'Pingu on the Slope',
      description: 'Snow, movement and small winter details make the scene lively and charming.'
    }
  },
  'Pizzanaut.jpg': {
    de: {
      title: 'Pizzanaut im Weltraum',
      description: 'Verspielte Sci-Fi-Lieferszene mit schwebender Pizza, Mondkulisse und kosmischem Licht.'
    },
    en: {
      title: 'Pizzanaut in Space',
      description: 'Playful sci-fi delivery scene with floating pizza slices, moon backdrop and cosmic lighting.'
    }
  },
  'Red.jpg': {
    de: {
      title: 'Rote Spur im Schnee',
      description: 'Der verschneite Aufbau verbindet Abenteürfeeling mit einem klaren Fokus auf die zentrale Figur.'
    },
    en: {
      title: 'Crimson Trail in the Snow',
      description: 'The snowy setup blends adventure energy with a clear focus on the central figure.'
    }
  },
  'Red_One.jpg': {
    de: {
      title: 'Weihnachtschaos',
      description: 'Überladene Weihnachtsdetails und warmes Licht machen das Bild herrlich festlich-chaotisch.'
    },
    en: {
      title: 'Holiday Chaos',
      description: 'Packed Christmas details and warm lighting make the scene delightfully festive and chaotic.'
    }
  },
  'Ryuk.jpg': {
    de: {
      title: 'Ryuk im Farbenrausch',
      description: 'Hartes Rot-Blau-Licht und das zentrale Porträt geben dem Shot starke Manga-Dramatik.'
    },
    en: {
      title: 'Ryuk in Neon Bloom',
      description: 'Hard red-blue lighting and the central portrait give the shot strong manga drama.'
    }
  },
  'Sakonji.jpg': {
    de: {
      title: 'Meister unter Kirschblüten',
      description: 'Zarte Farben und der dichte Blütenrahmen verleihen der Figur eine ruhige, poetische Wirkung.'
    },
    en: {
      title: 'Master under Cherry Blossoms',
      description: 'Soft colors and the dense floral frame give the figure a calm, poetic presence.'
    }
  },
  'Sam.jpg': {
    de: {
      title: 'Der Held der Geschichte',
      description: 'Kleines Charakterbild mit starkem Storymoment zwischen Dunkelheit, Schnee und unheimlichem Grün.'
    },
    en: {
      title: 'The Hero of the Story',
      description: 'Small character image with a strong story beat between darkness, snow and eerie green light.'
    }
  },
  'Sandeln.jpg': {
    de: {
      title: 'Es sind Babys...',
      description: 'Die breit aufgebaute Actionszene lebt von Staub, Tiefe und klar lesbarer Bewegung.'
    },
    en: {
      title: 'They are babies...',
      description: 'The wide action setup thrives on dust, depth and clearly readable motion.'
    }
  },
  'Sauron_Alien.jpg': {
    de: {
      title: 'Eine neue Macht erhebt sich',
      description: 'Glutrote Farben und die extreme Grössenwirkung machen die Szene maximal bedrohlich.'
    },
    en: {
      title: 'A new power rises',
      description: 'Ember-red colors and the extreme sense of scale make the scene intensely threatening.'
    }
  },
  'Schlittenfahrt.jpg': {
    de: {
      title: 'Schlittenfahrt der Turtles',
      description: 'Verschneite Diorama-Szene voller Figuren, Requisiten und winterlicher Abenteürlust.'
    },
    en: {
      title: 'Turtle Sleigh Ride',
      description: 'Snowy diorama packed with figures, props and a strong sense of winter adventure.'
    }
  },
  'Schnecken.jpg': {
    de: {
      title: 'Langsame Begegnung',
      description: 'Makroblick mit viel Witz: zwei winzige Figuren teilen sich eine stille, absurde Szene.'
    },
    en: {
      title: 'Slow Encounter',
      description: 'Macro view with plenty of humor: two tiny figures share a quiet, absurd scene.'
    }
  },
  'Schokiiiii.jpg': {
    de: {
      title: 'Süßer Mikey',
      description: 'Das warme Licht und die knuffige Monsterfigur machen das Bild verspielt und bissfest.'
    },
    en: {
      title: 'Sweet Mikey',
      description: 'Warm lighting and the cute monster figure make the image playful and full of bite.'
    }
  },
  'Shredder_Katana.jpg': {
    de: {
      title: 'Zieh dein Schwert',
      description: 'Intensive Nahaufnahme mit gezogenen Katanas, violettem Licht und direkter Bedrohung.'
    },
    en: {
      title: 'Draw your sword',
      description: 'Intense close-up with drawn katanas, purple lighting and a direct sense of threat.'
    }
  },
  'SouthPark.jpg': {
    de: {
      title: 'Independence Day im South Park',
      description: 'Schräge Winterkomödie mit viel Schnee, Chaos und sofort erkennbarem Seriencharme.'
    },
    en: {
      title: 'Independence Day in South Park',
      description: 'Offbeat winter comedy with lots of snow, chaos and instantly recognizable series charm.'
    }
  },
  'Spawn.jpg': {
    de: {
      title: 'Spawn aus der Glut',
      description: 'Dunkelrotes Licht, Funken und Bewegung geben der Szene rohe Höllenenergie.'
    },
    en: {
      title: 'Spawn from the Embers',
      description: 'Dark red light, sparks and motion give the scene raw infernal energy.'
    }
  },
  'Spyro.jpg': {
    de: {
      title: 'Spyro hebt ab',
      description: 'Heller Himmel und die schwebende Pose verleihen dem kleinen Drachen sofort Leichtigkeit.'
    },
    en: {
      title: 'Spyro Takes Flight',
      description: 'Bright sky and the floating pose give the little dragon immediate lightness.'
    }
  },
  'Steinweg.jpg': {
    de: {
      title: 'Kalter Steinweg',
      description: 'Die winterliche Makro-Szene wirkt ruhig, leicht melancholisch und zugleich märchenhaft.'
    },
    en: {
      title: 'Cold Stone Path',
      description: 'The wintry macro scene feels calm, slightly melancholic and still fairytale-like.'
    }
  },
  'Superseven.jpg': {
    de: {
      title: 'Auf in den Kampf',
      description: 'Warme Farben und das enge Framing erzeugen ein glaubwürdiges Roadtrip-Gefühl im Miniaturmassstab.'
    },
    en: {
      title: 'Off to Battle',
      description: 'Warm colors and tight framing create a believable road-trip feeling in miniature scale.'
    }
  },
  'TheClaw.jpg': {
    de: {
      title: 'Greifarm-Glück',
      description: 'Detailreicher Laden-Shot voller Figuren, Spiegelungen und nostalgischer Spielhallenstimmung.'
    },
    en: {
      title: 'Claw Machine Luck',
      description: 'Detailed shop shot full of figures, reflections and nostalgic arcade atmosphere.'
    }
  },
  'TheCrow.jpg': {
    de: {
      title: 'Friedhofskrähe',
      description: 'Reduzierter Schwarzweiss-Look mit einsamer Figur und starkem melancholischem Kontrast.'
    },
    en: {
      title: 'Cemetery Crow',
      description: 'Reduced black-and-white look with a lone figure and strong melancholic contrast.'
    }
  },
  'Ultraman.jpg': {
    de: {
      title: 'Kaiju Attack',
      description: 'Buntes Chaos aus Rauch, Funken und Monstern, eingefangen wie ein Mini-Blockbuster.'
    },
    en: {
      title: 'Kaiju Attack',
      description: 'Colorful chaos of smoke, sparks and monsters captured like a miniature blockbuster.'
    }
  },
  'Usagi.jpg': {
    de: {
      title: 'Usagi der Dämon',
      description: 'Schräge Perspektive und harte Linien machen die Figur mitten im Sprung besonders dynamisch.'
    },
    en: {
      title: 'Usagi the Demon',
      description: 'Tilted perspective and hard lines make the figure especially dynamic mid-jump.'
    }
  },
  'UsagiDonnie.jpg': {
    de: {
      title: 'Usagi und Donnie reiten aus',
      description: 'Bühnenreife Action mit Reittier, Funken und klarer Abenteürpose.'
    },
    en: {
      title: 'Usagi and Donnie Ride Out',
      description: 'Stage-ready action with a mount, sparks and a clear adventure pose.'
    }
  },
  'Wilson.jpg': {
    de: {
      title: 'Wilson im Mooswald',
      description: 'Die Figur taucht zwischen Moospolstern und Nebel wie aus einem stillen Fantasy-Traum auf.'
    },
    en: {
      title: 'Wilson in the Mossy Woods',
      description: 'The figure appears between mossy cushions and mist like a quiet fantasy dream.'
    }
  },
  'Witchking.jpg': {
    de: {
      title: 'Hexenkönig von Angmar',
      description: 'Das Close-up lebt von giftigen Farben, Tiefe und einer bedrohlichen Monsterpräsenz.'
    },
    en: {
      title: 'Witch-king of Angmar',
      description: 'The close-up thrives on toxic colors, depth and a threatening monster presence.'
    }
  },
  'Zobie.jpg': {
    de: {
      title: 'Sterbend heisser Sommer',
      description: 'Der Shot erzählt mit Requisiten und Perspektive eine kleine Szene wie aus einem Abenteürfilm.'
    },
    en: {
      title: 'Dying Hot Summer',
      description: 'With its props and perspective, the shot tells a small scene straight out of an adventure film.'
    }
  },
  'ZoddMando.jpg': {
    de: {
      title: 'Zodd gegen Mando',
      description: 'Knalliges Farbdüll mit massiver Figur, Rauch und echter Bossfight-Energie.'
    },
    en: {
      title: 'Zodd vs Mando',
      description: 'Bold color duel with a massive figure, smoke and real boss-fight energy.'
    }
  },
  'Balrog.jpg': {
    de: {
      title: 'Balrog in Moria',
      description: 'Dichter Rauch, oranges Licht und die Silhoütte erzeugen bedrohliche Bossfight-Stimmung.'
    },
    en: {
      title: 'Balrog in Moria',
      description: 'Dense smoke, orange light and the silhouette create a threatening boss-fight mood.'
    }
  },
  'Baumbart_Brennt.jpg': {
    de: {
      title: 'Baumbart in Flammen',
      description: 'Warme Glödetails und Aschepartikel geben der Szene epische Dramatik.'
    },
    en: {
      title: 'Treebeard in Flames',
      description: 'Warm ember details and ash particles give the scene epic drama.'
    }
  },
  'Buddha.jpg': {
    de: {
      title: 'Im Angesicht des Hells Paradise',
      description: 'Ruhige Komposition mit weichem Licht und meditativem Fokus auf Form und Textur.'
    },
    en: {
      title: 'In the face of Hells Paradise',
      description: 'Calm composition with soft light and a meditative focus on shape and texture.'
    }
  },
  'Devil_Knie.jpg': {
    de: {
      title: 'Dante',
      description: 'Vertikaler Charaktershot mit starker Pose, dunklem Kontrast und intensivem Blick.'
    },
    en: {
      title: 'Dante',
      description: 'Vertical character shot with a strong pose, deep contrast and an intense gaze.'
    }
  },
  'Fern.jpg': {
    de: {
      title: 'Letztes Duell',
      description: 'Natürliche Grüntöne und selektiver Fokus machen den Shot ruhig und filmisch.'
    },
    en: {
      title: 'Final Duel',
      description: 'Natural green tones and selective focus make the shot calm and cinematic.'
    }
  },
  'Fight_Foot.jpg': {
    de: {
      title: 'Friss meinen Fuss',
      description: 'Breite Action-Komposition mit klarer Bewegungsrichtung und hartem Keylight.'
    },
    en: {
      title: 'Eat My Foot',
      description: 'Wide action composition with clear motion direction and hard key lighting.'
    }
  },
  'Foot.jpg': {
    de: {
      title: 'Tödliches Lila',
      description: 'Dunkles Hochformat mit Fokus auf Rüstungsdetails und prägnante Silhoütte.'
    },
    en: {
      title: 'Deadly Purple',
      description: 'Dark vertical frame focused on armor details and a striking silhouette.'
    }
  },
  'Ghostrider.jpg': {
    de: {
      title: 'Leo der Ghost Rider of Grayskull',
      description: 'Heisses Highlighting und tiefe Schatten verleihen dem Shot pure Road-Rage-Energie.'
    },
    en: {
      title: 'Leo the Ghost Rider of Grayskull',
      description: 'Hot highlights and deep shadows give the shot pure road-rage energy.'
    }
  },
  'Gollum.jpg': {
    de: {
      title: 'Die Verwandlung',
      description: 'Enge Vertikale mit kaltem Licht, viel Textur und spannungsvoller Nähe.'
    },
    en: {
      title: 'The Transformation',
      description: 'Tight vertical framing with cold light, rich texture and tense proximity.'
    }
  },
  'Happa_Happa.jpg': {
    de: {
      title: 'Candel light dinner',
      description: 'Humorvoller Qürformat-Shot mit starker Farbwirkung und klarer Charaktergeste.'
    },
    en: {
      title: 'Candlelight Dinner',
      description: 'Humorous landscape shot with bold color impact and clear character gesture.'
    }
  },
  'Krang_Fight.jpg': {
    de: {
      title: 'Krang der Grosse',
      description: 'Vertikale Action mit dichtem Framing und harter Lichtkante für maximale Spannung.'
    },
    en: {
      title: 'Krang the Great',
      description: 'Vertical action with tight framing and a hard light edge for maximum tension.'
    }
  },
  'Labor_2.jpg': {
    de: {
      title: 'In den Fängen von Baxter',
      description: 'Sci-Fi-Setting mit künstlichem Licht und dichten Details im Hintergrund.'
    },
    en: {
      title: 'In Baxters Clutches',
      description: 'Sci-fi setup with artificial lighting and dense background detail.'
    }
  },
  'Lapras.jpg': {
    de: {
      title: 'Wilder Wasserritt',
      description: 'Ruhige Vertikale mit weichem Licht und sanfter Tiefenstaffelung.'
    },
    en: {
      title: 'Wild Water Ride',
      description: 'Calm vertical framing with soft light and gentle depth layering.'
    }
  },
  'Leo_Is_Coming_Home.jpg': {
    de: {
      title: 'Kabuki Leo',
      description: 'Storygetriebene Szene mit emotionalem Fokus und warmem Heimkehr-Look.'
    },
    en: {
      title: 'Kabuki Leo',
      description: 'Story-driven scene with emotional focus and a warm homecoming look.'
    }
  },
  'Man_Ray.jpg': {
    de: {
      title: 'Unter dem Meer',
      description: 'Breiter Character Shot mit klarer Pose, satten Farben und comicartigem Timing.'
    },
    en: {
      title: 'Under the Sea',
      description: 'Wide character shot with a clear pose, rich colors and comic-style timing.'
    }
  },
  'Meditation.jpg': {
    de: {
      title: 'Meditation für Splinter',
      description: 'Ausbalanciertes Qürformat mit ruhiger Mitte und kontrollierter Lichtführung.'
    },
    en: {
      title: 'Meditation for Splinter',
      description: 'Balanced landscape framing with a calm center and controlled lighting direction.'
    }
  },
  'Moria.jpg': {
    de: {
      title: 'Moria Tiefe',
      description: 'Vertikale Cave-Atmosphäre mit Nebel, Tiefe und bedrohlicher Felsstruktur.'
    },
    en: {
      title: 'Depths of Moria',
      description: 'Vertical cave atmosphere with mist, depth and threatening rock structures.'
    }
  },
  'Mummy_Dust.jpg': {
    de: {
      title: 'Mummy Dust',
      description: 'Sandy Colors, Partikel und Side-Light machen den Shot trocken und rau.'
    },
    en: {
      title: 'Mummy Dust',
      description: 'Sandy colors, particles and side light make the shot feel dry and gritty.'
    }
  },
  'Mushrooms.jpg': {
    de: {
      title: 'Querfeldein zu den Pilzen',
      description: 'Naturnahes Qürformat mit satten Grüntönen und märchenhafter Miniaturstimmung.'
    },
    en: {
      title: 'Cross-country to the Mushrooms',
      description: 'Nature-focused landscape frame with rich greens and fairytale miniature mood.'
    }
  },
  'Muzan.jpg': {
    de: {
      title: 'Muzan stiller Tod',
      description: 'Dramatisches Hochformat mit kontrolliertem Gegenlicht und dunkler Eleganz.'
    },
    en: {
      title: 'Muzan silent death',
      description: 'Dramatic vertical frame with controlled backlight and dark elegance.'
    }
  },
  'Roof_Ghost.jpg': {
    de: {
      title: 'Stiller Tod',
      description: 'Vertikaler Night Shot mit kuhler Farbpalette und schwebender Mystery-Atmosphäre.'
    },
    en: {
      title: 'Silent Death',
      description: 'Vertical night shot with a cool palette and floating mystery atmosphere.'
    }
  },
  'Spongebob.jpg': {
    de: {
      title: 'Pizzastreit in Bikini Bottom',
      description: 'Farbiges Hochformat mit verspielter Requisite und klar lesbarer Comedy-Pose.'
    },
    en: {
      title: 'Pizza Fight in Bikini Bottom',
      description: 'Colorful vertical frame with playful props and clearly readable comedy posing.'
    }
  },
  'Stitch_In_Space.jpg': {
    de: {
      title: 'Stitch im All',
      description: 'Sci-Fi Qürformat mit Sternenlook, sattem Blau und dynamischer Figurensilhoütte.'
    },
    en: {
      title: 'Stitch in Space',
      description: 'Sci-fi landscape frame with a starfield look, rich blues and dynamic silhouette.'
    }
  },
  'Turtles_Breath.jpg': {
    de: {
      title: 'Schatten im Winter',
      description: 'Breiter Gruppenmoment mit Nebel, Tiefe und fokussierter Lichtkante auf den Figuren.'
    },
    en: {
      title: 'Shadows in Winter',
      description: 'Wide group moment with haze, depth and a focused rim light on the figures.'
    }
  },
  'Bruce_Lee_Vater_und_Meister.jpg': {
    de: {
      title: 'Bruce Lee Vater und Meister',
      description: 'Klassischer Charaktershot mit ruhiger Pose und klarem Fokus auf Ausdruck und Haltung.'
    },
    en: {
      title: 'Bruce Lee Father and Master',
      description: 'Classic character shot with a calm pose and a clear focus on expression and stance.'
    }
  },
  'Undercover.jpg': {
    de: {
      title: 'Undercover Mission',
      description: 'Querformat mit urbaner Spannung, verdeckter Pose und starkem Story-Vibe.'
    },
    en: {
      title: 'Undercover Mission',
      description: 'Landscape frame with urban tension, covert posing and strong story vibe.'
    }
  }
};

function shuffleArray(items) {
  const result = items.slice();

  for (let i = result.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function formatToyImageLabel(fileName) {
  return fileName
    .replace(/^toyphoto-|\.[^.]+$/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

function getToyCopy(fileName, copyKey, orientation, locale) {
  const defaultTitle = formatToyImageLabel(fileName);
  const defaultDescription = locale === 'en'
    ? orientation === 'wide' ? 'Toy photography landscape' : 'Toy photography portrait'
    : orientation === 'wide' ? 'Toy-Fotografie Querformat' : 'Toy-Fotografie Hochformat';

  const localizedCopy = TOY_GALLERY_COPY[copyKey]?.[locale];

  return {
    title: localizedCopy?.title?.trim() || defaultTitle,
    description: localizedCopy?.description?.trim() || defaultDescription
  };
}

function buildToyAltText(title) {
  return (title ?? '').toString().trim();
}

function initToyGallery() {
const currentPage = getCurrentPage().toLowerCase();
const isToyPage = currentPage === 'toys.html' || currentPage === 'toys_en.html';
if (!isToyPage) return;

  const grid = document.querySelector('.masonry-grid');
  if (!grid) return;

  const locale = getCurrentLocale();
  const shuffledImages = shuffleArray(TOY_GALLERY_IMAGES);

  grid.innerHTML = shuffledImages.map(({ file, copyKey, orientation }) => {
    const { title } = getToyCopy(file, copyKey, orientation, locale);
    const altText = buildToyAltText(title);

    const safeTitle = escapeHtml(title);
    const safeAltText = escapeHtml(altText);

    return `
      <article class="grid-item ${orientation}" tabindex="0">
        <img src="img/toyphotos/${file}" alt="${safeAltText}" loading="lazy">
        <div class="item-overlay">
          <h3>${safeTitle}</h3>
        </div>
      </article>
    `;
  }).join('');
}

// ------------------------------------------------------
// Entry point
// ------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  initPageTransitions();
  initHomeIntro();

  const locale = getCurrentLocale();
  const navFile = locale === 'en' ? 'nav_en.html' : 'nav.html';
  const footerFile = locale === 'en' ? 'footer_en.html' : 'footer.html';

  const navFallback = locale === 'en' ? getNavFallbackEn() : getNavFallback();
  const footerFallback = locale === 'en' ? getFooterFallbackEn() : getFooterFallback();

const initSharedNavigation = () => {
  initBootstrapNavState();
  initNavCloseButton();
  initPortfolioDropdown();
  setActiveNavLink();
  setLanguageToggleLinks();
  syncHeaderHeightVariable();
  initHeaderHideOnScroll();
};

  const sharedPartLoads = [
    loadSharedPart(navFile, 'nav-placeholder', navFallback, initSharedNavigation),
    loadSharedPart(footerFile, 'footer-placeholder', footerFallback)
  ];

  await Promise.all(sharedPartLoads);

  initToyGallery();
  initScrollTop();
  initCookieBanner();
  initVideoHover();
  initVideoReelCarousel();
  initVideoPosterResetOnEnd();
  initHeroSoundToggle();
  initHeroScrollHint();
  initImageModal();
  initContactForm();
  initScrollReveal();
});

function initHomeIntro() {
  const intro = document.getElementById('homeIntro');
  if (!intro) return;

  const introSessionKey = 'homeIntroSeen';
  const hasSeenIntro = sessionStorage.getItem(introSessionKey) === 'true';

  if (hasSeenIntro) {
    intro.remove();
    return;
  }

  sessionStorage.setItem(introSessionKey, 'true');

  const enterButton = document.getElementById('introEnterButton');
  const countdownText = document.getElementById('introCountdown');
  const locale = getCurrentLocale();

  const introText = locale === 'en'
    ? {
      countdown: (seconds) => `Automatic descent into the underground in ${seconds}s...`,
      done: 'Manhole unlocked. Dropping into the lair...'
    }
    : {
      countdown: (seconds) => `Automatischer Einstieg in den Untergrund in ${seconds}s...`,
      done: 'Kanaldeckel offen. Ab in den Unterschlupf...'
    };

  let secondsLeft = 5;
  let countdownTimer = null;
  let finished = false;

  const finishIntro = () => {
    if (finished) return;

    finished = true;
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }

    intro.classList.add('is-exiting');
    document.body.classList.remove('intro-active');

    window.setTimeout(() => {
      intro.remove();
    }, 420);
  };

  document.body.classList.add('intro-active');

  if (countdownText) {
    countdownText.textContent = introText.countdown(secondsLeft);
  }

  enterButton?.addEventListener('click', finishIntro);

  countdownTimer = window.setInterval(() => {
    secondsLeft -= 1;

    if (secondsLeft <= 0) {
      if (countdownText) {
        countdownText.textContent = introText.done;
      }
      finishIntro();
      return;
    }

    if (countdownText) {
      countdownText.textContent = introText.countdown(secondsLeft);
    }
  }, 1000);
}

async function fetchWithTimeout(url, timeout = APP_CONFIG.sharedPartTimeoutMs) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`${url} konnte nicht geladen werden.`);
    }
    return await response.text();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function loadSharedPart(file, placeholderId, fallbackHtml, callback) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  try {
    const html = await fetchWithTimeout(file);
    placeholder.innerHTML = html;
  } catch (error) {
    console.warn(`${file}: Fallback wird verwendet.`, error);
    placeholder.innerHTML = fallbackHtml;
  }

  if (typeof callback === 'function') {
    callback();
  }
}

const SHARED_FALLBACKS = {
  nav: {
    de: {
      bannerLabel: 'Hauptnavigation',
      homeHref: 'index.html',
      homeAriaLabel: 'Startseite Ujio the Turtle Samurai',
      logoAlt: 'Logo Ujio the Turtle Samurai',
      toggleAriaLabel: 'Navigation öffnen oder schließen',
      homeLabel: 'Start',
      portfolioToggleAria: 'Portfolio Menü öffnen oder schließen',
      portfolioMenuId: 'portfolioMenuDe',
      portfolioMenuAria: 'Portfolio Untermenü',
      toysHref: 'toys.html',
      toysLabel: 'Toyphotography',
      cosplayHref: 'cosplay.html',
      cosplayLabel: 'Cosplay',
      videosHref: 'videos.html',
      videosLabel: 'Videos',
      aboutHref: 'about.html',
      aboutLabel: 'Über',
      languageSwitchMarkup: ''
    },
    en: {
      bannerLabel: 'Main navigation',
      homeHref: 'index_en.html',
      homeAriaLabel: 'Home Ujio the Turtle Samurai',
      logoAlt: 'Logo Ujio the Turtle Samurai',
      toggleAriaLabel: 'Toggle navigation',
      homeLabel: 'Home',
      portfolioToggleAria: 'Open or close portfolio menu',
      portfolioMenuId: 'portfolioMenuEn',
      portfolioMenuAria: 'Portfolio submenu',
      toysHref: 'toys_en.html',
      toysLabel: 'Toy Photography',
      cosplayHref: 'cosplay_en.html',
      cosplayLabel: 'Cosplay',
      videosHref: 'videos_en.html',
      videosLabel: 'Videos',
      aboutHref: 'about_en.html',
      aboutLabel: 'About',
      languageSwitchMarkup: `
              <li class="nav-item language-switch" role="none">
                <a role="menuitem" href="index.html" class="nav-link">DE</a>
                <span class="lang-divider">|</span>
                <a role="menuitem" href="index_en.html" class="nav-link active">EN</a>
              </li>`
    }
  },
  footer: {
    de: {
      homeHref: 'index.html',
      homeAriaLabel: 'Zur Startseite',
      introCopy: 'TMNT Cosplay, Toyphotography und Video-Content mit cineastischer Atmosphäre.',
      navAriaLabel: 'Fußnavigation',
      navMarkup: `
          <a href="impressum.html">Impressum</a>
          <a href="datenschutz.html">Datenschutz</a>
          <a href="contact.html">Kontakt</a>`,
      socialAriaLabel: 'Social Media Profile',
      copyright: '© 2026 Ujio the Turtle Samurai. Alle Rechte vorbehalten.'
    },
    en: {
      homeHref: 'index_en.html',
      homeAriaLabel: 'Go to homepage',
      introCopy: 'TMNT cosplay, toy photography and video content with cinematic atmosphere.',
      navAriaLabel: 'Footer navigation',
      navMarkup: `
          <a href="impressum_en.html">Imprint</a>
          <a href="datenschutz_en.html">Privacy</a>
          <a href="contact_en.html">Contact</a>
          <a href="index.html">DE</a>`,
      socialAriaLabel: 'Social media profiles',
      copyright: '© 2026 Ujio the Turtle Samurai. All rights reserved.'
    }
  }
};

function buildNavFallback(locale) {
  const config = SHARED_FALLBACKS.nav[locale];

  return `
    <header role="banner" class="site-header">
      <nav class="nav-container navbar navbar-expand-lg" role="navigation" aria-label="${config.bannerLabel}">
        <div class="container">
          <a href="${config.homeHref}" class="logo-link navbar-brand d-flex align-items-center" aria-label="${config.homeAriaLabel}">
            <img src="img/ujio_logo_insta_fs.png" alt="${config.logoAlt}" class="logo-img">
            <span class="logo-text ms-2">Ujio the Turtle<br>Samurai</span>
          </a>

          <button
            class="menu-toggle navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="${config.toggleAriaLabel}">
            <span></span><span></span><span></span>
          </button>

          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="nav-menu navbar-nav ms-auto" role="menubar">
              <li class="nav-item" role="none"><a role="menuitem" href="${config.homeHref}" class="nav-link">${config.homeLabel}</a></li>
              <li class="nav-item nav-item-portfolio" role="none">
                <button
                  type="button"
                  class="nav-link nav-dropdown-toggle"
                  aria-expanded="false"
                  aria-controls="${config.portfolioMenuId}"
                  aria-label="${config.portfolioToggleAria}">
                  Portfolio
                </button>
                <ul id="${config.portfolioMenuId}" class="nav-submenu" role="menu" aria-label="${config.portfolioMenuAria}">
                  <li role="none"><a role="menuitem" href="${config.toysHref}" class="nav-link">${config.toysLabel}</a></li>
                  <li role="none"><a role="menuitem" href="${config.cosplayHref}" class="nav-link">${config.cosplayLabel}</a></li>
                  <li role="none"><a role="menuitem" href="${config.videosHref}" class="nav-link">${config.videosLabel}</a></li>
                </ul>
              </li>
              <li class="nav-item" role="none"><a role="menuitem" href="${config.aboutHref}" class="nav-link">${config.aboutLabel}</a></li>${config.languageSwitchMarkup}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `;
}

function buildFooterFallback(locale) {
  const config = SHARED_FALLBACKS.footer[locale];

  return `
    <footer role="contentinfo" class="site-footer py-4">
      <div class="footer-content container text-center">
        <a href="${config.homeHref}" class="logo-link d-inline-block mb-3" aria-label="${config.homeAriaLabel}">
          <img src="img/ujio_logo_insta_fs.png" alt="Ujio the Turtle Samurai Logo" class="footer-logo">
        </a>

        <p class="footer-copy-intro">
          ${config.introCopy}
        </p>

        <nav aria-label="${config.navAriaLabel}" class="d-flex justify-content-center gap-3 flex-wrap mb-3">
          ${config.navMarkup}
        </nav>

        <div class="footer-social-links" aria-label="${config.socialAriaLabel}">
          <a href="https://www.instagram.com/ujio_the_tmnt_samurai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.64 2.73a.94.94 0 1 1 0 1.88.94.94 0 0 1 0-1.88Zm-4.39 1.5a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"/></svg>
          </a>
          <a href="https://www.youtube.com/DEIN_YOUTUBE_CHANNEL" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10" fill="transparent" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2"/>
              <path d="M10 8l6 4-6 4V8z" fill="rgba(255,255,255,0.95)" />
            </svg>
          </a>
        </div>

        <p class="mb-0 small">${config.copyright}</p>
      </div>
    </footer>
  `;
}

function getNavFallback() {
  return buildNavFallback('de');
}

function getNavFallbackEn() {
  return buildNavFallback('en');
}

function getFooterFallback() {
  return buildFooterFallback('de');
}

function getFooterFallbackEn() {
  return buildFooterFallback('en');
}

function initBootstrapNavState() {
  const navCollapse = document.getElementById('mainNav');
  const navMenu = document.querySelector('.nav-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  const panelBackdrop = document.querySelector('.nav-panel-backdrop');

  if (!navCollapse || !navMenu || !menuToggle || typeof bootstrap === 'undefined') return;

  navCollapse.addEventListener('shown.bs.collapse', () => {
    navMenu.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
  });

  navCollapse.addEventListener('hidden.bs.collapse', () => {
    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });


}

function initNavCloseButton() {
  const navCollapse = document.getElementById('mainNav');
  const navPanel = document.querySelector('.nav-panel');
  const menuToggle = document.querySelector('.menu-toggle');
  const closeButtons = document.querySelectorAll('.nav-panel-close');

  if (!navCollapse || !navPanel || typeof bootstrap === 'undefined') return;

  let isClosingMenu = false;
  const closeDuration = 260;

  const finishClose = () => {
    const instance = bootstrap.Collapse.getOrCreateInstance(navCollapse);
    instance.hide();
  };

  const animateCloseMenu = () => {
    if (isClosingMenu) return;

    if (window.innerWidth > 991.98) {
      const instance = bootstrap.Collapse.getOrCreateInstance(navCollapse);
      instance.hide();
      return;
    }

    isClosingMenu = true;

    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }

    navPanel.classList.add('is-closing');

    window.setTimeout(finishClose, closeDuration);
  };

  closeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      animateCloseMenu();
    });
  });

  navCollapse.querySelectorAll('a.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 991.98) {
        animateCloseMenu();
      }
    });
  });

  navCollapse.addEventListener('hidden.bs.collapse', () => {
    navPanel.classList.remove('is-closing');
    isClosingMenu = false;
  });
}

function initPortfolioDropdown() {
  const dropdownItems = document.querySelectorAll('.nav-item-portfolio');
  if (!dropdownItems.length) return;

  const desktopQuery = window.matchMedia('(min-width: 992px)');
  const hoverCloseDelay = 180;
  const closeTimers = new WeakMap();

  const setOpenState = (item, isOpen) => {
    item.classList.toggle('is-open', isOpen);
    const toggle = item.querySelector('.nav-dropdown-toggle');
    toggle?.setAttribute('aria-expanded', String(isOpen));
  };

  const clearCloseTimer = (item) => {
    const timerId = closeTimers.get(item);
    if (timerId) {
      clearTimeout(timerId);
      closeTimers.delete(item);
    }
  };

  const scheduleClose = (item) => {
    clearCloseTimer(item);
    const timerId = setTimeout(() => {
      setOpenState(item, false);
      closeTimers.delete(item);
    }, hoverCloseDelay);
    closeTimers.set(item, timerId);
  };

  const closeAllDropdowns = () => {
    dropdownItems.forEach((item) => {
      clearCloseTimer(item);
      setOpenState(item, false);
    });
  };

  dropdownItems.forEach((item) => {
    const toggle = item.querySelector('.nav-dropdown-toggle');
    const submenu = item.querySelector('.nav-submenu');
    if (!toggle || !submenu) return;

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const willOpen = !item.classList.contains('is-open');
      closeAllDropdowns();
      setOpenState(item, willOpen);
    });

    item.addEventListener('mouseenter', () => {
      if (!desktopQuery.matches) return;
      closeAllDropdowns();
      setOpenState(item, true);
    });

    item.addEventListener('mouseleave', () => {
      if (!desktopQuery.matches) return;
      scheduleClose(item);
    });

    submenu.addEventListener('mouseenter', () => {
      if (!desktopQuery.matches) return;
      clearCloseTimer(item);
      setOpenState(item, true);
    });

    submenu.addEventListener('mouseleave', () => {
      if (!desktopQuery.matches) return;
      scheduleClose(item);
    });
  });

  desktopQuery.addEventListener('change', (event) => {
    if (!event.matches) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-item-portfolio')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllDropdowns();
    }
  });
}

function setActiveNavLink() {
  const currentPage = getCurrentPage();
  const links = document.querySelectorAll('.nav-link');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const isActive = href === currentPage;

    link.classList.toggle('active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // Portfolio aktiv markieren
  const isPortfolioPage = APP_CONFIG.portfolioPages.has(currentPage);

  document.querySelectorAll('.nav-item-portfolio').forEach((item) => {
    const toggle = item.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;

    toggle.classList.toggle('active', isPortfolioPage);

    if (isPortfolioPage) {
      toggle.setAttribute('aria-current', 'page');
    } else {
      toggle.removeAttribute('aria-current');
    }
  });
}

function setLanguageToggleLinks() {
  const targets = getLanguageTargets();
  const isEn = isEnglishPage();

  document.querySelectorAll('.lang-link-de').forEach((link) => {
    link.href = targets.de;
    link.classList.toggle('active', !isEn);
  });

  document.querySelectorAll('.lang-link-en').forEach((link) => {
    link.href = targets.en;
    link.classList.toggle('active', isEn);
  });
}

function initHeaderHideOnScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentY = window.scrollY;

    if (currentY > lastScrollY && currentY > 120) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

function syncHeaderHeightVariable() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let rafId = null;

  const applyHeaderHeight = () => {
    const nextHeight = Math.ceil(header.getBoundingClientRect().height);
    if (nextHeight > 0) {
      document.documentElement.style.setProperty('--header-height', `${nextHeight}px`);
    }
  };

  const queueApply = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      rafId = null;
      applyHeaderHeight();
    });
  };

  applyHeaderHeight();

  window.addEventListener('resize', queueApply, { passive: true });
  window.addEventListener('orientationchange', queueApply);
  window.addEventListener('load', queueApply, { once: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(queueApply).catch(() => {});
  }

  if (typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(queueApply);
    resizeObserver.observe(header);
  }
}

function initHeroSoundToggle() {
  const video = document.getElementById('heroVideo');
  const button = document.querySelector('.hero-sound-toggle');
  const text = button?.querySelector('.sound-text');

  if (!video || !button) return;

  const locale = getCurrentLocale();
const labelsByLocale = {
  de: { on: 'Sound aus', off: 'Sound an', ariaOn: 'Sound ausschalten', ariaOff: 'Sound einschalten' },
  en: { on: 'Sound off', off: 'Sound on', ariaOn: 'Mute sound', ariaOff: 'Unmute sound' }
};

const labels = labelsByLocale[locale] || labelsByLocale.de;

  const syncToggleState = () => {
    const isMuted = video.muted;
    button.classList.toggle('is-active', !isMuted);
    button.setAttribute('aria-pressed', String(!isMuted));
button.setAttribute('aria-label', isMuted ? labels.ariaOff : labels.ariaOn);
if (text) {
  text.textContent = isMuted ? labels.off : labels.on;
}
  };

  syncToggleState();

  let lastToggleAt = 0;

  const toggleSound = async () => {
    const now = Date.now();
    if (now - lastToggleAt < 300) return;
    lastToggleAt = now;

    const shouldUnmute = video.muted;

    if (shouldUnmute) {
      video.muted = false;
      if (video.volume === 0) {
        video.volume = 1;
      }

      try {
        await video.play();
      } catch {
        // Keep UI state in sync even if browser blocks playback temporarily.
      }
    } else {
      video.muted = true;
    }

    syncToggleState();
  };

  button.addEventListener('click', (event) => {
    event.preventDefault();
    toggleSound();
  });

  button.addEventListener('touchend', (event) => {
    event.preventDefault();
    toggleSound();
  }, { passive: false });

  video.addEventListener('volumechange', syncToggleState);
}

function initHeroScrollHint() {
  const button = document.querySelector('.hero-scroll-hint');
  if (!button) return;

  button.addEventListener('click', () => {
    const nextSection = document.querySelector('.portfolio-grid');
    if (!nextSection) return;

    nextSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
}

function initImageModal() {
  const locale = getCurrentLocale();
  const currentPage = getCurrentPage().toLowerCase();
  const modalI18nByLocale = {
  de: {
    preview: 'Bildvorschau',
    close: 'Schliessen',
    previous: 'Vorheriges Bild',
    next: 'Next image',
    thumbnails: 'Galerie Miniaturansichten',
    imageLabel: 'Bild'
  },
  en: {
    preview: 'Image preview',
    close: 'Close',
    previous: 'Previous image',
    next: 'Next image',
    thumbnails: 'Gallery thumbnails',
    imageLabel: 'Image'
  }
};

const modalI18n = modalI18nByLocale[locale] || modalI18nByLocale.de;

const lightboxBranding = (() => {
  if (currentPage === 'toys.html' || currentPage === 'toys_en.html') {
    return {
      top: 'UJIO THE TURTLE SAMURAI',
      bottom: locale === 'en' ? 'Toy Photography' : 'Toyfotografie'
    };
  }

  if (currentPage === 'cosplay.html' || currentPage === 'cosplay_en.html') {
    return {
      top: 'UJIO THE TURTLE SAMURAI',
      bottom: 'Cosplays/Props'
    };
  }

  return {
    top: '',
    bottom: ''
  };
})();

const modalThemeClass = (() => {
  if (currentPage === 'toys.html' || currentPage === 'toys_en.html') return 'theme-toys';
  if (currentPage === 'cosplay.html' || currentPage === 'cosplay_en.html') return 'theme-cosplay';
  return 'theme-default';
})();

  const initialImages = Array.from(document.querySelectorAll('.grid-item img, .masonry-grid img'));

  if (!initialImages.length) return;

  const modal = document.createElement('div');
  modal.id = 'image-modal';
  modal.className = `image-modal ${modalThemeClass}`;
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="image-modal-backdrop" data-modal-close="" tabindex="-1"></div>
    <p class="image-modal-brand${lightboxBranding.top ? '' : ' is-hidden'}">${lightboxBranding.top}</p>
    <div class="image-modal-inner" role="dialog" aria-modal="true" aria-label="${modalI18n.preview}">
      <button type="button" class="image-modal-close" data-modal-close="" aria-label="${modalI18n.close}">&times;</button>
      <button type="button" class="image-modal-nav prev" aria-label="${modalI18n.previous}">&#8249;</button>
      <img id="image-modal-img" src="" alt="" />
      <button type="button" class="image-modal-nav next" aria-label="${modalI18n.next}">&#8250;</button>
      <p id="image-modal-caption" class="image-modal-caption"></p>
      <div class="image-modal-thumbnails" aria-label="${modalI18n.thumbnails}"></div>
    </div>
    <p class="image-modal-topic${lightboxBranding.bottom ? '' : ' is-hidden'}">${lightboxBranding.bottom}</p>
  `;

  document.body.appendChild(modal);

  const modalImage = modal.querySelector('#image-modal-img');
  const caption = modal.querySelector('#image-modal-caption');
  const thumbnailsContainer = modal.querySelector('.image-modal-thumbnails');
  const prevButton = modal.querySelector('.image-modal-nav.prev');
  const nextButton = modal.querySelector('.image-modal-nav.next');

  const galleryPlaceholders = {
    de: {
      shredder: [
        { src: 'img/cosplays/shredder/Samurai_Shredder.jpg', alt: 'Samurai Shredder Portrait', caption: 'Samurai Shredder Portrait' },
        { src: 'img/cosplays/shredder/Shredder_Con.jpg', alt: 'Shredder auf der Convention', caption: 'Shredder auf der Convention' },
        { src: 'img/cosplays/shredder/Shredder_Krang.jpg', alt: 'Shredder und Krang Szene', caption: 'Shredder und Krang Szene' },
        { src: 'img/cosplays/shredder/Shredder_Krang_con.jpg', alt: 'Shredder und Krang auf der Convention', caption: 'Shredder und Krang auf der Convention' },
        { src: 'img/cosplays/shredder/Shredder_Rene.jpg', alt: 'Shredder Close-up von Rene', caption: 'Shredder Close-up von Rene' },
        { src: 'img/cosplays/shredder/Shredder_Samurai.jpg', alt: 'Samurai Shredder Action Pose', caption: 'Samurai Shredder Action Pose' }
      ],
      portrait: [
        { src: 'img/cosplays/roshi/Muten_front.jpg', alt: 'Master Roshi Frontportrait', caption: 'Master Roshi Frontportrait' },
        { src: 'img/cosplays/roshi/Muten_turtle.jpg', alt: 'Master Roshi mit Turtle', caption: 'Master Roshi mit Turtle' }
      ],
      'last-samurai': [
        { src: 'img/cosplays/casey/Casey-Jones-Skate.jpg', alt: 'Casey Jones in the skatepark', caption: 'Casey Jones in the skatepark' }
      ],
      cultist: [
        { src: 'img/cosplays/cultist/cultist-cosplay-mask-detail.jpg', alt: 'Innsmouth Kultist Masken-Detail', caption: 'Innsmouth Kultist Masken-Detail' },
        { src: 'img/cosplays/cultist/cultist-cosplay-top-view.jpg', alt: 'Innsmouth Kultist Oberansicht', caption: 'Innsmouth Kultist Oberansicht' }
      ],
      krang: [
        { src: 'img/cosplays/krang/krang-wagon-prop.jpg', alt: 'Krang-Wagon als Prop', caption: 'Krang-Wagon als Prop' },
        { src: 'img/cosplays/krang/shredder-krang-concept.jpg', alt: 'Samurai Shredder und Krang auf der ComicCon', caption: 'Samurai Shredder und Krang auf der ComicCon' }
      ],
      zepter: [
        { src: 'img/cosplays/zepter/zepter-full.jpg', alt: 'Zeit-Zepter Gesamtansicht', caption: 'Zeit-Zepter Gesamtansicht' },
        { src: 'img/cosplays/zepter/zepter-shredder.jpg', alt: 'Zeit-Zepter mit Shredder', caption: 'Zeit-Zepter mit Shredder' }
      ],
      ooze: [
        { src: 'img/cosplays/ooze/mutagen-ooze-krang-prop.jpg', alt: 'Mutagen-Ooze mit Krang', caption: 'Mutagen-Ooze mit Krang' }
      ],
      squad: [
        { src: 'img/group-shot.webp', alt: 'Squad Platzhalter 1', caption: 'Squad Galerie Platzhalter 1' },
        { src: 'img/group-shot.webp', alt: 'Squad Platzhalter 2', caption: 'Squad Galerie Platzhalter 2' },
        { src: 'img/group-shot.webp', alt: 'Squad Platzhalter 3', caption: 'Squad Galerie Platzhalter 3' },
        { src: 'img/group-shot.webp', alt: 'Squad Platzhalter 4', caption: 'Squad Galerie Platzhalter 4' }
      ],
      'toy-macro': [
        { src: 'img/toy-detail.webp', alt: 'Toy Macro Platzhalter 1', caption: 'Toy Macro Galerie Platzhalter 1' },
        { src: 'img/toy-detail.webp', alt: 'Toy Macro Platzhalter 2', caption: 'Toy Macro Galerie Platzhalter 2' },
        { src: 'img/toy-detail.webp', alt: 'Toy Macro Platzhalter 3', caption: 'Toy Macro Galerie Platzhalter 3' }
      ],
      'toy-stopmotion': [
        { src: 'img/Pingu.jpg', alt: 'Stop-Motion Platzhalter 1', caption: 'Stop-Motion Galerie Platzhalter 1' },
        { src: 'img/Pingu.jpg', alt: 'Stop-Motion Platzhalter 2', caption: 'Stop-Motion Galerie Platzhalter 2' },
        { src: 'img/Pingu.jpg', alt: 'Stop-Motion Platzhalter 3', caption: 'Stop-Motion Galerie Platzhalter 3' }
      ],
      'toy-sewer-battle': [
        { src: 'img/Lurtz-2.jpg', alt: 'Sewer Battle Platzhalter 1', caption: 'Sewer Battle Galerie Platzhalter 1' },
        { src: 'img/Lurtz-2.jpg', alt: 'Sewer Battle Platzhalter 2', caption: 'Sewer Battle Galerie Platzhalter 2' },
        { src: 'img/Lurtz-2.jpg', alt: 'Sewer Battle Platzhalter 3', caption: 'Sewer Battle Galerie Platzhalter 3' }
      ],
      'toy-lighting-main': [
        { src: 'img/Super7.jpg', alt: 'Lighting Setup Platzhalter 1', caption: 'Lighting Setup Galerie Platzhalter 1' },
        { src: 'img/Super7.jpg', alt: 'Lighting Setup Platzhalter 2', caption: 'Lighting Setup Galerie Platzhalter 2' },
        { src: 'img/Super7.jpg', alt: 'Lighting Setup Platzhalter 3', caption: 'Lighting Setup Galerie Platzhalter 3' }
      ],
      'toy-lighting-alt': [
        { src: 'img/Super7.jpg', alt: 'Lighting Setup Alt Platzhalter 1', caption: 'Lighting Setup Alt Galerie Platzhalter 1' },
        { src: 'img/Super7.jpg', alt: 'Lighting Setup Alt Platzhalter 2', caption: 'Lighting Setup Alt Galerie Platzhalter 2' },
        { src: 'img/Super7.jpg', alt: 'Lighting Setup Alt Platzhalter 3', caption: 'Lighting Setup Alt Galerie Platzhalter 3' }
      ]
    },
    en: {
      shredder: [
        { src: 'img/cosplays/shredder/Samurai_Shredder.jpg', alt: 'Samurai Shredder portrait', caption: 'Samurai Shredder portrait' },
        { src: 'img/cosplays/shredder/Shredder_Con.jpg', alt: 'Shredder at the convention', caption: 'Shredder at the convention' },
        { src: 'img/cosplays/shredder/Shredder_Krang.jpg', alt: 'Shredder and Krang scene', caption: 'Shredder and Krang scene' },
        { src: 'img/cosplays/shredder/Shredder_Krang_con.jpg', alt: 'Shredder and Krang at the convention', caption: 'Shredder and Krang at the convention' },
        { src: 'img/cosplays/shredder/Shredder_Rene.jpg', alt: 'Shredder close-up by Rene', caption: 'Shredder close-up by Rene' },
        { src: 'img/cosplays/shredder/Shredder_Samurai.jpg', alt: 'Samurai Shredder action pose', caption: 'Samurai Shredder action pose' }
      ],
      portrait: [
        { src: 'img/cosplays/roshi/Muten_front.jpg', alt: 'Master Roshi front portrait', caption: 'Master Roshi front portrait' },
        { src: 'img/cosplays/roshi/Muten_turtle.jpg', alt: 'Master Roshi with turtle', caption: 'Master Roshi with turtle' }
      ],
      'last-samurai': [
        { src: 'img/cosplays/casey/Casey-Jones-Skate.jpg', alt: 'Casey Jones in the skatepark', caption: 'Casey Jones in the skatepark' }
      ],
      cultist: [
        { src: 'img/cosplays/cultist/cultist-cosplay-mask-detail.jpg', alt: 'Innsmouth cultist mask detail', caption: 'Innsmouth cultist mask detail' },
        { src: 'img/cosplays/cultist/cultist-cosplay-top-view.jpg', alt: 'Innsmouth cultist top view', caption: 'Innsmouth cultist top view' }
      ],
      krang: [
        { src: 'img/cosplays/krang/krang-wagon-prop.jpg', alt: 'Krang wagon prop', caption: 'Krang wagon prop' },
        { src: 'img/cosplays/krang/shredder-krang-concept.jpg', alt: 'Samurai Shredder and Krang at ComicCon', caption: 'Samurai Shredder and Krang at ComicCon' }
      ],
      zepter: [
        { src: 'img/cosplays/zepter/zepter-full.jpg', alt: 'Time Scepter full view', caption: 'Time Scepter full view' },
        { src: 'img/cosplays/zepter/zepter-shredder.jpg', alt: 'Time Scepter with Shredder', caption: 'Time Scepter with Shredder' }
      ],
      ooze: [
        { src: 'img/cosplays/ooze/mutagen-ooze-krang-prop.jpg', alt: 'Mutagen ooze with Krang', caption: 'Mutagen ooze with Krang' }
      ],
      squad: [
        { src: 'img/group-shot.webp', alt: 'Squad placeholder 1', caption: 'Squad gallery placeholder 1' },
        { src: 'img/group-shot.webp', alt: 'Squad placeholder 2', caption: 'Squad gallery placeholder 2' },
        { src: 'img/group-shot.webp', alt: 'Squad placeholder 3', caption: 'Squad gallery placeholder 3' },
        { src: 'img/group-shot.webp', alt: 'Squad placeholder 4', caption: 'Squad gallery placeholder 4' }
      ],
      'toy-macro': [
        { src: 'img/toy-detail.webp', alt: 'Toy macro placeholder 1', caption: 'Toy macro gallery placeholder 1' },
        { src: 'img/toy-detail.webp', alt: 'Toy macro placeholder 2', caption: 'Toy macro gallery placeholder 2' },
        { src: 'img/toy-detail.webp', alt: 'Toy macro placeholder 3', caption: 'Toy macro gallery placeholder 3' }
      ],
      'toy-stopmotion': [
        { src: 'img/Pingu.jpg', alt: 'Stop-motion placeholder 1', caption: 'Stop-motion gallery placeholder 1' },
        { src: 'img/Pingu.jpg', alt: 'Stop-motion placeholder 2', caption: 'Stop-motion gallery placeholder 2' },
        { src: 'img/Pingu.jpg', alt: 'Stop-motion placeholder 3', caption: 'Stop-motion gallery placeholder 3' }
      ],
      'toy-sewer-battle': [
        { src: 'img/Lurtz-2.jpg', alt: 'Sewer Battle placeholder 1', caption: 'Sewer Battle gallery placeholder 1' },
        { src: 'img/Lurtz-2.jpg', alt: 'Sewer Battle placeholder 2', caption: 'Sewer Battle gallery placeholder 2' },
        { src: 'img/Lurtz-2.jpg', alt: 'Sewer Battle placeholder 3', caption: 'Sewer Battle gallery placeholder 3' }
      ],
      'toy-lighting-main': [
        { src: 'img/Super7.jpg', alt: 'Lighting setup placeholder 1', caption: 'Lighting setup gallery placeholder 1' },
        { src: 'img/Super7.jpg', alt: 'Lighting setup placeholder 2', caption: 'Lighting setup gallery placeholder 2' },
        { src: 'img/Super7.jpg', alt: 'Lighting setup placeholder 3', caption: 'Lighting setup gallery placeholder 3' }
      ],
      'toy-lighting-alt': [
        { src: 'img/Super7.jpg', alt: 'Lighting setup alt placeholder 1', caption: 'Lighting setup alt gallery placeholder 1' },
        { src: 'img/Super7.jpg', alt: 'Lighting setup alt placeholder 2', caption: 'Lighting setup alt gallery placeholder 2' },
        { src: 'img/Super7.jpg', alt: 'Lighting setup alt placeholder 3', caption: 'Lighting setup alt gallery placeholder 3' }
      ]
    }
  };

  let groupedImages = {};
  let activeGallery = initialImages;
  let currentIndex = 0;
  const defaultGroup = 'default';
 const isToyPage = currentPage === 'toys.html' || currentPage === 'toys_en.html';

  const getGroupId = (img) => {
    if (isToyPage) return defaultGroup;
    return img.dataset.gallery || img.closest('article')?.dataset.gallery || defaultGroup;
  };

  const buildGroups = (images) => {
    groupedImages = {};
    images.forEach((img) => {
      const groupId = getGroupId(img);
      if (!groupedImages[groupId]) groupedImages[groupId] = [];
      groupedImages[groupId].push(img);
    });
  };

  const getGalleryItems = (groupId) => {
    if (isToyPage) {
      return groupedImages[defaultGroup] ? [...groupedImages[defaultGroup]] : [];
    }
    const baseItems = groupedImages[groupId] ? [...groupedImages[groupId]] : [];
    const placeholders = galleryPlaceholders[locale] && galleryPlaceholders[locale][groupId]
      ? galleryPlaceholders[locale][groupId].map((item) => ({ ...item }))
      : [];
    return [...baseItems, ...placeholders];
  };

  buildGroups(initialImages);

  const closeModal = () => {
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalImage) modalImage.src = '';
  };

  const updateThumbnails = () => {
    if (!thumbnailsContainer) return;

    thumbnailsContainer.innerHTML = '';

    activeGallery.forEach((img, index) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'thumbnail-item';
      thumb.setAttribute('aria-label', `${modalI18n.imageLabel} ${index + 1}`);
      thumb.innerHTML = `<img src="${img.src}" alt="${img.alt || ''}" loading="lazy">`;
      if (index === currentIndex) thumb.classList.add('active');

      thumb.addEventListener('click', () => {
        currentIndex = index;
        showImageAtIndex(currentIndex);
      });

      thumbnailsContainer.appendChild(thumb);
    });
  };

  const showImageAtIndex = (index) => {
    if (!modalImage || !activeGallery[index]) return;

    const resolveModalTitle = (item) => {
      const explicitTitle = item.dataset?.modalTitle || item.dataset?.caption || item.caption;
      if (explicitTitle && String(explicitTitle).trim()) return String(explicitTitle).trim();

      if (item.closest) {
        const heading = item.closest('.grid-item')?.querySelector('.item-overlay h1, .item-overlay h2, .item-overlay h3');
        if (heading?.textContent) return heading.textContent.trim();
      }

      return String(item.alt || '').trim();
    };

    const img = activeGallery[index];
    const src = img.src;
    const alt = img.alt || 'Bild';
    const titleText = resolveModalTitle(img);

    modalImage.src = src;
    modalImage.alt = alt;
    caption.textContent = titleText ? `✦ ${titleText}` : '';
    caption.style.display = titleText ? 'block' : 'none';
    currentIndex = index;

    if (thumbnailsContainer) {
      thumbnailsContainer.querySelectorAll('.thumbnail-item').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
      });
    }
  };

  const openModal = (index) => {
    if (!modalImage) return;

    showImageAtIndex(index);

    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    updateThumbnails();
    modal.querySelector('.image-modal-close')?.focus();
  };

  const registerImages = (images) => {
    const openImageFromElement = (img, event) => {
      event.preventDefault();

      const groupId = getGroupId(img);
      const galleryItems = getGalleryItems(groupId);
      activeGallery = galleryItems;
      currentIndex = galleryItems.findIndex((item) => item === img);

      openModal(currentIndex);
    };

    images.forEach((img) => {
      const card = img.closest('.grid-item');

      img.classList.add('image-popup-target');
      img.style.cursor = 'pointer';
      img.addEventListener('click', (event) => openImageFromElement(img, event));

      if (card) {
        card.style.cursor = 'pointer';

        if (!card.dataset.modalBound) {
          card.dataset.modalBound = 'true';

          card.addEventListener('click', (event) => {
            if (event.target.closest('button, a')) return;
            openImageFromElement(img, event);
          });

          card.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openImageFromElement(img, event);
          });
        }
      }
    });
  };

  registerImages(initialImages);

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + activeGallery.length) % activeGallery.length;
      showImageAtIndex(currentIndex);
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % activeGallery.length;
      showImageAtIndex(currentIndex);
    });
  }

  const closeButtons = modal.querySelectorAll('[data-modal-close]');
  closeButtons.forEach((btn) => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.closest('[data-modal-close]')) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('visible')) {
      closeModal();
    }
    if (event.key === 'ArrowLeft' && modal.classList.contains('visible')) {
      currentIndex = (currentIndex - 1 + activeGallery.length) % activeGallery.length;
      showImageAtIndex(currentIndex);
    }
    if (event.key === 'ArrowRight' && modal.classList.contains('visible')) {
      currentIndex = (currentIndex + 1) % activeGallery.length;
      showImageAtIndex(currentIndex);
    }
  });
}

function initScrollTop() {
  const button = document.querySelector('.scroll-top');
  if (!button) return;

  const toggleVisibility = () => {
    button.classList.toggle('show', window.scrollY > 120);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleVisibility();
}

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const storageKey = 'cookieBannerHidden';
  const isHidden = localStorage.getItem(storageKey) === 'true';

  if (isHidden) {
    banner.classList.add('is-hidden');
  }

  window.hideCookies = () => {
    banner.classList.add('is-hidden');
    localStorage.setItem(storageKey, 'true');
  };
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('contact-status');
  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const subjectInput = form.querySelector('input[name="subject"]');
  const messageInput = form.querySelector('textarea[name="message"]');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const formFields = [nameInput, emailInput, subjectInput, messageInput];

  const clearValidation = () => {
    formFields.forEach(field => field?.classList.remove('input-invalid'));
    if (status) {
      status.textContent = '';
      status.className = 'contact-status';
    }
  };

  const setError = (field, text) => {
    field?.classList.add('input-invalid');
    if (status) {
      status.textContent = text;
      status.className = 'contact-status contact-status-error';
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // wir senden jetzt manuell per fetch
    clearValidation();

    const nameVal = nameInput?.value?.trim() || '';
    const emailVal = emailInput?.value?.trim() || '';
    const subjectVal = subjectInput?.value?.trim() || '';
    const messageVal = messageInput?.value?.trim() || '';

    if (nameVal.length < 2 || nameVal.length > 100) {
      setError(nameInput, 'Name muss zwischen 2 und 100 Zeichen lang sein.');
      nameInput?.focus();
      return;
    }

    if (!emailPattern.test(emailVal)) {
      setError(emailInput, 'Bitte gib eine gültige E-Mail-Adresse ein.');
      emailInput?.focus();
      return;
    }

    if (subjectVal.length > 120) {
      setError(subjectInput, 'Betreff darf maximal 120 Zeichen haben.');
      subjectInput?.focus();
      return;
    }

    if (messageVal.length < 10 || messageVal.length > 1200) {
      setError(messageInput, 'Nachricht muss zwischen 10 und 1200 Zeichen lang sein.');
      messageInput?.focus();
      return;
    }

    try {
      if (status) {
        status.textContent = 'Wird gesendet...';
        status.className = 'contact-status';
      }

      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Senden fehlgeschlagen');
      }

      if (status) {
        status.textContent = 'Danke! Deine Nachricht wurde gesendet.';
        status.className = 'contact-status contact-status-success';
      }
      form.reset();
    } catch (error) {
      if (status) {
        status.textContent = 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
        status.className = 'contact-status contact-status-error';
      }
    }
  });
}

function initContactFormEn() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('contact-status');
  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const subjectInput = form.querySelector('input[name="subject"]');
  const messageInput = form.querySelector('textarea[name="message"]');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const formFields = [nameInput, emailInput, subjectInput, messageInput];

  const clearValidation = () => {
    formFields.forEach(field => field?.classList.remove('input-invalid'));
    if (status) {
      status.textContent = '';
      status.className = 'contact-status';
    }
  };

  const setError = (field, text) => {
    field?.classList.add('input-invalid');
    if (status) {
      status.textContent = text;
      status.className = 'contact-status contact-status-error';
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearValidation();

    const nameVal = nameInput?.value?.trim() || '';
    const emailVal = emailInput?.value?.trim() || '';
    const subjectVal = subjectInput?.value?.trim() || '';
    const messageVal = messageInput?.value?.trim() || '';

    if (nameVal.length < 2 || nameVal.length > 100) {
      setError(nameInput, 'Name must be between 2 and 100 characters.');
      nameInput?.focus();
      return;
    }

    if (!emailPattern.test(emailVal)) {
      setError(emailInput, 'Please enter a valid email address.');
      emailInput?.focus();
      return;
    }

    if (subjectVal.length > 120) {
      setError(subjectInput, 'Subject can be up to 120 characters.');
      subjectInput?.focus();
      return;
    }

    if (messageVal.length < 10 || messageVal.length > 1200) {
      setError(messageInput, 'Message must be between 10 and 1200 characters.');
      messageInput?.focus();
      return;
    }

    try {
      if (status) {
        status.textContent = 'Sending...';
        status.className = 'contact-status';
      }

      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Send failed');
      }

      if (status) {
        status.textContent = 'Thank you! Your message has been sent.';
        status.className = 'contact-status contact-status-success';
      }
      form.reset();
    } catch (error) {
      if (status) {
        status.textContent = 'An error occurred. Please try again later.';
        status.className = 'contact-status contact-status-error';
      }
    }
  });
}

// ------------------------------------------------------
// Page transitions (fade-out on leave, fade-in on load)
// ------------------------------------------------------
function initPageTransitions() {
  // Enable transitions only after JS has initialized.
  document.body.classList.add('transitions-enabled');
  document.body.classList.remove('page-leaving');

  // Fade in on load
  document.body.classList.add('page-visible');

  // Intercept internal link clicks for fade-out
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');

    // Skip: external links, anchors, mailto, javascript, target=_blank
const isSkippableLink =
  !href ||
  href.startsWith('#') ||
  href.startsWith('mailto:') ||
  href.startsWith('javascript:') ||
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  link.target === '_blank';

if (isSkippableLink) return;

    // Skip fade-out for language-switch links
    if (link.classList.contains('lang-link-de') || link.classList.contains('lang-link-en')) return;

    event.preventDefault();

    document.body.classList.remove('page-visible');
    document.body.classList.add('page-leaving');

setTimeout(() => {
  window.location.href = href;
}, 340);
  });

  // Also fade in on browser back/forward navigation
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      document.body.classList.add('transitions-enabled');
      document.body.classList.remove('page-leaving');
      document.body.classList.add('page-visible');
    }
  });
}

// ------------------------------------------------------
// Scroll reveal (fade-up on scroll)
// ------------------------------------------------------
function initScrollReveal() {
  const selector = [
    '.section-header-block',
    '.masonry-grid .grid-item',
    '.video-wrapper',
    '.about-section .row > [class*="col-"]',
    '.legal-section .legal-container',
    '.contact-form',
    '.social-links'
  ].join(', ');

  const targets = Array.from(document.querySelectorAll(selector));
  if (!targets.length) return;

  // Track grid-siblings for staggered delays
  const groupCounters = new WeakMap();

  targets.forEach((el) => {
    el.classList.add('reveal');

    const parent = el.parentElement;
    if (parent) {
      const count = groupCounters.get(parent) ?? 0;
      el.style.transitionDelay = `${count * 80}ms`;
      groupCounters.set(parent, count + 1);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach((el) => observer.observe(el));
}

function initVideoHover() {
  // Funktion deaktiviert: Videos sollen nur noch per Klick starten, nicht mehr per Hover.
  // (Die Steuerung erfolgt jetzt ausschließlich über das Karussell-Klick-Handling.)
}

function initVideoPosterResetOnEnd() {
  const videos = document.querySelectorAll('.video-wrapper video[poster]');
  if (!videos.length) return;

  const resetVideoPoster = (video) => {
    if (video.loop) return;

    video.pause();
    video.currentTime = 0;
    video.load();
  };

  videos.forEach((video) => {
    video.addEventListener('ended', () => resetVideoPoster(video));
  });
}

function initVideoReelCarousel() {
  const carousels = document.querySelectorAll('[data-video-carousel]');
  if (!carousels.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const locale = getCurrentLocale();

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('[data-video-track]');
    if (!track) return;
    const supportsPointerEvents = 'PointerEvent' in window;

    const originalSlides = Array.from(track.querySelectorAll('.reel-slide'));
    if (!originalSlides.length) return;

    originalSlides.forEach((slide, idx) => {
      slide.dataset.slideIndex = String(idx);
      slide.dataset.originalSlide = 'true';
    });

    const prependFragment = document.createDocumentFragment();
    originalSlides.forEach((slide, idx) => {
      const clone = slide.cloneNode(true);
      clone.dataset.slideIndex = String(idx);
      clone.dataset.clone = 'true';
      prependFragment.appendChild(clone);
    });

    const appendFragment = document.createDocumentFragment();
    originalSlides.forEach((slide, idx) => {
      const clone = slide.cloneNode(true);
      clone.dataset.slideIndex = String(idx);
      clone.dataset.clone = 'true';
      appendFragment.appendChild(clone);
    });

    track.prepend(prependFragment);
    track.appendChild(appendFragment);

    const slides = Array.from(track.querySelectorAll('.reel-slide'));
    const originalCount = originalSlides.length;
    const middleStartIndex = originalCount;
    const populatedOriginalIndices = originalSlides
      .map((slide, idx) => (slide.querySelector('video source[src]') ? idx : -1))
      .filter((idx) => idx >= 0);

    const preferredPopulatedOffset = Math.min(1, Math.max(0, populatedOriginalIndices.length - 1));
    const initialOriginalIndex = populatedOriginalIndices.length
      ? populatedOriginalIndices[preferredPopulatedOffset]
      : Math.min(Math.floor(originalCount / 2), originalCount - 1);

    let activeIndex = middleStartIndex + initialOriginalIndex;
    let scrollTicking = false;
    let isDragging = false;
    let pointerStartX = 0;
    let trackStartScrollLeft = 0;
    let dragDistance = 0;
    let isAdjustingLoop = false;
    let pendingPlayVideo = null;

    function setActiveAudioVideo(targetVideo) {
      const allVideos = track.querySelectorAll('video');
      allVideos.forEach((video) => {
        const shouldEnableSound = video === targetVideo;
        video.muted = !shouldEnableSound;
        updateSoundButtonState(video);
      });
    }

    function getVideoSoundButton(video) {
      return video.closest('.reel-placeholder-media')?.querySelector('.video-sound-toggle') || null;
    }

    function updateSoundButtonState(video) {
      const button = getVideoSoundButton(video);
      if (!button) return;

      const isMuted = video.muted;
      button.classList.toggle('is-muted', isMuted);
      button.classList.toggle('is-unmuted', !isMuted);
      button.setAttribute('aria-pressed', isMuted ? 'false' : 'true');

const soundButtonLabels = {
  de: {
    ariaMuted: 'Sound einschalten',
    ariaUnmuted: 'Sound ausschalten',
    titleMuted: 'Sound an',
    titleUnmuted: 'Sound aus'
  },
  en: {
    ariaMuted: 'Turn sound on',
    ariaUnmuted: 'Turn sound off',
    titleMuted: 'Sound on',
    titleUnmuted: 'Sound off'
  }
};

const labelSet = soundButtonLabels[locale] || soundButtonLabels.de;

button.setAttribute('aria-label', isMuted ? labelSet.ariaMuted : labelSet.ariaUnmuted);
button.setAttribute('title', isMuted ? labelSet.titleMuted : labelSet.titleUnmuted);
    }

    function attachSoundToggles() {
      const videos = track.querySelectorAll('video');
      videos.forEach((video) => {
        const media = video.closest('.reel-placeholder-media');
        if (!media || media.querySelector('.video-sound-toggle')) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'video-sound-toggle is-muted';
        button.setAttribute('aria-pressed', 'false');

        button.innerHTML = `
          <span class="sound-icon sound-icon-muted" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M14 5.23v13.54a1 1 0 0 1-1.64.77L7.6 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h3.6l4.76-3.54A1 1 0 0 1 14 5.23Z" fill="currentColor"></path>
              <path d="M18.5 9.5 15.5 12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M15.5 9.5 18.5 12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
          </span>
          <span class="sound-icon sound-icon-active" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M14 5.23v13.54a1 1 0 0 1-1.64.77L7.6 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h3.6l4.76-3.54A1 1 0 0 1 14 5.23Z" fill="currentColor"></path>
              <path d="M17 9a4.5 4.5 0 0 1 0 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"></path>
              <path d="M19.5 7a7.5 7.5 0 0 1 0 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"></path>
            </svg>
          </span>
        `;

        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (video.muted) {
            setActiveAudioVideo(video);
          } else {
            video.muted = true;
            updateSoundButtonState(video);
          }
        });

        media.appendChild(button);
        video.muted = true;
        updateSoundButtonState(video);
      });
    }

    function enforceVideoRestrictions() {
      const videos = track.querySelectorAll('video');
      videos.forEach((video) => {
        video.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback');
        video.setAttribute('disablePictureInPicture', '');
        video.addEventListener('contextmenu', (event) => event.preventDefault());
      });
    }

    function syncSlidePlayback() {
      slides.forEach((slide, idx) => {
        const video = slide.querySelector('video');
        if (!video) return;

        video.controls = idx === activeIndex;

        if (idx !== activeIndex) {
          video.pause();
          video.muted = true;
          updateSoundButtonState(video);
        }
      });
    }

    function getOriginalIndex(index) {
      return Number.parseInt(slides[index]?.dataset.slideIndex || '0', 10);
    }

    function getSlideCenterOffset(slide) {
      return slide.offsetLeft + (slide.offsetWidth / 2) - (track.clientWidth / 2);
    }

    function setActiveSlide(index) {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));
      slides.forEach((slide, idx) => {
        const delta = idx - activeIndex;
        const absDelta = Math.abs(delta);
        const isActive = idx === activeIndex;

        slide.classList.remove(
          'depth-near-left',
          'depth-near-right',
          'depth-mid-left',
          'depth-mid-right',
          'depth-far-left',
          'depth-far-right'
        );

        slide.classList.toggle('is-active', isActive);

        if (!isActive) {
          const side = delta < 0 ? 'left' : 'right';

          if (absDelta === 1) {
            slide.classList.add(side === 'left' ? 'depth-near-left' : 'depth-near-right');
          } else if (absDelta === 2) {
            slide.classList.add(side === 'left' ? 'depth-mid-left' : 'depth-mid-right');
          } else {
            slide.classList.add(side === 'left' ? 'depth-far-left' : 'depth-far-right');
          }
        }

        slide.style.zIndex = isActive ? '60' : String(Math.max(8, 50 - (absDelta * 8)));
        slide.setAttribute('aria-current', isActive ? 'true' : 'false');
      });

      syncSlidePlayback();

      if (pendingPlayVideo) {
        const activeVideo = slides[activeIndex]?.querySelector('video');
        if (activeVideo && activeVideo === pendingPlayVideo) {
          setActiveAudioVideo(activeVideo);
          activeVideo.play().catch(() => {});
          pendingPlayVideo = null;
        }
      }
    }

    function getLoopedRenderedIndex(index) {
      const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
      const originalIndex = getOriginalIndex(safeIndex);
      return middleStartIndex + originalIndex;
    }

    function syncLoopPosition() {
      if (isAdjustingLoop) return;

      const activeOriginalIndex = getOriginalIndex(activeIndex);
      const loopedIndex = middleStartIndex + activeOriginalIndex;

      if (activeIndex !== loopedIndex) {
        isAdjustingLoop = true;
        track.scrollTo({ left: getSlideCenterOffset(slides[loopedIndex]), behavior: 'auto' });
        setActiveSlide(loopedIndex);
        window.requestAnimationFrame(() => {
          isAdjustingLoop = false;
        });
      }
    }

    function detectNearestSlide() {
      const trackCenter = track.scrollLeft + (track.clientWidth / 2);
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, idx) => {
        const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
        const distance = Math.abs(slideCenter - trackCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = idx;
        }
      });

      setActiveSlide(nearest);
      syncLoopPosition();
    }

    function goToSlide(index, behavior = prefersReducedMotion ? 'auto' : 'smooth') {
      const wrappedIndex = ((index % slides.length) + slides.length) % slides.length;
      const target = slides[wrappedIndex];
      if (!target) return;

      track.scrollTo({
        left: getSlideCenterOffset(target),
        behavior
      });
    }

    track.addEventListener('scroll', () => {
      if (scrollTicking) return;
      scrollTicking = true;

      window.requestAnimationFrame(() => {
        detectNearestSlide();
        scrollTicking = false;
      });
    }, { passive: true });

    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToSlide(activeIndex + 1);
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToSlide(activeIndex - 1);
      }
    });

    track.addEventListener('mousedown', (event) => {
      if (event.button !== 0) return;
      isDragging = true;
      pointerStartX = event.pageX;
      trackStartScrollLeft = track.scrollLeft;
      dragDistance = 0;
      track.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (event) => {
      if (!isDragging) return;
      const deltaX = event.pageX - pointerStartX;
      dragDistance = Math.max(dragDistance, Math.abs(deltaX));
      track.scrollLeft = trackStartScrollLeft - deltaX;
    });

    function endMouseDrag() {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
      detectNearestSlide();
    }

    window.addEventListener('mouseup', endMouseDrag);
    track.addEventListener('mouseleave', endMouseDrag);

    slides.forEach((slide, idx) => {
      slide.addEventListener('focusin', () => goToSlide(idx));

      const media = slide.querySelector('.reel-placeholder-media');
      const video = slide.querySelector('video');
      let lastTouchActivationAt = 0;
      let touchStartX = 0;
      let touchStartY = 0;
      let touchMoved = false;

      function getEventPoint(event) {
        if (event.changedTouches && event.changedTouches.length) {
          return event.changedTouches[0];
        }

        if (event.touches && event.touches.length) {
          return event.touches[0];
        }

        return event;
      }

      function beginTouchTracking(event) {
        const point = getEventPoint(event);
        touchStartX = point.clientX || 0;
        touchStartY = point.clientY || 0;
        touchMoved = false;
      }

      function updateTouchTracking(event) {
        const point = getEventPoint(event);
        const deltaX = Math.abs((point.clientX || 0) - touchStartX);
        const deltaY = Math.abs((point.clientY || 0) - touchStartY);

        if (deltaX > 10 || deltaY > 10) {
          touchMoved = true;
        }
      }

      function handleSlideActivation() {
        if (!video) return;

        if (idx !== activeIndex) {
          pendingPlayVideo = video;
          goToSlide(idx);
          return;
        }

        if (!video.paused && !video.ended) {
          video.pause();
          return;
        }

        setActiveAudioVideo(video);
        video.play().catch(() => {});
      }

      function handleTapActivation(event) {
        if (!video) return;
        if (event.target.closest('.video-sound-toggle')) return;
        if (dragDistance > 8) return;
        if (touchMoved) return;

        lastTouchActivationAt = Date.now();
        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();
        handleSlideActivation();
      }

      media?.addEventListener('click', (event) => {
        if (!video) return;
        if (event.target.closest('.video-sound-toggle')) return;
        if (dragDistance > 8) return;
        if (Date.now() - lastTouchActivationAt < 450) return;

        handleSlideActivation();
        event.stopPropagation();
      });

      if (supportsPointerEvents) {
        media?.addEventListener('pointerdown', (event) => {
          if (event.pointerType === 'mouse') return;
          beginTouchTracking(event);
        });

        media?.addEventListener('pointermove', (event) => {
          if (event.pointerType === 'mouse') return;
          updateTouchTracking(event);
        });

        media?.addEventListener('pointerup', (event) => {
          if (event.pointerType === 'mouse') return;
          handleTapActivation(event);
        });
      } else {
        media?.addEventListener('touchstart', beginTouchTracking, { passive: true });
        media?.addEventListener('touchmove', updateTouchTracking, { passive: true });
        media?.addEventListener('touchend', handleTapActivation, { passive: false });
      }

      video?.addEventListener('click', (event) => {
        if (dragDistance > 8) {
          event.preventDefault();
          return;
        }
        if (Date.now() - lastTouchActivationAt < 450) return;

        event.preventDefault();
        event.stopPropagation();
        handleSlideActivation();
      });

      if (supportsPointerEvents) {
        video?.addEventListener('pointerdown', (event) => {
          if (event.pointerType === 'mouse') return;
          beginTouchTracking(event);
        });

        video?.addEventListener('pointermove', (event) => {
          if (event.pointerType === 'mouse') return;
          updateTouchTracking(event);
        });

        video?.addEventListener('pointerup', (event) => {
          if (event.pointerType === 'mouse') return;
          handleTapActivation(event);
        });
      } else {
        video?.addEventListener('touchstart', beginTouchTracking, { passive: true });
        video?.addEventListener('touchmove', updateTouchTracking, { passive: true });
        video?.addEventListener('touchend', handleTapActivation, { passive: false });
      }

      slide.addEventListener('click', (event) => {
        if (dragDistance > 8) {
          event.preventDefault();
          return;
        }
        if (Date.now() - lastTouchActivationAt < 450) return;

        if (event.target.closest('.video-sound-toggle')) return;

        handleSlideActivation();
      });
    });

    track.addEventListener('click', (event) => {
      if (dragDistance > 8) return;
      if (event.target.closest('.reel-slide') || event.target.closest('video')) return;

      const rect = track.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      if (clickX < rect.width / 2) {
        goToSlide(activeIndex - 1);
      } else {
        goToSlide(activeIndex + 1);
      }
    });

    window.addEventListener('resize', detectNearestSlide, { passive: true });

    enforceVideoRestrictions();
    attachSoundToggles();
    setActiveSlide(middleStartIndex + initialOriginalIndex);
    goToSlide(middleStartIndex + initialOriginalIndex, 'auto');

    window.requestAnimationFrame(() => {
      goToSlide(middleStartIndex + initialOriginalIndex, 'auto');
      detectNearestSlide();
    });

    window.setTimeout(() => {
      detectNearestSlide();
    }, 180);
  });
}




