<script setup>
    import { useWS } from '../../stores/ws';
    import BackButton from '../BackButton.vue';
    import Board from '../Board.vue';
    import { ref } from "vue"

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
            gameFinished.value = true
            winner.value = args[1]
        }
        if (args[0] == "rematch") {
            winner.value = 0
            turn.value = "0"
            gameFinished.value = false
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
    <div class="game">
        <BackButton/>
        <p class="other"><span class="user">{{ username }}</span> VS <span class="otherUser">Bot</span></p>
        <Board @insert="(col) => insert(col)" :board="board" :finished="gameFinished" :winner="winner" :turn="turn" :users="[username, 'Bot']"/>
        <button @click="doRematch" class="reset-button" v-if="gameFinished">Rematch</button>
    </div>
</template>

<style>
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
        width: 10rem;
        margin: 20px auto;
        padding: 1rem;
        background-color: rgb(57, 231, 86);
        border-radius: 10px;
        border-style: none;
        color: black;
        align-self: center;
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