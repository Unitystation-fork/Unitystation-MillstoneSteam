import { defineStore, storeToRefs } from "pinia";

export const useTaskStore = defineStore("tasks", {
    state: () => ({
        tasks: storeToRefs([]),
    }),

    actions: {
        async setTasks() {
            const res = await fetch("http://localhost:3000/api/task", {
                    method: "GET",
                })
                .then((r) => r.json())
                .catch((e) => {
                    console.log("error", e);
                    return false;
                });
            if (res.statusCode === 500) {
                console.log("error", res);
                return false;
            }
            this.tasks = res.body.tasks;
            return true;
        },
    },
    persist: true,
});