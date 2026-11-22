/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Application Entry Point & Bootstrapper
 */

import { GameEngine } from './engine.js';

window.addEventListener('DOMContentLoaded', () => {
    const engine = new GameEngine('chrono-canvas');
    window.chronoEngine = engine;
    engine.start();
    engine.ui.showMainMenu();
});
