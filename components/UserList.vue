<template>
  <div>
    <h2>Liste des utilisateurs</h2>
    <span class="error" v-if="!users && error !== ''"
      >Une erreur est survenue. Utilisateurs impossible à afficher.</span
    >
    <table v-if="users">
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
          <td class="action">
            <span
              class="material-symbols-outlined edit-btn edit"
              :class="user.id"
              v-if="!showModifUserForm"
              @click="showModifUserForm = true"
            >
              edit
            </span>
            <ModifUser
              v-bind="user"
              v-if="showModifUserForm"
              @close="showModifUserForm = false"
              @errorOnUpdateUser="
                error = `La modification de l'utilisateur ${user.name} a échoué.`
              "
            />
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
import { useJwtStore } from "~~/stores/jwt";
import { useUserStore } from "~/stores/user";
const jwtStore = useJwtStore();
const userStore = useUserStore();
const jwt = jwtStore.jwt;
const users = await userStore.setUsers(jwt);
const showModifUserForm = ref(false);
const error = ref("");

if (users === false) {
  error.value =
    "Une erreur est survenue durant l'affichage des utilisateurs. Veuillez réessayer ultérieurement.";
}

const deleteUser = async (id) => {
  await userStore.deleteUser(jwt, id);
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
