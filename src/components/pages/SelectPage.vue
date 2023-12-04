<script setup>
    import { useWS } from "@/stores/ws"
    import { ref } from "vue"
    import UsernameInput from "../UsernameInput.vue";
    
    $cookies.remove("game")
    $cookies.remove("other")
    let connected = ref(false)
    let usernameValid = ref(false)
    let username = ref("")

    if ($cookies.isKey("username"))
        updateUsername()

    let ws = useWS()
    connect()

    function go(loc) {
        window.location.hash = loc
    }

    function updateUsername(name) {
        username.value = $cookies.get("username")
        usernameValid.value = username.value.length >= 3 && !username.value.includes(" ")
    }

    function connect() {
        ws.conn = new WebSocket(import.meta.env.VITE_SERVER_ADDR + "/connect")
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
    <UsernameInput load="true" class="usernameInput" @username-changed="updateUsername"/>
    <div class="selection">
        <button class="btn-local-singleplayer" @click="go('/play/local/singleplayer')">Singleplayer</button>
        <button class="btn-local-multiplayer" @click="go('/play/local/multiplayer')">Multiplayer</button>
        <h1>Local</h1>
        
        <h2 class="seperator"><span>OR</span></h2>
        
        <h1>Online</h1>
        <button class="btn-online-bot" @click="go('/play/online/bot')" :disabled="!connected || !usernameValid">Singleplayer</button>
        <button class="btn-online-join" @click="go('/play/online/join')" :disabled="!connected || !usernameValid">Multiplayer</button>
        <p class="connectedDisplay">{{ connected ? "Connected" : "Not connected" }}</p>
        <button class="reconnect" @click="connect" v-if="!connected">Reconnect</button>
    </div>
    <button class="scoreboardBtn" @click="go('/scoreboard')">Scoreboard (Online Singleplayer)</button>
</template>

<style scoped>
    .usernameInput {
        margin: 0 auto;
    }

    .reconnect {
        min-width: 0;
        padding: 0;
        position: absolute;
        bottom: 0;
        left: 7rem;
        height: 2rem;
        font-size: large;
        width: 10rem;
    }

    .connectedDisplay {
        position: absolute;
        bottom: 1rem;
        left: 0;
    }

    .selection {
        width: 100%;
        margin-bottom: 5rem;
    }

    button {
        min-width: 20vw;
        min-height: min(max(10vh, 1rem), 1rem);
        font-size: min(max(3vw, 1rem), 3rem);
        margin: 10px;
        height: 40%;
        padding: 0px 1rem;
        border-style: none;
        border-radius: 10px;
        text-align: center;
    }

    .scoreboardBtn {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10rem;
        height: 7rem;
        font-size: 2vw;
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

    .btn-online-bot {
        background-color: green;
    }

    .btn-online-join {
        background-color: rgb(249, 43, 43);
    }

    h1 {
        text-align: center;
        user-select: none;
        font-size: min(max(3vw, 1.5rem), 3rem);
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