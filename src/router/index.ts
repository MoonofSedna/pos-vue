import { createRouter, createWebHistory } from "vue-router";
// views
import Shopview from "@/views/ShopView.vue";
// stores
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Shopview,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/checkout/:id",
      name: "checkout",
      component: () => import("@/views/CheckoutView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      meta: { requiresAuth: true },
      component: () => import("@/views/admin/AdminLayout.vue"),
      children: [
        {
          path: "products",
          name: "products",
          component: () => import("@/views/admin/ProductsView.vue"),
        },
        {
          path: "sales",
          name: "sales",
          component: () => import("@/views/admin/SalesView.vue"),
        },
        {
          path: "products/new",
          name: "new-product",
          component: () => import("@/views/admin/NewProductView.vue"),
        },
        {
          path: "products/edit/:id",
          name: "edit-product",
          component: () => import("@/views/admin/NewProductView.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth);

  await auth
    .auntheticateUser()
    .then(() => {
      if (requiresAuth) {
        next();
      } else {
        if (to.matched.some(url => url.name === "login")) {
          next({ name: "home" });
        } else {
          next();
        }
      }
    })
    .catch(() => {
      if (requiresAuth) {
        next({ name: "login" });
      } else {
        next();
      }
    });
});

export default router;
