const express = require("express")
const app = express()
const port = 3000
const cors = require("cors")
var expressWs = require('express-ws')(app)

// ID -> [usera, userb, board, useraws, userbws, turn(0 or 1), public?]
const games = {}

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

function makeID(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

app.use(cors())

app.ws("/connect", (ws, req) => {
    let username = undefined
    ws.on('message', (message) => {
        let args = message.split(" ")
        let command = args[0]

        if (command == "username" && args.length == 2) {
            username = args[1]
            console.log("Set name: " + username)
            ws.send("success")
        }
        if (command == "new" && username != undefined && args.length == 2) {
            let id = makeID(5)
            while (id in games) {
                id = makeID(5)
            }
            console.log(`Created game ${id} for ${username} (public: ${args[1] == "1"})`)
            games[id] = [
                username,
                undefined,
                [
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0]
                ],
                ws,
                undefined,
                0,
                args[1] == "1"
            ]
            ws.send("success "+id)
        }
        if (command == "join" && username != undefined && args.length == 2) {
            let id = args[1]
            if (games[id] == undefined) {
                ws.send("error notfound")
                return
            }
            if (games[id][1] != undefined) {
                ws.send("error gamefull")
                return
            }
            games[id][1] = username
            games[id][4] = ws
            games[id][3].send("join "+username)
            console.log(`${username} joined ${id}`)
            ws.send("success " + games[id][0])
        }
        if (command == "check" && args.length == 2) {
            let id = args[1]
            let turn = games[id][5]
            let isFirstUser = games[id][0] == username
            if (!isFirstUser && games[id][1] != username) return
            if (turn == 0 && isFirstUser)
                ws.send("turn 1")
            else if (turn == 1 && !isFirstUser)
                ws.send("turn 1")
            else
                ws.send("turn 0")
        }
        if (command == "turn" && args.length == 3) {
            let id = args[1]
            let turn = games[id][5]
            let action = args[2]
            if (games[id][turn] == username) {
                let board = games[id][2]
                board[action][0] = turn+1
                board = update(board)
                games[id][2] = board
                games[id][3].send("board " + JSON.stringify(board))
                games[id][4].send("board " + JSON.stringify(board))

                let winner = checkWin(board)
                if (winner != 0) {
                    games[id][3].send("winner " + winner)
                    games[id][4].send("winner " + winner)   
                }

                if (turn == 1) games[id][5] = 0
                else games[id][5] = 1
            }
        }
        if (command == "games") {
            let publicGames = []
            for (const [key, value] of Object.entries(games)) {
                if (value[6] && value[1] == undefined) {
                    publicGames.push([key, value[0]])
                }
            }
            console.log("games " + publicGames.length)
            ws.send("games " + JSON.stringify(publicGames))
        }
    })
})

app.get("/join", (req, res) => {
    if (!req.query.id) {
        res.sendStatus(400)
        return
    }
    if (!req.query.username) {
        res.sendStatus(400)
        return
    }
    if (games[req.query.id] == undefined) {
        console.log(req.query.id)
        console.log(games)
        res.sendStatus(404)
        return
    }
    if (games[req.query.id][1] != undefined) {
        res.sendStatus(401)
        return
    }
    games[req.query.id][1] = req.query.username
    res.send(games[req.query.id][0])
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})