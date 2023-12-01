<script setup>
    import { ref } from "vue"
    import BackButton from "../BackButton.vue";
    import { useWS } from "../../stores/ws";

    if (!$cookies.isKey("username"))
        window.location.hash = ""

    let username = $cookies.get("username")
    let other = ref("")
    if ($cookies.isKey("other")) {
        other.value = $cookies.get("other")
        setTimeout(() => {
            window.location.hash = "/play/online/game"
        }, 2000)
    }
    else {
        let ws = useWS()
        ws.conn.onmessage = (msg) => {
            let args = msg.data.split(" ")
            if (args[0] == "join") {
                other.value = args[1]
                $cookies.set("other", args[1])
                setTimeout(() => {
                    window.location.hash = "/play/online/game"
                }, 2000)
            }
        }
    }
    let id = $cookies.get("game")
</script>

<template>
    <BackButton/>
    <div class="container">
        <div class="side">
            <p>{{ username }}</p>
        </div>
        <div class="line"></div>
        <div class="side">
            <p v-if="other.length != 0">{{ other }}</p>
            <div class="lds-dual-ring" v-if="other.length == 0"></div>
        </div>
        <p class="label">VS</p>
        <p class="id">Game ID: {{ id }}</p>
    </div>
</template>

<style scoped>
    .id {
        position: absolute;
        left: 0;
        bottom: 0;
        font-size: 5vw;
    }

    .label {
        position: absolute;
        font-size: 50px;
        top: calc(50% - 30px);
        left: calc(50% - 25px);
        background-color: var(--color-background)
    }

    .container {
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        display: grid;
        width: 100vw;
        grid-template-columns: repeat(3, 1fr);
    }

    .line {
        border-left: 6px solid rgb(79, 79, 79);
        border-right: 6px solid rgb(79, 79, 79);
        height: 100vh;
        position: absolute;
        left: 50%;
    }

    .side {
        font-size: 3rem;
        width: 50vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .lds-dual-ring {
        display: inline-block;
        width: 80px;
        height: 80px;
    }
    .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes lds-dual-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>