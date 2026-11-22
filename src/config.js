/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Game Configuration, Constants, Worlds & Catalogs
 */

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const WORLDS = [
    {
        id: 'lost_egypt',
        index: 0,
        name: 'Lost Egypt',
        subtitle: 'Chronos Pyramids & Solar Gates',
        themeColor: '#f59e0b',
        secondaryColor: '#b45309',
        accentColor: '#38bdf8',
        bgColor: '#160d03',
        bossName: 'Chrono Sphinx',
        bossDesc: 'Guardian of Temporal Tombs with solar flare cannons and homing scarab drones.',
        ambientEffect: 'ember',
        musicTrack: 'egypt'
    },
    {
        id: 'mystic_forest',
        index: 1,
        name: 'Mystic Forest',
        subtitle: 'Bioluminescent Groves & Ancient Runes',
        themeColor: '#10b981',
        secondaryColor: '#047857',
        accentColor: '#a7f3d0',
        bgColor: '#021a12',
        bossName: 'Sylvan Goliath',
        bossDesc: 'Ancient rune-tree titan hurling thorn clusters and growing root shields.',
        ambientEffect: 'spore',
        musicTrack: 'forest'
    },
    {
        id: 'frozen_kingdom',
        index: 2,
        name: 'Frozen Kingdom',
        subtitle: 'Glacial Spires & Sub-Zero Rifts',
        themeColor: '#06b6d4',
        secondaryColor: '#0284c7',
        accentColor: '#e0f2fe',
        bgColor: '#031726',
        bossName: 'Cryo Wyrm',
        bossDesc: 'Glacial serpent that darts across the sky, spitting frost orbs that ice the paddle.',
        ambientEffect: 'snow',
        musicTrack: 'frozen'
    },
    {
        id: 'machine_city',
        index: 3,
        name: 'Machine City',
        subtitle: 'Cyber Conduits & Overclocked Dynamos',
        themeColor: '#f97316',
        secondaryColor: '#ea580c',
        accentColor: '#22d3ee',
        bgColor: '#0f172a',
        bossName: 'Overclock Core',
        bossDesc: 'Cybernetic dreadnought with revolving energy shields and laser sweep beams.',
        ambientEffect: 'spark',
        musicTrack: 'machine'
    },
    {
        id: 'cosmic_void',
        index: 4,
        name: 'Cosmic Void',
        subtitle: 'Singularities & Nebular Starfields',
        themeColor: '#a855f7',
        secondaryColor: '#7c3aed',
        accentColor: '#f472b6',
        bgColor: '#0b0416',
        bossName: 'Astral Devourer',
        bossDesc: 'Void anomaly distorting gravity wells, sucking balls and firing antimatter pulses.',
        ambientEffect: 'star',
        musicTrack: 'void'
    },
    {
        id: 'final_dimension',
        index: 5,
        name: 'Final Dimension',
        subtitle: 'The Temporal Nexus & Reality Fractures',
        themeColor: '#ec4899',
        secondaryColor: '#9333ea',
        accentColor: '#fbbf24',
        bgColor: '#080111',
        bossName: 'The Chrono Architect',
        bossDesc: 'Master of Time and Space: teleports, rewinds time, and triggers dimensional collapses.',
        ambientEffect: 'rift',
        musicTrack: 'final'
    }
];

export const BRICK_TYPES = {
    NORMAL: 'normal',
    STONE: 'stone',
    IRON: 'iron',
    EXPLOSIVE: 'explosive',
    MOVING: 'moving',
    INVISIBLE: 'invisible',
    REGENERATING: 'regenerating',
    POWER: 'power',
    PORTAL: 'portal',
    CRYSTAL: 'crystal'
};

export const POWERUP_TYPES = {
    MULTIBALL: {
        id: 'multiball',
        name: 'Multi-Ball',
        symbol: '⚡3',
        color: '#38bdf8',
        duration: 0, // instant effect
        weight: 15
    },
    FIREBALL: {
        id: 'fireball',
        name: 'Fireball',
        symbol: '🔥',
        color: '#ef4444',
        duration: 12,
        weight: 12
    },
    WIDE_PADDLE: {
        id: 'wide_paddle',
        name: 'Wide Paddle',
        symbol: '⬌',
        color: '#10b981',
        duration: 15,
        weight: 15
    },
    MAGNET: {
        id: 'magnet',
        name: 'Magnet Catch',
        symbol: '🧲',
        color: '#eab308',
        duration: 14,
        weight: 12
    },
    LASER_PADDLE: {
        id: 'laser_paddle',
        name: 'Laser Cannons',
        symbol: '⚡',
        color: '#f97316',
        duration: 12,
        weight: 13
    },
    SLOW_MOTION: {
        id: 'slow_motion',
        name: 'Slow Motion',
        symbol: '⏳',
        color: '#8b5cf6',
        duration: 10,
        weight: 10
    },
    EXTRA_LIFE: {
        id: 'extra_life',
        name: 'Extra Life',
        symbol: '💖',
        color: '#ec4899',
        duration: 0, // instant
        weight: 7
    },
    PROTECTIVE_BARRIER: {
        id: 'protective_barrier',
        name: 'Energy Barrier',
        symbol: '🛡️',
        color: '#06b6d4',
        duration: 0, // consumable charges
        weight: 10
    },
    TIME_FREEZE: {
        id: 'time_freeze',
        name: 'Time Freeze',
        symbol: '❄️',
        color: '#67e8f9',
        duration: 6,
        weight: 6
    }
};

