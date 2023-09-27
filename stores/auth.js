import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
    }),
    actions: {
        setAccessToken(token) {
            this.accessToken = token;
        },
    },
});