'use client'
import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Send, Bot, X, Minimize2, Maximize2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const QUICK_REPLIES_INITIAL = [
  { label: '🛵 Best commuter scooter', value: 'What is the best scooter for daily commuting in Dubai?' },
  { label: '💰 Under AED 2,000', value: 'Show me scooters under AED 2,000' },
  { label: '🚚 Delivery rider', value: 'I am a delivery rider, what scooter do you recommend?' },
  { label: '🔍 Compare top models', value: 'Compare your top 3 most popular scooters' },
]

const QUICK_REPLIES_FOLLOW_UP = [
  { label: '📍 Based in Dubai', value: 'I am based in Dubai' },
  { label: '📍 Abu Dhabi', value: 'I am based in Abu Dhabi' },
  { label: '⚡ Must be RTA compliant', value: 'It must be RTA compliant for Dubai roads' },
  { label: '🏷️ Certified used only', value: 'I only want certified used scooters' },
  { label: '🔋 Best range', value: 'Which has the best real-world range in UAE heat?' },
  { label: '🛡️ Seller reliability', value: 'How do I know if a seller is reliable on ScootMart?' },
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

function renderWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g)
  return parts.map((part, i) =>
    part.match(/^https?:\/\//) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 opacity-80 hover:opacity-100 break-all"
      >
        {part.includes('amazon.ae') ? '🛒 View on Amazon.ae' : part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

function MessageBubble({ role, content }: { role: string; content: string }) {
  const isUser = role === 'user'
  return (
    <div className={cn('flex gap-2 items-end', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="h-7 w-7 rounded-full bg-black/10 flex items-center justify-center shrink-0 mb-0.5">
          <Bot className="h-3.5 w-3.5 text-black" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
          isUser
            ? 'bg-black text-white rounded-br-none'
            : 'bg-muted text-foreground rounded-bl-none'
        )}
      >
        {renderWithLinks(content)}
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
        content: "Hey! 👋 I'm Scoot — your ScootMart AI expert.\n\nI know every scooter & e-bike on this site: full specs, real UAE range in the heat, which sellers are verified, and where to get the best deal — Amazon.ae or our marketplace.\n\nWhat are you looking for today?",
      },
    ],
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!open && messages.length > prevMsgCount.current) {
      setHasNewMessage(true)
    }
    prevMsgCount.current = messages.length
  }, [messages, open])

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
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-black text-white rounded-full pl-4 pr-5 py-3 shadow-xl hover:bg-black/85 transition-all hover:scale-105 group"
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-black animate-pulse" />
            )}
          </div>
          <span className="text-sm font-semibold">AI Scooter Expert</span>
          <Zap className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>
      )}

      {open && (
        <div className={cn(
          'fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-background border rounded-2xl shadow-2xl flex flex-col transition-all duration-300',
          minimized ? 'h-14' : 'h-[600px] max-h-[85vh]'
        )}>
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-black text-white rounded-t-2xl shrink-0">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-black" />
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
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                {messages.map(msg => (
                  <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
                ))}
                {isLoading && (
                  <div className="flex gap-2 items-end">
                    <div className="h-7 w-7 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                      <Bot className="h-3.5 w-3.5 text-black" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2.5">
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {(showInitialQuickReplies || showFollowUpReplies) && (
                <div className="px-4 py-2 border-t bg-muted/30 flex flex-wrap gap-1.5 shrink-0">
                  {(showInitialQuickReplies ? QUICK_REPLIES_INITIAL : QUICK_REPLIES_FOLLOW_UP).map(qr => (
                    <button
                      key={qr.value}
                      onClick={() => sendQuickReply(qr.value)}
                      disabled={isLoading}
                      className="text-xs bg-background border border-border hover:border-black hover:text-black text-muted-foreground rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t shrink-0">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything about scooters..."
                  disabled={isLoading}
                  className="flex-1 text-sm rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-black/40 disabled:opacity-50"
                  style={{ backgroundColor: '#000', color: '#fff', caretColor: '#fff' }}
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
                  className="rounded-full h-9 w-9 shrink-0 bg-black hover:bg-black/85 text-white"
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
