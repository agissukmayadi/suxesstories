import { createRouter, createWebHashHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
      path: "/talent-dashboard",
      component: () => import("../views/TalentDashboard.vue"),
      meta: {
        requiresAuth: true,
        requiresRole: ["talent"],
      },
    },
    {
      path:'/qrcode',
      component: () => import("../views/QrCode.vue"),
      meta: {
        requiresAuth: true,
        requiresRole: ["talent"],
      },
    },
    {
      path:'/formdata',
      component: () => import("../views/FormData.vue"),
      meta: {
        requiresAuth: true,
        requiresRole: ["talent"],
      },
    },
    {
      path:'/payment',
      component: () => import("../views/Payment.vue"),
      meta: {
        requiresAuth: true,
        requiresRole: ["talent"],
      },
    },
    {
      path: "/unauthorized",
      component: () => import("../views/Unauthorized.vue"),
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

router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const db = getFirestore();
  const requiresAuth = to.meta.requiresAuth;
  const requiresGuest = to.meta.requiresGuest;
  const requiresRole = to.meta.requiresRole;

  const user = auth.currentUser;

  if (requiresAuth && !user) {
    next("/login"); 
  } else if (requiresGuest && user) {
    next("/"); 
  } else if (user && requiresRole) {
    // Periksa role di Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userRole = userData.role;

      if (requiresRole.includes(userRole)) {
        next(); // Izinkan akses jika role cocok
      } else {
        next("/unauthorized"); // Halaman tidak diizinkan
      }
    } else {
      next("/login"); 
    }
  } else {
    next(); 
  }
});


export default router;
