'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

const UAE_TAGS = [
  'great_heat_range',
  'handles_sand_well',
  'battery_lasts_in_heat',
  'rta_compliant',
  'worth_the_price',
  'fast_delivery',
  'as_described',
]

interface ReviewFormProps {
  listingId: string
  onSuccess?: () => void
}

export function ReviewForm({ listingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setError('Please select a rating'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId, rating, title, comment, uae_tested_tags: tags }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error ?? 'Failed to submit review'); return }
    setSuccess(true)
    onSuccess?.()
  }

  if (success) {
    return (
      <div className="rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 p-4 text-center">
        <div className="text-2xl mb-2">⭐</div>
        <p className="font-medium text-green-800 dark:text-green-200">Review submitted! Thank you.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-4 space-y-4">
      <h3 className="font-semibold">Leave a Review</h3>

      {/* Star rating */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Overall rating *</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
            >
              <Star className={`h-7 w-7 transition-colors ${s <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Title</label>
        <Input placeholder="Summarize your experience" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} />
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Review</label>
        <Textarea placeholder="Share your honest experience — especially for UAE conditions (heat, sand, battery life...)" value={comment} onChange={e => setComment(e.target.value)} rows={3} maxLength={1000} />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">UAE experience tags (optional)</p>
        <div className="flex flex-wrap gap-2">
          {UAE_TAGS.map(tag => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)}>
              <Badge variant={tags.includes(tag) ? 'default' : 'outline'} className="cursor-pointer text-xs">
                {tag.replace(/_/g, ' ')}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}
