'use client'

import { useState, useEffect } from 'react'
import { useChat, type Message } from 'ai/react'
import ChatInterface from '@/components/ChatInterface'

const DEFAULT_SYSTEM_PROMPT = 'You are a helpful, friendly, and knowledgeable AI assistant.'

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<
    { id: string; title: string; messages: Message[] }[]
  >([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error: chatError,
    setMessages,
  } = useChat({
    api: '/api/chat',
    body: {
      systemPrompt,
    },
    onError: (error) => {
      console.error('Chat error:', error)
      setError(error.message || 'An error occurred. Please check your API key and try again.')
    },
  })

  // Clear error when starting a new message
  useEffect(() => {
    if (isLoading) {
      setError(null)
    }
  }, [isLoading])

  const getConversationTitle = (msgs: Message[]): string => {
    const firstUserMessage = msgs.find((m) => m.role === 'user')
    if (!firstUserMessage) return 'Untitled chat'

    const words = firstUserMessage.content.trim().split(/\s+/).slice(0, 3)
    const base = words.join(' ')
    return base || 'Untitled chat'
  }

  const handleStartNewChat = () => {
    if (messages.length > 0) {
      const title = getConversationTitle(messages)

      if (activeConversationId) {
        setConversations((prev) => {
          const others = prev.filter((c) => c.id !== activeConversationId)
          return [{ id: activeConversationId, title, messages: [...messages] }, ...others]
        })
      } else {
        const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
        setConversations((prev) => [{ id, title, messages: [...messages] }, ...prev])
      }
    }

    setMessages([])
    setActiveConversationId(null)
  }

  const handleSelectConversation = (id: string) => {
    const convo = conversations.find((c) => c.id === id)
    if (!convo) return

    setMessages(convo.messages)
    setActiveConversationId(id)
  }

  return (
    <ChatInterface
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      systemPrompt={systemPrompt}
      setSystemPrompt={setSystemPrompt}
      error={error || chatError?.message || null}
      conversations={conversations.map(({ id, title }) => ({ id, title }))}
      activeConversationId={activeConversationId}
      onStartNewChat={handleStartNewChat}
      onSelectConversation={handleSelectConversation}
    />
  )
}
