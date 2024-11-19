<script setup>
import { ref, onMounted, watch } from "vue";

// Define reactive data references
const data = ref([]);
const filteredData = ref([]);
const loading = ref(true);
const filterBy = ref(null);
const orderBy = ref(null);
const cartItemCount = ref(0);
const searchTerm = ref(""); // New search term ref

// Fetch lessons data from the backend
const fetchLessons = async () => {
  loading.value = true;
  try {
    const response = await fetch("http://localhost:5000/lessons");
    if (response.ok) {
      data.value = await response.json();
      filteredData.value = [...data.value];
    } else {
      console.error("Failed to fetch data:", response.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch cart data from the backend
const fetchCart = async () => {
  try {
    const response = await fetch("http://localhost:5000/cart");
    if (response.ok) {
      cartItemCount.value = (await response.json()).length;
    } else {
      console.error("Failed to fetch data:", response.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Add a new item to the cart and update availability
const handleAddToCart = async (lesson) => {
  const lesson_id = lesson._id;

  try {
    const response = await fetch("http://localhost:5000/cart", {
      method: "POST",
      body: JSON.stringify({
        ...lesson,
        lesson_id: lesson_id,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    await fetchCart();

    const updateSpace = (items) =>
      items.map((item) => {
        if (item._id === lesson_id) {
          return {
            ...item,
            space: item.space > 0 ? item.space - 1 : 0,
          };
        }
        return item;
      });

    data.value = updateSpace(data.value);
    filteredData.value = updateSpace(filteredData.value);
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

// Filter data based on attributes
const handleFilterChange = (filterKey, isChecked) => {
  filterBy.value = filterKey;
  orderBy.value = "ascending";
  let originalData = [...data.value];
  if (isChecked) {
    switch (filterKey) {
      case "subject":
        filteredData.value = originalData.sort((a, b) =>
          a.subject.localeCompare(b.subject)
        );
        break;
      case "location":
        filteredData.value = originalData.sort((a, b) =>
          a.location.localeCompare(b.location)
        );
        break;
      case "price":
        filteredData.value = originalData.sort((a, b) => a.price - b.price);
        break;
      case "availability":
        filteredData.value = originalData
          .filter((course) => course.space > 0)
          .sort((a, b) => a.space - b.space);
        break;
    }
  } else {
    filteredData.value = [...originalData];
  }
};

// Sort data in ascending order
const sortDataAscending = () => {
  orderBy.value = "ascending";
  filteredData.value.sort((a, b) => {
    if (filterBy.value == "subject") return a.subject.localeCompare(b.subject);
    if (filterBy.value == "location")
      return a.location.localeCompare(b.location);
    if (filterBy.value == "price") return a.price - b.price;
    return a.space - b.space;
  });
};

// Sort data in descending order
const sortDataDescending = () => {
  orderBy.value = "descending";
  filteredData.value.sort((a, b) => {
    if (filterBy.value == "subject") return b.subject.localeCompare(a.subject);
    if (filterBy.value == "location")
      return b.location.localeCompare(a.location);
    if (filterBy.value == "price") return b.price - a.price;
    return b.space - a.space;
  });
};

// Watch searchTerm and filter data
watch(searchTerm, (newSearchTerm) => {
  filteredData.value = data.value.filter((course) => {
    return (
      course.subject.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
      course.location.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
      course.price.toString().includes(newSearchTerm) ||
      (course.space > 0 ? "available" : "unavailable").includes(
        newSearchTerm.toLowerCase()
      )
    );
  });
});
console.log(orderBy.value);
// Initial data fetch
onMounted(() => {
  fetchLessons();
  fetchCart();
});
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
              v-for="(label, key) in {
                subject: 'Subject',
                location: 'Location',
                price: 'Price',
                availability: 'Availability',
              }"
              :key="key"
              class="flex items-center"
            >
              <input
                @change="handleFilterChange(key, $event.target.checked)"
                :value="label"
                type="radio"
                class="mr-2 check"
                :id="key"
                name="filter"
              />
              <label :for="key" class="text-lg text-gray-700">{{
                label
              }}</label>
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
                @change="sortDataAscending()"
                value="Ascending"
                type="radio"
                class="mr-2 check"
                id="ascending"
                name="order"
                :checked="orderBy === 'ascending'"
              />
              <label for="ascending" class="text-lg text-gray-700"
                >Ascending</label
              >
            </div>
            <div class="flex items-center mt-3">
              <input
                @change="sortDataDescending()"
                value="Descending"
                type="radio"
                class="mr-2 check"
                id="descending"
                name="order"
                :checked="orderBy === 'descending'"
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
        <div v-if="loading" class="text-center text-gray-500">
          Loading courses...
        </div>

        <div
          v-else
          v-for="course in filteredData"
          :key="course.id"
          class="max-w-lg p-4 overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl"
        >
          <img
            class="object-cover w-full h-48 mb-4 rounded-md"
            :src="course.image"
            :alt="course.title"
          />
          <div class="px-4 py-2">
            <div class="mb-2 text-xl font-bold text-gray-800">
              {{ course.subject }}
            </div>
            <p class="mb-2 text-sm text-gray-600">
              Location: <span class="font-semibold">{{ course.location }}</span>
            </p>
            <p class="mb-2 text-sm text-gray-600">
              Price: <span class="font-semibold">${{ course.price }}</span>
            </p>
            <p class="mb-4 text-sm text-gray-600">
              Spaces Left:
              <span class="font-semibold">{{
                course.space > 0 ? course.space : 0
              }}</span>
            </p>
          </div>
          <div class="px-4 pb-2">
            <button
              v-if="course.space > 0"
              @click="() => handleAddToCart(course)"
              class="w-full px-4 py-2 font-semibold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add to Cart
            </button>
            <button
              v-else
              disabled
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
            {{ cartItemCount }}
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