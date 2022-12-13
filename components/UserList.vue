<template>
  <div>
    <h2>Liste des utilisateurs</h2>
    <span class="error" v-if="error === ''"
      >Une erreur est survenue. Utilisateurs impossible à afficher.</span
    >
    <table v-if="error !== ''">
      <thead>
        <tr>
          <th>ID</th>
          <th>Pseudo</th>
          <th>Role</th>
          <th>Modifier</th>
          <th>Supprimer</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userStore.users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.role }}</td>
          <td class="action edit">
            <span
              class="material-symbols-outlined edit-btn"
              :class="user.id"
              @click="isModifShown = true"
            >
              edit
            </span>
          </td>
          <td class="action delete">
            <span
              class="material-symbols-outlined"
              @click="deleteUser(user.id)"
            >
              delete
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/user";
import { useJwtStore } from "~~/stores/jwt";
const userStore = useUserStore();
const users = await userStore.setUsers();
const jwtStore = useJwtStore();
const isModifShown = ref(false);
const error = ref("");
const deleteError = ref("");

console.log(users);

if (!users) {
  error.value =
    "Une erreur est survenue durant l'affichage des utilisateurs. Veuillez réessayer ultérieurement.";
}

const deleteUser = async (id) => {
  await userStore.deleteUser(id);
};
</script>

<style scoped>
.error {
  color: #ee2020;
  text-align: center;
}

table {
  margin: 0 auto;
  border-collapse: collapse;
  border: 1px solid #000;
}

h2 {
  min-width: 700px;
  max-width: 750px;
  margin: 2rem auto;
}

thead,
tr {
  height: 2rem;
}
td,
th {
  padding: 0.5rem;
}
.action {
  text-align: center;
  cursor: pointer;
}

.delete:hover {
  color: #ee2020;
}

.edit:hover {
  color: #8c9cff;
}
</style>
