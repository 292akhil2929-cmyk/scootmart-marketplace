import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { timeAgo } from '@/lib/utils'
import { DeleteSavedSearch } from '@/components/listings/DeleteSavedSearch'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Saved Searches – ScootMart.ae' }

export default async function SavedSearchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: searches } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Saved Searches</h1>
      <p className="text-muted-foreground text-sm mb-6">Re-run your saved filters instantly.</p>

      {searches && searches.length > 0 ? (
        <div className="space-y-3">
          {searches.map((search: any) => {
            const filters = search.filters as Record<string, unknown>
            const filterTags = Object.entries(filters)
              .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
              .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
            // Build browse URL from filters
            const params = new URLSearchParams()
            for (const [k, v] of Object.entries(filters)) {
              if (v !== undefined && v !== null && v !== '' && v !== false) {
                params.set(k, String(v))
              }
            }
            return (
              <div key={search.id} className="rounded-xl border bg-card p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{search.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">Saved {timeAgo(search.created_at)}</p>
                  <div className="flex flex-wrap gap-1">
                    {filterTags.slice(0, 6).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                    {filterTags.length > 6 && <Badge variant="outline" className="text-xs">+{filterTags.length - 6} more</Badge>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 flex-col">
                  <Link href={`/browse?${params.toString()}`}>
                    <Button size="sm">Search</Button>
                  </Link>
                  <DeleteSavedSearch id={search.id} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold text-lg mb-2">No saved searches</h3>
          <p className="text-muted-foreground mb-5">Apply filters on the browse page and save your search for quick access later.</p>
          <Link href="/browse"><Button>Browse Listings</Button></Link>
        </div>
      )}
    </div>
  )
}
