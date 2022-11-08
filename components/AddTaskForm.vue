<template>
  <div class="bodydy" v-if="jwtStore.role=='ADMIN'">
    <form method="POST" @submit.prevent="addTask">
      <input class="colorText" type="text" v-model="title" />
      <input class="colorText" type="text" v-model="content" />
      <input class="colorText" type="submit" value="Submit" />
      <p v-if="error !== ''">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { useJwtStore } from "~~/stores/jwt"
import { useTaskStore } from "~~/stores/task"

const title = ref("")
const content = ref("")
const jwtStore = useJwtStore()
const error = ref("")
const taskStore = useTaskStore()

async function addTask() {
  console.log(title.value, content.value)

  if (title.value.length === 0 || content.value.length === 0) {
    error.value = "Veuillez remplir tous les champs"
    console.log("1")
    return
  }
  console.log("2")
  if (jwtStore.jwt === null) {
    error.value = "Veuillez vous connecter"
    console.log("3")
    return
  }
  console.log("4")

  const res = await fetch("http://localhost:3000/api/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtStore.jwt,
    },

    body: JSON.stringify({
      title: title.value,
      content: content.value,
    }),
  })
    .then((r) => r.json())
    .catch((e) => {
      error.value = e.body.message
      console.log(e)
    })
  if (res.statusCode === 200) {
    console.log("Task Added")
    //taskStore.$reset()
    console.log("try updatestore task")
    await taskStore.setTasks()
    console.log("try updatestore task 2")
    //window.location.reload();   //f5 automatique
  }
  error.value = res.body.message
}
</script>

<style>
.colorText {
  color: black;
  margin: 10px;
}

.bodydy {
  display: flex;
  justify-content: center;
}
</style>
