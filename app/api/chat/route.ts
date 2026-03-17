import { OpenAI } from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Using nodejs runtime for better OpenAI SDK compatibility
// export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY is not configured. Please add it to your .env.local file.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { messages, systemPrompt } = await req.json()

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Add system message if provided
    const systemMessage = systemPrompt
      ? { role: 'system' as const, content: systemPrompt }
      : null

    // Prepare messages array
    const allMessages = systemMessage
      ? [systemMessage, ...messages]
      : messages

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: allMessages,
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    
    // Handle specific error types
    if (error.status === 429) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded or quota reached',
          message: 'You have exceeded your OpenAI API quota. Please check your usage at https://platform.openai.com/usage or add a payment method at https://platform.openai.com/account/billing',
          type: 'quota_exceeded'
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    if (error.status === 401) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid API key',
          message: 'Your OpenAI API key is invalid. Please check your .env.local file and ensure the key is correct.',
          type: 'auth_error'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while processing your request',
        details: error.response?.data || null,
        type: 'unknown_error'
      }),
      { status: error.status || 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
