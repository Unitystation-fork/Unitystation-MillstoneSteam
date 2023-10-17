// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      link: [
        {
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0",
          rel: "stylesheet",
        },
      ],
    },
  },
  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: [
          // automatically imports `defineStore`
          "defineStore", // import { defineStore } from 'pinia'
          "storeToRefs", // import { storeToRefs } from 'pinia'
          // automatically imports `defineStore` as `definePiniaStore`
          ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
        ],
      },
    ],
  ],
  runtimeConfig: {
    public: {
      discordClientId: process.env.DISCORD_CLIENT_ID,
      discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
      discordClientRedirect: process.env.DISCORD_CLIENT_REDIRECT,
      twitchClientId: process.env.TWITCH_CLIENT_ID,
      twitchClientSecret: process.env.TWTICH_CLIENT_SECRET,
      twitchClientRedirect: process.env.TWITCH_CLIENT_REDIRECT,
    }
  }
});
