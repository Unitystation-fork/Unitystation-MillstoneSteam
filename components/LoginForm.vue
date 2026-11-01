<template>
  <div>
    <transition name="fade">
      <div class="modal-mask" v-if="showForm" />
    </transition>
    <transition name="pop">
      <form v-if="showForm" @submit.prevent="login">
        <button type="button">
          <span class="material-symbols-outlined" @click="$emit('close')">
            close
          </span>
        </button>
        <h2>Connexion</h2>
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
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
        <div class="oauth-icons">
          <a
            href="#"
            class="oauth-button discord"
            @click.prevent="startOAuth('discord')"
          >
            <img src="../assets/img/discord-icon.png" alt="Discord Icon" />
            Se connecter avec Discord
          </a>
          <a
            href="#"
            class="oauth-button twitch"
            @click.prevent="startOAuth('twitch')"
          >
            <img src="../assets/img/twitch-icon.png" alt="Twitch Icon" />
            Se connecter avec Twitch
          </a>
        </div>
        <input type="submit" value="Connexion" />
        <span class="error" v-if="error !== ''">{{ error }}</span>
      </form>
    </transition>
  </div>
</template>

<script setup>
import { useJwtStore } from "~~/stores/jwt";
import { useTaskStore } from "~~/stores/task";
import { onMounted } from "vue";

const taskStore = useTaskStore();
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

const UNKNOWN_USER_MESSAGE = (service) =>
  `Utilisateur ${service} inconnu, veuillez envoyer un e-mail à <contact.unionrolistes@gmail.com> pour vous ajouter à la liste invitation.`;

// Au retour de Discord/Twitch (?code=...&service=...&state=...), le code est envoyé
// au serveur, qui l'échange lui-même : le secret OAuth ne passe jamais par le navigateur.
onMounted(async () => {
  const { code, service, state, error: oauthError } = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  if (service !== "discord" && service !== "twitch") return;

  // L'utilisateur a refusé l'autorisation chez le fournisseur (?error=access_denied...).
  if (!code) {
    if (!oauthError) return;
    sessionStorage.removeItem("oauth_state");
    alert("Connexion annulée.");
    await navigateTo("/", { replace: true });
    return;
  }

  const expected = sessionStorage.getItem("oauth_state");
  sessionStorage.removeItem("oauth_state");
  if (!state || state !== expected) {
    alert("Session de connexion invalide ou expirée, veuillez réessayer.");
    await navigateTo("/", { replace: true });
    return;
  }

  const res = await fetch(apiUrl(`/api/oauth/${service}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  })
    .then((r) => r.json())
    .catch(() => null);

  if (res?.statusCode === 200) {
    jwtStore.setJwt(res.body.token);
    jwtStore.setRole(res.body.role);
    // le contenu privé n'est envoyé qu'une fois connecté
    await taskStore.setTasks();
    alert("Votre connexion est réussie");
    await navigateTo("/", { replace: true });
    emit("close");
  } else {
    const label = service === "discord" ? "Discord" : "Twitch";
    alert(
      res?.statusCode === 401 && /inconnu/.test(res.message || "")
        ? UNKNOWN_USER_MESSAGE(label)
        : res?.message || "Connexion impossible."
    );
    await navigateTo("/", { replace: true });
  }
});

// Connexion administrateur : nom d'utilisateur et mot de passe.
const login = async () => {
  if (username.value.length === 0 || password.value.length === 0) {
    error.value = "Veuillez remplir tous les champs";
    return;
  }
  const res = await fetch(apiUrl("/api/login"), {
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
      return null;
    });
  if (res?.statusCode === 200) {
    jwtStore.setJwt(res.body.token);
    jwtStore.setRole(res.body.role);
    // le contenu privé n'est envoyé qu'une fois connecté
    await taskStore.setTasks();
    alert("Votre connexion est réussie");
    await navigateTo("/");
    emit("close");
  } else if (res) {
    error.value = res.message || res.statusMessage || "Connexion impossible.";
  }
};

const handleChange = () => {
  error.value = "";
};

// Redirige vers la page d'autorisation du fournisseur, avec un state aléatoire
// (vérifié au retour) contre les requêtes forgées.
const startOAuth = (service) => {
  const pub = useRuntimeConfig().public;
  const state = crypto.randomUUID();
  sessionStorage.setItem("oauth_state", state);
  const p =
    service === "discord"
      ? {
          url: "https://discord.com/oauth2/authorize",
          client_id: pub.discordClientId,
          redirect_uri: pub.discordClientRedirect,
          scope: "identify",
        }
      : {
          url: "https://id.twitch.tv/oauth2/authorize",
          client_id: pub.twitchClientId,
          redirect_uri: pub.twitchClientRedirect,
          scope: "openid",
        };
  const query = new URLSearchParams({
    response_type: "code",
    client_id: p.client_id,
    redirect_uri: p.redirect_uri,
    scope: p.scope,
    state,
  });
  window.location.href = `${p.url}?${query}`;
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
  color: white;
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
  color: white;
}

.oauth-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.oauth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em 1em;
  background-color: #7289da;
  /* Couleur Discord */
  color: white;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.oauth-button:hover {
  background-color: #5865f2;
  /* Couleur Discord au survol */
}

.oauth-button img {
  width: 24px;
  height: 24px;
  margin-right: 0.5em;
}

/* Style spécifique pour le bouton Discord */
.discord {
  background-color: #7289da;
  /* Couleur Discord */
}

.discord:hover {
  background-color: #5865f2;
  /* Couleur Discord au survol */
}

/* Style spécifique pour le bouton Twitch */
.twitch {
  background-color: #6441a5;
  /* Couleur Twitch */
}

.twitch:hover {
  background-color: #9146ff;
  /* Couleur Twitch au survol */
}
</style>
