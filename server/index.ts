import cors from "cors"
import WebSocket from "ws"
import express from "express"
import expressWs from "express-ws"
import { update, checkWin, getNextMove } from "../src/board"

const app = expressWs(express()).app
const port = 3000

let games: { [id: string] : [usera: string, userb: string | undefined, board: number[][], useraWS: WebSocket, userbWS: WebSocket | undefined, turn: number, isPublic: boolean]} = {}

function makeID(length: number) {
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

app.ws("/connect", (ws: WebSocket) => {
    let username: string | undefined = undefined
    let gameID: string | undefined = undefined
    ws.on("close", () => {
        if (username == undefined) return
        if (!gameID || !games[gameID]) return

        if (games[gameID][1] != undefined) {
            const isFirstUser: boolean = games[gameID][0] == username
            if (isFirstUser) {
                games[gameID][4]?.send("turn 0")
                games[gameID][4]?.send("winner 2")
                console.log(`[${gameID}] ${username} disconnected, ${games[gameID][1]} won`)
            } else {
                games[gameID][3].send("turn 0")
                games[gameID][3].send("winner 1")
                console.log(`[${gameID}] ${username} disconnected, ${games[gameID][0]} won`)
            }
        }
        delete games[gameID]
    })

    ws.on('message', (message: string) => {
        const args: string[] = message.split(" ")
        const command: string = args[0]

        if (command == "username" && args.length == 2) {
            username = args[1]
            ws.send("success")
            console.log("[Online Login] " + username)
        }

        else if (command == "new" && username != undefined && args.length == 2) {
            let id: string = makeID(5)
            while (id in games) {
                id = makeID(5)
            }
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
            gameID = id
            ws.send("success "+id)
            console.log(`[${id}] Created by ${username} (public: ${args[1] == "1"})`)
        }

        else if (command == "join" && username != undefined && args.length == 2) {
            const id: string = args[1]
            if (games[id] == undefined) {
                ws.send("error notfound")
                return
            }
            if (games[id][1] != undefined) {
                ws.send("error gamefull")
                return
            }
            gameID = id
            games[id][1] = username
            games[id][4] = ws
            games[id][3].send("join "+username)
            ws.send("success " + games[id][0])
            console.log(`[${id}] ${username} joined`)
        }

        else if (command == "check" && args.length == 2) {
            const id: string = args[1]
            if (!games[id]) return
            const turn: number = games[id][5]
            const isFirstUser: boolean = games[id][0] == username
            if (!isFirstUser && games[id][1] != username) return
            if (turn == 0 && isFirstUser)
                ws.send("turn 1")
            else if (turn == 1 && !isFirstUser)
                ws.send("turn 1")
            else
                ws.send("turn 0")

            ws.send("host " + games[id][0])
        }

        else if (command == "turn" && args.length == 3) {
            const id: string = args[1]
            const action: number = parseInt(args[2])
            if (!games[id]) return
            const turn: number = games[id][5]

            if (games[id][turn] == username) {
                let board = games[id][2]
                if(board[action][0] != 0) return

                console.log(`[${id}] ${username} played ${action}`)

                board[action][0] = turn+1
                board = update(board)
                games[id][2] = board
                games[id][3].send("board " + JSON.stringify(board))
                games[id][4]?.send("board " + JSON.stringify(board))

                const winner: number = checkWin(board)
                if (winner != 0) {
                    games[id][3].send("winner " + winner)
                    games[id][4]?.send("winner " + winner)
                    console.log(`[${id}] ${games[id][winner-1]} won`)
                    delete games[id]
                    return
                }

                if (turn == 1) games[id][5] = 0
                else games[id][5] = 1
            }
        }
        if (command == "games") {
            let publicGames: [id: string, username: string][] = []
            for (const [key, value] of Object.entries(games)) {
                if (value[6] && value[1] == undefined) {
                    publicGames.push([key, value[0]])
                }
            }
            ws.send("games " + JSON.stringify(publicGames))
        }
    })
})

app.ws("/bot", (ws: WebSocket) => {
    let game = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]
    let turn = 1
    let username: string | undefined = undefined
    
    ws.on("close", () => {

    })

    ws.on('message', (message: string) => {
        const args: string[] = message.split(" ")
        const command: string = args[0]

        if (command == "username" && args.length ==  2) {
            username = args[1]
            console.log(`[Bot Login] ${username}`)
        } 

        if (command == "turn" && turn == 1 && args.length == 2 && username != undefined) {
            const col = parseInt(args[1])
            turn = 2
            if (game[col][0] != 0) return
            console.log(`[Bot ${username}] Played ${col}`)
            game[col][0] = 1
            game = update(game)
            ws.send("board " + JSON.stringify(game))

            if (checkWin(game) == 1) {
                ws.send("winner 1")
                // TODO update leaderboard
                return
            }

            setTimeout(() => {
                const nextMove = getNextMove(game)
                game[nextMove][0] = 2
                game = update(game)
                ws.send("board " + JSON.stringify(game))
                turn = 1
    
                if (checkWin(game) == 2) {
                    ws.send("winner 2")
                }
            }, 500)
        }
    })
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})