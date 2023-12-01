<script setup>
    import { useWS } from '../stores/ws';
    const ws = useWS()

    function back() {
        if (ws.conn != undefined)
            ws.conn.close()
        window.location.hash = ""
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
        height: 5vh;
        width: 10vw;
        background-color: red;
        border-style: none;
        border-radius: 10px;
        font-size: 2vw;
    }
    .button-back:hover {
        background-color: rgb(248, 40, 40);
    }

    .button-back:active {
        background-color: white;
    }
</style>