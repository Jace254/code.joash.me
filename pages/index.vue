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
      Content
      <button @click="toggleDark">
        {{ color.value }}
      </button>
    </div>
    <div>Playground</div>
  </div>
</template>
