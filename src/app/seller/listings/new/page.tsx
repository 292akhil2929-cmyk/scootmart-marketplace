'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { EMIRATES, BRANDS } from '@/lib/utils'
import { Upload, ChevronRight } from 'lucide-react'

const STEPS = ['Basic Info', 'Specs', 'Images & Docs', 'Review']

export default function NewListingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const [form, setForm] = useState({
    title: '', description: '', type: 'scooter', condition: 'new',
    brand: '', model: '', year: new Date().getFullYear(), color: '',
    price: '', original_price: '', location_emirate: '', location_area: '',
    rta_compliant: false, certified_used: false, uae_tested: false,
  })

  const [specs, setSpecs] = useState({
    range_km: '', range_km_uae_heat: '', top_speed_kmh: '', battery_kwh: '',
    motor_watts: '', weight_kg: '', max_rider_weight_kg: '', hill_climb_degrees: '',
    ip_rating: '', charging_time_hours: '', heat_performance_note: '', warranty_months: '',
    rta_permit_included: false,
  })

  const supabase = createClient()

  const uploadImages = async (files: File[]) => {
    const urls: string[] = []
    for (const file of files) {
      const path = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from('listing-images').upload(path, file)
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(data.path)
        urls.push(publicUrl)
      }
    }
    return urls
  }

  const submit = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      let uploadedUrls = imageUrls
      if (images.length > 0) uploadedUrls = await uploadImages(images)

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          original_price: form.original_price ? Number(form.original_price) : null,
          year: Number(form.year),
          images: uploadedUrls,
          specs: {
            ...specs,
            range_km: specs.range_km ? Number(specs.range_km) : null,
            range_km_uae_heat: specs.range_km_uae_heat ? Number(specs.range_km_uae_heat) : null,
            top_speed_kmh: specs.top_speed_kmh ? Number(specs.top_speed_kmh) : null,
            battery_kwh: specs.battery_kwh ? Number(specs.battery_kwh) : null,
            motor_watts: specs.motor_watts ? Number(specs.motor_watts) : null,
            weight_kg: specs.weight_kg ? Number(specs.weight_kg) : null,
            max_rider_weight_kg: specs.max_rider_weight_kg ? Number(specs.max_rider_weight_kg) : null,
            hill_climb_degrees: specs.hill_climb_degrees ? Number(specs.hill_climb_degrees) : null,
            charging_time_hours: specs.charging_time_hours ? Number(specs.charging_time_hours) : null,
            warranty_months: specs.warranty_months ? Number(specs.warranty_months) : null,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast({ title: 'Listing submitted!', description: 'Under review — usually approved within 24 hours.' })
      router.push('/seller/dashboard')
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const f = (field: keyof typeof form) => ({
    value: form[field] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }))
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">List an Item</h1>
      <p className="text-muted-foreground mb-6">Fill in the details to create your listing</p>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
            <p className={`text-xs mt-1 text-center ${i === step ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{s}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">Listing Title *</label>
                <Input {...f('title')} placeholder="e.g. Segway Ninebot Max G2 – Dubai Edition" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Type *</label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scooter">Electric Scooter</SelectItem>
                    <SelectItem value="ebike">E-Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Condition *</label>
                <Select value={form.condition} onValueChange={v => setForm(p => ({ ...p, condition: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Brand *</label>
                <Select value={form.brand} onValueChange={v => setForm(p => ({ ...p, brand: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>{BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Model *</label>
                <Input {...f('model')} placeholder="e.g. Ninebot Max G2" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Price (AED) *</label>
                <Input {...f('price')} type="number" placeholder="3299" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Original Price (AED)</label>
                <Input {...f('original_price')} type="number" placeholder="3599" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Emirate *</label>
                <Select value={form.location_emirate} onValueChange={v => setForm(p => ({ ...p, location_emirate: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select emirate" /></SelectTrigger>
                  <SelectContent>{EMIRATES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Area</label>
                <Input {...f('location_area')} placeholder="e.g. Al Quoz, JBR" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">Description</label>
                <textarea {...f('description')} rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Describe your item, usage history, UAE-specific notes..." />
              </div>
              <div className="col-span-2 flex flex-wrap gap-4">
                {[
                  { field: 'rta_compliant', label: 'RTA Compliant' },
                  { field: 'certified_used', label: 'Certified Used (inspection report required)' },
                  { field: 'uae_tested', label: 'UAE-Tested' },
                ].map(({ field, label }) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={form[field as keyof typeof form] as boolean}
                      onChange={e => setForm(p => ({ ...p, [field]: e.target.checked }))} className="rounded" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { field: 'range_km', label: 'Claimed Range (km)', placeholder: '70' },
              { field: 'range_km_uae_heat', label: '🌡️ Real UAE Heat Range (km)', placeholder: '48' },
              { field: 'top_speed_kmh', label: 'Top Speed (km/h)', placeholder: '25' },
              { field: 'motor_watts', label: 'Motor Power (W)', placeholder: '700' },
              { field: 'battery_kwh', label: 'Battery (kWh)', placeholder: '0.551' },
              { field: 'charging_time_hours', label: 'Charging Time (hours)', placeholder: '6' },
              { field: 'weight_kg', label: 'Weight (kg)', placeholder: '23.5' },
              { field: 'max_rider_weight_kg', label: 'Max Rider Weight (kg)', placeholder: '150' },
              { field: 'hill_climb_degrees', label: 'Hill Climb (degrees)', placeholder: '25' },
              { field: 'ip_rating', label: 'IP Rating', placeholder: 'IP56' },
              { field: 'warranty_months', label: 'Warranty (months)', placeholder: '12' },
            ].map(({ field, label, placeholder }) => (
              <div key={field} className="space-y-1">
                <label className="text-sm font-medium">{label}</label>
                <Input value={specs[field as keyof typeof specs] as string}
                  onChange={e => setSpecs(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={placeholder} />
              </div>
            ))}
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">UAE Heat Performance Note</label>
              <textarea
                value={specs.heat_performance_note}
                onChange={e => setSpecs(p => ({ ...p, heat_performance_note: e.target.value }))}
                rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Describe real-world performance in Dubai/Abu Dhabi heat conditions..." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => document.getElementById('image-upload')?.click()}>
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Upload Images</p>
              <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP — max 10MB each. First image is the cover.</p>
              <input id="image-upload" type="file" multiple accept="image/*" className="hidden"
                onChange={e => {
                  const files = Array.from(e.target.files ?? [])
                  setImages(files)
                  setImageUrls(files.map(f => URL.createObjectURL(f)))
                }} />
            </div>
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {imageUrls.map((url, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && <span className="absolute top-1 left-1 text-xs bg-primary text-white rounded px-1">Cover</span>}
                  </div>
                ))}
              </div>
            )}
            {form.certified_used && (
              <div className="rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20 p-4">
                <p className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">Inspection Report Required</p>
                <p className="text-xs text-purple-700 dark:text-purple-300">Upload battery health report and mechanic inspection PDF. Or pay AED 199 for a ScootMart partner inspection.</p>
                <Button size="sm" variant="outline" className="mt-2">Upload Inspection PDF</Button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Review your listing</h3>
            <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Title</span><span className="font-medium">{form.title}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="capitalize">{form.type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Condition</span><span className="capitalize">{form.condition}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Brand/Model</span><span>{form.brand} {form.model}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-bold text-primary">AED {form.price}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{form.location_emirate}, {form.location_area}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Images</span><span>{imageUrls.length} photo(s)</span></div>
            </div>
            <div className="rounded-lg bg-primary/5 p-3 text-sm">
              Your listing will go live after our team reviews it (usually within 24 hours). ScootMart charges <strong>8–12% commission</strong> only on successful sales.
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>Back</Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} className="gap-1">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={saving}>{saving ? 'Submitting…' : 'Submit Listing'}</Button>
        )}
      </div>
    </div>
  )
}
