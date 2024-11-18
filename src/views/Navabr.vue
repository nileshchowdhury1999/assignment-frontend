<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <nav class="sticky w-full px-4 py-3 text-gray-200 bg-gray-800">
    <div class="flex items-center justify-between">
      <RouterLink to="/" class="flex items-center pl-8">
        <i class="text-2xl fas fa-campground"></i>
        <h1 class="pl-4 font-serif text-xl font-bold tracking-wide">WeTeach</h1>
      </RouterLink>

      <div class="md:hidden"></div>

      <div class="flex">
        <ul class="flex">
          <li class="pr-8 text-lg">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li class="pr-8 text-lg">
            <p class="cursor-pointer nav-link">Contact</p>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- Sidebar -->
</template>

<style scoped>
.nav-link {
  transition: all 0.3s;
  text-underline-offset: 8px;
}
.nav-link:hover,
.nav-link:focus {
  text-decoration: underline;
  color: #ffd700;
}

.social-icon {
  font-size: 1.5rem;
  padding-right: 2rem;
  transition: color 0.3s;
}
.social-icon:hover,
.social-icon:focus {
  color: #ffd700;
}

/* Sidebar Animation */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.5s ease-out;
}

.sidebar-enter,
.sidebar-leave-to {
  transform: translateX(100%);
}

.fixed {
  position: fixed;
}

.w-64 {
  width: 16rem;
}

.h-full {
  height: 100vh;
}

/* Button styles */
button:focus {
  outline: none;
}

.text-gray-700 {
  color: #4a5568;
}

.text-gray-800 {
  color: #2d3748;
}

.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.transition-transform {
  transition: transform 0.5s ease-out;
}

.translate-x-full {
  transform: translateX(100%);
}

.translate-x-0 {
  transform: translateX(0);
}

.focus\:outline-none:focus {
  outline: none;
}
</style>
