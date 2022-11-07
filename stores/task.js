import { defineStore, storeToRefs } from "pinia";

export const useTaskStore = defineStore("tasks", {
    state: () => ({
        tasks: storeToRefs([]),
    }),

    actions: {
        async setTasks() {
            if (this.tasks.length > 0) return;
            const res = await fetch("http://localhost:3000/api/task", {
                    method: "GET",
                })
                .then((r) => r.json())
                .catch((e) => {
                    console.log(e);
                });
            if (res.statusCode === 200) {
                this.tasks = res.body.tasks;
            }
        },
    },
    persist:true,
});