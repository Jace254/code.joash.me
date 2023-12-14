<template>
  <header py3 bg-background:75 backdrop-blur border-b border-border mb="-1px" sticky top-0 z-50>
    <nav mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl flex items-center justify-between gap-3 h-full >
      <NuxtLink to="/" title="JujuTools">
        <Logo h-2em />
      </NuxtLink>
      <!-- <div flex-auto /> -->
      <ColorSchemeToggle />
    </nav>
  </header>
</template>
