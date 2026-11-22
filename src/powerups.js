/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Falling Power-Up Items, Chrono Crystals & Effect Timers
 */

import { POWERUP_TYPES, PHYSICS, CANVAS_HEIGHT, CANVAS_WIDTH } from './config.js';
import { storage } from './storage.js';

export class PowerupItem {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 16;
        this.type = type;
        this.vy = PHYSICS.POWERUP_FALL_SPEED;
        this.isCollected = false;
        this.rotation = 0;
    }

    update(dt) {
        this.y += this.vy * dt;
    }

    render(ctx) {
        ctx.save();
        const px = this.x;
        const py = this.y;
        const pw = this.width;
        const ph = this.height;

        // Capsule background
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 8);
        ctx.fill();

        // Glowing border
        ctx.strokeStyle = this.type.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = this.type.color;
        ctx.shadowBlur = 6;
        ctx.stroke();

        // Symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.type.symbol, px + pw / 2, py + ph / 2);

        ctx.restore();
    }
}

export class CrystalItem {
    constructor(x, y, value = 1) {
        this.x = x;
        this.y = y;
        this.radius = 7;
        this.value = value;
        this.vy = PHYSICS.CRYSTAL_FALL_SPEED;
        this.isCollected = false;
        this.time = Math.random() * 10;
    }

    update(dt, paddle) {
        this.time += dt;

        // Magnet attraction if player bought Shard Attractor upgrade
        const magnetLevel = storage.getUpgradeLevel('crystal_magnet');
        if (magnetLevel > 0 && paddle) {
            const paddleCenter = paddle.x + paddle.width / 2;
            const dx = paddleCenter - this.x;
            const dy = paddle.y - this.y;
            const dist = Math.hypot(dx, dy);
            const attractRadius = 90 + magnetLevel * 45;

            if (dist < attractRadius && dist > 1) {
                const pull = (1 - dist / attractRadius) * (200 + magnetLevel * 100);
                this.x += (dx / dist) * pull * dt;
                this.y += (dy / dist) * pull * dt;
            }
        }

        this.y += this.vy * dt;
    }

    render(ctx) {
        ctx.save();
        const shimmer = (Math.sin(this.time * 6) + 1) * 0.5;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.time * 2);

        // Diamond shape
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(this.radius, 0);
        ctx.lineTo(0, this.radius);
        ctx.lineTo(-this.radius, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + shimmer * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
    }
}

export class PowerupManager {
    constructor() {
        this.items = [];
        this.crystals = [];
        this.activeEffects = {}; // { 'fireball': remainingTime, 'wide_paddle': remainingTime, ... }
        this.timeFreezeActive = false;
        this.timeFreezeTimer = 0;
        this.slowMotionActive = false;
        this.slowMotionTimer = 0;
    }

    reset() {
        this.items = [];
        this.crystals = [];
        this.activeEffects = {};
        this.timeFreezeActive = false;
        this.timeFreezeTimer = 0;
        this.slowMotionActive = false;
        this.slowMotionTimer = 0;
    }

    spawnRandomPowerup(x, y) {
        // Weighted selection
        const types = Object.values(POWERUP_TYPES);
        const totalWeight = types.reduce((acc, t) => acc + t.weight, 0);
        let roll = Math.random() * totalWeight;

        let selected = types[0];
        for (const t of types) {
            if (roll < t.weight) {
                selected = t;
                break;
            }
            roll -= t.weight;
        }

        this.items.push(new PowerupItem(x, y, selected));
    }

    spawnCrystal(x, y, value = 1) {
        this.crystals.push(new CrystalItem(x, y, value));
    }

    update(dt, paddle, balls, audio, particles) {
        // Update Time Freeze timer
        if (this.timeFreezeActive) {
            this.timeFreezeTimer -= dt;
            if (this.timeFreezeTimer <= 0) {
                this.timeFreezeActive = false;
            }
        }

        // Update Slow Motion timer
        if (this.slowMotionActive) {
            this.slowMotionTimer -= dt;
            if (this.slowMotionTimer <= 0) {
                this.slowMotionActive = false;
            }
        }

        // Update active powerup timers
        for (const key in this.activeEffects) {
            this.activeEffects[key] -= dt;
            if (this.activeEffects[key] <= 0) {
                delete this.activeEffects[key];
            }
        }

        // Update falling power-up items
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.update(dt);

            // Paddle collision
            if (
                item.x + item.width >= paddle.x &&
                item.x <= paddle.x + paddle.width &&
                item.y + item.height >= paddle.y &&
                item.y <= paddle.y + paddle.height
            ) {
                this.applyPowerup(item.type, paddle, balls, audio, particles);
                this.items.splice(i, 1);
                continue;
            }

            // Fallen off screen
            if (item.y > CANVAS_HEIGHT + 20) {
                this.items.splice(i, 1);
            }
        }

