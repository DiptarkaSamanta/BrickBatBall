/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Paddle Controller: Input, Laser Cannons, Magnet & Energy Barrier
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, PHYSICS } from './config.js';
import { storage } from './storage.js';

export class Paddle {
    constructor() {
        this.baseWidth = PHYSICS.PADDLE_BASE_WIDTH + storage.getUpgradeLevel('paddle_width') * 10;
        this.width = this.baseWidth;
        this.height = PHYSICS.PADDLE_HEIGHT;
        this.x = (CANVAS_WIDTH - this.width) / 2;
        this.y = CANVAS_HEIGHT - 38;
        this.speed = PHYSICS.PADDLE_BASE_SPEED;

        // Input state
        this.targetX = this.x;
        this.moveLeft = false;
        this.moveRight = false;
        this.useMouse = true;

        // Power-up States
        this.isWide = false;
        this.wideTimer = 0;

        this.isMagnet = false;
        this.magnetTimer = 0;

        this.isLaser = false;
        this.laserTimer = 0;
        this.laserCooldown = 0;
        this.lasers = [];

        // Bottom Energy Barrier Charges
        this.barrierCharges = storage.getUpgradeLevel('barrier_starter');
    }

    refreshUpgradeBonuses() {
        this.baseWidth = PHYSICS.PADDLE_BASE_WIDTH + storage.getUpgradeLevel('paddle_width') * 10;
        this.updateWidth();
    }

    updateWidth() {
        const targetW = this.isWide ? this.baseWidth * 1.5 : this.baseWidth;
        const diff = targetW - this.width;
        this.width = targetW;
        this.x -= diff / 2; // Keep center aligned
        this.clampBounds();
    }

    clampBounds() {
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CANVAS_WIDTH) this.x = CANVAS_WIDTH - this.width;
    }

    setWide(duration = 15) {
        this.isWide = true;
        this.wideTimer = duration;
        this.updateWidth();
    }

    setMagnet(duration = 14) {
        this.isMagnet = true;
        this.magnetTimer = duration;
    }

    setLaser(duration = 12) {
        this.isLaser = true;
        const durationBonus = 1 + storage.getUpgradeLevel('laser_duration') * 0.2;
        this.laserTimer = duration * durationBonus;
    }

    addBarrierCharge(charges = 1) {
        this.barrierCharges += charges;
    }

    consumeBarrierCharge() {
        if (this.barrierCharges > 0) {
            this.barrierCharges--;
            return true;
        }
        return false;
    }

    fireLasers(audioManager) {
        if (!this.isLaser || this.laserCooldown > 0) return;

        const leftX = this.x + 8;
        const rightX = this.x + this.width - 12;
        const spawnY = this.y - 6;

        this.lasers.push({
            x: leftX,
            y: spawnY,
            width: PHYSICS.LASER_WIDTH,
            height: PHYSICS.LASER_HEIGHT,
            vy: -PHYSICS.LASER_SPEED
        });

        this.lasers.push({
            x: rightX,
            y: spawnY,
            width: PHYSICS.LASER_WIDTH,
            height: PHYSICS.LASER_HEIGHT,
            vy: -PHYSICS.LASER_SPEED
        });

        const fireInterval = Math.max(0.14, 0.25 - storage.getUpgradeLevel('laser_duration') * 0.025);
        this.laserCooldown = fireInterval;

        if (audioManager) audioManager.playLaserFire();
    }

    update(dt, audioManager) {
        // Timers
        if (this.isWide) {
            this.wideTimer -= dt;
            if (this.wideTimer <= 0) {
                this.isWide = false;
                this.updateWidth();
            }
        }

        if (this.isMagnet) {
            this.magnetTimer -= dt;
            if (this.magnetTimer <= 0) {
                this.isMagnet = false;
            }
        }

        if (this.isLaser) {
            this.laserTimer -= dt;
            if (this.laserTimer <= 0) {
                this.isLaser = false;
            }
            if (this.laserCooldown > 0) {
                this.laserCooldown -= dt;
            }
        }

        // Movement resolution
        if (this.moveLeft) {
            this.x -= this.speed * dt;
            this.targetX = this.x;
        } else if (this.moveRight) {
            this.x += this.speed * dt;
            this.targetX = this.x;
        } else if (this.useMouse) {
            // Smooth mouse follow
            const target = this.targetX - this.width / 2;
            const dx = target - this.x;
            this.x += dx * Math.min(1.0, dt * 28);
        }

        this.clampBounds();

        // Update lasers
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const l = this.lasers[i];
            l.y += l.vy * dt;
            if (l.y + l.height < 0) {
                this.lasers.splice(i, 1);
            }
        }
    }

    render(ctx) {
        // 1. Draw Energy Barrier at bottom if active
        if (this.barrierCharges > 0) {
            ctx.save();
            ctx.strokeStyle = '#06b6d4';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 10;
            ctx.lineWidth = 3;
            ctx.setLineDash([12, 6]);
            ctx.beginPath();
            ctx.moveTo(0, CANVAS_HEIGHT - 6);
            ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 6);
            ctx.stroke();

            // Charge indicators
            ctx.setLineDash([]);
            ctx.fillStyle = '#06b6d4';
            ctx.font = '10px "Segoe UI", sans-serif';
            ctx.fillText(`SHIELD: ${this.barrierCharges}`, 10, CANVAS_HEIGHT - 12);
            ctx.restore();
        }

        // 2. Draw Lasers in flight
        if (this.lasers.length > 0) {
            ctx.save();
            ctx.fillStyle = '#f97316';
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 8;
            for (let i = 0; i < this.lasers.length; i++) {
                const l = this.lasers[i];
                ctx.fillRect(l.x, l.y, l.width, l.height);
            }
            ctx.restore();
        }

        // 3. Draw Paddle Chassis
        ctx.save();
        const r = 8; // border radius
        const px = this.x;
        const py = this.y;
        const pw = this.width;
        const ph = this.height;

        // Magnet Aura Glow
        if (this.isMagnet) {
            ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 4]);
            ctx.strokeRect(px - 4, py - 4, pw + 8, ph + 8);
            ctx.setLineDash([]);
        }

        // Main Body Gradient
        const bodyGrad = ctx.createLinearGradient(px, py, px, py + ph);
        bodyGrad.addColorStop(0, '#e2e8f0');
        bodyGrad.addColorStop(0.3, '#94a3b8');
        bodyGrad.addColorStop(0.7, '#475569');
        bodyGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = bodyGrad;

        // Rounded paddle body
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, [r, r, 4, 4]);
        ctx.fill();

        // Edge highlights
        ctx.strokeStyle = this.isLaser ? '#f97316' : (this.isMagnet ? '#eab308' : '#38bdf8');
        ctx.lineWidth = 2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Central Chrono Energy Core
        const coreW = Math.min(36, pw * 0.35);
        const coreX = px + (pw - coreW) / 2;
        const coreGrad = ctx.createLinearGradient(coreX, py, coreX + coreW, py);
        coreGrad.addColorStop(0, '#38bdf8');
        coreGrad.addColorStop(0.5, '#ffffff');
        coreGrad.addColorStop(1, '#38bdf8');
        ctx.fillStyle = coreGrad;
        ctx.fillRect(coreX, py + 3, coreW, ph - 6);

        // Laser wing blasters if active
        if (this.isLaser) {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(px + 2, py - 4, 6, 6);
            ctx.fillRect(px + pw - 8, py - 4, 6, 6);
        }

        ctx.restore();
    }
}
