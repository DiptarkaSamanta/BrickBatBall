/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Brick Entities: All 10 Types & Grid Manager
 */

import { BRICK_TYPES, CANVAS_WIDTH } from './config.js';
import { Physics } from './physics.js';

export class Brick {
    constructor(x, y, width, height, type = BRICK_TYPES.NORMAL, hits = 1, options = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.maxHits = hits;
        this.hits = hits;
        this.isDestroyed = false;

        // Custom options
        this.color = options.color || '#38bdf8';
        this.powerup = options.powerup || null; // for power bricks
        this.portalId = options.portalId || null; // for portal pairing

        // Moving brick state
        this.isMoving = type === BRICK_TYPES.MOVING;
        this.minX = options.minX || Math.max(10, x - 80);
        this.maxX = options.maxX || Math.min(CANVAS_WIDTH - width - 10, x + 80);
        this.speedX = options.speedX || 70;
        this.dirX = 1;

        // Regenerating brick state
        this.isRegenerating = type === BRICK_TYPES.REGENERATING;
        this.regenCooldown = 0;
        this.regenDuration = options.regenDuration || 6.5; // seconds

        // Invisible brick state
        this.isInvisible = type === BRICK_TYPES.INVISIBLE;
        this.revealed = false;
        this.revealTimer = 0;

        // Portal state
        this.isPortal = type === BRICK_TYPES.PORTAL;

        // Crystal state
        this.isCrystal = type === BRICK_TYPES.CRYSTAL;
        this.crystalAmount = options.crystalAmount || (Math.floor(Math.random() * 2) + 1);

        // Flash on damage
        this.damageFlash = 0;
    }

    takeDamage(amount = 1) {
        if (this.type === BRICK_TYPES.IRON) {
            this.damageFlash = 0.1;
            return false; // Immune to normal single hits unless overridden
        }

        if (this.isInvisible && !this.revealed) {
            this.revealed = true;
            this.revealTimer = 3.0;
        }

        this.hits -= amount;
        this.damageFlash = 0.15;

        if (this.hits <= 0) {
            this.isDestroyed = true;
            if (this.isRegenerating) {
                this.regenCooldown = this.regenDuration;
            }
            return true; // destroyed
        }
        return false;
    }

    update(dt) {
        if (this.damageFlash > 0) {
            this.damageFlash = Math.max(0, this.damageFlash - dt);
        }

        // Invisible reveal timer
        if (this.isInvisible && this.revealed) {
            this.revealTimer -= dt;
            if (this.revealTimer <= 0) {
                this.revealed = false;
            }
        }

        // Regenerating cooldown
        if (this.isRegenerating && this.isDestroyed) {
            this.regenCooldown -= dt;
            if (this.regenCooldown <= 0) {
                this.isDestroyed = false;
                this.hits = this.maxHits;
            }
        }

        // Moving brick patrol
        if (this.isMoving && !this.isDestroyed) {
            this.x += this.speedX * this.dirX * dt;
            if (this.x <= this.minX) {
                this.x = this.minX;
                this.dirX = 1;
            } else if (this.x >= this.maxX) {
                this.x = this.maxX;
                this.dirX = -1;
            }
        }
    }

    render(ctx, time = 0) {
        if (this.isDestroyed) {
            // Draw ghost outline if regenerating
            if (this.isRegenerating) {
                ctx.save();
                ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
                ctx.setLineDash([4, 4]);
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                ctx.restore();
            }
            return;
        }

        // Invisible cloaked brick
        if (this.isInvisible && !this.revealed) {
            // Very faint temporal shimmer
            const pulse = (Math.sin(time * 3 + this.x) + 1) * 0.04;
            ctx.save();
            ctx.strokeStyle = `rgba(255, 255, 255, ${pulse + 0.03})`;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.restore();
            return;
        }

        ctx.save();
        const bx = this.x;
        const by = this.y;
        const bw = this.width;
        const bh = this.height;

        // Flash white on hit
        if (this.damageFlash > 0) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(bx, by, bw, bh);
            ctx.restore();
            return;
        }

        // Render according to brick type
        switch (this.type) {
            case BRICK_TYPES.IRON:
                this.renderIron(ctx, bx, by, bw, bh);
                break;
            case BRICK_TYPES.STONE:
                this.renderStone(ctx, bx, by, bw, bh);
                break;
            case BRICK_TYPES.EXPLOSIVE:
                this.renderExplosive(ctx, bx, by, bw, bh, time);
                break;
            case BRICK_TYPES.POWER:
                this.renderPower(ctx, bx, by, bw, bh, time);
                break;
            case BRICK_TYPES.PORTAL:
                this.renderPortal(ctx, bx, by, bw, bh, time);
                break;
            case BRICK_TYPES.CRYSTAL:
                this.renderCrystal(ctx, bx, by, bw, bh, time);
                break;
            case BRICK_TYPES.REGENERATING:
                this.renderRegen(ctx, bx, by, bw, bh, time);
                break;
            case BRICK_TYPES.MOVING:
                this.renderMoving(ctx, bx, by, bw, bh);
                break;
            default:
                this.renderNormal(ctx, bx, by, bw, bh);
                break;
        }

