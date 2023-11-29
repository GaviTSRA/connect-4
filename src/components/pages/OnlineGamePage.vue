<script setup>
    import { useWS } from '../../stores/ws';
    import BackButton from '../BackButton.vue';
    import Board from '../Board.vue';
    import { ref } from "vue"

    let board = ref([])
    let winner = ref([0])
    let gameFinished = ref(false)

    let ws = useWS()
    ws.conn.onmessage = (msg) => {
        let args = msg.data.split(" ")
        if (args[0] == "board") {
            board.value = JSON.parse(args[1])
        }
    }

    function insert(col) {
        ws.conn.send("turn " + col)
    }
</script>

<template>
    <div class="game">
        <BackButton/>
        <Board @insert="(col) => insert(col)" :board="board" :finished="gameFinished" :winner="winner"/>
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