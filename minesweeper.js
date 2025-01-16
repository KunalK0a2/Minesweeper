const boardSize = 10;
    const mineCount = 15;
    let board, cells, mines;
    //const audio = new Audio('bomb.wav');
    const initializeGame = () => {

      // Resets the board
      document.getElementById('game').innerHTML = '';
      board = document.createElement('div');
      board.className = 'board';
      board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

      cells = [];
      mines = [];

      // Creates all the cells
      for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.revealed = false;
        board.appendChild(cell);
        cells.push(cell);
      }

      // Place mines randomly
      while (mines.length < mineCount) {
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        const cell = getCell(x, y);

        if (!cell.dataset.mine) {
          cell.dataset.mine = true;
          mines.push(cell);
        }
      }

      // Calculate adjacent mines
      cells.forEach((cell, index) => {
        const x = index % boardSize;
        const y = Math.floor(index / boardSize);

        if (cell.dataset.mine) return;

        let mineCount = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (isValidCell(x + dx, y + dy)) {
              const neighbor = getCell(x + dx, y + dy);
              if (neighbor.dataset.mine) mineCount++;
            }
          }
        }
        cell.dataset.mineCount = mineCount;
      });

      // Clicking Evenet Listener
      cells.forEach((cell) => {
        cell.addEventListener('click', () => revealCell(cell));
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          if (cell.dataset.revealed === 'true') return;

          if (cell.classList.contains('flag')) {
            cell.classList.remove('flag');
            cell.textContent = '';
          } else {
            cell.classList.add('flag');
            cell.textContent = '🚩';

          }
        });
      });
      document.getElementById('game').appendChild(board);
    };

    const getCell = (x, y) => cells[y * boardSize + x];
    const isValidCell = (x, y) => x >= 0 && x < boardSize && y >= 0 && y < boardSize;

    //Reveals the cell on clicking
    const revealCell = (cell) => {
      if (cell.dataset.revealed === 'true') return;

      cell.dataset.revealed = true;
      cell.classList.add('revealed');

      if (cell.dataset.mine) {
        cell.classList.add('mine');
        cell.textContent = '💣';
        //audio.play();
        alert('Game Over!');
        return;
      }

      const mineCount = cell.dataset.mineCount;
      if (mineCount > 0) {
        cell.textContent = mineCount;
        return;
      }

      // Logic for revealing neighbours
      const index = cells.indexOf(cell);
      const x = index % boardSize;
      const y = Math.floor(index / boardSize);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (isValidCell(x + dx, y + dy)) {
            revealCell(getCell(x + dx, y + dy));
          }
        }
      }
    };

    // Reset button logic
    const resetGame = () => {
      initializeGame();
    };

    initializeGame();
