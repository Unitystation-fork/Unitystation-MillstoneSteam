import { defineStore, storeToRefs } from "pinia";
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.preview';
dotenv.config({ path: envFile });

const apiUrl = process.env.API_URL;
console.log(apiUrl);

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: storeToRefs([]),
  }),

  actions: {
    async setTasks() {
      const res = await fetch(
        `${apiUrl}/api/task`,
        {
          method: "GET",
        }
      )
        .then((r) => r.json())
        .catch((e) => {
          console.log("error", e);
          return false;
        });
      if (res.statusCode === 500) {
        console.log("error", res);
        return false;
      }
      //sort tasks by status (completed first)
      this.tasks = res.body.tasks.sort((a, b) => {
        if (a.completed < b.completed) {
          return 1;
        }
        if (a.completed > b.completed) {
          return -1;
        }
        return 0;
      });
      return true;
    },

    async addTask(jwt, title, content, completed) {
      console.log("addTask", title, content, completed, jwt);
      const res = await fetch(
        `http://${apiUrl}/api/task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
          body: JSON.stringify({
            title,
            content,
            completed,
          }),
        }
      )
        .then((r) => r.json())
        .catch((e) => {
          console.log("error", e);
          return e;
        });
      if (res.statusCode !== 200) {
        console.log("error", res);
        if (res.body.error === "Invalid token") {
          return "Vous n'êtes pas autorisé à modifier cette tâche.";
        }
        if (res.body.error === "Expired token") {
          return "Votre session a expiré, veuillez vous reconnecter.";
        }
        return "Une erreur est survenue lors de la modification de la tâche.";
      }
      this.tasks.push(res.body.task);
      return "ok";
    },

    async updateTask(jwt, id, title, content, completed, isContentPrivate) {
      const res = await fetch(
        `http://${apiUrl}/api/task/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
          body: JSON.stringify({
            title,
            content,
            completed,
            isContentPrivate,
          }),
        }
      )
        .then((r) => r.json())
        .catch((e) => {
          error.value = e.message;
          console.log(e);
        });

      if (res.statusCode !== 200) {
        console.log(res.body);
        if (res.body.error === "Invalid token") {
          return "Vous n'êtes pas autorisé à modifier cette tâche.";
        }
        if (res.body.error === "Expired token") {
          return "Votre session a expiré, veuillez vous reconnecter.";
        }
        return "Une erreur est survenue lors de la modification de la tâche.";
      }
      const task = this.tasks.find((t) => t.id === id);
      task.title = title;
      task.content = content;
      task.completed = completed;
      task.isContentPrivate = isContentPrivate;
      return "ok";
    },

    async deleteTask(jwt, id) {
      const conf = confirm("Voulez-vous vraiment supprimer cette tâche ?");
      if (!conf) {
        return;
      }
      const res = await fetch(
        `http://${apiUrl}/api/task/${id}`,
        {
          //await fait attendre que toute la fonction soit déroulée
          headers: {
            Authorization: "Bearer " + jwt,
          },
          method: "DELETE",
        }
      )
        .then((r) => r.json())
        .catch((e) => {
          deleteError.value = e.message;
          console.log(e);
        });

      if (res.statusCode !== 200) {
        console.log(res.body);
        if (res.body.error === "Invalid token") {
          return "Vous n'êtes pas autorisé à modifier cette tâche.";
        }
        if (res.body.error === "Expired token") {
          return "Votre session a expiré, veuillez vous reconnecter.";
        } else {
          return "Une erreur est survenue lors de la suppression de la tâche.";
        }
      }
      this.tasks = this.tasks.filter((t) => t.id !== id);
      return "ok";
    },
  },
  persist: true,
});
