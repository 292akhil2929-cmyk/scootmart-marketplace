import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { timeAgo } from '@/lib/utils'
import { Bell } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Notifications' }

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const markAllRead = async () => {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
      revalidatePath('/notifications')
    }
  }

  const unreadCount = notifications?.filter(n => !n.read).length ?? 0

  const typeIcons: Record<string, string> = {
    order_update: '📦',
    message: '💬',
    listing_approved: '✅',
    listing_rejected: '❌',
    review: '⭐',
    payment: '💰',
    dispute: '⚠️',
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-muted-foreground">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <form action={markAllRead}>
            <button type="submit" className="text-sm text-primary hover:underline">Mark all as read</button>
          </form>
        )}
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`rounded-xl border p-4 flex gap-3 transition-colors ${!n.read ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
              <div className="text-2xl shrink-0">{typeIcons[n.type] ?? '🔔'}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{n.title}</p>
                {n.body && <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>}
                <p className="text-xs text-muted-foreground mt-1">{timeAgo(n.created_at)}</p>
              </div>
              {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <h3 className="font-semibold mb-1">No notifications yet</h3>
          <p className="text-sm text-muted-foreground">We'll notify you about orders, messages, and listing updates</p>
        </div>
      )}
    </div>
  )
}
