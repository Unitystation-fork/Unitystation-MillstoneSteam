<template>
  <div>
    <transition name="fade">
        <div class="modal-mask" v-if="showForm" />
    </transition>
    <transition name="fade">
      <form
        action=""
        class="space"
        v-if="jwtStore.role == 'ADMIN' && showForm"
        @submit.prevent="updateTask"
      >
      <button type="button" @click="$emit('close')">
        <span class="material-symbols-outlined"> close </span>
      </button>
        <input class="inputStyle" type="text" v-model="titleInput" />
        <input class="inputStyle" type="text" v-model="contentInput" />
        <label for="completedInput">Fait ?</label>
        <input type="checkbox" v-model="completedInput" class="check" />
        <input class="inputStyle inputSubmit" type="submit" value="OK" />
        
      </form>
  </transition>
</div>
</template>

<script setup>
import { useJwtStore } from "~~/stores/jwt";
import { useTaskStore } from "~~/stores/task";

const { id, title, content, completed, showForm } = defineProps({
  id: Number,
  title: String,
  content: String,
  completed: Boolean,
  showForm:{
    type: Boolean,
    default: false,
  }
});


const taskStore = useTaskStore();

const jwtStore = useJwtStore();

const titleInput = ref(title);
const contentInput = ref(content);
const completedInput = ref(completed);

async function updateTask() {
  const res = await fetch("http://localhost:3000/api/task/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtStore.jwt,
    },
    body: JSON.stringify({
      title: titleInput.value,
      content: contentInput.value,
      completed: completedInput.value,
    }),
  })
    .then((r) => r.json())
    .catch((e) => console.log("error", e));

  if (res.statusCode === 200) {
    console.log("res", res);
    await taskStore.setTasks();
  }
}
</script>

<style>

.check {
  cursor: pointer;
}

.space {
  padding: 20px;
  display: flex;
}

.inputStyle {
  border-radius: 20px 20px 20px 20px;
  text-align: center;
  background-color: #d9d9d9;
  color: black;
  margin: 1em;
}

.inputSubmit {
  cursor: pointer;
}

.modal-mask {
  content: "";
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  background: #000000;
  opacity: 0.6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.01s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

</style>
