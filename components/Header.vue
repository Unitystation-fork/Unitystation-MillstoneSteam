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
      <client-only>
        <ul v-if="canadianDropdownOpen && timezones.length > 0" class="dropdown-menu">
          <!-- v-for loop to display each timezone from the API -->
          <li v-for="(timezone, index) in timezones" :key="`canadian-${index}`" @click.stop="selectTimezone(timezone)">
            <img :src="getFlagUrl(timezone)" :alt="`${timezone.text} flag`" />
            {{ timezone.text }}
          </li>
        </ul>
      </client-only>
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
  import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
  import { useJwtStore } from "~/stores/jwt";

  // set "canadianDate" as a responsive ref => can be update
  const canadianDropdownOpen = ref(false);

  watch(canadianDropdownOpen, (newVal) => {
    console.log("Dropdown state changed:", newVal);
  });

  //initialize timezones with empty array
  const timezones = ref<Timezone[]>([]); //store timezone from API
  const selectedTimeZone = ref('Europe/Paris');
  const isLoadingTimezones = ref(false);
  const now = ref(new Date()); 

  //define timezone interface
  interface Timezone {
    value: string;
    text: string;
  }

  //toggle the dropdown for canadian flag
  const toggleCanadianDropdown = () => {
    if (canadianDropdownOpen.value) {
          loadTimezones();
      }
      canadianDropdownOpen.value = !canadianDropdownOpen.value;
  };

  const testDropdown = () => {
    canadianDropdownOpen.value = true;
  };

  const apiKey = '1581ce3aefd3c42e5b2e68b91420997d';
  const baseURL = 'http://api.ipstack.com';
  const userIpAddress = '134.201.250.155';

  //load the timezones from the API
  const loadTimezones = async () => {
    isLoadingTimezones.value = true;
    const fullUrl = `${baseURL}/${userIpAddress}?access_key=${apiKey}`;

    try {
      const response = await fetch(fullUrl);
      const data = await response.json();
      if (response.ok && data.location && data.location.time_zone) {
        timezones.value = [{
          value: data.location.geoname_id,
          text: `GMT${data.location.time_zone.offset}`,
        }];
      } else {
        throw new Error(data.error ? data.error.info : 'Unknow error');
      }
    } catch (error) {
      console.error("API error : ", error);
    } finally {
      isLoadingTimezones.value = false;
    }
    console.log("Fuseaux horaires chargés : ", timezones.value);
  }

  //when a timezone is selected from the dropdown
  const selectedTimezone = (timezone: Timezone) => {
    selectedTimeZone.value = timezone.value;
    canadianDropdownOpen.value = false;
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
      updateDate();

      intervalId = window.setInterval(updateDate, 1000);
      testDropdown();
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