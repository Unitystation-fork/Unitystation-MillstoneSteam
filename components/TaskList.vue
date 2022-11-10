<template>
  <h2 v-if="taskStore.tasks.value?.length === 0">Aucune tâche à afficher</h2>
  <div class="list">
    <div class="tasks" v-for="task in taskStore.tasks" :key="task.id">
      <h2>
        {{ task.title }}
        <span class="status" v-if="!task.isCompleted"> A faire</span>
      </h2>
      <p class="space">
        {{ task.content }}
      </p>
      <ModifTask v-bind="task" />
      <button
        class="btn colorText supprStyle"
        @click="deleteTask(task.id)"
        v-if="jwtStore.role == 'ADMIN'"
      >
        X Supprimer
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from "~/stores/task";
import { useJwtStore } from "~~/stores/jwt";

const taskStore = useTaskStore();
await taskStore.setTasks();
const jwtStore = useJwtStore();
const cols = ref(2);

async function deleteTask(id) {
  const res = await fetch("http://localhost:3000/api/task/" + id, {
    //await fait attendre que toute la fonction soit déroulée
    headers: {
      Authorization: "Bearer " + jwtStore.jwt,
    },
    method: "DELETE",
  })
    .then((r) => r.json())
    .catch((e) => console.log("error", e));
  if (res.statusCode === 200) {
    await taskStore.setTasks();
  }
}
</script>

<style scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 10rem;
}
.tasks {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #8c9cff;
  border-radius: 5px;
  width: 22rem;
}

h2 {
  font-size: 1.5rem;
  padding: 0;
  align-self: center;
}
.status {
  color: #ee2020;
  font-size: 1rem;
  padding-left: 1em;
}
</style>
