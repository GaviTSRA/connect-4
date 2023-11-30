<script setup>
    import BackButton from '../BackButton.vue';
    import Board from '../Board.vue';
    import { ref } from "vue"
    import { update, checkWin, getNextMove } from "../../board"

    let board = ref([])
    let winner = ref([0])
    let last = ref(2)
    let gameFinished = ref(false)
    reset()

    function insert(column, bot) {
        if (gameFinished.value) return
        if (board.value[column][0] != 0) return
        if (last.value == 1 && !bot) return

        let toSet
        if (last.value == 2) toSet = 1
        else toSet = 2
        board.value[column][0] = toSet
        board.value = update(board.value)
        board.value = JSON.parse(JSON.stringify(update(board.value)))
        last.value = toSet

        winner.value = checkWin(board.value)
        if (winner.value != 0) {
            gameFinished.value = true
            return
        }
        if (bot) return
        
        let move = getNextMove(board.value)
        setTimeout(() => {
            insert(move, true)
        }, 500)
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
        last.value = 2
        gameFinished.value = false
    }
</script>

<template>
    <BackButton />
    <Board @insert="(col) => insert(col, false)" :board="board" :finished="gameFinished" :winner="winner" :turn="last == 1 ? '0' : '1'" :users="['You', 'The bot']"/>
    <button @click="reset" class="reset-button">Reset</button>
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