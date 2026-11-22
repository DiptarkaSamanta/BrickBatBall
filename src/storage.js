/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * LocalStorage Save System & State Persistence
 */

const STORAGE_KEY = 'chrono_breaker_save_v1';

const DEFAULT_STATE = {
    unlockedWorld: 0,      // 0 to 5
    unlockedLevel: 1,      // 1 to 10 in current world
    highestLevelBeaten: 0, // 0 to 60
    levelStars: {},        // { '0-1': 3, '0-2': 2 }
    levelScores: {},       // { '0-1': 14500 }
    highScore: 0,
    crystals: 0,           // spendable currency
    totalCrystalsEarned: 0,
    upgrades: {
        paddle_width: 0,
        laser_duration: 0,
        barrier_starter: 0,
        crystal_magnet: 0,
        chrono_dilator: 0
    },
    achievements: [],
    settings: {
        masterVolume: 0.8,
        musicVolume: 0.6,
        sfxVolume: 0.8,
        screenShake: true,
        highContrast: false
    },
    stats: {
        bricksDestroyed: 0,
        bossesDefeated: 0,
        lasersFired: 0,
        maxCombo: 0,
        gamesPlayed: 0
    },
    tutorialCompleted: false
};

class StorageManager {
    constructor() {
        this.data = this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
            const parsed = JSON.parse(raw);
            // Merge with default state in case new fields were added
            return {
                ...DEFAULT_STATE,
                ...parsed,
                upgrades: { ...DEFAULT_STATE.upgrades, ...(parsed.upgrades || {}) },
                settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
                stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
                achievements: Array.isArray(parsed.achievements) ? parsed.achievements : []
            };
        } catch (e) {
            console.warn('[ChronoBreaker] Failed to read save data, initializing default state.', e);
            return JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            return true;
        } catch (e) {
            console.error('[ChronoBreaker] Failed to save state to localStorage', e);
            return false;
        }
    }

    resetAll() {
        this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
        this.save();
        return this.data;
    }

    // Progression
    isLevelUnlocked(worldIdx, levelNum) {
        if (worldIdx < this.data.unlockedWorld) return true;
        if (worldIdx === this.data.unlockedWorld) return levelNum <= this.data.unlockedLevel;
        return false;
    }

    recordLevelCompletion(worldIdx, levelNum, score, stars = 3) {
        const key = `${worldIdx}-${levelNum}`;
        const prevStars = this.data.levelStars[key] || 0;
        if (stars > prevStars) {
            this.data.levelStars[key] = stars;
        }

        const prevScore = this.data.levelScores[key] || 0;
        if (score > prevScore) {
            this.data.levelScores[key] = score;
        }

        if (score > this.data.highScore) {
            this.data.highScore = score;
        }

        const globalNum = worldIdx * 10 + levelNum;
        if (globalNum > this.data.highestLevelBeaten) {
            this.data.highestLevelBeaten = globalNum;
        }

        // Unlock next level / world
        if (levelNum < 10) {
            if (worldIdx === this.data.unlockedWorld && levelNum >= this.data.unlockedLevel) {
                this.data.unlockedLevel = levelNum + 1;
            }
        } else {
            // Boss completed, unlock next world!
            if (worldIdx === this.data.unlockedWorld && worldIdx < 5) {
                this.data.unlockedWorld = worldIdx + 1;
                this.data.unlockedLevel = 1;
            }
        }

        this.save();
    }

    // Crystals & Currency
    addCrystals(amount) {
        if (amount <= 0) return;
        this.data.crystals += amount;
        this.data.totalCrystalsEarned += amount;
        this.save();
    }

    spendCrystals(amount) {
        if (this.data.crystals >= amount) {
            this.data.crystals -= amount;
            this.save();
            return true;
        }
        return false;
    }

    // Upgrades
    getUpgradeLevel(upgradeId) {
        return this.data.upgrades[upgradeId] || 0;
    }

    buyUpgrade(upgradeId, cost) {
        if (this.spendCrystals(cost)) {
            this.data.upgrades[upgradeId] = (this.data.upgrades[upgradeId] || 0) + 1;
            this.save();
            return true;
        }
        return false;
    }

    // Achievements
    unlockAchievement(id) {
        if (!this.data.achievements.includes(id)) {
            this.data.achievements.push(id);
            this.save();
            return true; // newly unlocked
        }
        return false;
    }

    hasAchievement(id) {
        return this.data.achievements.includes(id);
    }

    // Settings
    getSettings() {
        return this.data.settings;
    }

    setSettings(newSettings) {
        this.data.settings = { ...this.data.settings, ...newSettings };
        this.save();
    }
}

export const storage = new StorageManager();
