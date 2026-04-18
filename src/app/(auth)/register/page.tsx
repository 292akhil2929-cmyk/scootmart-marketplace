'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

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
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold text-black mb-2">Check your email!</h2>
        <p className="text-neutral-500 text-sm mb-4">
          We sent a confirmation link to <strong className="text-black">{sentEmail}</strong>.<br />
          Click the link to activate your account.
        </p>
        <p className="text-xs text-neutral-400">
          Didn&apos;t get it? Check spam, or{' '}
          <Link href="/register" className="text-black font-semibold hover:underline">try again</Link>.
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
    if (data.user && !data.session) {
      router.push(`/register?sent=true&email=${encodeURIComponent(form.email)}`)
      return
    }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, role, full_name: form.name })
    }
    router.push(role === 'seller' ? '/seller/dashboard' : '/')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
      <OAuthButtons redirectTo="/" />

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-neutral-400 font-medium">or continue with email</span>
        </div>
      </div>

      {/* Role toggle */}
      <div className="flex rounded-lg border border-neutral-200 p-1 mb-5">
        {(['buyer', 'seller'] as const).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              role === r ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            {r === 'buyer' ? '🛴 I want to buy' : '💼 I want to sell'}
          </button>
        ))}
      </div>

      <form onSubmit={signUp} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm p-3">{error}</div>
        )}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">Full Name</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Ahmed Al Rashidi"
            required
            className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            required
            className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Min 6 characters"
            minLength={6}
            required
            className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      {role === 'seller' && (
        <div className="mt-4 rounded-lg bg-neutral-50 border border-neutral-200 p-3 text-xs text-neutral-500">
          As a seller, you'll need to verify your Emirates ID or trade license to list items.
        </div>
      )}

      <p className="text-center text-sm text-neutral-500 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-black font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-4">
            <div className="h-9 w-9 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="text-black">ScootMart.ae</span>
          </Link>
          <h1 className="text-2xl font-bold text-black">Create your account</h1>
          <p className="text-neutral-500 text-sm mt-1">Join UAE's electric scooter marketplace</p>
        </div>
        <Suspense fallback={<div className="rounded-2xl border bg-white p-8 animate-pulse h-64" />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  )
}