        ctx.restore();
    }

    renderNormal(ctx, x, y, w, h) {
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, this.lighten(this.color, 40));
        grad.addColorStop(0.5, this.color);
        grad.addColorStop(1, this.darken(this.color, 35));
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Bevel borders
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    }

    renderStone(ctx, x, y, w, h) {
        // Multi-hit stone brick
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, '#94a3b8');
        grad.addColorStop(0.5, '#64748b');
        grad.addColorStop(1, '#334155');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Crack lines based on remaining hits
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        if (this.hits < this.maxHits) {
            ctx.beginPath();
            ctx.moveTo(x + 6, y + 4);
            ctx.lineTo(x + w * 0.4, y + h * 0.6);
            ctx.lineTo(x + w * 0.7, y + h - 3);
            ctx.stroke();
        }
        if (this.hits <= 1 && this.maxHits > 2) {
            ctx.beginPath();
            ctx.moveTo(x + w - 8, y + 5);
            ctx.lineTo(x + w * 0.5, y + h * 0.5);
            ctx.lineTo(x + 10, y + h - 4);
            ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.strokeRect(x, y, w, h);
    }

    renderIron(ctx, x, y, w, h) {
        // Indestructible / heavy steel brick
        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, '#e2e8f0');
        grad.addColorStop(0.3, '#64748b');
        grad.addColorStop(0.7, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Corner rivets
        ctx.fillStyle = '#cbd5e1';
        const rivetSize = 2;
        ctx.fillRect(x + 3, y + 3, rivetSize, rivetSize);
        ctx.fillRect(x + w - 5, y + 3, rivetSize, rivetSize);
        ctx.fillRect(x + 3, y + h - 5, rivetSize, rivetSize);
        ctx.fillRect(x + w - 5, y + h - 5, rivetSize, rivetSize);

        ctx.strokeStyle = '#475569';
        ctx.strokeRect(x, y, w, h);
    }

    renderExplosive(ctx, x, y, w, h, time) {
        const pulse = (Math.sin(time * 6) + 1) * 0.5;
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, '#ef4444');
        grad.addColorStop(0.5, '#dc2626');
        grad.addColorStop(1, '#991b1b');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Pulsing warning border
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.5 + pulse * 0.5})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);

        // TNT / Biohazard symbol
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡TNT', x + w / 2, y + h / 2);
    }

    renderPower(ctx, x, y, w, h, time) {
        const pulse = (Math.sin(time * 4) + 1) * 0.5;
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.5, '#0284c7');
        grad.addColorStop(1, '#075985');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 + pulse * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', x + w / 2, y + h / 2);
    }

    renderPortal(ctx, x, y, w, h, time) {
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, '#c084fc');
        grad.addColorStop(0.5, '#9333ea');
        grad.addColorStop(1, '#581c87');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Swirling portal vortex circle
        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(time * 3);
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(w, h) * 0.35, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = '#f472b6';
        ctx.strokeRect(x, y, w, h);
    }

    renderCrystal(ctx, x, y, w, h, time) {
        // Shimmering diamond Chrono Shard
        const shimmer = (Math.sin(time * 5 + x * 0.05) + 1) * 0.5;
        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, '#67e8f9');
        grad.addColorStop(0.5, '#06b6d4');
        grad.addColorStop(1, '#0e7490');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Crystal facets
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 + shimmer * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y + 2);
        ctx.lineTo(x + w - 4, y + h / 2);
        ctx.lineTo(x + w / 2, y + h - 2);
        ctx.lineTo(x + 4, y + h / 2);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💎', x + w / 2, y + h / 2);
    }

    renderRegen(ctx, x, y, w, h, time) {
        const pulse = (Math.sin(time * 3) + 1) * 0.5;
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, '#34d399');
        grad.addColorStop(0.5, '#10b981');
        grad.addColorStop(1, '#047857');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        ctx.strokeStyle = `rgba(167, 243, 208, ${0.5 + pulse * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = '#ecfdf5';
        ctx.font = 'bold 10px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⟳', x + w / 2, y + h / 2);
    }

    renderMoving(ctx, x, y, w, h) {
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, '#fbbf24');
        grad.addColorStop(0.5, '#d97706');
        grad.addColorStop(1, '#92400e');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Arrow indicators
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('◀ ▶', x + w / 2, y + h / 2);

        ctx.strokeStyle = '#fef3c7';
        ctx.strokeRect(x, y, w, h);
    }

    // Color helpers
    lighten(color, percent) {
        return color; // simplified for speed
    }
    darken(color, percent) {
        return color;
    }
}
