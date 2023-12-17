<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const isDragging = ref<boolean>(false)
const leftSize = useLocalStorage('codeground-left-panel', 30)

function start() {
  isDragging.value = true
}

function stop(e: { size: number }[]) {
  isDragging.value = false
  leftSize.value = e[0].size
}
</script>

<template>
  <Splitpanes
    h-full of-hidden max-h-full
    @resize="start"
    @resized="stop"
  >
    <Pane :size="leftSize">
      <Chat />
    </Pane>
    <Pane>
      <Playground
        :class="{
          'pointer-events-none': isDragging,
        }"
      />
    </Pane>
  </Splitpanes>
</template>
