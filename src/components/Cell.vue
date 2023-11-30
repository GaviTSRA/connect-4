<script setup>
    import { ref } from "vue"

    let color = ref("black");
    let props = defineProps(["value"])
    
    function getColor() {
        return props.value == 0 ? "#222222" : props.value == 1 ? "green" : "red"
    }
</script>

<template>
    <div class="cell" :style="{'--color': getColor()}"></div>
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