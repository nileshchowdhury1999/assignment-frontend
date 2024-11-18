<script setup>
import { ref, computed, onMounted } from 'vue';

// Reactive variables for name, phone, and validation
const name = ref('');
const phone = ref('');
const orderSubmitted = ref(false);

// Regular expressions for name and phone validation
const nameRegex = /^[A-Za-z\s]+$/;  // Only letters and spaces
const phoneRegex = /^[0-9]{10}$/;  // Exactly 10 digits

// Compute if the form is valid
const isFormValid = computed(() => {
  return nameRegex.test(name.value) && phoneRegex.test(phone.value);
});

// Handle checkout submission
const handleCheckout = () => {
  if (isFormValid.value) {
    orderSubmitted.value = true;
  }
};


const data = ref([]);
const loading = ref(true); 

onMounted(async () => {
    try {
        const response = await fetch('http://localhost:5000/cart');
        if (response.ok) {
            data.value = await response.json(); 
        } else {
            console.error('Failed to fetch data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading.value = false; 
    }
});


const totalPrice = computed(() => {
  return data.value ? data.value.reduce((sum, item) => sum + parseFloat(item.course.price) * 1, 0) : 0;
  
});

console.log(totalPrice);

</script>

<template>
  <div class="bg-gray-100 flex justify-evenly items-center">
    <div class="flex justify-center  items-center min-h-screen py-8">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-xl">
        <!-- Checkout Form -->
        <h2 class="text-2xl font-bold text-gray-700 mb-6">Checkout Form</h2>
        
        <!-- Name Field -->
         <form action="">
<div class="flex justify-evenly gap-8">
          <div class="mb-4 flex-row">
          <label for="name" class="block text-lg font-semibold text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
          <span v-if="name && !nameRegex.test(name)" class="text-red-500 text-sm">Name must contain only letters and spaces</span>
        </div>

        <!-- Phone Number Field -->
        <div class="mb-4">
          <label for="phone" class="block text-lg font-semibold text-gray-700">Phone Number</label>
          <input
            type="text"
            id="phone"
            v-model="phone"
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
          <span v-if="phone && !phoneRegex.test(phone)" class="text-red-500 text-sm">Phone number must be 10 digits</span>
        </div>
         </div>

         </form>
         
        

        <!-- Checkout Button -->
        <div>
          <button
            @click="handleCheckout"
            :disabled="!isFormValid"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-400"
          >
            Checkout
          </button>
        </div>

        <!-- Confirmation Message -->
        <div v-if="orderSubmitted" class="mt-4 text-green-600 font-semibold">
          <p>Your order has been submitted successfully!</p>
        </div>
      </div>
    </div>

    <div class=" bg-white max-w-xl px-2">
        <h1 class="py-6 border-b-2 text-xl text-gray-600 px-8">
          Order Summary
        </h1>
          
              <ul v-for="carts in data"  class="py-6 border-b space-y-6 px-8" >
              <li :key="carts._id" class="grid grid-cols-6 gap-2 border-b-1" >
            <div class="col-span-1 self-center">
              <img class="h-12 w-12 rounded-lg" :src="carts.course.image" alt='' />
            </div>
            <div class="flex flex-col col-span-3 pt-2">
              <span class="text-gray-600 text-md font-semi-bold">
                {{carts.course.subject}}
              </span>
              
            </div>
            <div class="col-span-2 pt-3">
              <div class="flex items-center space-x-2 text-sm justify-between">
                <span class="text-gray-400">1 × ${{carts.course.price}}</span>
                <span class="text-pink-400 font-semibold inline-block">
                  ${{ carts.course.price}}
                </span>
              </div>
            </div>
          </li>
        </ul>
            
        <div class="px-8 border-b">
          <div class="flex justify-between py-4 text-gray-600">
            <span>Subtotal</span>
            <span class="font-semibold text-pink-500">${{556}}</span>
          </div>
          <div class="flex justify-between py-4 text-gray-600">
            <span>Shipping</span>
            <span class="font-semibold text-pink-500">Free</span>
          </div>
        </div>
        <div class="font-semibold text-xl px-8 flex justify-between py-8 text-gray-600">
          <span>Total</span>
          <span>${{totalPrice}}</span>
        </div>
  </div>
  </div>
</template>

<style scoped>
/* Optional: Add styles for form fields and validation feedback */
</style>
