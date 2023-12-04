<script setup>
    import { useWS } from '../../stores/ws';
    import BackButton from '../BackButton.vue';
    import Board from '../Board.vue';
    import { ref } from "vue"
    import JSConfetti from 'js-confetti'
    import Scoreboard from '../Scoreboard.vue';
    const jsConfetti = new JSConfetti()

    let board = ref([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ])
    let winner = ref([0])
    let gameFinished = ref(false)
    let turn = ref(true)
    let emit = defineEmits(["changeParticle"])
    let newBest = ref(false)
    let turns = ref(0)
    let beatTime = ref(0)

    if (!$cookies.isKey("username"))
        window.location.hash = ""

    let username = ref($cookies.get("username"))

    let ws = new WebSocket(import.meta.env.VITE_SERVER_ADDR + "/bot")

    ws.onopen = () => {
        ws.send("username " + username.value)
    }

    ws.onclose = () => {
        window.location.hash = ""
    }

    ws.onmessage = (msg) => {
        let args = msg.data.split(" ")
        if (args[0] == "board") {
            board.value = JSON.parse(args[1])
            if (turn.value == "1") turn.value = "0"
            else turn.value = "1"
        }
        if (args[0] == "winner") {
            turn.value = "1"
            gameFinished.value = true
            winner.value = args[1]
        }
        if (args[0] == "rematch") {
            winner.value = 0
            turn.value = "0"
            gameFinished.value = false
            newBest.value = false
        }
        if (args[0] == "best") {
            jsConfetti.addConfetti()
            beatTime.value = Math.ceil(args[3])
            turns.value = args[2]
            
            if (args[1] == "true") {
                newBest.value = true
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        jsConfetti.addConfetti()
                    }, i * 500)
                }            
            }
        }
    }

    function insert(col) {
        if (board.value[col][0] != 0) return
        ws.send("turn " + col)
    }

    function doRematch() {
        ws.send("rematch")
    }
</script>

<template>
    <div class="page">
        <div class="game">
            <BackButton/>
            <p class="other"><span class="user">{{ username }}</span> VS <span class="otherUser">Bot</span></p>
            <Board @insert="(col) => insert(col)" :board="board" :finished="gameFinished" :winner="winner" :turn="turn" :users="[username, 'Bot']"/>
            <button @click="doRematch" class="reset-button" v-if="gameFinished">Rematch</button>
            <div class="newBest" v-if="gameFinished && winner == 1">
                <h1>{{ newBest ? "New Best!" : "You won!"}}</h1>
                <p>{{ turns }} turns in {{ beatTime / 1000 }} seconds</p>
            </div>
        </div>
        <Scoreboard class="scoreboard" />
    </div>
</template>

<style>
    .page {
        display: flex;
        flex-direction: row;
    }

    .scoreboard {
        margin-left: 1rem;
        width: 35vw;
    }

    .newBest{
        position: absolute;
        top: 40%;   
        background-color: rgba(.6, .6, .6, .8);
        padding: 3vw;
        border-radius: 10px;
        text-align: center;
        font-size: 1vw;
        color: aqua;
    }
    .user {
        color: green;
    }
    .otherUser {
        color: red;
    }
    .other {
        position: absolute;
        top: 1rem;
        font-size: 2rem;
    }

    .game {
        width: 100%;
        display:flex;
        flex-direction: column;
        align-items: center;
    }

    .reset-button {
        width: 15vw;
        margin: 20px auto;
        padding: 1rem;
        background-color: rgb(57, 231, 86);
        border-radius: 10px;
        border-style: none;
        color: black;
        align-self: center;
        font-size: 2vw;
    }

    .reset-button:active {
        transform: translateY(-4px);
    }

    .reset-button:hover {
        background-color: rgb(5, 158, 79)0, 255, 110);
    }

    .reset-button[disabled] {
        background-color: gray;
        color: rgb(70, 70, 70);
    }
</style>