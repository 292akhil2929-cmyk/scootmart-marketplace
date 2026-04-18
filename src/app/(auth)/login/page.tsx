'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push(redirect); router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
      <OAuthButtons redirectTo={redirect} />

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-neutral-400 font-medium">or continue with email</span>
        </div>
      </div>

      <form onSubmit={signIn} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm p-3">{error}</div>
        )}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700">Password</label>
            <Link href="/forgot-password" className="text-xs text-neutral-400 hover:text-black transition-colors">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-10 px-3 pr-10 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-5">
        Don't have an account?{' '}
        <Link href="/register" className="text-black font-semibold hover:underline">Sign up</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-4">
            <div className="h-9 w-9 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="text-black">ScootMart.ae</span>
          </Link>
          <h1 className="text-2xl font-bold text-black">Welcome back</h1>
          <p className="text-neutral-500 text-sm mt-1">Sign in to your ScootMart account</p>
        </div>
        <Suspense fallback={<div className="rounded-2xl border bg-white p-8 animate-pulse h-64" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
