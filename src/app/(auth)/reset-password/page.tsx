'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setDone(true)
    setTimeout(() => router.push('/'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white"><Zap className="h-5 w-5" /></div>
            <span><span className="text-primary">Scoot</span>Mart.ae</span>
          </Link>
          <h1 className="text-xl font-semibold">Set new password</h1>
        </div>

        <div className="bg-background rounded-2xl border p-6 shadow-sm">
          {done ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="font-semibold mb-2">Password updated!</h2>
              <p className="text-sm text-muted-foreground">Redirecting you to the homepage…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">{error}</div>}
              <div className="space-y-1">
                <label className="text-sm font-medium">New password</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Confirm password</label>
                <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
