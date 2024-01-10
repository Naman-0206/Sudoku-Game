import random
from pprint import  pprint
from collections import Counter

def getSudoku():
    def is_possible(board, row, col, num):
        # Checking row
        for idx_col in range(len(board)):
            if board[row][idx_col] == str(num):
                return False

        # Checking col
        for idx_row in range(len(board[0])):
            if board[idx_row][col] == str(num):
                return False

        # Checking small box
        row_factor = row - (row % 3)
        col_factor = col - (col % 3)
        for r in range(0 + row_factor, 3 + row_factor):
            for c in range(0 + col_factor, 3 + col_factor):
                if board[r][c] == str(num):
                    return False

        return True

    def rec_func(board):

        empty_cell = find_empty_cell(board)
        if not empty_cell:
            return True 

        row, col = empty_cell

        choices_taken = []
        while(len(choices_taken)<9):

            num = random.choice(range(1,10))
            if(num in choices_taken):
                continue
            choices_taken.append(num)
            if is_possible(board, row, col, num):
                board[row][col] = str(num)
                if rec_func(board):
                    return True
                board[row][col] = 0

        return False

    def find_empty_cell(board):
        for i in range(len(board)):
            for j in range(len(board[0])):
                if board[i][j] == 0:
                    return i, j
        return None

    def isUnique(board):

        empty_cell = find_empty_cell(board)

        if not empty_cell:
            global count
            count += 1
            return True

        row, col = empty_cell

        for num in range(1,10):
            if count>1: return False
            if is_possible(board, row, col, num):
                board[row][col] = str(num)
                isUnique(board)
                board[row][col] = 0

        return False



    sudoku = [[0]*9 for i in range(9)]
    rec_func(sudoku)
    # pprint(sudoku)
    solvedSukoku = sudoku

    coordinates = [(i, j) for i in range(9) for j in range(9)]

    noOfRemoved = random.choice(range(50,60))

    # print(81 - noOfRemoved)

    while coordinates and noOfRemoved:
        
        (r,c) = random.choice(coordinates)
        coordinates.remove((r,c))
        
        n = sudoku[r][c]
        sudoku[r][c] = 0
        
        count = 0
        isUnique(sudoku)
        
        if count == 1:
            noOfRemoved -= 1
        else:
            sudoku[r][c] = n

    # pprint(sudoku)
    # print(sum(elem != 0 for row in sudoku for elem in row))
    # print(coordinates, noOfRemoved)
    
    return sudoku, solvedSukoku




def getInvalidCellMatrix(currBoard, initialBoard):
    invalidCells = [[0]*9 for _ in range(9)]

    # Check row
    for r in range(9):
        row_counter = Counter(currBoard[r])
        for c in range(9):
            if currBoard[r][c] is not None and row_counter[currBoard[r][c]] > 1 and currBoard[r][c] != initialBoard[r][c]:
                invalidCells[r][c] = 1

    # Check column
    for c in range(9):
        col_counter = Counter(currBoard[i][c] for i in range(9))
        for r in range(9):
            if currBoard[r][c] is not None and col_counter[currBoard[r][c]] > 1 and currBoard[r][c] != initialBoard[r][c]:
                invalidCells[r][c] = 1

    # Check small boxes
    for i in range(0, 9, 3):
        for j in range(0, 9, 3):
            box_counter = Counter(currBoard[x][y] for x in range(i, i+3) for y in range(j, j+3))
            for x in range(i, i+3):
                for y in range(j, j+3):
                    if currBoard[x][y] is not None and box_counter[currBoard[x][y]] > 1 and currBoard[x][y] != initialBoard[x][y]:
                        invalidCells[x][y] = 1

    return invalidCells


