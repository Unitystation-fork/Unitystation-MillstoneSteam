<template>
  <header>
    <img
      src="@/assets/img/305474881_500277108772915_4425958856109240367_n.jpg"
      alt="twitch"
    />
    <h1 class="bienvenue">Bienvenue sur le projet milestone !</h1>

    <p class="time">
      <img class="flag" src="~/assets/img/flag-france.png" alt="french-flag" />
      {{ frenchDate }}
      <span class="zone" ref="zoneMenu">
        <button
          class="zone-btn"
          type="button"
          :aria-expanded="zoneMenuOpen"
          :aria-label="`Fuseau affiché : ${selectedZone.label}. Changer de fuseau`"
          @click="zoneMenuOpen = !zoneMenuOpen"
        >
          <img class="flag" :src="selectedZone.flag" :alt="selectedZone.label" />
          <span class="zone-arrow" aria-hidden="true">&#9660;</span>
        </button>
        {{ selectedDate }}
        <span v-if="zoneMenuOpen" class="zone-menu">
          <button
            v-for="zone in zones"
            :key="zone.timeZone"
            class="zone-item"
            type="button"
            :aria-current="zone.timeZone === selectedZone.timeZone"
            @click="selectZone(zone)"
          >
            <img class="zone-flag" :src="zone.flag" alt="" />
            {{ zone.label }}
          </button>
        </span>
      </span>
    </p>

    <div class="btns" v-if="!jwtStore.jwt">
      <a href="https://forms.gle/kcwuM2f92sxL8Pbn9" target="_blank">
        <button @click="hideCreateButton">Create account</button>
      </a>
    </div>

    <div class="btns">
      <button v-if="!jwtStore.jwt" @click="$emit('login'), hideCreateButton">Login</button>
      <button v-if="jwtStore.jwt" @click="jwtStore.logout(), showCreateButton">Logout</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useJwtStore } from "~/stores/jwt";

import flagAustralia from "~/assets/img/flag-australia.png";
import flagCanada from "~/assets/img/flag-canada.png";
import flagFrance from "~/assets/img/flag-france.png";
import flagGuadeloupe from "~/assets/img/flag-guadeloupe.png";
import flagMartinique from "~/assets/img/flag-martinique.png";
import flagMayotte from "~/assets/img/flag-mayotte.png";
import flagReunion from "~/assets/img/flag-reunion.png";
import flagRussia from "~/assets/img/flag-russia.png";
import flagUk from "~/assets/img/flag-uk.png";
import flagUsa from "~/assets/img/flag-usa.png";

interface Zone {
  label: string;
  timeZone: string;
  flag: string;
}

// Fuseaux proposés au clic sur le drapeau (noms IANA : Intl gère l'heure d'été).
const zones: Zone[] = [
  { label: "Canada (Toronto)", timeZone: "America/Toronto", flag: flagCanada },
  { label: "États-Unis (Los Angeles)", timeZone: "America/Los_Angeles", flag: flagUsa },
  { label: "États-Unis (Chicago)", timeZone: "America/Chicago", flag: flagUsa },
  { label: "Royaume-Uni (Londres)", timeZone: "Europe/London", flag: flagUk },
  { label: "Russie (Moscou)", timeZone: "Europe/Moscow", flag: flagRussia },
  { label: "Australie (Sydney)", timeZone: "Australia/Sydney", flag: flagAustralia },
  { label: "Guadeloupe", timeZone: "America/Guadeloupe", flag: flagGuadeloupe },
  { label: "Martinique", timeZone: "America/Martinique", flag: flagMartinique },
  { label: "Guyane", timeZone: "America/Cayenne", flag: flagFrance },
  { label: "La Réunion", timeZone: "Indian/Reunion", flag: flagReunion },
  { label: "Mayotte", timeZone: "Indian/Mayotte", flag: flagMayotte },
];

const selectedZone = ref<Zone>(zones[0]);
const zoneMenuOpen = ref(false);
const zoneMenu = ref<HTMLElement | null>(null);

// useState : le navigateur reprend l'instant calculé par le serveur, donc les
// deux rendus affichent la même heure ; l'horloge ne démarre qu'une fois monté.
const now = useState("header-now", () => Date.now());

const timeIn = (timeZone: string) =>
  new Date(now.value).toLocaleString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  });
const frenchDate = computed(() => timeIn("Europe/Paris"));
const selectedDate = computed(() => timeIn(selectedZone.value.timeZone));

const selectZone = (zone: Zone) => {
  selectedZone.value = zone;
  zoneMenuOpen.value = false;
};

// pointerdown (et non click) : iOS n'envoie pas de click au document pour une zone vide.
const closeOutside = (event: PointerEvent) => {
  if (!zoneMenu.value?.contains(event.target as Node)) zoneMenuOpen.value = false;
};
const closeOnEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") zoneMenuOpen.value = false;
};

let clock: ReturnType<typeof setInterval>;
onMounted(() => {
  now.value = Date.now();
  clock = setInterval(() => (now.value = Date.now()), 1000);
  document.addEventListener("pointerdown", closeOutside);
  document.addEventListener("keydown", closeOnEscape);
});
onUnmounted(() => {
  clearInterval(clock);
  document.removeEventListener("pointerdown", closeOutside);
  document.removeEventListener("keydown", closeOnEscape);
});

const jwtStore = useJwtStore();

</script>

<style scoped>
header {
  position: relative;
  height: 8vw;
  background-color: #6665d2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}
.bienvenue{
  font-size: 2.5vw;
}
button {
  background-color: transparent;
  border: none;
  font-size: 1.5vw;
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
  height: 5vw;
  width: 5vw;
  clip-path: circle(50%);
  vertical-align: middle;
}

.flag {
  height: 4vw;
  width: 4vw;
  vertical-align: middle;
  margin-left: 10px;
  margin-bottom: 6px;
}
.time{
  font-size: 2vw;
}
.zone {
  position: relative;
  display: inline-block;
}
.zone-btn {
  position: relative;
  padding: 0;
  font-size: inherit;
}
/* Zone tactile élargie : sur téléphone le drapeau ne fait que 15 px. */
.zone-btn::after {
  content: "";
  position: absolute;
  inset: -15px -8px;
}
.zone-arrow {
  font-size: 0.6em;
  margin-left: 4px;
  vertical-align: middle;
}
.zone-menu {
  position: absolute;
  top: calc(100% + 1vw);
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow-y: auto;
  background-color: #6665d2;
  border: 1px solid #ffffff40;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.4);
}
.zone-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: max(1.5vw, 16px);
  text-align: left;
  white-space: nowrap;
}
.zone-item:hover,
.zone-item[aria-current="true"] {
  background-color: #ffffff24;
}
.zone-flag {
  height: 24px;
  width: 24px;
}
/* Téléphone : le menu s'ancre à la largeur de l'en-tête, il ne déborde plus à gauche. */
@media (max-width: 480px) {
  .zone {
    position: static;
  }
  .zone-menu {
    top: 100%;
    left: 8px;
    right: 8px;
  }
}
.add-btn {
  font-size: 1em;
}
</style>
