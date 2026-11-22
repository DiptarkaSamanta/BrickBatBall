/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Ball Entity & Multi-Ball Management
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, PHYSICS } from './config.js';
import { Physics } from './physics.js';

export class Ball {
    constructor(x, y, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = PHYSICS.BALL_RADIUS;

        this.isStuck = true;
        this.stuckOffset = 0; // relative to paddle center

        this.isFireball = false;
        this.fireballTimer = 0;

        this.trail = [];
        this.maxTrail = 10;
        this.portalCooldown = 0; // seconds before can portal again
    }

    launch(angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.3, speed = PHYSICS.BALL_BASE_SPEED) {
        this.isStuck = false;
        this.vx = speed * Math.sin(angle);
        this.vy = -speed * Math.cos(angle);
        Physics.preventInfiniteLoops(this);
    }

    setFireball(duration = 12) {
        this.isFireball = true;
        this.fireballTimer = duration;
    }

    update(dt, paddle) {
        if (this.portalCooldown > 0) {
            this.portalCooldown = Math.max(0, this.portalCooldown - dt);
        }

        if (this.isFireball) {
            this.fireballTimer -= dt;
            if (this.fireballTimer <= 0) {
                this.isFireball = false;
            }
        }

        if (this.isStuck) {
            this.x = paddle.x + paddle.width / 2 + this.stuckOffset;
            this.y = paddle.y - this.radius - 1;
            this.trail = [];
            return;
        }

        // Trail recording
        this.trail.unshift({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) {
            this.trail.pop();
        }

        // Anti-tunneling sub-stepping
        const steps = PHYSICS.SUB_STEPS;
        const subDt = dt / steps;

        for (let s = 0; s < steps; s++) {
            this.x += this.vx * subDt;
            this.y += this.vy * subDt;

            // Wall collisions inside sub-steps
            Physics.resolveWallCollision(this);
        }

        Physics.preventInfiniteLoops(this);
    }

    isOutOfBounds() {
        return this.y > CANVAS_HEIGHT + 25;
    }

    render(ctx) {
        // Draw trailing comet tail
        if (this.trail.length > 1) {
            ctx.save();
            for (let i = 0; i < this.trail.length; i++) {
                const pt = this.trail[i];
                const alpha = (1 - i / this.trail.length) * (this.isFireball ? 0.7 : 0.45);
                const r = this.radius * (1 - (i / this.trail.length) * 0.5);

                ctx.fillStyle = this.isFireball ? `rgba(239, 68, 68, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, Math.max(1, r), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Draw Ball Core
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        if (this.isFireball) {
            // Fiery radial gradient
            const grad = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.radius);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.4, '#fbbf24');
            grad.addColorStop(0.8, '#ef4444');
            grad.addColorStop(1, '#b91c1c');
            ctx.fillStyle = grad;
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 12;
        } else {
            // Quantum Plasma radial gradient
            const grad = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.radius);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.4, '#38bdf8');
            grad.addColorStop(0.9, '#0284c7');
            grad.addColorStop(1, '#0369a1');
            ctx.fillStyle = grad;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
        }

        ctx.fill();
        ctx.restore();
    }
}
