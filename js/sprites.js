// sprites.js - Procedural Vector & Sprite Rendering for Jardinains & Bricks of Egypt!
// Renders both authentic games: Garden arcade characters + Bricks of Egypt stone bats, hieroglyphs, falling jewels & scarabs.

const Sprites = {
    // --- Draw Gnome (Jardinains Characters) ---
    drawGnome(ctx, x, y, width, height, state = {}) {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);

        if (state.rotation) {
            ctx.rotate(state.rotation);
        }

        const scale = (height / 36);
        ctx.scale(scale, scale);

        if (state.frozen) {
            ctx.fillStyle = 'rgba(150, 230, 255, 0.45)';
            ctx.strokeStyle = '#bbf2ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-16, -22, 32, 42, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#e0f9ff';
            ctx.beginPath();
            ctx.moveTo(-12, -22); ctx.lineTo(-8, -14); ctx.lineTo(-4, -22);
            ctx.moveTo(0, -22); ctx.lineTo(4, -13); ctx.lineTo(8, -22);
            ctx.fill();
        }

        const type = state.type || 'normal';

        if (type === 'mummy') {
            this.drawMummyGnome(ctx, state);
            ctx.restore();
            return;
        }

        if (type === 'pharaoh' || type === 'king') {
            this.drawPharaohGnome(ctx, state);
            ctx.restore();
            return;
        }

        if (type === 'anubis') {
            this.drawAnubisGnome(ctx, state);
            ctx.restore();
            return;
        }

        // Classic Garden Gnomes
        let hatColor = '#e62222';
        let coatColor = '#1f6feb';

        if (type === 'grumpy') {
            hatColor = '#2ea043';
            coatColor = '#8b5a2b';
        } else if (type === 'speedy') {
            hatColor = '#f1e05a';
            coatColor = '#ff7b72';
        }

        ctx.fillStyle = '#3d2314';
        ctx.beginPath();
        if (state.falling) {
            ctx.ellipse(-9, 14, 5, 3.5, -0.4, 0, Math.PI * 2);
            ctx.ellipse(9, 14, 5, 3.5, 0.4, 0, Math.PI * 2);
        } else {
            ctx.ellipse(-6, 15, 5, 3, 0, 0, Math.PI * 2);
            ctx.ellipse(6, 15, 5, 3, 0, 0, Math.PI * 2);
        }
        ctx.fill();

        ctx.fillStyle = coatColor;
        ctx.beginPath();
        ctx.moveTo(-11, 4); ctx.lineTo(11, 4);
        ctx.lineTo(13, 14); ctx.lineTo(-13, 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1b1b1b';
        ctx.fillRect(-12, 10, 24, 3);
        ctx.fillStyle = '#ffcf33';
        ctx.fillRect(-3, 9.5, 6, 4);
        ctx.fillStyle = '#1b1b1b';
        ctx.fillRect(-1.5, 10.5, 3, 2);

        ctx.fillStyle = coatColor;
        if (state.falling) {
            ctx.beginPath();
            ctx.arc(-13, 0, 4, 0, Math.PI * 2);
            ctx.arc(13, 0, 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (state.throwing) {
            ctx.beginPath();
            ctx.arc(-11, 6, 3.5, 0, Math.PI * 2);
            ctx.arc(12, -2, 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(-11, 7, 3.5, 0, Math.PI * 2);
            ctx.arc(11, 7, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#f7c29e';
        if (state.falling) {
            ctx.beginPath();
            ctx.arc(-14, -3, 3, 0, Math.PI * 2);
            ctx.arc(14, -3, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (state.throwing) {
            ctx.beginPath();
            ctx.arc(-12, 8, 2.5, 0, Math.PI * 2);
            ctx.arc(13, -5, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(-12, 9, 2.5, 0, Math.PI * 2);
            ctx.arc(12, 9, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#f0f3f6';
        ctx.beginPath();
        ctx.moveTo(-9, 1);
        ctx.quadraticCurveTo(-11, 9, -5, 13);
        ctx.quadraticCurveTo(0, 16, 5, 13);
        ctx.quadraticCurveTo(11, 9, 9, 1);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f7c29e';
        ctx.beginPath();
        ctx.arc(0, -1, 7.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 90, 90, 0.45)';
        ctx.beginPath();
        ctx.arc(-5.5, 1, 2.2, 0, Math.PI * 2);
        ctx.arc(5.5, 1, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fca88f';
        ctx.beginPath();
        ctx.arc(0, 0.5, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e2886f';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        if (state.falling) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-3.5, -3, 2.5, 0, Math.PI * 2);
            ctx.arc(3.5, -3, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(-3.5, -3, 1.2, 0, Math.PI * 2);
            ctx.arc(3.5, -3, 1.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#220000';
            ctx.beginPath();
            ctx.ellipse(0, 5, 2.5, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (state.laughing) {
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(-3.5, -2, 2, Math.PI, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(3.5, -2, 2, Math.PI, 0);
            ctx.stroke();

            ctx.fillStyle = '#440a0a';
            ctx.beginPath();
            ctx.arc(0, 4, 3, 0, Math.PI);
            ctx.fill();
            ctx.fillStyle = '#ff6b8b';
            ctx.beginPath();
            ctx.arc(1, 6, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(-3.5, -2.5, 1.3, 0, Math.PI * 2);
            ctx.arc(3.5, -2.5, 1.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#442222';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 2.5, 2.5, 0.2, Math.PI - 0.2);
            ctx.stroke();
        }

        ctx.fillStyle = hatColor;
        ctx.beginPath();
        ctx.moveTo(-9, -3.5);
        const tipX = state.falling ? 6 : 4;
        const tipY = -23;
        ctx.quadraticCurveTo(-2, -14, tipX, tipY);
        ctx.quadraticCurveTo(3, -12, 9, -3.5);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-9.5, -3.5);
        ctx.quadraticCurveTo(0, -2, 9.5, -3.5);
        ctx.stroke();

        ctx.restore();
    },

    drawPharaohGnome(ctx, state) {
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(-14, 12);
        ctx.lineTo(-12, -4);
        ctx.quadraticCurveTo(-10, -18, 0, -20);
        ctx.quadraticCurveTo(10, -18, 12, -4);
        ctx.lineTo(14, 12);
        ctx.lineTo(9, 10);
        ctx.lineTo(7, -2);
        ctx.lineTo(-7, -2);
        ctx.lineTo(-9, 10);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-11, -12); ctx.lineTo(11, -12);
        ctx.moveTo(-12, -6);  ctx.lineTo(12, -6);
        ctx.moveTo(-13, 0);   ctx.lineTo(13, 0);
        ctx.moveTo(-13, 6);   ctx.lineTo(-9, 6);
        ctx.moveTo(9, 6);     ctx.lineTo(13, 6);
        ctx.stroke();

        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(0, -16, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-10, 4, 20, 10);

        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(0, 4, 9, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(0, 4, 6, 0, Math.PI);
        ctx.fill();

        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(0, -1, 7.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(-2, 4); ctx.lineTo(2, 4);
        ctx.lineTo(3, 14); ctx.lineTo(0, 16); ctx.lineTo(-1, 14);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-6, -2); ctx.lineTo(-2, -2); ctx.lineTo(-7, -4);
        ctx.moveTo(2, -2); ctx.lineTo(6, -2); ctx.lineTo(7, -4);
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-4, -2.5, 1.2, 0, Math.PI * 2);
        ctx.arc(4, -2.5, 1.2, 0, Math.PI * 2);
        ctx.fill();
    },

    drawMummyGnome(ctx, state) {
        ctx.fillStyle = '#e2d9c8';
        ctx.beginPath();
        ctx.roundRect(-10, 3, 20, 12, 4);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, -3, 8.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-8, -8); ctx.lineTo(7, -5);
        ctx.moveTo(-8, -1); ctx.lineTo(8, -2);
        ctx.moveTo(-7, 3);  ctx.lineTo(7, 2);
        ctx.moveTo(-10, 7); ctx.lineTo(10, 6);
        ctx.moveTo(-9, 11); ctx.lineTo(9, 10);
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.fillRect(-6, -4, 12, 3.5);

        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(-3.5, -2.5, 1.8, 0, Math.PI * 2);
        ctx.arc(3.5, -2.5, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#d6cbba';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(9, 12);
        ctx.quadraticCurveTo(15, 15, 17, 22);
        ctx.stroke();
    },

    drawAnubisGnome(ctx, state) {
        ctx.fillStyle = '#171717';
        ctx.beginPath();
        ctx.arc(0, -2, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-8, -5); ctx.lineTo(-12, -22); ctx.lineTo(-2, -9);
        ctx.moveTo(8, -5);  ctx.lineTo(12, -22);  ctx.lineTo(2, -9);
        ctx.fill();

        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(-7, -7); ctx.lineTo(-10, -18); ctx.lineTo(-4, -9);
        ctx.moveTo(7, -7);  ctx.lineTo(10, -18);  ctx.lineTo(4, -9);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.ellipse(-4, -3, 2.5, 1.2, -0.2, 0, Math.PI * 2);
        ctx.ellipse(4, -3, 2.5, 1.2, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(0, 4, 10, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#171717';
        ctx.fillRect(-9, 5, 18, 9);
    },

    // --- Draw Bricks of Egypt Falling Treasures (Scarabs, Jewels, Water Drops) ---
    drawTreasure(ctx, item) {
        const { x, y, width, height, treasureType } = item;
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);

        // Water Drop (Puts out fire bricks!)
        if (treasureType === 'water') {
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#0284c7';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(0, -9);
            ctx.quadraticCurveTo(8, 0, 6, 6);
            ctx.arc(0, 6, 6, 0, Math.PI);
            ctx.quadraticCurveTo(-8, 0, 0, -9);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Highlight
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-2, 4, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return;
        }

        // Gold Scarab Coin
        if (treasureType === 'gold_scarab') {
            ctx.fillStyle = '#fbbf24';
            ctx.shadowColor = '#d97706';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Inner Scarab beetle
            ctx.fillStyle = '#059669';
            ctx.beginPath();
            ctx.ellipse(0, 0, 4, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return;
        }

        // Silver Scarab Coin
        if (treasureType === 'silver_scarab') {
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.arc(0, 0, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.ellipse(0, 0, 3.5, 5.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return;
        }

        // Faceted Gemstones (Diamond, Ruby, Emerald, Sapphire)
        let gemColor = '#ef4444'; // Ruby default
        let edgeColor = '#991b1b';

        if (treasureType === 'diamond') { gemColor = '#38bdf8'; edgeColor = '#0284c7'; }
        else if (treasureType === 'emerald') { gemColor = '#10b981'; edgeColor = '#047857'; }
        else if (treasureType === 'sapphire') { gemColor = '#3b82f6'; edgeColor = '#1d4ed8'; }

        ctx.fillStyle = gemColor;
        ctx.shadowColor = gemColor;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(8, -3);
        ctx.lineTo(6, 8);
        ctx.lineTo(-6, 8);
        ctx.lineTo(-8, -3);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Facet reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.beginPath();
        ctx.moveTo(0, -9); ctx.lineTo(4, -3); ctx.lineTo(-4, -3);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    },

    // --- Draw Projectile: Pot, Rock, Canopic Jar, or Scarab ---
    drawFlowerpot(ctx, x, y, size = 18, angle = 0, type = 'pot') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        if (type === 'canopic' || type === 'urn') {
            const s = size / 20;
            ctx.scale(s, s);

            const jarGrad = ctx.createLinearGradient(-8, -6, 8, 8);
            jarGrad.addColorStop(0, '#d97706');
            jarGrad.addColorStop(1, '#92400e');
            ctx.fillStyle = jarGrad;
            ctx.beginPath();
            ctx.moveTo(-6, -6);
            ctx.quadraticCurveTo(-11, 0, -8, 8);
            ctx.lineTo(8, 8);
            ctx.quadraticCurveTo(11, 0, 6, -6);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = '#171717';
            ctx.beginPath();
            ctx.arc(0, -8, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
            return;
        }

        if (type === 'scarab') {
            ctx.fillStyle = '#059669';
            ctx.beginPath();
            ctx.ellipse(0, 0, 7, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
            return;
        }

        if (type === 'rock') {
            ctx.fillStyle = '#7a7a7a';
            ctx.beginPath();
            ctx.moveTo(-size * 0.4, -size * 0.3);
            ctx.lineTo(size * 0.3, -size * 0.45);
            ctx.lineTo(size * 0.45, size * 0.2);
            ctx.lineTo(-size * 0.1, size * 0.45);
            ctx.lineTo(-size * 0.45, size * 0.1);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            return;
        }

        // Standard Garden Terracotta Pot
        const s = size / 20;
        ctx.scale(s, s);

        const potGrad = ctx.createLinearGradient(-8, -4, 8, 8);
        potGrad.addColorStop(0, '#e06d44');
        potGrad.addColorStop(1, '#a63e19');
        ctx.fillStyle = potGrad;
        ctx.beginPath();
        ctx.moveTo(-8, -4); ctx.lineTo(8, -4);
        ctx.lineTo(6, 8);   ctx.lineTo(-6, 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#34a853';
        ctx.beginPath();
        ctx.ellipse(-3, -8, 4, 2, -0.6, 0, Math.PI * 2);
        ctx.ellipse(3, -8, 4, 2, 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ea4335';
        ctx.beginPath();
        ctx.arc(0, -9.5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // --- Draw Bricks (Garden, Hieroglyph, Fire, Urn, Granite) ---
    drawBrick(ctx, brick) {
        const { x, y, width, height, type, durability, maxDurability, color, glyph, isEgypt } = brick;
        ctx.save();

        // 1. Indestructible Ingot or Obelisk
        if (type === 'indestructible') {
            if (isEgypt || brick.isObelisk) {
                const grad = ctx.createLinearGradient(x, y, x + width, y + height);
                grad.addColorStop(0, '#27272a');
                grad.addColorStop(0.5, '#18181b');
                grad.addColorStop(1, '#09090b');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(x, y, width, height, 3);
                ctx.fill();

                ctx.strokeStyle = '#eab308';
                ctx.lineWidth = 1.2;
                ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);

                ctx.fillStyle = '#facc15';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('☥', x + width / 2, y + height / 2 + 1);
            } else {
                const grad = ctx.createLinearGradient(x, y, x + width, y + height);
                grad.addColorStop(0, '#f5f7fa');
                grad.addColorStop(0.3, '#c3cfe2');
                grad.addColorStop(0.7, '#8f9ba8');
                grad.addColorStop(1, '#505a66');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(x, y, width, height, 4);
                ctx.fill();

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.roundRect(x + 2, y + 2, width - 4, height - 4, 2);
                ctx.stroke();
            }
            ctx.restore();
            return;
        }

        // 2. Explosive: TNT or Combustible Clay Urn
        if (type === 'explosive') {
            if (isEgypt || brick.isUrn) {
                const grad = ctx.createLinearGradient(x, y, x, y + height);
                grad.addColorStop(0, '#b45309');
                grad.addColorStop(0.5, '#78350f');
                grad.addColorStop(1, '#451a03');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(x, y, width, height, 3);
                ctx.fill();

                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 1.2;
                ctx.strokeRect(x + 1.5, y + 1.5, width - 3, height - 3);

                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🔥 URN', x + width / 2, y + height / 2 + 1);
            } else {
                ctx.fillStyle = '#d92626';
                ctx.beginPath();
                ctx.roundRect(x, y, width, height, 3);
                ctx.fill();

                ctx.strokeStyle = '#222';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(x + 5, y + height); ctx.lineTo(x + 15, y);
                ctx.moveTo(x + 20, y + height); ctx.lineTo(x + 30, y);
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 10px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('TNT', x + width / 2, y + height / 2 + 1);
            }
            ctx.restore();
            return;
        }

        // 3. Fire Brick (Bricks of Egypt)
        if (type === 'fire') {
            const time = performance.now() * 0.005;
            const flicker = Math.sin(time + x) * 0.15;

            const grad = ctx.createLinearGradient(x, y, x, y + height);
            grad.addColorStop(0, '#fde047');
            grad.addColorStop(0.4, '#ea580c');
            grad.addColorStop(1, '#7f1d1d');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, 3);
            ctx.fill();

            // Fire glow
            ctx.fillStyle = `rgba(251, 191, 36, ${0.7 + flicker})`;
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🔥', x + width / 2, y + height / 2);

            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);

            ctx.restore();
            return;
        }

        // 4. Sandstone Hieroglyphic & Stone Bricks
        if (isEgypt || glyph) {
            const sandGrad = ctx.createLinearGradient(x, y, x, y + height);
            const baseColor = color || '#d97706';
            sandGrad.addColorStop(0, this.lightenColor(baseColor, 30));
            sandGrad.addColorStop(0.4, baseColor);
            sandGrad.addColorStop(1, this.darkenColor(baseColor, 40));

            ctx.fillStyle = sandGrad;
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, 3);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);

            const displayGlyph = glyph || (brick.hasPowerup ? '★' : '☥');
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px "Segoe UI Historic", "Noto Sans Egyptian Hieroglyphs", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0,0,0,0.6)';
            ctx.shadowBlur = 3;
            ctx.fillText(displayGlyph, x + width / 2, y + height / 2 + 1);
            ctx.shadowBlur = 0;
        } else {
            // Standard Garden Brick
            const baseColor = color || '#3b82f6';
            const grad = ctx.createLinearGradient(x, y, x, y + height);
            grad.addColorStop(0, this.lightenColor(baseColor, 40));
            grad.addColorStop(0.4, baseColor);
            grad.addColorStop(1, this.darkenColor(baseColor, 35));

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, 3);
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, width - 4, 3, 1);
            ctx.fill();

            ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x + 0.5, y + 0.5, width - 1, height - 1, 3);
            ctx.stroke();

            if (brick.hasPowerup) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('★', x + width / 2, y + height / 2 + 1);
            }
        }

        // Damage cracks
        if (durability < maxDurability) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(x + width * 0.3, y);
            ctx.lineTo(x + width * 0.45, y + height * 0.5);
            ctx.lineTo(x + width * 0.2, y + height);
            if (durability === 1 && maxDurability > 2) {
                ctx.moveTo(x + width * 0.45, y + height * 0.5);
                ctx.lineTo(x + width * 0.8, y + height * 0.7);
            }
            ctx.stroke();
        }

        ctx.restore();
    },

    // --- Draw Paddle (Bricks of Egypt Stone Bat vs Garden Paddle) ---
    drawPaddle(ctx, paddle, isEgypt = false) {
        const { x, y, width, height, isStunned, hasLaser, hasSticky, isWide } = paddle;
        ctx.save();

        if (isEgypt) {
            // Authentic Bricks of Egypt Stone/Gold Winged Bat
            const grad = ctx.createLinearGradient(x, y, x, y + height);
            if (isStunned) {
                grad.addColorStop(0, '#f97316');
                grad.addColorStop(1, '#9a3412');
            } else if (hasLaser) {
                grad.addColorStop(0, '#f59e0b');
                grad.addColorStop(1, '#b45309');
            } else {
                grad.addColorStop(0, '#fef08a');
                grad.addColorStop(0.3, '#eab308');
                grad.addColorStop(0.8, '#ca8a04');
                grad.addColorStop(1, '#854d0e');
            }

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, height / 2);
            ctx.fill();

            // Winged engravings
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1;
            for (let i = 10; i < width - 10; i += 12) {
                ctx.beginPath();
                ctx.moveTo(x + i, y + 2);
                ctx.lineTo(x + i + 4, y + height - 2);
                ctx.stroke();
            }

            // Central Ruby Gem of the Pharaohs!
            const midX = x + width / 2;
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(midX, y + height / 2, height * 0.42, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Wing tips with turquoise gems
            ctx.fillStyle = '#06b6d4';
            ctx.beginPath();
            ctx.arc(x + 7, y + height / 2, 3, 0, Math.PI * 2);
            ctx.arc(x + width - 7, y + height / 2, 3, 0, Math.PI * 2);
            ctx.fill();

            // Harpoon / Laser Cannons
            if (hasLaser) {
                ctx.fillStyle = '#eab308';
                ctx.fillRect(x - 3, y - 8, 6, 10);
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(x - 1.5, y - 11, 3, 3);

                ctx.fillStyle = '#eab308';
                ctx.fillRect(x + width - 3, y - 8, 6, 10);
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(x + width - 1.5, y - 11, 3, 3);
            }
        } else {
            // Classic Jardinains Paddle
            const grad = ctx.createLinearGradient(x, y, x, y + height);
            if (isStunned) {
                grad.addColorStop(0, '#f97316');
                grad.addColorStop(1, '#9a3412');
            } else if (hasLaser) {
                grad.addColorStop(0, '#f43f5e');
                grad.addColorStop(1, '#881337');
            } else if (hasSticky) {
                grad.addColorStop(0, '#10b981');
                grad.addColorStop(1, '#064e3b');
            } else {
                grad.addColorStop(0, '#38bdf8');
                grad.addColorStop(0.5, '#0284c7');
                grad.addColorStop(1, '#0369a1');
            }

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, height / 2);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, width - 4, height - 4, (height - 4) / 2);
            ctx.stroke();

            if (hasSticky) {
                ctx.fillStyle = '#34d399';
                ctx.beginPath();
                ctx.roundRect(x + 10, y + 1, width - 20, 3, 1.5);
                ctx.fill();
            }

            if (hasLaser) {
                ctx.fillStyle = '#e11d48';
                ctx.fillRect(x - 3, y - 6, 6, 8);
                ctx.fillStyle = '#fecdd3';
                ctx.fillRect(x - 1.5, y - 9, 3, 3);

                ctx.fillStyle = '#e11d48';
                ctx.fillRect(x + width - 3, y - 6, 6, 8);
                ctx.fillStyle = '#fecdd3';
                ctx.fillRect(x + width - 1.5, y - 9, 3, 3);
            }
        }

        if (isStunned) {
            const time = performance.now() * 0.01;
            ctx.strokeStyle = isEgypt ? '#fde047' : '#facc15';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const sx = x + (width / 4) * (i + 1) + Math.sin(time + i) * 6;
                const sy = y - 8 + Math.cos(time + i * 2) * 4;
                ctx.beginPath();
                ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        ctx.restore();
    },

    // --- Draw Floating Guardian Eye of Horus ---
    drawEyeOfHorus(ctx, eye) {
        const { x, y, size = 26 } = eye;
        ctx.save();
        ctx.translate(x, y);

        const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, size * 1.2);
        aura.addColorStop(0, 'rgba(250, 204, 21, 0.6)');
        aura.addColorStop(0.5, 'rgba(234, 179, 8, 0.25)');
        aura.addColorStop(1, 'rgba(234, 179, 8, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.quadraticCurveTo(0, -9, 12, 0);
        ctx.quadraticCurveTo(0, 9, -12, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-11, -7);
        ctx.quadraticCurveTo(0, -12, 11, -6);
        ctx.stroke();

        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-1, -1, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(3, 8);
        ctx.lineTo(3, 15);
        ctx.quadraticCurveTo(0, 18, -3, 14);
        ctx.stroke();

        ctx.restore();
    },

    // --- Draw Powerup Pill Capsule ---
    drawPowerup(ctx, p) {
        const { x, y, width, height, type, icon, color, isTrap, isRelic } = p;
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);

        const radius = height / 2;
        ctx.beginPath();
        ctx.roundRect(-width / 2, -height / 2, width, height, radius);
        
        const grad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
        if (isTrap) {
            grad.addColorStop(0, '#dc2626');
            grad.addColorStop(0.5, '#7f1d1d');
            grad.addColorStop(0.51, '#1f2937');
            grad.addColorStop(1, '#111827');
        } else if (isRelic) {
            grad.addColorStop(0, '#fbbf24');
            grad.addColorStop(0.5, '#d97706');
            grad.addColorStop(0.51, '#0284c7');
            grad.addColorStop(1, '#0369a1');
        } else {
            grad.addColorStop(0, color || '#2563eb');
            grad.addColorStop(0.5, this.darkenColor(color || '#2563eb', 20));
            grad.addColorStop(0.51, '#ffffff');
            grad.addColorStop(1, '#e2e8f0');
        }
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = isTrap ? '#ef4444' : (isRelic ? '#fbbf24' : '#ffffff');
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = isTrap ? '#fef08a' : (isRelic ? '#ffffff' : '#0f172a');
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon || '?', 0, 1);

        ctx.restore();
    },

    // --- Draw Ball ---
    drawBall(ctx, ball, isEgypt = false) {
        const { x, y, radius, isFireball } = ball;
        ctx.save();

        if (isFireball) {
            const fireGrad = ctx.createRadialGradient(x, y, 1, x, y, radius * 2.2);
            fireGrad.addColorStop(0, '#ffffff');
            fireGrad.addColorStop(0.3, '#f59e0b');
            fireGrad.addColorStop(0.7, '#dc2626');
            fireGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');

            ctx.fillStyle = fireGrad;
            ctx.beginPath();
            ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
            ctx.fill();
        }

        const grad = ctx.createRadialGradient(
            x - radius * 0.35, y - radius * 0.35, radius * 0.1,
            x, y, radius
        );

        if (isFireball) {
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.4, '#fbbf24');
            grad.addColorStop(1, '#b45309');
        } else if (isEgypt) {
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#fde047');
            grad.addColorStop(0.7, '#ca8a04');
            grad.addColorStop(1, '#713f12');
        } else {
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#e2e8f0');
            grad.addColorStop(0.8, '#94a3b8');
            grad.addColorStop(1, '#475569');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isFireball ? '#f97316' : (isEgypt ? '#facc15' : '#cbd5e1');
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    },

    // --- Draw Laser Bolt ---
    drawLaser(ctx, laser, isEgypt = false) {
        const { x, y, width, height } = laser;
        ctx.save();
        if (isEgypt) {
            ctx.fillStyle = '#fbbf24';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 9;
            ctx.fillRect(x - width / 2, y, width, height);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - width / 4, y + 2, width / 2, height - 4);
        } else {
            ctx.fillStyle = '#ff0055';
            ctx.shadowColor = '#ff3366';
            ctx.shadowBlur = 8;
            ctx.fillRect(x - width / 2, y, width, height);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - width / 4, y + 2, width / 2, height - 4);
        }
        ctx.restore();
    },

    lightenColor(hex, percent) {
        let num = parseInt(hex.replace('#', ''), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    },

    darkenColor(hex, percent) {
        return this.lightenColor(hex, -percent);
    }
};

window.Sprites = Sprites;
