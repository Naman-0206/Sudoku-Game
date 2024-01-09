import { useState } from "react";

function HintButton({noOfHints, setNoOfHints}){

  return <button onClick={setNoOfHints}>Hint:{noOfHints}</button>
}

function Square({ value, setValue }) {
  function handleClick() {
    let v = value;
    if (value === null) {
      setValue(1);
      v = 1;
    } else {
      setValue((value % 9) + 1);
      v = (value % 9) + 1;
    }
    // console.log("clicked, ", value, "->", v);
  }

  return (
    <button className="sudoku-cell" onClick={handleClick}>
      {value}
    </button>
  );
}

function InvalidSquare({ value, setValue }) {
  function handleClick() {
    let v = value;
    if (value === null) {
      setValue(1);
      v = 1;
    } else {
      setValue((value % 9) + 1);
      v = (value % 9) + 1;
    }
    // console.log("clicked, ", value, "->", v);
  }

  return (
    <button
      className="sudoku-cell"
      onClick={handleClick}
      style={{ "backgroundColor": "#ba7575" }}
    >
      {value}
    </button>
  );
}

function FixedSquare({ value }) {
  return (
    <button className="square" style={{ color: "red" }} disabled={true}>
      {value}
    </button>
  );
}

function Board({ board, setBoard, initialBoard, invalidCellMatrix }) {
  function updateBoard(value, ridx, cidx) {
    let newBoard = board.map(function (arr) {
      return arr.slice();
    });
    newBoard[ridx][cidx] = value;
    setBoard(newBoard);
  }

  const dispBoard = [];

  for (let ridx = 0; ridx < board.length && ridx < 9; ridx++) {
    const dispRow = [];

    for (let cidx = 0; cidx < board[ridx].length && cidx < 9; cidx++) {
      if (initialBoard[ridx][cidx]) {
        dispRow.push(
          <FixedSquare
            key={`${(ridx + 1) * (cidx + 1)}`}
            value={initialBoard[ridx][cidx]}
          />
        );
      } else {
        if (invalidCellMatrix[ridx][cidx]) {
          dispRow.push(
            <InvalidSquare
              key={`${(ridx + 1) * (cidx + 1)}`}
              value={board[ridx][cidx]}
              setValue={(a) => updateBoard(a, ridx, cidx)}
            />
          );
        } else {
          dispRow.push(
            <Square
              key={`${(ridx + 1) * (cidx + 1)}`}
              value={board[ridx][cidx]}
              setValue={(a) => updateBoard(a, ridx, cidx)}
            />
          );
        }
      }
    }

    dispBoard.push(dispRow);
  }

  return <div className="sudoku-board">{dispBoard}</div>;
}

let invalidCells = Array.from({ length: 9 }, () => Array(9).fill(0));

export default function Game() {
  const [initialSudokuBoard, solvedSudokuBoard] = getSudoku();

  const [board, setBoard] = useState(initialSudokuBoard);
  const [won, setWon] = useState(false);
  const [hints, setHints] = useState(5);
  const [hintUsed, setHintUsed] = useState(false);

  function updateBoard(board) {
    
    if (isValidSudoku(board) && !hasNulls(board)) {
      setWon(true);
    }
    
    setBoard(board);
    setHintUsed(false)
  }

  function updateHints(hint){
    if(!hints){
      console.log("No hints left")
    }
    else{
      setHintUsed(true);
      invalidCells = getInvalidCellMatrix(board, solvedSudokuBoard)
      setHints(hints-1)
      setBoard(board)
      console.log(invalidCells)
    }
  }

  return (
    <div>
      {won ? (
        <p>won</p>
      ) : (
        <div>
          <Board
            board={board}
            setBoard={updateBoard}
            initialBoard={initialSudokuBoard}
            invalidCellMatrix={hintUsed? invalidCells : Array.from({ length: 9 }, () => Array(9).fill(0))}
          />
          <HintButton noOfHints={hints} setNoOfHints={updateHints}/>
        </div>
      )}
    </div>
  );
}

function hasNulls(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === null) {
        return true;
      }
    }
  }
  return false;
}

var isValidSudoku = function (board) {
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
};

function getSudoku() {
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

function getInvalidCellMatrix(invalidSudoku, solvedSudoku) {
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
