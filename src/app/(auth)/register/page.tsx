'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') ?? 'buyer'
  const sent = searchParams.get('sent') === 'true'
  const sentEmail = searchParams.get('email') ?? ''
  const [role, setRole] = useState<'buyer' | 'seller'>(defaultRole as 'buyer' | 'seller')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  if (sent) {
    return (
      <div className="bg-background rounded-2xl border p-8 shadow-sm text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold mb-2">Check your email!</h2>
        <p className="text-muted-foreground text-sm mb-4">
          We sent a confirmation link to <strong>{sentEmail}</strong>.<br />
          Click the link to activate your account.
        </p>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t get it? Check spam, or{' '}
          <Link href="/register" className="text-primary hover:underline">try again</Link>.
        </p>
      </div>
    )
  }

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name, role },
        emailRedirectTo: `${appUrl}/api/auth/callback?next=${role === 'seller' ? '/seller/dashboard' : '/'}`,
      }
    })
    if (error) { setError(error.message); setLoading(false); return }
    // If email confirmation required
    if (data.user && !data.session) {
      router.push(`/register?sent=true&email=${encodeURIComponent(form.email)}`)
      return
    }
    // Auto-confirmed (e.g. Supabase email confirmation disabled)
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, role, full_name: form.name })
    }
    router.push(role === 'seller' ? '/seller/dashboard' : '/')
    router.refresh()
  }

  return (
    <div className="bg-background rounded-2xl border p-6 shadow-sm">
      {/* Role toggle */}
      <div className="flex rounded-lg border p-1 mb-5">
        {(['buyer', 'seller'] as const).map(r => (
          <button key={r} onClick={() => setRole(r)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${role === r ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>
            {r === 'buyer' ? '🛴 I want to buy' : '💼 I want to sell'}
          </button>
        ))}
      </div>

      <form onSubmit={signUp} className="space-y-3">
        {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">{error}</div>}
        <div className="space-y-1">
          <label className="text-sm font-medium">Full Name</label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ahmed Al Rashidi" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" minLength={6} required />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      {role === 'seller' && (
        <div className="mt-4 rounded-lg bg-primary/5 border border-primary/10 p-3 text-xs text-muted-foreground">
          As a seller, you'll need to verify your Emirates ID or trade license to list items.
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white"><Zap className="h-5 w-5" /></div>
            <span><span className="text-primary">Scoot</span>Mart.ae</span>
          </Link>
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join UAE's electric scooter marketplace</p>
        </div>
        <Suspense fallback={<div className="rounded-2xl border bg-card p-6 animate-pulse h-64" />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  )
}
