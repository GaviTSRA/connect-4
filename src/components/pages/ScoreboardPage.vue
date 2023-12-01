<script setup>
    import { useWS } from '../../stores/ws'
    import { ref } from "vue"
    import BackButton from "../BackButton.vue"
    
    let ws = useWS()
    let data = ref([])

    if (ws.conn == undefined) window.location.hash = ""

    ws.conn.send("scoreboard")

    ws.conn.onmessage = msg => {
        const args = msg.data.split(" ")
        const command = args[0]

        if (command == "scoreboard") {
            data.value = JSON.parse(args[1])
        }
    }
</script>

<template>
    <BackButton/>
    <div>
        <table>
            <tr>
                <th>Place</th>
                <th>User</th>
                <th>Turns</th>
                <th>Time</th>
            </tr>
            <tr v-for="(row, index) in data">
                <td class="middle turns" :style="{'--color': (1-((index+1)/data.length))*255}">{{ index+1 }}</td>
                <td class="left">{{ row[0] }}</td>
                <td class="right" :style="{'--color': (1-(row[1]/21))*255}">{{ row[1] }}</td>
                <td class="right">{{ row[2] }}</td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
    table {
        font-size: 2vw;
    }
    th {
        color: coral;
        width: 10vw;
        border-width: 0;
        border-bottom-width: 3px;
        border-color: teal;
        border-style: solid;
    }
    .turns {
        color: rgb(
            200,
            var(--color),
            50
        )
    }
    .right {
        text-align: right;
    }
    .left {
        text-align: left;
    }
    .middle {
        text-align: center;
    }
</style>