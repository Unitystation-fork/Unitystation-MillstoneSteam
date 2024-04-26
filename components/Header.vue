<template>
  <header>
    <img src="@/assets/img/305474881_500277108772915_4425958856109240367_n.jpg" alt="twitch" />
    <h1>Bienvenue sur le projet milestone !</h1>

    <!--container for flags + time display-->
    <p class="flag-container">
      <img class="flag" src="~/assets/img/flag-france.png" alt="french-flag" />
      <!-- display time in france's timezone -->
      {{ frenchTime }}

      <!-- container for canadian flag + the dropdown menu -->
    <div class="dropdown" @click="toggleCanadianDropdown">
      <!-- dynamic image for displaying the selected flag -->
      <img class="flag" :src="getFlagUrl(selectedTimeZone.flagUrl)" :alt="selectedTimeZone.label" />
      <span class="dropdown-indicator">&#9660;</span>
      <!-- display time in the selected timezone -->
      {{ canadianTime }}

      <!-- dropdown menu will appear when the flag is clicked -->
      <client-only>
        <ul v-show="canadianDropdownOpen" class="dropdown-menu">
          <!-- loop over timezones for user to select -->
          <li v-for="timezone in timezones" :key="timezone.label" @click="selectTimeZone(timezone)">
            {{ timezone.label }}
          </li>
        </ul>
      </client-only>
    </div>

    </p>
    <!--conditional connect/disconnect buttons-->
    <div class="btns" v-if="isCreateButtonVisible">
      <a href="https://vu.fr/mGJw" target="_blank">
        <button @click="hideCreateButton">Create account</button>
      </a>
    </div>

    <div class="btns">
      <button v-if="!jwtStore.jwt" @click="$emit('login')">Login</button>
      <button v-if="jwtStore.jwt" @click="jwtStore.logout()">Logout</button>
    </div>
  </header>
</template>

<!-- script UX and timezone API -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useJwtStore } from '@/stores/jwt';
import { defineStore, storeToRefs } from 'pinia';

// Define your Timezone type if not already globally available
interface Timezone {
  label: string;
  timezone: string;
  flagUrl: string;
}

const jwtStore = useJwtStore();
const { jwt, logout } = storeToRefs(jwtStore);

// reactive states
const canadianDropdownOpen = ref(false);
const now = ref(new Date());

// predefined list of timezones with their corresponding flags and labels
const timezones: Timezone[] = [
  { label: 'Canada', timezone: 'America/Toronto', flagUrl: "flag-canada.png" },
  { label: 'USA Ouest', timezone: 'America/Los_Angeles', flagUrl: "flag-usa.png" },
  { label: 'USA Centre', timezone: 'America/Chicago', flagUrl: "flag-usa.png" },
  { label: 'United Kingdom', timezone: 'Europe/London', flagUrl: "flag-uk.png" },
  { label: 'Russie', timezone: 'Europe/Moscow', flagUrl: "flag-russia.png" },
  { label: 'Australie', timezone: 'Australia/Sydney', flagUrl: "flag-australia.png" },
  { label: 'Guadeloupe', timezone: 'America/Guadeloupe', flagUrl: "flag-guadeloupe.png" },
  { label: 'Martinique', timezone: 'America/Martinique', flagUrl: "flag-martinique.png" },
  { label: 'Guyane', timezone: 'America/Cayenne', flagUrl: "flag-guyane.png" },
  { label: 'La Réunion', timezone: 'Indian/Reunion', flagUrl: "flag-reunion.png" },
];

const selectedTimeZone = ref<Timezone>(timezones[0]);

let intervalId: number;

// function to select a timezone and update the flag and time
const selectTimeZone = (timezone: Timezone) => {
  selectedTimeZone.value = timezone; // this will change both the flag and the timezone
  canadianDropdownOpen.value = false; // close the dropdown menu
};

function toggleCanadianDropdown() {
  canadianDropdownOpen.value = !canadianDropdownOpen.value;
}

function getFlagUrl(path: string): string {
  return new URL(`../assets/img/${path}`, import.meta.url).href;
}

const canadianTime = computed(() => {
  return now.value.toLocaleTimeString('en-CA', { timeZone: selectedTimeZone.value.timezone, hour12: false });
});

const frenchTime = computed(() => {
  return now.value.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour12: false });
});

onMounted(() => {
  intervalId = window.setInterval(() => {
    now.value = new Date();
  }, 1000) as unknown as number;
});

onUnmounted(() => {
  window.clearInterval(intervalId);
});

// Refs for UI control
const isCreateButtonVisible = ref(true);

function hideCreateButton() {
  isCreateButtonVisible.value = false;
}

function performLogout() {
  logout();
}
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

.hidden-select {
  display: none;
}

.flag-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hidden-select {
  display: none;
}

.flag-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.flag {
  height: 36px;
  width: 36px;
  vertical-align: middle;
  margin-left: 10px;
  margin-bottom: 6px;
}

.flag-label {
  cursor: pointer;
}

.flag-emoji {
  font-size: 1.2em;
}

.dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown-indicator {
  user-select: none;
  margin-left: 5px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 16px);
  left: 13px;
  background-color: rgb(102, 101, 210);
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.13);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-menu[style*="display: none;"] {
  display: none;
}

.dropdown-menu li {
  padding: 5px 10px;
}

.dropdown-menu li:hover {
  background-color: #ffffff24;
}

.add-btn {
  font-size: 1em;
}
</style>