<script setup>
    import BackButton from '../BackButton.vue'
    import Board from '../Board.vue'
    import { ref } from 'vue'
    import { update, checkWin } from "../../board"

    let board = ref([])
    let winner = ref([0])
    let last = 2
    let gameFinished = ref(false)
    reset()

    function insert(column) {
        if (gameFinished.value) return
        if (board.value[column][0] != 0) return

        let toSet
        if (last == 2) toSet = 1
        else toSet = 2
        board.value[column][0] = toSet
        board.value = update(board.value)
        last = toSet

        winner.value = checkWin(board.value)
        if (winner.value != 0) gameFinished.value = true
    }

    function reset() {
        board.value = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]
        ]
        winner.value = 0
        last = 2
        gameFinished.value = false
    }
</script>

<template>
    <div class="game">
        <BackButton/>
        <Board @insert="(col) => insert(col)" :board="board" :finished="gameFinished" :winner="winner" :turn="gameFinished ? '0' : '1'" :users="['Green', 'Red']"/>
        <button @click="reset" class="reset-button">Reset</button>
    </div>
</template>

<style scoped>
    .game {
        width: 100%;
        display:flex;
        flex-direction: column;
        align-items: center;
    }

    .reset-button {
        width: 5rem;
        margin: 20px auto;
        padding: 1rem;
        background-color: rgb(244, 47, 47);
        border-radius: 10px;
        border-style: none;
        color: white;
        align-self: center;
    }

    .reset-button:active {
        transform: translateY(-4px);
    }

    .reset-button:hover {
        background-color: red;
        color: yellow;
    }
</style>