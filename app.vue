<template>
  <div class="body">
    <Header @login="show" id="top" />
    <Warning
      v-if="jwtStore.jwt && showWarning"
      @closeWarning="showWarning = false"
    />
    <div class="btns">
      <button
        v-if="jwtStore.role === 'ADMIN' && jwtStore.jwt"
        class="add-task-btn"
        @click="showAddTask = true"
      >
        <span class="material-symbols-outlined"> note_add </span> Ajouter une
        tâche
      </button>
    </div>
    <LoginForm :show-form="showForm" @close="closeForm" />
    <TaskList />
    <AddTaskForm
      v-if="showAddTask && jwtStore.role === 'ADMIN'"
      @close="showAddTask = false"
    />
    <a href="#top" v-if="showScrollToTop"
      ><img
        class="scroll-to-top"
        src="./assets/img/arrow_up.png"
        alt="scroll-to-top"
    /></a>
    <Footer />
  </div>
</template>

<script setup>
import { useJwtStore } from "./stores/jwt";

const showForm = ref(false);
const showAddTask = ref(false);
const showScrollToTop = ref(false);
const showWarning = ref(true);
const show = () => {
  showForm.value = true;
};

const jwtStore = useJwtStore();

const closeForm = () => {
  showForm.value = false;
};

if (typeof window !== "undefined")
  window.onscroll = () => {
    if (window.pageYOffset > 100) {
      showScrollToTop.value = true;
    } else {
      showScrollToTop.value = false;
    }
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

.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
}
</style>
