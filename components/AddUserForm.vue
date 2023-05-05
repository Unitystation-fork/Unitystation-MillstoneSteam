<template>
  <div>
    <transition name="fade">
      <div class="modal-mask" />
    </transition>
    <transition name="pop">
      <form method="post" @submit.prevent="addUser">
        <span
          class="material-symbols-outlined close-btn"
          @click="$emit('close')"
          >close</span
        >
        <h2>Ajouter un utilisateur</h2>
        <div>
          <label for="username">Nom d'utilisateur</label>
          <input
            name="name"
            class="colorText inputStyleAdd"
            type="text"
            v-model="name"
          />
        </div>
        <div>
          <label for="password">Mot de passe</label>
          <input
            name="password"
            class="colorText inputStyleAdd"
            type="password"
            v-model="password"
          />
        </div>
        <div>
          <label for="role">Rôle</label>
          <select
            name="role"
            class="colorText inputStyleAdd"
            v-model="role"
            id="role"
          >
            <option value="ADMIN">Administrateur</option>
            <option value="USER">Utilisateur</option>
            <option value="STREAMER">Streamer</option>
          </select>
        </div>
        <input class="btnSubmitStyle" type="submit" value="Ajouter" />
        <p class="error" v-if="error !== ''">{{ error }}</p>
      </form>
    </transition>
  </div>
</template>

<script setup>
import { useJwtStore } from "~~/stores/jwt";
import { useUserStore } from "~~/stores/user";

const jwtStore = useJwtStore();
const userStore = useUserStore();
const name = ref("");
const password = ref("");
const role = ref("USER");
const error = ref("");
const emit = defineEmits(["close"]);

const addUser = async () => {
  if (name.value.length === 0 || password.value.length === 0) {
    error.value = "Veuillez remplir tous les champs";
    return;
  }
  if (jwtStore.jwt === null) {
    error.value = "Veuillez vous connecter";
    return;
  }
  if (jwtStore.role !== "ADMIN") {
    error.value = "Vous n'avez pas les droits pour ajouter un utilisateur";
    return;
  }

  for (let i = 0; i < userStore.users.length; i++) {
    if (userStore.users[i].name === name.value) {
      error.value = "Un utilisateur avec ce nom existe déjà";
      return;
    }
  }

  const response = await userStore.addUser(
    jwtStore.jwt,
    name.value,
    role.value,
    password.value
  );
  if (response) {
    await userStore.setUsers(jwtStore.jwt);
    alert("L'utilisateur a bien été ajouté");
    emit("close");
    location.hash = "#user-list";
  }
};
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

.error {
  color: #ee2020;
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
