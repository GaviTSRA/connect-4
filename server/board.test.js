import { getNextMove, checkWin, update } from "../src/board"

// ===================================================================================
// ============================= Choose Winning moves ================================
// ===================================================================================
test("Chooses winning move straight left", () => {
    let board = [
        [0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]
    expect(getNextMove(board)).toBe(3)
})
test("Chooses winning move straight right", () => {
    let board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 2]
    ]
    expect(getNextMove(board)).toBe(3)
})
test("Chooses winning move straight up", () => {
    let board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 2, 2],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]
    expect(getNextMove(board)).toBe(3)
})
test("Chooses winning move top left", () => {
    let board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 2, 1],
        [0, 0, 0, 2, 1, 2],
        [0, 0, 0, 1, 2, 2]
    ]
    expect(getNextMove(board)).toBe(6)
})
test("Chooses winning move top right", () => {
    let board = [
        [0, 0, 0, 1, 2, 2],
        [0, 0, 0, 2, 1, 1],
        [0, 0, 0, 0, 2, 2],
        [0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]
    expect(getNextMove(board)).toBe(0)
})
test("Chooses winning move bottom left", () => {
    let board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 1],
        [0, 0, 0, 2, 1, 2],
        [0, 0, 2, 1, 2, 2]
    ]
    expect(getNextMove(board)).toBe(3)
})
test("Chooses winning move bottom right", () => {
    let board = [
        [0, 0, 2, 2, 1, 2],
        [0, 0, 0, 2, 1, 1],
        [0, 0, 0, 0, 2, 2],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]
    expect(getNextMove(board)).toBe(3)
})




// ===================================================================================
// ============================= Block Winning moves =================================
// ===================================================================================
test("Blocks winning move straight left", () => {
    let board = [
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]
    expect(getNextMove(board)).toBe(3)
})
test("Blocks winning move straight right", () => {
    let board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1]
    ]
    expect(getNextMove(board)).toBe(3)
})
test("Blocks winning move straight up", () => {
    let board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]
    expect(getNextMove(board)).toBe(3)
})
test("Blocks winning move top left", () => {
    let board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1, 2],
        [0, 0, 0, 1, 2, 1],
        [0, 0, 0, 2, 1, 1]
    ]
    expect(getNextMove(board)).toBe(6)
})
test("Blocks winning move top right", () => {
    let board = [
        [0, 0, 0, 2, 1, 1],
        [0, 0, 0, 1, 2, 1],
        [0, 0, 0, 0, 1, 2],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]
    expect(getNextMove(board)).toBe(0)
})
test("Blocks winning move bottom left", () => {
    let board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1],
        [0, 0, 0, 1, 1, 2],
        [0, 0, 1, 2, 2, 2]
    ]
    expect(getNextMove(board)).toBe(3)
})
test("Blocks winning move bottom right", () => {
    let board = [
        [0, 0, 1, 1, 2, 2],
        [0, 0, 0, 1, 2, 1],
        [0, 0, 0, 0, 1, 2],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]
    expect(getNextMove(board)).toBe(3)
})



// ===================================================================================
// ============================ Don't create win options =============================
// ===================================================================================
test("Don't create win options for enemy", () => {
    let board = [
        [0, 0, 0, 0, 1, 2],
        [0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 1, 2],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 1, 2],
        [0, 0, 0, 0, 0, 0]
    ]
    expect(getNextMove(board)).not.toBe(3)
})



// ===================================================================================
// ============================ Don't fall for double strat ==========================
// ===================================================================================
test("Don't fall for double strat", () => {
    let board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 0]
    ]
    let move = getNextMove(board)
    expect(move).not.toBe(1)
    expect(move).not.toBe(2)
    expect(move).not.toBe(5)
    expect(move).not.toBe(6)
})