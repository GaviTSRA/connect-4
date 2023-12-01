<script setup>
    import { ref } from "vue"

    let color = ref("black");
    let props = defineProps(["value"])
    
    function getColor() {
        return props.value == 0 ? "#222222" : props.value == 1 ? "green" : "red"
    }
    function getImg() {
        return props.value == 0 ? "" : props.value == 1 ? "/elf.png" : "/reindeer.png"
    }
</script>

<template>
    <div>
        <div v-if="props.value == 0" class="cell" :style="{'--color': getColor()}"></div>
        <img class="cell" :src="getImg()" v-if="props.value != 0"/>
    </div>
</template>

<style scoped>
    .cell {
        background-color: var(--color);
        border-radius: 50px;
        height: 98%;
        width: 98%;
        padding: 1%;
    }
</style>