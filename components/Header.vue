<template>
  <header>
    <img src="@/assets/img/305474881_500277108772915_4425958856109240367_n.jpg" alt="twitch"/>
    <h1>Bienvenue sur le projet milestone !</h1>

    <!--container for flags + time display-->
    <p class="flag-container">
      <img class="flag" src="~/assets/img/flag-france.png" alt="french-flag" />
      {{ frenchTime }}

  <!-- container for canadian flag + the dropdown menu -->
  <div class="dropdown" @click="toggleCanadianDropdown">
    <img class="flag" src="~/assets/img/flag-canada.png" alt="canadian-flag">
    {{ canadianTime }}

    <!-- dropdown menu will appear when the flag is clicked -->
    <client-only>
      <ul v-show="canadianDropdownOpen" class="dropdown-menu">
        <!--loop to display each timezone from the API -->
        <li v-for="(timezone, index) in timezones" :key="`canadian-${index}`" @click.stop="selectTimezone(timezone)">
          <span class="flag-emoji">{{ countryCodeToFlagEmoji(timezone.countryCode) }}</span>
          {{  timezone.text }}
        </li>
      </ul>
    </client-only>
  </div>
    <div class="btns" v-if="!jwtStore.jwt">
      <a href="https://vu.fr/mGJw" target="_blank">
        <button @click="hideCreateButton">Create account</button>
      </a>
    </div>
    <div class="btns">
      <button v-if="!jwtStore.jwt" @click="$emit('login'), hideCreateButton">Login</button>
      <button v-if="jwtStore.jwt" @click="jwtStore.logout(), showCreateButton">Logout</button>
    </div>
  </header>
</template>

<!-- script UX and timezone API -->
<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
  import { useJwtStore } from "~/stores/jwt";

  //initializing reactive variables
  const canadianDropdownOpen = ref(false); //canadian dropdown status

  //viewer for dropdown menu state
  watch(canadianDropdownOpen, (newVal) => {
    console.log("Dropdown state changed:", newVal);
  });

  //initialize timezones with empty array
  const timezones = ref<Timezone[]>([]); //store timezone from API
  const selectedTimeZone = ref('Europe/Paris'); //timezone selected by default
  const isLoadingTimezones = ref(false); //timezone loading status
  const now = ref(new Date()); //actual hour

  //define timezone interface
  interface Timezone {
    value: string;
    text: string;
    countryCode: string;
  }

  //function to toggle canadian dropdown menu state 
  const toggleCanadianDropdown = () => {
  canadianDropdownOpen.value = !canadianDropdownOpen.value;
  console.log('toggleCanadianDropdown called, new value:', canadianDropdownOpen.value);
  //load time zones only if the dropdown is open
    if (canadianDropdownOpen.value) {
      loadTimezones();
    }
      //force the DOM to update
      nextTick(() => {
        console.log('The DOM should now have updated');
      });
  };

  //API key to access TimeZoneDB
  const timeZoneDBApiKey = 'LSINUF5SW6UO';

  //function to load timezones from API
  const loadTimezones = async () => {
  isLoadingTimezones.value = true;
  const timeZoneDBApiUrl = `http://api.timezonedb.com/v2.1/list-time-zone?key=${timeZoneDBApiKey}&format=json`;

  try {
    const response = await fetch(timeZoneDBApiUrl);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error("Error fetching the time zones");
    }
  
    //updating timezone list with API data
    timezones.value = data.zones.map((zone: { zoneName: string; countryName: string; countryCode: string }) => ({
      value: zone.zoneName, 
      text: zone.countryName,
      countryCode: zone.countryCode
    })).sort((a: Timezone, b: Timezone) => a.text.localeCompare(b.text));

  } catch (error) {
    console.error("API error:", error);
  } finally {
    isLoadingTimezones.value = false;
  }
};

//utility function to convert country code to flag emoji
function countryCodeToFlagEmoji(countryCode: string): string {
  const codePoints = countryCode.toUpperCase().split('').map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
  
  //function to update the current time, will be called when a timezone is selected
  const updateDate = () => {
    now.value = new Date();
  };

  //calculated functions for displaying time based on selected timezones
  const canadianTime = computed(() => now.value.toLocaleTimeString("fr-FR", {
      timeZone: 'America/Toronto',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
  }));

  const frenchTime = computed(() => now.value.toLocaleTimeString("fr-FR", {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
  }));

  //initialization of the store for JWT management
  const jwtStore = useJwtStore();

  let intervalId: number;

  //hook executed after mounting the component
  onMounted(() => {
      updateDate(); //updates current time
      intervalId = window.setInterval(updateDate, 1000); //updates the time every second
  });

  //hook executed before component unmount
  onUnmounted(() => {
    window.clearInterval(intervalId); //stop updating time 
  });
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

.flag-emoji {
  font-size: 1.2em;
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
  background-color: #f0f0f0;
}

.add-btn {
  font-size: 1em;
}
</style>