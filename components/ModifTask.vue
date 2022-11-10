<template>
  <div>
    <form action="" class="space" @submit.prevent="updateTask">
      <div>
        <label for="title">Titre</label>
        <input class="inputStyle" type="text" v-model="titleInput" />
      </div>
      <input class="inputStyle" type="text" v-model="contentInput" />
      <label for="completedInput">Fait ?</label>
      <input type="checkbox" v-model="completedInput" class="check" />
      <input class="inputStyle inputSubmit" type="submit" value="OK" />
    </form>
  </div>
</template>

<script setup>
import { useJwtStore } from "~~/stores/jwt";
import { useTaskStore } from "~~/stores/task";

const { id, title, content, completed } = defineProps({
  id: Number,
  title: String,
  content: String,
  completed: Boolean,
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
form {
  height: fit-content;
  width: fit-content;
  background-color: #262636;
  border-radius: 10px;
}
label {
  display: block;
  text-align: center;
}
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
