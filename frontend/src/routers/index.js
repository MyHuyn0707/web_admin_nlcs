import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Post from "@/views/Post.vue";

Vue.use(Router);

const router = new Router({
    routes: [
        { path: "/login", component: Login },
        { path: "/register", component: Register },
        { path: "/post", component: Post, meta: { requiresAuth: true } },
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