        // Update falling crystals
        for (let i = this.crystals.length - 1; i >= 0; i--) {
            const c = this.crystals[i];
            c.update(dt, paddle);

            // Paddle collision
            if (
                c.x >= paddle.x - 5 &&
                c.x <= paddle.x + paddle.width + 5 &&
                c.y >= paddle.y - 5 &&
                c.y <= paddle.y + paddle.height + 5
            ) {
                storage.addCrystals(c.value);
                if (audio) audio.playCrystalCollect();
                if (particles) {
                    particles.createSparks(c.x, c.y, '#22d3ee', 10);
                    particles.createFloatingText(`+${c.value} 💎`, c.x, c.y - 10, '#22d3ee', 14);
                }
                this.crystals.splice(i, 1);
                continue;
            }

            // Fallen off screen
            if (c.y > CANVAS_HEIGHT + 20) {
                this.crystals.splice(i, 1);
            }
        }
    }

    applyPowerup(type, paddle, balls, audio, particles) {
        if (audio) audio.playPowerupCollect();
        if (particles) {
            particles.createSparks(paddle.x + paddle.width / 2, paddle.y, type.color, 16);
            particles.createFloatingText(`${type.name}!`, paddle.x + paddle.width / 2, paddle.y - 20, type.color, 16);
        }

        const dilatorBonus = 1 + storage.getUpgradeLevel('chrono_dilator') * 0.25;

        switch (type.id) {
            case 'multiball':
                // For each active ball, spawn 2 extra balls angled outward
                const currentBalls = [...balls];
                currentBalls.forEach(b => {
                    if (!b.isStuck) {
                        const speed = Math.hypot(b.vx, b.vy);
                        const angle = Math.atan2(b.vy, b.vx);

                        const b1 = new (b.constructor)(b.x, b.y);
                        b1.isStuck = false;
                        b1.vx = speed * Math.cos(angle - 0.45);
                        b1.vy = speed * Math.sin(angle - 0.45);

                        const b2 = new (b.constructor)(b.x, b.y);
                        b2.isStuck = false;
                        b2.vx = speed * Math.cos(angle + 0.45);
                        b2.vy = speed * Math.sin(angle + 0.45);

                        balls.push(b1, b2);
                    }
                });
                break;

            case 'fireball':
                balls.forEach(b => b.setFireball(type.duration));
                this.activeEffects['fireball'] = type.duration;
                break;

            case 'wide_paddle':
                paddle.setWide(type.duration);
                this.activeEffects['wide_paddle'] = type.duration;
                break;

            case 'magnet':
                paddle.setMagnet(type.duration);
                this.activeEffects['magnet'] = type.duration;
                break;

            case 'laser_paddle':
                paddle.setLaser(type.duration);
                this.activeEffects['laser_paddle'] = type.duration;
                break;

            case 'slow_motion':
                this.slowMotionActive = true;
                this.slowMotionTimer = type.duration * dilatorBonus;
                this.activeEffects['slow_motion'] = this.slowMotionTimer;
                break;

            case 'extra_life':
                // Handled in engine via return or callback
                window.dispatchEvent(new CustomEvent('chrono_extra_life'));
                break;

            case 'protective_barrier':
                paddle.addBarrierCharge(1);
                break;

            case 'time_freeze':
                this.timeFreezeActive = true;
                this.timeFreezeTimer = type.duration * dilatorBonus;
                this.activeEffects['time_freeze'] = this.timeFreezeTimer;
                if (audio) audio.playTimeFreeze();
                break;
        }
    }

    render(ctx) {
        // Render falling items
        this.items.forEach(item => item.render(ctx));
        this.crystals.forEach(crystal => crystal.render(ctx));
    }
}
