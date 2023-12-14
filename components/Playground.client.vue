<script setup lang="ts">
const iframe = ref<HTMLIFrameElement>()

async function startDevServer() {
  const wc = await useWebContainer()

  console.log('mounting')
  wc.mount({
    'package.json': {
      file: {
        contents: JSON.stringify({
          private: true,
          dependencies: {
            nuxt: 'latest',
          },
          name: 'my-app',
        }),
      },
    },
  })
  console.log('installing')
  const installProcess = await wc.spawn('npm', ['install'])

  const installExitCode = await installProcess.exit

  if (installExitCode !== 0)
    throw new Error('Unable to run npm install')

  console.log('running')
  // `npm run dev`
  await wc.spawn('npm', ['run', 'dev'])
  wc.on('server-ready', (port, url) => (iframe.value!.src = url))
}

onMounted(startDevServer)
</script>

<template>
  <div>
    <iframe ref="iframe" />
  </div>
</template>
