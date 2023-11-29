<script setup>
    import { ref } from "vue"
    import BackButton from "../BackButton.vue";
    import { useWS } from "../../stores/ws";

    let username = ref($cookies.get("username"))

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
        ws.conn.send("new")
    }
    let creating = ref(false)
</script>

<template>
    <BackButton/>
    <label for="name">Username</label>
    <input v-model="username" type="text" id="name" name="name">
    <button class="submit" @click="createGame" :disabled="username.length < 3 || username.includes(' ')">Create Game</button>
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