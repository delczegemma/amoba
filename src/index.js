class Game {
  constructor(cells, message, restartBtn, firstPlayer, winningLength, boardSize ) {
    this.cells = cells
    this.message = message
    this.restartBtn = restartBtn
    this.firstPlayer = firstPlayer
    this.winningLength = winningLength
    this.boardSize = boardSize
    this.restartGame(this.firstPlayer,this.cells.length);
    this.initGame();
  }
  initBoard(cellLength){ //flexibilis initBoard
    let boardSize = Math.sqrt(cellLength);
    return Array(boardSize).fill().map(() =>
        Array(boardSize).fill(""));
  }
  initGame() {
    this.cells.forEach((cell) => {
      cell.dataset.nextMove = this.player;
      cell.addEventListener("click", () => this.makeMove(event));
    });
    this.restartBtn.addEventListener("click", () => this.restartGame(this.firstPlayer,this.cells.length));
  }
  makeMove(event) {
    const cell = event.target;
    if (cell.classList.contains('filled')) {
      // ha már van itt lépés, ne tegyen semmit
      return;
    }

    const row = parseInt(cell.getAttribute("cellIndexX"));
    const col = parseInt(cell.getAttribute("cellIndexY"));

    //leteszi a lépést a táblára és a tömbbe
    this.placeStepOnBoard(cell, row, col);
    console.log(board);

    //A táblán lévő cellára filled classt rak
    //CheckWin
    const winDirections= this.checkWin(row, col, this.winningLength )
    if (winDirections){
      const winningCoordinates = this.getWinningCells(row, col, this.player, ...winDirections);
      this.highlightWinLine(winningCoordinates)
      this.gameOver();
      this.message.textContent = `Az ${this.player} játékos nyert! Gratulálunk!`
    }
    //CheckDraw
    else if (this.checkDraw()){
      this.gameOver();
      this.message.textContent = `A játék véget ért. Az eredmény döntetlen. Újra?`
    } else {
      //játékosváltás
      this.switchPlayer();

      //hover helyzet váltása
      this.cells.forEach(cell => {
        cell.dataset.nextMove = this.player;
      });
    }
  }
  placeStepOnBoard(cell, row, col) {
    this.board[row][col] = this.player;
    cell.innerText = this.player;
    cell.classList.add('filled');
  }
  switchPlayer() {
    this.player = this.player === "X" ? "O" : "X";
  }
  gameOver() {
    this.cells.forEach(cell => {
      if (!cell.classList.contains('filled')) {
        cell.classList.add('filled')
      }
    })
  }
  restartGame(player, cellsLength) {
    this.board = this.initBoard(cellsLength);
    this.player = player;
    //esetleg if ide
    this.message.textContent = "";
    this.cells.forEach(cell => {
      cell.classList.remove('filled')
      cell.classList.remove('winner-cell');
      cell.textContent = ""
    })
  }
  checkDirection(
      row,
      column,
      PlayerSymbol,
      rowChange,
      colChange
  ) {
    let difference = 1;
    console.log(`CheckDirection függvény: `) //esetleg még paraméterek kiíratása plusszba
    while (
        row + difference * rowChange < this.board.length &&
        column + difference * colChange < this.board[0].length &&
        row + difference * rowChange >= 0 &&
        column + difference * colChange >= 0
        ) {
      console.log(`   x: ${row + difference * rowChange}, y: ${
          column + difference * colChange}, szimbólum:  ${
          PlayerSymbol}, érték: ${this.board[row + difference * rowChange][column + (difference * colChange)]
      }`);
      if (
          this.board[row + difference * rowChange][column + (difference * colChange)] ===
          PlayerSymbol
      ) {
        difference++;
      } else {
        break;
      }
    }
    console.log(`   eredmény: ${difference-1}`)
    return difference - 1;
  }
  getWinningCells(row, column, PlayerSymbol, rowC1, rowC2, colC1, colC2) {
    const winningCells = [];
    let x = row;
    let y = column;
    const withinBorders = (x, y) => x >= 0 && y >= 0 && x < this.board.length && y < this.board[0].length;
    do {
      winningCells.push({x, y});
      x += rowC1;
      y += colC1
    } while (withinBorders(x, y) && this.board[x][y] === PlayerSymbol)
    x = row + rowC2;
    y = column + colC2;
    while(withinBorders(x, y) && this.board[x][y] === PlayerSymbol){
      winningCells.push({x, y});
      x += rowC2;
      y += colC2
    }
    //tesztelés: a kapott tömb mindig a winninglength-el megegyező hosszúságú kell legyen
    console.log("A győztes tömb: ")
    console.log(winningCells);
    return winningCells;
  }
  highlightWinLine(coordinates){
    coordinates.forEach(({ x, y }) => {
      const cell = document.querySelector(`.cell[cellIndexX="${x}"][cellIndexY="${y}"]`);
      cell.classList.add('winner-cell');
    });
  }
  checkWin(row, column, winningLength) {
    const PlayerSymbol = this.board[row][column];
    const rowLength =
        this.checkDirection(row, column, PlayerSymbol, 0, 1) +
        this.checkDirection(row, column, PlayerSymbol, 0, -1) +
        1;
    const columnLength =
        this.checkDirection(row, column, PlayerSymbol, 1, 0) +
        this.checkDirection(row, column, PlayerSymbol, -1, 0) +
        1;
    const mDiagonalLength =
        this.checkDirection(row, column, PlayerSymbol, 1, 1) +
        this.checkDirection(row, column, PlayerSymbol, -1, -1) +
        1;
    const oppDiagonalLength =
        this.checkDirection(row, column, PlayerSymbol, 1, -1) +
        this.checkDirection(row, column, PlayerSymbol, -1, 1) +
        1;
    console.log(`Checkwin függvény 
      sora: ${rowLength},oszlopa: ${columnLength},főátló: ${mDiagonalLength},ellenátló: ${oppDiagonalLength} `)

    switch (true){
      case (rowLength >= winningLength):
        return [0, 0, 1, -1]
      case (columnLength >= winningLength):
        return [1, -1, 0, 0]
      case (mDiagonalLength >= winningLength):
        return [1, -1, 1 ,-1]
      case (oppDiagonalLength >= winningLength):
        return [1, -1, -1, 1]
      default:
        return null;
    }
  }
  checkDraw() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        console.log(`Az ${i} ${j}edik elem: ${this.board[i][j]}. Üres?`);
        console.log(this.board[i][j] === "");
        if (this.board[i][j] === "") {
          return false;
        }
      }
    }
    return true;
  }
}

const cells = document.querySelectorAll(".cell");
const message = document.querySelector("#reportMessage");
const restartBtn = document.querySelector("#restartBtn");




//Játék beállítása
const MODAL = document.getElementById('myModal');
const form = document.getElementById("gameSettingsForm");
form.addEventListener("submit", function(event) {
  // Űrlap elküldésének megakadályozása
  event.preventDefault();

  // Beküldött adatok gyűjtése
  const firstPlayer = document.getElementById("firstPlayer").value;
  const winningLength = parseInt(document.getElementById("winningLength").value);
  const boardSize = parseInt(document.getElementById("boardSize").value);

  // Játék inicializálása a beküldött adatok alapján
  const game = new Game(cells, message, restartBtn, firstPlayer, winningLength, boardSize);
  game.initGame();


  // Modal bezárása
  closeModal();
  document.querySelector("#app").style.display = 'inline';
  document.querySelector("#winningLengthInfo").innerText = winningLength;
});

//beállításolal mutatása
function setGame() {
  MODAL.style.display = 'block';
}

// Modal bezárása
function closeModal() {
  MODAL.style.display = 'none';
}