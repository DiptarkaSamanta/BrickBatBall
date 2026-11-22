/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * The 6 World Bosses: Health, Attack Patterns, Projectiles & Boss Arenas
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { Physics } from './physics.js';

export class BossProjectile {
    constructor(x, y, vx, vy, color = '#ef4444', size = 5, type = 'bullet') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.type = type;
        this.isDestroyed = false;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        if (this.y > CANVAS_HEIGHT + 20 || this.y < -30 || this.x < -30 || this.x > CANVAS_WIDTH + 30) {
            this.isDestroyed = true;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class Boss {
    constructor(worldIdx) {
        this.worldIdx = worldIdx;
        this.x = CANVAS_WIDTH / 2;
        this.y = 120;
        this.width = 140;
        this.height = 70;
        this.vx = 80;
        this.time = 0;
        this.attackTimer = 0;
        this.isDefeated = false;
        this.damageFlash = 0;
        this.projectiles = [];

        // Configure per World Boss
        switch (worldIdx) {
            case 0: // Lost Egypt: Chrono Sphinx
                this.name = 'Chrono Sphinx';
                this.title = 'Guardian of the Solar Gates';
                this.maxHp = 45;
                this.hp = 45;
                this.width = 150;
                this.height = 75;
                this.themeColor = '#f59e0b';
                this.attackCooldown = 2.4;
                break;

            case 1: // Mystic Forest: Sylvan Goliath
                this.name = 'Sylvan Goliath';
                this.title = 'Ancient Rune-Tree Colossus';
                this.maxHp = 55;
                this.hp = 55;
                this.width = 160;
                this.height = 80;
                this.themeColor = '#10b981';
                this.attackCooldown = 2.6;
                break;

            case 2: // Frozen Kingdom: Cryo Wyrm
                this.name = 'Cryo Wyrm';
                this.title = 'Glacial Sky Serpent';
                this.maxHp = 65;
                this.hp = 65;
                this.width = 170;
                this.height = 70;
                this.themeColor = '#06b6d4';
                this.attackCooldown = 2.2;
                break;

            case 3: // Machine City: Overclock Core
                this.name = 'Overclock Core';
                this.title = 'Autonomous Dreadnought Dynamo';
                this.maxHp = 75;
                this.hp = 75;
                this.width = 150;
                this.height = 85;
                this.themeColor = '#f97316';
                this.attackCooldown = 2.0;
                break;

            case 4: // Cosmic Void: Astral Devourer
                this.name = 'Astral Devourer';
                this.title = 'Singularity Entity of the Deep';
                this.maxHp = 85;
                this.hp = 85;
                this.width = 160;
                this.height = 90;
                this.themeColor = '#a855f7';
                this.attackCooldown = 1.9;
                break;

            case 5: // Final Dimension: The Chrono Architect
            default:
                this.name = 'The Chrono Architect';
                this.title = 'Supreme Master of Time and Space';
                this.maxHp = 100;
                this.hp = 100;
                this.width = 180;
                this.height = 95;
                this.themeColor = '#ec4899';
                this.attackCooldown = 1.6;
                break;
        }
    }

    takeDamage(amount = 1, audio, particles) {
        if (this.isDefeated) return false;

        this.hp -= amount;
        this.damageFlash = 0.18;

        if (audio) audio.playBossHit();
        if (particles) {
            particles.createSparks(this.x, this.y, this.themeColor, 12);
            particles.addScreenShake(0.3);
            particles.createFloatingText(`-${amount}`, this.x + (Math.random() - 0.5) * 60, this.y - 20, '#ffffff', 18);
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.isDefeated = true;
            if (audio) audio.playBossDefeat();
            if (particles) {
                particles.createExplosion(this.x, this.y, 80, this.themeColor);
                particles.createFloatingText('VICTORY!', this.x, this.y - 40, '#facc15', 28);
            }
            return true;
        }
        return false;
    }

    update(dt, paddle, balls, isTimeFrozen, audio, particles) {
        if (this.isDefeated) return;

        if (this.damageFlash > 0) {
            this.damageFlash = Math.max(0, this.damageFlash - dt);
        }

        // Time freeze stops boss movements and attack timers
        if (!isTimeFrozen) {
            this.time += dt;

            // Horizontal patrol movement
            this.x += this.vx * dt;
            const halfW = this.width / 2;
            if (this.x - halfW < 30) {
                this.x = 30 + halfW;
                this.vx = Math.abs(this.vx);
            } else if (this.x + halfW > CANVAS_WIDTH - 30) {
                this.x = CANVAS_WIDTH - 30 - halfW;
                this.vx = -Math.abs(this.vx);
            }

            // Periodic Boss Attacks
            this.attackTimer += dt;
            if (this.attackTimer >= this.attackCooldown) {
                this.attackTimer = 0;
                this.executeAttack(paddle, audio, particles);
            }
        }

        // Update boss projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            if (!isTimeFrozen) p.update(dt);

            // Check collision with paddle
            if (
                p.x >= paddle.x &&
                p.x <= paddle.x + paddle.width &&
                p.y >= paddle.y &&
                p.y <= paddle.y + paddle.height
            ) {
                // Hazard hit! Paddle stunned or loses barrier
                p.isDestroyed = true;
                if (!paddle.consumeBarrierCharge()) {
                    // Small paddle knockback or spark
                    if (particles) {
                        particles.createSparks(p.x, p.y, '#ef4444', 14);
                        particles.addScreenShake(0.35);
                        particles.createFloatingText('HAZARD!', paddle.x + paddle.width / 2, paddle.y - 25, '#ef4444', 16);
                    }
                } else {
                    if (particles) particles.createSparks(p.x, p.y, '#06b6d4', 10);
                }
            }

            if (p.isDestroyed) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    executeAttack(paddle, audio, particles) {
        const cx = this.x;
        const cy = this.y + this.height / 2;

        switch (this.worldIdx) {
            case 0: // Solar flare twin orbs
                this.projectiles.push(new BossProjectile(cx - 30, cy, 0, 160, '#f59e0b', 6));
                this.projectiles.push(new BossProjectile(cx + 30, cy, 0, 160, '#f59e0b', 6));
                break;

            case 1: // 3-way green thorn burst
                this.projectiles.push(new BossProjectile(cx, cy, -70, 150, '#10b981', 6));
                this.projectiles.push(new BossProjectile(cx, cy, 0, 165, '#10b981', 6));
                this.projectiles.push(new BossProjectile(cx, cy, 70, 150, '#10b981', 6));
                break;

            case 2: // Ice shard burst
                for (let i = -2; i <= 2; i++) {
                    this.projectiles.push(new BossProjectile(cx + i * 20, cy, i * 40, 175, '#06b6d4', 5));
                }
                break;

            case 3: // Laser pulses
                this.projectiles.push(new BossProjectile(cx - 40, cy, 0, 220, '#f97316', 5));
                this.projectiles.push(new BossProjectile(cx + 40, cy, 0, 220, '#f97316', 5));
                break;

            case 4: // Void matter spheres targeting paddle
                const angle = Math.atan2(paddle.y - cy, paddle.x + paddle.width / 2 - cx);
                this.projectiles.push(new BossProjectile(cx, cy, Math.cos(angle) * 180, Math.sin(angle) * 180, '#a855f7', 8));
                break;

            case 5: // The Chrono Architect - Tri-temporal spread
            default:
                for (let a = -0.5; a <= 0.5; a += 0.25) {
                    this.projectiles.push(new BossProjectile(cx, cy, Math.sin(a) * 190, Math.cos(a) * 190, '#ec4899', 6));
                }
                break;
        }

        if (particles) {
            particles.createSparks(cx, cy, this.themeColor, 8);
        }
    }

    checkBallCollision(ball) {
        if (this.isDefeated) return false;

        const bx = this.x - this.width / 2;
        const by = this.y - this.height / 2;

        const col = Physics.checkCircleRect(ball.x, ball.y, ball.radius, bx, by, this.width, this.height);
        if (!col) return false;

        // Reflect ball
        if (col.normalX !== 0) {
            ball.vx = -ball.vx;
            ball.x += col.normalX * col.penetration;
        }
        if (col.normalY !== 0) {
            ball.vy = -ball.vy;
            ball.y += col.normalY * col.penetration;
        }

        return true;
    }

    checkLaserCollision(laser) {
        if (this.isDefeated) return false;

        const bx = this.x - this.width / 2;
        const by = this.y - this.height / 2;

        return (
            laser.x + laser.width >= bx &&
            laser.x <= bx + this.width &&
            laser.y + laser.height >= by &&
            laser.y <= by + this.height
        );
    }

    render(ctx) {
        if (this.isDefeated) return;

        // Draw projectiles
        this.projectiles.forEach(p => p.render(ctx));

        ctx.save();
        const cx = this.x;
        const cy = this.y;
        const w = this.width;
        const h = this.height;

        // Flash white on hit
        if (this.damageFlash > 0) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
            ctx.restore();
            return;
        }

        // World-Specific Boss Rendering
        switch (this.worldIdx) {
            case 0:
                this.renderChronoSphinx(ctx, cx, cy, w, h);
                break;
            case 1:
                this.renderSylvanGoliath(ctx, cx, cy, w, h);
                break;
            case 2:
                this.renderCryoWyrm(ctx, cx, cy, w, h);
                break;
            case 3:
                this.renderOverclockCore(ctx, cx, cy, w, h);
                break;
            case 4:
                this.renderAstralDevourer(ctx, cx, cy, w, h);
                break;
            case 5:
            default:
                this.renderChronoArchitect(ctx, cx, cy, w, h);
                break;
        }

        // Health Bar rendered directly in HUD or over boss
        this.renderHealthBar(ctx, cx, cy - h / 2 - 18, w);

        ctx.restore();
    }

    renderHealthBar(ctx, x, y, width) {
        const barW = Math.max(140, width);
        const barH = 10;
        const startX = x - barW / 2;

        // Background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(startX - 2, y - 2, barW + 4, barH + 4);

        // Border
        ctx.strokeStyle = this.themeColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX - 2, y - 2, barW + 4, barH + 4);

        // Fill
        const pct = Math.max(0, this.hp / this.maxHp);
        const fillGrad = ctx.createLinearGradient(startX, y, startX + barW, y);
        fillGrad.addColorStop(0, this.themeColor);
        fillGrad.addColorStop(1, '#ef4444');
        ctx.fillStyle = fillGrad;
        ctx.fillRect(startX, y, barW * pct, barH);

        // Boss Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${this.name} [${this.hp}/${this.maxHp}]`, x, y - 4);
    }

    renderChronoSphinx(ctx, x, y, w, h) {
        // Golden Egyptian cyber-sphinx body
        const grad = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y);
        grad.addColorStop(0, '#f59e0b');
        grad.addColorStop(0.5, '#fef08a');
        grad.addColorStop(1, '#b45309');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 14);
        ctx.fill();

