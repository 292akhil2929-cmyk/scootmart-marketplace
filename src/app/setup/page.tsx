'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Zap, CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SetupPage() {
  const [email, setEmail] = useState('')
  const [dbUrl, setDbUrl] = useState('')
  const [status, setStatus] = useState<Record<string, 'idle' | 'loading' | 'done' | 'error'>>({})
  const [messages, setMessages] = useState<Record<string, string>>({})

  const setStep = (key: string, s: 'idle' | 'loading' | 'done' | 'error', msg = '') => {
    setStatus(p => ({ ...p, [key]: s }))
    setMessages(p => ({ ...p, [key]: msg }))
  }

  const initDb = async () => {
    if (!dbUrl) return alert('Please enter your database URL')
    setStep('db', 'loading')
    try {
      const res = await fetch('/api/db-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbUrl, secret: 'scootmart-setup-2024' })
      })
      const data = await res.json()
      if (data.success) setStep('db', 'done', 'Database schema applied!')
      else setStep('db', 'error', data.error ?? 'Failed')
    } catch (e: unknown) {
      setStep('db', 'error', e instanceof Error ? e.message : String(e))
    }
  }

  const makeAdmin = async () => {
    if (!email) return alert('Please enter your email')
    setStep('admin', 'loading')
    try {
      const res = await fetch(`/api/admin/init?secret=scootmart-setup-2024&email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (data.success) setStep('admin', 'done', data.message)
      else setStep('admin', 'error', data.error ?? 'Failed')
    } catch (e: unknown) {
      setStep('admin', 'error', e instanceof Error ? e.message : String(e))
    }
  }

  const StepIcon = ({ k }: { k: string }) => {
    const s = status[k] ?? 'idle'
    if (s === 'done') return <CheckCircle2 className="h-5 w-5 text-green-500" />
    if (s === 'loading') return <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    if (s === 'error') return <div className="h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-bold">!</div>
    return <Circle className="h-5 w-5 text-muted-foreground" />
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-4">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white">
              <Zap className="h-5 w-5" />
            </div>
            <span><span className="text-primary">Scoot</span>Mart.ae</span>
          </Link>
          <h1 className="text-2xl font-bold">Platform Setup</h1>
          <p className="text-muted-foreground text-sm mt-1">One-time setup to get your marketplace running</p>
        </div>

        <div className="space-y-4">
          {/* Step 1: Database */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <StepIcon k="db" />
              <h2 className="font-semibold">Step 1: Initialize Database</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Get your database connection string from{' '}
              <a href="https://supabase.com/dashboard/project/dxlvxfsupjfkstufrjtb/settings/database"
                target="_blank" rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1">
                Supabase Settings → Database <ExternalLink className="h-3 w-3" />
              </a>
              {' '}→ URI (direct connection)
            </p>
            <div className="space-y-3">
              <Input
                placeholder="postgresql://postgres:PASSWORD@db.dxlvx...supabase.co:5432/postgres"
                value={dbUrl}
                onChange={e => setDbUrl(e.target.value)}
                type="password"
              />
              <Button onClick={initDb} disabled={status['db'] === 'loading' || status['db'] === 'done'} className="w-full">
                {status['db'] === 'loading' ? 'Applying schema…' : status['db'] === 'done' ? '✅ Done!' : 'Apply Database Schema'}
              </Button>
              {messages['db'] && (
                <p className={`text-xs ${status['db'] === 'error' ? 'text-destructive' : 'text-green-600'}`}>{messages['db']}</p>
              )}
            </div>
          </div>

          {/* Step 2: Sign up */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Circle className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Step 2: Create Your Account</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Sign up at <Link href="/register" className="text-primary hover:underline">/register</Link> using your admin email.
              You only need to do this once.
            </p>
            <Link href="/register">
              <Button variant="outline" className="w-full">Go to Sign Up →</Button>
            </Link>
          </div>

          {/* Step 3: Make admin */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <StepIcon k="admin" />
              <h2 className="font-semibold">Step 3: Grant Admin Access</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the email you just signed up with to make it an admin account.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button onClick={makeAdmin} disabled={status['admin'] === 'loading' || status['admin'] === 'done'} className="w-full">
                {status['admin'] === 'loading' ? 'Granting admin…' : status['admin'] === 'done' ? '✅ Done!' : 'Make Admin'}
              </Button>
              {messages['admin'] && (
                <p className={`text-xs ${status['admin'] === 'error' ? 'text-destructive' : 'text-green-600'}`}>{messages['admin']}</p>
              )}
            </div>
          </div>

          {/* Step 4: Fix Supabase redirect */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Circle className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Step 4: Fix Supabase Redirect URL</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              You may have changed this — reset it to the correct value:
            </p>
            <ol className="text-sm space-y-2 mb-4">
              <li className="flex gap-2"><span className="text-primary font-bold">1.</span>
                Go to{' '}
                <a href="https://supabase.com/dashboard/project/dxlvxfsupjfkstufrjtb/auth/url-configuration"
                  target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1">
                  Supabase → Auth → URL Configuration <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li className="flex gap-2"><span className="text-primary font-bold">2.</span>
                Set <strong>Site URL</strong> to:{' '}
                <code className="bg-muted px-1 rounded text-xs">https://scootmart-ae.vercel.app</code>
              </li>
              <li className="flex gap-2"><span className="text-primary font-bold">3.</span>
                Add to <strong>Redirect URLs</strong>:{' '}
                <code className="bg-muted px-1 rounded text-xs">https://scootmart-ae.vercel.app/**</code>
              </li>
              <li className="flex gap-2"><span className="text-primary font-bold">4.</span>
                Click Save
              </li>
            </ol>
          </div>

          {/* Done */}
          <div className="rounded-2xl border border-green-200 bg-green-50 dark:bg-green-900/10 p-6 text-center">
            <p className="font-semibold text-green-700 dark:text-green-300 mb-2">🎉 After completing all steps:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Link href="/login"><Button>Sign In as Admin</Button></Link>
              <Link href="/admin"><Button variant="outline">Admin Dashboard</Button></Link>
              <Link href="/"><Button variant="outline">View Site</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
