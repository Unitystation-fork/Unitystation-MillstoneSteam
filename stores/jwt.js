import { defineStore, storeToRefs } from "pinia";

export const useJwtStore = defineStore("jwt", {
  state: () => ({
    jwt: storeToRefs(null),
  }),
  getters: {
    getJwt(state) {
      return state.token;
    },
  },
  actions: {
    setJwt(jwt) {
      this.jwt = jwt;
    },
  },
  persist: true,
});
