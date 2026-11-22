/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Physics Engine: Anti-Tunneling, Swept AABB & Angle Calculations
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, PHYSICS } from './config.js';

export class Physics {
    /**
     * Resolves circle vs AABB (Rectangle) collision
     * Returns null if no collision, or { normalX, normalY, penetration, overlapX, overlapY }
     */
    static checkCircleRect(cx, cy, radius, rx, ry, rw, rh) {
        // Find closest point on rectangle to circle center
        const closestX = Math.max(rx, Math.min(cx, rx + rw));
        const closestY = Math.max(ry, Math.min(cy, ry + rh));

        const dx = cx - closestX;
        const dy = cy - closestY;
        const distSq = dx * dx + dy * dy;

        if (distSq > radius * radius) {
            return null;
        }

        const dist = Math.sqrt(distSq);

        // If circle center is inside rect or exactly on border
        if (dist === 0) {
            // Find minimal distance to edge
            const leftDist = cx - rx;
            const rightDist = (rx + rw) - cx;
            const topDist = cy - ry;
            const bottomDist = (ry + rh) - cy;
            const minEdge = Math.min(leftDist, rightDist, topDist, bottomDist);

            if (minEdge === leftDist) return { normalX: -1, normalY: 0, penetration: radius + leftDist };
            if (minEdge === rightDist) return { normalX: 1, normalY: 0, penetration: radius + rightDist };
            if (minEdge === topDist) return { normalX: 0, normalY: -1, penetration: radius + topDist };
            return { normalX: 0, normalY: 1, penetration: radius + bottomDist };
        }

        // Determine dominant normal direction
        let nx = dx / dist;
        let ny = dy / dist;

        // Snap to cardinal normal for sharp arcade brick reflections
        if (Math.abs(nx) > Math.abs(ny)) {
            nx = Math.sign(nx);
            ny = 0;
        } else {
            nx = 0;
            ny = Math.sign(ny);
        }

        return {
            normalX: nx,
            normalY: ny,
            penetration: radius - dist
        };
    }

    /**
     * Paddle collision resolution with angular deflection
     */
    static resolvePaddleCollision(ball, paddle) {
        // Only collide if ball is moving downward
        if (ball.vy <= 0) return false;

        const col = this.checkCircleRect(ball.x, ball.y, ball.radius, paddle.x, paddle.y, paddle.width, paddle.height);
        if (!col) return false;

        // Reposition ball above paddle
        ball.y = paddle.y - ball.radius - 1;

        // Normalized offset from center: -1.0 (left edge) to +1.0 (right edge)
        const paddleCenter = paddle.x + paddle.width / 2;
        let offset = (ball.x - paddleCenter) / (paddle.width / 2);
        offset = Math.max(-0.95, Math.min(0.95, offset));

        // Calculate bounce angle: -65 degrees (far left) to +65 degrees (far right)
        const maxAngle = (65 * Math.PI) / 180;
        const angle = offset * maxAngle;

        // Current speed with slight acceleration
        let speed = Math.hypot(ball.vx, ball.vy);
        speed = Math.min(PHYSICS.BALL_MAX_SPEED, Math.max(PHYSICS.BALL_MIN_SPEED, speed * 1.015));

        // Set new velocities
        ball.vx = speed * Math.sin(angle);
        ball.vy = -speed * Math.cos(angle);

        return { offset, speed };
    }

    /**
     * Ball vs Wall bounds resolution
     */
    static resolveWallCollision(ball) {
        let collided = false;

        // Left wall
        if (ball.x - ball.radius <= 0) {
            ball.x = ball.radius;
            ball.vx = Math.abs(ball.vx);
            collided = true;
        }
        // Right wall
        else if (ball.x + ball.radius >= CANVAS_WIDTH) {
            ball.x = CANVAS_WIDTH - ball.radius;
            ball.vx = -Math.abs(ball.vx);
            collided = true;
        }

        // Ceiling
        if (ball.y - ball.radius <= 0) {
            ball.y = ball.radius;
            ball.vy = Math.abs(ball.vy);
            collided = true;
        }

        return collided;
    }

    /**
     * Prevents ball from getting stuck in horizontal or vertical loops
     */
    static preventInfiniteLoops(ball) {
        // If vertical velocity is too flat, push it diagonally
        if (Math.abs(ball.vy) < 55) {
            ball.vy = (ball.vy >= 0 ? 1 : -1) * 75;
        }

        // If horizontal velocity is too flat, add gentle horizontal deflection
        if (Math.abs(ball.vx) < 35) {
            ball.vx = (ball.vx >= 0 ? 1 : -1) * 50;
        }

        // Clamp speeds
        const speed = Math.hypot(ball.vx, ball.vy);
        if (speed < PHYSICS.BALL_MIN_SPEED) {
            const factor = PHYSICS.BALL_MIN_SPEED / (speed || 1);
            ball.vx *= factor;
            ball.vy *= factor;
        } else if (speed > PHYSICS.BALL_MAX_SPEED) {
            const factor = PHYSICS.BALL_MAX_SPEED / speed;
            ball.vx *= factor;
            ball.vy *= factor;
        }
    }
}
