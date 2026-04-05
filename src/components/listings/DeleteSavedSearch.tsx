'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function DeleteSavedSearch({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    await fetch(`/api/saved-searches?id=${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <Button size="sm" variant="ghost" className="text-destructive" onClick={handleDelete} disabled={loading}>
      {loading ? '...' : 'Delete'}
    </Button>
  )
}
