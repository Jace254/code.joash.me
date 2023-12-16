<script setup lang="ts">
import { useChat } from 'ai/vue'
import markdownParser from '@nuxt/content/transformers/markdown'
import { Input } from '@/components/ui/input'

const parsedMarkdown = ref<Record<string, any> | undefined>(undefined)

const { messages, input, handleSubmit } = useChat()
const data = ref<string>('')

watch(() => messages.value, async (m) => {
  data.value = m[m.length - 1] && m[m.length - 1].role !== 'user' ? m[m.length - 1].content : ''
  parsedMarkdown.value = await markdownParser.parse!('', data.value, {})
})
</script>

<template>
  <form @submit="handleSubmit">
    <Input
      v-model="input"
      class="w-full  p-2 mb-8"
      placeholder="Ask me anything related to node..."
    />
  </form>
  <article prose>
    <div class="whitespace-pre-wrap">
      <ContentRenderer v-show="parsedMarkdown !== undefined" :value="parsedMarkdown" />
    </div>
  </article>
</template>
