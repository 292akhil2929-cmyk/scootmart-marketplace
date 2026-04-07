import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Scooters — Admin' }

export default async function AdminScootersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: listings } = await supabase
    .from('listings')
    .select('*, seller:profiles(display_name, full_name, email)')
    .order('created_at', { ascending: false })
    .limit(50)

  const stats = {
    total: listings?.length ?? 0,
    active: listings?.filter(l => l.status === 'active').length ?? 0,
    pending: listings?.filter(l => l.status === 'pending_review').length ?? 0,
    sold: listings?.filter(l => l.status === 'sold').length ?? 0,
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Header */}
      <div className="bg-[#1d1d1f] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">Admin</Link>
            <span className="text-white/20">/</span>
            <span className="text-white text-sm">Scooters</span>
          </div>
          <h1 className="text-3xl font-black text-white">Scooter Listings</h1>
          <p className="text-white/40 mt-1">Manage all product listings on ScootMart</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Listings', value: stats.total, color: 'text-[#1d1d1f]' },
            { label: 'Active', value: stats.active, color: 'text-emerald-600' },
            { label: 'Pending Review', value: stats.pending, color: 'text-orange-500' },
            { label: 'Sold', value: stats.sold, color: 'text-blue-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-black/5">
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-sm text-[#6e6e73] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Listings table */}
        <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
          <div className="p-5 border-b border-black/5 flex items-center justify-between">
            <h2 className="font-bold text-[#1d1d1f]">All Listings</h2>
            <Link href="/seller/listings/new" className="bg-[#1d1d1f] text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-black transition-colors">
              + Add Listing
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f5f7] border-b border-black/5">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Product</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Seller</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Price</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Status</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Views</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings?.map(listing => (
                  <tr key={listing.id} className="border-b border-black/3 hover:bg-[#f9f9fb] transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-[#1d1d1f] max-w-[200px] truncate">{listing.title}</div>
                      <div className="text-xs text-[#6e6e73] mt-0.5">{listing.brand ?? 'Unknown'} · {listing.type}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-[#1d1d1f]">{(listing.seller as any)?.display_name ?? (listing.seller as any)?.full_name ?? 'Unknown'}</div>
                    </td>
                    <td className="p-4 font-bold text-[#1d1d1f]">AED {listing.price?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        listing.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                        listing.status === 'pending_review' ? 'bg-orange-50 text-orange-700' :
                        listing.status === 'sold' ? 'bg-blue-50 text-blue-700' :
                        'bg-[#f5f5f7] text-[#6e6e73]'
                      }`}>
                        {listing.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-[#6e6e73]">{listing.view_count ?? 0}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/listings/${listing.id}`} className="text-xs text-[#0071e3] hover:underline font-medium">View</Link>
                        <Link href={`/seller/listings/${listing.id}/edit`} className="text-xs text-[#6e6e73] hover:text-[#1d1d1f] font-medium">Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!listings || listings.length === 0) && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-[#6e6e73]">No listings yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
