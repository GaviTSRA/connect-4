<script setup>
    function back() {
        window.location.hash = "/"
    }
</script>

<template>
    <button class="button-back" @click="back">Back</button>
</template>

<style scoped>
    .button-back {
        z-index: 99;
        position: absolute;
        top: 0;
        left: 0;
        height: 2rem;
        width: 6rem;
        background-color: red;
        border-style: none;
        border-radius: 10px;
    }
    .button-back:hover {
        background-color: rgb(248, 40, 40);
    }

    .button-back:active {
        background-color: white;
    }
</style>