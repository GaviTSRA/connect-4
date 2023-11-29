<script setup>    
    import Cell from "./Cell.vue"
    
    let props = defineProps(["board", "finished", "winner", "turn"])
</script>

<template>
    <p v-if="props.winner == 3" class="winner">Draw!</p>
    <p v-if="props.finished && props.winner != 3" class="winner">{{ props.winner == 1 ? "Green" : "Red" }} won!</p>
    <div class="board">
        <div v-for="(column, index) in props.board">
            <button class="insert-button" v-if="!props.finished && props.turn == 1" @click="$emit('insert', index)">
                <img v-if="props.board[index][0] == 0" src="arrow.png"/>
            </button>
            <div class="element" v-for="element in column">
               <Cell :value="element"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .board {
        max-width: 28rem;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        justify-content: center;
    }

    .element {
        max-width: 4rem;
        border-style: solid;
        border-width: 1px;
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
        background-color: var(--color-background);
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