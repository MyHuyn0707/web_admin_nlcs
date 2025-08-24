import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Post from "@/views/Post.vue";

Vue.use(Router);

const router = new Router({
    mode: "history",
    routes: [
        { path: "/", redirect: "/login" },
        { path: "/login", name: "login", component: Login },
        { path: "/register", name: "register", component: Register },
        {
            path: "/post",
            name: "post",
            component: Post,
        },
        { path: "*", redirect: "/login" }, // Catch all route for 404s
    ],
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
        next("/login");
    } else {
        next();
    }
});

export default router;
