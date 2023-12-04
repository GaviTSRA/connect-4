<script setup>
    import { watch, ref } from "vue"

    let username = ref("")

    let props = defineProps(["load"])
    let emit = defineEmits(["usernameChanged"])

    if ($cookies.isKey("username") && props.load)
        username.value = $cookies.get("username")

    watch(
        () => username.value,
        () => {
            $cookies.set("username", username.value)
            emit("usernameChanged", username.value)
        }
    ) 
</script>

<template>
    <div class="wrapper">
        <label for="name">Username</label>
        <input v-model="username" type="text" id="name" name="name">
    </div>
</template>

<style scoped>
    .wrapper {
        display:flex;
        flex-direction: column;
        max-width: 15vw;
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
        font-size: 2rem;
        width: min(30vw, 15rem)
    }

    label {
        height: 3rem;
        font-size:2rem;
    }
</style>