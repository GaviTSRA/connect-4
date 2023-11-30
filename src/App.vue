<script setup>
    import SelectPage from "./components/pages/SelectPage.vue"
    import LocalMultiplayerPage from "./components/pages/LocalMultiplayerPage.vue"
    import NotFoundPage from "./components/pages/NotFoundPage.vue"
    import { ref, computed } from "vue"
    import WaitingPage from "./components/pages/WaitingPage.vue"
    import JoinGamePage from "./components/pages/JoinGamePage.vue"
    import OnlineGamePage from "./components/pages/OnlineGamePage.vue"
    import SingleplayerPage from "./components/pages/SingleplayerPage.vue"
    import OnlineSingleplayerPage from "./components/pages/OnlineSingleplayerPage.vue"
    import { loadSlim } from "tsparticles-slim"
    import { loadFull } from "tsparticles"

    const routes = {
    "": SelectPage,
    "/": SelectPage,
    "/play/local/multiplayer": LocalMultiplayerPage,
    "/play/local/singleplayer": SingleplayerPage,
    "/play/online/waiting": WaitingPage,
    "/play/online/join": JoinGamePage,
    "/play/online/game": OnlineGamePage,
    "/play/online/bot": OnlineSingleplayerPage
    }

    const currentPath = ref(window.location.hash)

    window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
    })

    const currentView = computed(() => {
        return routes[currentPath.value.slice(1)] || NotFoundPage
    })

    const particlesInit = async engine => {
        await loadFull(engine);
        //await loadSlim(engine);
    };

    const particlesLoaded = async container => {
    };
</script>

<template>
    <vue-particles
        id="tsparticles"
        :particlesInit="particlesInit"
        :particlesLoaded="particlesLoaded"
        url="/snow.json"
    />
  <component :is="currentView" />
</template>


