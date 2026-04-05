'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { ShieldCheck, Upload } from 'lucide-react'

export default function SellerVerifyPage() {
  const router = useRouter()
  const [type, setType] = useState<'individual' | 'shop' | 'importer'>('individual')
  const [businessName, setBusinessName] = useState('')
  const [businessAddress, setBusinessAddress] = useState('')
  const [trnNumber, setTrnNumber] = useState('')
  const [emiratesIdFile, setEmiratesIdFile] = useState<File | null>(null)
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const supabase = createClient()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      let emiratesIdUrl: string | null = null
      let tradeLicenseUrl: string | null = null

      if (emiratesIdFile) {
        const { data } = await supabase.storage.from('verification-docs')
          .upload(`${user.id}/emirates-id-${Date.now()}`, emiratesIdFile)
        if (data) {
          const { data: { publicUrl } } = supabase.storage.from('verification-docs').getPublicUrl(data.path)
          emiratesIdUrl = publicUrl
        }
      }

      if (tradeLicenseFile) {
        const { data } = await supabase.storage.from('verification-docs')
          .upload(`${user.id}/trade-license-${Date.now()}`, tradeLicenseFile)
        if (data) {
          const { data: { publicUrl } } = supabase.storage.from('verification-docs').getPublicUrl(data.path)
          tradeLicenseUrl = publicUrl
        }
      }

      const { error } = await supabase.from('seller_verifications').insert({
        seller_id: user.id,
        type,
        business_name: businessName || null,
        business_address: businessAddress || null,
        trn_number: trnNumber || null,
        emirates_id_url: emiratesIdUrl,
        trade_license_url: tradeLicenseUrl,
        status: 'pending',
      })

      if (error) throw new Error(error.message)

      toast({ title: 'Verification submitted!', description: 'We\'ll review your documents within 1–2 business days.' })
      router.push('/seller/dashboard')
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Get Verified Seller Badge</h1>
        <p className="text-muted-foreground text-sm">Verified sellers get a blue badge, higher visibility, and more buyer trust. Average review time: 1–2 business days.</p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold">Seller Type</h2>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'individual', label: 'Individual', icon: '👤', desc: 'Personal seller' },
              { value: 'shop', label: 'Shop', icon: '🏪', desc: 'Retail business' },
              { value: 'importer', label: 'Importer', icon: '🚢', desc: 'Official importer' },
            ] as const).map(opt => (
              <button key={opt.value} type="button" onClick={() => setType(opt.value)}
                className={`rounded-xl border-2 p-3 text-center transition-colors ${type === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
                <div className="text-2xl mb-1">{opt.icon}</div>
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold">Identity Documents</h2>

          <div className="space-y-1">
            <label className="text-sm font-medium">Emirates ID (required for all)</label>
            <div className="border-2 border-dashed rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-primary transition-colors"
              onClick={() => document.getElementById('eid-upload')?.click()}>
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{emiratesIdFile ? emiratesIdFile.name : 'Upload Emirates ID photo/scan'}</p>
                <p className="text-xs text-muted-foreground">JPEG, PNG, PDF · Max 10MB</p>
              </div>
              <input id="eid-upload" type="file" accept="image/*,application/pdf" className="hidden"
                onChange={e => setEmiratesIdFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>

          {(type === 'shop' || type === 'importer') && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium">Trade License (required for shops/importers)</label>
                <div className="border-2 border-dashed rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => document.getElementById('tl-upload')?.click()}>
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{tradeLicenseFile ? tradeLicenseFile.name : 'Upload Trade License'}</p>
                    <p className="text-xs text-muted-foreground">JPEG, PNG, PDF · Max 10MB</p>
                  </div>
                  <input id="tl-upload" type="file" accept="image/*,application/pdf" className="hidden"
                    onChange={e => setTradeLicenseFile(e.target.files?.[0] ?? null)} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Business Name</label>
                <Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. Ahmed Scooters LLC" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Business Address</label>
                <Input value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} placeholder="Warehouse 12, Al Quoz, Dubai" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">TRN Number (optional)</label>
                <Input value={trnNumber} onChange={e => setTrnNumber(e.target.value)} placeholder="100XXXXXXXXX003" />
              </div>
            </>
          )}
        </div>

        <div className="rounded-lg bg-muted p-4 text-xs text-muted-foreground">
          Your documents are encrypted and stored securely. They are only viewed by ScootMart's verification team and are never shared with buyers or third parties.
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={submitting || !emiratesIdFile}>
          {submitting ? 'Submitting…' : 'Submit for Verification'}
        </Button>
      </form>
    </div>
  )
}
