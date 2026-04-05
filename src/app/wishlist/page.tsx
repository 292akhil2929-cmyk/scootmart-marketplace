import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/listings/ListingCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Listing } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Wishlist' }

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('wishlists')
    .select('listing:listings(*, seller:profiles(*), specs:listing_specs(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const listings = (data?.map((w: any) => ({ ...w.listing, is_wishlisted: true })) ?? []) as Listing[]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      {listings.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">❤️</div>
          <h3 className="font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-4">Save listings by tapping the heart icon</p>
          <Link href="/browse"><Button>Browse Listings</Button></Link>
        </div>
      )}
    </div>
  )
}
