// Gemini-powered ScootBot — GEMINI_API_KEY is server-side only, never exposed to client
import { streamText } from 'ai'
import { geminiFlash, SYSTEM_PROMPT } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

// Simple in-memory rate limiter: 10 req / min per IP
const rateLimitMap = new Map<string, { count: number; reset: number }>()
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 })
    return false
  }
  if (entry.count >= 10) return true
  entry.count++
  return false
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }
    const { messages } = await req.json()
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }
    const result = streamText({
      model: geminiFlash,
      system: SYSTEM_PROMPT,
      messages,
      maxTokens: 512,
    })
    return result.toDataStreamResponse()
  } catch (err) {
    console.error('[Chat API]', err)
    return NextResponse.json(
      { error: 'ScootBot is having a moment. Try again shortly or email hello@scootmart.ae' },
      { status: 500 }
    )
  }
}
