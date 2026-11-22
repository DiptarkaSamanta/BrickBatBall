// editor.js - Interactive In-Game Level Editor for Jardinains & Bricks of Egypt!

class LevelEditor {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.cols = 14;
        this.rows = 10;
        this.grid = [];
        this.gnomes = [];
        this.selectedTool = '1';
        this.selectedGnomeTool = null;
        this.isMouseDown = false;
        this.editorTheme = 'garden'; // 'garden' or 'egypt'

        this.initEmptyGrid();
    }

    initEmptyGrid() {
        this.grid = [];
        for (let r = 0; r < this.rows; r++) {
            const row = [];
            for (let c = 0; c < this.cols; c++) {
                row.push('.');
            }
            this.grid.push(row);
        }
        this.gnomes = [];
    }

    loadFromLevel(levelData) {
        this.initEmptyGrid();
        if (levelData && levelData.grid) {
            for (let r = 0; r < Math.min(this.rows, levelData.grid.length); r++) {
                const str = levelData.grid[r];
                for (let c = 0; c < Math.min(this.cols, str.length); c++) {
                    this.grid[r][c] = str[c];
                }
            }
        }
        if (levelData && levelData.gnomes) {
            this.gnomes = JSON.parse(JSON.stringify(levelData.gnomes));
        }
        if (levelData && levelData.isEgypt) {
            this.editorTheme = 'egypt';
        }
    }

    toggle() {
        this.active = !this.active;
        const modal = document.getElementById('editor-modal');
        if (modal) {
            modal.style.display = this.active ? 'flex' : 'none';
            if (this.active) {
                this.renderGridUI();
            }
        }
    }

    renderGridUI() {
        const container = document.getElementById('editor-canvas-container');
        if (!container) return;
        container.innerHTML = '';

        const table = document.createElement('div');
        table.className = 'editor-grid';

        for (let r = 0; r < this.rows; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'editor-row';

            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'editor-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;

                const val = this.grid[r][c];
                this.updateCellVisual(cell, val, r, c);

                cell.addEventListener('mousedown', (e) => {
                    this.isMouseDown = true;
                    this.applyTool(r, c, cell);
                });

                cell.addEventListener('mouseenter', (e) => {
                    if (this.isMouseDown) {
                        this.applyTool(r, c, cell);
                    }
                });

                rowDiv.appendChild(cell);
            }
            table.appendChild(rowDiv);
        }

        container.appendChild(table);

        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
    }

    updateCellVisual(cell, val, r, c) {
        cell.innerHTML = '';
        cell.style.background = '#1e293b';
        cell.style.borderColor = '#334155';

        if (val !== '.') {
            const color = window.COLOR_MAP[val] || '#3b82f6';
            cell.style.background = color;
            const glyph = window.GLYPH_MAP[val];
            if (glyph) {
                cell.innerText = glyph;
                cell.style.fontSize = '12px';
                cell.style.color = '#fff';
            } else if (val === 'T') {
                cell.innerText = 'TNT';
                cell.style.fontSize = '9px';
                cell.style.color = '#fff';
                cell.style.fontWeight = 'bold';
            } else if (val === '?') {
                cell.innerText = '★';
                cell.style.color = '#fff';
            } else if (val === 'C') {
                cell.innerText = '2';
                cell.style.color = '#111';
            } else if (val === 'H') {
                cell.innerText = '3';
                cell.style.color = '#fff';
            } else if (val === 'I') {
                cell.innerText = 'INGOT';
                cell.style.fontSize = '8px';
                cell.style.color = '#333';
            }
        }

        const gnome = this.gnomes.find(g => g.row === r && g.col === c);
        if (gnome) {
            const gBadge = document.createElement('span');
            gBadge.className = 'editor-gnome-badge';
            let icon = '🧙‍♂️';
            if (gnome.type === 'grumpy') icon = '🧙';
            else if (gnome.type === 'speedy') icon = '⚡';
            else if (gnome.type === 'king') icon = '👑';
            else if (gnome.type === 'mummy') icon = '🧟';
            else if (gnome.type === 'pharaoh') icon = '👑';
            else if (gnome.type === 'anubis') icon = '🐺';
            gBadge.innerText = icon;
            cell.appendChild(gBadge);
        }
    }

    applyTool(r, c, cell) {
        if (this.selectedGnomeTool) {
            const existingIdx = this.gnomes.findIndex(g => g.row === r && g.col === c);
            if (this.selectedGnomeTool === 'remove') {
                if (existingIdx !== -1) this.gnomes.splice(existingIdx, 1);
            } else {
                if (existingIdx !== -1) this.gnomes.splice(existingIdx, 1);
                this.gnomes.push({ col: c, row: r, type: this.selectedGnomeTool });
            }
        } else {
            this.grid[r][c] = this.selectedTool;
            if (this.selectedTool === '.') {
                const gIdx = this.gnomes.findIndex(g => g.row === r && g.col === c);
                if (gIdx !== -1) this.gnomes.splice(gIdx, 1);
            }
        }
        this.updateCellVisual(cell, this.grid[r][c], r, c);
    }

    testPlay() {
        const customLevel = {
            name: "Custom Created Level",
            theme: this.editorTheme,
            isEgypt: this.editorTheme === 'egypt',
            grid: this.grid.map(row => row.join('')),
            gnomes: JSON.parse(JSON.stringify(this.gnomes))
        };
        this.toggle();
        this.game.loadCustomLevel(customLevel);
    }

    exportJSON() {
        const customLevel = {
            name: "Custom Level",
            isEgypt: this.editorTheme === 'egypt',
            grid: this.grid.map(row => row.join('')),
            gnomes: this.gnomes
        };
        const str = JSON.stringify(customLevel, null, 2);
        navigator.clipboard.writeText(str).then(() => {
            alert("Level JSON copied to clipboard!");
        }).catch(() => {
            prompt("Copy this level JSON:", str);
        });
    }

    importJSON() {
        const str = prompt("Paste your Level JSON here:");
        if (!str) return;
        try {
            const data = JSON.parse(str);
            this.loadFromLevel(data);
            this.renderGridUI();
            alert("Level loaded successfully!");
        } catch (e) {
            alert("Invalid level JSON: " + e.message);
        }
    }
}

window.LevelEditor = LevelEditor;
