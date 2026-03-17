'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from 'ai/react'

interface ChatInterfaceProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  systemPrompt: string
  setSystemPrompt: (prompt: string) => void
  error: string | null
  conversations: { id: string; title: string }[]
  activeConversationId: string | null
  onStartNewChat: () => void
  onSelectConversation: (id: string) => void
}

const AI_PERSONALITIES = [
  {
    id: 'default',
    name: 'Default Assistant',
    prompt: 'You are a helpful, friendly, and knowledgeable AI assistant.',
  },
  {
    id: 'creative',
    name: 'Creative Writer',
    prompt: 'You are a creative and imaginative AI assistant. You excel at storytelling, creative writing, and coming up with unique ideas. Be expressive and use vivid language.',
  },
  {
    id: 'technical',
    name: 'Technical Expert',
    prompt: 'You are a technical expert AI assistant. You provide precise, detailed technical explanations. Focus on accuracy, code examples, and best practices.',
  },
  {
    id: 'friendly',
    name: 'Friendly Companion',
    prompt: 'You are a warm, friendly, and empathetic AI companion. You are great at conversation, emotional support, and making people feel heard and understood.',
  },
  {
    id: 'professional',
    name: 'Business Professional',
    prompt: 'You are a professional business AI assistant. You communicate clearly, concisely, and professionally. You help with business strategy, analysis, and decision-making.',
  },
]

export default function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  systemPrompt,
  setSystemPrompt,
  error,
  conversations,
  activeConversationId,
  onStartNewChat,
  onSelectConversation,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedPersonality, setSelectedPersonality] = useState('default')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handlePersonalityChange = (personalityId: string) => {
    setSelectedPersonality(personalityId)
    const personality = AI_PERSONALITIES.find((p) => p.id === personalityId)
    if (personality) {
      setSystemPrompt(personality.prompt)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Chatbot
            </h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:mr-2 sm:self-center">
                Personality:
              </label>
              <select
                value={selectedPersonality}
                onChange={(e) => handlePersonalityChange(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {AI_PERSONALITIES.map((personality) => (
                  <option key={personality.id} value={personality.id}>
                    {personality.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Left Sidebar */}
      <div className="flex-1 overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex h-full max-w-6xl mx-auto gap-6">
          {/* Left Sidebar: Chat List & Start Button */}
          <aside className="hidden md:flex md:w-72 flex-col rounded-2xl bg-white/70 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-700/80 shadow-sm backdrop-blur px-4 py-4 text-sm">
            <div className="flex items-center justify-between mb-4 gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Chats
              </h2>
              <button
                type="button"
                onClick={onStartNewChat}
                className="inline-flex items-center rounded-full bg-blue-600 text-white px-3 py-1 text-xs font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-colors"
              >
                Start
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 space-y-1">
              {conversations.length === 0 ? (
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  No previous chats yet. Start a chat, then press <span className="font-semibold">Start</span> to save it here.
                </div>
              ) : (
                conversations.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => onSelectConversation(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium truncate border transition-colors ${
                      chat.id === activeConversationId
                        ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                        : 'bg-white/70 dark:bg-gray-900/40 border-gray-200/70 dark:border-gray-700/70 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/70'
                    }`}
                    title={chat.title}
                  >
                    {chat.title}
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {error}
                      </div>
                      {error.includes('quota') || error.includes('Rate limit') ? (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-red-600 dark:text-red-400 font-medium">To resolve this:</p>
                          <ul className="text-xs text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
                            <li>Check your usage: <a href="https://platform.openai.com/usage" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/usage</a></li>
                            <li>Add a payment method: <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/account/billing</a></li>
                            <li>Wait for your rate limit to reset (usually within a few minutes)</li>
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400 text-lg">
                    Start a conversation with your AI assistant
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Select a personality above and type a message below
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1 opacity-70">
                        {message.role === 'user' ? 'You' : 'AI'}
                      </div>
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium mb-1 opacity-70">AI</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
