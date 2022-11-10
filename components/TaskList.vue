<template>
  <h2 v-if="taskStore.tasks.value?.length === 0">Aucune tâche à afficher</h2>
  <div class="list">
    <div class="tasks" v-for="task in taskStore.tasks" :key="task.id">
      <div class="task-title">
        <h2>
          {{ task.id }}.
          {{ task.title }}
        </h2>
        <span class="status undone" v-if="!task.completed"> A faire</span>
        <span class="status done" v-if="task.completed">Fait</span>
        <span
          class="material-symbols-outlined delete-btn"
          @click="deleteTask(task.id)"
          v-if="jwtStore.role == 'ADMIN'"
          title="Supprimer la tâche"
        >
          delete
        </span>
      </div>
      <p class="content">
        {{ task.content }}
      </p>

      <ModifTask
        v-bind="task"
        v-if="jwtStore.role === 'ADMIN'"
        class="modif-form"
      />
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from "~/stores/task";
import { useJwtStore } from "~~/stores/jwt";

const taskStore = useTaskStore();
await taskStore.setTasks();
const jwtStore = useJwtStore();

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
  flex-direction: column;
  margin: 10rem 15rem;
}

.modif-form {
  margin: auto;
}
.tasks {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 32px;
  padding-bottom: 16px;
  padding-left: 1.8rem;
  padding-right: 1.2rem;
  border-radius: 3px;
  min-width: 700px;
  max-width: 750px;
}

.tasks:nth-child(odd) {
  background-color: #2c2c3b;
}
.task-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding-bottom: 0.7rem;
}

h2 {
  font-size: 1.5rem;
  margin: 0;
}
.status {
  font-size: 1rem;
  padding-left: 1em;
}

.undone {
  color: #ee2020;
}

.done {
  color: #41cc81;
}

.delete-btn {
  cursor: pointer;
  font-size: 2rem;
  color: white;
  margin-left: 1rem;
  vertical-align: middle;
  margin-left: auto;
}

.delete-btn:hover {
  content: "Supprimer la tâche";
  color: #ee2020;
}
</style>
