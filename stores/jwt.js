import { defineStore } from "pinia";

export const useJwtStore = defineStore("jwt", {
  state: () => ({
    jwt: null,
    role: "",
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
    setRole(role) {
      this.role = role;
    },
    logout(){  
      this.jwt = null;
      this.role = "";
    }
  
  },
  persist: true,
});
