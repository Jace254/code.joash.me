<script setup lang="ts">
import { useChat } from 'ai/vue'

// @ts-expect-error vendor
import markdownParser from '@nuxt/content/transformers/markdown'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils'

const parsedMarkdown = ref<Record<string, any> | undefined>(undefined)

const { messages, input, handleSubmit, isLoading } = useChat()

watch(() => messages.value, async (m) => {
  const data = m[m.length - 1] && m[m.length - 1].role !== 'user' ? m[m.length - 1].content : ''
  if (data !== '')
    parsedMarkdown.value = await markdownParser.parse!('', data, {})
})
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr]">
    <div flex="~ gap-2 items-center" border="b base dashed" bg-faded px4 py2>
      <div i-ph-book-bookmark-duotone/>
      <span text-sm>AI Guide</span>
    </div>
    <form flex w-full p-4 @submit="handleSubmit">
      <Input
        v-model="input"
        class="w-full p-2 mr-2 bg-faded"
        placeholder="Ask me anything related to node..."
      />
      <UiButton :disabled="isLoading" @click="handleSubmit">
        <div :class="cn(isLoading ? 'i-svg-spinners-270-ring' : 'i-zondicons-send')" />
      </UiButton>
    </form>
    <UiScrollArea>
      <article class="prose" of-auto p6>
        <ContentRenderer v-show="parsedMarkdown !== undefined" :value="parsedMarkdown" />
      </article>
    </UiScrollArea>
  </div>
</template>
