<script setup lang="ts">
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

const props = defineProps<{
  stream?: ReadableStream
}>()

const root = ref<HTMLDivElement>()

const terminal = new Terminal()
const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)

watch(() => props.stream, (s) => {
  if (!s)
    return
  const reader = s.getReader()
  function read() {
    reader.read().then(({ done, value }) => {
      terminal.write(value)
      if (!done)
        read()
    })
  }
  read()
}, { immediate: true })

useResizeObserver(root, useDebounceFn(() => fitAddon.fit(), 200))

onMounted(() => {
  terminal.open(root.value!)
  fitAddon.fit()
})
</script>

<template>

<div
        h-full
        grid="~ rows-[min-content_1fr]"
      >
        <div
          flex="~ gap-2 items-center"
          border="b base"
          bg-faded px4 py2
        >
        <div i-ic-twotone-terminal />
          <span text-sm>Terminal</span>
        </div>
        <div ref="root"  w-full of-hidden />

      </div>
</template>
