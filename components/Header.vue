<template>
  <header>
    <img src="@/assets/img/305474881_500277108772915_4425958856109240367_n.jpg" alt="twitch"/>
    <h1>Bienvenue sur le projet milestone !</h1>

    <p class="flag-container">
      <img class="flag" src="~/assets/img/flag-france.png" alt="french-flag" />
      {{ frenchTime }}

      <!-- container for the canadian flag + the dropdown menu -->
      <div class="dropdown" @click="toggleCanadianDropdown">
        <img class="flag" src="~/assets/img/flag-canada.png" alt="canadian-flag">
      {{ canadianTime }}
      <!-- dropdown menu will appear when the flag is clicked -->
        <ul v-show="canadianDropdownOpen" class="dropdown-menu">
          <!-- v-for loop to display each timezone from the API -->
          <li v-for="(timezone, index) in timezones" :key="`canadian-${index}`" @click.stop="selectTimezone(timezone)">
            <img :src="getFlagUrl(timezone)" :alt="`${timezone.text} flag`" />
            {{ timezone.text }}
          </li>
        </ul>
      </div>

      
    </p>

    <div class="btns">
      <button v-if="!jwtStore.jwt" @click="$emit('login')">Login</button>
      <button v-if="jwtStore.jwt" @click="jwtStore.logout()">Logout</button>
    </div>
  </header>
</template>

<!-- script UX and timezone API -->

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import { useJwtStore } from "~/stores/jwt";

  // set "canadianDate" as a responsive ref => can be update
  const canadianDropdownOpen = ref(false);
  //initialize timezones with empty array
  const timezones = ref<Timezone[]>([]); //store timezone from API
  const selectedTimeZone = ref('Europe/Paris');
  const dropdownOpen = ref(false);
  const isLoadingTimezones = ref(true);
  const now = ref(new Date());

  const apiKey = '1581ce3aefd3c42e5b2e68b91420997d'; 

  //define timezone interface
  interface Timezone {
    value: string;
    text: string;
  }

  //toggle the dropdown for canadian flag
  const toggleCanadianDropdown = () => {
      canadianDropdownOpen.value = !canadianDropdownOpen.value;
      if (canadianDropdownOpen.value && timezones.value.length === 0) {
        //load the timezones from the API when the dropdown is first opened
        loadTimezones();
      }
  };

  //define an interface for the API response
  interface ApiResponse {
    valueProperty: string;
    textProperty: string;
  }

  //load the timezones from the API
  const loadTimezones = async () => {
    isLoadingTimezones.value = true;
    try {
      const response = await fetch('http://api.ipstack.com/2a01:e0a:bd3:2f50:b431:bbc9:da08:a9d2?access_key=1581ce3aefd3c42e5b2e68b91420997d');
      const data = await response.json();
      //transform data to match the timezone interface if necessary
      timezones.value = data.map(tz => ({
        value: tz.valueProperty,
        text: tz.textProperty
      }));
    } catch (error) {
      console.error("Failed to load timezones", error);
    } finally {
      isLoadingTimezones.value = false;
    }
  };

  //when a timezone is selected from the dropdown
  const selectedTimezone = (timezone: Timezone) => {
    selectedTimeZone.value = timezone.value;
    canadianDropdownOpen.value = false;
    updateDate();
  };
  
  //function to update the current time, will be called when a timezone is selected
  const updateDate = () => {
    now.value = new Date();
  };

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

  //get the URL for the flag img based on the timezone
  const getFlagUrl = (timezone: Timezone): string => {
    return `path/to/flag/${timezone.value.toLowerCase()}.png`; 
  };  

  //initialize the jwtStore
  const jwtStore = useJwtStore();

  let intervalId: number;

  //add the hook onMounted to charge the timezone from API
  onMounted(() => {
    if (process.client) {
      updateDate();
      intervalId = window.setInterval(() => {
        now.value = new Date();
      }, 1000); 
    }
  });

  onUnmounted(() => {
    window.clearInterval(intervalId);
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