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

    let ws = new WebSocket("ws://localhost:3000/bot")
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
    }

    function insert(col) {
        if (board.value[col][0] != 0) return
        ws.send("turn " + col)
    }
</script>

<template>
    <div class="game">
        <BackButton/>
        <p class="other"><span class="user">{{ username }}</span> VS <span class="otherUser">Bot</span></p>
        <Board @insert="(col) => insert(col)" :board="board" :finished="gameFinished" :winner="winner" :turn="turn" :users="[username, 'Bot']"/>
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
</style>