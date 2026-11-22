/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Core Game Engine: Game Loop, State Machine, Continuous Collision & Input
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, PHYSICS, BRICK_TYPES, WORLDS } from './config.js';
import { storage } from './storage.js';
import { audio } from './audio.js';
import { BackgroundRenderer } from './backgrounds.js';
import { ParticleManager } from './particles.js';
import { Physics } from './physics.js';
import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { PowerupManager } from './powerups.js';
import { Boss } from './bosses.js';
import { levelCatalog } from './levels.js';
import { UIManager } from './ui.js';

export const GAME_STATES = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    LEVEL_WIN: 'LEVEL_WIN',
    BOSS_WIN: 'BOSS_WIN',
    GAME_OVER: 'GAME_OVER'
};

export class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // State Machine
        this.state = GAME_STATES.MENU;

        // Subsystems
        this.storage = storage;
        this.audio = audio;
        this.backgrounds = new BackgroundRenderer();
        this.particles = new ParticleManager();
        this.powerups = new PowerupManager();
        this.paddle = new Paddle();
        this.balls = [];
        this.bricks = [];
        this.boss = null;
        this.levelCatalog = levelCatalog;
        this.ui = new UIManager(this);

        // Gameplay Metrics
        this.currentWorldIdx = 0;
        this.currentLevelNum = 1;
        this.currentLevelData = null;
        this.score = 0;
        this.lives = 3;
        this.combo = 0;
        this.comboTimer = 0;
        this.levelStartTime = 0;
        this.levelCrystalsEarned = 0;

        // Loop timing
        this.lastTime = 0;
        this.animationFrameId = null;

        // High-DPI Scaling & Input
        this.setupCanvasScaling();
        this.setupInputs();

        // Listen for extra life event from powerup
        window.addEventListener('chrono_extra_life', () => {
            this.lives++;
            this.particles.createFloatingText('+1 LIFE! ❤️', this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#ec4899', 18);
        });

        // Initialize Audio context on first user click
        window.addEventListener('pointerdown', () => this.audio.resume(), { once: true });
        window.addEventListener('keydown', () => this.audio.resume(), { once: true });
    }

    setupCanvasScaling() {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
    }

    handleResize() {
        const wrapper = this.canvas.parentElement;
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const scaleX = rect.width / CANVAS_WIDTH;
        const scaleY = rect.height / CANVAS_HEIGHT;
        this.displayScale = Math.min(scaleX, scaleY);
    }

    setupInputs() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (this.state === GAME_STATES.PLAYING) {
                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                    this.paddle.moveLeft = true;
                    this.paddle.useMouse = false;
                } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                    this.paddle.moveRight = true;
                    this.paddle.useMouse = false;
                } else if (e.key === ' ' || e.key === 'Spacebar') {
                    this.launchBallsOrFireLasers();
                } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
                    this.togglePause();
                } else if (e.key === 'r' || e.key === 'R') {
                    this.restartCurrentLevel();
                }
            } else if (this.state === GAME_STATES.PAUSED) {
                if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
                    this.togglePause();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.paddle.moveLeft = false;
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.paddle.moveRight = false;
            }
        });

        // Mouse controls
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.state !== GAME_STATES.PLAYING) return;
            const rect = this.canvas.getBoundingClientRect();
            const canvasX = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
            this.paddle.targetX = canvasX;
            this.paddle.useMouse = true;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (this.state !== GAME_STATES.PLAYING) return;
            if (e.button === 0) { // Left click
                this.launchBallsOrFireLasers();
            }
        });

        // Touch controls
        this.canvas.addEventListener('touchmove', (e) => {
            if (this.state !== GAME_STATES.PLAYING) return;
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const canvasX = (touch.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
            this.paddle.targetX = canvasX;
            this.paddle.useMouse = true;
        }, { passive: false });

        this.canvas.addEventListener('touchstart', (e) => {
            if (this.state !== GAME_STATES.PLAYING) return;
            this.launchBallsOrFireLasers();
        }, { passive: false });
    }

    launchBallsOrFireLasers() {
        let launched = false;
        this.balls.forEach(b => {
            if (b.isStuck) {
                b.launch();
                launched = true;
            }
        });

        if (!launched && this.paddle.isLaser) {
            this.paddle.fireLasers(this.audio);
        }
    }

    startCampaign() {
        const world = this.storage.data.unlockedWorld;
        const level = this.storage.data.unlockedLevel;
        this.startLevel(world, level);
    }

    startLevel(worldIdx, levelNum) {
        this.currentWorldIdx = worldIdx;
        this.currentLevelNum = levelNum;
        this.currentLevelData = this.levelCatalog.getLevel(worldIdx, levelNum);

        // Reset level state
        this.backgrounds.setWorld(worldIdx);
        this.powerups.reset();
        this.particles = new ParticleManager();
        this.paddle.refreshUpgradeBonuses();
        this.paddle.clampBounds();

        // Spawn Initial Ball stuck to paddle
        this.balls = [new Ball(this.paddle.x + this.paddle.width / 2, this.paddle.y - PHYSICS.BALL_RADIUS - 1)];

        // Spawn Bricks
        this.bricks = this.levelCatalog.instantiateBricks(this.currentLevelData);

        // Spawn Boss if Level 10
        if (this.currentLevelData.isBossLevel) {
            this.boss = new Boss(worldIdx);
            this.audio.playMusic('boss');
        } else {
            this.boss = null;
            this.audio.playMusic(WORLDS[worldIdx].musicTrack);
        }

        this.combo = 0;
        this.comboTimer = 0;
        this.levelStartTime = performance.now();
        this.levelCrystalsEarned = 0;

        this.state = GAME_STATES.PLAYING;
        this.ui.hideMainMenu();
        this.ui.closeModal();

        this.updateHUD();
    }

    restartCurrentLevel() {
        this.startLevel(this.currentWorldIdx, this.currentLevelNum);
    }

    togglePause() {
        if (this.state === GAME_STATES.PLAYING) {
            this.state = GAME_STATES.PAUSED;
            this.ui.showPause();
        } else if (this.state === GAME_STATES.PAUSED) {
            this.state = GAME_STATES.PLAYING;
            this.ui.closeModal();
            this.lastTime = performance.now();
        }
    }

    // ==========================================
    // MAIN GAME LOOP & PHYSICS
    // ==========================================

    start() {
        this.lastTime = performance.now();
        const loop = (currentTime) => {
            const dt = Math.min((currentTime - this.lastTime) / 1000, PHYSICS.MAX_DELTA);
            this.lastTime = currentTime;

            this.update(dt);
            this.render();

            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }

    update(dt) {
        if (this.state !== GAME_STATES.PLAYING) return;

        // Apply Slow Motion multiplier if active
        const effectiveDt = this.powerups.slowMotionActive ? dt * 0.5 : dt;

        // Update Combo timer
        if (this.combo > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.combo = 0;
            }
        }

        // 1. Update Backgrounds & Particles
        this.backgrounds.update(effectiveDt);
        this.particles.update(dt);

        // 2. Update Paddle
        this.paddle.update(dt, this.audio);

        // 3. Update Balls
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            ball.update(effectiveDt, this.paddle);

            // Ball vs Paddle Collision
            if (!ball.isStuck) {
                const paddleCol = Physics.resolvePaddleCollision(ball, this.paddle);
                if (paddleCol) {
                    this.combo = 0; // reset brick combo on paddle return
                    this.audio.playPaddleHit(paddleCol.offset);
                    this.particles.createSparks(ball.x, ball.y, '#38bdf8', 6);

                    // Magnet catch
                    if (this.paddle.isMagnet) {
                        ball.isStuck = true;
                        ball.stuckOffset = ball.x - (this.paddle.x + this.paddle.width / 2);
                    }
                }
            }

            // Ball out of bounds (Bottom of screen)
            if (ball.isOutOfBounds()) {
                // Check if protected by Bottom Energy Barrier
                if (this.paddle.consumeBarrierCharge()) {
                    ball.y = CANVAS_HEIGHT - ball.radius - 8;
                    ball.vy = -Math.abs(ball.vy);
                    this.audio.playBarrierBounce();
                    this.particles.createSparks(ball.x, ball.y, '#06b6d4', 16);
                    this.particles.createFloatingText('BARRIER DEFLECT!', ball.x, ball.y - 20, '#06b6d4', 16);
                } else {
                    this.balls.splice(i, 1);
                }
            }
        }

        // If all balls lost, deduct a life
        if (this.balls.length === 0) {
            this.lives--;
            this.combo = 0;
            this.particles.addScreenShake(0.5);

            if (this.lives > 0) {
                // Respawn stuck ball on paddle
                this.balls.push(new Ball(this.paddle.x + this.paddle.width / 2, this.paddle.y - PHYSICS.BALL_RADIUS - 1));
            } else {
                // Game Over
                this.state = GAME_STATES.GAME_OVER;
                this.audio.playGameOver();
                this.ui.showGameOver(this.score, this.storage.data.highScore);
            }
        }

        // 4. Update Bricks & Collisions
        this.updateBrickCollisions();

        // 5. Update Boss if present
        if (this.boss && !this.boss.isDefeated) {
            this.boss.update(effectiveDt, this.paddle, this.balls, this.powerups.timeFreezeActive, this.audio, this.particles);

            // Ball vs Boss
            this.balls.forEach(ball => {
                if (!ball.isStuck && this.boss.checkBallCollision(ball)) {
                    const dmg = ball.isFireball ? 3 : 1;
                    const defeated = this.boss.takeDamage(dmg, this.audio, this.particles);
                    this.score += 500 * (this.combo + 1);

                    if (defeated) {
                        this.handleBossDefeat();
                    }
                }
            });

            // Lasers vs Boss
            for (let li = this.paddle.lasers.length - 1; li >= 0; li--) {
                const laser = this.paddle.lasers[li];
                if (this.boss.checkLaserCollision(laser)) {
                    this.paddle.lasers.splice(li, 1);
                    const defeated = this.boss.takeDamage(1, this.audio, this.particles);
                    this.score += 250;

                    if (defeated) {
                        this.handleBossDefeat();
                    }
                }
            }
        }

        // 6. Update Power-ups & Crystals
        this.powerups.update(dt, this.paddle, this.balls, this.audio, this.particles);

        // 7. Check Level Victory Condition
        this.checkVictoryCondition();

        // 8. Refresh HUD
        this.updateHUD();
    }

    updateBrickCollisions() {
        const isTimeFrozen = this.powerups.timeFreezeActive;

        for (let bIdx = 0; bIdx < this.bricks.length; bIdx++) {
            const brick = this.bricks[bIdx];
            if (!isTimeFrozen) brick.update(0.016);
            if (brick.isDestroyed) continue;

            // --- Ball vs Brick ---
            for (let bi = 0; bi < this.balls.length; bi++) {
                const ball = this.balls[bi];
                if (ball.isStuck) continue;

                const col = Physics.checkCircleRect(ball.x, ball.y, ball.radius, brick.x, brick.y, brick.width, brick.height);
                if (!col) continue;

                // Portal Teleportation
                if (brick.isPortal && ball.portalCooldown <= 0) {
                    const otherPortal = this.bricks.find(b => b.isPortal && b !== brick && !b.isDestroyed);
                    if (otherPortal) {
                        ball.x = otherPortal.x + otherPortal.width / 2;
                        ball.y = otherPortal.y + otherPortal.height / 2;
                        ball.portalCooldown = 0.6; // cooldown
                        this.audio.playPortalWarp();
                        this.particles.createPortalRipple(brick.x + brick.width / 2, brick.y + brick.height / 2);
                        this.particles.createPortalRipple(otherPortal.x + otherPortal.width / 2, otherPortal.y + otherPortal.height / 2);
                        continue;
                    }
                }

                // Reflection (Unless fireball obliterating destructible brick)
                if (!ball.isFireball || brick.type === BRICK_TYPES.IRON) {
                    if (col.normalX !== 0) {
                        ball.vx = -ball.vx;
                        ball.x += col.normalX * col.penetration;
                    }
                    if (col.normalY !== 0) {
                        ball.vy = -ball.vy;
                        ball.y += col.normalY * col.penetration;
                    }
                }

                // Damage Brick
                const destroyed = brick.takeDamage(ball.isFireball ? 3 : 1);
                this.handleBrickHit(brick, destroyed);
                break;
            }

            // --- Lasers vs Brick ---
            for (let li = this.paddle.lasers.length - 1; li >= 0; li--) {
                const laser = this.paddle.lasers[li];
                if (
                    laser.x + laser.width >= brick.x &&
                    laser.x <= brick.x + brick.width &&
                    laser.y + laser.height >= brick.y &&
                    laser.y <= brick.y + brick.height
                ) {
                    this.paddle.lasers.splice(li, 1);
                    this.particles.createSparks(laser.x, laser.y, '#f97316', 6);
                    const destroyed = brick.takeDamage(1);
                    this.handleBrickHit(brick, destroyed);
                    break;
                }
            }
        }
    }

    handleBrickHit(brick, destroyed) {
        if (destroyed) {
            this.combo++;
            this.comboTimer = 2.5;

            // Scoring
            const basePoints = 100;
            const points = basePoints * this.combo;
            this.score += points;

            this.audio.playBrickDestroy(this.combo);
            this.particles.createBrickShards(brick.x, brick.y, brick.width, brick.height, brick.color);
            this.particles.createFloatingText(`+${points}`, brick.x + brick.width / 2, brick.y, '#facc15', 13);

            // Explosive Chain Detonation
            if (brick.type === BRICK_TYPES.EXPLOSIVE) {
                this.audio.playExplosion();
                this.particles.createExplosion(brick.x + brick.width / 2, brick.y + brick.height / 2, 70, '#f97316');
                this.detonateExplosionRadius(brick.x + brick.width / 2, brick.y + brick.height / 2, 85);
            }

            // Guaranteed Power-up Brick Drop
            if (brick.type === BRICK_TYPES.POWER || Math.random() < 0.12) {
                this.powerups.spawnRandomPowerup(brick.x + brick.width / 2 - 14, brick.y);
                this.audio.playPowerupSpawn();
            }

            // Crystal Brick Drop
            if (brick.type === BRICK_TYPES.CRYSTAL) {
                this.powerups.spawnCrystal(brick.x + brick.width / 2, brick.y, brick.crystalAmount);
                this.levelCrystalsEarned += brick.crystalAmount;
            }

            // Achievement check
            this.storage.unlockAchievement('first_fracture');
            if (this.combo >= 15) this.storage.unlockAchievement('combo_king');
        } else {
            if (brick.type === BRICK_TYPES.IRON) {
                this.audio.playIronClang();
                this.particles.createSparks(brick.x + brick.width / 2, brick.y + brick.height / 2, '#cbd5e1', 5);
            } else {
                this.audio.playBrickHit();
            }
        }
    }

    detonateExplosionRadius(cx, cy, radius) {
        this.bricks.forEach(b => {
            if (b.isDestroyed || b.type === BRICK_TYPES.IRON) return;
            const bx = b.x + b.width / 2;
            const by = b.y + b.height / 2;
            const dist = Math.hypot(bx - cx, by - cy);

            if (dist <= radius) {
                const destroyed = b.takeDamage(2);
                this.handleBrickHit(b, destroyed);
            }
        });
    }

    checkVictoryCondition() {
        if (this.currentLevelData.isBossLevel) {
            // Boss win handled when boss hp reaches 0
            return;
        }

        // Count remaining destructible bricks
        const remaining = this.bricks.filter(b => !b.isDestroyed && b.type !== BRICK_TYPES.IRON && b.type !== BRICK_TYPES.PORTAL).length;
        if (remaining === 0) {
            this.handleLevelWin();
        }
    }

    handleLevelWin() {
        this.state = GAME_STATES.LEVEL_WIN;
        this.audio.playLevelWin();

        // Calculate Stars
        let stars = 1;
        if (this.score >= this.currentLevelData.targetScore) stars = 3;
        else if (this.score >= this.currentLevelData.targetScore * 0.6) stars = 2;

        this.storage.recordLevelCompletion(this.currentWorldIdx, this.currentLevelNum, this.score, stars);

        this.ui.showLevelWin(this.currentWorldIdx, this.currentLevelNum, this.score, stars, this.levelCrystalsEarned);
    }

    handleBossDefeat() {
        this.state = GAME_STATES.BOSS_WIN;
        const bossAch = [
            'pyramid_raider',
            'forest_cleanser',
            'glacier_breaker',
            'machine_overclocker',
            'void_walker',
            'chrono_master'
        ][this.currentWorldIdx];

        if (bossAch) this.storage.unlockAchievement(bossAch);

        this.storage.recordLevelCompletion(this.currentWorldIdx, 10, this.score, 3);
        this.ui.showBossWin(this.currentWorldIdx);
    }

    updateHUD() {
        this.ui.updateHUD({
            score: this.score,
            highScore: this.storage.data.highScore,
            worldName: WORLDS[this.currentWorldIdx].name,
            levelNum: this.currentLevelNum,
            lives: this.lives,
            crystals: this.storage.data.crystals,
            combo: this.combo,
            activeEffects: this.powerups.activeEffects
        });
    }

    render() {
        this.ctx.save();

        // Screen Shake offset
        if (this.particles.shakeX !== 0 || this.particles.shakeY !== 0) {
            this.ctx.translate(this.particles.shakeX, this.particles.shakeY);
        }

        // 1. Backgrounds & Scenery
        this.backgrounds.render(this.ctx);

        // 2. Bricks
        const time = performance.now() / 1000;
        this.bricks.forEach(b => b.render(this.ctx, time));

        // 3. Boss
        if (this.boss) this.boss.render(this.ctx);

        // 4. Power-ups & Crystals
        this.powerups.render(this.ctx);

        // 5. Paddle
        this.paddle.render(this.ctx);

        // 6. Balls
        this.balls.forEach(b => b.render(this.ctx));

        // 7. Particles & Popups
        this.particles.render(this.ctx);

        this.ctx.restore();
    }
}
