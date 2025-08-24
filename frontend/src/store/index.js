import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: localStorage.getItem("token") || "",
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem("token", token);
        },
        logout(state) {
            state.token = "";
            localStorage.removeItem("token");
        },
    },
    actions: {
        login({ commit }, token) {
            commit("setToken", token);
        },
        logout({ commit }) {
            commit("logout");
        },
    },
});
