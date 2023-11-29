<script setup>
    import { useWS } from "@/stores/ws"
    import { ref } from "vue"
    
    $cookies.remove("game")
    $cookies.remove("other")
    let connected = ref(false)

    let ws = useWS()
    connect()

    function go(loc) {
        window.location.hash = loc
    }

    function connect() {
        ws.conn = new WebSocket("ws://localhost:3000/connect")
        ws.conn.addEventListener("open", (event => {
            connected.value = true
        }))
        ws.conn.addEventListener("error", (event => {
            connected.value = false
        }))
        ws.conn.addEventListener("close", (event => {
            connected.value = false
        }))
    }
</script>

<template>
    <div class="selection">
        <button class="btn-local-singleplayer" disabled="true" @click="go('/play/local/singleplayer')">Singleplayer</button>
        <button class="btn-local-multiplayer" @click="go('/play/local/multiplayer')">Multiplayer</button>
        <h1>Local</h1>
        
        <h2 class="seperator"><span>OR</span></h2>
        
        <h1>Online</h1>
        <button class="btn-online-create" @click="go('/play/online/create')" :disabled="!connected">Create game</button>
        <button class="btn-online-join" @click="go('/play/online/join')" :disabled="!connected">Join game</button>
        <p class="connectedDisplay">{{ connected ? "Connected" : "Not connected" }}</p>
        <button class="reconnect" @click="connect" v-if="!connected">Reconnect</button>
    </div>
</template>

<style scoped>
    .reconnect {
        position: absolute;
        bottom: 0;
        left: 7rem;
        height: 2rem;
    }
    .connectedDisplay {
        position: absolute;
        bottom: 1rem;
        left: 0;
    }

    .selection {
        width: 100%;
    }

    button {
        margin: 10px;
        height: 40%;
        font-size: large;
        padding: 0px 1rem;
        border-style: none;
        border-radius: 10px;
        text-align: center;
    }

    button:hover {
        background-color: rgb(0, 214, 214);
    }

    button:active {
        background-color: white;
    }

    button[disabled] {
        background-color: rgb(65, 65, 65);
        color: rgb(33, 40, 40);
    }

    .btn-local-singleplayer {
        background-color: rgb(147, 147, 254);
    }

    .btn-local-multiplayer {
        background-color: coral;
    }

    .btn-online-create {
        background-color: green;
    }

    .btn-online-join {
        background-color: rgb(249, 43, 43);
    }

    h1 {
        text-align: center;
        user-select: none;
    }

    .seperator {
        user-select: none;
        width: 100%; 
        text-align: center; 
        border-bottom: 1px solid gray; 
        line-height: 0.1em;
        margin: 2rem 0px;
    } 

    .seperator span { 
        background-color: var(--color-background);
        padding:0 10px; 
    }
</style>