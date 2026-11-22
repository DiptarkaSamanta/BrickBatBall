# 🌌 CHRONO BREAKER & ARCADE SUITE
### Featuring *Chrono Breaker: The Lost Dimensions*, *Bricks of Egypt*, and *Jardinains!*

A complete, polished, original 2D browser-based brick-breaker arcade experience built with modern HTML5 Canvas, CSS3, and vanilla JavaScript ES6 modules.

---

## 🎮 Game Modes in This Suite

1. ⚡ **CHRONO BREAKER: THE LOST DIMENSIONS** (Original Flagship Arcade Game - 60 Levels, 6 Worlds, 6 Bosses, Upgrades, Shop, Achievements)
2. 🏺 **BRICKS OF EGYPT** (Authentic 2004 Game Recreation - 40 Levels, 8 Level Packs, Fire Bricks, Falling Scarabs, Water Drops, Guardian Eye of Horus)
3. 🧙‍♂️ **JARDINAINS!** (Classic 2001 Game Recreation - 30 Levels, Heckling Gnomes, Flowerpot Dodging, Gnome Juggling & Multipliers)
4. ⚡ **MASHUP MODE** (Gnomes Invading Egyptian Tombs, Mummy & Pharaoh Gnomes, Cascading Gems)

---

## 🚀 Instant Play

