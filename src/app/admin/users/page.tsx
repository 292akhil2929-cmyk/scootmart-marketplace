import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'
import { timeAgo } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'User Management – ScootMart.ae' }

async function updateRole(userId: string, role: string) {
  'use server'
  const supabase = await createClient()
  await supabase.from('profiles').update({ role }).eq('id', userId)
  revalidatePath('/admin/users')
}

async function banUser(userId: string) {
  'use server'
  const supabase = await createAdminClient()
  await supabase.auth.admin.updateUserById(userId, { ban_duration: '876600h' }) // 100 years
  revalidatePath('/admin/users')
}

async function unbanUser(userId: string) {
  'use server'
  const supabase = await createAdminClient()
  await supabase.auth.admin.updateUserById(userId, { ban_duration: 'none' })
  revalidatePath('/admin/users')
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const roleColors: Record<string, string> = {
    admin: 'destructive',
    seller: 'default',
    buyer: 'secondary',
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">{(profiles ?? []).length} users</p>
        </div>
        <Link href="/admin" className="ml-auto text-sm text-muted-foreground hover:text-foreground">← Back to Admin</Link>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {['User', 'Role', 'Verified', 'Joined', 'Listings', 'Rating', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium text-xs text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p: any) => (
              <tr key={p.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-xs">{p.display_name ?? p.full_name ?? 'Unnamed'}</p>
                    <p className="text-xs text-muted-foreground font-mono">{p.id.slice(0, 8)}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={(roleColors[p.role] ?? 'secondary') as any} className="text-xs capitalize">{p.role}</Badge>
                </td>
                <td className="px-4 py-3 text-xs">
                  {p.verified_badge ? <span className="text-blue-600">✓ Yes</span> : <span className="text-muted-foreground">No</span>}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{timeAgo(p.created_at)}</td>
                <td className="px-4 py-3 text-xs">{p.total_listings ?? 0}</td>
                <td className="px-4 py-3 text-xs">{p.rating > 0 ? `${p.rating.toFixed(1)} ⭐` : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {p.role !== 'admin' && p.id !== user.id && (
                      <>
                        {p.role === 'buyer' && (
                          <form action={updateRole.bind(null, p.id, 'seller')}>
                            <Button size="sm" variant="outline" type="submit" className="h-7 text-xs">Make Seller</Button>
                          </form>
                        )}
                        {p.role === 'seller' && (
                          <form action={updateRole.bind(null, p.id, 'buyer')}>
                            <Button size="sm" variant="outline" type="submit" className="h-7 text-xs">Revoke Seller</Button>
                          </form>
                        )}
                        <form action={banUser.bind(null, p.id)}>
                          <Button size="sm" variant="destructive" type="submit" className="h-7 text-xs">Ban</Button>
                        </form>
                      </>
                    )}
                    {p.id === user.id && <span className="text-xs text-muted-foreground">You</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
