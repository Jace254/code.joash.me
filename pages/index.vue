<script setup lang="ts">
const {x, y} = useMouse()
const color = useColorMode()
function toggleDark() {
    color.value = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
    <div text-red>
        Hello World X: {{ x }}, Y: {{ y }}
    </div>
    <button @click="toggleDark">{{ color.value }}</button>
</template>
