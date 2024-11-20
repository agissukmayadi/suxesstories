import { createRouter, createWebHashHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Dashboard from "../views/Dashboard.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Dashboard,
      meta: {
        requiresAuth: true,
        requiresRole: ["admin"],
      },
    },
    {
      path: "/schedule",
      component: () => import("../views/Schedule.vue"),
      meta: {
        requiresAuth: true,
        requiresRole: ["admin"],
      },
    },
    {
      path: "/event",
      component: () => import("../views/Event.vue"),
      meta: {
        requiresAuth: true,
        requiresRole: ["admin"],
      },
    },
    {
      path: "/event/create",
      component: () => import("../views/CreateEvent.vue"),
      meta: {
        requiresAuth: true,
        requiresRole: ["admin"],
      },
    },
    {
      path: "/company",
      component: () => import("../views/Company.vue"),
      meta: {
        requiresAuth: true,
        requiresRole: ["admin"],
      },
    },
    {
      path: "/company/edit/:id",
      component: () => import("../views/CompanyEdit.vue"),
      meta: {
        requiresAuth: true,
        requiresRole: ["admin"],
      },
    },
    {
      path: "/formschedule",
      component: () => import("../components/FormS.vue"),
      meta: {
        requiresAuth: true,
        requiresRole: ["admin"],
      },
    },
    {
      path: "/login",
      component: () => import("../views/Auth/Login.vue"),
      meta: {
        requiresGuest: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.meta.requiresAuth;
  const requiresGuest = to.meta.requiresGuest;
  const requiresRole = to.meta.requiresRole;

  // Menggunakan Firebase Auth untuk memeriksa status login
  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      // Jika route membutuhkan login tapi pengguna belum login
      next("/login"); // Redirect ke halaman login
    } else if (requiresGuest && user) {
      // Jika route hanya untuk guest dan pengguna sudah login
      next("/"); // Redirect ke dashboard atau halaman lain
    } else {
      // Jika tidak ada kondisi di atas, izinkan akses
      next();
    }
  });
});

export default router;
