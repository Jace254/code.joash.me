<script setup lang="ts">
const color = useColorMode()

function toggleDark() {
  color.value = color.value === 'dark'
    ? 'light'
    : 'dark'
}
</script>

<template>
  <div grid grid-cols="[1fr_2fr]" h-full  >
    <div b-r b-base>
      Col 1
      <button @click="toggleDark">
        {{ color.value }}
      </button>
    </div>
    <div>Col 2</div>
  </div>
</template>
