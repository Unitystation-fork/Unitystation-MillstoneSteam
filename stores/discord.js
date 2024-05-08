import { defineStore, storeToRefs } from "pinia";

export const useDiscordStore = defineStore("discord", {
    state: () => ({
        discordUser: storeToRefs(null),
        isUserFound: false,
    }),
    actions: {
        async fetchDiscordUser(jwt) {
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/discord-id`, {
                method: "GET",
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
                    alert("Vous n'êtes pas autorisé à consulter l'ID Discord.");
                    return false;
                }
                if (res.body.error === "Expired token") {
                    alert("Votre session a expiré, veuillez vous reconnecter.");
                    return false;
                } else {
                    alert("Une erreur est survenue lors de la récupération de l'ID Discord.");
                    return false;
                }
            }

            this.discordUser = res.body;
            this.isUserFound = true; // Définissez la propriété sur true car l'utilisateur a été trouvé
            return true;
        },
    },
});
