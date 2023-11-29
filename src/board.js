function update(board) {
    for (let row=0; row<6; row++) {
        for (let column=0; column<7; column++) {
            if (row == 6) continue
            if (board[column][row] != 0 && board[column][row+1] == 0) {
                board[column][row+1] = board[column][row]
                board[column][row] = 0
            }
        }
    }

    return board
}

function checkWin(board) {
    for (let row=0; row<6; row++) {
        for (let column=0; column<7; column++) {
            let res = checkTile(board, column, row)
            if (res != 0) return res 
        }
    }
    let draw = true
    for (let column=0; column<7; column++) {
        if (board[column][0] == 0) draw = false
    }
    if (draw) return 3
    return 0
}

function checkTile(board, column, row) {
    let val = board[column][row]

    if(
        column >= 3 &&
        board[column-1][row] == val &&
        board[column-2][row] == val &&
        board[column-3][row] == val
    ) return val
    if(
        column <= 3 &&
        board[column+1][row] == val &&
        board[column+2][row] == val &&
        board[column+3][row] == val
    ) return val

    if(
        row >= 3 &&
        board[column][row-1] == val &&
        board[column][row-2] == val &&
        board[column][row-3] == val
    ) return val
    if(
        row <= 2 &&
        board[column][row+1] == val &&
        board[column][row+2] == val &&
        board[column][row+3] == val
    ) return val

    if(
        row >=3 && column >= 3 &&
        board[column-1][row-1] == val &&
        board[column-2][row-2] == val &&
        board[column-3][row-3] == val
    ) return val
    if(
        row >=3 && column <= 3 &&
        board[column+1][row-1] == val &&
        board[column+2][row-2] == val &&
        board[column+3][row-3] == val
    ) return val
    if(
        row <=2 && column >= 3 &&
        board[column-1][row+1] == val &&
        board[column-2][row+2] == val &&
        board[column-3][row+3] == val
    ) return val
    if(
        row <=2 && column <= 3 &&
        board[column+1][row+1] == val &&
        board[column+2][row+2] == val &&
        board[column+3][row+3] == val
    ) return val

    return 0
}

export {
    update,
    checkWin
}