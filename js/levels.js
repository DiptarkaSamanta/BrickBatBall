// levels.js - Comprehensive Level Catalog for Jardinains & Bricks of Egypt!
// 40 Levels for Bricks of Egypt (8 classic Level Packs) + 30 Levels for Jardinains + 30 Mashup Levels.

const COLOR_MAP = {
    // Jardinains colors
    '1': '#3b82f6', // Blue
    '2': '#22c55e', // Green
    '3': '#eab308', // Yellow
    '4': '#f97316', // Orange
    '5': '#ef4444', // Red
    '6': '#a855f7', // Purple
    '7': '#ec4899', // Pink
    'C': '#94a3b8', // Silver Cracked (2 hits)
    'H': '#64748b', // Heavy Stone (3 hits)
    'T': '#dc2626', // TNT
    'I': '#e2e8f0', // Indestructible Ingot
    '?': '#06b6d4', // Mystery Power-up

    // Bricks of Egypt blocks
    'A': '#f59e0b', // Ankh Sandstone (Gold)
    'E': '#0284c7', // Eye of Horus (Azure)
    'S': '#059669', // Scarab (Emerald)
    'R': '#dc2626', // Sun of Ra (Crimson)
    'F': '#1d4ed8', // Falcon (Royal Blue)
    'L': '#9333ea', // Lotus (Amethyst)
    'G': '#eab308', // Pharaoh Gold Cartouche (2 hits)
    'K': '#78716c', // Heavy Granite Sarcophagus (3 hits)
    'U': '#b45309', // Combustible Clay Oil Urn (TNT)
    'O': '#27272a', // Indestructible Obelisk
    'X': '#ea580c', // Fire Brick (Must extinguish or break)
};

const GLYPH_MAP = {
    'A': '☥',
    'E': '𓂀',
    'S': '𓆣',
    'R': '𓇳',
    'F': '𓅃',
    'L': '𓆸',
    'G': '𓊪',
    'K': '𓊅',
    'U': '🏺',
    'O': '𓉐',
    'X': '🔥',
    '?': '★'
};

