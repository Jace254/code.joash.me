<script setup lang="ts">
const iframe = ref<HTMLIFrameElement>()
const wcUrl = ref<string>()

type Status = 'initialize' | 'mount' | 'install' | 'ready' | 'start' | 'error'

const status = ref<Status>('initialize')
const error = shallowRef<{ message: string }>()

const stream = ref<ReadableStream>()

async function startDevServer() {
  const rawFiles = import.meta.glob([
    '../templates/nuxt/*.*',
    '!**/node_modules/**',
  ], { as: 'raw', eager: true })

  const files = Object.fromEntries(
    Object.entries(rawFiles).map(([path, content]) => {
      return [path.replace('../templates/nuxt/', ''), {
        file: {
          contents: content,
        },
      }]
    }),
  )
  
  const wc = await useWebContainer()

  status.value = 'mount'
  await wc.mount(files)

  wc.on('server-ready', (port, url) => {
    status.value = 'ready'
    wcUrl.value = url
  })

  wc.on('error', (err) => {
    error.value = err
    status.value = 'error'
  })

  status.value = 'install'
  // `npm install`
  const installProcess = await wc.spawn('pnpm', ['install'])
  stream.value = installProcess.output
  const installExitCode = await installProcess.exit

  if (installExitCode !== 0) {
    error.value = {
      message: `Unable to run npm install, exit as ${installExitCode}`,
    }
    status.value = 'error'
    throw new Error('Unable to run npm install')
  }

  status.value = 'start'
  // `npm run dev`
  const devProcess = await wc.spawn('pnpm', ['dev'])
  stream.value = devProcess.output
}
watchEffect(() => {
  if (iframe.value && wcUrl.value)
    iframe.value.src = wcUrl.value
})
onMounted(startDevServer)
</script>

<template>
  <div h-full w-full grid grid-rows="[2fr_1fr]" of-hidden relative max-h-full>
    <iframe v-show="status === 'ready'" ref="iframe" h-full w-full />
    <div v-if="status !== 'ready'" flex="~ col items-center justify-center" h-full capitalize text-lg>
      <div i-svg-spinners-blocks-shuffle-3 />
      {{ status }}ing...
    </div>
    <Terminal :stream="stream" h="33%" />
  </div>
</template>
