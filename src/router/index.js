import CartPage from "@/components/CartPage.vue";
import Checkout from "@/components/Checkout.vue";
import Home from "@/views/Home.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/checkout",
      name: "Checkout",
      component: Checkout,
    },
    {
      path: "/cart-page",
      name: "CartPage",
      component: CartPage,
    },
  ],
});

export default router;
