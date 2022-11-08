<template>
  <div>
    <transition name="fade">
      <div class="modal-mask" v-if="showForm" />
    </transition>
    <transition name="pop">
      <form v-if="showForm" @submit.prevent="login">
        <button type="button" @click="$emit('close')">
          <span class="material-symbols-outlined"> close </span>
        </button>
        <div class="form-group">
          <label for="password">Nom d'utilisateur</label>
          <input
            type="text"
            class="form-control"
            id="username"
            aria-describedby="usernameHelp"
            placeholder="Votre nom d'utilisateur"
            v-model="username"
            @keyup="handleChange"
          />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Votre mot de passe"
            v-model="password"
            @keyup="handleChange"
          />
        </div>
        <input type="submit" value="Connexion" />
        <span class="error" v-if="error !== ''">{{ error }}</span>
      </form>
    </transition>
  </div>
</template>

<script setup>
import { useJwtStore } from "~~/stores/jwt";

const username = ref("");
const password = ref("");
const error = ref("");
const emit = defineEmits(["close"]);
const jwtStore = useJwtStore();

defineProps({
  showForm: {
    type: Boolean,
    default: false,
  },
});

const login = async () => {
  if (username.value.length === 0 || password.value.length === 0) {
    error.value = "Veuillez remplir tous les champs";
    return;
  }

  const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: username.value,
      password: password.value,
    }),
  })
    .then((r) => r.json())
    .catch((e) => {
      error.value = e.message;
      console.log(e);
    });
  if (res.statusCode === 200) {
    jwtStore.setJwt(res.body.token);
    console.log("Logged in");
    emit("close");
  }
};

const handleChange = () => {
  error.value = "";
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
i {
  height: 80px;
}

.error {
  color: #eb353a;
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

label {
  color: white;
  display: block;
  padding-bottom: 0.2em;
}

input {
  background-color: #444444;
  padding: 0.5em 1em;
  border: none;
  border-radius: 8px;
}

input[type="submit"] {
  background-color: #8c9cff;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #5c6cff;
}

button {
  border: none;
  background-color: transparent;
  align-self: flex-end;
  cursor: pointer;
}

f .fade-enter-active,
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
