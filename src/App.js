import { useState } from "react";
import { getSudoku, getInvalidCellMatrix, isValidSudoku, hasNulls, getHint } from "./tools";

const MAX_HINTS = 5;

function getSquareStyle(r, c) {
  let sqStyle = {};

  if ([3, 6].includes(r)) {
    sqStyle['borderTop'] = '2px black solid';
  }
  if ([3, 6].includes(c)) {
    sqStyle['borderLeft'] = '2px black solid';
  }

  return sqStyle;
}

function HintButton({ noOfHints, setNoOfHints }) {
  return (
    <button className='hint-button' onClick={setNoOfHints}>
      Hint:{noOfHints}
    </button>
  );
}

function Square({ value, setValue, i, j }) {
  function handleClick() {
    let v = value;
    if (value === null) {
      setValue(1);
      v = 1;
    } else {
      setValue((value % 9) + 1);
      v = (value % 9) + 1;
    }
  }

  return (
    <button className='square' style={getSquareStyle(i,j)} onClick={handleClick}>
      {value}
    </button>
  );
}

function InvalidSquare({ value, setValue, i, j }) {
  function handleClick() {
    let v = value;
    if (value === null) {
      setValue(1);
      v = 1;
    } else {
      setValue((value % 9) + 1);
      v = (value % 9) + 1;
    }
  }

  return (
    <button className='square' onClick={handleClick} style={{ backgroundColor: "rgb(255, 254, 153)" , ...getSquareStyle(i,j)}}>
      {value}
    </button>
  );
}

function FixedSquare({ value, i, j }) {
  return (
    <button className='square' style={{ color: "red", fontWeight: "bold", fontSize: "23px" , ...getSquareStyle(i,j)}} disabled={true}>
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
        dispRow.push(<FixedSquare key={`${(ridx + 1) * (cidx + 1)}`} value={initialBoard[ridx][cidx]} i={ridx} j = {cidx} />);
      } else {
        if (invalidCellMatrix[ridx][cidx]) {
          dispRow.push(
            <InvalidSquare
              key={`${(ridx + 1) * (cidx + 1)}`}
              value={board[ridx][cidx]}
              setValue={(a) => updateBoard(a, ridx, cidx)}
              i={ridx}
              j = {cidx}
            />
          );
        } else {
          dispRow.push(
            <Square
              key={`${(ridx + 1) * (cidx + 1)}`}
              value={board[ridx][cidx]}
              setValue={(a) => updateBoard(a, ridx, cidx)}
              i={ridx} 
              j = {cidx}
            />
          );
        }
      }
    }

    dispBoard.push(dispRow);
  }

  return <div className='sudoku-board'>{dispBoard}</div>;
}


function getNewGame() {
  console.log("Loading New Game!");
  const [initialSudokuBoard, solvedSudokuBoard] = getSudoku(81-25,81-17);
  localStorage.setItem("initialSudokuBoard", JSON.stringify(initialSudokuBoard));
  localStorage.setItem("solvedSudokuBoard", JSON.stringify(solvedSudokuBoard));
  localStorage.setItem("lastSudokuBoard", JSON.stringify(initialSudokuBoard));
  localStorage.setItem("noHints", JSON.stringify(MAX_HINTS));
  localStorage.setItem("won", JSON.stringify(false));
  
  return [initialSudokuBoard, solvedSudokuBoard, initialSudokuBoard, MAX_HINTS, false];
}

function getOldGame() {
  const oldInitialBoard = JSON.parse(localStorage.getItem("initialSudokuBoard"));
  const oldSolvedBoard = JSON.parse(localStorage.getItem("solvedSudokuBoard"));
  const oldLastBoard = JSON.parse(localStorage.getItem("lastSudokuBoard"));
  const noHints = JSON.parse(localStorage.getItem("noHints"));
  const isWon = JSON.parse(localStorage.getItem("won"));
  
  if (oldInitialBoard && oldSolvedBoard && oldLastBoard && noHints >=0 && noHints <= MAX_HINTS) {
    console.log("Loading Old Game!");
    return [
      oldInitialBoard,
      oldSolvedBoard,
      oldLastBoard,
      noHints,
      isWon,
    ];
  }
  else{
    console.log("Old Game Not Found.")
    return getNewGame();
  }
  
}

let invalidCells = Array.from({ length: 9 }, () => Array(9).fill(0));

export default function Game() {
  let [initialSudokuBoard, solvedSudokuBoard, currBoard, noHints, isWon] = getOldGame();
  const [board, setBoard] = useState(currBoard);
  const [won, setWon] = useState(isWon);
  const [hints, setHints] = useState(noHints);
  
  
  function newGame() {
    invalidCells = Array.from({ length: 9 }, () => Array(9).fill(0));
    const [newInitialSudokuBoard, newSolvedSudokuBoard, currBoard, noHints] = getNewGame();
    setBoard(currBoard);
    setHints(noHints);
    setWon(false);
    // setHintUsed(false);
    initialSudokuBoard = newInitialSudokuBoard;
    solvedSudokuBoard = newSolvedSudokuBoard;
  }
  
  function restart() {
    
    invalidCells = Array.from({ length: 9 }, () => Array(9).fill(0));
    setWon(false);
    // setHintUsed(false);
    setHints(MAX_HINTS);
    setBoard(initialSudokuBoard);
    refreshStorage(initialSudokuBoard, MAX_HINTS, false)
  }
  
  function refreshStorage(newBoard, newHints, won){
    localStorage.setItem("lastSudokuBoard", JSON.stringify(newBoard));
    localStorage.setItem("noHints", String(newHints));
    localStorage.setItem("won", String(won));
  }

  function checkWon(board){
    if (isValidSudoku(board) && !hasNulls(board)) {
      setWon(true);
      refreshStorage(board, hints, true)
      return true;
    }
    return false
  }
  
  function updateBoard(board) {
    invalidCells = getInvalidCellMatrix(board, initialSudokuBoard);
    if (checkWon(board)){}
    else{
    setBoard(board);
    
    refreshStorage(board, hints, false)
    }
  }
  
  function updateHints() {
    
    if (!hints) {
      console.log("No hints left");
      updateBoard(board)
      
    } else {
      
      
      let newHint = getHint(currBoard, solvedSudokuBoard);
      
      if(newHint){
        const [row, col, number] = newHint
        board[row][col] = number
      }
      setHints(hints - 1);
      setBoard(board);
      
      if (checkWon(board)) {
        refreshStorage(board, (hints-1), true)
      }
      else{
        refreshStorage(board, (hints-1), false)
      }

    }
  }
  
  console.log("sdfA",invalidCells)
  if (won) {
    return (
      <div>
        <p>won</p>
        <button onClick={newGame}>New Game!</button>
      </div>
    );
  } else {
    return (
      <div className='game'>
        <div style={{ marginTop:"10px",display: 'flex'}}>
          <button onClick={newGame} className="newgame"style={{ margin: '20px' }}>New Game!</button>
          <button onClick={restart} className="restart"style={{ margin: '20px' }}>Restart!</button>
        </div>
        <Board
          board={board}
          setBoard={updateBoard}
          initialBoard={initialSudokuBoard}
          // invalidCellMatrix={Array.from({ length: 9 }, () => Array(9).fill(0))}
          invalidCellMatrix={invalidCells}
        />
        <HintButton noOfHints={hints} setNoOfHints={updateHints} />
      </div>
    );
  }
}
