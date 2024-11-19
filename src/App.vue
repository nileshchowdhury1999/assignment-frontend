<script setup>
import { RouterView } from "vue-router";
import Navabr from "./views/Navabr.vue";
import Footer from "./views/Footer.vue";
console.log(import.meta.env.VITE_API_BACKEND_API)
</script>

<template>
  <Navabr />
  <RouterView />
  <Footer />
</template>

<style scoped></style>
