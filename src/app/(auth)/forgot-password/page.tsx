'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white"><Zap className="h-5 w-5" /></div>
            <span><span className="text-primary">Scoot</span>Mart.ae</span>
          </Link>
          <h1 className="text-xl font-semibold">Reset your password</h1>
          <p className="text-muted-foreground text-sm mt-1">We'll send a reset link to your email</p>
        </div>

        <div className="bg-background rounded-2xl border p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📧</div>
              <h2 className="font-semibold mb-2">Check your inbox</h2>
              <p className="text-sm text-muted-foreground mb-4">We sent a password reset link to <strong>{email}</strong>. Check your spam folder if you don't see it.</p>
              <Link href="/login"><Button variant="outline" className="w-full">Back to sign in</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">{error}</div>}
              <div className="space-y-1">
                <label className="text-sm font-medium">Email address</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Remember your password? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
