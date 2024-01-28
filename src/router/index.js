import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: () => import("@/views/Login.vue") },
    {
      path: "/",
      component: () => import("@/views/Layout.vue"),
      redirect: "/article/manage",
      children: [
        {
          path: "/article/manage",
          component: () => import("@/views/ArticleManage.vue"),
        },
        {
          path: "/article/category",
          component: () => import("@/views/ArticleCategory.vue"),
        },
        {
          path: "/user/profile",
          component: () => import("@/views/UserProfile.vue"),
        },
        {
          path: "/user/avatar",
          component: () => import("@/views/UserAvatar.vue"),
        },
        {
          path: "/user/password",
          component: () => import("@/views/UserPassword.vue"),
        },
      ],
    },
  ],
});

export default router;
