<template>
  <header>
    <!-- Image of the Twitch logo, representing the brand or project. -->
    <img src="@/assets/img/305474881_500277108772915_4425958856109240367_n.jpg" alt="twitch" />
    <!-- Main heading welcoming users to the project. -->
    <h1>Bienvenue sur le projet milestone !</h1>

    <!-- Container for displaying flags and times corresponding to different timezones. -->
    <p class="flag-container">
      <!-- Static image showing the French flag. -->
      <img class="flag" src="~/assets/img/flag-france.png" alt="french-flag" />
      <!-- Displays time in France's timezone, updated dynamically. -->
      {{ frenchTime }}

      <!-- Dropdown menu for selecting and displaying Canadian timezones and flags. -->
      <div class="dropdown" @click="toggleCanadianDropdown">
        <!-- Dynamic image sourced from a computed method, showing the selected flag. -->
        <img class="flag" :src="getFlagUrl(selectedTimeZone.flagUrl)" :alt="selectedTimeZone.label" />
        <span class="dropdown-indicator">&#9660;</span>
        <!-- Displays time in the selected Canadian timezone. -->
        {{ canadianTime }}

        <!-- Client-only encapsulation to ensure this part is rendered client-side. -->
        <client-only>
          <!-- Dropdown menu showing when the flag is clicked, allows timezone selection. -->
          <ul v-show="canadianDropdownOpen" class="dropdown-menu">
            <!-- Iterates over a list of timezones, creating a list item for each. -->
            <li v-for="timezone in timezones" :key="timezone.label" @click="selectTimeZone(timezone)">
              {{ timezone.label }}
            </li>
          </ul>
        </client-only>
      </div>
    </p>

    <!-- Buttons for user account actions, shown based on conditional logic. -->
    <div class="btns" v-if="isCreateButtonVisible">
      <!-- Link to account creation, opens in a new tab. -->
      <a href="https://vu.fr/mGJw" target="_blank">
        <button @click="hideCreateButton">Create account</button>
      </a>
    </div>

    <!-- Login and logout buttons displayed based on user authentication status. -->
    <div class="btns">
      <!-- Shows login button if the user is not authenticated. -->
      <button v-if="!jwtStore.jwt" @click="$emit('login')">Login</button>
      <!-- Shows logout button if the user is authenticated. -->
      <button v-if="jwtStore.jwt" @click="performLogout">Logout</button>
    </div>
  </header>
</template>

<!-- script UX and timezone -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useJwtStore } from '@/stores/jwt';
import { defineStore, storeToRefs } from 'pinia';

// Interface defining the structure for a timezone object.
interface Timezone {
  label: string;
  timezone: string;
  flagUrl: string;
}

// Setup for JWT-based authentication store.
const jwtStore = useJwtStore();
const { jwt } = storeToRefs(jwtStore);

// Reactive state declarations.
const canadianDropdownOpen = ref(false);
const now = ref(new Date());

// Predefined list of timezones, each with a label, timezone string, and flag URL.
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

// Reactive reference to the currently selected timezone, defaulting to the first in the list.
const selectedTimeZone = ref<Timezone>(timezones[0]);

// Interval identifier for time updates.
let intervalId: number;

// function to select a timezone and update the flag and time
const selectTimeZone = (timezone: Timezone) => {
  selectedTimeZone.value = timezone; // this will change both the flag and the timezone
  canadianDropdownOpen.value = false; // close the dropdown menu
};

// Toggles the visibility of the dropdown menu.
function toggleCanadianDropdown() {
  canadianDropdownOpen.value = !canadianDropdownOpen.value;
}

// Returns the full URL for a given flag image path.
function getFlagUrl(path: string): string {
  return new URL(`../assets/img/${path}`, import.meta.url).href;
}

// Computed properties for displaying times in specific timezones.
const canadianTime = computed(() => now.value.toLocaleTimeString('en-CA', { timeZone: selectedTimeZone.value.timezone, hour12: false }));
const frenchTime = computed(() => now.value.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour12: false }));

// Lifecycle hooks to set up and tear down a timer that updates the current time.
onMounted(() => {
  intervalId = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
});
onUnmounted(() => {
  window.clearInterval(intervalId);
});

// UI control reference to manage the visibility of the create account button.
const isCreateButtonVisible = ref(true);
function hideCreateButton() {
  isCreateButtonVisible.value = false;
}

// Direct usage of the jwtStore to handle user logout.
function performLogout() {
  jwtStore.logout();
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