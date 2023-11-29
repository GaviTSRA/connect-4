<script setup>
    import { ref } from "vue"
    import BackButton from "../BackButton.vue";
    import { useWS } from "../../stores/ws";

    let username = ref($cookies.get("username"))
    let id = ref("")
    let status = ref(0)

    async function joinGame() {
        creating.value = true
        $cookies.set("username", username.value)
        $cookies.set("game", id.value)
        
        let ws = useWS()
        ws.conn.onmessage = (msg) => {
            let args = msg.data.split(" ")
            if (args[0] == "error") status.value = args[1]
            if (args[0] == "success" && args.length == 2) {
                $cookies.set("other", args[1])
                window.location.hash = "/play/online/waiting"
            }
        }
        ws.conn.send("username " + username.value)
        ws.conn.send("join " + id.value)
    }
    let creating = ref(false)
</script>

<template>
    <BackButton/>
    <label for="name">Username</label>
    <input v-model="username" type="text" id="name" name="name">
    <label for="id">Game ID</label>
    <input v-model="id" type="text" id="id" name="id">
    <button class="submit" @click="joinGame" :disabled="username.length < 3 || id.length != 5 || username.includes(' ')">Join Game</button>
    <p v-if="status != 0">Error: {{ status }}</p>
</template>

<style scoped>
    input {
        background-color: var(--color-background-mute);
        border-color: var(--vt-c-indigo);
        margin-bottom: 50px;
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