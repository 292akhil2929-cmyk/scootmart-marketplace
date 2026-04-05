'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-semibold text-lg mb-2">Message sent!</h2>
        <p className="text-muted-foreground">We'll reply to <strong>{form.email}</strong> within 4 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-6 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Name</label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Subject</label>
        <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: v }))}>
          <SelectTrigger><SelectValue placeholder="What's this about?" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="order_issue">Order issue</SelectItem>
            <SelectItem value="payment">Payment question</SelectItem>
            <SelectItem value="listing">Listing help</SelectItem>
            <SelectItem value="account">Account problem</SelectItem>
            <SelectItem value="seller_verify">Seller verification</SelectItem>
            <SelectItem value="report">Report a listing</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Message</label>
        <Textarea
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Describe your issue in detail. Include order IDs if relevant."
          rows={5}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}
