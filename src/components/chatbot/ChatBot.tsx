'use client'
import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { MessageSquare, X, Send, Bot, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm ScootMart AI — your UAE micromobility expert.\n\nTell me:\n• Your daily commute distance\n• Rider weight\n• Budget (AED)\n• Emirate you're in\n\nI'll find the perfect scooter or e-bike for UAE conditions! 🌡️"
      }
    ]
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-white rounded-full px-4 py-3 shadow-lg hover:bg-primary/90 transition-all hover:scale-105 animate-bounce-subtle"
        >
          <Bot className="h-5 w-5" />
          <span className="text-sm font-semibold">AI Scooter Expert</span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={cn(
          'fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-background border rounded-2xl shadow-2xl flex flex-col transition-all',
          minimized ? 'h-14' : 'h-[600px] max-h-[80vh]'
        )}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-primary text-white rounded-t-2xl">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">ScootMart AI Assistant</p>
              <p className="text-xs opacity-80">UAE Micromobility Expert</p>
            </div>
            <button onClick={() => setMinimized(!minimized)} className="opacity-80 hover:opacity-100">
              <Minimize2 className="h-4 w-4" />
            </button>
            <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {msg.role === 'assistant' && (
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className={cn(
                      'max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap',
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick prompts */}
              {messages.length === 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {[
                    'Budget AED 2,000, Dubai commuter',
                    'Best for 90kg rider, 20km daily',
                    'Certified used under AED 1,000',
                    'RTA compliant for public roads',
                  ].map(prompt => (
                    <button key={prompt} onClick={() => {
                      handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>)
                    }} className="text-xs bg-primary/5 hover:bg-primary/10 text-primary rounded-full px-3 py-1 transition-colors">
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Tell me your commute, budget, weight..."
                  className="flex-1 text-sm"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}
