import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat'

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey
  if (!apiKey)
    throw new Error('Missing OpenAI API key')
  const openai = new OpenAI({
    apiKey,
  })

  return defineEventHandler(async (event) => {
    // Extract the `prompt` from the body of the request
    const { messages } = (await readBody(event)) as {
      messages: ChatCompletionMessageParam[]
    }

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: messages.map(message => ({
        content: message.content,
        role: message.role,
      })),
    })

    const stream = OpenAIStream(response)

    // Convert the response into a friendly text-stream
    return new StreamingTextResponse(stream)
  })
})
