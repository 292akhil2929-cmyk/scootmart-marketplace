'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { formatPrice, EMIRATES, BRANDS } from '@/lib/utils'

export function SearchFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const [filters, setFilters] = useState({
    type: params.get('type') ?? '',
    condition: params.get('condition') ?? '',
    brand: params.get('brand') ?? '',
    emirate: params.get('emirate') ?? '',
    minPrice: Number(params.get('min_price') ?? 0),
    maxPrice: Number(params.get('max_price') ?? 15000),
    minRange: Number(params.get('min_range') ?? 0),
    certified: params.get('certified_used') === 'true',
    rta: params.get('rta_compliant') === 'true',
    uaeTested: params.get('uae_tested') === 'true',
    sort: params.get('sort') ?? 'newest',
  })

  const apply = () => {
    const p = new URLSearchParams()
    if (params.get('q')) p.set('q', params.get('q')!)
    if (filters.type) p.set('type', filters.type)
    if (filters.condition) p.set('condition', filters.condition)
    if (filters.brand) p.set('brand', filters.brand)
    if (filters.emirate) p.set('emirate', filters.emirate)
    if (filters.minPrice > 0) p.set('min_price', String(filters.minPrice))
    if (filters.maxPrice < 15000) p.set('max_price', String(filters.maxPrice))
    if (filters.minRange > 0) p.set('min_range', String(filters.minRange))
    if (filters.certified) p.set('certified_used', 'true')
    if (filters.rta) p.set('rta_compliant', 'true')
    if (filters.uaeTested) p.set('uae_tested', 'true')
    if (filters.sort !== 'newest') p.set('sort', filters.sort)
    startTransition(() => { router.push(`/browse?${p.toString()}`) })
    setOpen(false)
  }

  const reset = () => {
    setFilters({ type: '', condition: '', brand: '', emirate: '', minPrice: 0, maxPrice: 15000, minRange: 0, certified: false, rta: false, uaeTested: false, sort: 'newest' })
    startTransition(() => { router.push('/browse') })
  }

  const activeCount = [filters.type, filters.condition, filters.brand, filters.emirate,
    filters.minPrice > 0, filters.maxPrice < 15000, filters.minRange > 0,
    filters.certified, filters.rta, filters.uaeTested].filter(Boolean).length

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Sort */}
      <Select value={filters.sort} onValueChange={v => { setFilters(f => ({ ...f, sort: v })); }}>
        <SelectTrigger className="w-40 h-9 text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price_asc">Price: Low–High</SelectItem>
          <SelectItem value="price_desc">Price: High–Low</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
          <SelectItem value="range">Best Range</SelectItem>
        </SelectContent>
      </Select>

      {/* Filters toggle */}
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)} className="gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeCount > 0 && <span className="ml-1 rounded-full bg-primary text-white text-xs w-4 h-4 flex items-center justify-center">{activeCount}</span>}
      </Button>

      {activeCount > 0 && (
        <Button variant="ghost" size="sm" onClick={reset} className="gap-1 text-muted-foreground">
          <X className="h-3 w-3" /> Clear all
        </Button>
      )}

      {/* Filter panel */}
      {open && (
        <div className="w-full border rounded-xl p-4 bg-card grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div className="space-y-1">
            <label className="text-xs font-medium">Type</label>
            <Select value={filters.type} onValueChange={v => setFilters(f => ({ ...f, type: v }))}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem value="scooter">Scooter</SelectItem>
                <SelectItem value="ebike">E-Bike</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Condition</label>
            <Select value={filters.condition} onValueChange={v => setFilters(f => ({ ...f, condition: v }))}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Brand</label>
            <Select value={filters.brand} onValueChange={v => setFilters(f => ({ ...f, brand: v }))}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All brands" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All brands</SelectItem>
                {BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Emirate</label>
            <Select value={filters.emirate} onValueChange={v => setFilters(f => ({ ...f, emirate: v }))}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All UAE" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All UAE</SelectItem>
                {EMIRATES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-xs font-medium">Price range: {formatPrice(filters.minPrice)} – {formatPrice(filters.maxPrice)}</label>
            <Slider min={0} max={15000} step={100} value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) => setFilters(f => ({ ...f, minPrice: min, maxPrice: max }))} />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-xs font-medium">Min UAE range (heat): {filters.minRange} km</label>
            <Slider min={0} max={120} step={5} value={[filters.minRange]}
              onValueChange={([v]) => setFilters(f => ({ ...f, minRange: v }))} />
          </div>

          <div className="col-span-2 md:col-span-4 flex flex-wrap gap-3 items-center">
            {[
              { key: 'certified', label: 'Certified Used', field: 'certified' as const },
              { key: 'rta', label: 'RTA Compliant', field: 'rta' as const },
              { key: 'uaeTested', label: 'UAE-Tested', field: 'uaeTested' as const },
            ].map(({ key, label, field }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={filters[field]} onChange={e => setFilters(f => ({ ...f, [field]: e.target.checked }))}
                  className="rounded border-input" />
                {label}
              </label>
            ))}
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={apply}>Apply Filters</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
