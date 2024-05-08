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
import { onMounted } from "vue";

const userStore = useUserStore();
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

// This function is called when the component is mounted
onMounted(async () => {
  // Create a new URLSearchParams object with the query string of the current URL
  const urlParams = new URLSearchParams(window.location.search);

  // Get the value of the "code" parameter from the URL
  const code = urlParams.get("code");

  // Get the value of the "service" parameter from the URL
  const service = urlParams.get("service");

  // If a code is present in the URL parameters
  if (code) {
    // If the service is "discord"
    if (service === "discord") {
      // Handle the OAuth redirect for Discord with the provided code
      await handleDiscordOAuthRedirect(code);
    }
    // If the service is "twitch"
    else if (service === "twitch") {
      // Handle the OAuth redirect for Twitch with the provided code
      await handleTwitchOAuthRedirect(code);
    }
  }
});

// login handles two types of connections: administrator login requires a username and a password,
// users via discord oAuth are ordinary users and do not require a password
const login = async (isAdmin = true) => {
  //If it is an admin login, the username and password are required.
  //If it is a third-party oauth login, the password is not required.
  if (isAdmin) {
    if (username.value.length === 0 || password.value.length === 0) {
      error.value = "Veuillez remplir tous les champs";
      return;
    }
  } else {
    if (username.value.length === 0) {
      error.value = "Veuillez remplir le nom";
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
  const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/login`, {
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
    //redirect to home page from discord callback address
    alert("Votre connexion est réussie");
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

// This function handles the OAuth redirect for Discord
const handleDiscordOAuthRedirect = async (code) => {
  // Check if the process is client-side
  if (process.client) {
    try {
      // Exchange the code for an access token and get the Discord user
      const discordUser = await exchangeCodeForAccessToken(code);

      // If the Discord user exists
      if (discordUser) {
        // Get the username of the Discord user
        const discordId = discordUser.username;

        // Check if the Discord user exists in the user store
        const res = await userStore.checkThirdPartyUserExistence(discordId);

        // If the user exists (status code 200)
        if (res.statusCode == 200) {
          console.log("Utilisateur Discord trouvé");

          // Set the username value to the Discord ID
          username.value = discordId;

          // Clear the password value
          password.value = "";

          // Log in the user, Discord user does not need a password
          login(false);
        }
        // If the user does not exist (status code 400)
        else if (res.statusCode == 400) {
          console.error("Utilisateur Discord inconnu");

          // Alert the user that they are unknown and need to email the admin
          alert(
            "Utilisateur Discord inconnu, veuillez envoyer un e-mail à <contact.unionrolistes@gmail.com> pour vous ajouter à la liste invitation."
          );

          // Navigate to the home page
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
};

// Twitch Connect Button function: Twitch oAuth Redirect
const redirectToTwitchOAuth = () => {
  const twitchClientId = runtimeConfig.twitchClientId;
  const twitchRedirectUri = runtimeConfig.twitchClientRedirect;
  const twitchOAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${twitchClientId}&redirect_uri=${twitchRedirectUri}&response_type=code&scope=openid`;

  if (process.client) {
    window.location.href = twitchOAuthUrl;
  }
};
// handleTwitchOAuthRedirect: get user's information and login
const handleTwitchOAuthRedirect = async (code) => {
  // Check if the process is client-side
  if (process.client) {
    // Get the Twitch client ID, client secret, and redirect URI from the runtime config
    const clientId = runtimeConfig.twitchClientId;
    const clientSecret = runtimeConfig.twitchClientSecret;
    const redirectUri = runtimeConfig.twitchClientRedirect;

    try {
      // Make a POST request to the Twitch OAuth2 token endpoint to exchange the code for an access token
      const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });

      // Parse the response as JSON
      const data = await response.json();

      // Get the access token from the response data
      const accessToken = data.access_token;

      // Make a GET request to the Twitch users endpoint to get the user info associated with the access token
      const userInfoResponse = await fetch(
        "https://api.twitch.tv/helix/users",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Client-Id": clientId,
          },
        }
      );

      // Parse the user info response as JSON
      const userInfo = await userInfoResponse.json();

      // Get the user ID from the user info data
      const userId = userInfo.data[0].login;

      // If the user ID exists
      if (userId) {
        // Check if the user exists in the user store
        const res = await userStore.checkThirdPartyUserExistence(userId);

        // If the user exists (status code 200)
        if (res.statusCode == 200) {
          console.log("Twitch Utilisateur trouvé");

          // Set the username value to the user ID and clear the password value
          username.value = userId;
          password.value = "";

          // Log in the user
          login(false);
        }
        // If the user does not exist (status code 400)
        else if (res.statusCode == 400) {
          console.error("Twitch Utilisateur inconnu");

          // Alert the user that they are unknown and need to email the admin
          alert(
            "Utilisateur Twitch inconnu, veuillez envoyer un e-mail à <contact.unionrolistes@gmail.com> pour vous ajouter à la liste invitation."
          );

          // Navigate to the home page
          await navigateTo("/");
        }
      } else {
        console.error("Unable to retrieve user information");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
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