        // Mechanical paws
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x - w / 2 + 10, y + h / 2 - 12, 28, 14);
        ctx.fillRect(x + w / 2 - 38, y + h / 2 - 12, 28, 14);

        // Solar eye core
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y - 4, 12, 0, Math.PI * 2);
        ctx.fill();
    }

    renderSylvanGoliath(ctx, x, y, w, h) {
        // Living bark and emerald runes
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 18);
        ctx.fill();

        // Rune branches
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#34d399';
        ctx.fillText('𐍉', x, y + 5);
    }

    renderCryoWyrm(ctx, x, y, w, h) {
        // Crystalline ice dragon head
        const grad = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(0.5, '#e0f2fe');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 12);
        ctx.fill();

        // Ice Horns
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(x - w / 2 + 15, y - h / 2);
        ctx.lineTo(x - w / 2 + 30, y - h / 2 - 25);
        ctx.lineTo(x - w / 2 + 45, y - h / 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 45, y - h / 2);
        ctx.lineTo(x + w / 2 - 30, y - h / 2 - 25);
        ctx.lineTo(x + w / 2 - 15, y - h / 2);
        ctx.fill();
    }

    renderOverclockCore(ctx, x, y, w, h) {
        // Cyber Dreadnought dynamo
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x - w / 2, y - h / 2, w, h);

        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 10;
        ctx.strokeRect(x - w / 2 + 4, y - h / 2 + 4, w - 8, h - 8);

        // Spinning core turbine
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.time * 4);
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(-12, -12, 24, 24);
        ctx.restore();
    }

    renderAstralDevourer(ctx, x, y, w, h) {
        // Void singularity entity
        const grad = ctx.createRadialGradient(x, y, 5, x, y, w / 2);
        grad.addColorStop(0, '#000000');
        grad.addColorStop(0.6, '#a855f7');
        grad.addColorStop(1, '#581c87');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, h / 2 + 10, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing halo
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, (w / 2) * (0.8 + Math.sin(this.time * 3) * 0.1), 0, Math.PI * 2);
        ctx.stroke();
    }

    renderChronoArchitect(ctx, x, y, w, h) {
        // Final Dimension Master of Time
        const grad = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y);
        grad.addColorStop(0, '#ec4899');
        grad.addColorStop(0.5, '#fbbf24');
        grad.addColorStop(1, '#9333ea');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 20);
        ctx.fill();

        // Concentric Chrono Ring
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.time * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -22);
        ctx.moveTo(0, 0);
        ctx.lineTo(16, 0);
        ctx.stroke();
        ctx.restore();
    }
}
