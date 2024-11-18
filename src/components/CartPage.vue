<script setup>
import { ref, computed, onMounted, watch } from "vue";

const cartData = ref([]);
const loading = ref(true);

// Reactive variables for name, phone, and validation
const name = ref("");
const phone = ref("");
const orderSubmitted = ref(false);

// Regular expressions for name and phone validation
const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits

// Compute if the form is valid
const isFormValid = computed(() => {
  return nameRegex.test(name.value) && phoneRegex.test(phone.value);
});

// Handle checkout submission
const handleCheckout = () => {
  if (isFormValid.value && cartData.value.length > 0) {
    fetch("http://localhost:5000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
        phone: phone.value,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data) {
          orderSubmitted.value = true;
          cartData.value = [];
          name.value = "";
          phone.value = "";
        }
      });
  }
};

const fetchCart = async () => {
  loading.value = true;
  try {
    const response = await fetch("http://localhost:5000/cart");
    if (response.ok) {
      cartData.value = await response.json();
    } else {
      console.error("Failed to fetch data:", response.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCart);

const totalPrice = computed(() => {
  return cartData.value
    ? cartData.value.reduce((sum, item) => sum + parseFloat(item.price) * parseFloat(item.space), 0)
    : 0;
});

const removeItem = async (id) => {
  fetch("http://localhost:5000/cart/" + id, {
    method: "DELETE",
  })
    .then(() => {
      fetchCart();
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>

<template>
  <div class="bg-gray-100">
    <h2 class="mb-8 text-3xl font-bold text-center text-gray-800">My Cart</h2>
    <main
      class="container grid gap-6 p-4 py-8 mx-auto space-y-8 md:grid-cols-2 md:flex-row max-w-7xl md:space-y-0"
    >
      <div class="py-8 bg-gray-100">
        <div class="container mx-auto">
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th
                    class="px-6 py-4 font-semibold text-left text-gray-600 uppercase bg-gray-200"
                  >
                    Image
                  </th>
                  <th
                    class="px-6 py-4 font-semibold text-left text-gray-600 uppercase bg-gray-200"
                  >
                    Title
                  </th>
                  <th
                    class="px-6 py-4 font-semibold text-center text-gray-600 uppercase bg-gray-200"
                  >
                    Seats
                  </th>
                  <th
                    class="px-6 py-4 font-semibold text-left text-gray-600 uppercase bg-gray-200"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="lesson in cartData"
                  :key="lesson._id"
                  class="border-t border-gray-200 hover:bg-gray-100"
                >
                  <td class="px-6 py-4">
                    <img
                      :src="lesson.image"
                      :alt="lesson.subject"
                      class="object-cover w-16 h-16 rounded-full"
                    />
                  </td>
                  <td class="px-6 py-4 text-gray-800">{{ lesson.subject }}</td>
                  <td class="text-center">
                    {{ lesson.space }} 
                    
                  </td>
                  <td class="px-6 py-4">
                    <button
                      @click="removeItem(lesson.lesson_id)"
                      class="text-red-500 hover:text-red-700"
                      aria-label="Remove from cart"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                  
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- checkout -->

      <div class="bg-gray-100">
        <div class="flex items-center justify-center py-8">
          <div class="w-full max-w-screen-xl p-6 bg-white rounded-lg shadow-lg">
            <!-- Checkout Form -->
            <h2 class="mb-6 text-2xl font-bold text-gray-700">Checkout Form</h2>

            <!-- Name Field -->
            <form action="">
              <div class="flex gap-8 justify-evenly">
                <div class="flex-row mb-4">
                  <label
                    for="name"
                    class="block text-lg font-semibold text-gray-700"
                    >Name</label
                  >
                  <input
                    type="text"
                    id="name"
                    v-model="name"
                    class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                  <span
                    v-if="name && !nameRegex.test(name)"
                    class="text-sm text-red-500"
                    >Name must contain only letters and spaces</span
                  >
                </div>

                <!-- Phone Number Field -->
                <div class="mb-4">
                  <label
                    for="phone"
                    class="block text-lg font-semibold text-gray-700"
                    >Phone Number</label
                  >
                  <input
                    type="text"
                    id="phone"
                    v-model="phone"
                    class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                  <span
                    v-if="phone && !phoneRegex.test(phone)"
                    class="text-sm text-red-500"
                    >Phone number must be 10 digits</span
                  >
                </div>
              </div>
            </form>

            <!-- Checkout Button -->
            <div>
              <button
                @click="handleCheckout"
                :disabled="!isFormValid"
                class="w-full px-4 py-3 font-semibold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Checkout
              </button>
            </div>

            <!-- Confirmation Message -->
            <div
              v-if="orderSubmitted"
              class="mt-4 font-semibold text-green-600"
            >
              <p>Your order has been submitted successfully!</p>
            </div>
          </div>
        </div>

        <div class="px-2 bg-white">
          <h1 class="px-8 py-6 text-xl text-gray-600 border-b-2">
            Order Summary
          </h1>

          <div class="px-8 border-b">
            <div class="flex justify-between py-4 text-gray-600">
              <span>Subtotal</span>
              <span class="font-semibold text-pink-500">${{ totalPrice }}</span>
            </div>
            <div class="flex justify-between py-4 text-gray-600">
              <span>Shipping</span>
              <span class="font-semibold text-pink-500">Free</span>
            </div>
          </div>
          <div
            class="flex justify-between px-8 py-8 text-xl font-semibold text-gray-600"
          >
            <span>Total</span>
            <span>${{ totalPrice }}</span>
          </div>
        </div>
      </div>
      <!-- shopping cart button -->
      <RouterLink to="/" class="nav-link"
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
            {{ cartData.length }}
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
