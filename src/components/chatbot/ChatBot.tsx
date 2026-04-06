'use client'
import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Send, Bot, X, Minimize2, Maximize2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const QUICK_REPLIES_INITIAL = [
  { label: '👋 Just browsing', value: 'Hi! Just browsing around' },
  { label: '🛵 Find me a scooter', value: 'Help me find a scooter' },
  { label: '🚴 Show me e-bikes', value: 'What e-bikes do you have?' },
  { label: '💰 Budget options', value: 'What are your cheapest options?' },
]

const QUICK_REPLIES_FOLLOW_UP = [
  { label: '📍 I\'m in Dubai', value: 'I\'m based in Dubai' },
  { label: '📍 I\'m in Abu Dhabi', value: 'I\'m based in Abu Dhabi' },
  { label: '🏍️ Daily commute', value: 'I need it for daily commuting' },
  { label: '🛵 Delivery work', value: 'I\'m a delivery rider' },
  { label: '💸 Under AED 2,000', value: 'My budget is under AED 2,000' },
  { label: '⚡ RTA compliant', value: 'I need an RTA compliant scooter' },
]

function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-1 py-0.5">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  )
}

function MessageBubble({ role, content }: { role: string; content: string }) {
  const isUser = role === 'user'
  return (
    <div className={cn('flex gap-2 items-end', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mb-0.5">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
          isUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-muted text-foreground rounded-bl-none'
        )}
      >
        {content}
      </div>
    </div>
  )
}

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevMsgCount = useRef(1)

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hey! 👋 I'm Scoot — your ScootMart AI assistant.\n\nLooking for an electric scooter or e-bike in the UAE? I've got you covered. What brings you in today?",
      },
    ],
  })

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Show notification badge when chat is closed and bot replies
  useEffect(() => {
    if (!open && messages.length > prevMsgCount.current) {
      setHasNewMessage(true)
    }
    prevMsgCount.current = messages.length
  }, [messages, open])

  // Clear badge when opened
  useEffect(() => {
    if (open) {
      setHasNewMessage(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const sendQuickReply = (value: string) => {
    append({ role: 'user', content: value })
  }

  const showInitialQuickReplies = messages.length === 1
  const showFollowUpReplies = messages.length >= 2 && messages.length <= 4 && !isLoading

  return (
    <>
      {/* Floating launcher button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-primary text-white rounded-full pl-4 pr-5 py-3 shadow-xl hover:bg-primary/90 transition-all hover:scale-105 group"
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-primary animate-pulse" />
            )}
          </div>
          <span className="text-sm font-semibold">AI Scooter Expert</span>
          <Zap className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={cn(
          'fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-background border rounded-2xl shadow-2xl flex flex-col transition-all duration-300',
          minimized ? 'h-14' : 'h-[600px] max-h-[85vh]'
        )}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-primary text-white rounded-t-2xl shrink-0">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">Scoot AI</p>
              <p className="text-[11px] opacity-75 leading-tight">Online · UAE Micromobility Expert</p>
            </div>
            <button
              onClick={() => setMinimized(!minimized)}
              className="opacity-70 hover:opacity-100 transition-opacity p-1"
              title={minimized ? 'Expand' : 'Minimise'}
            >
              {minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="opacity-70 hover:opacity-100 transition-opacity p-1"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                {messages.map(msg => (
                  <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex gap-2 items-end">
                    <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2.5">
                      <TypingDots />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick reply chips */}
              {(showInitialQuickReplies || showFollowUpReplies) && (
                <div className="px-4 py-2 border-t bg-muted/30 flex flex-wrap gap-1.5 shrink-0">
                  {(showInitialQuickReplies ? QUICK_REPLIES_INITIAL : QUICK_REPLIES_FOLLOW_UP).map(qr => (
                    <button
                      key={qr.value}
                      onClick={() => sendQuickReply(qr.value)}
                      disabled={isLoading}
                      className="text-xs bg-background border border-border hover:border-primary hover:text-primary text-muted-foreground rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input bar */}
              <form
                onSubmit={handleSubmit}
                className="flex gap-2 p-3 border-t shrink-0"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Say hi or ask anything..."
                  disabled={isLoading}
                  className="flex-1 text-sm bg-muted rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 placeholder:text-muted-foreground"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (input.trim()) handleSubmit(e as any)
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full h-9 w-9 shrink-0"
                  disabled={isLoading || !input.trim()}
                >
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
