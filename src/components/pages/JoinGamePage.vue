<script setup>
    import { ref } from "vue"
    import BackButton from "../BackButton.vue";
    import { useWS } from "../../stores/ws";

    let username = ref($cookies.get("username"))
    let id = ref("")
    let status = ref(0)

    let ws = useWS()
    ws.conn.onmessage = (msg) => {
        let args = msg.data.split(" ")
        if (args[0] == "error") status.value = args[1]
        if (args[0] == "success" && args.length == 2) {
            $cookies.set("other", args[1])
            window.location.hash = "/play/online/waiting"
        }
        console.log(args)
        if (args[0] == "games") {
            games.value = JSON.parse(args[1])
            console.log(games.value)
        }
    }

    async function join(_id) {
        $cookies.set("username", username.value)
        $cookies.set("game", _id)
        ws.conn.send("username " + username.value)
        ws.conn.send("join " + _id)
    }

    async function joinGame() {
        $cookies.set("username", username.value)
        $cookies.set("game", id.value)
        
        ws.conn.send("username " + username.value)
        ws.conn.send("join " + id.value)
    }
    
    let games = ref([])
    ws.conn.send("games")
</script>

<template>
    <BackButton/>
    <label for="name">Username</label>
    <input v-model="username" type="text" id="name" name="name">
    <div class="publicGames">
        <div v-for="game in games" class="game">
            <p class="gameID">{{ game[0] }}</p>
            <p class="gameUser">{{ game[1] }}</p>
            <button class="joinBtn" @click="join(game[0])" :disabled="username.length < 3">Join</button>
        </div>
        <p v-if="games.length == 0">No public games!</p>
    </div>
    <div class="joinID">
        <label for="id">Game ID</label>
        <input v-model="id" type="text" id="id" name="id">
        <button class="submit" @click="joinGame" :disabled="username.length < 3 || id.length != 5 || username.includes(' ')">Join Game</button>
        <p v-if="status != 0">Error: {{ status }}</p>
    </div>
</template>

<style scoped>
    .gameID {
        color: white;
    }
    .gameUser {
        margin-left: 10px;
        color: aqua;
    }

    .joinBtn {
        margin-left: 20px;
        padding: .5rem 1rem;
        background-color: var(--color-background-mute);
        color: aqua;
        border:none;
        border-radius: 10px;
    }

    .joinBtn:hover:not([disabled]) {
        background-color: rgb(5, 203, 203);
        color: black;
    }

    .joinBtn:active:not([disabled]) {
        background-color: white;
        color: black;
    }

    .joinBtn:disabled {
        background-color: gray;
    }

    .game {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        border-style: solid;
        padding: .75rem;
        border-radius: 10px;
        border-color: var(--vt-c-indigo);
        background-color: var(--vt-c-indigo);
    }

    .publicGames {
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .joinID {
        margin-top: 10rem;
        display:flex;
        flex-direction: column;
    }

    input {
        background-color: var(--color-background-mute);
        border-color: var(--vt-c-indigo);
        margin-bottom: 20px;
        padding: .25rem .5rem;
        color: white;
        outline: none;
        border: none;
        border-radius: 10px;
    }

    input:focus {
        outline: var(--vt-c-indigo) solid 1px;
    }

    .submit {
        padding: 1rem 1rem;
        background-color: var(--vt-c-indigo);
        color: aqua;
        border:none;
        border-radius: 10px;
    }

    .submit:hover:not([disabled]) {
        background-color: rgb(5, 203, 203);
        color: black;
    }

    .submit:active:not([disabled]) {
        background-color: white;
        color: black;
    }

    .submit:disabled {
        background-color: gray;
    }
</style>