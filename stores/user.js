// import { registerRuntimeCompiler } from "nuxt/dist/app/compat/capi";
import { defineStore, storeToRefs } from "pinia";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: storeToRefs([]),
  }),
  actions: {
    async setUsers(jwt) {
      const res = await fetch("http://localhost:3000/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((r) => r.json())
        .catch((e) => {
          console.log("error", e);
          return false;
        });
      if (res.statusCode !== 200) {
        console.log("error", res);
        if (res.body.error === "Invalid token") {
          return "Vous n'êtes pas autorisé consulter un utilisateur.";
        }
        if (res.body.error === "Expired token") {
          return "Votre session a expiré, veuillez vous reconnecter.";
        }
      }
      this.users = res.body.users;
      return true;
    },

    async addUser(jwt, name, role, password, discordId, twitchId) {
      const res = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name,
          role,
          password,
          discordId,
          twitchId,
        }),
      })
        .then((r) => r.json())
        .catch((e) => {
          console.log("error", e);
          return e;
        });
      if (res.statusCode !== 200) {
        if (res.body.error === "Invalid token") {
          return alert("Vous n'êtes pas autorisé à créer un utilisateur.");
        }
        if (res.body.error === "Expired token") {
          return alert("Votre session a expiré, veuillez vous reconnecter.");
        } else {
          return alert(
            "Une erreur est survenue lors de la création de l'utilisateur."
          );
        }
      }
      return true;
    },

    async deleteUser(jwt, id) {
      const conf = confirm(
        "Êtes vous sûr de vouloir supprimer cet utilisateur ?"
      );
      if (!conf) {
        return;
      }
      const res = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((r) => r.json())
        .catch((e) => {
          console.log("error", e);
          return e;
        });
      if (res.statusCode !== 200) {
        if (res.body.error === "Invalid token") {
          return alert("Vous n'êtes pas autorisé à supprimer un utilisateur.");
        }
        if (res.body.error === "Expired token") {
          return alert("Votre session a expiré, veuillez vous reconnecter.");
        } else {
          return alert(
            "Une erreur est survenue lors de la suppression de l'utilisateur."
          );
        }
      }
      //filtrer le tableau des users présent en cookie permet d'éviter un nouvel appel à l'API
      this.users = this.users.filter((user) => user.id !== id);
      return alert("L'utilisateur a bien été supprimé.");
    },

    async updateUser(jwt, id, name, role, password, discordId, twitchId) {
      const res = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name,
          role,
          password,
          discordId,
          twitchId,
        }),
      })
        .then((r) => r.json())
        .catch((e) => {
          console.log("error", e);
          return false;
        });
      if (res.statusCode !== 200) {
        console.log("error", res.body.error);
        if (res.body.error === "Invalid token") {
          alert("Vous n'êtes pas autorisé à modifier un utilisateur.");
          return false;
        }
        if (res.body.error === "Expired token") {
          alert("Votre session a expiré, veuillez vous reconnecter.");
          return false;
        }
        alert(
          "Une erreur est survenue lors de la modification de l'utilisateur."
        );
        return false;
      }
      alert("L'utilisateur a bien été modifié.");
      return true;
    },
    async checkThirdPartyUserExistence(userId) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/third-party/${userId}`
        );

        const data = await res.json();
        return data; // 200, 400, 500, etc.
      } catch (e) {
        console.log("Api discord-id error", e.message);
        return false;
      }
    },
  },
  persist: true,
});
