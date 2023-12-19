<script setup lang="ts">
import { globToWebContainerFs } from '@/composables/webContainer'
import { useTerminalStream } from "@/composables/state"

const iframe = ref<HTMLIFrameElement>()
const wcUrl = ref<string>()

type Status = 'init' | 'mount' | 'install' | 'ready' | 'start' | 'error'

const status = ref<Status>('init')
const error = shallowRef<{ message: string }>()

const stream = useTerminalStream()

async function startDevServer() {
  const tree = globToWebContainerFs(
    '../templates/nuxt/',
    import.meta.glob([
      '../templates/nuxt/*.*',
      '!**/node_modules/**',
    ], {
      as: 'raw',
      eager: true,
    }),
  )

  const wc = await useWebContainer()

  status.value = 'mount'
  await wc.mount(tree)

  wc.on('server-ready', (port, url) => {
    if(port === 3000){
        status.value = 'ready'
        wcUrl.value = url
    }
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

  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      devProcess.kill()
    })
  }
}
watchEffect(() => {
  if (iframe.value && wcUrl.value)
    iframe.value.src = wcUrl.value
})
onMounted(startDevServer)
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
          <div i-ph-globe-duotone />
          <span text-sm>Preview</span>
        </div>
        <iframe v-show="status === 'ready'" ref="iframe" h-full w-full />
        <div v-if="status !== 'ready'" flex="~ col items-center justify-center" h-full capitalize text-lg>
          <div i-svg-spinners-180-ring-with-bg />
          <p v-if="status !== 'init'">
            {{ status }}ing...
          </p>
        </div>
      </div>
</template>