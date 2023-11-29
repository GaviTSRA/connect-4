<script setup>
    import { ref } from "vue"
    import BackButton from "../BackButton.vue";
    import { useWS } from "../../stores/ws";

    let username = ref("")
    if ($cookies.isKey("username"))
        username.value = $cookies.get("username")
    let ispPublic = ref(false)

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
    let creating = ref(false)
</script>

<template>
    <BackButton/>
    <label for="name">Username</label>
    <input class="username" v-model="username" type="text" id="name" name="name">
    <div>
        <input class="checkbox" type="checkbox" v-model="ispPublic" id="public" name="public">
        <p class="checkbox-label">Public?</p>
    </div>
    <button class="submit" @click="createGame" :disabled="username.length < 3 || username.includes(' ')">Create Game</button>
</template>

<style scoped>
    .checkbox {
        float: left;
        margin-top: 10px;
        margin-right: 10px;
        accent-color: var(--color-background-mute);
        outline-color: var(--vt-c-indigo);
    }

    .checkbox-label {
        margin-top: 5px;

    }

    .username {
        background-color: var(--color-background-mute);
        border-color: var(--vt-c-indigo);
        padding: .25rem .5rem;
        color: white;
        outline: none;
        border: none;
        border-radius: 10px;
    }

    .username:focus {
        outline: var(--vt-c-indigo) solid 1px;
    }

    .submit {
        margin-top: 50px;
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