import { streamText } from 'ai'
import { geminiFlash, SYSTEM_PROMPT } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

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
    if (!process.env.GROQ_API_KEY) {
      console.error('[Chat API] GROQ_API_KEY is not set')
      return NextResponse.json({ error: 'Service misconfigured. Please try again later.' }, { status: 500 })
    }

    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    const body = await req.json().catch(() => null)
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const { messages } = body
    const result = streamText({
      model: geminiFlash,
      system: SYSTEM_PROMPT,
      messages,
      maxTokens: 800,
    })
    return result.toDataStreamResponse()
  } catch (err: any) {
    console.error('[Chat API]', err)
    const msg = err?.message ?? String(err)
    if (msg.includes('API key') || msg.includes('401') || msg.includes('invalid_api_key')) {
      return NextResponse.json({ error: 'AI service key is invalid. Contact support.' }, { status: 500 })
    }
    if (msg.includes('429') || msg.includes('rate_limit')) {
      return NextResponse.json({ error: 'AI service is busy. Please try again in a minute.' }, { status: 429 })
    }
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