### Windows 1-Click Launch
Double-click:
```bat
play.bat
```
[play.bat](file:///d:/projects/jardnais/play.bat)

*Or run via Python resilient launcher:*
```bash
python launch.py chrono    # Launches Chrono Breaker directly
python launch.py           # Launches Main Suite Selector
```
*Or open [chrono.html](file:///d:/projects/jardnais/chrono.html) or [index.html](file:///d:/projects/jardnais/index.html) directly in any modern browser!*

### 🌐 GitHub Pages Deployment
This game is 100% client-side with zero build steps or backend dependencies.
1. Push this repository to GitHub (`https://github.com/DiptarkaSamanta/BrickBatBall`).
2. Go to repository **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` and root `/`.
4. Click **Save**. Your game will be live at `https://diptarkasamanta.github.io/BrickBatBall/chrono.html`!

---

## ⚡ CHRONO BREAKER: THE LOST DIMENSIONS

### 🌌 Story & Lore
The Chrono Matrix has shattered, tearing reality into six fractured dimensions. As the pilot of the Chrono Paddle, traverse each temporal era, harvest Chrono Shards, shatter fortified anomalies, and defeat the colossal guardians defending each realm before facing **The Chrono Architect** at the edge of time.

---

### 🗺️ The 6 Dimensions (60 Handcrafted Levels)

| World | Dimension Name | Environment & Scenery | Level 10 Boss |
| :---: | :--- | :--- | :--- |
| **1** | **Lost Egypt** | Golden sands, glowing pyramids, solar corona, rising embers | **Chrono Sphinx** (Solar flare cannons & homing drones) |
| **2** | **Mystic Forest** | Bioluminescent jungle, ancient runes, glowing spore motes | **Sylvan Goliath** (Rune colossus, thorn bursts & root shields) |
| **3** | **Frozen Kingdom** | Glacial spires, shimmering auroras, sub-zero ice rifts | **Cryo Wyrm** (Ice dragon, freezing blizzards & shard volleys) |
| **4** | **Machine City** | Cyberpunk circuits, high-voltage grids, steam vents | **Overclock Core** (Autonomous dreadnought dynamo & EMP lasers) |
| **5** | **Cosmic Void** | Nebular deep space, twinkling starfields, singularity vortex | **Astral Devourer** (Gravitational distortion & void spheres) |
| **6** | **Final Dimension**| Temporal nexus, reality fractures, kaleidoscopic dials | **The Chrono Architect** (Supreme Master of Time, 3 phases) |

Each world has 10 handcrafted playable levels with distinct geometric layouts, brick combinations, and difficulty progression.

---

### 🧱 The 10 Unique Brick Types

| Brick Type | Appearance | Gameplay Mechanic |
| :--- | :--- | :--- |
| **Normal** | World themed neon | 1 hit to destroy, awards base points and combos. |
| **Stone** | Chiseled granite | Multi-hit armored block (2-3 hits). Shows progressive realistic fissures/cracks. |
| **Iron** | Steel plating & rivets | Indestructible to standard balls. Can be obliterated by Explosive TNT or Lasers! |
| **Explosive** | Glowing TNT canister | Detonates in a wide blast radius on impact, triggering chain reactions with adjacent bombs! |
| **Moving** | Amber kinetic block | Patrols back and forth horizontally across the arena. |
| **Invisible** | Cloaked stealth field | Cloaked from view; briefly flashes when nearby bricks or balls pulse. |
| **Regenerating**| Emerald nano-weave | Rebuilds and restores itself 6.5s after being shattered unless the level is cleared! |
| **Power** | Cyan glowing star | Guaranteed power-up drop when destroyed! |
| **Portal** | Swirling purple vortex | Paired wormholes; entering one warps the ball to the other with momentum preserved. |
| **Crystal** | Shimmering diamond facet| Drops collectible **💎 Chrono Crystals** used for permanent upgrades in the shop! |

---

### ⚡ Power-Ups & Special Equipment

* **⚡3 Multi-Ball:** Splits each active ball into 3 diverging balls. Every ball simulates full physics independently; you only lose a life when the final ball falls.
* **🔥 Fireball:** Superheats the ball with a blazing flame trail. Cleaves directly through all destructible bricks without deflecting!
* **⬌ Wide Paddle:** Extends the paddle width by 50% for 15 seconds.
* **🧲 Magnet Catch:** Catches balls safely upon paddle contact. Aim with mouse/keys and press Space or Click to relaunch at the optimal angle.
* **⚡ Laser Cannons:** Mounts dual plasma blasters on paddle wings. Press Left Click or Space to fire rapid piercing bolts up into bricks and bosses!
* **⏳ Slow Motion:** Dilates time, reducing ball speed by 50% for pin-point precision.
* **❄️ Time Freeze:** Freezes all moving hazards, obstacles, and boss attack timers for 6 seconds.
* **💖 Extra Life:** Bestows an additional life heart.
* **🛡️ Energy Barrier:** Deploys a bottom protective barrier grid that bounces lost balls back upward into play!

---

### 💎 Quantum Upgrade Matrix (Shop)

Earn Chrono Shards by shattering Crystal bricks and spend them in the Upgrade Matrix:
1. **Quantum Expander:** Permanently widens base paddle width (+10px per rank, up to Rank 5).
2. **Plasma Capacitors:** Extends Laser Cannon duration (+20% per rank) and boosts fire rate.
3. **Dimensional Shield:** Begin every level with free protective barrier charges (Rank 1 & 2).
4. **Shard Attractor:** Magnetically draws falling Chrono Crystals towards your paddle.
5. **Temporal Dilator:** Enhances Slow Motion and Time Freeze durations (+25% per rank).

---

### 🏆 Achievements (12 Trackable Badges)

* **First Fracture:** Destroy your first temporal brick.
* **Dimension Hopper:** Complete World 1 (Lost Egypt).
* **Nature Guardian:** Defeat the Sylvan Goliath in World 2.
* **Absolute Zero:** Defeat the Cryo Wyrm in World 3.
* **System Override:** Defeat Overclock Core in World 4.
* **Into the Abyss:** Defeat Astral Devourer in World 5.
* **Chrono Master:** Defeat The Chrono Architect and restore the timeline!
* **Crystal Miner:** Collect 50 Chrono Crystals.
* **Temporal Tycoon:** Accumulate 300 Chrono Crystals.
* **Plasma Storm:** Destroy 25 bricks with laser cannons.
* **Combo King:** Achieve a 15x hit combo without dropping the ball.
* **Power Overwhelming:** Have 3 different power-ups active simultaneously.

---

### 🎮 Controls

| Action | Desktop Controls | Touch / Mobile |
| :--- | :--- | :--- |
| **Move Paddle** | Mouse Movement / Left-Right Arrow Keys / A & D | Touch & Drag anywhere on canvas |
| **Launch Ball / Fire Lasers** | Left Mouse Click / Spacebar | Tap screen |
| **Pause / Resume** | **P** or **Escape** | Pause button in HUD |
| **Restart Level** | **R** | Pause modal > Restart |
| **Toggle Audio** | **M** | Settings modal |

---

## 🛠️ Project Structure & Architecture

```
d:/projects/jardnais/
├── index.html              # Main Arcade Suite (Bricks of Egypt, Jardinains & Chrono Breaker)
├── chrono.html             # Dedicated Standalone Chrono Breaker Game
├── styles.css              # Master combined stylesheet
├── style.css               # Classic Arcade Suite stylesheet
├── chrono.css              # Modern Sci-Fi Chrono Breaker stylesheet
├── play.bat                # 1-Click Windows Batch Launcher
├── launch.py               # Resilient Python server & browser launcher
├── test_chrono.js          # Automated Node.js integration verification suite
├── README.md               # Complete documentation & guides
│
├── src/                    # Chrono Breaker ES6 Modules
│   ├── config.js           # World constants, brick types, power-ups, upgrades, physics
│   ├── storage.js          # Safe LocalStorage persistence (scores, stars, upgrades, achievements)
│   ├── audio.js            # Zero-dependency procedural Web Audio API synth (8 tracks, 15+ SFX)
│   ├── backgrounds.js      # Procedural canvas backgrounds & ambient effects for all 6 worlds
│   ├── particles.js        # Brick shards, explosions, sparks, shockwave rings, floating text, screen shake
│   ├── physics.js          # Anti-tunneling swept AABB, paddle curvature deflection, loop breaker
│   ├── ball.js             # Ball entity, comet trails, fireball mode, multi-ball simulation
│   ├── paddle.js           # Paddle entity, mouse/touch/keyboard control, lasers, magnet, barrier
│   ├── bricks.js           # All 10 brick types (Normal, Stone, Iron, TNT, Moving, Stealth, Regen, Portal, Crystal)
│   ├── powerups.js         # Falling power-up capsules, crystals, magnet attraction, active timers
│   ├── bosses.js           # 6 World Bosses (health bars, phased attacks, projectiles, death sequences)
│   ├── levels.js           # 60 distinct level designs (10 levels per world)
│   ├── ui.js               # HUD, menus, level select, upgrade matrix, achievements, settings, modals
│   ├── engine.js           # Central game loop, delta time, collision coordinator, state machine
│   └── main.js             # Bootstrapper entry point
│
├── js/                     # Bricks of Egypt & Jardinains Engines
│   ├── audio.js            # Procedural Web Audio synth for retro suite
│   ├── editor.js           # Interactive in-game level editor
│   ├── game.js             # Classic game engine & gnome juggling
│   ├── levels.js           # 70+ Classic levels
│   ├── particles.js        # Clay & bandage particles
│   └── sprites.js          # Canvas vector sprites for gnomes & hieroglyphs
│
└── assets/                 # Vector SVG game artwork
    ├── icon-chrono.svg     # Chrono Breaker crest
    └── icon-crystal.svg    # Chrono Shard diamond vector
```

---

## 🔒 Verification & Quality Assurance

* **Zero Syntax Errors:** Verified with `node -c src/*.js` and `node -c js/*.js`.
* **Complete Level Catalog:** All 60 levels and 6 bosses verified via `node test_chrono.js`.
* **Zero External Dependencies:** 100% self-contained procedural graphics and audio, runs entirely offline.
* **Anti-Tunneling Physics:** Sub-stepped continuous collision checks ensure high-speed balls never pass through bricks.
* **Loop Prevention:** Automatic vertical velocity correction prevents balls from being trapped in infinite horizontal bounces.
