<template>
  <header>
    <img src="@/assets/img/305474881_500277108772915_4425958856109240367_n.jpg" alt="twitch"/>
    <h1>Bienvenue sur le projet milestone !</h1>

    <p class="flag-container">
      <img class="flag" src="~/assets/img/flag-france.png" alt="french-flag" />
      {{ frenchDate }}

      <div class="dropdown" @click="toggleDropdown">
        <img class="flag" src="~/assets/img/flag-canada.png" alt="Select timezone">
        <ul v-show="dropdownOpen" class="dropdown-menu">
          <li v-for="(timezone, index) in timezones" :key="index" @click="selectTimezone(timezone)">
            <img :src="getFlagUrl(timezone)" :alt="`${timezone.text} flag`" />
            {{ timezone.text }}
          </li>
        </ul>
      </div>
      {{ canadianDate }}
    </p>

    <div class="btns">
      <button v-if="!jwtStore.jwt" @click="$emit('login')">Login</button>
      <button v-if="jwtStore.jwt" @click="jwtStore.logout()">Logout</button>
    </div>
  </header>
</template>

<!-- script UX and timezone API -->

<script setup lang="ts">
  import { ref } from 'vue';
  import { useJwtStore } from "~/stores/jwt";

  // set "canadianDate" as a responsive ref => can be update
  const canadianDate = ref('');
  //initialize timezones with empty array
  const timezones = ref<Timezone[]>([]); //store timezone from API
  const apiKey = '1581ce3aefd3c42e5b2e68b91420997d'; 
  const selectedTimeZone = ref('Europe/Paris');
  const dropdownOpen = ref(false);
  const isLoadingTimezones = ref(true);
  const frenchDate = ref('');

  interface Timezone {
    value: string;
    text: string;
  }

  const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
  };

  //declare selectedTimeZone as a responsive ref
  const selectedTimezone = (timezone: Timezone) => {
    selectedTimeZone.value = timezone.value;
    dropdownOpen.value = false;
    updateDate();
  };
  
  //the function will update now + canadianDate based on the selected timezone
  const updateDate = () => {
    const now = new Date();
    canadianDate.value = now.toLocaleString("fr-CA", {
      timeZone: selectedTimeZone.value,
    });
    frenchDate.value = now.toLocaleString("fr-FR");
  };
  
  const getFlagUrl = (timezone: Timezone): string => {
    return 'path/to/flag/image.png'; //return path to the flag img based on the timezone
  };  

  //initialize the jwtStore with the useJwtStore composable
  const jwtStore = useJwtStore();

  //add the hook onMounted to charge the timezone from API
  onMounted(async () => {
    try {
      const response = await fetch('http://api.ipstack.com/2a01:e0a:bd3:2f50:b431:bbc9:da08:a9d2?access_key=1581ce3aefd3c42e5b2e68b91420997d');
      if (response.ok) {
        const data = await response.json();
        timezones.value = data.timezones;
        isLoadingTimezones.value = false;
      } else {
        throw new Error('Erreur lors de la récupération des fuseaux horaires');
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }
  });

  updateDate();
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

.dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.dropdown-menu[style*="display: none;"] {
  display: none;
}

.dropdown-menu li {
  padding: 5px 10px;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}

.add-btn {
  font-size: 1em;
}
</style>