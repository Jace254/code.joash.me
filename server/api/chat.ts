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

    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content:
        'You identify as Andy. Only answer questions about NodeJS, NodeJS frameworks and libraries that run on the NodeJS runtime or javascript frontend frameworks. Return only Markdown format documentation and include code examples do not give extra text before or after the markdown.',
    }

    // @ts-expect-error vendor
    const prompt: ChatCompletionMessageParam = {
      content: messages[messages.length - 1].content,
      role: 'user',
    }

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [systemMessage, prompt],
    })

    const stream = OpenAIStream(response)

    // Convert the response into a friendly text-stream
    return new StreamingTextResponse(stream)
  })
})
