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
          <label for="password">Nom d'utilisateur</label>
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
            @click="redirectToDiscordOAuth"
          >
            <img src="../assets/img/discord-icon.png" alt="Discord Icon" />
            Se connecter avec Discord
          </a>
          <a
            href="#"
            class="oauth-button twitch"
            @click="redirectToTwitchOAuth"
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
import { useUserStore } from "~~/stores/user"; // Update the import path as needed
import { useDiscordStore } from "~~/stores/discord";

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

// login handles two types of connections: administrator login requires a username and a password,
// users via discord oAuth are ordinary users and do not require a password
const login = async (isAdmin = true) => {
  //If it is an admin login, the username and password are required.
  //If it is a third-party oauth login, the password is not required and the username is filled in by the program.
  if (isAdmin) {
    if (username.value.length === 0 || password.value.length === 0) {
      error.value = "Veuillez remplir tous les champs";
      return;
    }
  }
  const data = isAdmin
    ? {
        name: username.value,
        password: password.value,
      }
    : {
        name: username.value,
      };
  const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((r) => r.json())
    .catch((e) => {
      error.value = e.message;
      console.log(e);
    });
  if (res.statusCode === 200) {
    jwtStore.setJwt(res.body.token);
    jwtStore.setRole(res.body.role);
    //redirect to home page from discord cord address
    await navigateTo("/");
    emit("close");
  }
};

const handleChange = () => {
  error.value = "";
};

const redirectToDiscordOAuth = async () => {
  const discordClientId = runtimeConfig.discordClientId;
  const discordRedirectUri = runtimeConfig.discordClientRedirect;
  const discordOAuthUrl = `https://discord.com/oauth2/authorize?response_type=code&client_id=${discordClientId}&scope=identify&state=someUniqueState&redirect_uri=${discordRedirectUri}`;

  if (process.client) {
    window.location.href = discordOAuthUrl;
  }
};

const exchangeCodeForAccessToken = async (code) => {
  if (process.client) {
    const discordClientId = runtimeConfig.discordClientId;
    const discordClientSecret = runtimeConfig.discordClientSecret;
    const discordRedirectUri = runtimeConfig.discordClientRedirect;

    const tokenRequestData = new URLSearchParams();
    tokenRequestData.append("grant_type", "authorization_code");
    tokenRequestData.append("code", code);
    tokenRequestData.append("redirect_uri", discordRedirectUri);

    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          `${discordClientId}:${discordClientSecret}`
        )}`,
      },
      body: tokenRequestData.toString(),
    });

    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json(); // Read the JSON response only once

      const accessToken = tokenData.access_token;

      // Now that you have the access token, use it to get user information
      const userResponse = await fetch("https://discord.com/api/users/@me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (userResponse.ok) {
        const discordUser = await userResponse.json();

        return discordUser; // Return the user information
      }
    }
  }
};

const handleDiscordOAuthRedirect = async () => {
  if (process.client) {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      try {
        const userStore = useUserStore(); // Initialize the store
        const discordUser = await exchangeCodeForAccessToken(code);

        if (discordUser) {
          const discordId = discordUser.username;

          // Utilisez la méthode de store pour vérifier si l'utilisateur Discord existe dans la base de données Prisma
          const res = await userStore.checkDiscordUserExistence(discordId);

          if (res.statusCode == 200) {
            console.log("Utilisateur Discord trouvé");
            //L'utilisateur existe dans la base de données, vous pouvez poursuivre avec votre logique
            username.value = discordId;
            password.value = "";
            // Discord user login, no need of password
            login(false);
          } else if (res.statusCode == 400) {
            console.error("Utilisateur Discord inconnu");
            alert(
              "Utilisateur Discord inconnu, Veuillez envoyer un e-mail à l'administrateur pour vous ajouter à la liste invitation."
            );
            await navigateTo("/");
          }
        } else {
          console.error(
            "Impossible de récupérer les informations de l'utilisateur"
          );
        }
      } catch (e) {
        console.error("Discord OAuth Redirect error");
      }
    }
  }
};
handleDiscordOAuthRedirect();

const redirectToTwitchOAuth = () => {
  const twitchClientId = runtimeConfig.twitchClientId;
  const twitchRedirectUri = runtimeConfig.twitchClientRedirect;

  const twitchOAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${twitchClientId}&redirect_uri=${twitchRedirectUri}&response_type=code&scope=openid`;

  window.location.href = twitchOAuthUrl;
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
