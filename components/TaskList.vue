<template>
  <div>
    <h2 v-if="taskStore.tasks.value?.length === 0 || !taskStore.tasks">
      Aucune tâche à afficher
    </h2>
    <div class="error" v-if="error !== ''">{{ error }}</div>
    <div class="list" v-if="error === ''">
      <button v-if="isModifShown" @click="isModifShown = false">
        Terminer les modifications
      </button>
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
          <span
            class="material-symbols-outlined edit-btn"
            :class="task.id"
            v-if="jwtStore.role == 'ADMIN'"
            @click="isModifShown = true"
          >
            edit
          </span>
        </div>
        <p class="content" v-if="!task.isContentPrivate || jwtStore.jwt">
          {{ task.content }}
        </p>

        <ModifTask
          v-bind="task"
          v-if="jwtStore.role === 'ADMIN' && isModifShown"
          class="modif-form"
        />
      </div>
      <button v-if="isModifShown" @click="isModifShown = false">
        Terminer les modifications
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from "~/stores/task";
import { useJwtStore } from "~~/stores/jwt";
const taskStore = useTaskStore();
const tasks = await taskStore.setTasks();
const jwtStore = useJwtStore();
const isModifShown = ref(false);
const error = ref("");
const deleteError = ref("");

if (!tasks) {
  error.value =
    "Une erreur est survenue durant l'affichage des tâches. Veuillez réessayer ultérieurement.";
}

async function deleteTask(id) {
  const conf = confirm("Voulez-vous vraiment supprimer cette tâche ?");
  if (!conf) {
    return;
  }
  const res = await fetch("http://localhost:3000/api/task/" + id, {
    //await fait attendre que toute la fonction soit déroulée
    headers: {
      Authorization: "Bearer " + jwtStore.jwt,
    },
    method: "DELETE",
  })
    .then((r) => r.json())
    .catch((e) => {
      deleteError.value = e.message;
      console.log(e);
    });

  if (res.statusCode !== 200) {
    console.log(res.body);
    if (res.body.error === "Invalid token") {
      deleteError.value = "Vous n'êtes pas autorisé à modifier cette tâche.";
    }
    if (res.body.error === "Expired token") {
      deleteError.value = "Votre session a expiré, veuillez vous reconnecter.";
    } else {
      deleteError.value =
        "Une erreur est survenue lors de la suppression de la tâche.";
    }
    alert(deleteError.value);
    return;
  }
  await taskStore.setTasks();
}
</script>

<style scoped>
button {
  display: block;
  background-color: #8c9cff;
  color: white;
  font-weight: 600;
  border: 1px solid #8c9cff;
  border-radius: 5px;
  padding: 5px;
  margin: 2em auto;
  cursor: pointer;
  padding: 0.4em;
  width: fit-content;
}

.btns {
  display: flex;
  justify-content: center;
  align-items: center;
}

.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  font-size: 1.5em;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  vertical-align: middle;
}

button:hover {
  background-color: #6c7cff;
  border: 1px solid #6c7cff;
}
.list {
  display: flex;
  flex-direction: column;
  margin: 6rem auto;
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

.edit-btn {
  cursor: pointer;
  font-size: 2rem;
  color: white;
  margin-left: 1rem;
  vertical-align: middle;
}

.edit-btn:hover {
  color: #8c9cff;
}

.delete-btn:hover {
  content: "Supprimer la tâche";
  color: #ee2020;
}
</style>
