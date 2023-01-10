<template>
  <div>
    <transition name="fade">
      <div class="modal-mask" />
    </transition>
    <transition name="pop">
      <form method="POST" @submit.prevent="addTask">
        <span
          class="material-symbols-outlined close-btn"
          @click="$emit('close')"
        >
          close
        </span>
        <h2>Ajouter une tâche</h2>
        <div>
          <label for="title">Titre</label>
          <input
            name="title"
            class="colorText inputStyleAdd"
            type="text"
            v-model="title"
          />
        </div>
        <div>
          <label for="content">Description</label>
          <input
            name="content"
            class="colorText inputStyleAdd"
            type="text"
            v-model="content"
          />
        </div>
        <div class="content-private">
          <input
            type="checkbox"
            name="isContentPrivate"
            v-model="isContentPrivate"
          />
          <label for="isContentPrivate"> Le contenu est-il privé ?</label>
        </div>
        <input class="btnSubmitStyle" type="submit" value="Ajouter" />
        <p v-if="error !== ''">{{ error }}</p>
      </form>
    </transition>
  </div>
</template>

<script setup>
import { useJwtStore } from "~~/stores/jwt";
import { useTaskStore } from "~~/stores/task";

const title = ref("");
const content = ref("");
const isContentPrivate = ref(false);
const jwtStore = useJwtStore();
const error = ref("");
const taskStore = useTaskStore();
const emit = defineEmits(["close"]);

async function addTask() {
  if (title.value.length === 0 || content.value.length === 0) {
    error.value = "Veuillez remplir tous les champs";
    return;
  }
  if (jwtStore.jwt === null) {
    error.value = "Veuillez vous connecter";
    return;
  }

  const res = await fetch("http://localhost:3000/api/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtStore.jwt,
    },

    body: JSON.stringify({
      title: title.value,
      content: content.value,
      isContentPrivate: isContentPrivate.value,
    }),
  })
    .then((r) => r.json())
    .catch((e) => {
      error.value = e;
    });
  if (res.statusCode !== 200) {
    console.log(res.body.error);
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

<style scoped>
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

.close-btn {
  cursor: pointer;
  align-self: flex-end;
}

.content-private {
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-private label {
  margin-left: 8px !important;
}

label {
  color: white;
  padding-bottom: 0;
  margin-left: 2em;
}
form {
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  text-align: center;
  width: fit-content;
  height: fit-content;
  max-width: 35em;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  background: #171e27;
  z-index: 999;
  transform: none;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  justify-content: center;
}
.colorText {
  color: black;
  margin: 10px;
}

.bodydy {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.inputStyleAdd {
  border-radius: 8px;
  text-align: center;
  background-color: #37374b;
  color: white;
  margin: 1em;
  display: block;
  min-width: 300px;
  padding: 0.4rem;
  border: 1px solid #2c2c3b;
}

.btnSubmitStyle {
  display: block;
  background-color: #8c9cff;
  color: white;
  font-weight: 600;
  border: 1px solid #8c9cff;
  border-radius: 5px;
  padding: 5px;
  margin: 10px;
  cursor: pointer;
  padding: 0.4em 1em;
}

.btnSubmitStyle:hover {
  background-color: #6c7cff;
  border: 1px solid #6c7cff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.01s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67),
    opacity 0.25s linear;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.2) translateY(-50%);
}
</style>
