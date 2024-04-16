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
        <div class="task-title" :id="task.id">
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
            @click="scrollToTask(task.id)"
          >
            edit
          </span>
        </div>
        <div class="content" v-if="!task.isContentPrivate || jwtStore.jwt" v-html="renderMarkdown(task.content)">
        </div>
        <ModifTask
          v-bind="task"
          v-if="jwtStore.role === 'ADMIN' && isModifShown"
          class="modif-form"
        />
      </div>
      <button v-if="isModifShown" @click="endTaskEdit">
        Terminer les modifications
      </button>
    </div>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it';
import { useTaskStore } from "~/stores/task";
import { useJwtStore } from "~~/stores/jwt";
const taskStore = useTaskStore();
const tasks = taskStore.tasks.value
  ? taskStore.tasks.value
  : await taskStore.setTasks();
const jwtStore = useJwtStore();
const isModifShown = ref(false);
const error = ref("");

const md = new MarkdownIt();

const endTaskEdit = () => {
  taskStore.tasks.sort((a, b) => {
    if (a.completed < b.completed) {
      return 1;
    }
    if (a.completed > b.completed) {
      return -1;
    }
    return 0;
  });
  isModifShown.value = false;
};

const scrollToTask = (id) => {
  isModifShown.value = true;
  const task = document.getElementById(id);
  setTimeout(() => {
    task.scrollIntoView({ behavior: "smooth" });
  }, 10);
};

if (!tasks) {
  error.value =
    "Une erreur est survenue durant l'affichage des tâches. Veuillez réessayer ultérieurement.";
}

async function deleteTask(id) {
  const res = await taskStore.deleteTask(jwtStore.jwt, id);
  if (res !== "ok") {
    alert(res);
  }
  return;
}

const renderMarkdown = (markdownText) => {
  return md.render(markdownText);
};
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
  margin-top: 10px;
  margin-bottom: 10px;
  padding-top: 32px;
  padding-bottom: 16px;
  padding-left: 1.8rem;
  padding-right: 1.2rem;
  border-radius: 3px;
  width: 75vw; /* Updated by Mat95rix7 */
  background-color: #2c2c3b;
}
.task-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding-bottom: 0.7rem;
  flex-wrap: wrap;
}

h2 {
  font-size: 1.2rem;
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
