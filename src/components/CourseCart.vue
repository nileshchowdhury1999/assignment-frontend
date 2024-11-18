<script setup>
import { ref, onMounted, watch } from "vue";


</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="relative my-5">
      <!-- Search Input -->
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <input
        type="search"
        v-model="searchTerm"
        class="block w-full p-4 pl-10 text-sm text-gray-900 placeholder-gray-400 border border-gray-600 rounded-lg focus:border-none focus:border-blue-500 focus:ring-blue-500"
        placeholder="Search lessons..."
        required
      />
    </div>
    <main
      class="container flex flex-col gap-6 py-8 mx-auto space-y-8 md:flex-row max-w-7xl md:space-y-0"
    >
      <div class="w-full p-4 space-y-4 bg-white rounded-lg shadow-md md:w-1/4">
        <h2 class="text-2xl font-semibold text-gray-800">Filters</h2>
        <h3 class="mb-4 text-xl font-medium text-gray-600">
          Sort by attributes
        </h3>
        <div class="flex flex-col">
          <div id="filters-container" class="space-y-3">
            <div
              class="flex items-center"
            >
              <input
                type="radio"
                class="mr-2 check"
                name="filter"
              />
              <label :for="key" class="text-lg text-gray-700"></label>
            </div>
          </div>
        </div>
        <h3 class="pt-10 mb-1 text-xl font-medium text-gray-600">
          Sort by order
        </h3>
        <div class="flex flex-col">
          <div id="filters-container" class="space-y-3">
            <div class="flex items-center mt-0">
              <input
                value="Ascending"
                type="radio"
                class="mr-2 check"
                id="ascending"
                name="order"
              />
              <label for="ascending" class="text-lg text-gray-700"
                >Ascending</label
              >
            </div>
            <div class="flex items-center mt-3">
              <input
                value="Descending"
                type="radio"
                class="mr-2 check"
                id="descending"
                name="order"
              />
              <label for="descending" class="text-lg text-gray-700"
                >Descending</label
              >
            </div>
          </div>
        </div>
      </div>

      <div
        id="products-wrapper"
        class="grid w-full grid-cols-2 gap-6 md:w-3/4 sm:grid-cols-3 xl:grid-cols-3 place-content-center"
      >
        <div class="text-center text-gray-500">
          Loading courses...
        </div>

        <div
          class="max-w-lg p-4 overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl"
        >
          <img
            class="object-cover w-full h-48 mb-4 rounded-md"
          />
          <div class="px-4 py-2">
            <div class="mb-2 text-xl font-bold text-gray-800">
            </div>
            <p class="mb-2 text-sm text-gray-600">
              Location: <span class="font-semibold"></span>
            </p>
            <p class="mb-2 text-sm text-gray-600">
              Price: <span class="font-semibold"></span>
            </p>
            <p class="mb-4 text-sm text-gray-600">
              Spaces Left:
              <span class="font-semibold"></span>
            </p>
          </div>
          <div class="px-4 pb-2">
            <button
              class="w-full px-4 py-2 font-semibold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add to Cart
            </button>
            <button
              class="w-full px-4 py-2 font-semibold text-white transition duration-300 bg-gray-600 rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <!-- shopping cart button -->
      <RouterLink to="/cart-page" class="nav-link"
        ><button
          class="fixed flex items-center p-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none top-20 right-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.6 8M17 13l1.6 8m-10 0h10"
            />
          </svg>
          <span
            class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full"
          >
         
          </span>
        </button></RouterLink
      >
    </main>
  </div>
</template>

<style scoped>
.check {
  accent-color: #3b82f6;
  transform: scale(1.2);
  transition: transform 0.2s ease;
}

.check:checked {
  transform: scale(1.3);
}
</style>