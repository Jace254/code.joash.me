<script setup lang="ts">
import { useChat } from 'ai/vue'

// @ts-expect-error vendor
import markdownParser from '@nuxt/content/transformers/markdown'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils'

const parsedMarkdown = ref<Record<string, any> | undefined>(undefined)

const { messages, input, handleSubmit, isLoading } = useChat()
const data = ref<string>('')

watch(() => messages.value, async (m) => {
  data.value = m[m.length - 1] && m[m.length - 1].role !== 'user' ? m[m.length - 1].content : ''
  if (data.value !== '')
    parsedMarkdown.value = await markdownParser.parse!('', data.value, {})
})
</script>

<template>
  <form flex w-full @submit="handleSubmit">
    <Input
      v-model="input"
      class="w-full p-2 mb-8 mr-2 bg-faded"
      placeholder="Ask me anything related to node..."
    />
    <UiButton :disabled="isLoading" @click="handleSubmit">
      <div :class="cn(isLoading ? 'i-svg-spinners-270-ring' : 'i-zondicons-send')" />
    </UiButton>
  </form>
  <article prose>
    <div class="whitespace-pre-wrap">
      <ContentRenderer v-show="parsedMarkdown !== undefined" :value="parsedMarkdown" />
    </div>
  </article>
</template>
