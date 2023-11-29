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
    let turn = ref(false)

    let ws = useWS()
    ws.conn.onmessage = (msg) => {
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
        if (args[0] == "turn") {
            turn.value = args[1]
        }
    }
    ws.conn.send("check " + $cookies.get("game"))

    function insert(col) {
        ws.conn.send("turn " + $cookies.get("game") + " " + col)
    }
</script>

<template>
    <div class="game">
        <BackButton/>
        <Board @insert="(col) => insert(col)" :board="board" :finished="gameFinished" :winner="winner" :turn="turn"/>
    </div>
</template>

<style>
    .game {
        width: 100%;
        display:flex;
        flex-direction: column;
        align-items: center;
    }
</style>