<script setup>    
    import Cell from "./Cell.vue"
    import { watch } from "vue"
    import JSConfetti from "js-confetti"
    
    const jsConfetti = new JSConfetti()
    defineEmits(["insert"])
    let props = defineProps(["board", "finished", "winner", "turn", "users"])

    watch(
        () => props.winner, 
        () => {
            if(props.winner == 0) return 
            if(props.turn == 1) return
            jsConfetti.addConfetti()
    })
</script>

<template>
    <p v-if="props.winner == 3" class="winner">Draw!</p>
    <p v-if="props.finished && props.winner != 3" class="winner">{{ props.winner == 1 ? props.users[0] : props.users[1] }} won!</p>
    <div class="board">
        <div v-for="(column, index) in props.board">
            <button class="insert-button" v-if="!props.finished" @click="$emit('insert', index)">
                <img v-if="props.board[index][0] == 0 && props.turn == 1" src="arrow.png"/>
            </button>
            <div class="element" v-for="element in column">
               <Cell :value="element"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .board {
        max-width: 30rem;
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
        max-width: 4rem;
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
        width: 4rem;
        height: 4rem;
        margin-bottom: 10px;
        border-style: none;
        background-color: rgb(64, 64, 64);
        border-radius: 10px;
    }

    .insert-button:active {
        transform: translateY(4px);
    }

    img {
       width: 3.5rem; 
    }

    img:hover {
        filter:brightness(100)
    }
</style>