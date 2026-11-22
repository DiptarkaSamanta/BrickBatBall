// particles.js - Particle Systems, Floating Text, and Screen Effects for Jardinains & Bricks of Egypt!

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
        this.shakeTime = 0;
        this.shakeIntensity = 0;
    }

    update(dt) {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += (p.gravity !== undefined ? p.gravity : 400) * dt;
            if (p.rotation !== undefined && p.vRot) {
                p.rotation += p.vRot * dt;
            }
            p.life -= dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const t = this.floatingTexts[i];
            t.y += t.vy * dt;
            t.scale = Math.min(1.3, t.scale + dt * 2);
            t.life -= dt;
            if (t.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }

        // Screen shake
        if (this.shakeTime > 0) {
            this.shakeTime -= dt;
            if (this.shakeTime <= 0) {
                this.shakeIntensity = 0;
            }
        }
    }

    draw(ctx) {
        // Draw all particles
        for (const p of this.particles) {
            ctx.save();
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            if (p.rotation) ctx.rotate(p.rotation);

            if (p.type === 'shard') {
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else if (p.type === 'circle') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'smoke') {
                ctx.fillStyle = p.color || 'rgba(100, 100, 100, 0.4)';
                ctx.beginPath();
                ctx.arc(0, 0, p.size * (2 - alpha), 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'spark') {
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-p.size, 0); ctx.lineTo(p.size, 0);
                ctx.moveTo(0, -p.size); ctx.lineTo(0, p.size);
                ctx.stroke();
            } else if (p.type === 'bandage') {
                // Fluttering mummy linen cloth strip
                ctx.fillStyle = '#e2d9c8';
                ctx.fillRect(-p.size, -p.size * 0.3, p.size * 2, p.size * 0.6);
            }
            ctx.restore();
        }

        // Draw floating text
        for (const t of this.floatingTexts) {
            ctx.save();
            const alpha = Math.max(0, Math.min(1, t.life / (t.maxLife * 0.4)));
            ctx.globalAlpha = alpha;
            ctx.font = `bold ${Math.round(t.fontSize * t.scale)}px "Segoe UI", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Glow / Stroke
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3.5;
            ctx.strokeText(t.text, t.x, t.y);

            ctx.fillStyle = t.color;
            ctx.fillText(t.text, t.x, t.y);
            ctx.restore();
        }
    }

    addBrickShards(x, y, width, height, color, count = 12, isEgypt = false) {
        for (let i = 0; i < count; i++) {
            const px = x + Math.random() * width;
            const py = y + Math.random() * height;
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 250;
            this.particles.push({
                type: 'shard',
                x: px,
                y: py,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 80,
                gravity: isEgypt ? 380 : 500,
                size: 3 + Math.random() * 4,
                rotation: Math.random() * Math.PI,
                vRot: (Math.random() - 0.5) * 12,
                color: color || (isEgypt ? '#d97706' : '#3b82f6'),
                life: 0.5 + Math.random() * 0.35,
                maxLife: 0.85
            });
        }
    }

    addFlowerpotShatter(x, y, count = 14, isCanopic = false) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 200;
            const isClay = i < count * 0.6;
            this.particles.push({
                type: isClay ? 'shard' : 'circle',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 120,
                gravity: 450,
                size: isClay ? (3 + Math.random() * 4) : (2 + Math.random() * 3),
                rotation: Math.random() * Math.PI,
                vRot: (Math.random() - 0.5) * 10,
                color: isCanopic 
                    ? (isClay ? '#b45309' : (Math.random() > 0.5 ? '#facc15' : '#1e3a8a')) 
                    : (isClay ? '#c2542d' : (Math.random() > 0.5 ? '#22c55e' : '#eab308')),
                life: 0.6 + Math.random() * 0.4,
                maxLife: 1.0
            });
        }
    }

    addMummyBandages(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 140;
            this.particles.push({
                type: 'bandage',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 100,
                gravity: 180,
                size: 6 + Math.random() * 8,
                rotation: Math.random() * Math.PI,
                vRot: (Math.random() - 0.5) * 6,
                life: 0.8 + Math.random() * 0.4,
                maxLife: 1.2
            });
        }
    }

    addExplosion(x, y, radius = 50) {
        this.triggerShake(0.35, 8);
        for (let i = 0; i < 28; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 40 + Math.random() * 220;
            const isFire = i < 18;
            this.particles.push({
                type: isFire ? 'circle' : 'smoke',
                x: x + (Math.random() - 0.5) * 15,
                y: y + (Math.random() - 0.5) * 15,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 50,
                gravity: 120,
                size: isFire ? (4 + Math.random() * 6) : (10 + Math.random() * 14),
                color: isFire ? (Math.random() > 0.4 ? '#f59e0b' : '#ef4444') : 'rgba(80, 80, 80, 0.5)',
                life: 0.4 + Math.random() * 0.4,
                maxLife: 0.8
            });
        }
    }

    addPowerupSparks(x, y, color = '#38bdf8') {
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const speed = 70 + Math.random() * 90;
            this.particles.push({
                type: 'spark',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 80,
                size: 3 + Math.random() * 3,
                color: color,
                life: 0.45,
                maxLife: 0.45
            });
        }
    }

    addFloatingText(text, x, y, color = '#facc15', fontSize = 16) {
        this.floatingTexts.push({
            text: text,
            x: x,
            y: y,
            vy: -75,
            scale: 0.8,
            color: color,
            fontSize: fontSize,
            life: 1.2,
            maxLife: 1.2
        });
    }

    triggerShake(duration = 0.2, intensity = 5) {
        this.shakeTime = duration;
        this.shakeIntensity = intensity;
    }

    getShakeOffset() {
        if (this.shakeTime <= 0) return { x: 0, y: 0 };
        return {
            x: (Math.random() - 0.5) * 2 * this.shakeIntensity,
            y: (Math.random() - 0.5) * 2 * this.shakeIntensity
        };
    }

    clear() {
        this.particles = [];
        this.floatingTexts = [];
        this.shakeTime = 0;
        this.shakeIntensity = 0;
    }
}

window.ParticleSystem = ParticleSystem;
