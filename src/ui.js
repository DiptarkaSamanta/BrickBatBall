/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * UI Controller: HUD, Menus, Modals, Shop, Achievements & Settings
 */

import { WORLDS, UPGRADES, ACHIEVEMENTS } from './config.js';
import { storage } from './storage.js';

export class UIManager {
    constructor(engine) {
        this.engine = engine;

        // Elements cache
        this.elMainMenu = document.getElementById('chrono-main-menu');
        this.elHud = document.getElementById('chrono-hud');
        this.elModalOverlay = document.getElementById('chrono-modal-overlay');

        this.elScore = document.getElementById('chrono-score');
        this.elHighScore = document.getElementById('chrono-highscore');
        this.elLevel = document.getElementById('chrono-level-info');
        this.elLives = document.getElementById('chrono-lives');
        this.elCrystals = document.getElementById('chrono-crystals');
        this.elPowerups = document.getElementById('chrono-active-powerups');
        this.elCombo = document.getElementById('chrono-combo');

        // Modal windows
        this.modalLevelSelect = document.getElementById('modal-level-select');
        this.modalUpgrades = document.getElementById('modal-upgrades');
        this.modalAchievements = document.getElementById('modal-achievements');
        this.modalSettings = document.getElementById('modal-settings');
        this.modalHelp = document.getElementById('modal-help');
        this.modalPause = document.getElementById('modal-pause');
        this.modalWin = document.getElementById('modal-win');
        this.modalGameOver = document.getElementById('modal-gameover');
        this.modalBossWin = document.getElementById('modal-bosswin');

        this.activeModal = null;
        this.selectedWorldTab = 0;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Main Menu buttons
        const btnPlay = document.getElementById('btn-chrono-play');
        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                this.engine.startCampaign();
            });
        }

        const btnLevelSelect = document.getElementById('btn-chrono-levels');
        if (btnLevelSelect) {
            btnLevelSelect.addEventListener('click', () => {
                this.openLevelSelect();
            });
        }

        const btnUpgrades = document.getElementById('btn-chrono-upgrades');
        if (btnUpgrades) {
            btnUpgrades.addEventListener('click', () => {
                this.openUpgrades();
            });
        }

        const btnAchievements = document.getElementById('btn-chrono-achievements');
        if (btnAchievements) {
            btnAchievements.addEventListener('click', () => {
                this.openAchievements();
            });
        }

        const btnSettings = document.getElementById('btn-chrono-settings');
        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                this.openSettings();
            });
        }

        const btnHelp = document.getElementById('btn-chrono-help');
        if (btnHelp) {
            btnHelp.addEventListener('click', () => {
                this.openHelp();
            });
        }

        // Close modal buttons
        document.querySelectorAll('.chrono-modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Settings sliders
        const sliderMaster = document.getElementById('setting-master-vol');
        if (sliderMaster) {
            sliderMaster.value = (storage.getSettings().masterVolume ?? 0.8) * 100;
            sliderMaster.addEventListener('input', (e) => {
                this.engine.audio.setMasterVolume(e.target.value / 100);
            });
        }

        const sliderMusic = document.getElementById('setting-music-vol');
        if (sliderMusic) {
            sliderMusic.value = (storage.getSettings().musicVolume ?? 0.6) * 100;
            sliderMusic.addEventListener('input', (e) => {
                this.engine.audio.setMusicVolume(e.target.value / 100);
            });
        }

        const sliderSfx = document.getElementById('setting-sfx-vol');
        if (sliderSfx) {
            sliderSfx.value = (storage.getSettings().sfxVolume ?? 0.8) * 100;
            sliderSfx.addEventListener('input', (e) => {
                this.engine.audio.setSfxVolume(e.target.value / 100);
            });
        }

        const toggleShake = document.getElementById('setting-shake-toggle');
        if (toggleShake) {
            toggleShake.checked = storage.getSettings().screenShake;
            toggleShake.addEventListener('change', (e) => {
                storage.setSettings({ screenShake: e.target.checked });
            });
        }

        const btnResetSave = document.getElementById('btn-reset-save');
        if (btnResetSave) {
            btnResetSave.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all Chrono Breaker progress and upgrades?')) {
                    storage.resetAll();
                    alert('Progress reset.');
                    this.closeModal();
                    this.updateMenuHUD();
                }
            });
        }
    }

    showMainMenu() {
        if (this.elMainMenu) this.elMainMenu.style.display = 'flex';
        if (this.elHud) this.elHud.style.display = 'none';
        this.closeModal();
        this.updateMenuHUD();
    }

    hideMainMenu() {
        if (this.elMainMenu) this.elMainMenu.style.display = 'none';
        if (this.elHud) this.elHud.style.display = 'flex';
    }

    openModal(modalEl) {
        if (!modalEl || !this.elModalOverlay) return;
        this.closeModal();
        this.activeModal = modalEl;
        this.elModalOverlay.style.display = 'flex';
        modalEl.style.display = 'block';
    }

    closeModal() {
        if (this.activeModal) {
            this.activeModal.style.display = 'none';
            this.activeModal = null;
        }
        if (this.elModalOverlay) {
            this.elModalOverlay.style.display = 'none';
        }
    }

    updateMenuHUD() {
        const crystalDisplays = document.querySelectorAll('.menu-crystal-count');
        crystalDisplays.forEach(el => {
            el.innerText = storage.data.crystals;
        });

        const highScores = document.querySelectorAll('.menu-highscore-count');
        highScores.forEach(el => {
            el.innerText = storage.data.highScore.toLocaleString();
        });
    }

    // ==========================================
    // LEVEL SELECT MODAL
    // ==========================================

    openLevelSelect() {
        this.renderLevelSelectWorldTabs();
        this.renderLevelSelectGrid();
        this.openModal(this.modalLevelSelect);
    }

    renderLevelSelectWorldTabs() {
        const container = document.getElementById('level-select-tabs');
        if (!container) return;
        container.innerHTML = '';

        WORLDS.forEach((world, idx) => {
            const btn = document.createElement('button');
            btn.className = `chrono-tab-btn ${idx === this.selectedWorldTab ? 'active' : ''}`;
            const isUnlocked = idx <= storage.data.unlockedWorld;
            btn.innerHTML = `${isUnlocked ? '' : '🔒 '}${world.name}`;
            btn.disabled = !isUnlocked;
            btn.onclick = () => {
                this.selectedWorldTab = idx;
                this.renderLevelSelectWorldTabs();
                this.renderLevelSelectGrid();
            };
            container.appendChild(btn);
        });
    }

    renderLevelSelectGrid() {
        const grid = document.getElementById('level-select-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const worldIdx = this.selectedWorldTab;
        const world = WORLDS[worldIdx];

        for (let lvl = 1; lvl <= 10; lvl++) {
            const isUnlocked = storage.isLevelUnlocked(worldIdx, lvl);
            const key = `${worldIdx}-${lvl}`;
            const stars = storage.data.levelStars[key] || 0;
            const score = storage.data.levelScores[key] || 0;

            const card = document.createElement('div');
            card.className = `chrono-level-card ${isUnlocked ? 'unlocked' : 'locked'} ${lvl === 10 ? 'boss-card' : ''}`;

            if (isUnlocked) {
                card.innerHTML = `
                    <div class="level-card-header">
                        <span class="level-num">LEVEL ${lvl}</span>
                        ${lvl === 10 ? '<span class="boss-badge">💀 BOSS</span>' : ''}
                    </div>
                    <div class="level-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
                    <div class="level-score">${score > 0 ? score.toLocaleString() + ' pts' : 'Unplayed'}</div>
                `;
                card.onclick = () => {
                    this.closeModal();
                    this.engine.startLevel(worldIdx, lvl);
                };
            } else {
                card.innerHTML = `
                    <div class="level-card-header"><span class="level-num">LEVEL ${lvl}</span></div>
                    <div class="locked-icon">🔒</div>
                    <div class="level-score">Locked</div>
                `;
            }

            grid.appendChild(card);
        }
    }

    // ==========================================
    // UPGRADES SHOP MODAL
    // ==========================================

    openUpgrades() {
        this.renderUpgrades();
        this.openModal(this.modalUpgrades);
    }

    renderUpgrades() {
        const container = document.getElementById('upgrades-container');
        const crystalCounter = document.getElementById('shop-crystal-count');
        if (crystalCounter) crystalCounter.innerText = storage.data.crystals;
        if (!container) return;
        container.innerHTML = '';

        UPGRADES.forEach(upg => {
            const currentLvl = storage.getUpgradeLevel(upg.id);
            const isMax = currentLvl >= upg.maxLevel;
            const nextCost = isMax ? 0 : upg.costs[currentLvl];
            const canAfford = !isMax && storage.data.crystals >= nextCost;

            const row = document.createElement('div');
            row.className = 'chrono-upgrade-row';
            row.innerHTML = `
                <div class="upg-icon">${upg.icon}</div>
                <div class="upg-info">
                    <div class="upg-title">${upg.name} <span class="upg-lvl">Rank ${currentLvl}/${upg.maxLevel}</span></div>
                    <div class="upg-desc">${upg.desc}</div>
                </div>
                <div class="upg-action">
                    <button class="chrono-btn ${canAfford ? 'primary' : 'disabled'}" ${!canAfford || isMax ? 'disabled' : ''}>
                        ${isMax ? 'MAXED' : `Upgrade: ${nextCost} 💎`}
                    </button>
                </div>
            `;

            const btn = row.querySelector('button');
            if (btn && canAfford && !isMax) {
                btn.onclick = () => {
                    if (storage.buyUpgrade(upg.id, nextCost)) {
                        this.engine.audio.playPowerupCollect();
                        this.renderUpgrades();
                        this.updateMenuHUD();
                        this.engine.paddle.refreshUpgradeBonuses();
                    }
                };
            }

            container.appendChild(row);
        });
    }

    // ==========================================
    // ACHIEVEMENTS MODAL
    // ==========================================

    openAchievements() {
        this.renderAchievements();
        this.openModal(this.modalAchievements);
    }

    renderAchievements() {
        const container = document.getElementById('achievements-container');
        if (!container) return;
        container.innerHTML = '';

        ACHIEVEMENTS.forEach(ach => {
            const isUnlocked = storage.hasAchievement(ach.id);
            const card = document.createElement('div');
            card.className = `chrono-ach-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="ach-icon">${isUnlocked ? ach.icon : '🔒'}</div>
                <div class="ach-info">
                    <div class="ach-title">${ach.title}</div>
                    <div class="ach-desc">${ach.desc}</div>
                </div>
                <div class="ach-status">${isUnlocked ? '✅ UNLOCKED' : 'LOCKED'}</div>
            `;
            container.appendChild(card);
        });
    }

    // ==========================================
    // SETTINGS & HELP
    // ==========================================

    openSettings() {
        this.openModal(this.modalSettings);
    }

    openHelp() {
        this.openModal(this.modalHelp);
    }

    // ==========================================
    // GAME OVERLAYS
    // ==========================================

    showPause() {
        this.openModal(this.modalPause);
    }

    showLevelWin(worldIdx, levelNum, score, stars, crystalsEarned) {
        const titleEl = document.getElementById('win-modal-title');
        const scoreEl = document.getElementById('win-modal-score');
        const starsEl = document.getElementById('win-modal-stars');
        const crystalsEl = document.getElementById('win-modal-crystals');

        if (titleEl) titleEl.innerText = `${WORLDS[worldIdx].name} - Level ${levelNum} Cleared!`;
        if (scoreEl) scoreEl.innerText = score.toLocaleString();
        if (starsEl) starsEl.innerText = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
        if (crystalsEl) crystalsEl.innerText = `+${crystalsEarned} 💎`;

        const btnNext = document.getElementById('btn-win-next');
        if (btnNext) {
            btnNext.onclick = () => {
                this.closeModal();
                if (levelNum < 10) {
                    this.engine.startLevel(worldIdx, levelNum + 1);
                } else {
                    if (worldIdx < 5) {
                        this.engine.startLevel(worldIdx + 1, 1);
                    } else {
                        // Beat the game!
                        this.showMainMenu();
                    }
                }
            };
        }

        this.openModal(this.modalWin);
    }

    showBossWin(worldIdx) {
        const bossName = WORLDS[worldIdx].bossName;
        const titleEl = document.getElementById('bosswin-title');
        const descEl = document.getElementById('bosswin-desc');

        if (titleEl) titleEl.innerText = `${bossName.toUpperCase()} DEFEATED!`;
        if (descEl) descEl.innerText = `The dimensional rift has been cleansed and the timeline is restored!`;

        const btnNext = document.getElementById('btn-bosswin-next');
        if (btnNext) {
            btnNext.onclick = () => {
                this.closeModal();
                if (worldIdx < 5) {
                    this.engine.startLevel(worldIdx + 1, 1);
                } else {
                    alert('CONGRATULATIONS! You have restored all dimensions and completed CHRONO BREAKER!');
                    this.showMainMenu();
                }
            };
        }

        this.openModal(this.modalBossWin);
    }

    showGameOver(score, highScore) {
        const scoreEl = document.getElementById('gameover-score');
        const highEl = document.getElementById('gameover-highscore');

        if (scoreEl) scoreEl.innerText = score.toLocaleString();
        if (highEl) highEl.innerText = highScore.toLocaleString();

        const btnRetry = document.getElementById('btn-gameover-retry');
        if (btnRetry) {
            btnRetry.onclick = () => {
                this.closeModal();
                this.engine.restartCurrentLevel();
            };
        }

        this.openModal(this.modalGameOver);
    }

    // ==========================================
    // IN-GAME HUD UPDATE
    // ==========================================

    updateHUD(gameState) {
        if (this.elScore) this.elScore.innerText = gameState.score.toLocaleString();
        if (this.elHighScore) this.elHighScore.innerText = gameState.highScore.toLocaleString();
        if (this.elLevel) this.elLevel.innerText = `${gameState.worldName} ${gameState.levelNum}`;
        if (this.elLives) this.elLives.innerText = '❤️'.repeat(Math.max(0, gameState.lives));
        if (this.elCrystals) this.elCrystals.innerText = `${gameState.crystals} 💎`;

        // Update Combo counter
        if (this.elCombo) {
            if (gameState.combo > 1) {
                this.elCombo.style.display = 'block';
                this.elCombo.innerText = `x${gameState.combo} COMBO!`;
            } else {
                this.elCombo.style.display = 'none';
            }
        }

        // Update active powerups
        if (this.elPowerups) {
            this.elPowerups.innerHTML = '';
            for (const key in gameState.activeEffects) {
                const timeRemaining = Math.ceil(gameState.activeEffects[key]);
                const badge = document.createElement('span');
                badge.className = 'chrono-powerup-badge';
                badge.innerText = `${key.replace('_', ' ').toUpperCase()} (${timeRemaining}s)`;
                this.elPowerups.appendChild(badge);
            }
        }
    }

    showToast(message, icon = '🏆') {
        const toast = document.createElement('div');
        toast.className = 'chrono-toast';
        toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-text">${message}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }
}
