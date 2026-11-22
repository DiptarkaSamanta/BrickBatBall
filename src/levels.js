/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * 60 Distinct Handcrafted Levels Across All 6 Dimensions
 */

import { BRICK_TYPES, WORLDS, CANVAS_WIDTH } from './config.js';
import { Brick } from './bricks.js';

export class LevelCatalog {
    constructor() {
        this.levels = this.buildAllLevels();
    }

    getLevel(worldIdx, levelNum) {
        const id = `${worldIdx}-${levelNum}`;
        return this.levels.find(l => l.id === id) || this.levels[0];
    }

    buildAllLevels() {
        const all = [];

        // 6 Worlds, 10 Levels Each = 60 Levels
        for (let w = 0; w < 6; w++) {
            for (let lvl = 1; lvl <= 10; lvl++) {
                all.push(this.generateLevelData(w, lvl));
            }
        }

        return all;
    }

    generateLevelData(worldIdx, levelNum) {
        const id = `${worldIdx}-${levelNum}`;
        const world = WORLDS[worldIdx];
        const isBoss = levelNum === 10;

        const levelNames = [
            // World 0: Lost Egypt
            [
                'Outer Dunes', 'Sun Disc Chamber', 'Scarab Corridor', 'Sandstone Vault',
                'Ankh Sanctuary', 'Pharaoh Mirror', 'Obelisk Pillar', 'Solar Nexus',
                'Curse of the Sands', 'Tomb of the Chrono Sphinx'
            ],
            // World 1: Mystic Forest
            [
                'Emerald Canopy', 'Spore Hollow', 'Rune Stones', 'Bramble Thicket',
                'Bioluminescent Grove', 'Ancient Hollow', 'Root Maze', 'Elder Whispers',
                'Canopy of Eternity', 'Heart of the Sylvan Goliath'
            ],
            // World 2: Frozen Kingdom
            [
                'Glacial Gate', 'Permafrost Ridge', 'Ice Spire', 'Crystal Cavern',
                'Blizzard Chasm', 'Sub-Zero Rift', 'Frozen Echoes', 'Avalanche Pass',
                'Aurora Sanctum', 'Lair of the Cryo Wyrm'
            ],
            // World 3: Machine City
            [
                'Conduit Alley', 'Steam Generator', 'Neon Grid', 'Gearbox Alley',
                'Flux Capacitor', 'Silicon Valley', 'Cyber Citadel', 'Overclocked Dynamo',
                'High Voltage Core', 'Chamber of Overclock Core'
            ],
            // World 4: Cosmic Void
            [
                'Stardust Shallows', 'Asteroid Belt', 'Dark Matter Spire', 'Singularity Edge',
                'Nebular Waves', 'Event Horizon', 'Pulsar Beam', 'Supernova Gate',
                'Cosmic Abyss', 'Domain of Astral Devourer'
            ],
            // World 5: Final Dimension
            [
                'Temporal Fracture', 'Chrono Mirror', 'Quantum Horizon', 'Clockwork Paradox',
                'Warp Grid', 'Nexus of Eternity', 'Reality Shards', 'Singularity Core',
                'Infinity Gate', 'Sanctum of The Chrono Architect'
            ]
        ];

        const name = levelNames[worldIdx][levelNum - 1];

        // Handcrafted layouts per level pattern
        const grid = this.generateGrid(worldIdx, levelNum, isBoss);

        return {
            id,
            worldIdx,
            levelNum,
            name: `${world.name} ${levelNum}: ${name}`,
            worldName: world.name,
            isBossLevel: isBoss,
            themeColor: world.themeColor,
            targetScore: 5000 + worldIdx * 4000 + levelNum * 1200,
            grid
        };
    }

