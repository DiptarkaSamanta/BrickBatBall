/**
 * Integration & Unit Tests for Chrono Breaker
 */

import { WORLDS, BRICK_TYPES, POWERUP_TYPES, UPGRADES, ACHIEVEMENTS, PHYSICS, CANVAS_WIDTH, CANVAS_HEIGHT } from './src/config.js';
import { Physics } from './src/physics.js';
import { levelCatalog } from './src/levels.js';
import { Boss } from './src/bosses.js';

console.log('--- RUNNING CHRONO BREAKER VALIDATION SUITE ---');

// 1. Config Validation
console.log(`[Test 1] Worlds Count: ${WORLDS.length} (Expected: 6)`);
if (WORLDS.length !== 6) throw new Error('Expected 6 worlds');

console.log(`[Test 2] Brick Types: ${Object.keys(BRICK_TYPES).length} (Expected: 10)`);
if (Object.keys(BRICK_TYPES).length !== 10) throw new Error('Expected 10 brick types');

console.log(`[Test 3] Achievements Count: ${ACHIEVEMENTS.length} (Expected: 12)`);
if (ACHIEVEMENTS.length !== 12) throw new Error('Expected 12 achievements');

console.log(`[Test 4] Upgrades Count: ${UPGRADES.length} (Expected: 5)`);
if (UPGRADES.length !== 5) throw new Error('Expected 5 upgrades');

// 2. Levels Validation
console.log(`[Test 5] LevelCatalog Total Levels: ${levelCatalog.levels.length} (Expected: 60)`);
if (levelCatalog.levels.length !== 60) throw new Error('Expected 60 levels');

for (let w = 0; w < 6; w++) {
    for (let lvl = 1; lvl <= 10; lvl++) {
        const l = levelCatalog.getLevel(w, lvl);
        if (!l) throw new Error(`Missing level ${w}-${lvl}`);
        if (lvl === 10 && !l.isBossLevel) throw new Error(`Level ${w}-10 must be a boss level`);

        const bricks = levelCatalog.instantiateBricks(l);
        if (bricks.length === 0) throw new Error(`Level ${w}-${lvl} has no bricks`);

        // Check bounds
        for (const b of bricks) {
            if (b.x < 0 || b.x + b.width > CANVAS_WIDTH) {
                throw new Error(`Brick in ${w}-${lvl} out of horizontal bounds: x=${b.x}, w=${b.width}`);
            }
            if (b.y < 0 || b.y + b.height > CANVAS_HEIGHT) {
                throw new Error(`Brick in ${w}-${lvl} out of vertical bounds: y=${b.y}, h=${b.height}`);
            }
        }
    }
}
console.log('✓ All 60 levels loaded and brick bounds verified within 800x600 canvas.');

// 3. Physics Validation
console.log('[Test 6] Testing Circle-Rect collision...');
const col1 = Physics.checkCircleRect(100, 100, 10, 95, 95, 20, 20);
if (!col1) throw new Error('Expected collision between circle and rect');

const col2 = Physics.checkCircleRect(200, 200, 5, 50, 50, 20, 20);
if (col2 !== null) throw new Error('Expected no collision for distant circle and rect');
console.log('✓ Physics circle-rect collision verified.');

// 4. Boss Validation
console.log('[Test 7] Testing Bosses...');
for (let w = 0; w < 6; w++) {
    const boss = new Boss(w);
    if (!boss.name || boss.hp <= 0) throw new Error(`Invalid boss for world ${w}`);
    boss.takeDamage(10, null, null);
    if (boss.hp !== boss.maxHp - 10) throw new Error(`Boss takeDamage failed for world ${w}`);
}
console.log('✓ All 6 bosses instantiated and damage mechanics verified.');

console.log('====================================================');
console.log(' ALL CHRONO BREAKER VALIDATION TESTS PASSED CLEANLY! ');
console.log('====================================================');
