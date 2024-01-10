/*
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
    [6, 7, 2, 1, 9, null, 3, 4, 8],
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
*/

function findEmptyCell(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] == null) {
        return [i, j];
      }
    }
  }
  return null;
}

function isPossible(board, row, col, num) {
  // Checking row
  for (let idxCol = 0; idxCol < board.length; idxCol++) {
    if (board[row][idxCol] == num) {
      return false;
    }
  }

  // Checking col
  for (let idxRow = 0; idxRow < board[0].length; idxRow++) {
    if (board[idxRow][col] == num) {
      return false;
    }
  }

  // Checking small box
  let rowFactor = row - (row % 3);
  let colFactor = col - (col % 3);
  for (let r = 0 + rowFactor; r < 3 + rowFactor; r++) {
    for (let c = 0 + colFactor; c < 3 + colFactor; c++) {
      if (board[r][c] == num) {
        return false;
      }
    }
  }

  return true;
}

function recFunc(board) {
  let emptyCell = findEmptyCell(board);
  if (!emptyCell) {
    return true;
  }

  let [row, col] = emptyCell;

  let choicesTaken = [];
  while (choicesTaken.length < 9) {
    let num = Math.floor(Math.random() * 9) + 1;
    if (choicesTaken.includes(num)) {
      continue;
    }
    choicesTaken.push(num);

    if (isPossible(board, row, col, num)) {
      board[row][col] = num;
      if (recFunc(board)) {
        return true;
      }
      board[row][col] = null;
    }
  }

  return false;
}

export function getSudoku(minRange = 60, maxRange = 70) {
  /*
    minRange: minimum no of elements to remove.
    */
  let count = 0;

  function isUnique(board) {
    let emptyCell = findEmptyCell(board);
    if (!emptyCell) {
      count++;
      return true;
    }

    let [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (count > 1) {
        return false;
      }
      if (isPossible(board, row, col, num)) {
        board[row][col] = num;
        isUnique(board);
        board[row][col] = null;
      }
    }

    return false;
  }

  let sudoku = Array.from({ length: 9 }, () => Array(9).fill(null));
  recFunc(sudoku);
  const solvedSudoku = JSON.parse(JSON.stringify(sudoku)); // Deep copy

  let coordinates = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      coordinates.push([i, j]);
    }
  }

  let noOfRemoved = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;

  while (coordinates.length > 0 && noOfRemoved > 0) {
    let index = Math.floor(Math.random() * coordinates.length);
    let [r, c] = coordinates.splice(index, 1)[0];

    let n = sudoku[r][c];
    sudoku[r][c] = null;

    count = 0;
    isUnique(sudoku);

    if (count === 1) {
      noOfRemoved--;
    } else {
      sudoku[r][c] = n;
    }
  }

  console.log("Generated Sudoku:", sudoku);
  console.log("Solved Sudoku:", solvedSudoku);
  return [sudoku, solvedSudoku];
}
/*
export function getInvalidCellMatrix(invalidSudoku, solvedSudoku) {
  let invalidCell = Array.from({ length: 9 }, () => Array(9).fill(null));

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
*/
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

export function getHint(currBoard, solvedBoard) {
  let hints = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (currBoard[row][col] != solvedBoard[row][col]) {
        hints.push([row, col, solvedBoard[row][col]]);
      }
    }
  }
  const randomIndex = Math.floor(Math.random() * hints.length);

  return hints.length ? hints[randomIndex] : null;
}

export function getInvalidCellMatrix(currBoard, initialBoard) {
  let invalidCells = Array.from({ length: 9 }, () => Array(9).fill(0));

  if (!currBoard || !initialBoard) {
    console.log("Error in getInvalidCellMatrix Function");
    return invalidCells;
  }

  // Check row
  for (let r = 0; r < 9; r++) {
    let rowCounter = Array(10).fill(0);
    for (let c = 0; c < 9; c++) {
      if (currBoard[r][c]) {
        rowCounter[currBoard[r][c]]++;
      }
    }
    for (let c = 0; c < 9; c++) {
      if (currBoard[r][c] && rowCounter[currBoard[r][c]] > 1 && currBoard[r][c] != initialBoard[r][c]) {
        invalidCells[r][c] = 1;
      }
    }
  }

  // Check col
  for (let c = 0; c < 9; c++) {
    let colCounter = Array(10).fill(0);
    for (let r = 0; r < 9; r++) {
      if (currBoard[r][c]) {
        colCounter[currBoard[r][c]]++;
      }
    }
    for (let r = 0; r < 9; r++) {
      if (currBoard[r][c] && colCounter[currBoard[r][c]] > 1 && currBoard[r][c] != initialBoard[r][c]) {
        invalidCells[r][c] = 1;
      }
    }
  }

  // Check small boxes
  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      let boxCounter = Array(10).fill(0);
      for (let x = i; x < i + 3; x++) {
        for (let y = j; y < j + 3; y++) {
          if (currBoard[x][y]) {
            boxCounter[currBoard[x][y]]++;
          }
        }
      }
      for (let x = i; x < i + 3; x++) {
        for (let y = j; y < j + 3; y++) {
          if (currBoard[x][y] && boxCounter[currBoard[x][y]] > 1 && currBoard[x][y] !== initialBoard[x][y]) {
            invalidCells[x][y] = 1;
          }
        }
      }
    }
  }

  // console.log("Array in func.",invalidCells)

  return invalidCells;
}
