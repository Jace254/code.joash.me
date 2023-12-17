<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { globToWebContainerFs } from '@/composables/webContainer'

const iframe = ref<HTMLIFrameElement>()
const wcUrl = ref<string>()

type Status = 'init' | 'mount' | 'install' | 'ready' | 'start' | 'error'

const status = ref<Status>('init')
const error = shallowRef<{ message: string }>()

const stream = ref<ReadableStream>()

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
  <Splitpanes max-h-full w-full horizontal of-hidden relative>
    <Pane>
      <div
        h-full
        grid="~ rows-[min-content_1fr]"
      >
        <div
          flex="~ gap-2 items-center"
          border="b base dashed"
          bg-faded px4 py2
        >
          <div i-ph-code-block-duotone />
          <span text-sm>Playground</span>
        </div>
        [Editor]
      </div>
    </Pane>
    <Pane>
      <iframe v-show="status === 'ready'" ref="iframe" h-full w-full />
      <div v-if="status !== 'ready'" flex="~ col items-center justify-center" h-full capitalize text-lg>
        <div i-svg-spinners-blocks-shuffle-3 />
        <p v-if="status !== 'init'">
          {{ status }}ing...
        </p>
      </div>
    </Pane>
    <Pane>
      <Terminal :stream="stream" min-h-0 />
    </Pane>
  </Splitpanes>
</template>
