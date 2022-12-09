<template>
  <header>
    <img
      src="@/assets/img/305474881_500277108772915_4425958856109240367_n.jpg"
      alt="twitch"
    />
    <h1>Bienvenue sur le projet milestone !</h1>
    <div class="btns">
      <button v-if="!jwtStore.jwt" @click="$emit('login')">Login</button>
      <button v-if="jwtStore.jwt" @click="logout">Logout</button>
    </div>
  </header>
  <!-- <div class="warning" v-if="jwtStore.role !==''"> -->
    <h3 class="textWarning"><b class="textWarning">POUR VOS YEUX UNIQUEMENT</b>, ne partager pas cette page elle contient des liens</h3>
  <!-- </div> -->

</template>

<script setup lang="ts">
import { useJwtStore } from "~~/stores/jwt"

const jwtStore = useJwtStore();

function logout() {
  jwtStore.setJwt(null);
  console.log(jwtStore.jwt);
}
</script>

<style scoped>
header {
  height: 64px;
  background-color: #8c9cff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.warning {
  /* background-color: orangered; */
  text-align: center;
  top: 0;
}

.textWarning{
  color: red;
}

button {
  background-color: transparent;
  border: none;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  text-decoration: underline;
}

img {
  height: 44px;
  width: 44px;
  clip-path: circle(50%);
  vertical-align: middle;
  margin-right: 10px;
}
</style>
