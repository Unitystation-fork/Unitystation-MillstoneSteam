<template>
  <form action="" class="space" v-if="jwtStore.role=='ADMIN'">
    <input class="colorText inputStyle inputWrite" type="text" v-model="titleInput" />
    <input class="colorText inputStyle inputWrite" type="text" v-model="contentInput" />
    <input type="checkbox" v-model="completedInput" class="check"/>
    <input class="colorText check inputStyle" type="submit" value="OK" />
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

const taskStore = useTaskStore()

const jwtStore = useJwtStore()

const titleInput = ref(title)
const contentInput = ref(content)
const completedInput = ref(completed)

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

.check{
  cursor: pointer;
}

.space{
  padding: 20px;
  display: flex;
  
}

.inputStyle{
  border-radius:  20px 20px 20px 20px;
  text-align: center;
  background-color: #D9D9D9;
}

.inputWrite{
  cursor: text !important; 
  height: 20px;
  background-color: #D9D9D9;
}
</style>