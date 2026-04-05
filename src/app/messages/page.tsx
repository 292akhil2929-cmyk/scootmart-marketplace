import { Suspense } from 'react'
import type { Metadata } from 'next'
import { MessagesClient } from '@/components/layout/MessagesClient'

export const metadata: Metadata = { title: 'Messages – ScootMart.ae' }

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex h-[calc(100vh-4rem)] items-center justify-center text-muted-foreground">Loading messages…</div>}>
      <MessagesClient />
    </Suspense>
  )
}
