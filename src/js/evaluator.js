export class Evaluator {
    constructor(board) {
        this.board = board
    }
    checkDirection(
        row,
        column,
        rowChange,
        colChange
    ) {
        const PlayerSymbol = this.board[row][column]
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

    checkWin(row, column, winningLength) {
        const rowLength =
            this.checkDirection(row, column,0, 1) +
            this.checkDirection(row, column,0, -1) +
            1;
        const columnLength =
            this.checkDirection(row, column,1, 0) +
            this.checkDirection(row, column,-1, 0) +
            1;
        const mDiagonalLength =
            this.checkDirection(row, column,1, 1) +
            this.checkDirection(row, column,-1, -1) +
            1;
        const oppDiagonalLength =
            this.checkDirection(row, column,1, -1) +
            this.checkDirection(row, column,-1, 1) +
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

    getWinningCells(row, column, rowC1, rowC2, colC1, colC2) {
        const winningCells = [];
        const PlayerSymbol = this.board[row][column]
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