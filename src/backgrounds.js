/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Procedural Dynamic Canvas Backgrounds for All 6 Worlds
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, WORLDS } from './config.js';

export class BackgroundRenderer {
    constructor() {
        this.particles = [];
        this.maxParticles = 55;
        this.currentWorldIdx = 0;
        this.time = 0;

        // Stars / Nebulae precalculated
        this.stars = [];
        for (let i = 0; i < 70; i++) {
            this.stars.push({
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.3 + 0.1,
                layer: Math.floor(Math.random() * 3) + 1
            });
        }

        this.initParticles();
    }

    setWorld(worldIdx) {
        this.currentWorldIdx = worldIdx;
        this.initParticles();
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle(true));
        }
    }

    createParticle(randomY = false) {
        const world = WORLDS[this.currentWorldIdx] || WORLDS[0];
        const effect = world.ambientEffect;

        let vx = (Math.random() - 0.5) * 20;
        let vy = 20 + Math.random() * 30;
        let size = Math.random() * 3 + 1.5;
        let color = world.accentColor;
        let life = 1;
        let maxLife = 3 + Math.random() * 3;

        if (effect === 'ember') {
            vy = -(30 + Math.random() * 40); // rising embers
            vx = (Math.random() - 0.5) * 30;
            color = Math.random() > 0.5 ? '#f59e0b' : '#ef4444';
            size = Math.random() * 3 + 1;
        } else if (effect === 'spore') {
            vy = (Math.random() - 0.5) * 25;
            vx = (Math.random() - 0.5) * 25;
            color = Math.random() > 0.5 ? '#10b981' : '#6ee7b7';
            size = Math.random() * 4 + 1.5;
        } else if (effect === 'snow') {
            vy = 40 + Math.random() * 50;
            vx = (Math.random() - 0.5) * 20 + 10;
            color = '#e0f2fe';
            size = Math.random() * 2.5 + 1;
        } else if (effect === 'spark') {
            vy = -(50 + Math.random() * 60);
            vx = (Math.random() - 0.5) * 40;
            color = Math.random() > 0.5 ? '#f97316' : '#38bdf8';
            size = Math.random() * 2 + 1;
        } else if (effect === 'star') {
            vy = (Math.random() - 0.5) * 15;
            vx = (Math.random() - 0.5) * 15;
            color = Math.random() > 0.5 ? '#c084fc' : '#38bdf8';
            size = Math.random() * 3 + 1;
        } else if (effect === 'rift') {
            vy = (Math.random() - 0.5) * 40;
            vx = (Math.random() - 0.5) * 40;
            color = Math.random() > 0.5 ? '#ec4899' : '#fbbf24';
            size = Math.random() * 4 + 1.5;
        }

        return {
            x: Math.random() * CANVAS_WIDTH,
            y: randomY ? Math.random() * CANVAS_HEIGHT : (vy < 0 ? CANVAS_HEIGHT + 10 : -10),
            vx,
            vy,
            size,
            color,
            life,
            maxLife,
            decay: 1 / maxLife
        };
    }

    update(dt) {
        this.time += dt;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= p.decay * dt;

            if (p.life <= 0 || p.x < -20 || p.x > CANVAS_WIDTH + 20 || p.y < -20 || p.y > CANVAS_HEIGHT + 20) {
                this.particles[i] = this.createParticle(false);
            }
        }
    }

    render(ctx) {
        const world = WORLDS[this.currentWorldIdx] || WORLDS[0];

        // 1. Base Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        bgGrad.addColorStop(0, world.bgColor);
        bgGrad.addColorStop(1, '#050308');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 2. World-Specific Scenery Rendering
        ctx.save();
        switch (this.currentWorldIdx) {
            case 0: // Lost Egypt
                this.renderEgypt(ctx);
                break;
            case 1: // Mystic Forest
                this.renderForest(ctx);
                break;
            case 2: // Frozen Kingdom
                this.renderFrozen(ctx);
                break;
            case 3: // Machine City
                this.renderMachine(ctx);
                break;
            case 4: // Cosmic Void
                this.renderVoid(ctx);
                break;
            case 5: // Final Dimension
                this.renderFinal(ctx);
                break;
        }
        ctx.restore();

        // 3. Ambient Drifting Particles
        this.renderParticles(ctx);
    }

    renderEgypt(ctx) {
        // Glowing sun disc
        const sunGrad = ctx.createRadialGradient(400, 150, 20, 400, 150, 120);
        sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
        sunGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(400, 150, 120, 0, Math.PI * 2);
        ctx.fill();

        // Sun ring
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(400, 150, 45, 0, Math.PI * 2);
        ctx.stroke();

        // Pyramids silhouette in distance
        ctx.fillStyle = 'rgba(25, 15, 5, 0.6)';
        // Great pyramid
        ctx.beginPath();
        ctx.moveTo(150, 480);
        ctx.lineTo(320, 260);
        ctx.lineTo(490, 480);
        ctx.closePath();
        ctx.fill();

        // Side pyramid
        ctx.fillStyle = 'rgba(35, 20, 8, 0.5)';
        ctx.beginPath();
        ctx.moveTo(430, 490);
        ctx.lineTo(570, 310);
        ctx.lineTo(710, 490);
        ctx.closePath();
        ctx.fill();

        // Horizon dunes
        ctx.fillStyle = 'rgba(45, 26, 10, 0.7)';
        ctx.beginPath();
        ctx.moveTo(0, 520);
        ctx.quadraticCurveTo(200, 490, 400, 530);
        ctx.quadraticCurveTo(600, 570, 800, 510);
        ctx.lineTo(800, 600);
        ctx.lineTo(0, 600);
        ctx.closePath();
        ctx.fill();
    }

    renderForest(ctx) {
        // Mystic tree silhouettes & glowing canopy
        const canopyGrad = ctx.createRadialGradient(250, 180, 50, 250, 180, 220);
        canopyGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
        canopyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = canopyGrad;
        ctx.beginPath();
        ctx.arc(250, 180, 220, 0, Math.PI * 2);
        ctx.fill();

        // Ancient roots / tree trunks
        ctx.fillStyle = 'rgba(5, 30, 20, 0.7)';
        ctx.beginPath();
        ctx.moveTo(0, 600);
        ctx.lineTo(60, 250);
        ctx.quadraticCurveTo(120, 200, 160, 120);
        ctx.lineTo(190, 120);
        ctx.quadraticCurveTo(140, 220, 110, 600);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(800, 600);
        ctx.lineTo(740, 220);
        ctx.quadraticCurveTo(680, 180, 650, 100);
        ctx.lineTo(620, 100);
        ctx.quadraticCurveTo(660, 200, 690, 600);
        ctx.closePath();
        ctx.fill();

        // Glowing rune rings
        const pulse = (Math.sin(this.time * 2) + 1) * 0.5;
        ctx.strokeStyle = `rgba(52, 211, 153, ${0.15 + pulse * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(400, 220, 90, 0, Math.PI * 2);
        ctx.stroke();
    }

    renderFrozen(ctx) {
        // Aurora Borealis curtains
        const aurora = (Math.sin(this.time * 1.5) + 1) * 0.5;
        const auroraGrad = ctx.createLinearGradient(0, 50, 800, 280);
        auroraGrad.addColorStop(0, `rgba(6, 182, 212, ${0.15 + aurora * 0.15})`);
        auroraGrad.addColorStop(0.5, `rgba(167, 139, 250, ${0.2 + aurora * 0.1})`);
        auroraGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = auroraGrad;

        ctx.beginPath();
        ctx.moveTo(0, 100);
        ctx.bezierCurveTo(200, 60 + Math.sin(this.time) * 30, 500, 180 + Math.cos(this.time) * 30, 800, 120);
        ctx.lineTo(800, 320);
        ctx.bezierCurveTo(500, 360, 200, 240, 0, 300);
        ctx.closePath();
        ctx.fill();

        // Glacial spires silhouette
        ctx.fillStyle = 'rgba(8, 30, 50, 0.65)';
        ctx.beginPath();
        ctx.moveTo(50, 560);
        ctx.lineTo(130, 340);
        ctx.lineTo(210, 560);
        ctx.lineTo(310, 300);
        ctx.lineTo(410, 560);
        ctx.lineTo(530, 320);
        ctx.lineTo(650, 560);
        ctx.lineTo(750, 370);
        ctx.lineTo(820, 560);
        ctx.lineTo(800, 600);
        ctx.lineTo(0, 600);
        ctx.closePath();
        ctx.fill();
    }

    renderMachine(ctx) {
        // Cyber grid on bottom
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.15)';
        ctx.lineWidth = 1;

        // Perspective grid lines
        for (let x = -200; x <= 1000; x += 60) {
            ctx.beginPath();
            ctx.moveTo(400, 280);
            ctx.lineTo(x, 600);
            ctx.stroke();
        }
        for (let y = 300; y <= 600; y += 35) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(800, y);
            ctx.stroke();
        }

        // Circuit board traces
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 50);
        ctx.lineTo(180, 50);
        ctx.lineTo(220, 90);
        ctx.lineTo(320, 90);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(720, 60);
        ctx.lineTo(640, 60);
        ctx.lineTo(590, 110);
        ctx.lineTo(480, 110);
        ctx.stroke();
    }

    renderVoid(ctx) {
        // Parallax twinkling stars
        for (let i = 0; i < this.stars.length; i++) {
            const s = this.stars[i];
            const twinkle = Math.sin(this.time * 3 + i) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * twinkle})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Swirling Singularity Vortex
        const vortexGrad = ctx.createRadialGradient(400, 240, 15, 400, 240, 180);
        vortexGrad.addColorStop(0, '#000000');
        vortexGrad.addColorStop(0.2, 'rgba(168, 85, 247, 0.4)');
        vortexGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.15)');
        vortexGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = vortexGrad;
        ctx.beginPath();
        ctx.arc(400, 240, 180, 0, Math.PI * 2);
        ctx.fill();

        // Accretion disk ring
        ctx.save();
        ctx.translate(400, 240);
        ctx.rotate(this.time * 0.3);
        ctx.scale(1, 0.45);
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    renderFinal(ctx) {
        // Reality fractures / kaleidoscopic geometric grid
        const rot = this.time * 0.15;
        ctx.save();
        ctx.translate(400, 260);
        ctx.rotate(rot);

        ctx.strokeStyle = 'rgba(236, 72, 153, 0.18)';
        ctx.lineWidth = 1.5;
        for (let r = 40; r <= 240; r += 40) {
            ctx.beginPath();
            for (let a = 0; a < 6; a++) {
                const angle = (a * Math.PI) / 3;
                const px = Math.cos(angle) * r;
                const py = Math.sin(angle) * r;
                if (a === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();

        // Temporal chrono clock rings
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(400, 260, 110, 0, Math.PI * 2);
        ctx.stroke();

        // Pulsing core
        const pulse = (Math.sin(this.time * 4) + 1) * 0.5;
        const coreGrad = ctx.createRadialGradient(400, 260, 5, 400, 260, 60);
        coreGrad.addColorStop(0, `rgba(251, 191, 36, ${0.4 + pulse * 0.3})`);
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(400, 260, 60, 0, Math.PI * 2);
        ctx.fill();
    }

    renderParticles(ctx) {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}
