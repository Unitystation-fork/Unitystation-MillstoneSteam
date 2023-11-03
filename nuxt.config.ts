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
      '@nuxtjs/axios',
      '@nuxtjs/auth-next',
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
  auth: {
    strategies: {
      discord: {
        scheme: 'oauth2',
        endpoints: {
          authorization: 'https://discord.com/api/oauth2/authorize',
          token: 'https://discord.com/api/oauth2/token',
          userInfo: 'https://discord.com/api/users/@me',
        },
        responseType: 'token',
        redirectUri: process.env.DISCORD_CLIENT_REDIRECT, // Utilisez la valeur appropriée
        clientId: process.env.DISCORD_CLIENT_ID, // Utilisez la valeur appropriée
      },
    },
  },
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
