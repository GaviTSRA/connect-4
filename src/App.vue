<script setup>
import SelectPage from "./components/pages/SelectPage.vue"
import CreateGamePage from "./components/pages/CreateGamePage.vue"
import LocalMultiplayerPage from "./components/pages/LocalMultiplayerPage.vue"
import NotFoundPage from "./components/pages/NotFoundPage.vue"
import { ref, computed } from "vue"
import WaitingPage from "./components/pages/WaitingPage.vue"
import JoinGamePage from "./components/pages/JoinGamePage.vue"
import OnlineGamePage from "./components/pages/OnlineGamePage.vue"

const routes = {
  "/": SelectPage,
  "/play/local/multiplayer": LocalMultiplayerPage,
  "/play/online/create": CreateGamePage,
  "/play/online/waiting": WaitingPage,
  "/play/online/join": JoinGamePage,
  "/play/online/game": OnlineGamePage
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1)] || NotFoundPage
})
</script>

<template>
  <component :is="currentView" />
</template>


