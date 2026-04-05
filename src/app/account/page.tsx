'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { EMIRATES, getInitials } from '@/lib/utils'
import { Camera } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    full_name: '', display_name: '', phone: '', whatsapp: '',
    location_emirate: '', location_area: '', bio: '', preferred_lang: 'en',
    avatar_url: '',
  })

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      supabase.from('profiles').select('*').eq('id', data.user.id).single()
        .then(({ data: p }) => {
          if (p) {
            setForm({
              full_name: p.full_name ?? '',
              display_name: p.display_name ?? '',
              phone: p.phone ?? '',
              whatsapp: p.whatsapp ?? '',
              location_emirate: p.location_emirate ?? '',
              location_area: p.location_area ?? '',
              bio: p.bio ?? '',
              preferred_lang: p.preferred_lang ?? 'en',
              avatar_url: p.avatar_url ?? '',
            })
          }
          setLoading(false)
        })
    })
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let avatarUrl = form.avatar_url
      if (avatarFile) {
        const { data } = await supabase.storage.from('avatars')
          .upload(`${user.id}/avatar-${Date.now()}`, avatarFile, { upsert: true })
        if (data) {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path)
          avatarUrl = publicUrl
        }
      }

      const { error } = await supabase.from('profiles').update({ ...form, avatar_url: avatarUrl }).eq('id', user.id)
      if (error) throw new Error(error.message)

      toast({ title: 'Profile updated!' })
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Loading…</div>

  const f = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value })),
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="space-y-5">
        {/* Avatar */}
        <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview ?? form.avatar_url} />
              <AvatarFallback className="text-xl">{getInitials(form.display_name || form.full_name || '?')}</AvatarFallback>
            </Avatar>
            <button onClick={() => document.getElementById('avatar-input')?.click()}
              className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow">
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input id="avatar-input" type="file" accept="image/*" className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)) }
              }} />
          </div>
          <div>
            <p className="font-semibold">{form.display_name || form.full_name || 'Your Name'}</p>
            <p className="text-sm text-muted-foreground">Click the camera to update your photo</p>
          </div>
        </div>

        {/* Personal info */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name</label>
              <Input {...f('full_name')} placeholder="Ahmed Al Rashidi" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Display Name</label>
              <Input {...f('display_name')} placeholder="Ahmed Scooters" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Phone</label>
              <Input {...f('phone')} placeholder="+971 50 123 4567" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">WhatsApp</label>
              <Input {...f('whatsapp')} placeholder="+971 50 123 4567" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Emirate</label>
              <Select value={form.location_emirate} onValueChange={v => setForm(p => ({ ...p, location_emirate: v }))}>
                <SelectTrigger><SelectValue placeholder="Select emirate" /></SelectTrigger>
                <SelectContent>{EMIRATES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Area</label>
              <Input {...f('location_area')} placeholder="Al Quoz, JBR…" />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Bio</label>
              <Textarea {...f('bio')} rows={3} placeholder="Tell buyers about yourself or your shop…" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Language</label>
              <Select value={form.preferred_lang} onValueChange={v => setForm(p => ({ ...p, preferred_lang: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </div>
    </div>
  )
}
