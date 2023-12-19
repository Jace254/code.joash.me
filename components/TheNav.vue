<template>
  <header py-3 bg-faded border-b border-border>
    <nav mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl flex items-center gap-3 h-full>
      <NuxtLink to="/" title="CodeGround">
        <Logo h-2em />
      </NuxtLink>
      <div flex-auto />
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
