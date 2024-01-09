export function getSudoku() {
  let solvedSudokuBoard = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];
  let pSolvedSudokuBoard = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, null, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  let initialSudokuBoard = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ];

  return [initialSudokuBoard, solvedSudokuBoard];
}

export function getInvalidCellMatrix(invalidSudoku, solvedSudoku) {
  let invalidCell = Array.from({ length: 9 }, () => Array(9).fill(0));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (
        invalidSudoku[row][col] != null &&
        invalidSudoku[row][col] != solvedSudoku[row][col]
      ) {
        invalidCell[row][col] = 1;
      }
    }
  }
  return invalidCell;
}

export function hasNulls(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === null) {
        return true;
      }
    }
  }
  return false;
}

export function isValidSudoku(board) {
  for (let i = 0; i < 9; i++) {
    let row = new Set();
    let col = new Set();

    for (let j = 0; j < 9; j++) {
      let curRow = board[i][j];
      let currCol = board[j][i];

      if (curRow !== null) {
        if (row.has(curRow)) return false;
        row.add(curRow);
      }

      if (currCol !== null) {
        if (col.has(currCol)) return false;
        col.add(currCol);
      }
    }
  }
  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      let box = new Set();

      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          let currVal = board[i + x][j + y];

          if (currVal !== null) {
            if (box.has(currVal)) return false;
            box.add(currVal);
          }
        }
      }
    }
  }

  return true;
}

export function getHint(currBoard, solvedBoard){

    let hints = []

    for(let row = 0; row<9; row++){
        for(let col = 0; col<9; col++){

            if(!currBoard[row][col] && currBoard[row][col] != solvedBoard[row][col]){
                hints.push([row, col, solvedBoard[row][col]])
            }
        }
    }
    const randomIndex = Math.floor(Math.random() * hints.length);
    
    return hints.length?hints[randomIndex]:null
}
