<script setup>
    import { useWS } from "@/stores/ws"
    
    $cookies.remove("game")
    $cookies.remove("other")

    let ws = useWS()
    
    if (ws.conn == undefined) {
        ws.conn = new WebSocket("ws://localhost:3000/connect")
    }

    function go(loc) {
        window.location.hash = loc
    }
</script>

<template>
    <div class="selection">
        <button class="btn-local-singleplayer" @click="go('/play/local/singleplayer')">Singleplayer</button>
        <button class="btn-local-multiplayer" @click="go('/play/local/multiplayer')">Multiplayer</button>
        <h1>Local</h1>
        
        <h2 class="seperator"><span>OR</span></h2>
        
        <h1>Online</h1>
        <button class="btn-online-create" @click="go('/play/online/create')">Create game</button>
        <button class="btn-online-join" @click="go('/play/online/join')">Join game</button>
        <p class="connectedDisplay">{{ ws.conn == undefined ? "Not connected" : "Connected" }}</p>
    </div>
</template>

<style scoped>
    .connectedDisplay {
        position: absolute;
        bottom: 0;
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

    .btn-local-singleplayer {
        background-color: rgb(147, 147, 254);
    }

    .btn-local-multiplayer {
        background-color: cadetblue;
    }

    .btn-online-create {
        background-color: green;
    }

    .btn-online-join {
        background-color: rgb(249, 43, 43);
    }

    h1 {
        text-align: center;
    }

    .seperator {
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