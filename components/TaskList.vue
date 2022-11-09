<template>
  <div class="body">
    <div class="tasks" v-for="task in taskStore.tasks" id="tasks" :key="task.id">
      <h2>
        {{ task.title }}
      </h2>
      <p class="space">
        {{ task.content }}
      </p>
      <ModifTask v-bind="task" />
      <button class="btn colorText supprStyle" @click="deleteTask(task.id)" v-if="jwtStore.role=='ADMIN'">X Supprimer</button>
    </div>
    <h2 v-if="tasks?.length === 0">No tasks</h2>

  </div>
</template>

<script setup>
import { useTaskStore } from "~/stores/task"
import { useJwtStore } from "~~/stores/jwt"

const taskStore = useTaskStore()
await taskStore.setTasks()
const jwtStore = useJwtStore()

async function deleteTask(id) {
  const res = await fetch("http://localhost:3000/api/task/" + id, { //await fait attendre que toute la fonction soit déroulée
    headers: {
      "Authorization": "Bearer " + jwtStore.jwt
    },
    method: "DELETE",
  })
    .then(r => r.json())
    .catch(e => console.log("error", e))
  if (res.statusCode === 200) {
    await taskStore.setTasks()
  }
}
</script>

<style>
.body {
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 75px;
}

.colorText {
  color: black;
  margin: 10px;
  cursor: pointer;
}

.btn:hover{
  color: red;
}

.btn {
  margin-left: 15px;
  background-color: #D9D9D9;
}

.tasks {
  height: 25px;
  margin-top: 5px;
}

.supprStyle{
  border-radius: 20px 20px 20px 20px;
}

#tasks {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
}

.space{
  margin-left: 15px;
}
</style>