// =========================================================================
// GAME 1: BRICKS OF EGYPT (40 HANDCRAFTED LEVELS ACROSS 8 LEVEL PACKS)
// Pure authentic Bricks of Egypt: Fire bricks, Hieroglyphs, Falling Treasures
// =========================================================================
const BRICKS_OF_EGYPT_LEVELS = [
    // --- PACK 1: TUTANKHAMEN ---
    {
        name: "Chamber of the Boy King", pack: "Tutankhamen", isEgypt: true,
        grid: [
            "..............", "..............",
            "..AAAAAAAAAA..", "..EEEEEEEEEE..",
            "..SSSSSSSSSS..", "..RRRRRRRRRR..",
            "..FFFFFFFFFF..", "..............",
        ]
    },
    {
        name: "The Golden Sarcophagus", pack: "Tutankhamen", isEgypt: true,
        grid: [
            ".....GGGG.....", "...GGKKKKGG...",
            "..GGKAAAAKGG..", "..GGKAUUAKGG..",
            "..GGKAAAAKGG..", "...GGKKKKGG...",
            ".....GGGG.....", "..............",
        ]
    },
    {
        name: "Tomb Corridor", pack: "Tutankhamen", isEgypt: true,
        grid: [
            "O............O", "OK.AAAAAAAA.KO",
            "OK.AEEEEEEA.KO", "OK.AUUUUUUA.KO",
            "OK.AEEEEEEA.KO", "OK.AAAAAAAA.KO",
            "O............O", "..............",
        ]
    },
    {
        name: "Canopic Shrine", pack: "Tutankhamen", isEgypt: true,
        grid: [
            "..U..U..U..U..", ".AAAAAAAAAAAA.",
            "..U..U..U..U..", ".EEEEEEEEEEEE.",
            "..U..U..U..U..", ".SSSSSSSSSSSS.",
            "..............", "..............",
        ]
    },
    {
        name: "Treasury of Tut", pack: "Tutankhamen", isEgypt: true,
        grid: [
            "....GGGGGG....", "...G??????G...",
            "..GGKAAAAKGG..", "..GKKAUUAKKG..",
            "..GGKAAAAKGG..", "...G??????G...",
            "....GGGGGG....", "..............",
        ]
    },

    // --- PACK 2: TEMPLE MAYHEM ---
    {
        name: "Karnak Columns", pack: "Temple Mayhem", isEgypt: true,
        grid: [
            "GG..GG..GG..GG", "KK..KK..KK..KK",
            "AA..AA..AA..AA", "UU..UU..UU..UU",
            "AA..AA..AA..AA", "KK..KK..KK..KK",
            "GG..GG..GG..GG", "..............",
        ]
    },
    {
        name: "Luxor Pylon", pack: "Temple Mayhem", isEgypt: true,
        grid: [
            "K....K....K...", "KK..KK..KKKK..",
            "AK..AK..AKKK..", "AAKAAKAAAAKK..",
            "AAAAAAAAAAAK..", "GGGGGGGGGGGG..",
            "UUUUUUUUUUUU..", "..............",
        ]
    },
    {
        name: "Avenue of Sphinxes", pack: "Temple Mayhem", isEgypt: true,
        grid: [
            "....GGGGGG....", "...GGRAARGG...",
            "....GGGGGG....", ".KKKAAAAAAAAKK",
            "KKKKAAAAAAAAKK", "KK..UU....UU..",
            "KK..UU....UU..", "..............",
        ]
    },
    {
        name: "Hypostyle Hall", pack: "Temple Mayhem", isEgypt: true,
        grid: [
            "O..O..OO..O..O", ".AA.AA..AA.AA.",
            "O..O..OO..O..O", ".EE.EE..EE.EE.",
            "O..O..OO..O..O", ".UU.UU..UU.UU.",
            "..............", "..............",
        ]
    },
    {
        name: "Sanctum Sanctorum", pack: "Temple Mayhem", isEgypt: true,
        grid: [
            "...KKKKKKKK...", "..KGGGGGGGGK..",
            ".KG........GK.", ".KG..UUUU..GK.",
            ".KG..????..GK.", ".KG........GK.",
            "..KGGGGGGGGK..", "...KKKKKKKK...",
        ]
    },

    // --- PACK 3: ECHO CHAMBERS ---
    {
        name: "Whispering Tombs", pack: "Echo Chambers", isEgypt: true,
        grid: [
            "E...E...E...E.", ".F.F.F.F.F.F.F",
            "..A...A...A...", ".S.S.S.S.S.S.S",
            "E...E...E...E.", ".F.F.F.F.F.F.F",
            "..A...A...A...", "..............",
        ]
    },
    {
        name: "The Acoustic Vault", pack: "Echo Chambers", isEgypt: true,
        grid: [
            "OOOOOOOOOOOOOO", "O............O",
            "O.OOOOOOOOOO.O", "O.O.AAAAAA.O.O",
            "O.O.AUUUUA.O.O", "O.O.AAAAAA.O.O",
            "O............O", "..............",
        ]
    },
    {
        name: "Chamber of Osiris", pack: "Echo Chambers", isEgypt: true,
        grid: [
            "....KKKKKK....", "...KGGGGGGK...",
            "..KGAAAAAAGK..", "..KGAAUUAAAK..",
            "..KGAAAAAAGK..", "...KGGGGGGK...",
            "....KKKKKK....", "..............",
        ]
    },
    {
        name: "Resonance of Ra", pack: "Echo Chambers", isEgypt: true,
        grid: [
            "..RR......RR..", ".RXXR....RXXR.",
            "RXXXXR..RXXXXR", ".RXXR....RXXR.",
            "..RR..UU..RR..", ".....UUUU.....",
            "......UU......", "..............",
        ]
    },
    {
        name: "Catacombs of Amun", pack: "Echo Chambers", isEgypt: true,
        grid: [
            "K..K..KK..K..K", ".AA.AA..AA.AA.",
            "K..K..KK..K..K", ".SS.SS..SS.SS.",
            "K..K..KK..K..K", ".EE.EE..EE.EE.",
            "..............", "..............",
        ]
    },

    // --- PACK 4: FIRE ON THE ROCKS ---
    {
        name: "Lava of the Nile", pack: "Fire on the Rocks", isEgypt: true,
        grid: [
            "......XX......", ".....5XX5.....",
            "....XXXXXX....", "...XXXXXXXX...",
            "..XXAAUUAAXX..", ".XXXXXXXXXXXX.",
            "XXXXXXXXXXXXXX", "..............",
        ]
    },
    {
        name: "Blazing Sandstone", pack: "Fire on the Rocks", isEgypt: true,
        grid: [
            "X.X.X.X.X.X.X.", ".A.A.A.A.A.A.A",
            "X.X.X.X.X.X.X.", ".U.U.U.U.U.U.U",
            "X.X.X.X.X.X.X.", ".G.G.G.G.G.G.G",
            "..............", "..............",
        ]
    },
    {
        name: "Inferno of Seth", pack: "Fire on the Rocks", isEgypt: true,
        grid: [
            "....XXXXXX....", "...XGGGGGGX...",
            "..XG..UU..GX..", "..XG......GX..",
            "...X..AA..X...", "....X.AA.X....",
            "....XXXXXX....", "..............",
        ]
    },
    {
        name: "Fire Urn Gauntlet", pack: "Fire on the Rocks", isEgypt: true,
        grid: [
            "UUUUUUUUUUUUUU", "XXXXXXXXXXXXXX",
            "AAAAAAAAAAAAAA", "GGGGGGGGGGGGGG",
            "KKKKKKKKKKKKKK", "OOOOOOOOOOOOOO",
            "..............", "..............",
        ]
    },
    {
        name: "Molten Pyramid", pack: "Fire on the Rocks", isEgypt: true,
        grid: [
            "......XX......", ".....XGGX.....",
            "....XGGGGX....", "...XGGUUGGX...",
            "..XGGAAAAKGGX.", ".XGGAAAAAAKGGX",
            "XXXXXXXXXXXXXX", "..............",
        ]
    },

    // --- PACK 5: PYRAMID OF MADNESS ---
    {
        name: "The Ascending Passage", pack: "Pyramid of Madness", isEgypt: true,
        grid: [
            "......GG......", ".....GKKG.....",
            "....GKKKKG....", "...GKKUUKKG...",
            "..GKKAAAAKKG..", ".GKKAAAAAAKKG.",
            "GGGGGGGGGGGGGG", "..............",
        ]
    },
    {
        name: "Grand Gallery", pack: "Pyramid of Madness", isEgypt: true,
        grid: [
            "O............O", "OK..........KO",
            "OK.AAAAAAAA.KO", "OK.AUUUUUUA.KO",
            "OK.AEEEEEEA.KO", "OK.AAAAAAAA.KO",
            "OK..........KO", "O............O",
        ]
    },
    {
        name: "The King's Chamber", pack: "Pyramid of Madness", isEgypt: true,
        grid: [
            "....OOOOOO....", "...O??????O...",
            "..OOGGKKGGOO..", "..KK.UUUU.KK..",
            "..AAAAAAAAAA..", "..SSSSSSSSSS..",
            "..RRRRRRRRRR..", "..............",
        ]
    },
    {
        name: "The Air Shafts", pack: "Pyramid of Madness", isEgypt: true,
        grid: [
            "A..A..AA..A..A", "E..E..EE..E..E",
            "S..S..SS..S..S", "R..R..RR..R..R",
            "G..G..GG..G..G", "U..U..UU..U..U",
            "..............", "..............",
        ]
    },
    {
        name: "Apex of the Pharaoh", pack: "Pyramid of Madness", isEgypt: true,
        grid: [
            "..OO..OOOO..OO..", "..OOGGKKKKGGOO..",
            "..OOG??????GGOO..", "..KK.UUUUUU.KK..",
            "..AAAAAAAAAAAA..", "..SSSSSSSSSSSS..",
            "..RRRRRRRRRRRR..", "................",
        ]
    },

    // --- PACK 6: NEFERTITI'S VAULT ---
    {
        name: "Queen's Regalia", pack: "Nefertiti", isEgypt: true,
        grid: [
            "?A?A?A?A?A?A?A", "A?A?A?A?A?A?A?",
            "?E?E?E?E?E?E?E", "E?E?E?E?E?E?E?",
            "?L?L?L?L?L?L?L", "L?L?L?L?L?L?L?",
            "..............", "..............",
        ]
    },
    {
        name: "Lapis Lazuli Throne", pack: "Nefertiti", isEgypt: true,
        grid: [
            "....FFFFFF....", "...FFGGGGFF...",
            "..FFGFFFFGFF..", "..FFGSUUSGFF..",
            "..FFGFFFFGFF..", "...FFGGGGFF...",
            "....FFFFFF....", "..............",
        ]
    },
    {
        name: "Amethyst Archways", pack: "Nefertiti", isEgypt: true,
        grid: [
            "..LL......LL..", ".L??L....L??L.",
            "..LL..LL..LL..", "......LL......",
            "..LL..LL..LL..", ".L??L.LL.L??L.",
            "..LL..LL..LL..", "..............",
        ]
    },
    {
        name: "Turquoise Oasis", pack: "Nefertiti", isEgypt: true,
        grid: [
            "..EE......EE..", ".E??E....E??E.",
            "..EE..EE..EE..", "......EE......",
            "..SS..SS..SS..", ".S??S.SS.S??S.",
            "..SS..SS..SS..", "..............",
        ]
    },
    {
        name: "Crown of Upper Egypt", pack: "Nefertiti", isEgypt: true,
        grid: [
            "......GG......", "....GGGGGG....",
            "...GGRAARGG...", "..GGRAAAARGG..",
            ".GGRAAAAAARGG.", "GGGGGGGGGGGGGG",
            "..............", "..............",
        ]
    },

    // --- PACK 7: PHARAOH'S CURSE ---
    {
        name: "The Mummy's Seal", pack: "Pharaoh's Curse", isEgypt: true,
        grid: [
            "....KKKKKK....", "...KGGGGGGGK..",
            "..KG..UU..GK..", "..KG......GK..",
            "...K..AA..K...", "....K.AA.K....",
            "....KKKKKK....", "..............",
        ]
    },
    {
        name: "Scarabs of Anubis", pack: "Pharaoh's Curse", isEgypt: true,
        grid: [
            "..SS..SS..SS..", ".S??SS??SS??S.",
            "..SS..SS..SS..", ".S??SS??SS??S.",
            "..SS..SS..SS..", ".S??SS??SS??S.",
            "..SS..SS..SS..", "..............",
        ]
    },
    {
        name: "Weighing of the Heart", pack: "Pharaoh's Curse", isEgypt: true,
        grid: [
            "......OO......", "....OOOOOO....",
            "..OO..OO..OO..", ".A......UU....",
            "AAA....UUUU...", ".A......UU....",
            "..............", "..............",
        ]
    },
    {
        name: "Shadow of the Underworld", pack: "Pharaoh's Curse", isEgypt: true,
        grid: [
            "R............R", "RR...XXXX...RR",
            "RXR.XGGGGX.RXR", ".XGXRSSSSRXGX.",
            "..SGSG??GSGS..", "...SSSUUSSS...",
            ".....SSSS.....", "..............",
        ]
    },
    {
        name: "Judgment of Osiris", pack: "Pharaoh's Curse", isEgypt: true,
        grid: [
            "..K.OOOOOO.K..", "..K.O????O.K..",
            "..K.OGGKGO.K..", "..KKKKKKKKKK..",
            "...UUAAAAUU...", "..GGGGGGGGGG..",
            "..SSSSSSSSSS..", "..............",
        ]
    },

    // --- PACK 8: THE EYE OF HORUS ---
    {
        name: "The Sacred Eye", pack: "Eye of Horus", isEgypt: true,
        grid: [
            "...EEEEEEEE...", "..E????????E..",
            ".E??AAAAAA??E.", ".E?A......A?E.",
            ".E?A..UU..A?E.", ".E?A......A?E.",
            "..E????????E..", "...EEEEEEEE...",
        ]
    },
    {
        name: "Amulet of Wadjet", pack: "Eye of Horus", isEgypt: true,
        grid: [
            "......EE......", ".....E??E.....",
            "....E?GG?E....", "...E?GAAAG?E...",
            "....E?GG?E....", ".....E??E.....",
            "......EE......", "..............",
        ]
    },
    {
        name: "Solar Falcon", pack: "Eye of Horus", isEgypt: true,
        grid: [
            "F............F", "FF...RRRR...FF",
            "FRF.RGGGGFRF..", ".RFRGSSSSGRFR.",
            "..SGSG??GSGS..", "...SSSUUSSS...",
            ".....SSSS.....", "..............",
        ]
    },
    {
        name: "Ra's Radiance", pack: "Eye of Horus", isEgypt: true,
        grid: [
            "......RR......", ".....RXXR.....",
            "....RXXXXR....", "...RXXXXXXR...",
            "..RXXGAAUXXR..", ".RXXXXXXXXXXR.",
            "RRRRRRRRRRRRRR", "..............",
        ]
    },
    {
        name: "Eternal Temple of Horus", pack: "Eye of Horus", isEgypt: true,
        grid: [
            "..OO..OOOO..OO..", "..OOGGKKKKGGOO..",
            "..OOG??????GGOO..", "..KK.UUUUUU.KK..",
            "..AAAAAAAAAAAA..", "..SSSSSSSSSSSS..",
            "..EEEEEEEEEEEE..", "................",
        ]
    }
];

