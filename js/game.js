// game.js - Unified Arcade Engine for Jardinains & Bricks of Egypt!

class JardinainsGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.width = 800;
        this.height = 600;
        this.setupCanvasDPI();

        // Game Mode: 'bricks_of_egypt', 'jardinains', or 'mashup'
        this.gameMode = 'bricks_of_egypt'; // Default to Bricks of Egypt
        window.setGameMode(this.gameMode);

        this.state = 'START';
        this.score = 0;
        this.highScore = this.getSavedHighScore();
        this.lives = 3;
        this.currentLevelIndex = 0;
        this.levelName = "";
        this.levelPack = "";
        this.isEgypt = true;
        this.treasuresCollected = 0;

        // Subsystems
        this.particles = new ParticleSystem();
        this.editor = new LevelEditor(this);

        // Entities
        this.paddle = {
            x: 350,
            y: 560,
            width: 100,
            baseWidth: 100,
            height: 14,
            speed: 550,
            isStunned: false,
            stunTimer: 0,
            hasLaser: false,
            laserTimer: 0,
            hasSticky: false,
            stickyTimer: 0,
            hasFireball: false,
            fireballTimer: 0,
            isWide: false,
            wideTimer: 0,
            isShrunk: false,
            shrinkTimer: 0,
            isInverted: false,
            invertTimer: 0,
            shieldActive: false,
            shieldHits: 0
        };

        this.balls = [];
        this.bricks = [];
        this.gnomes = [];
        this.flowerpots = [];
        this.powerups = [];
        this.treasures = []; // Bricks of Egypt falling jewels, scarabs & water drops
        this.lasers = [];
        this.helperEyes = []; // Bricks of Egypt Guardian Eyes

        this.keys = {};
        this.mouseX = this.width / 2;
        this.isMouseControl = false;
        this.lastTime = 0;
        this.gnomeFreezeTimer = 0;

        this.bindEvents();
        this.loadLevel(this.currentLevelIndex);
        this.updateHUD();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    setupCanvasDPI() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
    }

    getSavedHighScore() {
        const key = this.gameMode === 'bricks_of_egypt' ? 'boe_highscore' : 'jardinains_highscore';
        return parseInt(localStorage.getItem(key) || '0', 10);
    }

    saveHighScore() {
        const key = this.gameMode === 'bricks_of_egypt' ? 'boe_highscore' : 'jardinains_highscore';
        localStorage.setItem(key, this.highScore.toString());
    }

    switchGameMode(mode) {
        if (mode !== 'bricks_of_egypt' && mode !== 'jardinains' && mode !== 'mashup') return;
        this.gameMode = mode;
        window.setGameMode(mode);
        this.isEgypt = mode !== 'jardinains';
        this.score = 0;
        this.treasuresCollected = 0;
        this.highScore = this.getSavedHighScore();
        this.currentLevelIndex = 0;
        this.lives = 3;

        // Update Theme Audio
        window.soundManager.setMusicTheme(this.isEgypt ? 'egypt' : 'garden');

        this.updateGameModeUI();
        this.loadLevel(0);
        this.state = 'START';
    }

    updateGameModeUI() {
        const titleEl = document.getElementById('game-title-text');
        const iconEl = document.getElementById('game-title-icon');

        if (this.gameMode === 'bricks_of_egypt') {
            if (titleEl) titleEl.innerText = "BRICKS OF EGYPT";
            if (iconEl) iconEl.innerText = "🏺";
        } else if (this.gameMode === 'jardinains') {
            if (titleEl) titleEl.innerText = "JARDINAINS!";
            if (iconEl) iconEl.innerText = "🧙‍♂️";
        } else {
            if (titleEl) titleEl.innerText = "JARDINAINS IN EGYPT";
            if (iconEl) iconEl.innerText = "⚡";
        }

        document.querySelectorAll('.game-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === this.gameMode);
        });

        this.updateHUD();
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.keys[e.code] = true;

            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            } else if (e.key === 'm' || e.key === 'M') {
                window.soundManager.toggleMute();
                this.updateAudioIcons();
            } else if (e.key === 'l' || e.key === 'L') {
                this.toggleLevelSelect();
            } else if (e.key === 'e' || e.key === 'E') {
                this.editor.toggle();
            } else if (e.key === 'h' || e.key === 'H') {
                this.toggleHelp();
            } else if (e.key === 'r' || e.key === 'R') {
                this.restartLevel();
            } else if (e.key === 'n' || e.key === 'N') {
                this.winLevel();
            } else if (e.key === '1') {
                this.switchGameMode('bricks_of_egypt');
            } else if (e.key === '2') {
                this.switchGameMode('jardinains');
            } else if (e.key === '3') {
                this.switchGameMode('mashup');
            } else if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                this.handleActionTrigger();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.code] = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.width / rect.width;
            this.mouseX = (e.clientX - rect.left) * scaleX;
            this.isMouseControl = true;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.handleActionTrigger();
            }
        });

        window.addEventListener('resize', () => {
            this.setupCanvasDPI();
        });
    }

    handleActionTrigger() {
        window.soundManager.resume();

        if (this.state === 'START') {
            this.state = 'PLAYING';
            this.launchStuckBalls();
            return;
        }

        if (this.state === 'GAME_OVER') {
            this.startNewGame();
            return;
        }

        if (this.state === 'LEVEL_WIN') {
            this.nextLevel();
            return;
        }

        if (this.state === 'PLAYING') {
            let launchedAny = false;
            for (const ball of this.balls) {
                if (ball.stuckToPaddle) {
                    ball.stuckToPaddle = false;
                    ball.vx = ball.speed * Math.sin(ball.stuckAngle || 0);
                    ball.vy = -ball.speed * Math.cos(ball.stuckAngle || 0);
                    launchedAny = true;
                }
            }

            if (this.paddle.hasLaser && !this.paddle.isStunned) {
                this.fireLasers();
            }
        }
    }

    fireLasers() {
        const leftX = this.paddle.x;
        const rightX = this.paddle.x + this.paddle.width;
        const y = this.paddle.y - 4;

        this.lasers.push({ x: leftX, y: y, width: 4, height: 14, speed: 650 });
        this.lasers.push({ x: rightX, y: y, width: 4, height: 14, speed: 650 });

        window.soundManager.playLaserShot();
    }

    loadLevel(levelIndex) {
        this.currentLevelIndex = levelIndex;
        const levelData = window.getLevelData(levelIndex, this.gameMode);
        this.levelName = levelData.name || `Level #${levelIndex + 1}`;
        this.levelPack = levelData.pack || "";
        this.isEgypt = levelData.isEgypt !== undefined ? levelData.isEgypt : (this.gameMode !== 'jardinains');

        window.soundManager.setMusicTheme(this.isEgypt ? 'egypt' : 'garden');

        this.bricks = [];
        this.gnomes = [];
        this.flowerpots = [];
        this.powerups = [];
        this.treasures = [];
        this.lasers = [];
        this.helperEyes = [];
        this.particles.clear();
        this.resetPaddlePowerups();

        const cols = 14;
        const brickW = 48;
        const brickH = 20;
        const gap = 4;
        const startX = 36;
        const startY = 60;

        const grid = levelData.grid || [];
        for (let r = 0; r < grid.length; r++) {
            const rowStr = grid[r];
            for (let c = 0; c < Math.min(cols, rowStr.length); c++) {
                const char = rowStr[c];
                if (char !== '.' && char !== ' ') {
                    const bx = startX + c * (brickW + gap);
                    const by = startY + r * (brickH + gap);

                    let type = 'normal';
                    let durability = 1;
                    let color = window.COLOR_MAP[char] || '#3b82f6';
                    let glyph = window.GLYPH_MAP[char] || null;
                    let hasPowerup = char === '?' || (Math.random() < 0.15);

                    if (char === 'C' || char === 'G') {
                        type = 'cracked';
                        durability = 2;
                    } else if (char === 'H' || char === 'K') {
                        type = 'heavy';
                        durability = 3;
                    } else if (char === 'T' || char === 'U') {
                        type = 'explosive';
                    } else if (char === 'I' || char === 'O') {
                        type = 'indestructible';
                        durability = 999;
                        hasPowerup = false;
                    } else if (char === 'X') {
                        type = 'fire';
                        durability = 2; // Fire bricks take 2 hits unless extinguished!
                    } else if (char === '?') {
                        hasPowerup = true;
                    }

                    this.bricks.push({
                        col: c,
                        row: r,
                        x: bx,
                        y: by,
                        width: brickW,
                        height: brickH,
                        type: type,
                        durability: durability,
                        maxDurability: durability,
                        color: color,
                        glyph: glyph,
                        isEgypt: this.isEgypt,
                        isUrn: char === 'U',
                        isObelisk: char === 'O',
                        hasPowerup: hasPowerup
                    });
                }
            }
        }

        // Spawn Gnomes (Only in Jardinains and Mashup modes!)
        if (this.gameMode !== 'bricks_of_egypt') {
            const gnomesList = levelData.gnomes || [];
            for (const g of gnomesList) {
                const bx = startX + g.col * (brickW + gap);
                const by = startY + g.row * (brickH + gap);

                this.gnomes.push({
                    col: g.col,
                    row: g.row,
                    x: bx + (brickW - 32) / 2,
                    y: by - 28,
                    width: 32,
                    height: 36,
                    type: g.type || (this.isEgypt ? 'mummy' : 'normal'),
                    falling: false,
                    vx: 0,
                    vy: 0,
                    rotation: 0,
                    vRot: 0,
                    juggles: 0,
                    laughTimer: Math.random() * 5 + 3,
                    isLaughing: false,
                    throwTimer: Math.random() * 4 + 2,
                    isThrowing: false,
                    isAlive: true
                });
            }
        }

        this.resetBallAndPaddle();
        this.updateHUD();
    }

    loadCustomLevel(levelData) {
        this.currentLevelIndex = 999;
        this.levelName = levelData.name || "Custom Level";
        this.isEgypt = levelData.isEgypt || false;
        window.soundManager.setMusicTheme(this.isEgypt ? 'egypt' : 'garden');

        this.bricks = [];
        this.gnomes = [];
        this.flowerpots = [];
        this.powerups = [];
        this.treasures = [];
        this.lasers = [];
        this.helperEyes = [];
        this.particles.clear();
        this.resetPaddlePowerups();

        const cols = 14;
        const brickW = 48;
        const brickH = 20;
        const gap = 4;
        const startX = 36;
        const startY = 60;

        const grid = levelData.grid || [];
        for (let r = 0; r < grid.length; r++) {
            const rowStr = grid[r];
            for (let c = 0; c < Math.min(cols, rowStr.length); c++) {
                const char = rowStr[c];
                if (char !== '.' && char !== ' ') {
                    const bx = startX + c * (brickW + gap);
                    const by = startY + r * (brickH + gap);

                    let type = 'normal';
                    let durability = 1;
                    let color = window.COLOR_MAP[char] || '#3b82f6';
                    let glyph = window.GLYPH_MAP[char] || null;
                    let hasPowerup = char === '?' || (Math.random() < 0.2);

                    if (char === 'C' || char === 'G') { type = 'cracked'; durability = 2; }
                    else if (char === 'H' || char === 'K') { type = 'heavy'; durability = 3; }
                    else if (char === 'T' || char === 'U') { type = 'explosive'; }
                    else if (char === 'I' || char === 'O') { type = 'indestructible'; durability = 999; hasPowerup = false; }
                    else if (char === 'X') { type = 'fire'; durability = 2; }

                    this.bricks.push({
                        col: c, row: r, x: bx, y: by, width: brickW, height: brickH,
                        type, durability, maxDurability: durability, color, glyph,
                        isEgypt: this.isEgypt, isUrn: char === 'U', isObelisk: char === 'O',
                        hasPowerup
                    });
                }
            }
        }

        for (const g of (levelData.gnomes || [])) {
            const bx = startX + g.col * (brickW + gap);
            const by = startY + g.row * (brickH + gap);
            this.gnomes.push({
                col: g.col, row: g.row,
                x: bx + (brickW - 32) / 2, y: by - 28,
                width: 32, height: 36,
                type: g.type || 'normal',
                falling: false, vx: 0, vy: 0, rotation: 0, vRot: 0,
                juggles: 0, laughTimer: 4, isLaughing: false,
                throwTimer: 3, isThrowing: false, isAlive: true
            });
        }

        this.resetBallAndPaddle();
        this.updateHUD();
        this.state = 'START';
    }

    resetBallAndPaddle() {
        this.paddle.x = (this.width - this.paddle.width) / 2;
        this.paddle.y = 560;
        this.paddle.isStunned = false;

        this.balls = [{
            x: this.paddle.x + this.paddle.width / 2,
            y: this.paddle.y - 8,
            radius: 7,
            vx: 0,
            vy: 0,
            speed: 380,
            stuckToPaddle: true,
            stuckOffset: this.paddle.width / 2,
            isFireball: false
        }];
    }

    launchStuckBalls() {
        for (const ball of this.balls) {
            if (ball.stuckToPaddle) {
                ball.stuckToPaddle = false;
                const angle = (Math.random() - 0.5) * 0.4;
                ball.vx = ball.speed * Math.sin(angle);
                ball.vy = -ball.speed * Math.cos(angle);
            }
        }
    }

    resetPaddlePowerups() {
        this.paddle.width = this.paddle.baseWidth;
        this.paddle.hasLaser = false;
        this.paddle.hasSticky = false;
        this.paddle.hasFireball = false;
        this.paddle.isWide = false;
        this.paddle.isShrunk = false;
        this.paddle.isInverted = false;
        this.paddle.shieldActive = false;
        this.paddle.laserTimer = 0;
        this.paddle.stickyTimer = 0;
        this.paddle.wideTimer = 0;
        this.paddle.shrinkTimer = 0;
        this.paddle.invertTimer = 0;
        this.paddle.fireballTimer = 0;
        this.gnomeFreezeTimer = 0;
        this.helperEyes = [];
        this.updateBadges();
    }

    // --- Main Game Loop ---
    gameLoop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        if (this.state === 'PLAYING') {
            this.updatePaddle(dt);
            this.updateBalls(dt);
            this.updateGnomes(dt);
            this.updateFlowerpots(dt);
            this.updatePowerups(dt);
            this.updateTreasures(dt);
            this.updateLasers(dt);
            this.updateHelperEyes(dt);
            this.checkLevelClear();
        }

        this.particles.update(dt);
    }

    updatePaddle(dt) {
        if (this.paddle.isStunned) {
            this.paddle.stunTimer -= dt;
            if (this.paddle.stunTimer <= 0) {
                this.paddle.isStunned = false;
            }
        }

        if (this.paddle.hasLaser) {
            this.paddle.laserTimer -= dt;
            if (this.paddle.laserTimer <= 0) this.paddle.hasLaser = false;
        }
        if (this.paddle.hasSticky) {
            this.paddle.stickyTimer -= dt;
            if (this.paddle.stickyTimer <= 0) this.paddle.hasSticky = false;
        }
        if (this.paddle.isWide) {
            this.paddle.wideTimer -= dt;
            if (this.paddle.wideTimer <= 0) {
                this.paddle.isWide = false;
                this.paddle.width = this.paddle.baseWidth;
            }
        }
        if (this.paddle.isShrunk) {
            this.paddle.shrinkTimer -= dt;
            if (this.paddle.shrinkTimer <= 0) {
                this.paddle.isShrunk = false;
                this.paddle.width = this.paddle.baseWidth;
            }
        }
        if (this.paddle.isInverted) {
            this.paddle.invertTimer -= dt;
            if (this.paddle.invertTimer <= 0) this.paddle.isInverted = false;
        }
        if (this.paddle.hasFireball) {
            this.paddle.fireballTimer -= dt;
            if (this.paddle.fireballTimer <= 0) {
                this.paddle.hasFireball = false;
                for (const b of this.balls) b.isFireball = false;
            }
        }
        if (this.gnomeFreezeTimer > 0) {
            this.gnomeFreezeTimer -= dt;
        }

        this.updateBadges();

        if (!this.paddle.isStunned) {
            let targetX = this.paddle.x;

            if (this.isMouseControl) {
                targetX = this.mouseX - this.paddle.width / 2;
                if (this.paddle.isInverted) {
                    targetX = this.width - this.mouseX - this.paddle.width / 2;
                }
            }

            let dir = 0;
            if (this.keys['arrowleft'] || this.keys['a']) dir -= 1;
            if (this.keys['arrowright'] || this.keys['d']) dir += 1;
            if (this.paddle.isInverted) dir = -dir;

            if (dir !== 0) {
                this.isMouseControl = false;
                targetX = this.paddle.x + dir * this.paddle.speed * dt;
            }

            this.paddle.x += (targetX - this.paddle.x) * (this.isMouseControl ? 0.35 : 1);
            this.paddle.x = Math.max(8, Math.min(this.width - this.paddle.width - 8, this.paddle.x));
        }

        for (const ball of this.balls) {
            if (ball.stuckToPaddle) {
                ball.x = this.paddle.x + (ball.stuckOffset || this.paddle.width / 2);
                ball.y = this.paddle.y - ball.radius;
            }
        }
    }

    updateBalls(dt) {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            if (ball.stuckToPaddle) continue;

            ball.x += ball.vx * dt;
            ball.y += ball.vy * dt;

            // Wall collisions
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx = -ball.vx;
                window.soundManager.playPaddleHit(0, this.isEgypt);
            } else if (ball.x + ball.radius > this.width) {
                ball.x = this.width - ball.radius;
                ball.vx = -ball.vx;
                window.soundManager.playPaddleHit(0, this.isEgypt);
            }

            if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.vy = -ball.vy;
                window.soundManager.playPaddleHit(0, this.isEgypt);
            }

            // Floor Barrier
            if (this.paddle.shieldActive && ball.y + ball.radius >= this.height - 15) {
                ball.y = this.height - 15 - ball.radius;
                ball.vy = -Math.abs(ball.vy);
                this.paddle.shieldHits++;
                this.particles.addPowerupSparks(ball.x, this.height - 15, '#38bdf8');
                window.soundManager.playPaddleHit(0, this.isEgypt);
                if (this.paddle.shieldHits >= 2) {
                    this.paddle.shieldActive = false;
                    this.particles.addFloatingText("SHIELD DEPLETED!", this.width / 2, this.height - 40, '#f87171');
                }
                continue;
            }

            // Ball Lost
            if (ball.y - ball.radius > this.height) {
                this.balls.splice(i, 1);
                if (this.balls.length === 0) {
                    this.loseLife();
                }
                continue;
            }

            // Paddle collision
            if (ball.vy > 0 &&
                ball.x + ball.radius >= this.paddle.x &&
                ball.x - ball.radius <= this.paddle.x + this.paddle.width &&
                ball.y + ball.radius >= this.paddle.y &&
                ball.y - ball.radius <= this.paddle.y + this.paddle.height) {

                if (this.paddle.hasSticky) {
                    ball.stuckToPaddle = true;
                    ball.stuckOffset = ball.x - this.paddle.x;
                    ball.stuckAngle = ((ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2)) * (Math.PI * 0.38);
                    ball.vx = 0;
                    ball.vy = 0;
                    window.soundManager.playPaddleHit(0, this.isEgypt);
                    continue;
                }

                const hitOffset = (ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
                const clampedOffset = Math.max(-0.95, Math.min(0.95, hitOffset));
                const maxAngle = Math.PI * 0.40;
                const angle = clampedOffset * maxAngle;

                ball.speed = Math.min(650, ball.speed + 4);
                ball.vx = ball.speed * Math.sin(angle);
                ball.vy = -ball.speed * Math.cos(angle);
                ball.y = this.paddle.y - ball.radius;

                window.soundManager.playPaddleHit(clampedOffset, this.isEgypt);
                this.particles.addPowerupSparks(ball.x, ball.y, this.isEgypt ? '#facc15' : '#38bdf8');
            }

            this.handleBallBrickCollisions(ball);
            this.handleBallGnomeCollisions(ball);
        }
    }

    handleBallBrickCollisions(ball) {
        for (let i = this.bricks.length - 1; i >= 0; i--) {
            const brick = this.bricks[i];

            const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
            const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));
            const distX = ball.x - closestX;
            const distY = ball.y - closestY;
            const distSq = distX * distX + distY * distY;

            if (distSq < ball.radius * ball.radius) {
                const isFireball = ball.isFireball || this.paddle.hasFireball;

                if (!isFireball) {
                    const overlapX = ball.radius - Math.abs(distX);
                    const overlapY = ball.radius - Math.abs(distY);

                    if (overlapX < overlapY) {
                        ball.vx = -ball.vx;
                        ball.x += (distX > 0 ? overlapX : -overlapX);
                    } else {
                        ball.vy = -ball.vy;
                        ball.y += (distY > 0 ? overlapY : -overlapY);
                    }
                }

                this.damageBrick(brick, i, isFireball);
                this.knockGnomeOnBrick(brick.col, brick.row);

                if (!isFireball) break;
            }
        }
    }

    handleBallGnomeCollisions(ball) {
        for (const gnome of this.gnomes) {
            if (!gnome.isAlive) continue;

            if (ball.x + ball.radius >= gnome.x &&
                ball.x - ball.radius <= gnome.x + gnome.width &&
                ball.y + ball.radius >= gnome.y &&
                ball.y - ball.radius <= gnome.y + gnome.height) {

                if (!gnome.falling) {
                    this.knockOffGnome(gnome, (ball.x - (gnome.x + gnome.width / 2)) * 5);
                    this.addScore(250);
                    this.particles.addFloatingText("+250 HIT!", gnome.x + gnome.width / 2, gnome.y, '#facc15');
                }
            }
        }
    }

    damageBrick(brick, index, isInstantBreak = false) {
        if (brick.type === 'indestructible' && !isInstantBreak) {
            window.soundManager.playIndestructibleHit(this.isEgypt);
            this.particles.addPowerupSparks(brick.x + brick.width / 2, brick.y + brick.height / 2, '#ffffff');
            return;
        }

        if (brick.type === 'explosive') {
            this.bricks.splice(index, 1);
            this.explodeBrick(brick.x + brick.width / 2, brick.y + brick.height / 2);
            return;
        }

        brick.durability -= (isInstantBreak ? 999 : 1);
        window.soundManager.playBrickHit(brick.durability, 0, this.isEgypt);

        if (brick.durability <= 0) {
            this.bricks.splice(index, 1);
            this.addScore(brick.maxDurability * 100);
            this.particles.addBrickShards(brick.x, brick.y, brick.width, brick.height, brick.color, 12, this.isEgypt);

            // In Bricks of Egypt, chance to drop falling Treasures (Scarabs, Jewels, Water Drops)
            if (this.isEgypt && Math.random() < 0.28) {
                this.spawnTreasure(brick.x + brick.width / 2, brick.y + brick.height / 2);
            }

            // Power-up Capsule drop
            if (brick.hasPowerup) {
                this.spawnPowerup(brick.x + brick.width / 2, brick.y + brick.height / 2);
            }
        } else {
            this.particles.addBrickShards(brick.x, brick.y, brick.width, brick.height, brick.color, 4, this.isEgypt);
        }
    }

    // --- Bricks of Egypt: Falling Treasures & Jewels ---
    spawnTreasure(x, y) {
        const types = [
            { treasureType: 'gold_scarab', points: 1000 },
            { treasureType: 'silver_scarab', points: 500 },
            { treasureType: 'ruby', points: 1500 },
            { treasureType: 'emerald', points: 1000 },
            { treasureType: 'sapphire', points: 800 },
            { treasureType: 'diamond', points: 2500 },
        ];

        // If there are fire bricks on the field, chance to drop a Water Drop!
        const hasFireBricks = this.bricks.some(b => b.type === 'fire');
        if (hasFireBricks && Math.random() < 0.35) {
            types.push({ treasureType: 'water', points: 2000, isWater: true });
        }

        const chosen = types[Math.floor(Math.random() * types.length)];
        this.treasures.push({
            x: x - 10,
            y: y,
            width: 20,
            height: 20,
            vy: 160,
            ...chosen
        });
    }

    updateTreasures(dt) {
        for (let i = this.treasures.length - 1; i >= 0; i--) {
            const tr = this.treasures[i];
            tr.y += tr.vy * dt;

            // Catch treasure with paddle!
            if (tr.x + tr.width >= this.paddle.x &&
                tr.x <= this.paddle.x + this.paddle.width &&
                tr.y + tr.height >= this.paddle.y &&
                tr.y <= this.paddle.y + this.paddle.height) {

                if (tr.isWater) {
                    // WATER DROP EXTINGUISHES FIRE BRICKS!
                    this.extinguishFireBricks();
                } else {
                    this.addScore(tr.points);
                    this.treasuresCollected++;
                    window.soundManager.playTreasureCollect(tr.points);
                    this.particles.addPowerupSparks(tr.x + tr.width / 2, tr.y, '#fbbf24');
                    this.particles.addFloatingText(`+${tr.points}`, tr.x + tr.width / 2, this.paddle.y - 18, '#fbbf24');
                }

                this.treasures.splice(i, 1);
                continue;
            }

            if (tr.y > this.height) {
                this.treasures.splice(i, 1);
            }
        }
    }

    extinguishFireBricks() {
        window.soundManager.playSteamHiss();
        let extinguishedCount = 0;
        for (const b of this.bricks) {
            if (b.type === 'fire') {
                b.type = 'normal';
                b.color = '#d97706';
                b.durability = 1;
                b.maxDurability = 1;
                this.particles.addBrickShards(b.x, b.y, b.width, b.height, '#38bdf8', 8);
                extinguishedCount++;
            }
        }
        this.addScore(extinguishedCount * 500);
        this.particles.addFloatingText("💧 FIRE EXTINGUISHED! +2,000", this.width / 2, this.height / 2, '#38bdf8', 22);
    }

    explodeBrick(cx, cy) {
        window.soundManager.playExplosion();
        this.particles.addExplosion(cx, cy, 70);
        this.addScore(300);

        const blastRadius = 75;
        for (let i = this.bricks.length - 1; i >= 0; i--) {
            const b = this.bricks[i];
            const bx = b.x + b.width / 2;
            const by = b.y + b.height / 2;
            const d = Math.hypot(bx - cx, by - cy);
            if (d < blastRadius) {
                this.damageBrick(b, i, true);
                this.knockGnomeOnBrick(b.col, b.row);
            }
        }

        for (const gnome of this.gnomes) {
            const gx = gnome.x + gnome.width / 2;
            const gy = gnome.y + gnome.height / 2;
            if (Math.hypot(gx - cx, gy - cy) < blastRadius) {
                this.knockOffGnome(gnome, (gx - cx) * 4);
            }
        }
    }

    knockGnomeOnBrick(col, row) {
        for (const gnome of this.gnomes) {
            if (gnome.col === col && gnome.row === row && !gnome.falling && gnome.isAlive) {
                this.knockOffGnome(gnome);
            }
        }
    }

    knockOffGnome(gnome, launchVx = null) {
        gnome.falling = true;
        gnome.vy = -180;
        gnome.vx = launchVx !== null ? launchVx : (Math.random() - 0.5) * 120;
        gnome.vRot = (Math.random() - 0.5) * 7;
        gnome.juggles = 0;
        window.soundManager.playGnomeScream();

        const msg = gnome.type === 'mummy' ? "CURSE!" : (gnome.type === 'pharaoh' ? "BY RA!" : "WHEEE!");
        this.particles.addFloatingText(msg, gnome.x + gnome.width / 2, gnome.y - 10, '#f472b6');
    }

    updateGnomes(dt) {
        const isFrozen = this.gnomeFreezeTimer > 0;

        for (let i = this.gnomes.length - 1; i >= 0; i--) {
            const gnome = this.gnomes[i];
            if (!gnome.isAlive) continue;

            if (gnome.falling) {
                gnome.vy += 480 * dt;
                gnome.x += gnome.vx * dt;
                gnome.y += gnome.vy * dt;
                gnome.rotation += gnome.vRot * dt;

                if (gnome.x < 0) {
                    gnome.x = 0;
                    gnome.vx = -gnome.vx * 0.7;
                } else if (gnome.x + gnome.width > this.width) {
                    gnome.x = this.width - gnome.width;
                    gnome.vx = -gnome.vx * 0.7;
                }

                if (gnome.vy > 0 &&
                    gnome.x + gnome.width >= this.paddle.x &&
                    gnome.x <= this.paddle.x + this.paddle.width &&
                    gnome.y + gnome.height >= this.paddle.y &&
                    gnome.y <= this.paddle.y + this.paddle.height) {

                    gnome.juggles++;
                    gnome.vy = -450;
                    const offset = (gnome.x + gnome.width / 2 - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
                    gnome.vx = offset * 220;
                    gnome.vRot = (Math.random() - 0.5) * 12;

                    const points = 100 * Math.pow(2, Math.min(8, gnome.juggles - 1));
                    this.addScore(points);

                    window.soundManager.playGnomeBounce(gnome.juggles);

                    if (gnome.type === 'mummy') {
                        this.particles.addMummyBandages(gnome.x + gnome.width / 2, gnome.y + gnome.height, 6);
                    }

                    const juggleText = gnome.juggles > 1 ? `x${gnome.juggles} JUGGLE! +${points}` : `+${points}`;
                    this.particles.addFloatingText(juggleText, gnome.x + gnome.width / 2, gnome.y - 12, this.isEgypt ? '#fde047' : '#38bdf8', 18);
                    this.particles.addPowerupSparks(gnome.x + gnome.width / 2, gnome.y + gnome.height, '#f43f5e');

                    if (gnome.juggles === 3) {
                        this.spawnPowerup(gnome.x + gnome.width / 2, gnome.y, false);
                    } else if (gnome.juggles >= 5) {
                        this.spawnPowerup(gnome.x + gnome.width / 2, gnome.y, false, true);
                        gnome.vy = -700;
                        const ascMsg = gnome.type === 'pharaoh' ? "ASCENDED TO RA! +5,000" : "ASCENDED! +5,000";
                        this.particles.addFloatingText(ascMsg, gnome.x, gnome.y - 30, '#ffd700', 20);
                        this.addScore(5000);
                    }
                    continue;
                }

                if (gnome.y > this.height) {
                    gnome.isAlive = false;
                    window.soundManager.playGnomeSplat();
                    this.particles.addFlowerpotShatter(gnome.x + gnome.width / 2, this.height - 10, 8, this.isEgypt);
                    this.particles.addFloatingText("SPLAT!", gnome.x + gnome.width / 2, this.height - 30, '#ef4444');
                    continue;
                }
            } else {
                if (isFrozen) continue;

                const hasBrick = this.bricks.some(b => b.col === gnome.col && b.row === gnome.row);
                if (!hasBrick) {
                    this.knockOffGnome(gnome);
                    continue;
                }

                gnome.laughTimer -= dt;
                if (gnome.laughTimer <= 0) {
                    gnome.isLaughing = true;
                    window.soundManager.playGnomeLaugh();
                    setTimeout(() => { gnome.isLaughing = false; }, 600);
                    gnome.laughTimer = Math.random() * 6 + 4;
                }

                gnome.throwTimer -= dt;
                if (gnome.throwTimer <= 0) {
                    this.throwFlowerpot(gnome);
                    gnome.throwTimer = (gnome.type === 'grumpy' || gnome.type === 'anubis') ? (Math.random() * 3 + 2.5) : (Math.random() * 6 + 4);
                }
            }
        }
    }

    throwFlowerpot(gnome) {
        gnome.isThrowing = true;
        setTimeout(() => { gnome.isThrowing = false; }, 350);

        window.soundManager.playGnomeThrow();

        const targetX = this.paddle.x + this.paddle.width / 2;
        const dx = targetX - (gnome.x + gnome.width / 2);
        const vx = dx * 0.75;
        
        let type = 'pot';
        if (this.isEgypt) {
            type = gnome.type === 'pharaoh' ? 'scarab' : 'canopic';
        } else if (gnome.type === 'grumpy') {
            type = 'rock';
        }

        this.flowerpots.push({
            x: gnome.x + gnome.width / 2,
            y: gnome.y + 10,
            vx: vx,
            vy: -40,
            angle: 0,
            vRot: (Math.random() - 0.5) * 8,
            type: type
        });
    }

    updateFlowerpots(dt) {
        for (let i = this.flowerpots.length - 1; i >= 0; i--) {
            const pot = this.flowerpots[i];
            pot.vy += 320 * dt;
            pot.x += pot.vx * dt;
            pot.y += pot.vy * dt;
            pot.angle += pot.vRot * dt;

            if (pot.x >= this.paddle.x &&
                pot.x <= this.paddle.x + this.paddle.width &&
                pot.y >= this.paddle.y &&
                pot.y <= this.paddle.y + this.paddle.height) {

                this.paddle.isStunned = true;
                this.paddle.stunTimer = 1.6;
                this.addScore(-250);

                window.soundManager.playPotBreak();
                window.soundManager.playPaddleStun();

                this.particles.addFlowerpotShatter(pot.x, pot.y, 16, this.isEgypt);
                this.particles.triggerShake(0.3, 6);
                const stunTxt = this.isEgypt ? "CURSED! -250" : "STUNNED! -250";
                this.particles.addFloatingText(stunTxt, pot.x, this.paddle.y - 18, '#ef4444', 18);

                this.flowerpots.splice(i, 1);
                continue;
            }

            if (pot.y >= this.height - 10) {
                window.soundManager.playPotBreak();
                this.particles.addFlowerpotShatter(pot.x, this.height - 10, 10, this.isEgypt);
                this.flowerpots.splice(i, 1);
            }
        }
    }

    spawnPowerup(x, y, allowTraps = true, rareOnly = false) {
        const goodTypes = [
            { type: 'wide', icon: 'W', color: '#38bdf8' },
            { type: 'sticky', icon: 'S', color: '#10b981' },
            { type: 'laser', icon: 'L', color: '#f43f5e' },
            { type: 'multi', icon: 'M', color: '#a855f7' },
            { type: 'fireball', icon: 'F', color: '#f97316' },
            { type: 'barrier', icon: 'B', color: '#06b6d4' },
            { type: 'freeze', icon: 'Z', color: '#67e8f9' },
            { type: 'gem', icon: '★', color: '#eab308' },
            { type: 'slow', icon: '🐢', color: '#84cc16' },
        ];

        if (this.isEgypt) {
            goodTypes.push({ type: 'eye', icon: '𓂀', isRelic: true, color: '#f59e0b' });
            goodTypes.push({ type: 'ankh', icon: '☥', isRelic: true, color: '#fbbf24' });
            goodTypes.push({ type: 'scarab', icon: '𓆣', isRelic: true, color: '#059669' });
        }

        if (this.lives < 5) {
            goodTypes.push({ type: 'life', icon: '♥', color: '#ec4899' });
        }

        const trapTypes = [
            { type: 'shrink', icon: '🔻', isTrap: true },
            { type: 'fast', icon: '⚡', isTrap: true },
            { type: 'invert', icon: '↕', isTrap: true },
            { type: 'bad', icon: '🚫', isTrap: true }
        ];

        let selected = null;
        if (rareOnly) {
            selected = this.isEgypt 
                ? { type: 'eye', icon: '𓂀', isRelic: true, color: '#f59e0b' }
                : { type: 'life', icon: '♥', color: '#ec4899' };
        } else if (allowTraps && Math.random() < 0.22) {
            selected = trapTypes[Math.floor(Math.random() * trapTypes.length)];
        } else {
            selected = goodTypes[Math.floor(Math.random() * goodTypes.length)];
        }

        this.powerups.push({
            x: x - 15,
            y: y,
            width: 30,
            height: 14,
            vy: 140,
            ...selected
        });
    }

    updatePowerups(dt) {
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const p = this.powerups[i];
            p.y += p.vy * dt;

            if (p.x + p.width >= this.paddle.x &&
                p.x <= this.paddle.x + this.paddle.width &&
                p.y + p.height >= this.paddle.y &&
                p.y <= this.paddle.y + this.paddle.height) {

                this.applyPowerup(p);
                this.powerups.splice(i, 1);
                continue;
            }

            if (p.y > this.height) {
                this.powerups.splice(i, 1);
            }
        }
    }

    applyPowerup(p) {
        window.soundManager.playPowerupCollect(!p.isTrap);
        this.particles.addPowerupSparks(p.x + p.width / 2, p.y, p.isTrap ? '#ef4444' : (p.isRelic ? '#fbbf24' : '#38bdf8'));

        switch (p.type) {
            case 'wide':
                this.paddle.isWide = true;
                this.paddle.isShrunk = false;
                this.paddle.width = this.paddle.baseWidth * 1.5;
                this.paddle.wideTimer = 18;
                this.particles.addFloatingText("EXPAND BAT!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#38bdf8');
                break;
            case 'sticky':
                this.paddle.hasSticky = true;
                this.paddle.stickyTimer = 18;
                this.particles.addFloatingText("GLUE BAT!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#10b981');
                break;
            case 'laser':
                this.paddle.hasLaser = true;
                this.paddle.laserTimer = 15;
                const laserTxt = this.isEgypt ? "HARPOON LASERS!" : "LASER CANNONS!";
                this.particles.addFloatingText(laserTxt, this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#f43f5e');
                break;
            case 'multi':
                this.splitBalls();
                this.particles.addFloatingText("MULTI-BALL!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#a855f7');
                break;
            case 'fireball':
                this.paddle.hasFireball = true;
                this.paddle.fireballTimer = 12;
                for (const b of this.balls) b.isFireball = true;
                this.particles.addFloatingText(this.isEgypt ? "FIRE OF RA!" : "FIREBALL PLOW!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#f97316');
                break;
            case 'barrier':
                this.paddle.shieldActive = true;
                this.paddle.shieldHits = 0;
                this.particles.addFloatingText("FLOOR BARRIER ON!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#06b6d4');
                break;
            case 'freeze':
                this.gnomeFreezeTimer = 10;
                this.particles.addFloatingText("FREEZE!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#67e8f9');
                break;
            case 'gem':
                this.addScore(5000);
                this.particles.addFloatingText("+5,000 TREASURE!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#eab308');
                break;
            case 'slow':
                for (const b of this.balls) b.speed = Math.max(300, b.speed * 0.75);
                this.particles.addFloatingText("SLOW BALL!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#84cc16');
                break;
            case 'life':
            case 'ankh':
                this.lives++;
                this.updateHUD();
                const lifeTxt = p.type === 'ankh' ? "ANKH (+1 LIFE)!" : "+1 EXTRA LIFE!";
                this.particles.addFloatingText(lifeTxt, this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#ec4899', 20);
                break;

            case 'eye':
                this.spawnHelperEye();
                this.particles.addFloatingText("GUARDIAN EYE OF HORUS!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#facc15', 20);
                break;
            case 'scarab':
                this.splitBalls(4);
                this.particles.addFloatingText("SCARAB SWARM (+4 BALLS)!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#059669', 20);
                break;

            case 'shrink':
                this.paddle.isShrunk = true;
                this.paddle.isWide = false;
                this.paddle.width = this.paddle.baseWidth * 0.6;
                this.paddle.shrinkTimer = 12;
                this.particles.addFloatingText("SHRINK BAT!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#ef4444');
                break;
            case 'fast':
                for (const b of this.balls) b.speed = Math.min(680, b.speed * 1.35);
                this.particles.addFloatingText("TURBO BALL!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#ef4444');
                break;
            case 'invert':
                this.paddle.isInverted = true;
                this.paddle.invertTimer = 8;
                this.particles.addFloatingText(this.isEgypt ? "MUMMY'S CURSE!" : "CONTROLS REVERSED!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#ef4444');
                break;
            case 'bad':
                this.resetPaddlePowerups();
                this.paddle.isShrunk = true;
                this.paddle.width = this.paddle.baseWidth * 0.55;
                this.paddle.shrinkTimer = 14;
                for (const b of this.balls) b.speed = 650;
                this.particles.triggerShake(0.4, 8);
                this.particles.addFloatingText("VERY, VERY BAD!", this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, '#ef4444', 22);
                break;
        }
    }

    spawnHelperEye() {
        this.helperEyes.push({
            x: this.width / 2,
            y: 180,
            vx: 120,
            vy: 80,
            size: 26,
            life: 20,
            zapCooldown: 1.5
        });
    }

    updateHelperEyes(dt) {
        for (let i = this.helperEyes.length - 1; i >= 0; i--) {
            const eye = this.helperEyes[i];
            eye.life -= dt;
            eye.x += eye.vx * dt;
            eye.y += eye.vy * dt;

            if (eye.x - eye.size < 20 || eye.x + eye.size > this.width - 20) eye.vx = -eye.vx;
            if (eye.y - eye.size < 30 || eye.y + eye.size > 340) eye.vy = -eye.vy;

            eye.zapCooldown -= dt;
            if (eye.zapCooldown <= 0 && this.bricks.length > 0) {
                const targetBrick = this.bricks[Math.floor(Math.random() * this.bricks.length)];
                if (targetBrick && targetBrick.type !== 'indestructible') {
                    window.soundManager.playEyeOfHorusZap();
                    this.lasers.push({
                        x: eye.x,
                        y: eye.y,
                        width: 5,
                        height: 16,
                        speed: 700
                    });
                    this.particles.addPowerupSparks(eye.x, eye.y, '#facc15');
                }
                eye.zapCooldown = 1.6;
            }

            if (eye.life <= 0) {
                this.helperEyes.splice(i, 1);
            }
        }
    }

    splitBalls(multiplier = 2) {
        const newBalls = [];
        for (const b of this.balls) {
            if (b.stuckToPaddle) continue;
            const speed = b.speed || 380;
            const currentAngle = Math.atan2(b.vx, -b.vy);

            for (let k = 1; k <= multiplier; k++) {
                const divAngle = (k % 2 === 1 ? 1 : -1) * 0.25 * Math.ceil(k / 2);
                newBalls.push({
                    x: b.x,
                    y: b.y,
                    radius: b.radius,
                    speed: speed,
                    vx: speed * Math.sin(currentAngle + divAngle),
                    vy: -speed * Math.cos(currentAngle + divAngle),
                    isFireball: b.isFireball
                });
            }
        }
        this.balls.push(...newBalls);
    }

    updateLasers(dt) {
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            laser.y -= laser.speed * dt;

            if (laser.y < 0) {
                this.lasers.splice(i, 1);
                continue;
            }

            let hit = false;
            for (let bIdx = this.bricks.length - 1; bIdx >= 0; bIdx--) {
                const b = this.bricks[bIdx];
                if (laser.x >= b.x && laser.x <= b.x + b.width &&
                    laser.y >= b.y && laser.y <= b.y + b.height) {
                    this.damageBrick(b, bIdx, false);
                    this.knockGnomeOnBrick(b.col, b.row);
                    hit = true;
                    break;
                }
            }

            if (hit) {
                this.lasers.splice(i, 1);
                continue;
            }

            for (const gnome of this.gnomes) {
                if (gnome.isAlive &&
                    laser.x >= gnome.x && laser.x <= gnome.x + gnome.width &&
                    laser.y >= gnome.y && laser.y <= gnome.y + gnome.height) {
                    this.knockOffGnome(gnome);
                    this.addScore(300);
                    this.particles.addFloatingText("+300 ZAP!", gnome.x, gnome.y, '#f43f5e');
                    hit = true;
                    break;
                }
            }

            if (hit) {
                this.lasers.splice(i, 1);
            }
        }
    }

    checkLevelClear() {
        const breakableRemaining = this.bricks.filter(b => b.type !== 'indestructible').length;
        if (breakableRemaining === 0) {
            this.winLevel();
        }
    }

    winLevel() {
        this.state = 'LEVEL_WIN';
        window.soundManager.playLevelWin();
        this.particles.triggerShake(0.3, 4);

        const bonus = (this.lives * 1000) + (this.currentLevelIndex + 1) * 500;
        this.addScore(bonus);

        const overlay = document.getElementById('level-win-overlay');
        if (overlay) {
            document.getElementById('win-level-name').innerText = `Cleared ${this.levelName}!`;
            document.getElementById('win-bonus-text').innerText = `Bonus: +${bonus.toLocaleString()} pts!`;
            overlay.style.display = 'flex';
        }
    }

    nextLevel() {
        const overlay = document.getElementById('level-win-overlay');
        if (overlay) overlay.style.display = 'none';

        this.currentLevelIndex++;
        this.loadLevel(this.currentLevelIndex);
        this.state = 'PLAYING';
    }

    loseLife() {
        this.lives--;
        this.updateHUD();
        window.soundManager.playLifeLost();

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.resetBallAndPaddle();
            this.state = 'START';
        }
    }

    gameOver() {
        this.state = 'GAME_OVER';
        const overlay = document.getElementById('game-over-overlay');
        if (overlay) {
            document.getElementById('final-score-text').innerText = `Final Score: ${this.score.toLocaleString()}`;
            overlay.style.display = 'flex';
        }
    }

    startNewGame() {
        const overlay = document.getElementById('game-over-overlay');
        if (overlay) overlay.style.display = 'none';

        this.score = 0;
        this.treasuresCollected = 0;
        this.lives = 3;
        this.currentLevelIndex = 0;
        this.loadLevel(0);
        this.state = 'START';
    }

    restartLevel() {
        this.loadLevel(this.currentLevelIndex);
        this.state = 'START';
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            document.getElementById('pause-overlay').style.display = 'flex';
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            document.getElementById('pause-overlay').style.display = 'none';
        }
    }

    addScore(pts) {
        this.score = Math.max(0, this.score + pts);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        this.updateHUD();
    }

    updateHUD() {
        const scoreEl = document.getElementById('score-display');
        const highEl = document.getElementById('highscore-display');
        const levelEl = document.getElementById('level-display');
        const livesEl = document.getElementById('lives-display');

        if (scoreEl) scoreEl.innerText = this.score.toLocaleString();
        if (highEl) highEl.innerText = this.highScore.toLocaleString();
        if (levelEl) {
            const packStr = this.levelPack ? `[${this.levelPack}] ` : "";
            levelEl.innerText = `${packStr}${this.currentLevelIndex + 1}: ${this.levelName}`;
        }
        if (livesEl) {
            livesEl.innerHTML = '';
            for (let i = 0; i < this.lives; i++) {
                livesEl.innerHTML += this.isEgypt ? '☥ ' : '❤️ ';
            }
        }
    }

    updateBadges() {
        const container = document.getElementById('active-powerups');
        if (!container) return;
        container.innerHTML = '';

        if (this.paddle.hasLaser) {
            const name = this.isEgypt ? 'HARPOONS' : 'LASER';
            container.innerHTML += `<span class="badge laser">${name} (${Math.ceil(this.paddle.laserTimer)}s)</span>`;
        }
        if (this.paddle.hasSticky) {
            const name = this.isEgypt ? 'GLUE' : 'STICKY';
            container.innerHTML += `<span class="badge sticky">${name} (${Math.ceil(this.paddle.stickyTimer)}s)</span>`;
        }
        if (this.paddle.hasFireball) {
            const name = this.isEgypt ? 'FIRE OF RA' : 'FIREBALL';
            container.innerHTML += `<span class="badge fireball">${name} (${Math.ceil(this.paddle.fireballTimer)}s)</span>`;
        }
        if (this.paddle.isWide) {
            container.innerHTML += `<span class="badge wide">WIDE (${Math.ceil(this.paddle.wideTimer)}s)</span>`;
        }
        if (this.paddle.shieldActive) {
            container.innerHTML += `<span class="badge shield">SHIELD (${2 - this.paddle.shieldHits})</span>`;
        }
        if (this.helperEyes.length > 0) {
            container.innerHTML += `<span class="badge relic">GUARDIAN EYE</span>`;
        }
        if (this.gnomeFreezeTimer > 0) {
            container.innerHTML += `<span class="badge freeze">FREEZE (${Math.ceil(this.gnomeFreezeTimer)}s)</span>`;
        }
        if (this.paddle.isShrunk) {
            container.innerHTML += `<span class="badge trap">SHRUNK (${Math.ceil(this.paddle.shrinkTimer)}s)</span>`;
        }
        if (this.paddle.isInverted) {
            container.innerHTML += `<span class="badge trap">REVERSED (${Math.ceil(this.paddle.invertTimer)}s)</span>`;
        }
    }

    updateAudioIcons() {
        const muteBtn = document.getElementById('btn-mute');
        if (muteBtn) {
            muteBtn.innerText = window.soundManager.isMuted ? '🔇 Unmute' : '🔊 Sound';
        }
    }

    toggleLevelSelect() {
        const modal = document.getElementById('level-select-modal');
        if (!modal) return;
        const isOpen = modal.style.display === 'flex';
        modal.style.display = isOpen ? 'none' : 'flex';

        if (!isOpen) {
            this.renderLevelSelectGrid();
        }
    }

    renderLevelSelectGrid() {
        const list = document.getElementById('levels-grid');
        if (!list) return;
        list.innerHTML = '';

        const levelList = window.getActiveGameLevels();
        for (let i = 0; i < levelList.length; i++) {
            const btn = document.createElement('button');
            btn.className = `level-btn ${i === this.currentLevelIndex ? 'current' : ''}`;
            const pack = levelList[i].pack ? `<span style="font-size:9px;color:#facc15;">${levelList[i].pack}</span><br>` : '';
            btn.innerHTML = `${pack}<strong>${i + 1}</strong><br><small>${levelList[i].name}</small>`;
            btn.onclick = () => {
                this.loadLevel(i);
                document.getElementById('level-select-modal').style.display = 'none';
                this.state = 'START';
            };
            list.appendChild(btn);
        }
    }

    toggleHelp() {
        const modal = document.getElementById('help-modal');
        if (modal) {
            modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
        }
    }

    // --- Rendering ---
    draw() {
        const ctx = this.ctx;
        ctx.save();

        const shake = this.particles.getShakeOffset();
        ctx.translate(shake.x, shake.y);

        this.drawBackground(ctx);

        for (const brick of this.bricks) {
            window.Sprites.drawBrick(ctx, brick);
        }

        const isFrozen = this.gnomeFreezeTimer > 0;
        for (const gnome of this.gnomes) {
            if (!gnome.isAlive) continue;
            window.Sprites.drawGnome(ctx, gnome.x, gnome.y, gnome.width, gnome.height, {
                falling: gnome.falling,
                rotation: gnome.rotation,
                laughing: gnome.isLaughing,
                throwing: gnome.isThrowing,
                type: gnome.type,
                frozen: isFrozen && !gnome.falling
            });
        }

        for (const pot of this.flowerpots) {
            window.Sprites.drawFlowerpot(ctx, pot.x, pot.y, 20, pot.angle, pot.type);
        }

        // Draw Bricks of Egypt Falling Treasures (Scarabs, Jewels, Water Drops)
        for (const tr of this.treasures) {
            window.Sprites.drawTreasure(ctx, tr);
        }

        for (const eye of this.helperEyes) {
            window.Sprites.drawEyeOfHorus(ctx, eye);
        }

        for (const p of this.powerups) {
            window.Sprites.drawPowerup(ctx, p);
        }

        for (const laser of this.lasers) {
            window.Sprites.drawLaser(ctx, laser, this.isEgypt);
        }

        if (this.paddle.shieldActive) {
            ctx.save();
            ctx.strokeStyle = this.isEgypt ? '#facc15' : '#38bdf8';
            ctx.lineWidth = 4;
            ctx.shadowColor = this.isEgypt ? '#ca8a04' : '#0284c7';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(0, this.height - 12);
            ctx.lineTo(this.width, this.height - 12);
            ctx.stroke();
            ctx.restore();
        }

        window.Sprites.drawPaddle(ctx, this.paddle, this.isEgypt);

        for (const ball of this.balls) {
            window.Sprites.drawBall(ctx, ball, this.isEgypt);
        }

        this.particles.draw(ctx);

        if (this.state === 'START') {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 8;
            ctx.fillText('CLICK OR PRESS SPACE TO LAUNCH', this.width / 2, this.height / 2 + 80);

            ctx.fillStyle = this.isEgypt ? '#fde047' : '#38bdf8';
            ctx.font = '16px "Segoe UI", sans-serif';
            let tipText = 'Bounce balls to shatter ancient sandstone hieroglyphs & catch falling scarabs!';
            if (this.gameMode === 'jardinains') {
                tipText = 'Bounce falling gnomes with your paddle for huge combo points!';
            } else if (this.gameMode === 'mashup') {
                tipText = 'Juggle mummies and pharaohs while catching falling scarabs & jewels!';
            }

            ctx.fillText('Move mouse or Arrow keys/AD to control paddle', this.width / 2, this.height / 2 + 115);
            ctx.fillText(tipText, this.width / 2, this.height / 2 + 140);
            ctx.restore();
        }

        ctx.restore();
    }

    drawBackground(ctx) {
        if (this.isEgypt) {
            const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
            bgGrad.addColorStop(0, '#1c1309');
            bgGrad.addColorStop(0.5, '#2e1c0c');
            bgGrad.addColorStop(1, '#170f06');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.fillStyle = 'rgba(251, 191, 36, 0.035)';
            ctx.font = '16px "Segoe UI Historic", sans-serif';
            for (let x = 30; x < this.width; x += 60) {
                for (let y = 35; y < this.height; y += 50) {
                    ctx.fillText('𓊪 ☥ 𓂀 𓆣', x, y);
                }
            }

            ctx.fillStyle = '#b45309';
            ctx.fillRect(0, this.height - 8, this.width, 8);
        } else {
            const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
            bgGrad.addColorStop(0, '#0f172a');
            bgGrad.addColorStop(0.5, '#1e293b');
            bgGrad.addColorStop(1, '#064e3b');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
            for (let x = 20; x < this.width; x += 30) {
                for (let y = 20; y < this.height; y += 30) {
                    ctx.fillRect(x, y, 2, 2);
                }
            }

            ctx.fillStyle = '#065f46';
            ctx.fillRect(0, this.height - 8, this.width, 8);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new JardinainsGame();
});
