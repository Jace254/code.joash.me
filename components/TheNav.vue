<script setup lang="ts">
const ui = useUiState()
const play = usePlaygroundStore()
const runtime = useRuntimeConfig()

const repo = 'https://github.com/Jace254/code.joash.me'
const buildTime = new Date(runtime.public.buildTime)
const timeAgo = useTimeAgo(buildTime)
</script>

<template>
  <header border-b border-border bg-faded py-3>
    <nav max-w-8xl mx-auto h-full flex items-center gap-3 px-4 lg:px-8 sm:px-6>
      <NuxtLink to="/" title="CodeGround">
        <Logo h-2em />
      </NuxtLink>
      <div flex-auto />
      <button
        v-if="play.status === 'ready'"
        rounded p2
        hover="bg-active"
        title="Download as ZIP"
        @click="play.downloadZip()"
      >
        <div i-ph-download-duotone text-2xl />
      </button>
      <VDropdown :distance="6">
        <button
          rounded p2
          hover="bg-active"
          title="Playground Information"
        >
          <div i-ph-info-duotone text-2xl />
        </button>
        <template #popper>
          <div px5 py4 grid="~ gap-y-3 gap-x-2 cols-[max-content_1fr] items-center">
            <div i-ph-package-duotone text-xl />
            <NuxtLink :to="`${repo}/commit/${runtime.public.gitSha}`" target="_blank" title="View on GitHub">
              <time :datetime="buildTime.toISOString()" :title="buildTime.toLocaleString()">
                Built {{ timeAgo }} (<code>{{ runtime.public.gitSha.slice(0, 5) }}</code>)
              </time>
            </NuxtLink>
          </div>
        </template>
      </VDropdown>
      <button
        rounded p2
        title="Toggle terminal"
        hover="bg-active"
        :class="ui.showTerminal ? '' : 'op50'"
        @click="ui.toggleTerminal()"
      >
        <div i-ph-terminal-window-duotone text-2xl />
      </button>
      <ColorSchemeToggle />
      <NuxtLink
        href="https://github.com/Jace254/code.joash.me"
        target="_blank"
        rounded p-2
        hover="bg-active"
      >
        <div i-bi-github />
      </NuxtLink>
    </nav>
  </header>
</template>
