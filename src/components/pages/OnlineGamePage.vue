<script setup>
    import { useWS } from '../../stores/ws';
    import BackButton from '../BackButton.vue';
    import Board from '../Board.vue';
    import { ref } from "vue"

    if (!$cookies.isKey("username") || !$cookies.isKey("game"))
        window.location.hash = ""

    let board = ref([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ])
    let winner = ref([0])
    let gameFinished = ref(false)
    let turn = ref(false)
    let other = $cookies.get("other")
    let username = ref($cookies.get("username"))
    let host = ref(false)
    let users = ref([username, other])
    let rematch = ref(0)

    let ws = useWS()
    ws.conn.onmessage = (msg) => {
        let args = msg.data.split(" ")
        if (args[0] == "board") {
            board.value = JSON.parse(args[1])
            if (turn.value == "1") turn.value = "0"
            else turn.value = "1"
        }
        if (args[0] == "winner") {
            gameFinished.value = true
            winner.value = args[1]
        }
        if (args[0] == "turn") {
            turn.value = args[1]
        }
        if (args[0] == "host") {
            if (args[1] == username.value) {
                host.value = true
                users.value = [username.value, other]
            } else {
                host.value = false 
                users.value = [other, username.value]
            }
        }
        if (args[0] == "rematch") {
            rematch.value = args[1]

            if (rematch.value == 2) {
                ws.conn.send("check " + $cookies.get("game"))
                winner.value = 0
                gameFinished.value = false
                rematch.value = 0
            }
        }
    }
    ws.conn.send("check " + $cookies.get("game"))

    function insert(col) {
        ws.conn.send("turn " + $cookies.get("game") + " " + col)
    }

    function doRematch() {
        ws.conn.send("rematch " + $cookies.get("game"))
    }
</script>

<template>
    <div class="game">
        <BackButton/>
        <p class="other" v-if="host"><span class="user">{{ username }}</span> VS <span class="otherUser">{{ other }}</span></p>
        <p class="other" v-if="!host"><span class="otherUser">{{ username }}</span> VS <span class="user">{{ other }}</span></p>
        <Board @insert="(col) => insert(col)" :board="board" :finished="gameFinished" :winner="winner" :turn="turn" :users="users"/>
        <button @click="doRematch" class="reset-button" v-if="gameFinished" :disabled="rematch == -1">{{ rematch == -1 ? "Other left" : "Rematch "+rematch+"/2" }}</button>
    </div>
</template>

<style>
    .reset-button {
        width: 15vw;
        margin: 20px auto;
        padding: 1rem;
        background-color: rgb(57, 231, 86);
        border-radius: 10px;
        border-style: none;
        color: black;
        align-self: center;
        font-size: 2vw;
    }

    .reset-button:active {
        transform: translateY(-4px);
    }

    .reset-button:hover {
        background-color: rgb(5, 158, 79);
    }

    .reset-button[disabled] {
        background-color: gray;
        color: rgb(70, 70, 70);
    }

    .user {
        color: green;
    }
    .otherUser {
        color: red;
    }
    .other {
        position: absolute;
        top: 0;
        margin: 0;
        font-size: 2rem;
    }

    .game {
        width: 100%;
        display:flex;
        flex-direction: column;
        align-items: center;
        margin-top: 3rem;
    }
</style>