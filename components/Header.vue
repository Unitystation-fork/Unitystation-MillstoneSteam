<template>
  <header>
    <p>{{date}}🇫🇷  {{date6}}🇨🇦</p>
    <img
      src="@/assets/img/305474881_500277108772915_4425958856109240367_n.jpg"
      alt="twitch"
    />
    <h1>Bienvenue sur le projet milestone !</h1>
    <div class="btns">
      <button v-if="!jwtStore.jwt" @click="$emit('login')">Login</button>
      <button v-if="jwtStore.jwt" @click="jwtStore.logout()">Logout</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useJwtStore } from "~/stores/jwt";

let now = new Date();

let date = now.toLocaleString('fr-FR',{hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'Europe/Paris'});
let date6 = now.toLocaleString('fr-FR',{hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'America/Toronto'});

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
  margin-right: 10px;
}

.add-btn {
  font-size: 1em;
}
</style>
