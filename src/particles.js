/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Particle Systems, Visual FX, Floating Text & Screen Shake
 */

import { storage } from './storage.js';

export class ParticleManager {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
        this.rings = [];

        // Screen Shake
        this.trauma = 0;
        this.shakeX = 0;
        this.shakeY = 0;
    }

    addScreenShake(amount = 0.4) {
        if (!storage.getSettings().screenShake) return;
        this.trauma = Math.min(1.0, this.trauma + amount);
    }

    createBrickShards(x, y, width, height, color, count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 60 + Math.random() * 160;
            this.particles.push({
                x: x + Math.random() * width,
                y: y + Math.random() * height,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 50, // slight upward pop
                size: Math.random() * 4 + 2,
                color: color,
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 8,
                life: 1.0,
                maxLife: 0.5 + Math.random() * 0.4,
                gravity: 380,
                isShard: true
            });
        }
    }

    createExplosion(x, y, radius = 50, color = '#f97316') {
        this.addScreenShake(0.5);

        // Shockwave ring
        this.rings.push({
            x,
            y,
            radius: 5,
            maxRadius: radius * 1.5,
            color,
            lineWidth: 4,
            life: 1.0,
            duration: 0.35
        });

        // High velocity sparks
        for (let i = 0; i < 28; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 220;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.4 ? color : '#fbbf24',
                life: 1.0,
                maxLife: 0.4 + Math.random() * 0.3,
                gravity: 100,
                isGlow: true
            });
        }
    }

    createSparks(x, y, color = '#38bdf8', count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 40 + Math.random() * 100;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2.5 + 1.5,
                color,
                life: 1.0,
                maxLife: 0.25 + Math.random() * 0.2,
                gravity: 0,
                isGlow: true
            });
        }
    }

    createPortalRipple(x, y, color = '#a855f7') {
        for (let i = 0; i < 2; i++) {
            this.rings.push({
                x,
                y,
                radius: 4,
                maxRadius: 36 + i * 14,
                color,
                lineWidth: 3,
                life: 1.0,
                duration: 0.35 + i * 0.1
            });
        }
    }

    createFloatingText(text, x, y, color = '#facc15', size = 16) {
        this.floatingTexts.push({
            text,
            x,
            y,
            vy: -45,
            color,
            size,
            alpha: 1.0,
            life: 1.0,
            duration: 0.85
        });
    }

    update(dt) {
        // Screen Shake calculation
        if (this.trauma > 0) {
            const shake = this.trauma * this.trauma * 14;
            this.shakeX = (Math.random() * 2 - 1) * shake;
            this.shakeY = (Math.random() * 2 - 1) * shake;
            this.trauma = Math.max(0, this.trauma - dt * 2.2);
        } else {
            this.shakeX = 0;
            this.shakeY = 0;
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.gravity) p.vy += p.gravity * dt;
            if (p.isShard) p.rotation += p.vRot * dt;

            p.life -= (1 / p.maxLife) * dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update rings
        for (let i = this.rings.length - 1; i >= 0; i--) {
            const r = this.rings[i];
            r.life -= (1 / r.duration) * dt;
            r.radius += (r.maxRadius / r.duration) * dt;
            if (r.life <= 0) {
                this.rings.splice(i, 1);
            }
        }

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy * dt;
            ft.life -= (1 / ft.duration) * dt;
            ft.alpha = Math.max(0, ft.life);
            if (ft.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    render(ctx) {
        // Render shockwave rings
        ctx.save();
        for (let i = 0; i < this.rings.length; i++) {
            const r = this.rings[i];
            ctx.strokeStyle = r.color;
            ctx.globalAlpha = Math.max(0, r.life);
            ctx.lineWidth = r.lineWidth * r.life;
            ctx.beginPath();
            ctx.arc(r.x, r.y, Math.max(1, r.radius), 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();

        // Render particles
        ctx.save();
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;

            if (p.isGlow) {
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 6;
            }

            if (p.isShard) {
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        ctx.restore();

        // Render floating text popups
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < this.floatingTexts.length; i++) {
            const ft = this.floatingTexts[i];
            ctx.font = `bold ${ft.size}px "Segoe UI", system-ui, sans-serif`;
            ctx.fillStyle = ft.color;
            ctx.globalAlpha = ft.alpha;
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 4;
            ctx.fillText(ft.text, ft.x, ft.y);
        }
        ctx.restore();
    }
}
