import { useJwtStore } from "./jwt";
const jwtStore = useJwtStore();

export const useUserStore = defineStore("users", {
    state: () => ({
        users: storeToRefs([]),
    }),
    actions: {
        async setUsers() {
            const res = await fetch("http://localhost:3000/api/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtStore.jwt}`,
                    },
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
            this.users = res.body.users;
        },
        async deleteUser(id) {
            const conf = confirm("Are you sure you want to delete this user?");
            if (!conf) {
                return;
            }
            const res = await fetch(`http://localhost:3000/api/user/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtStore.jwt}`,
                    },
                })
                .then((r) => r.json())
                .catch((e) => {
                    console.log("error", e);
                    return e;
                });
            if (res.statusCode === 500) {
                if (res.body.error === "Invalid token") {
                    return alert("Vous n'êtes pas autorisé à modifier cette tâche.");
                }
                if (res.body.error === "Expired token") {
                    return alert("Votre session a expiré, veuillez vous reconnecter.");
                } else {
                    return alert(
                        "Une erreur est survenue lors de la suppression de la tâche."
                    );
                }
            }
            //filtrer le tableau des users présent en cookie permet d'éviter un nouvel appel à l'API
            this.users = this.users.filter((user) => user.id !== id);
            return alert("L'utilisateur a bien été supprimé.");
        },
    },
    persist: true,
});