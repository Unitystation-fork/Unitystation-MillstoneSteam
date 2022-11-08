<template>
  <form action="">
    <input type="text" v-model="titleInput" />
    <input type="text" v-model="contentInput" />
    <input type="checkbox" v-model="completedInput" />
    <input class="colorText" type="submit" value="OK" />
  </form>

</template>

<script setup>
import { useJwtStore } from "~~/stores/jwt"
import { useTaskStore } from "~~/stores/task"
const { id, title, content, completed } = defineProps({
  id: Number,
  title: String,
  content: String,
  completed: Boolean
})

console.log(id)

console.log(id, title, content, completed)
const taskStore = useTaskStore()
await taskStore.setTasks()
const jwtStore = useJwtStore()

const titleInput = ref(title)
const contentInput = ref(content)
const completedInput = ref(completed) //ref() variable reactif dans Vue

async function updateTask() {
  const res = await fetch("http://localhost:3000/api/task/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + jwtStore.jwt
    },
    body: JSON.stringify({
      title: titleInput.value,
      content: contentInput.value,
      completed: completedInput.value,
    }),
  })
    .then(r => r.json())
    .catch(e => console.log("error", e))

  if (res.statusCode === 200) {
    console.log("res update", res)
    await taskStore.setTasks()
  }
}
</script>

<style>
.colorText {
  color: black;
  margin: 10px;
}
</style>