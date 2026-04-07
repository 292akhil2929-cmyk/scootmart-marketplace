import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Vendors — Admin' }

export default async function AdminVendorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: vendors } = await supabase
    .from('profiles')
    .select('*, listings:listings(count)')
    .eq('role', 'seller')
    .order('created_at', { ascending: false })

  const approveVendor = async (id: string) => {
    'use server'
    const supabase = await createClient()
    await supabase.from('profiles').update({ verified_badge: true }).eq('id', id)
    revalidatePath('/admin/vendors')
  }

  const suspendVendor = async (id: string) => {
    'use server'
    const supabase = await createClient()
    await supabase.from('profiles').update({ verified_badge: false }).eq('id', id)
    revalidatePath('/admin/vendors')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Header */}
      <div className="bg-[#1d1d1f] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">Admin</Link>
            <span className="text-white/20">/</span>
            <span className="text-white text-sm">Vendors</span>
          </div>
          <h1 className="text-3xl font-black text-white">Vendor Management</h1>
          <p className="text-white/40 mt-1">Approve, verify and manage UAE scooter vendors</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Vendors', value: vendors?.length ?? 0, color: 'text-[#1d1d1f]' },
            { label: 'Verified', value: vendors?.filter(v => v.verified_badge).length ?? 0, color: 'text-emerald-600' },
            { label: 'Unverified', value: vendors?.filter(v => !v.verified_badge).length ?? 0, color: 'text-orange-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-black/5">
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-sm text-[#6e6e73] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Vendors table */}
        <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
          <div className="p-5 border-b border-black/5">
            <h2 className="font-bold text-[#1d1d1f]">All Vendors</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f5f7] border-b border-black/5">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Vendor</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Email</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Listings</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Status</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Joined</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors?.map(vendor => (
                  <tr key={vendor.id} className="border-b border-black/3 hover:bg-[#f9f9fb] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {(vendor.display_name ?? vendor.full_name ?? '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-[#1d1d1f]">{vendor.display_name ?? vendor.full_name ?? 'Unknown'}</div>
                          <div className="text-xs text-[#6e6e73]">{vendor.location_emirate ?? 'UAE'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#6e6e73]">{vendor.email ?? '—'}</td>
                    <td className="p-4 font-semibold text-[#1d1d1f]">
                      {(vendor.listings as any)?.[0]?.count ?? 0}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        vendor.verified_badge
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}>
                        {vendor.verified_badge ? '✓ Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-[#6e6e73] text-xs">
                      {vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/sellers/${vendor.id}`} className="text-xs text-[#0071e3] hover:underline font-medium">View</Link>
                        {!vendor.verified_badge ? (
                          <form action={approveVendor.bind(null, vendor.id)}>
                            <button type="submit" className="text-xs text-emerald-600 hover:underline font-semibold">Verify</button>
                          </form>
                        ) : (
                          <form action={suspendVendor.bind(null, vendor.id)}>
                            <button type="submit" className="text-xs text-red-500 hover:underline font-medium">Unverify</button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {(!vendors || vendors.length === 0) && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-[#6e6e73]">No vendors yet</td>
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