    generateGrid(worldIdx, levelNum, isBoss) {
        if (isBoss) {
            // Boss Arena: open central area for boss movement with defensive perimeter bricks
            return [
                '..I..I..I..I..',
                '.C.P.X.X.P.C..',
                'S............S',
                'M............M',
                '..............',
                '..............',
                '..R........R..',
                '....S.P.S.....'
            ];
        }

        // Varied geometric and tactical layouts
        const layouts = [
            // Level 1: Classic Pyramid/V
            [
                '.....N.N.....',
                '....NN.NN....',
                '...NNN.NNN...',
                '..NNNN.NNNN..',
                '..P.C...C.P..'
            ],
            // Level 2: Alternating Stone Pillars
            [
                'S.N.S.N.S.N.S',
                'N.S.N.S.N.S.N',
                'S.P.S.C.S.P.S',
                'N.X.N.X.N.X.N',
                '..S.N.S.N.S..'
            ],
            // Level 3: Moving Brick Patrol with Portals
            [
                'T.N.N.N.N.N.T',
                '..M.M...M.M..',
                'N.X.N.C.N.X.N',
                '..S.P...P.S..',
                '....N...N....'
            ],
            // Level 4: Diamond Shield
            [
                '....S.I.S....',
                '...S.N.N.S...',
                '..S.X.C.X.S..',
                '.S.N.P.P.N.S.',
                '..S.N.N.N.S..',
                '...S.M.M.S...',
                '....S.S.S....'
            ],
            // Level 5: Invisible Stealth Grid
            [
                'N.V.N.V.N.V.N',
                'V.C.V.P.V.C.V',
                'N.V.R.R.R.V.N',
                'V.N.X.X.X.N.V',
                '..V.N.V.N.V..'
            ],
            // Level 6: Fortress with Iron Anchors
            [
                'I.N.S.P.S.N.I',
                'I.X.N.C.N.X.I',
                '..M.S.R.S.M..',
                'S.N.I.T.I.N.S',
                '..P.N...N.P..'
            ],
            // Level 7: Regenerating Matrix
            [
                'R.R.N.P.N.R.R',
                'N.X.S.C.S.X.N',
                'R.M.N.R.N.M.R',
                'N.S.T...T.S.N',
                '..R.N...N.R..'
            ],
            // Level 8: Explosive Chain Gauntlet
            [
                'S.X.S.X.S.X.S',
                'X.C.X.P.X.C.X',
                'S.X.I.X.I.X.S',
                'X.N.M.N.M.N.X',
                '..X.S.P.S.X..'
            ],
            // Level 9: The Pre-Boss Super Vault
            [
                'I.T.S.X.S.T.I',
                'M.C.P.R.P.C.M',
                'S.V.N.C.N.V.S',
                'I.X.S.P.S.X.I',
                '..M.R...R.M..'
            ]
        ];

        return layouts[(levelNum - 1) % layouts.length];
    }

    instantiateBricks(levelData) {
        const bricks = [];
        const grid = levelData.grid;
        const totalRows = grid.length;
        const cols = grid[0].length;

        const brickWidth = 52;
        const brickHeight = 20;
        const paddingX = 4;
        const paddingY = 4;

        const totalWidth = cols * (brickWidth + paddingX) - paddingX;
        const startX = (CANVAS_WIDTH - totalWidth) / 2;
        const startY = 70;

        let portalCounter = 0;

        for (let r = 0; r < totalRows; r++) {
            const rowStr = grid[r];
            for (let c = 0; c < rowStr.length; c++) {
                const char = rowStr[c];
                if (char === '.') continue; // empty space

                const bx = startX + c * (brickWidth + paddingX);
                const by = startY + r * (brickHeight + paddingY);

                let type = BRICK_TYPES.NORMAL;
                let hits = 1;
                const opts = { color: levelData.themeColor };

                switch (char) {
                    case 'S':
                        type = BRICK_TYPES.STONE;
                        hits = 2 + (levelData.worldIdx >= 3 ? 1 : 0);
                        break;
                    case 'I':
                        type = BRICK_TYPES.IRON;
                        hits = 999;
                        break;
                    case 'X':
                        type = BRICK_TYPES.EXPLOSIVE;
                        hits = 1;
                        break;
                    case 'M':
                        type = BRICK_TYPES.MOVING;
                        hits = 1;
                        opts.minX = Math.max(20, bx - 60);
                        opts.maxX = Math.min(CANVAS_WIDTH - brickWidth - 20, bx + 60);
                        break;
                    case 'V':
                        type = BRICK_TYPES.INVISIBLE;
                        hits = 1;
                        break;
                    case 'R':
                        type = BRICK_TYPES.REGENERATING;
                        hits = 1;
                        break;
                    case 'P':
                        type = BRICK_TYPES.POWER;
                        hits = 1;
                        break;
                    case 'T':
                        type = BRICK_TYPES.PORTAL;
                        hits = 1;
                        opts.portalId = Math.floor(portalCounter++ / 2);
                        break;
                    case 'C':
                        type = BRICK_TYPES.CRYSTAL;
                        hits = 1;
                        opts.crystalAmount = Math.floor(Math.random() * 2) + 1;
                        break;
                    case 'N':
                    default:
                        type = BRICK_TYPES.NORMAL;
                        hits = 1;
                        break;
                }

                bricks.push(new Brick(bx, by, brickWidth, brickHeight, type, hits, opts));
            }
        }

        return bricks;
    }
}

export const levelCatalog = new LevelCatalog();
