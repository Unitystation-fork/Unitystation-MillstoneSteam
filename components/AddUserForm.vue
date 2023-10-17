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
          <input type="text" class="form-control" id="username" aria-describedby="usernameHelp"
            placeholder="Votre nom d'utilisateur" v-model="username" @keyup="handleChange" />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Votre mot de passe"
            v-model="password" @keyup="handleChange" />
        </div>
        <div class="oauth-icons">
          <a href="#" class="oauth-button discord" @click="redirectToDiscordOAuth">
            <img src="../assets/img/discord-icon.png" alt="Discord Icon" />
            Se connecter avec Discord
          </a>
          <a href="#" class="oauth-button twitch" @click="redirectToTwitchOAuth">
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

const username = ref("");
const password = ref("");
const error = ref("");
const emit = defineEmits(["close"]);
const jwtStore = useJwtStore();
const runtimeConfig = useRuntimeConfig();

defineProps({
  showForm: {
    type: Boolean,
    default: false,
  },
});

const login = async () => {
  if (username.value.length === 0 || password.value.length === 0) {
    error.value = "Veuillez remplir tous les champs";
    return;
  }

  const res = await fetch("http://localhost:3000/api/login", {
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
    });
  if (res.statusCode === 200) {
    jwtStore.setJwt(res.body.token);
    jwtStore.setRole(res.body.role);
    console.log("Logged in");
    emit("close");
  }
};

const handleChange = () => {
  error.value = "";
};

const redirectToDiscordOAuth = async () => {
  const discordClientId = runtimeConfig.discordClientId;
  const discordRedirectUri = runtimeConfig.discordClientRedirect;

  // Vérification de l'utilisateur par le twitchId ou discordId
  const userWithDiscordIdExists = await checkUserByDiscordId(discordId);

  if (userWithDiscordIdExists) {
    // L'utilisateur est autorisé à se connecter via Discord OAuth
    const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${discordRedirectUri}&response_type=code&scope=identify`;
    window.location.href = discordOAuthUrl;
  } else {
    // Aucun utilisateur avec cet ID Discord n'a été trouvé
    error.value = "Aucun utilisateur trouvé avec cet ID Discord. Veuillez vous inscrire avant de vous connecter via Discord OAuth.";
  }
};

const checkUserByDiscordId = async (discordId) => {
  // Implémentez la logique pour vérifier si un utilisateur avec cet ID Discord existe
  // Retournez true si un utilisateur avec cet ID existe, sinon false
  // Vous devez implémenter cette fonction en fonction de votre backend
  return true; // Remplacez par la logique réelle
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

.close-btn {
  cursor: pointer;
  align-self: flex-end;
}

label {
  color: white;
  padding-bottom: 0;
  margin-left: 2em;
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
  gap: 1em;
  align-items: center;
  justify-content: center;
}

.colorText {
  color: black;
  margin: 10px;
}

.bodydy {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.inputStyleAdd {
  border-radius: 8px;
  text-align: center;
  background-color: #37374b;
  color: white;
  margin: 1em;
  display: block;
  min-width: 300px;
  padding: 0.4rem;
  border: 1px solid #2c2c3b;
}

.btnSubmitStyle {
  display: block;
  background-color: #8c9cff;
  color: white;
  font-weight: 600;
  border: 1px solid #8c9cff;
  border-radius: 5px;
  padding: 5px;
  margin: 10px;
  cursor: pointer;
  padding: 0.4em 1em;
}

.btnSubmitStyle:hover {
  background-color: #6c7cff;
  border: 1px solid #6c7cff;
}

.error {
  color: #ee2020;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.01s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67),
    opacity 0.25s linear;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.2) translateY(-50%);
}
</style>
