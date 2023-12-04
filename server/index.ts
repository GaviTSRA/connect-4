import cors from "cors"
import WebSocket from "ws"
import express from "express"
import expressWs from "express-ws"
import { update, checkWin, getNextMove } from "../src/board.js"
import * as fs from "fs"

const app = expressWs(express()).app
const port = 3000

let games: { [id: string] : [
    userA: string, 
    userB: string | undefined, 
    board: number[][], 
    userAWS: WebSocket, 
    userBWS: WebSocket | undefined, 
    turn: number, 
    isPublic: boolean,
    isFinished: boolean,
    userARematch: boolean,
    userBRematch: boolean
]} = {}

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

        const isFirstUser: boolean = games[gameID][0] == username
        if (games[gameID][1] != undefined) {
            if (isFirstUser) {
                games[gameID][4]?.send("rematch -1")
            } else {
                games[gameID][3].send("rematch -1")
            }
            console.log(`[${gameID}] Rematch canceled`)
            if (!games[gameID][7]) {
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
        }
        delete games[gameID]
    })

    ws.on('message', (message: string) => {
        const args: string[] = message.split(" ")
        const command: string = args[0]

        if (command == "scoreboard") {
            ws.send("scoreboard " + JSON.stringify(getScoreboardData("bot")))
        }

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
                args[1] == "1",
                false,
                false,
                false
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
            if (!games[id] || games[id][7]) return
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
                    games[id][7] = true
                    console.log(`[${id}] ${games[id][winner-1]} won`)
                    return
                }

                if (turn == 1) games[id][5] = 0
                else games[id][5] = 1
            }
        }

        else if (command == "rematch" && args.length == 2) {
            const id: string = args[1]
            if (!games[id] || !games[id][7]) return

            if (games[id][0] == username) {
                games[id][8] = true
                games[id][3].send("rematch 1")
                games[id][4]?.send("rematch 1")
                console.log(`[${gameID}] Rematch accepted by ${games[id][0]}`)
            } else if (games[id][1] == username) {
                games[id][9] = true
                games[id][3].send("rematch 1")
                games[id][4]?.send("rematch 1")
                console.log(`[${gameID}] Rematch accepted by ${games[id][1]}`)
            }

            if (games[id][8] && games[id][9]) {
                console.log(`[${gameID}] Rematch starting`)
                games[id][2] = [
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0]
                ],
                games[id][5] = 0
                games[id][7] = false
                games[id][8] = false
                games[id][9] = false

                const board = games[id][2]
                games[id][3].send("rematch 2")
                games[id][4]?.send("rematch 2")
                games[id][3].send("board " + JSON.stringify(board))
                games[id][4]?.send("board " + JSON.stringify(board))
            }
        }

        else if (command == "games") {
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
    let finished = false
    let timeStarted = Date.now()
    let turns = 0
    let finalTime = -1
    
    ws.on("close", () => {

    })

    ws.on('message', (message: string) => {
        const args: string[] = message.split(" ")
        const command: string = args[0]

        if (command == "username" && args.length ==  2 && finished) {
            username = args[1]
            console.log(`[Bot Login] ${username}`)
            ws.send("best " + insertIntoScoreboard("bot", username, turns, finalTime) + " " + turns + " " + finalTime)
        } 

        if (command == "rematch" && finished) {
            console.log(`[Bot ${username}] Rematch started`)
            finished = false
            turn = 1
            game = [
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0]
            ]
            timeStarted = Date.now()
            turns = 0
            ws.send("rematch")
            ws.send("board " + JSON.stringify(game))
        }

        if (command == "turn" && turn == 1 && args.length == 2 && !finished) {
            const col = parseInt(args[1])
            if (game[col][0] != 0) return
            turn = 2
            console.log(`[Bot ${username}] Played ${col}`)
            game[col][0] = 1
            game = update(game)
            ws.send("board " + JSON.stringify(game))
            turns += 1

            if (checkWin(game) == 1) {
                ws.send("winner 1")
                finished = true
                finalTime = Date.now() - timeStarted
                ws.send("best false " + turns + " " + finalTime)
                return
            }

            const nextMove = getNextMove(game)
            game[nextMove][0] = 2
            game = update(game)

            if (checkWin(game) != 0) {
                finished = true
                ws.send("winner " + checkWin(game))
            }

            setTimeout(() => {
                ws.send("board " + JSON.stringify(game))
                turn = 1
            }, 500)
        }
    })
})

function insertIntoScoreboard(scoreboardName: string, username: string, turns: number, finalTime: number) {
    const filename = scoreboardName + ".json"
    if (!fs.existsSync(filename)) fs.writeFileSync(filename, "{}", "utf-8")
    
    let data: {
        [username: string] : [
            turns: number,
            finalTime: number
        ]
    } = JSON.parse(fs.readFileSync(filename, "utf-8"))

    let newBest = false
    if (username in data) {
        if (data[username][0] > turns || (data[username][0] == turns && data[username][1] > finalTime)) {
            data[username] = [turns, finalTime]
            console.log(`[Bot ${username}] New Best! ${turns} turns in ${finalTime}`)
            newBest = true
        }
    } else {
        data[username] = [turns, finalTime]
    }

    fs.writeFileSync(filename, JSON.stringify(data), "utf-8")
    return newBest
}

function getScoreboardData(scoreboard: string) {
    let filename = scoreboard + ".json"
    if (!fs.existsSync(filename)) fs.writeFileSync(filename, "{}", "utf-8")

    let data: {
        [username: string] : [
            turns: number,
            finalTime: number
        ]
    } = JSON.parse(fs.readFileSync(filename, "utf-8"))
    let finalData: [
        username: string,
        turns: number,
        time: number
    ][] = []

    Object.entries(data).forEach(
        ([username, value]) => {
            finalData.push([username, value[0], value[1]])
        }
    )

    finalData.sort((a, b) => {
        if (a[1] > b[1] || (a[1] == b[1] && a[2] > b[2]))
            return 1
        else return -1
    })

    return finalData
}

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})