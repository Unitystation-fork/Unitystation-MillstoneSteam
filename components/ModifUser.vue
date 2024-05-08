<template>
  <form @submit.prevent="editUser">
    <h3>Modifier l'utilisateur</h3>
    <div class="input">
      <label class="label" for="name">Pseudo</label>
      <input class="inputStyle" type="text" v-model="nameInput" />
    </div>
    <div class="input">
      <label class="label" for="role">Role</label>
      <select class="inputStyle" v-model="roleInput">
        <option value="USER">Utilisateur</option>
        <option value="ADMIN">Administrateur</option>
        <option value="STREAMER">Streamer</option>
      </select>
    </div>
    <div class="input">
      <label class="label" for="password">Mot de passe</label>
      <input class="inputStyle" type="password" v-model="passwordInput" />
    </div>
    <input class="inputStyle inputSubmit" type="submit" value="Modifier" />
    <button @click="$emit('close'), endUserEdit()">Arrêter les modifications</button>
    <span v-if="error !== ''">{{ error }}</span>
  </form>
</template>

<script setup>
import { useUserStore } from "~/stores/user";
import { useJwtStore } from "~/stores/jwt";
const jwtStore = useJwtStore();
const jwt = jwtStore.jwt;
const userStore = useUserStore();
const emit = defineEmits(["close", "errorOnUpdateUser"]);

const { id, name, role, password, isSelected } = defineProps({
  id: Number,
  name: String,
  role: String,
  password: String,
  isSelected: Boolean
});

const nameInput = ref(name);
const roleInput = ref(role);
const passwordInput = ref("");
const error = ref("");

const editUser = async () => {
  const res = await userStore.updateUser(
    jwt,
    id,
    nameInput.value,
    roleInput.value,
    passwordInput.value
  );
  if (!res) {
    emit("errorOnUpdateUser");
  }
  await userStore.setUsers(jwt);
};
const endUserEdit = () => {
  for (let currentUser of userStore.users){
      currentUser.isSelected = false
  }
};
</script>

<style scoped>
h3 {
  font-size: 1rem;
}

label {
  font-size: 0.8rem;
}

input {
  font-size: 0.8rem;
}

form {
  margin-bottom: 16px;
}

button {
  display: block;
  background-color: #e4a048;
  color: black;
  border: 1px solid #e4a048;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  padding: 0.4em;
  width: inherit;
  margin: 0 auto;
  font-size: 0.8rem;
}

button:hover {
  background-color: #e48d1c;
  border-color: #e48d1c;
}
</style>
