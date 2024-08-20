document.addEventListener('DOMContentLoaded', () => {
    
    let difficulty = 'easy';

    
    function generateSudoku(difficulty) {
        const grid = [];
        for (let i = 0; i < 9; i++) {
            grid[i] = new Array(9).fill(0);
        }

        function isValid(grid, row, col, num) {
            for (let i = 0; i < 9; i++) {
                if (grid[row][i] === num || grid[i][col] === num || grid[Math.floor(row / 3) * 3 + Math.floor(i / 3)][Math.floor(col / 3) * 3 + i % 3] === num) {
                    return false;
                }
            }
            return true;
        }

        function fillGrid(grid) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (grid[i][j] === 0) {
                        const numList = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                        for (let num of numList) {
                            if (isValid(grid, i, j, num)) {
                                grid[i][j] = num;
                                if (fillGrid(grid)) return true;
                                grid[i][j] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        fillGrid(grid);

        
        let removePercentage;
        switch (difficulty) {
            
            case 'ultra-easy':
                removePercentage = 0.1; 
                break;
            case 'easy':
                removePercentage = 0.25; // 75% filled, 25% removed
                break;
            case 'medium':
                removePercentage = 0.45; // 55% filled, 45% removed
                break;
            case 'hard':
                removePercentage = 0.57; // 43% filled, 57% removed
                break;
        }

        for (let i = 0; i < 81 * removePercentage; i++) {
            let cell;
            do {
                cell = Math.floor(Math.random() * 81);
            } while (grid[Math.floor(cell / 9)][cell % 9] === 0);
            grid[Math.floor(cell / 9)][cell % 9] = 0;
        }

        return grid;
    }

   
    function renderSudoku(grid) {
        const sudokuGrid = document.getElementById('sudoku-grid');
        sudokuGrid.innerHTML = '';

        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const input = document.createElement('input');
                if (cell !== 0) {
                    input.value = cell;
                    input.disabled = true;
                } else {
                    input.value = '';
                }
                sudokuGrid.appendChild(input);
            });
        });
    }

    
    function getSudokuGrid() {
        const inputs = document.querySelectorAll('#sudoku-grid input');
        const grid = [];
        for (let i = 0; i < 9; i++) {
            const row = [];
            for (let j = 0; j < 9; j++) {
                const value = inputs[i * 9 + j].value;
                row.push(value ? parseInt(value) : 0);
            }
            grid.push(row);
        }
        return grid;
    }

    
    function isSudokuCorrect(grid) {
        function isValidRow(row) {
            const seen = new Set();
            for (let num of row) {
                if (num === 0 || seen.has(num)) return false;
                seen.add(num);
            }
            return true;
        }

        function isValidCol(grid, col) {
            const seen = new Set();
            for (let i = 0; i < 9; i++) {
                const num = grid[i][col];
                if (num === 0 || seen.has(num)) return false;
                seen.add(num);
            }
            return true;
        }

        function isValidBox(grid, startRow, startCol) {
            const seen = new Set();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const num = grid[startRow + i][startCol + j];
                    if (num === 0 || seen.has(num)) return false;
                    seen.add(num);
                }
            }
            return true;
        }

        for (let i = 0; i < 9; i++) {
            if (!isValidRow(grid[i]) || !isValidCol(grid, i)) return false;
        }

        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 9; j += 3) {
                if (!isValidBox(grid, i, j)) return false;
            }
        }

        return true;
    }

    
    function updateSudokuGrid() {
        const grid = generateSudoku(difficulty);
        renderSudoku(grid);
    }

    
    document.getElementById('ultra-easy').addEventListener('click', () => {
        difficulty = 'ultra-easy';
        updateSudokuGrid();
    });

    document.getElementById('easy').addEventListener('click', () => {
        difficulty = 'easy';
        updateSudokuGrid();
    });

    document.getElementById('medium').addEventListener('click', () => {
        difficulty = 'medium';
        updateSudokuGrid();
    });

    document.getElementById('hard').addEventListener('click', () => {
        difficulty = 'hard';
        updateSudokuGrid();
    });

    
    updateSudokuGrid();

    
    document.getElementById('check-sudoku').addEventListener('click', () => {
        const currentGrid = getSudokuGrid();
        const isCorrect = isSudokuCorrect(currentGrid);
        const result = document.getElementById('result');
        if (isCorrect) {
            result.textContent = "Juhuu! Správně.";
            result.style.color = "green";
        } else {
            result.textContent = "Haha naser si.";
            result.style.color = "red";
        }
    });
});