export const UPGRADES = [
    {
        id: 'paddle_width',
        name: 'Quantum Expander',
        desc: 'Permanently increases base paddle width by +10px per rank.',
        icon: '⬌',
        maxLevel: 5,
        costs: [50, 100, 200, 350, 500]
    },
    {
        id: 'laser_duration',
        name: 'Plasma Capacitors',
        desc: 'Extends laser cannon duration by +20% and increases fire rate.',
        icon: '⚡',
        maxLevel: 5,
        costs: [60, 120, 240, 400, 600]
    },
    {
        id: 'barrier_starter',
        name: 'Dimensional Shield',
        desc: 'Begin every level with free energy barrier charges (Rank 1: 1 charge, Rank 2: 2 charges).',
        icon: '🛡️',
        maxLevel: 2,
        costs: [150, 400]
    },
    {
        id: 'crystal_magnet',
        name: 'Shard Attractor',
        desc: 'Pulls falling Chrono Crystals toward your paddle magnetically.',
        icon: '🧲',
        maxLevel: 4,
        costs: [80, 160, 300, 500]
    },
    {
        id: 'chrono_dilator',
        name: 'Temporal Dilator',
        desc: 'Increases Slow Motion and Time Freeze durations by +25% per rank.',
        icon: '⏳',
        maxLevel: 4,
        costs: [75, 150, 280, 450]
    }
];

export const ACHIEVEMENTS = [
    { id: 'first_fracture', title: 'First Fracture', desc: 'Destroy your first temporal brick.', icon: '💥' },
    { id: 'dimension_hopper', title: 'Dimension Hopper', desc: 'Complete World 1 (Lost Egypt).', icon: '🏺' },
    { id: 'forest_cleanser', title: 'Nature Guardian', desc: 'Defeat the Sylvan Goliath in World 2.', icon: '🌿' },
    { id: 'glacier_breaker', title: 'Absolute Zero', desc: 'Defeat the Cryo Wyrm in World 3.', icon: '❄️' },
    { id: 'machine_overclocker', title: 'System Override', desc: 'Defeat Overclock Core in World 4.', icon: '⚙️' },
    { id: 'void_walker', title: 'Into the Abyss', desc: 'Defeat Astral Devourer in World 5.', icon: '🌌' },
    { id: 'chrono_master', title: 'Chrono Master', desc: 'Defeat The Chrono Architect and restore time!', icon: '👑' },
    { id: 'crystal_collector', title: 'Crystal Miner', desc: 'Collect 50 Chrono Crystals.', icon: '💎' },
    { id: 'crystal_tycoon', title: 'Temporal Tycoon', desc: 'Accumulate 300 Chrono Crystals.', icon: '💰' },
    { id: 'laser_frenzy', title: 'Plasma Storm', desc: 'Destroy 25 bricks with laser cannons.', icon: '🔫' },
    { id: 'combo_king', title: 'Combo King', desc: 'Achieve a 15x hit combo without dropping the ball.', icon: '🔥' },
    { id: 'power_overwhelming', title: 'Power Overwhelming', desc: 'Have 3 different power-ups active simultaneously.', icon: '✨' }
];

export const PHYSICS = {
    PADDLE_BASE_WIDTH: 100,
    PADDLE_HEIGHT: 16,
    PADDLE_BASE_SPEED: 700,
    BALL_RADIUS: 6,
    BALL_BASE_SPEED: 390,
    BALL_MIN_SPEED: 330,
    BALL_MAX_SPEED: 660,
    LASER_SPEED: 650,
    LASER_WIDTH: 4,
    LASER_HEIGHT: 15,
    POWERUP_FALL_SPEED: 145,
    CRYSTAL_FALL_SPEED: 125,
    SUB_STEPS: 4,
    MAX_DELTA: 0.05 // 50ms cap to prevent jump tunneling on lag
};
