'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { EMIRATES, BRANDS } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

export default function EditListingPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  useEffect(() => {
    const supabase = createClient()
    supabase.from('listings')
      .select('*, specs:listing_specs(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (!data) { router.push('/seller/dashboard'); return }
        setForm({
          title: data.title ?? '',
          description: data.description ?? '',
          type: data.type,
          condition: data.condition,
          brand: data.brand,
          model: data.model,
          year: data.year ?? new Date().getFullYear(),
          color: data.color ?? '',
          price: String(data.price),
          original_price: data.original_price ? String(data.original_price) : '',
          location_emirate: data.location_emirate ?? '',
          location_area: data.location_area ?? '',
          rta_compliant: data.rta_compliant,
          certified_used: data.certified_used,
          uae_tested: data.uae_tested,
        })
        if (data.specs) {
          const s = data.specs
          setSpecs({
            range_km: s.range_km ? String(s.range_km) : '',
            range_km_uae_heat: s.range_km_uae_heat ? String(s.range_km_uae_heat) : '',
            top_speed_kmh: s.top_speed_kmh ? String(s.top_speed_kmh) : '',
            battery_kwh: s.battery_kwh ? String(s.battery_kwh) : '',
            motor_watts: s.motor_watts ? String(s.motor_watts) : '',
            weight_kg: s.weight_kg ? String(s.weight_kg) : '',
            max_rider_weight_kg: s.max_rider_weight_kg ? String(s.max_rider_weight_kg) : '',
            hill_climb_degrees: s.hill_climb_degrees ? String(s.hill_climb_degrees) : '',
            ip_rating: s.ip_rating ?? '',
            charging_time_hours: s.charging_time_hours ? String(s.charging_time_hours) : '',
            heat_performance_note: s.heat_performance_note ?? '',
            warranty_months: s.warranty_months ? String(s.warranty_months) : '',
            rta_permit_included: s.rta_permit_included ?? false,
          })
        }
        setLoading(false)
      })
  }, [id])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          original_price: form.original_price ? Number(form.original_price) : null,
          year: Number(form.year),
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
      toast({ title: 'Listing updated', description: 'Submitted for review.' })
      router.push('/seller/dashboard')
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const deleteListing = async () => {
    if (!confirm('Archive this listing? It will no longer be visible to buyers.')) return
    setDeleting(true)
    await fetch(`/api/listings/${id}`, { method: 'DELETE' })
    toast({ title: 'Listing archived' })
    router.push('/seller/dashboard')
  }

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Loading…</div>

  const field = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value })),
  })

  const specField = (key: keyof typeof specs) => ({
    value: specs[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setSpecs(p => ({ ...p, [key]: e.target.value })),
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Listing</h1>
        <Button variant="destructive" size="sm" onClick={deleteListing} disabled={deleting} className="gap-2">
          <Trash2 className="h-4 w-4" /> Archive
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Title</label>
              <Input {...field('title')} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Type</label>
              <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="scooter">Electric Scooter</SelectItem>
                  <SelectItem value="ebike">E-Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Condition</label>
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
              <label className="text-sm font-medium">Brand</label>
              <Select value={form.brand} onValueChange={v => setForm(p => ({ ...p, brand: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Model</label>
              <Input {...field('model')} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Price (AED)</label>
              <Input {...field('price')} type="number" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Original Price (AED)</label>
              <Input {...field('original_price')} type="number" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Emirate</label>
              <Select value={form.location_emirate} onValueChange={v => setForm(p => ({ ...p, location_emirate: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EMIRATES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Area</label>
              <Input {...field('location_area')} />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Textarea {...field('description')} rows={4} />
            </div>
            <div className="col-span-2 flex flex-wrap gap-4">
              {[
                { key: 'rta_compliant', label: 'RTA Compliant' },
                { key: 'certified_used', label: 'Certified Used' },
                { key: 'uae_tested', label: 'UAE-Tested' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox"
                    checked={form[key as keyof typeof form] as boolean}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                    className="rounded" />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold">Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'range_km', label: 'Claimed Range (km)' },
              { key: 'range_km_uae_heat', label: '🌡️ UAE Heat Range (km)' },
              { key: 'top_speed_kmh', label: 'Top Speed (km/h)' },
              { key: 'motor_watts', label: 'Motor Power (W)' },
              { key: 'battery_kwh', label: 'Battery (kWh)' },
              { key: 'charging_time_hours', label: 'Charging Time (h)' },
              { key: 'weight_kg', label: 'Weight (kg)' },
              { key: 'max_rider_weight_kg', label: 'Max Rider Weight (kg)' },
              { key: 'hill_climb_degrees', label: 'Hill Climb (°)' },
              { key: 'ip_rating', label: 'IP Rating' },
              { key: 'warranty_months', label: 'Warranty (months)' },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <label className="text-sm font-medium">{label}</label>
                <Input {...specField(key as keyof typeof specs)} />
              </div>
            ))}
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">UAE Heat Performance Note</label>
              <Textarea
                value={specs.heat_performance_note}
                onChange={e => setSpecs(p => ({ ...p, heat_performance_note: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => router.push('/seller/dashboard')}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </div>
    </div>
  )
}
