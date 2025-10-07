<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-900 text-white">
    <div class="p-6 bg-gray-800 w-fit rounded-md space-y-4">
      <div class="text-sm text-gray-400">Unit value</div>

      <div class="flex items-center justify-between">
        <div class="text-gray-300 w-16">Unit</div>
        <div class="flex bg-gray-700 rounded-md overflow-hidden">
          <button
            class="px-4 py-2 transition"
            :class="unit === '%' ? 'bg-gray-600 text-white' : 'text-gray-400'"
            @click="switchUnit('%')"
          >
            %
          </button>
          <button
            class="px-4 py-2 transition"
            :class="unit === 'px' ? 'bg-gray-600 text-white' : 'text-gray-400'"
            @click="switchUnit('px')"
          >
            px
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-gray-300 w-16">Value</div>

        <div
          class="flex items-center bg-gray-700 rounded-md overflow-hidden border border-transparent
                focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition"
        >
          <button
            class="px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-30 transition-colors"
            :disabled="parsedValue <= 0"
            @click="decrease"
          >
            −
          </button>

          <input
            type="text"
            v-model="rawValue"
            @blur="sanitizeInput"
            class="w-20 bg-transparent text-center outline-none"
          />

          <button
            class="px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-30 transition-colors"
            :disabled="unit === '%' && parsedValue >= 100"
            @click="increase"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const unit = ref('%')
const rawValue = ref('1.0')
let previousValidValue = 1.0

const parsedValue = computed(() => {
  const num = parseFloat(rawValue.value.replace(',', '.'))
  return isNaN(num) ? 0 : num
})

const switchUnit = (newUnit) => {
  if (unit.value === 'px' && newUnit === '%' && parsedValue.value > 100) {
    rawValue.value = '100'
    previousValidValue = 100
  }
  unit.value = newUnit
}

const increase = () => {
  let value = parsedValue.value + 1
  if (unit.value === '%' && value > 100) value = 100
  rawValue.value = value.toFixed(1)
  previousValidValue = value
}

const decrease = () => {
  let value = parsedValue.value - 1
  if (value < 0) value = 0
  rawValue.value = value.toFixed(1)
  previousValidValue = value
}

const sanitizeInput = () => {
  let input = rawValue.value.replace(',', '.'); 

  let cleaned = '';
  let dotFound = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char >= '0' && char <= '9') {
      cleaned += char;
    } else if (char === '.' && !dotFound) {
      cleaned += '.';
      dotFound = true;
    }
  }

  let num = parseFloat(cleaned);
  if (isNaN(num) || num < 0) {
    num = 0;
  }

  if (unit.value === '%' && num > 100) {
    num = previousValidValue; 
  } else {
    previousValidValue = num;
  }

  rawValue.value = num.toFixed(1);
};

</script>
