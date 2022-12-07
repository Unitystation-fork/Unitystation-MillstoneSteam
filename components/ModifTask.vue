<template>
  <div>
    <form action="" class="space" @submit.prevent="updateTask">
      <h3>Modifier la tâche</h3>
      <div class="input">
        <label class="label" for="title">Titre</label>
        <input class="inputStyle" type="text" v-model="titleInput" />
      </div>
      <div class="input">
        <label class="label" for="content">Descritpion</label>
        <input
          name="content"
          class="inputStyle"
          type="text"
          v-model="contentInput"
        />
      </div>
      <div class="checkboxInput">
        <input type="checkbox" v-model="completedInput" class="check" />
        <label for="completedInput">Fait ?</label>
      </div>
      <input
        class="inputStyle inputSubmit"
        type="submit"
        value="Modifier la tâche"
      />
    </form>
    <span class="error" v-if="error !== ''">{{ error }}</span>
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
const error = ref("");

const emit = defineEmits(["close"]);

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
    .catch((e) => {
      error.value = e.message;
      console.log(e);
    });

  if (res.statusCode !== 200) {
    console.log(res.body);
    if (res.body.error === "Invalid token") {
      error.value = "Vous n'êtes pas autorisé à modifier cette tâche.";
      return;
    }
    if (res.body.error === "Expired token") {
      error.value = "Votre session a expiré, veuillez vous reconnecter.";
      return;
    }
    error.value =
      "Une erreur est survenue lors de la modification de la tâche.";
    return;
  }
  await taskStore.setTasks();
  emit("close");
}
</script>

<style>
form {
  height: fit-content;
  width: fit-content;
  background-color: #262636;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.error {
  text-align: center;
  color: #ee2020;
}
label {
  display: block;
  text-align: left;
}

.label {
  margin: 0 1.5rem;
}
.check {
  cursor: pointer;
}

.checkboxInput {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
.space {
  padding: 20px;
  display: flex;
}

.inputStyle {
  border-radius: 8px;
  text-align: center;
  background-color: #37374b;
  color: white;
  margin: 1em;
  display: block;
  width: 15vw;
  padding: 0.4rem;
  border: 1px solid #2c2c3b;
}

.inputSubmit {
  cursor: pointer;
  display: block;
  background-color: #8c9cff;
  color: white;
  font-weight: 600;
  border: 1px solid #8c9cff;
  border-radius: 5px;
  padding: 0.3em 0;
}

.inputSubmit:hover {
  background-color: #6665d2;
  border: 1px solid #6665d2;
}

h3 {
  text-align: center;
}
</style>
