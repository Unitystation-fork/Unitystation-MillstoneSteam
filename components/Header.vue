<template>
  <header>
    <img
      src="@/assets/img/305474881_500277108772915_4425958856109240367_n.jpg"
      alt="twitch"
    />
    <h1>Bienvenue sur le projet milestone !</h1>

    <p>
      <img class="flag" src="~/assets/img/flag-france.png" alt="french-flag" />
      {{ frenchDate }}
      <img
        class="flag"
        src="~/assets/img/flag-canada.png"
        alt="canadian-flag"
      />
      {{ canadianDate }}
    </p>

    <div class="btns">
      <button v-if="!jwtStore.jwt" @click="$emit('login')">Login</button>
      <button v-if="jwtStore.jwt" @click="jwtStore.logout()">Logout</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useJwtStore } from "~/stores/jwt";

let now = new Date();

let frenchDate = now.toLocaleString("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Europe/Paris",
});
let canadianDate = now.toLocaleString("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Toronto",
});

const jwtStore = useJwtStore();
</script>

<style scoped>
header {
  height: 64px;
  background-color: #6665d2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

button {
  background-color: transparent;
  border: none;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  color: white;
}

button:hover {
  text-decoration: underline;
}

.material-symbols-outlined {
  vertical-align: middle;
}

img {
  height: 44px;
  width: 44px;
  clip-path: circle(50%);
  vertical-align: middle;
}

.flag {
  height: 36px;
  width: 36px;
  vertical-align: middle;
  margin-left: 10px;
  margin-bottom: 6px;
}

.add-btn {
  font-size: 1em;
}
</style>
