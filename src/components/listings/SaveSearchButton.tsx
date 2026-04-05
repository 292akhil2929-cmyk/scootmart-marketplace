'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bookmark, Check, X } from 'lucide-react'

export function SaveSearchButton() {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Only show if there are active filters
  const hasFilters = Array.from(searchParams.entries()).some(([k]) => k !== 'page')
  if (!hasFilters) return null

  const handleSave = async () => {
    if (!name.trim()) return
    setLoading(true)
    const filters: Record<string, string> = {}
    searchParams.forEach((v, k) => { if (k !== 'page') filters[k] = v })
    const res = await fetch('/api/saved-searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), filters }),
    })
    setLoading(false)
    if (res.ok) {
      setSaved(true)
      setOpen(false)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (saved) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
        <Check className="h-4 w-4" /> Search saved!
      </div>
    )
  }

  if (open) {
    return (
      <div className="flex items-center gap-2">
        <Input
          placeholder="Name this search..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="h-8 text-sm w-48"
          autoFocus
        />
        <Button size="sm" onClick={handleSave} disabled={loading || !name.trim()}>
          {loading ? '...' : 'Save'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="gap-2">
      <Bookmark className="h-4 w-4" /> Save Search
    </Button>
  )
}
