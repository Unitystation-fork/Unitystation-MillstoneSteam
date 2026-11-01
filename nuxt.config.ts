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
  serverMiddleware: ["~/api/discord-id"],
  modules: [
    [
      "@pinia/nuxt",
      "@nuxtjs/axios",
      "@nuxtjs/auth-next",
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
    // Secrets : privés au serveur, jamais envoyés au navigateur.
    // Surchargés au runtime par NUXT_DISCORD_CLIENT_SECRET / NUXT_TWITCH_CLIENT_SECRET.
    discordClientSecret: "",
    twitchClientSecret: "",
    // Adresses des API OAuth, surchargeables pour les tests (NUXT_OAUTH_*).
    oauth: {
      discordApiBase: "https://discord.com/api",
      twitchIdBase: "https://id.twitch.tv",
      twitchApiBase: "https://api.twitch.tv",
    },
    public: {
      // surchargeable au runtime (sans rebuild) via NUXT_PUBLIC_API_BASE
      apiBase: "http://localhost:3000",
      // NUXT_PUBLIC_DISCORD_CLIENT_ID, NUXT_PUBLIC_DISCORD_CLIENT_REDIRECT, etc.
      discordClientId: "",
      discordClientRedirect: "",
      twitchClientId: "",
      twitchClientRedirect: "",
    },
  },
});
