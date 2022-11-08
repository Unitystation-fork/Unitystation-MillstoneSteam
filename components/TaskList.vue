<template>
  <div class="body">
    <div class="tasks" v-for="task in taskStore.tasks" id="tasks" :key="task.id">
      <h2>
        {{ task.title }}
      </h2>
      <ModifTask v-bind="task" />
      <button class="btn" @click="deleteTask(task.id)" v-if="jwtStore.role=='ADMIN'">X Supprimer</button>
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
  padding: 10px;

}

.btn {
  margin-left: 15px;
}

.tasks {

  height: 25px;
  margin-top: 5px;
}

#tasks {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
}
</style>
