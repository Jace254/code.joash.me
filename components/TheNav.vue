<template>
  <header py-3 bg-background:75 backdrop-blur border-b border-border mb="-1px" sticky top-0 z-50>
    <nav mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl flex items-center gap-3 h-full>
      <NuxtLink to="/" title="CodeGround">
        <Logo h-2em />
      </NuxtLink>
      <div flex-auto />
      <ColorSchemeToggle />
      <NuxtLink
        href="https://github.com/Jace254/code.joash.me"
        rounded p-2
        hover="bg-active"
      >
        <div i-bi-github />
      </NuxtLink>
    </nav>
  </header>
</template>
