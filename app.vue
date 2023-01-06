<template>
  <div class="body">
    <Header @login="show" />
    <div class="btns">
      <button
        v-if="jwtStore.role === 'ADMIN' && jwtStore.jwt"
        class="add-task-btn"
        @click="showAddTask = true"
      >
        <span class="material-symbols-outlined"> note_add </span> Ajouter une
        tâche
      </button>
      <button
        v-if="jwtStore.role === 'ADMIN' && jwtStore.jwt"
        class="add-person-btn"
        @click="showAddUser = true"
      >
        <span class="material-symbols-outlined"> person_add</span> Ajouter un
        utilisateur
      </button>
    </div>
    <LoginForm :show-form="showForm" @close="closeForm" />
    <TaskList />
    <UserList v-if="jwtStore.jwt && jwtStore.role === 'ADMIN'" />
    <AddTaskForm
      v-if="showAddTask && jwtStore.role === 'ADMIN' && jwtStore.jwt"
      @close="showAddTask = false"
    />
    <Footer />
  </div>
</template>

<script setup>
import { useJwtStore } from "./stores/jwt";

const showForm = ref(false);
const showAddTask = ref(false);
const showwAddUser = ref(false);
const show = () => {
  showForm.value = true;
};
const jwtStore = useJwtStore();

const closeForm = () => {
  showForm.value = false;
};
</script>

<style scoped>
* {
  font-family: "Ubuntu", sans-serif;
  color: white;
}
.body {
  background-color: #171e27;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: column;
}
.btns {
  display: flex;
  margin-top: 5rem;
  justify-content: center;
}

button {
  display: block;
  background-color: #8c9cff;
  color: white;
  font-weight: 600;
  border: 1px solid #8c9cff;
  border-radius: 5px;
  padding: 5px;
  margin: 10px;
  cursor: pointer;
  padding: 0.4em;
}

button:hover {
  background-color: #6c7cff;
  border: 1px solid #6c7cff;
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
</style>
