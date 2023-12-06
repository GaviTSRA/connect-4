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

function copyBoard(board) {
    return JSON.parse(JSON.stringify(board))
}

function getNextMove(board) {
    let _options = [0, 1, 2, 3, 4, 5, 6]
    
    // Remove all full columns from possible placements
    let options = []
    for (let option of _options) {
        if (board[option][0] != 0) continue
        options.push(option)
    }

    // Check if the bot could win
    let winningMove = checkWinningMove(board, options, 2)
    if (winningMove != -1) return winningMove

    // Check if the opponent could win next turn
    let blockWinMove = checkWinningMove(board, options, 1)
    if (blockWinMove != -1) return blockWinMove

    let finalOptions = []
    for (let option of options) {
        if (hasDoubleWinIn(board, 1, options, option)) continue
        let copy = copyBoard(board)
        copy[option][0] = 2
        copy = update(copy)
        if (checkWin(board) == 1) continue
        finalOptions.push(option)
    }

    //Don't block own win options
    let finalGoodOptions = []
    for (let option of finalOptions) {
        let copy = copyBoard(board)
        copy[option][0] = 2
        copy = update(copy)
        if (checkWin(board) == 2) continue
        finalGoodOptions.push(option)
    }

    // If every move lets the opponent win, use all possible columns as options
    if (finalGoodOptions.length == 0) finalGoodOptions = finalOptions
    if (finalGoodOptions.length == 0) finalGoodOptions = options

    console.log(finalGoodOptions)
    
    // If no good move is found, choose one at random
    let chosen =  finalGoodOptions[Math.floor(Math.random()*finalGoodOptions.length)]
    return chosen;
}

function hasDoubleWinIn(board, turns, options, option) {
    if (turns == 0) return false

    if (board[option][0] != 0) return false
    let copy = copyBoard(board)
    copy[option][0] = 2
    copy = update(copy)

    for (let optionEnemy of options) {
        if (copy[optionEnemy][0] != 0) continue
        let copyEnemy = copyBoard(copy)
        copyEnemy[optionEnemy][0] = 1
        copyEnemy = update(copyEnemy)
        if (checkHasDoubleWin(copyEnemy, options)) return true

        for (let o of options) {
            if (hasDoubleWinIn(copyEnemy, turns-1, options, o)) return true
        }
    }
    return false
}

function checkHasDoubleWin(board, options) {
    const possibleWin = checkWinningMove(board, options, 1)
    if (possibleWin != -1) {
        board[possibleWin][0] = 2
        board = update(board)
        if (checkWinningMove(board, options, 1) != -1) return true
    }
    return false
}

function checkWinningMove(board, options, user) {
    for (let option of options) {
        if (board[option][0] != 0) continue
        let copy = copyBoard(board)
        copy[option][0] = user
        copy = update(copy)
        if (checkWin(copy) == user) {
            return option
        }
    }
    return -1
}

export {
    update,
    checkWin,
    getNextMove
}