// =========================================================================
// GAME 2: JARDINAINS! (30 CLASSIC GARDEN LEVELS WITH GNOMES & JUGGLING)
// =========================================================================
const JARDINAINS_LEVELS = [
    {
        name: "First Garden", theme: "classic",
        grid: [
            "..............", "..............",
            "..5555555555..", "..4444444444..",
            "..3333333333..", "..2222222222..",
            "..1111111111..", "..............",
        ],
        gnomes: [
            { col: 3, row: 2, type: 'normal' },
            { col: 7, row: 2, type: 'normal' },
            { col: 10, row: 2, type: 'normal' }
        ]
    },
    {
        name: "Gnome Outpost", theme: "fortress",
        grid: [
            "..............", "..C........C..",
            "..C..5555..C..", "..C..4444..C..",
            "..H..3333..H..", "..H..2222..H..",
            "..HHHHHHHHHH..", "..1111111111..",
        ],
        gnomes: [
            { col: 2, row: 1, type: 'grumpy' },
            { col: 6, row: 2, type: 'normal' },
            { col: 11, row: 1, type: 'grumpy' }
        ]
    },
    {
        name: "Flower Power", theme: "nature",
        grid: [
            "......77......", "....77??77....",
            "..77..33..77..", "..??..TT..??..",
            "..77..33..77..", "....77??77....",
            "......22......", "......22......",
        ],
        gnomes: [
            { col: 6, row: 2, type: 'speedy' },
            { col: 2, row: 3, type: 'normal' },
            { col: 11, row: 3, type: 'normal' }
        ]
    },
    {
        name: "Smiley Day", theme: "fun",
        grid: [
            "....333333....", "..3333333333..",
            "..33.3333.33..", "..3333333333..",
            "..33.3333.33..", "..333....333..",
            "....333333....", "..............",
        ],
        gnomes: [
            { col: 4, row: 2, type: 'normal' },
            { col: 9, row: 2, type: 'normal' },
            { col: 6, row: 5, type: 'speedy' }
        ]
    },
    {
        name: "Pyramid of Nains", theme: "ancient",
        grid: [
            "......44......", ".....4CC4.....",
            "....4CCCC4....", "...4CCCCCC4...",
            "..4CCCCCCCC4..", ".4CCCCCCCCCC4.",
            "44444444444444", "..............",
        ],
        gnomes: [
            { col: 6, row: 0, type: 'king' },
            { col: 4, row: 2, type: 'normal' },
            { col: 9, row: 2, type: 'normal' },
            { col: 2, row: 5, type: 'grumpy' },
            { col: 11, row: 5, type: 'grumpy' }
        ]
    },
    {
        name: "Castle Moat", theme: "castle",
        grid: [
            "..H..H..H..H..", "..H..H..H..H..",
            "..HHHHHHHHHH..", "..H...TT...H..",
            "..H.66??66.H..", "..H.555555.H..",
            "..II......II..", "..............",
        ],
        gnomes: [
            { col: 2, row: 0, type: 'grumpy' },
            { col: 5, row: 0, type: 'normal' },
            { col: 8, row: 0, type: 'normal' },
            { col: 11, row: 0, type: 'grumpy' }
        ]
    },
    {
        name: "Checkerboard Alley", theme: "puzzle",
        grid: [
            ".1.2.3.4.5.6.7", "C.C.C.C.C.C.C.",
            ".7.6.5.4.3.2.1", "C.C.C.C.C.C.C.",
            ".1.2.3.4.5.6.7", "C.C.C.C.C.C.C.",
            "..............", "..............",
        ],
        gnomes: [
            { col: 1, row: 1, type: 'speedy' },
            { col: 5, row: 1, type: 'normal' },
            { col: 9, row: 1, type: 'speedy' },
            { col: 13, row: 1, type: 'normal' }
        ]
    },
    {
        name: "Diamond Ingot", theme: "treasure",
        grid: [
            "......II......", ".....I??I.....",
            "....I?CC?I....", "...I?C55C?I...",
            "....I?CC?I....", ".....I??I.....",
            "......II......", "..............",
        ],
        gnomes: [
            { col: 6, row: 3, type: 'grumpy' },
            { col: 7, row: 3, type: 'speedy' }
        ]
    },
    {
        name: "Gnome Village", theme: "village",
        grid: [
            ".5....5....5..", "555..555..555.",
            ".2....2....2..", "222..222..222.",
            "CCC..CCC..CCC.", "CCC..CCC..CCC.",
            "..............", "..............",
        ],
        gnomes: [
            { col: 1, row: 0, type: 'normal' },
            { col: 6, row: 0, type: 'grumpy' },
            { col: 11, row: 0, type: 'normal' },
            { col: 1, row: 2, type: 'speedy' },
            { col: 11, row: 2, type: 'speedy' }
        ]
    },
    {
        name: "King Nain's Throne", theme: "boss",
        grid: [
            ".....IIII.....", "....I????I....",
            "...IICCCHI....", "..H.H.TT.H.H..",
            "..5555555555..", "..4444444444..",
            "..3333333333..", "..............",
        ],
        gnomes: [
            { col: 6, row: 1, type: 'king' },
            { col: 3, row: 3, type: 'grumpy' },
            { col: 10, row: 3, type: 'grumpy' },
            { col: 5, row: 4, type: 'speedy' },
            { col: 8, row: 4, type: 'speedy' }
        ]
    },
    {
        name: "Space Invader Nain", theme: "retro",
        grid: [
            "..2........2..", "...2......2...",
            "..2222222222..", ".22.222222.22.",
            "22222222222222", "2.2......2.2..",
            "...22..22.....", "..............",
        ],
        gnomes: [
            { col: 3, row: 3, type: 'speedy' },
            { col: 10, row: 3, type: 'speedy' },
            { col: 6, row: 4, type: 'normal' }
        ]
    },
    {
        name: "Twin Towers", theme: "fortress",
        grid: [
            "CC..........CC", "HH..........HH",
            "CC..55??55..CC", "HH..TTTTTT..HH",
            "CC..........CC", "HH..........HH",
            "CC..........CC", "..............",
        ],
        gnomes: [
            { col: 0, row: 0, type: 'grumpy' },
            { col: 13, row: 0, type: 'grumpy' },
            { col: 4, row: 2, type: 'normal' },
            { col: 9, row: 2, type: 'normal' }
        ]
    },
    {
        name: "Heart of the Garden", theme: "romantic",
        grid: [
            "...77....77...", "..7??7..7??7..",
            ".7????77????7.", ".7??????????7.",
            "..7????????7..", "...7??????7...",
            ".....7??7.....", ".......7......",
        ],
        gnomes: [
            { col: 4, row: 1, type: 'normal' },
            { col: 9, row: 1, type: 'normal' },
            { col: 6, row: 3, type: 'speedy' }
        ]
    },
    {
        name: "The Labyrinth", theme: "puzzle",
        grid: [
            "IIIIIIIIIIIIII", "I1..........1I",
            "I1.IIIIIIII.1I", "I1.I2....2I.1I",
            "I1.I2.TT.2I.1I", "I1.I222222I.1I",
            "I1..........1I", "..............",
        ],
        gnomes: [
            { col: 4, row: 3, type: 'speedy' },
            { col: 9, row: 3, type: 'speedy' },
            { col: 6, row: 4, type: 'grumpy' }
        ]
    },
    {
        name: "Volcano", theme: "fire",
        grid: [
            "......TT......", ".....5TT5.....",
            "....554455....", "...55444455...",
            "..5544334455..", ".554433334455.",
            "55555555555555", "..............",
        ],
        gnomes: [
            { col: 6, row: 0, type: 'grumpy' },
            { col: 4, row: 2, type: 'normal' },
            { col: 9, row: 2, type: 'normal' },
            { col: 2, row: 4, type: 'speedy' },
            { col: 11, row: 4, type: 'speedy' }
        ]
    },
    {
        name: "Honeycomb Hive", theme: "nature",
        grid: [
            "..33..33..33..", ".3??33??33??3.",
            "..33..33..33..", ".3??33??33??3.",
            "..33..33..33..", ".3??33??33??3.",
            "..33..33..33..", "..............",
        ],
        gnomes: [
            { col: 3, row: 1, type: 'speedy' },
            { col: 7, row: 1, type: 'speedy' },
            { col: 11, row: 1, type: 'speedy' },
            { col: 5, row: 3, type: 'normal' },
            { col: 9, row: 3, type: 'normal' }
        ]
    },
    {
        name: "Pinball Alley", theme: "arcade",
        grid: [
            "I..I..II..I..I", ".55.55..55.55.",
            "I..I..II..I..I", ".44.44..44.44.",
            "I..I..II..I..I", ".33.33..33.33.",
            "..............", "..............",
        ],
        gnomes: [
            { col: 2, row: 1, type: 'normal' },
            { col: 6, row: 1, type: 'grumpy' },
            { col: 10, row: 1, type: 'normal' },
            { col: 4, row: 3, type: 'speedy' },
            { col: 8, row: 3, type: 'speedy' }
        ]
    },
    {
        name: "Gnome Galleon", theme: "pirate",
        grid: [
            "......H.......", "....66H66.....",
            "......H.......", "..4444H44444..",
            "..HHHHHHHHHH..", "...CCCCCCCC...",
            "....TTTTTT....", "..............",
        ],
        gnomes: [
            { col: 6, row: 0, type: 'grumpy' },
            { col: 2, row: 3, type: 'normal' },
            { col: 11, row: 3, type: 'normal' },
            { col: 5, row: 4, type: 'speedy' },
            { col: 8, row: 4, type: 'speedy' }
        ]
    },
    {
        name: "The Hourglass", theme: "time",
        grid: [
            "33333333333333", ".333333333333.",
            "..3333333333..", ".....3TT3.....",
            ".....3??3.....", "..3333333333..",
            ".333333333333.", "33333333333333",
        ],
        gnomes: [
            { col: 5, row: 1, type: 'normal' },
            { col: 8, row: 1, type: 'normal' },
            { col: 6, row: 4, type: 'grumpy' }
        ]
    },
    {
        name: "Royal Fortress Siege", theme: "boss",
        grid: [
            "..H.IIIIII.H..", "..H.I????I.H..",
            "..H.ICCCHI.H..", "..HHHHHHHHHH..",
            "...TT5555TT...", "..4444444444..",
            "..3333333333..", "..............",
        ],
        gnomes: [
            { col: 5, row: 1, type: 'king' },
            { col: 8, row: 1, type: 'king' },
            { col: 2, row: 0, type: 'grumpy' },
            { col: 11, row: 0, type: 'grumpy' },
            { col: 6, row: 4, type: 'speedy' }
        ]
    },
    {
        name: "Neon Matrix", theme: "cyber",
        grid: [
            "?1?1?1?1?1?1?1", "1?1?1?1?1?1?1?",
            "?2?2?2?2?2?2?2", "2?2?2?2?2?2?2?",
            "?6?6?6?6?6?6?6", "6?6?6?6?6?6?6?",
            "..............", "..............",
        ],
        gnomes: [
            { col: 2, row: 0, type: 'speedy' },
            { col: 6, row: 0, type: 'speedy' },
            { col: 10, row: 0, type: 'speedy' }
        ]
    },
    {
        name: "The Colosseum", theme: "ancient",
        grid: [
            "...HHHHHHHH...", "..HCCCCCCCC..",
            ".HCC......CCH.", ".HC..TTTT..CH.",
            ".HC..????..CH.", ".HCC......CCH.",
            "..HCCCCCCCC..", "...HHHHHHHH...",
        ],
        gnomes: [
            { col: 4, row: 0, type: 'grumpy' },
            { col: 9, row: 0, type: 'grumpy' },
            { col: 5, row: 3, type: 'speedy' },
            { col: 8, row: 3, type: 'speedy' }
        ]
    },
    {
        name: "Lucky Clover", theme: "nature",
        grid: [
            "..22......22..", ".2??2....2??2.",
            "..22..22..22..", "......22......",
            "..22..22..22..", ".2??2.22.2??2.",
            "..22..22..22..", "......22......",
        ],
        gnomes: [
            { col: 2, row: 1, type: 'speedy' },
            { col: 11, row: 1, type: 'speedy' },
            { col: 2, row: 5, type: 'normal' },
            { col: 11, row: 5, type: 'normal' }
        ]
    },
    {
        name: "Dragon's Teeth", theme: "fantasy",
        grid: [
            "H....H....H...", "HH..HH..HHHH..",
            "5H..5H..5HHH..", "55H55H5555HH..",
            "55555555555H..", "CCCCCCCCCCCC..",
            "TTTTTTTTTTTT..", "..............",
        ],
        gnomes: [
            { col: 0, row: 0, type: 'grumpy' },
            { col: 5, row: 0, type: 'grumpy' },
            { col: 10, row: 0, type: 'grumpy' },
            { col: 3, row: 3, type: 'speedy' },
            { col: 8, row: 3, type: 'speedy' }
        ]
    },
    {
        name: "Rainbow Wave", theme: "art",
        grid: [
            "5...5...5...5.", ".4.4.4.4.4.4.4",
            "..3...3...3...", ".2.2.2.2.2.2.2",
            "1...1...1...1.", ".6.6.6.6.6.6.6",
            "..7...7...7...", "..............",
        ],
        gnomes: [
            { col: 0, row: 0, type: 'speedy' },
            { col: 4, row: 0, type: 'normal' },
            { col: 8, row: 0, type: 'speedy' },
            { col: 12, row: 0, type: 'normal' }
        ]
    },
    {
        name: "Skull & Crossbones", theme: "pirate",
        grid: [
            "....HHHHHH....", "...HCCCCCCCH...",
            "..HC..TT..CH..", "..HC......CH..",
            "...H..55..H...", "....H.55.H....",
            "....HHHHHH....", "..............",
        ],
        gnomes: [
            { col: 4, row: 2, type: 'grumpy' },
            { col: 9, row: 2, type: 'grumpy' },
            { col: 6, row: 4, type: 'king' }
        ]
    },
    {
        name: "Clockwork Gears", theme: "steampunk",
        grid: [
            "..II......II..", ".I??I....I??I.",
            "I????I..I????I", ".I??I....I??I.",
            "..II..TT..II..", ".....TTTT.....",
            "......TT......", "..............",
        ],
        gnomes: [
            { col: 2, row: 1, type: 'speedy' },
            { col: 10, row: 1, type: 'speedy' },
            { col: 6, row: 5, type: 'grumpy' }
        ]
    },
    {
        name: "Phoenix Wings", theme: "fire",
        grid: [
            "5............5", "55...4444...55",
            "545.433334.545", ".435322223534.",
            "..3232??2323..", "...222TT222...",
            ".....2222.....", "..............",
        ],
        gnomes: [
            { col: 0, row: 0, type: 'speedy' },
            { col: 13, row: 0, type: 'speedy' },
            { col: 6, row: 1, type: 'king' }
        ]
    },
    {
        name: "Gauntlet of Nains", theme: "gauntlet",
        grid: [
            "CCCCCCCCCCCCCC", "HHHHHHHHHHHHHH",
            "55555555555555", "44444444444444",
            "33333333333333", "22222222222222",
            "11111111111111", "..............",
        ],
        gnomes: [
            { col: 1, row: 0, type: 'grumpy' },
            { col: 3, row: 0, type: 'speedy' },
            { col: 5, row: 0, type: 'normal' },
            { col: 7, row: 0, type: 'grumpy' },
            { col: 9, row: 0, type: 'normal' },
            { col: 11, row: 0, type: 'speedy' },
            { col: 13, row: 0, type: 'grumpy' }
        ]
    },
    {
        name: "The Ultimate Garden Master", theme: "finale",
        grid: [
            "..II..IIII..II..", "..IICCHHHCCHII..",
            "..IIC????CCHII..", "..HH.TTTTTT.HH..",
            "..555555555555..", "..444444444444..",
            "..333333333333..", "................",
        ],
        gnomes: [
            { col: 6, row: 1, type: 'king' },
            { col: 8, row: 1, type: 'king' },
            { col: 2, row: 0, type: 'grumpy' },
            { col: 12, row: 0, type: 'grumpy' },
            { col: 4, row: 3, type: 'speedy' },
            { col: 10, row: 3, type: 'speedy' }
        ]
    }
];

