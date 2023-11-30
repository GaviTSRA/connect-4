<script setup>    
    import Cell from "./Cell.vue"
    import { watch, ref } from "vue"
    import JSConfetti from "js-confetti"
    
    const jsConfetti = new JSConfetti()
    let emit = defineEmits(["insert"])
    let props = defineProps(["board", "finished", "winner", "turn", "users"])
    let enter = ref(false)
    let lastBoard = ref([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ])
    let newColumn = ref(0)
    let newRow = ref(0)

    watch(
        () => props.winner, 
        () => {
            if (props.winner == 0) return 
            if (props.winner == 3) return
            if (props.turn == 1) return
            jsConfetti.addConfetti()
    })

    watch(
        () => props.board,
        () => {
            for (let row=0; row<6; row++) {
                for (let column=0; column<7; column++) {
                    if (lastBoard.value[column][row] != props.board[column][row]) {
                        newColumn.value = column
                        newRow.value = row
                    }
                }
            }
            enter.value = true
            setTimeout(() => {
                enter.value = false
            }, 190)
            lastBoard.value = JSON.parse(JSON.stringify(props.board))
        }
    )

    function insert(index) {
        emit("insert", index)
    }
</script>

<template>
    <p v-if="props.winner == 3" class="winner">Draw!</p>
    <p v-if="props.finished && props.winner != 3" class="winner">{{ props.winner == 1 ? props.users[0] : props.users[1] }} won!</p>
    <div class="board">
        <div class="column" v-for="(column, index) in props.board">
            <button class="insert-button" v-if="!props.finished" @click="insert(index)" @touchend="insert(index)">
                <img v-if="props.board[index][0] == 0 && props.turn == 1" src="/arrow.png"/>
            </button>
            <div class="element" v-for="(element, rowIndex) in column">
               <!-- <Cell @click="insert(index)" @touchend="insert(index)" :value="element" /> -->
               <Cell :class="{ anim: enter && newColumn == index && newRow == rowIndex}" @click="insert(index)" @touchend="insert(index)" :value="element" :hidden="element == 0"/>
               <Cell class="secondaryCell" :value="0" :hidden="element != 0 && !(enter && newColumn == index && newRow == rowIndex)"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .secondaryCell {
        z-index: 0;
        position: absolute;
        height: 6vw;
        width: 6vw;
    }
    .anim {
        animation: enter .2s linear;
    }
    @keyframes enter {
        0% {
            transform: translateY(-1000px);
        }
        50% {
            transform: translateY(-500px);
        }
        100% {
            transform: none;
        }
    }

    .column {
        width: 6vw;
    }
    .board {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        justify-content: center;
        border-radius: 20px;
        border-width: 10px;
        border-style: solid;
        border-top-style: none;
        background-color: rgb(64, 64, 64);
        border-color: rgb(64, 64, 64);
    }

    .element {
        display: grid;
        width: 100%;
        height: 6vw;
        border-style: solid;
        border-radius: 10px;
        border-width: 1px;
        border-color: rgb(64, 64, 64);
        background-color: rgb(64, 64, 64);
    }

    .winner {
        text-align: center;
        font-size: 2rem;
        background-color: darkgreen;
        border-radius: 20px;
        margin-bottom: 1rem;
        color: aqua;
        padding: 0 1rem;
    }

    .insert-button {
        width: 6vw;
        height: 6vw;
        margin-bottom: 10px;
        border-style: none;
        background-color: rgb(64, 64, 64);
        border-radius: 10px;
    }

    .insert-button:active {
        transform: translateY(4px);
    }

    img {
       width: 6vw; 
    }

    img:hover {
        filter:brightness(100)
    }
</style>