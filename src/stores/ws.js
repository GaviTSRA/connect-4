import { defineStore } from "pinia"

export const useWS = defineStore('ws', {
    state: () => {
      return { conn: undefined }
    },
})