// Active Game Mode: 'bricks_of_egypt', 'jardinains', or 'mashup'
let activeGame = 'bricks_of_egypt';

function setGameMode(mode) {
    if (mode === 'bricks_of_egypt' || mode === 'jardinains' || mode === 'mashup') {
        activeGame = mode;
    }
}

function getActiveGameLevels() {
    if (activeGame === 'bricks_of_egypt') return BRICKS_OF_EGYPT_LEVELS;
    if (activeGame === 'jardinains') return JARDINAINS_LEVELS;
    // Mashup combines Egypt brick layouts with gnomes!
    return BRICKS_OF_EGYPT_LEVELS.map((lvl, idx) => ({
        ...lvl,
        name: `Mashup: ${lvl.name}`,
        gnomes: [
            { col: 3, row: 2, type: 'mummy' },
            { col: 10, row: 2, type: 'mummy' },
            { col: 6, row: 1, type: (idx % 5 === 4) ? 'pharaoh' : 'anubis' }
        ]
    }));
}

function generateProceduralLevel(levelNum, isEgypt = true) {
    const cols = 14;
    const rows = 8;
    const grid = [];
    const colors = isEgypt 
        ? ['A', 'E', 'S', 'R', 'F', 'L', 'G', 'K'] 
        : ['1', '2', '3', '4', '5', '6', '7', 'C', 'H'];
    
    for (let r = 0; r < rows; r++) {
        let rowStr = "";
        if (r < 6) {
            const half = [];
            for (let c = 0; c < cols / 2; c++) {
                if (Math.random() < 0.25) {
                    half.push('.');
                } else if (Math.random() < 0.1) {
                    half.push(Math.random() < 0.5 ? (isEgypt ? 'U' : 'T') : '?');
                } else if (Math.random() < 0.08 && levelNum > 35) {
                    half.push(isEgypt ? 'O' : 'I');
                } else if (isEgypt && Math.random() < 0.08) {
                    half.push('X'); // Fire brick
                } else {
                    const clr = colors[Math.floor(Math.random() * colors.length)];
                    half.push(clr);
                }
            }
            rowStr = half.join('') + half.slice().reverse().join('');
        } else {
            rowStr = "..............";
        }
        grid.push(rowStr);
    }

    const gnomes = [];
    if (activeGame !== 'bricks_of_egypt') {
        const gnomeCount = Math.min(8, 3 + Math.floor(levelNum / 5));
        const types = isEgypt ? ['mummy', 'anubis', 'pharaoh'] : ['normal', 'grumpy', 'speedy'];
        if (levelNum % 5 === 0) types.push(isEgypt ? 'pharaoh' : 'king');

        for (let i = 0; i < gnomeCount; i++) {
            gnomes.push({
                col: Math.floor(Math.random() * 12) + 1,
                row: Math.floor(Math.random() * 3),
                type: types[Math.floor(Math.random() * types.length)]
            });
        }
    }

    return {
        name: isEgypt ? `Endless Tomb #${levelNum}` : `Endless Garden #${levelNum}`,
        theme: isEgypt ? "egypt" : "endless",
        isEgypt: isEgypt,
        grid: grid,
        gnomes: gnomes
    };
}

function getLevelData(levelIndex, gameOverride = null) {
    const game = gameOverride || activeGame;
    let list = BRICKS_OF_EGYPT_LEVELS;
    if (game === 'jardinains') list = JARDINAINS_LEVELS;
    else if (game === 'mashup') list = getActiveGameLevels();

    if (levelIndex < list.length) {
        return list[levelIndex];
    }
    return generateProceduralLevel(levelIndex + 1, game !== 'jardinains');
}

window.BRICKS_OF_EGYPT_LEVELS = BRICKS_OF_EGYPT_LEVELS;
window.JARDINAINS_LEVELS = JARDINAINS_LEVELS;
window.COLOR_MAP = COLOR_MAP;
window.GLYPH_MAP = GLYPH_MAP;
window.setGameMode = setGameMode;
window.getActiveGameLevels = getActiveGameLevels;
window.getLevelData = getLevelData;
