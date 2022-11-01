<template>
  <div>
    <header>
      <img
        src="@/assets/img/305474881_500277108772915_4425958856109240367_n.jpg"
        alt="twitch"
      />
      <h1>Bienvenue sur le projet milestone !</h1>
      <div class="btns">
        <button v-if="!isLogged" @click="$emit('login')">Login</button>
        <button v-if="isLogged" @click="logout">Logout</button>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
const isLogged = ref(false);
if (
  localStorage.getItem("isLogged") !== null &&
  localStorage.getItem("isLogged") === "true"
) {
  isLogged.value = true;
}

const logout = () => {
  localStorage.removeItem("isLogged");
  isLogged.value = false;
};

const emit = defineEmits(["login"]);
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
