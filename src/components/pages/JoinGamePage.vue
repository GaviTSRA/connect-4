<script setup>
    import { ref } from "vue"
    import BackButton from "../BackButton.vue";
    import { useWS } from "../../stores/ws";
    import UsernameInput from "../UsernameInput.vue";

    let username = ref("")
    if($cookies.isKey("username"))
        updateUsername()
    let id = ref("")
    let status = ref(0)
    let creating = ref(false)
    let ispPublic = ref(false)

    let ws = useWS()

    if (ws.conn == undefined) window.location.hash = ""

    ws.conn.onmessage = (msg) => {
        let args = msg.data.split(" ")
        if (args[0] == "error") status.value = args[1]
        if (args[0] == "success" && args.length == 2 && !creating.value) {
            $cookies.set("other", args[1])
            window.location.hash = "/play/online/waiting"
        }
        if (args[0] == "games") {
            games.value = JSON.parse(args[1])
        }
    }

    function updateUsername(name) {
        username.value = $cookies.get("username")
    }

    async function join(_id) {
        $cookies.set("game", _id)
        ws.conn.send("username " + username.value)
        ws.conn.send("join " + _id)
    }

    async function joinGame() {
        $cookies.set("game", id.value)
        ws.conn.send("username " + username.value)
        ws.conn.send("join " + id.value)
    }

    async function createGame() {
        creating.value = true
        $cookies.set("username", username.value)
        let ws = useWS()
        ws.conn.onmessage = (msg) => {
            let args = msg.data.split(" ")
            if (args[0] == "success" && args.length == 2) {
                $cookies.set("game", args[1])
                window.location.hash = "/play/online/waiting"
            }
        }
        ws.conn.send("username " + username.value)
        ws.conn.send("new " +( ispPublic.value ? "1" : "0"))
    }
    
    let games = ref([])
    ws.conn.send("games")
</script>

<template>
    <BackButton/>
    <div class="container">
        <UsernameInput :load="true" @username-changed="updateUsername"/>
        <div class="publicGames">
            <div v-for="game in games" class="game">
                <p class="gameUser">{{ game[1] }}</p>
                <p class="gameID">{{ game[0] }}</p>
                <button class="joinBtn" @click="join(game[0])" :disabled="username.length < 3">Join</button>
            </div>
            <p v-if="games.length == 0">No public games!</p>
        </div>
        <h2 class="seperator"></h2>
        <div class="createOrJoin">
            <div class="create">
                <label class="createLabel"></label>
                <div>
                    <input class="checkbox" type="checkbox" v-model="ispPublic" id="public" name="public">
                    <p class="checkbox-label">Public?</p>
                </div>
                <button class="createBtn submit" @click="createGame" :disabled="username.length < 3 || username.includes(' ')">Create Game</button>
                <p v-if="status != 0">Error: {{ status }}</p>
            </div>
            <div class="join">
                <label for="id">Game ID</label>
                <input v-model="id" type="text" id="id" name="id">
                <button class="submit" @click="joinGame" :disabled="username.length < 3 || id.length != 5 || username.includes(' ')">Join Game</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    label {
        height: 3rem;
        font-size:2rem;
    }

    .create {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        margin-right: 1rem;
    }
    .join {
        display: flex;
        flex-direction: column;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .createBtn {
        width: 10rem;
    }

    .seperator {
        user-select: none;
        width: 50vw; 
        text-align: center; 
        border-bottom: 1px solid gray; 
        line-height: 0.1em;
        margin: 2rem 0px;
    } 

     .checkbox {
        margin-bottom: 10px;
        transform: scale(2);
        float: left;
        margin-top: 10px;
        margin-right: 10px;
        accent-color: var(--color-background-mute);
        outline-color: var(--vt-c-indigo);
    }

    .checkbox-label {
        font-size: 1.5rem;
    }

    .gameID {
        color: white;
        margin-left: 20px;
    }
    .gameUser {
        margin-left: 10px;
        color: aqua;
    }

    .joinBtn {
        padding: 1rem 1.5rem;
        margin-left: 20px;
        background-color: var(--color-background-mute);
        color: aqua;
        border:none;
        border-radius: 10px;
        font-size: 2rem;
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
        font-size: 2rem;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        border-style: solid;
        padding: .5rem;
        border-radius: 10px;
        border-color: var(--vt-c-indigo);
        background-color: var(--vt-c-indigo);
    }

    .publicGames {
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .createOrJoin {
        margin-top: 10px;
        display:flex;
        flex-direction: row;
        align-items: center;
    }

    input {
        background-color: var(--color-background-mute);
        border-color: var(--vt-c-indigo);
        padding: .25rem .5rem;
        color: white;
        outline: none;
        border: none;
        border-radius: 10px;
    }

    input[type="text"] {
        margin-bottom: 20px;
        font-size: 1rem;
    }

    input:focus {
        outline: var(--vt-c-indigo) solid 1px;
    }

    .submit {
        width: 15rem;
        font-size: 1.5rem;
        padding: 1.5rem 3rem;
        background-color: var(--vt-c-indigo);
        color: aqua;
        border:none;
        border-radius: 10px;
        margin-bottom: 10px;
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
        color: rgb(52, 52, 52)
    }
</style>